import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, CheckCircle, Megaphone, AlertCircle, Trash2, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notifications } from '../../utils/mockData'
import showToast from '../../components/Toast'

const Notifications = () => {
  const { user } = useAuth()
  const [filterType, setFilterType] = useState('all')

  const userNotifications = notifications.filter(n => n.userId === user?.id)

  const filteredNotifications = filterType === 'all'
    ? userNotifications
    : filterType === 'unread'
    ? userNotifications.filter(n => !n.read)
    : userNotifications.filter(n => n.read)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'appointment_reminder':
        return <Calendar className="w-5 h-5 text-blue-600" />
      case 'appointment_cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-primary" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const handleMarkAsRead = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      showToast.success('Notification marked as read')
    }
  }

  const handleMarkAllAsRead = () => {
    userNotifications.forEach(n => n.read = true)
    showToast.success('All notifications marked as read')
  }

  const handleDelete = (notificationId) => {
    const index = notifications.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.splice(index, 1)
      showToast.success('Notification deleted')
    }
  }

  const unreadCount = userNotifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn-outline flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({userNotifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filterType === 'unread'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterType('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filterType === 'read'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read ({userNotifications.length - unreadCount})
          </button>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                  notification.read
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-blue-50 border-primary'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      notification.read ? 'bg-gray-100' : 'bg-white'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${
                        notification.read ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterType === 'all' ? 'No notifications' : `No ${filterType} notifications`}
            </h3>
            <p className="text-gray-600">
              {filterType === 'all'
                ? 'You have no notifications at this time'
                : `You have no ${filterType} notifications`}
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Notification Settings</h3>
        <p className="text-sm text-gray-700 mb-4">
          Stay informed about your appointments and important updates from the counseling center.
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>You'll receive notifications for appointment confirmations and reminders</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Important announcements will be sent to your notifications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Check your notifications regularly to stay updated</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

export default Notifications
