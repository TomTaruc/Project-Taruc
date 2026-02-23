import { useState } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react'
import { announcements } from '../../utils/mockData'
import ConfirmModal from '../../components/modals/ConfirmModal'
import showToast from '../../components/Toast'

const Announcements = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    expiresAt: '',
  })

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      expiresAt: announcement.expiresAt.split('T')[0],
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    const index = announcements.findIndex(a => a.id === id)
    if (index > -1) {
      announcements.splice(index, 1)
      showToast.success('Announcement deleted successfully')
    }
    setDeleteModal(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingAnnouncement) {
      const announcement = announcements.find(a => a.id === editingAnnouncement.id)
      if (announcement) {
        Object.assign(announcement, formData)
        showToast.success('Announcement updated successfully')
      }
    } else {
      const newAnnouncement = {
        id: announcements.length + 1,
        ...formData,
        isActive: true,
        createdBy: 'Admin User',
        createdAt: new Date().toISOString(),
      }
      announcements.push(newAnnouncement)
      showToast.success('Announcement created successfully')
    }
    
    setShowForm(false)
    setEditingAnnouncement(null)
    setFormData({
      title: '',
      content: '',
      category: '',
      priority: 'medium',
      expiresAt: '',
    })
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'badge-error',
      medium: 'badge-warning',
      low: 'badge-info',
    }
    return badges[priority] || 'badge'
  }

  const activeAnnouncements = announcements.filter(a => a.isActive)
  const expiredAnnouncements = announcements.filter(a => !a.isActive)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Manage system-wide announcements and notifications</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Announcement
          </button>
        </div>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Announcement title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="input-field resize-none"
                placeholder="Announcement content"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Event">Event</option>
                  <option value="Career">Career</option>
                  <option value="Service">Service</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expires On</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingAnnouncement(null)
                  setFormData({
                    title: '',
                    content: '',
                    category: '',
                    priority: 'medium',
                    expiresAt: '',
                  })
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingAnnouncement ? 'Update' : 'Create'} Announcement
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Announcements</h2>
        {activeAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {activeAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="badge badge-primary text-xs">{announcement.category}</span>
                          <span className={`badge ${getPriorityBadge(announcement.priority)} text-xs`}>
                            {announcement.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Expires: {new Date(announcement.expiresAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <span>By {announcement.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(announcement)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active announcements</h3>
            <p className="text-gray-600 mb-6">Create your first announcement to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Announcement
            </button>
          </div>
        )}
      </motion.div>

      {expiredAnnouncements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Expired Announcements</h2>
          <div className="space-y-4">
            {expiredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="card opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Expired on {new Date(announcement.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteModal(announcement)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <ConfirmModal
        isOpen={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => handleDelete(deleteModal?.id)}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleteModal?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default Announcements