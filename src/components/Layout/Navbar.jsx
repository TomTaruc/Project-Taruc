import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Bell } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const Navbar = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-white px-4 lg:px-6 py-4 border-b border-gray-200 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src={logoImg}
                alt="TheraPath Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-xl font-bold text-gray-900">TheraPath</span>
              <p className="text-xs text-gray-500">Guidance Counseling</p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              Login
            </Link>

            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar