import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api' // Importing our new PostgreSQL service layer

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
      const token = localStorage.getItem('therapath_token')
      if (token) {
        try {
          // Fetch real user data from PostgreSQL via backend
          const userData = await api.auth.getProfile()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Session expired or invalid token:", error)
          localStorage.removeItem('therapath_token')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      // Async API call to PostgreSQL backend
      const response = await api.auth.login({ email, password })
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      // Store JWT token instead of raw user data for security
      localStorage.setItem('therapath_token', response.token)
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Invalid email or password' }
    }
  }

  const register = async (userData) => {
    try {
      // Async API call to PostgreSQL backend
      const response = await api.auth.register(userData)
      
      setUser(response.user)
      setIsAuthenticated(true)
      localStorage.setItem('therapath_token', response.token)
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('therapath_token')
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