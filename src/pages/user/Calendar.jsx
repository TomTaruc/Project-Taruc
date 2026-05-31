import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const UserCalendar = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchAppointments = async () => {
      try {
        const data = await api.appointments.getUserAppointments()
        if (isMounted) setAppointments(data || [])
      } catch (error) {
        console.error("Fetch error:", error)
        if (isMounted) showToast.error("Failed to load schedule.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAppointments()
    return () => { isMounted = false }
  }, [])

  // Safely filter and sort upcoming appointments
  const upcomingAppointments = appointments
    .filter(a => (a.status === 'confirmed' || a.status === 'pending') && a.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading calendar...</div>

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
        <p className="text-gray-600">View your upcoming counseling sessions and events.</p>
      </motion.div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Upcoming Agenda</h2>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 py-4">
            {upcomingAppointments.map((apt, index) => (
              <motion.div 
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6"
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{apt.type}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                    <span className="flex items-center gap-1 font-medium">
                      <CalendarIcon className="w-4 h-4" /> 
                      {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-4 h-4" /> 
                      {apt.time}
                    </span>
                  </div>
                  
                  {apt.notes && (
                    <p className="text-sm text-gray-500 bg-white p-3 rounded border border-gray-100">
                      {apt.notes}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Your schedule is clear</h3>
            <p>You have no upcoming sessions booked.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCalendar