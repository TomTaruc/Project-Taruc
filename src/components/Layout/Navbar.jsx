import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Bell } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const Navbar = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-primary px-4 lg:px-6 py-4 border-b border-primary-dark z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-white hover:bg-primary-dark rounded-lg transition-all duration-200">
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
      className="fixed top-0 left-0 w-full bg-primary backdrop-blur-md border-b border-primary-dark z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
              <img
                src={logoImg}
                alt="TheraPath Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-xl font-bold text-white">TheraPath</span>
              <p className="text-xs text-white/70">Guidance Counseling</p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              Login
            </Link>

            <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar