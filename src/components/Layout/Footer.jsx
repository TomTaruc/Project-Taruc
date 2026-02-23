import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4">
            <div className="flex items-center gap-3">

              {/* LOGO */}
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img
                  src={logoImg}
                  alt="TheraPath Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">TheraPath</h3>
                <p className="text-xs text-gray-400">Guidance Counseling</p>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Professional guidance counseling services to support your academic,
              career, and personal development journey.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-primary transition-colors duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary transition-colors duration-200">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Academic Counseling</li>
              <li>Career Counseling</li>
              <li>Personal Counseling</li>
              <li>Group Counseling</li>
              <li>Crisis Intervention</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <span>Brgy. Sta. Ana, Taytay, Rizal, Philippines</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+63 912 345 6789</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@therapath.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TheraPath. All rights reserved. Built with care for your wellbeing.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Made by Tom Taruc
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer