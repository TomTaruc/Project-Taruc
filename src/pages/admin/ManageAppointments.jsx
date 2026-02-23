import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Mail, Phone, FileText, Filter, Search, CheckCircle, XCircle } from 'lucide-react'
import { appointments } from '../../utils/mockData'
import ConfirmModal from '../../components/modals/ConfirmModal'
import showToast from '../../components/Toast'

const ManageAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [modalType, setModalType] = useState(null)

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleStatusChange = (appointmentId, newStatus) => {
    const appointment = appointments.find(apt => apt.id === appointmentId)
    if (appointment) {
      appointment.status = newStatus
      showToast.success(`Appointment ${newStatus} successfully`)
    }
    setModalType(null)
    setSelectedAppointment(null)
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
        <p className="text-gray-600">View and manage all counseling appointments</p>
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
              placeholder="Search by name, email, or type..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
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
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{apt.type}</h3>
                        <span className={`badge ${getStatusBadge(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span>{apt.userName}</span>
                          {apt.isAnonymous && (
                            <span className="badge badge-info text-xs">Anonymous</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span>{apt.userEmail}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{apt.userPhone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {new Date(apt.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 flex-shrink-0" />
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
                  </div>

                  <div className="flex flex-col gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt)
                            setModalType('confirm')
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt)
                            setModalType('cancel')
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt)
                          setModalType('complete')
                        }}
                        className="btn-primary text-sm py-2"
                      >
                        Mark Complete
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
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No appointments have been scheduled yet'}
            </p>
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={modalType === 'confirm'}
        onClose={() => {
          setModalType(null)
          setSelectedAppointment(null)
        }}
        onConfirm={() => handleStatusChange(selectedAppointment?.id, 'confirmed')}
        title="Confirm Appointment"
        message={`Are you sure you want to confirm the appointment for ${selectedAppointment?.userName}?`}
        confirmText="Confirm"
        type="info"
      />

      <ConfirmModal
        isOpen={modalType === 'cancel'}
        onClose={() => {
          setModalType(null)
          setSelectedAppointment(null)
        }}
        onConfirm={() => handleStatusChange(selectedAppointment?.id, 'cancelled')}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel the appointment for ${selectedAppointment?.userName}? This action cannot be undone.`}
        confirmText="Cancel Appointment"
        type="danger"
      />

      <ConfirmModal
        isOpen={modalType === 'complete'}
        onClose={() => {
          setModalType(null)
          setSelectedAppointment(null)
        }}
        onConfirm={() => handleStatusChange(selectedAppointment?.id, 'completed')}
        title="Complete Appointment"
        message={`Mark the appointment for ${selectedAppointment?.userName} as completed?`}
        confirmText="Mark Complete"
        type="info"
      />
    </div>
  )
}

export default ManageAppointments