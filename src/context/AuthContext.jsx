/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const profile = await api.auth.getProfile()
          if (mounted) {
            setUser(profile)
            setIsAuthenticated(true)
          }
        } else {
          if (mounted) {
            setUser(null)
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error("Auth init error:", error)
        if (mounted) {
          setUser(null)
          setIsAuthenticated(false)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignore INITIAL_SESSION as we handle it above to avoid race conditions
      if (event === 'INITIAL_SESSION') return;

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          try {
            const profile = await api.auth.getProfile()
            if (mounted) {
              setUser(profile)
              setIsAuthenticated(true)
            }
          } catch (error) {
            console.error("Auth state change error:", error)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    })

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const login = async (emailOrObj, passwordArg) => {
    try {
      const email = (typeof emailOrObj === 'object' ? emailOrObj.email : emailOrObj)?.trim()
      const password = typeof emailOrObj === 'object' ? emailOrObj.password : passwordArg

      const response = await api.auth.login({ email, password })
      setUser(response.user)
      setIsAuthenticated(true)
      return { success: true, user: response.user }
    } catch (error) {
      console.error("Login Error Details:", error)
      return { success: false, message: error.message || 'Invalid credentials' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData)

      if (response.requiresEmailConfirmation) {
        setUser(null)
        setIsAuthenticated(false)
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: 'Account created. Please check your email to confirm your account before signing in.',
        }
      }

      setUser(response.user)
      setIsAuthenticated(true)
      return { success: true, user: response.user }
    } catch (error) {
      console.error("Registration Error Details:", error)
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout glitch:", error)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext