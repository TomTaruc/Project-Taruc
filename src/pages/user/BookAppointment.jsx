import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { appointments } from '../../utils/mockData'
import AppointmentForm from '../../components/forms/AppointmentForm'
import showToast from '../../components/Toast'

const BookAppointment = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    const newAppointment = {
      id: appointments.length + 1,
      userId: formData.isAnonymous ? null : user.id,
      userName: formData.isAnonymous ? 'Anonymous' : formData.name || user.name,
      userEmail: formData.isAnonymous ? 'anonymous@therapath.com' : formData.email || user.email,
      userPhone: formData.isAnonymous ? 'N/A' : formData.phone || user.phone,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: 'pending',
      notes: formData.notes,
      isAnonymous: formData.isAnonymous,
      createdAt: new Date().toISOString(),
    }

    appointments.push(newAppointment)
    
    setTimeout(() => {
      navigate('/user/my-appointments')
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-600">
          Schedule a counseling session at your convenience. All appointments are confidential.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AppointmentForm
          onSubmit={handleSubmit}
          initialData={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 card bg-blue-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Please arrive 5-10 minutes before your scheduled appointment time.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>If you need to cancel or reschedule, please do so at least 24 hours in advance.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>All counseling sessions are completely confidential and conducted by certified professionals.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>You can choose to book anonymously if you prefer not to share your personal information.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>For emergency support, please call our crisis hotline at (555) 123-4567.</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

export default BookAppointment