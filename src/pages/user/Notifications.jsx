import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchNotifications = async () => {
      try {
        const data = await api.notifications.getUserNotifications()
        if (isMounted) setNotifications(data || [])
      } catch (error) {
        console.error("Fetch error:", error)
        if (isMounted) showToast.error("Failed to load notifications.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchNotifications()
    return () => { isMounted = false }
  }, [])

  const handleMarkAsRead = async (id) => {
    const previous = [...notifications]
    
    // Optimistic Update
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))

    try {
      await api.notifications.markAsRead(id)
    } catch (error) {
      console.error("Update failed:", error)
      setNotifications(previous) // Revert on failure
      showToast.error("Failed to mark as read.")
    }
  }

  const handleDelete = async (id) => {
    const previous = [...notifications]
    
    // Optimistic Update
    setNotifications(notifications.filter(n => n.id !== id))

    try {
      await api.notifications.delete(id)
      showToast.success("Notification deleted.")
    } catch (error) {
      console.error("Delete failed:", error)
      setNotifications(previous) // Revert on failure
      showToast.error("Failed to delete notification.")
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading notifications...</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Updates regarding your appointments and account.</p>
      </motion.div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-colors ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-full mt-1 ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-md ${notif.read ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold'}`}>
                    {notif.title}
                  </h4>
                  <p className={`text-sm mt-1 ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!notif.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notif.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="card text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>You have no notifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserNotifications