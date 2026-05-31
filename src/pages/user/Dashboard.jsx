import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Bell, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import showToast from '../../components/Toast'

const UserDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchDashboardData = async () => {
      try {
        const [appts, ann] = await Promise.all([
          api.appointments.getUserAppointments(),
          api.announcements.getAll()
        ])

        if (isMounted) {
          setAppointments(appts || [])
          setAnnouncements(ann || [])
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error)
        if (isMounted) showToast.error("Failed to load dashboard data.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDashboardData()
    return () => { isMounted = false }
  }, [])

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').slice(0, 3)

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-gray-600">Here is your counseling overview for today.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }}
          className="card flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Sessions
            </h2>
            <Link to="/user/my-appointments" className="text-sm text-primary hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{apt.type}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(apt.date).toLocaleDateString()} at {apt.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No upcoming appointments.</p>
                <Link to="/user/book-appointment" className="btn-primary inline-block mt-4">Book a Session</Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Announcements */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="card flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Latest Announcements
            </h2>
          </div>

          <div className="flex-1 space-y-4">
            {announcements.length > 0 ? (
              announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="font-bold text-gray-900">{ann.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{ann.content}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    Posted: {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No new announcements.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserDashboard