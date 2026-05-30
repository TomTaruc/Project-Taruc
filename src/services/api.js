import { supabase } from './supabase';

export const api = {
  // --- Auth & Profile Services ---
  auth: {
    login: async ({ email, password }) => {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;

      // 2. Safely attempt to fetch the custom profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      // 3. Fallback mechanism: If the custom users table fetch fails, don't break the app
      const userProfile = profile || { 
        id: authData.user.id, 
        email: authData.user.email, 
        name: authData.user.user_metadata?.name || 'User',
        role: 'user' 
      };

      return { user: userProfile, session: authData.session };
    },

    register: async (userData) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { name: userData.name }
        }
      });
      
      if (authError) throw authError;

      // Try to insert into public users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: 'supabase_managed', 
          phone: userData.phone || null,
          role: userData.role || 'user' // FIX: Uses the role passed from Register.jsx
        }])
        .select()
        .single();

      const userProfile = profile || { 
        id: authData.user.id, 
        email: authData.user.email, 
        name: userData.name,
        role: userData.role || 'user' // FIX: Ensures profile object uses the correct role
      };

      return { user: userProfile, session: authData.session };
    },

    getProfile: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
        
      return profile || { id: user.id, email: user.email, name: user.user_metadata?.name || 'User', role: 'user' };
    },

    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  // --- Appointments Services ---
  appointments: {
    getUserAppointments: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_email', profile.email) // Safer fallback to email if IDs mismatch
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },

    create: async (appointmentData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();

      if (error) throw error;
      return data[0];
    },

    getAllAdmin: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },

    updateStatus: async (id, status) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    }
  },

  // --- Client Records Services ---
  clientRecords: {
    getUserRecords: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('client_records')
        .select('*')
        .eq('client_name', profile.name) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  },

  // --- Announcements Services ---
  announcements: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  },

  // --- Inquiries Services ---
  inquiries: {
    create: async (inquiryData) => {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiryData])
        .select();

      if (error) throw error;
      return data[0];
    },

    getAllAdmin: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    updateStatus: async (id, status, response = null) => {
      const { data, error } = await supabase
        .from('inquiries')
        .update({ 
          status, 
          response, 
          responded_at: response ? new Date().toISOString() : null 
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    }
  },

  // --- Notifications Services ---
  notifications: {
    getUserNotifications: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        // Using email or a generic fetch to prevent RLS/ID blocking for now
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter locally to ensure it matches the user safely
      return data.filter(n => n.user_id === profile.id || !n.user_id);
    },

    markAsRead: async (id) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    }
  },

  // --- Counselor Roster Services ---
  counselors: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('counselor_roster')
        .select('*');

      if (error) throw error;
      return data;
    }
  }
};