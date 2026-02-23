import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  FileText,
  Megaphone,
  LogOut,
  Menu,
  X,
  Heart,
  Bell,
  MessageCircle,
  Phone,
  BarChart3,
  Inbox,
  MapPin,
  Clock,
} from 'lucide-react'
import { notifications, inquiries, followUpReminders, liveStatsToday } from '../../utils/mockData'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unreadNotifications = notifications.filter(n => !n.read).length
  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length
  const overdueFollowUps = followUpReminders.filter(r => r.priority === 'high').length

  const userLinks = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/user/book-appointment', icon: Calendar, label: 'Book Appointment' },
    { to: '/user/my-appointments', icon: ClipboardList, label: 'My Appointments' },
    { to: '/user/notifications', icon: Bell, label: 'Notifications', badge: unreadNotifications },
    { to: '/user/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/user/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/user/chat', icon: MessageCircle, label: 'Chat Counselor' },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/admin/records', icon: FileText, label: 'Client Records' },
    { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/admin/inquiries', icon: Inbox, label: 'Inquiry Manager', badge: pendingInquiries },
    { to: '/admin/counselors', icon: Users, label: 'Counselor Roster' },
    { to: '/admin/barangay-map', icon: MapPin, label: 'Barangay Map' },
    { to: '/admin/follow-ups', icon: Clock, label: 'Follow-up Reminders', badge: overdueFollowUps },
  ]

  const links = user?.role === 'admin' ? adminLinks : userLinks

  const handleLogoClick = () => {
    const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
    navigate(dashboardPath)
    setIsOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={handleLogoClick}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TheraPath</h1>
            <p className="text-xs text-gray-500">Guidance System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="flex-1">{link.label}</span>
            {link.badge > 0 && (
              <span className="notification-badge">{link.badge}</span>
            )}
          </NavLink>
        ))}

        {user?.role === 'user' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Heart className="w-4 h-4 text-primary" />
              <span className="font-medium">Daily Wellness Tip</span>
            </div>
            <p className="text-xs text-gray-500 italic px-2">
              "Ang pag-asa ay laging nandito. Huwag matakot humingi ng tulong."
            </p>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 p-4 bg-primary/5 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
            {user?.role === 'admin' ? 'Administrator' : 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-white z-50 shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar