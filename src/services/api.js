import { supabase } from './supabase';

export const api = {
  auth: {
    login: async ({ email, password }) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      const userProfile = profile || {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || 'User',
        role: 'user',
      };

      return { user: userProfile, session: authData.session };
    },

    register: async (userData) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: { data: { name: userData.name } },
      });
      if (authError) throw authError;

      const { data: profile } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          password: 'supabase_managed',
          phone: userData.phone || null,
          role: userData.role || 'user',
        }])
        .select()
        .single();

      const userProfile = profile || {
        id: authData.user.id,
        email: authData.user.email,
        name: userData.name,
        role: userData.role || 'user',
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
    },
  },

  appointments: {
    getUserAppointments: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_email', profile.email)
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
    },
  },

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
    },

    getAllAdmin: async () => {
      const { data, error } = await supabase
        .from('client_records')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },

    create: async (recordData) => {
      const { data, error } = await supabase
        .from('client_records')
        .insert([recordData])
        .select();
      if (error) throw error;
      return data[0];
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('client_records')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    },

    getFollowUps: async () => {
      const { data, error } = await supabase
        .from('client_records')
        .select('*')
        .eq('follow_up_required', true)
        .order('follow_up_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  },

  announcements: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },

    create: async (announcementData) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcementData])
        .select();
      if (error) throw error;
      return data[0];
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  inquiries: {
    create: async (inquiryData) => {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([inquiryData])
        .select();
      if (error) throw error;
      return data[0];
    },

    getUserInquiries: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('email', profile.email)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
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
          responded_at: response ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    },
  },

  notifications: {
    getUserNotifications: async () => {
      const profile = await api.auth.getProfile();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
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
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  },

  counselors: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('counselor_roster')
        .select('*');
      if (error) throw error;
      return data;
    },
  },
};
