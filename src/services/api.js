import { supabase } from './supabase';

export const api = {
  // --- Auth & Profile Services ---
  auth: {
    login: async ({ email, password }) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError) throw profileError;
      return { user: profile, session: authData.session };
    },

    register: async (userData) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: 'supabase_managed', 
          phone: userData.phone || null,
          role: 'user'
        }])
        .select()
        .single();

      if (profileError) throw profileError;
      return { user: profile, session: authData.session };
    },

    getProfile: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
        
      return profile || user;
    },

    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  // --- Appointments Services ---
  appointments: {
    // User method: Get only their own appointments
    getUserAppointments: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', profile.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },

    // User method: Create a new appointment
    create: async (appointmentData) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();

      if (error) throw error;
      return data[0];
    },

    // Admin method: Get all appointments in the system
    getAllAdmin: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },

    // Admin method: Update the status of an appointment
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
        .eq('client_id', profile.id)
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
    // Public method: Anyone can submit a contact form
    create: async (inquiryData) => {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiryData])
        .select();

      if (error) throw error;
      return data[0];
    },

    // Admin method: Get all inquiries
    getAllAdmin: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },

    // Admin method: Resolve an inquiry
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
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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