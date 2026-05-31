import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, Phone, Award } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const CounselorRoster = () => {
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCounselors = async () => {
      try {
        const data = await api.counselors.getAll()
        if (isMounted) setCounselors(data || [])
      } catch (error) {
        console.error("Error fetching counselors:", error)
        if (isMounted) showToast.error("Failed to load counselor roster.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCounselors()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading counselor data...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Counselor Roster</h1>
        <p className="text-gray-600">Directory of all registered counselors and therapists.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counselors.length > 0 ? (
          counselors.map((counselor, index) => (
            <motion.div 
              key={counselor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{counselor.name}</h3>
              <p className="text-sm text-primary font-medium mb-4">{counselor.specialty || 'General Counselor'}</p>
              
              <div className="space-y-2 text-sm text-gray-600 text-left bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{counselor.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{counselor.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>{counselor.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 card">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Counselors Found</h3>
            <p>There are currently no counselors registered in the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CounselorRoster