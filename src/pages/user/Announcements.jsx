import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchAnnouncements = async () => {
      try {
        const data = await api.announcements.getAll()
        if (isMounted) setAnnouncements(data || [])
      } catch (error) {
        console.error("Error fetching announcements:", error)
        if (isMounted) showToast.error("Failed to load announcements.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAnnouncements()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading announcements...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest news and notices from the counseling center.</p>
      </motion.div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((ann, index) => (
            <motion.div 
              key={ann.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card border-l-4 border-primary hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-900">{ann.title}</h3>
                {ann.category && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                    {ann.category}
                  </span>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{ann.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Posted: {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="card text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Announcements</h3>
            <p>There are no active announcements at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAnnouncements