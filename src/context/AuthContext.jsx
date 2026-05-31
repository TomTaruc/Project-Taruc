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
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const profile = await api.auth.getProfile()
          setUser(profile)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("No active session:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await api.auth.getProfile()
          setUser(profile)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Error fetching profile on state shift:", error)
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Robust parameter handling to prevent "undefined email" errors
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
