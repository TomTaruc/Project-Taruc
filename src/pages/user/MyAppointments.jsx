import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, XCircle } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'
import ConfirmModal from '../../components/modals/ConfirmModal'

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchAppointments = async () => {
      try {
        const data = await api.appointments.getUserAppointments()
        if (isMounted) setAppointments(data || [])
      } catch (error) {
        console.error("Fetch error:", error)
        if (isMounted) showToast.error("Failed to load appointments.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAppointments()
    return () => { isMounted = false }
  }, [])

  const handleCancel = async (id) => {
    const previous = [...appointments]
    
    // Optimistic UI Update: Instantly change status to cancelled
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    ))
    setCancelModal(null)

    try {
      await api.appointments.updateStatus(id, 'cancelled')
      showToast.success("Appointment cancelled successfully.")
    } catch (error) {
      console.error("Cancel failed:", error)
      setAppointments(previous) // Revert on failure
      showToast.error("Failed to cancel appointment. Please try again.")
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return badges[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading appointments...</div>

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Track and manage your counseling sessions.</p>
      </motion.div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((apt, index) => (
            <motion.div 
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-primary"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-gray-900">{apt.type}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(apt.status)}`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(apt.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.time}</span>
                </div>
                
                {apt.notes && (
                  <p className="text-sm text-gray-500 mt-2"><span className="font-medium text-gray-700">Notes:</span> {apt.notes}</p>
                )}
              </div>

              {apt.status === 'pending' && (
                <button 
                  onClick={() => setCancelModal(apt)}
                  className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Session
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <div className="card text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>You have no appointment history.</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!cancelModal} 
        onConfirm={() => handleCancel(cancelModal.id)} 
        onClose={() => setCancelModal(null)} 
        title="Cancel Appointment" 
        message="Are you sure you want to cancel this appointment? This action cannot be undone." 
        type="danger" 
      />
    </div>
  )
}

export default MyAppointments