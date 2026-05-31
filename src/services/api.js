import { supabase } from './supabase'

const USERS_TABLE = 'users'

const cleanEmail = (email) => (email ? email.trim().toLowerCase() : '')
const cleanText = (value) => (value ? value.toString().trim() : '')

const requireSingle = ({ data, error }, fallbackMessage) => {
  if (error) throw new Error(error.message || fallbackMessage)
  if (!data) throw new Error(fallbackMessage)
  return data
}

const requireList = ({ data, error }, fallbackMessage) => {
  if (error) throw new Error(error.message || fallbackMessage)
  return data || []
}

// Fast, non-blocking profile fetch
const getProfileSafely = async (authUser) => {
  if (!authUser) return null;
  
  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('email', cleanEmail(authUser.email))
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch profile from DB, falling back to auth metadata:", err);
  }

  // Instant Fallback if DB fetch fails or is blocked by RLS (prevents infinite loading)
  return {
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata?.name || 'User',
    phone: authUser.user_metadata?.phone || null,
    role: authUser.user_metadata?.role || 'user',
  };
}

export const api = {
  auth: {
    login: async ({ email, password }) => {
      const normalizedEmail = cleanEmail(email)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (authError) throw new Error(authError.message || 'Invalid login credentials')
      if (!authData.user) throw new Error('Authentication failed.')

      const profile = await getProfileSafely(authData.user)
      return { user: profile, session: authData.session }
    },

    register: async (userData) => {
      const normalizedEmail = cleanEmail(userData.email)
      // FIX: Removed strict override that forced all registrations to 'user'
      const role = userData.role || 'user'
      const name = cleanText(userData.name)
      const phone = cleanText(userData.phone) || null

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: userData.password,
        options: {
          data: { name, phone, role },
        },
      })

      if (authError) throw new Error(authError.message || 'Registration failed')
      if (!authData.user) throw new Error('Registration failed. Please try again.')

      // Attempt to insert into public table just ONCE to prevent locking up the UI
      try {
        await supabase.from(USERS_TABLE).insert({
          id: authData.user.id,
          email: normalizedEmail,
          name,
          phone,
          role
        });
      } catch (e) {
        console.warn("Public profile insertion bypassed due to schema/RLS rules:", e);
      }

      const profile = await getProfileSafely(authData.user)

      return {
        user: profile,
        session: authData.session,
        requiresEmailConfirmation: !authData.session,
      }
    },

    // FIX: Accept authUser to prevent redundant, blocking supabase.auth.getUser() network calls
    getProfile: async (authUser = null) => {
      let user = authUser;
      
      if (!user) {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          throw new Error(error?.message || 'Not authenticated')
        }
        user = data.user;
      }
      return getProfileSafely(user)
    },

    logout: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error(error.message || 'Logout failed')
    },
  },

  appointments: {
    getUserAppointments: async () => {
      const profile = await api.auth.getProfile()
      return requireList(
        await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', profile.id)
          .order('date', { ascending: false })
          .order('time', { ascending: true }),
        'Failed to load appointments'
      )
    },

    create: async (appointmentData) => {
      return requireSingle(
        await supabase.from('appointments').insert(appointmentData).select('*').single(),
        'Failed to create appointment'
      )
    },

    getAllAdmin: async () => {
      return requireList(
        await supabase
          .from('appointments')
          .select('*')
          .order('date', { ascending: false })
          .order('time', { ascending: true }),
        'Failed to load appointments'
      )
    },

    updateStatus: async (id, status) => {
      return requireSingle(
        await supabase.from('appointments').update({ status }).eq('id', id).select('*').single(),
        'Failed to update appointment'
      )
    },
  },

  clientRecords: {
    getUserRecords: async () => {
      const profile = await api.auth.getProfile()
      return requireList(
        await supabase
          .from('client_records')
          .select('*')
          .or(`user_id.eq.${profile.id},client_email.eq.${profile.email}`)
          .order('created_at', { ascending: false }),
        'Failed to load client records'
      )
    },

    getAllAdmin: async () => {
      return requireList(
        await supabase.from('client_records').select('*').order('created_at', { ascending: false }),
        'Failed to load client records'
      )
    },

    create: async (recordData) => {
      return requireSingle(
        await supabase.from('client_records').insert(recordData).select('*').single(),
        'Failed to create client record'
      )
    },

    update: async (id, updates) => {
      return requireSingle(
        await supabase.from('client_records').update(updates).eq('id', id).select('*').single(),
        'Failed to update client record'
      )
    },

    getFollowUps: async () => {
      return requireList(
        await supabase
          .from('client_records')
          .select('*')
          .eq('follow_up_required', true)
          .order('follow_up_date', { ascending: true }),
        'Failed to load follow-ups'
      )
    },
  },

  announcements: {
    getAll: async () => {
      return requireList(
        await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        'Failed to load announcements'
      )
    },

    create: async (announcementData) => {
      return requireSingle(
        await supabase.from('announcements').insert(announcementData).select('*').single(),
        'Failed to create announcement'
      )
    },

    update: async (id, updates) => {
      return requireSingle(
        await supabase.from('announcements').update(updates).eq('id', id).select('*').single(),
        'Failed to update announcement'
      )
    },

    delete: async (id) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw new Error(error.message || 'Failed to delete announcement')
    },
  },

  inquiries: {
    create: async (inquiryData) => {
      return requireSingle(
        await supabase.from('inquiries').insert(inquiryData).select('*').single(),
        'Failed to send inquiry'
      )
    },

    getUserInquiries: async () => {
      const profile = await api.auth.getProfile()
      return requireList(
        await supabase
          .from('inquiries')
          .select('*')
          .eq('email', profile.email)
          .order('created_at', { ascending: true }),
        'Failed to load inquiries'
      )
    },

    getAllAdmin: async () => {
      return requireList(
        await supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        'Failed to load inquiries'
      )
    },

    updateStatus: async (id, status, response = null) => {
      return requireSingle(
        await supabase
          .from('inquiries')
          .update({
            status,
            response,
            responded_at: response ? new Date().toISOString() : null,
          })
          .eq('id', id)
          .select('*')
          .single(),
        'Failed to update inquiry'
      )
    },
  },

  notifications: {
    getUserNotifications: async () => {
      const profile = await api.auth.getProfile()
      return requireList(
        await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${profile.id},user_id.is.null`)
          .order('created_at', { ascending: false }),
        'Failed to load notifications'
      )
    },

    markAsRead: async (id) => {
      return requireSingle(
        await supabase.from('notifications').update({ read: true }).eq('id', id).select('*').single(),
        'Failed to update notification'
      )
    },

    delete: async (id) => {
      const { error } = await supabase.from('notifications').delete().eq('id', id)
      if (error) throw new Error(error.message || 'Failed to delete notification')
    },
  },

  counselors: {
    getAll: async () => {
      return requireList(
        await supabase.from('counselor_roster').select('*').order('name', { ascending: true }),
        'Failed to load counselors'
      )
    },
  },

  barangays: {
    getAll: async () => {
      return requireList(
        await supabase.from('barangays').select('*').order('name', { ascending: true }),
        'Failed to load barangay data'
      )
    },
  },
}