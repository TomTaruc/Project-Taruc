import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, FileText, Filter, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { appointments } from '../../utils/mockData'

const MyAppointments = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const userAppointments = appointments.filter(apt => apt.userId === user?.id)

  const filteredAppointments = userAppointments.filter(apt => {
    const matchesSearch = apt.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      completed: 'badge-info',
      cancelled: 'badge-error',
    }
    return badges[status] || 'badge'
  }

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'border-green-500',
      pending: 'border-yellow-500',
      completed: 'border-blue-500',
      cancelled: 'border-red-500',
    }
    return colors[status] || 'border-gray-300'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">View and manage all your counseling appointments</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 border-l-4 ${getStatusColor(apt.status)} bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{apt.type}</h3>
                      <span className={`badge ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(apt.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{apt.time}</span>
                      </div>
                      
                      {apt.notes && (
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{apt.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.status === 'pending' && (
                      <button className="btn-outline text-sm py-2">
                        Cancel
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button className="btn-outline text-sm py-2">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Booked on {new Date(apt.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'You haven\'t booked any appointments yet'}
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Confirmed</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {userAppointments.filter(apt => apt.status === 'confirmed').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Ready to attend</p>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {userAppointments.filter(apt => apt.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Awaiting confirmation</p>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {userAppointments.filter(apt => apt.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Past sessions</p>
        </div>
      </motion.div>
    </div>
  )
}

export default MyAppointments