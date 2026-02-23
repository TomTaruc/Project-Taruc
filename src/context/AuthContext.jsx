import { createContext, useContext, useState, useEffect } from 'react'
import { users } from '../utils/mockData'

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
    const storedUser = localStorage.getItem('therapath_user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('therapath_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = users.find(
      u => u.email === email && u.password === password
    )

    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password
      
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem('therapath_user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }

    return { success: false, message: 'Invalid email or password' }
  }

  const register = (userData) => {
    const existingUser = users.find(u => u.email === userData.email)
    
    if (existingUser) {
      return { success: false, message: 'Email already registered' }
    }

    const newUser = {
      id: users.length + 1,
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password
    
    setUser(userWithoutPassword)
    setIsAuthenticated(true)
    localStorage.setItem('therapath_user', JSON.stringify(userWithoutPassword))
    
    return { success: true, user: userWithoutPassword }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('therapath_user')
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

