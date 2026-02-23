import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { appointments, dashboardStats } from '../../utils/mockData'
import StatCard from '../../components/cards/StatCard'

const UserDashboard = () => {
  const { user } = useAuth()
  const userAppointments = appointments.filter(apt => apt.userId === user?.id)
  const upcomingAppointments = userAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending')

  const stats = [
    {
      icon: Calendar,
      title: 'Total Appointments',
      value: dashboardStats.user.totalAppointments,
      color: 'primary',
    },
    {
      icon: Clock,
      title: 'Upcoming',
      value: dashboardStats.user.upcomingAppointments,
      color: 'info',
    },
    {
      icon: CheckCircle,
      title: 'Completed',
      value: dashboardStats.user.completedSessions,
      color: 'success',
    },
    {
      icon: AlertCircle,
      title: 'Pending',
      value: dashboardStats.user.pendingRequests,
      color: 'warning',
    },
  ]

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      completed: 'badge-info',
      cancelled: 'badge-error',
    }
    return badges[status] || 'badge'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's an overview of your counseling journey</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link to="/user/book-appointment" className="text-primary hover:text-primary-dark text-sm font-medium">
              Book New
            </Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{apt.type}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <span className={`badge ${getStatusBadge(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <Link to="/user/book-appointment" className="btn-primary">
                Book Your First Appointment
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/user/book-appointment"
              className="block p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Book Appointment</h3>
                  <p className="text-sm text-gray-600">Schedule a new counseling session</p>
                </div>
              </div>
            </Link>

            <Link
              to="/user/my-appointments"
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View All Appointments</h3>
                  <p className="text-sm text-gray-600">Manage your scheduled sessions</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our counseling team is here to support you. Reach out anytime.
            </p>
            <a href="tel:+15551234567" className="text-primary text-sm font-medium hover:text-primary-dark">
              Call: (555) 123-4567
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {userAppointments.slice(0, 3).map((apt) => (
            <div key={apt.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
              <div className={`w-2 h-2 rounded-full mt-2 ${apt.status === 'completed' ? 'bg-green-500' : apt.status === 'confirmed' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{apt.type}</span> appointment on{' '}
                  {new Date(apt.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(apt.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <span className={`badge ${getStatusBadge(apt.status)} text-xs`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default UserDashboard