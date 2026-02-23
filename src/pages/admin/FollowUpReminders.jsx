import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Calendar, AlertCircle, CheckCircle, Filter } from 'lucide-react'
import { followUpReminders } from '../../utils/mockData'
import showToast from '../../components/Toast'

const FollowUpReminders = () => {
  const [filterPriority, setFilterPriority] = useState('all')

  const filteredReminders = filterPriority === 'all'
    ? followUpReminders
    : followUpReminders.filter(r => r.priority === filterPriority)

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'badge-error',
      medium: 'badge-warning',
      low: 'badge-info',
    }
    return badges[priority] || 'badge'
  }

  const getPriorityIcon = (priority) => {
    return priority === 'high' ? AlertCircle : Clock
  }

  const handleMarkComplete = (id) => {
    const index = followUpReminders.findIndex(r => r.id === id)
    if (index > -1) {
      followUpReminders.splice(index, 1)
      showToast.success('Follow-up reminder marked as complete')
    }
  }

  const isOverdue = (followUpDate) => {
    return new Date(followUpDate) < new Date()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Follow-up Reminders</h1>
        <p className="text-gray-600">Track and manage client follow-up appointments</p>
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
            <span className="font-medium">Filter by priority:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'high', 'medium', 'low'].map((priority) => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filterPriority === priority
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority === 'all' ? 'All Priorities' : `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`}
              </button>
            ))}
          </div>
        </div>

        {filteredReminders.length > 0 ? (
          <div className="space-y-4">
            {filteredReminders.map((reminder, index) => {
              const PriorityIcon = getPriorityIcon(reminder.priority)
              const overdueStatus = isOverdue(reminder.followUpDate)

              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-lg border-l-4 transition-all duration-200 ${
                    overdueStatus
                      ? 'bg-red-50 border-red-500'
                      : reminder.priority === 'high'
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          overdueStatus ? 'bg-red-100' : 'bg-white'
                        }`}>
                          <PriorityIcon className={`w-5 h-5 ${
                            overdueStatus ? 'text-red-600' : 'text-primary'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reminder.clientName}
                            </h3>
                            <span className={`badge ${getPriorityBadge(reminder.priority)} text-xs`}>
                              {reminder.priority} priority
                            </span>
                            {overdueStatus && (
                              <span className="badge badge-error text-xs">OVERDUE</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{reminder.concern}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 ml-13">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Counselor: {reminder.counselor}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Last Session: {new Date(reminder.lastSessionDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className={`w-4 h-4 ${overdueStatus ? 'text-red-600' : 'text-primary'}`} />
                          <span className={overdueStatus ? 'text-red-600' : 'text-primary'}>
                            Follow-up Due: {new Date(reminder.followUpDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMarkComplete(reminder.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No follow-up reminders</h3>
            <p className="text-gray-600">
              {filterPriority !== 'all'
                ? 'Try selecting a different priority level'
                : 'All clients are up to date'}
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">High Priority</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {followUpReminders.filter(r => r.priority === 'high').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Requires immediate attention</p>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Medium Priority</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {followUpReminders.filter(r => r.priority === 'medium').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Schedule within this week</p>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Low Priority</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {followUpReminders.filter(r => r.priority === 'low').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Scheduled follow-ups</p>
        </div>
      </motion.div>
    </div>
  )
}

export default FollowUpReminders
