import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import showToast from '../../components/Toast'

const BookAppointment = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'General Counseling',
    notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.appointments.create({
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        notes: formData.notes,
        status: 'pending'
      })
      
      showToast.success('Appointment request submitted successfully!')
      navigate('/user/my-appointments')
    } catch (error) {
      console.error("Booking failed:", error)
      showToast.error(error.message || 'Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent booking in the past
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-600">Schedule a counseling session with our professionals.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="card"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Select Date
              </label>
              <input 
                type="date" 
                min={today}
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="input-field w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Preferred Time
              </label>
              <select 
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="input-field w-full appearance-none"
              >
                <option value="" disabled>Select a time slot</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Session Type
            </label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="input-field w-full appearance-none"
            >
              <option value="General Counseling">General Counseling</option>
              <option value="Academic Guidance">Academic Guidance</option>
              <option value="Career Counseling">Career Counseling</option>
              <option value="Mental Health Support">Mental Health Support</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea 
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Briefly describe what you'd like to discuss..."
              className="input-field w-full"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`btn-primary px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default BookAppointment