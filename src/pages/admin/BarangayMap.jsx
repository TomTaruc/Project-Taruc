import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, TrendingUp, BarChart3 } from 'lucide-react'
import { barangayData } from '../../utils/mockData'

const BarangayMap = () => {
  const [selectedBarangay, setSelectedBarangay] = useState(null)

  const totalStudents = barangayData.reduce((sum, b) => sum + b.studentCount, 0)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Barangay Map</h1>
        <p className="text-gray-600">Geographic distribution of students and common concerns</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Taytay, Rizal - Service Area</h2>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61785.5!2d121.1327!3d14.5673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c743f7d7f7f7%3A0x69a7bec402c03d32!2sTaytay%2C%20Rizal!5e0!3m2!1sen!2sph!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Taytay Barangay Map"
            ></iframe>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Barangays</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{barangayData.length}</p>
            <p className="text-sm text-gray-600 mt-1">Service coverage areas</p>
          </div>

          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Students</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">Across all barangays</p>
          </div>

          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Average Students</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(totalStudents / barangayData.length)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Per barangay</p>
          </div>

          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Highest</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(...barangayData.map(b => b.studentCount))}
            </p>
            <p className="text-sm text-gray-600 mt-1">{barangayData.find(b => b.studentCount === Math.max(...barangayData.map(b => b.studentCount)))?.name}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Barangay Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {barangayData.map((barangay, index) => (
            <motion.div
              key={barangay.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setSelectedBarangay(selectedBarangay?.id === barangay.id ? null : barangay)}
              className={`card-hover cursor-pointer transition-all duration-200 ${
                selectedBarangay?.id === barangay.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{barangay.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {barangay.studentCount.toLocaleString()} students
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Common Concerns:</p>
                    <div className="flex flex-wrap gap-2">
                      {barangay.commonConcerns.map((concern, idx) => (
                        <span key={idx} className="badge badge-primary text-xs">
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedBarangay?.id === barangay.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Coordinates:</span> {barangay.coordinates.lat}, {barangay.coordinates.lng}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Percentage of Total:</span>{' '}
                        {((barangay.studentCount / totalStudents) * 100).toFixed(1)}%
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Geographic Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Focus counseling resources on barangays with higher student populations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Tailor counseling programs based on common concerns per barangay</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Consider outreach programs for underserved areas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Partner with barangay health centers for better community reach</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

export default BarangayMap
