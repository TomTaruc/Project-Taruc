import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, CheckCircle } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const FollowUpReminders = () => {
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchFollowUps = async () => {
      try {
        const data = await api.clientRecords.getFollowUps()
        if (isMounted) setFollowUps(data || [])
      } catch (error) {
        console.error("Error fetching follow-ups:", error)
        if (isMounted) showToast.error("Failed to load follow-up reminders.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchFollowUps()
    return () => { isMounted = false }
  }, [])

  const handleComplete = async (id) => {
    const previous = [...followUps]
    
    // Optimistic Update
    setFollowUps(followUps.filter(f => f.id !== id))
    
    try {
      await api.clientRecords.update(id, { follow_up_required: false })
      showToast.success("Follow-up marked as complete.")
    } catch (error) {
      setFollowUps(previous)
      showToast.error("Failed to update record.")
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading reminders...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Follow-up Reminders</h1>
        <p className="text-gray-600">Track clients who require follow-up counseling sessions.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followUps.length > 0 ? (
          followUps.map((record, index) => (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card border-t-4 border-yellow-400 flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900">{record.client_name}</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">Action Needed</span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Follow-up Date: {new Date(record.follow_up_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {record.counselor}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4">
                  <span className="font-medium text-gray-900 block mb-1">Previous Session Notes:</span>
                  <p className="line-clamp-3">{record.notes}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleComplete(record.id)}
                className="w-full py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                Mark as Completed
              </button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 card">
            <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p>There are no pending follow-up reminders.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FollowUpReminders