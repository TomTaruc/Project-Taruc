import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Award, Clock } from 'lucide-react'
import { counselorRoster } from '../../utils/mockData'

const CounselorRoster = () => {
  const [selectedCounselor, setSelectedCounselor] = useState(null)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Roster</h1>
        <p className="text-gray-600">Professional counseling team members and their schedules</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {counselorRoster.map((counselor, index) => (
          <motion.div
            key={counselor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            onClick={() => setSelectedCounselor(selectedCounselor?.id === counselor.id ? null : counselor)}
            className={`card-hover cursor-pointer transition-all duration-200 ${
              selectedCounselor?.id === counselor.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary/10">
                <img
                  src={counselor.image}
                  alt={counselor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{counselor.name}</h3>
              <p className="text-primary font-medium mb-2">{counselor.specialization}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <Award className="w-4 h-4" />
                <span>{counselor.credentials}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="break-all">{counselor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{counselor.contact}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Available Days</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {counselor.availableDays.map((day) => (
                  <span key={day} className="badge badge-primary text-xs">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {selectedCounselor?.id === counselor.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Available Times</span>
                </div>
                <div className="space-y-1">
                  {counselor.availableTimes.map((time, idx) => (
                    <p key={idx} className="text-sm text-gray-600 pl-6">
                      {time}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-primary/5 rounded-lg">
            <User className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{counselorRoster.length}</p>
            <p className="text-sm text-gray-600">Professional Counselors</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {new Set(counselorRoster.map(c => c.specialization)).size}
            </p>
            <p className="text-sm text-gray-600">Specializations</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">6</p>
            <p className="text-sm text-gray-600">Days Coverage</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Counselor Information</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>All counselors are licensed professionals with active PRC credentials</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Click on a counselor card to view detailed schedule information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Appointments are scheduled based on counselor availability and specialization</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>For urgent concerns, contact the counseling office directly</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

export default CounselorRoster
