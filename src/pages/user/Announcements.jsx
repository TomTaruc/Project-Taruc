import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Calendar, Filter } from 'lucide-react'
import { announcements } from '../../utils/mockData'

const Announcements = () => {
  const [filterCategory, setFilterCategory] = useState('all')

  const activeAnnouncements = announcements.filter(a => a.isActive)

  const filteredAnnouncements = filterCategory === 'all'
    ? activeAnnouncements
    : activeAnnouncements.filter(a => a.category === filterCategory)

  const categories = ['all', ...new Set(announcements.map(a => a.category))]

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'badge-error',
      medium: 'badge-warning',
      low: 'badge-info',
    }
    return badges[priority] || 'badge'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest news and information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filterCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200 border-l-4 border-primary"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="badge badge-primary text-xs">{announcement.category}</span>
                          <span className={`badge ${getPriorityBadge(announcement.priority)} text-xs`}>
                            {announcement.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 ml-13">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-13">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Posted: {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <span>
                        Expires: {new Date(announcement.expiresAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {filterCategory !== 'all'
                ? 'Try selecting a different category'
                : 'There are no active announcements at this time'}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Reminders</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Check announcements regularly for important updates and schedule changes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>High priority announcements require immediate attention.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Contact the counseling office if you have questions about any announcement.</span>
          </li>
        </ul>
      </motion.div>
    </div>
  )
}

export default Announcements
