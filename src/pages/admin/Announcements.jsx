import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, Edit, Trash2, Calendar, Clock, X } from 'lucide-react'
import { api } from '../../services/api'
import ConfirmModal from '../../components/modals/ConfirmModal'
import showToast from '../../components/Toast'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  
  const initialFormState = { title: '', content: '', category: '', priority: 'medium', expiresAt: '' }
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    let isMounted = true;
    
    const fetchAnnouncements = async () => {
      setIsLoading(true)
      try {
        const data = await api.announcements.getAll()
        if (isMounted) setAnnouncements(data || [])
      } catch (error) {
        if (isMounted) showToast.error('Failed to load announcements')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    
    fetchAnnouncements()
    return () => { isMounted = false; }
  }, [])

  // Refreshes table after actions
  const refreshData = async () => {
    try {
      const data = await api.announcements.getAll()
      setAnnouncements(data || [])
    } catch (error) {
      console.error("Refresh failed", error);
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingAnnouncement(null)
    setFormData(initialFormState)
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      category: announcement.category || '',
      priority: announcement.priority || 'medium',
      // Format timestamp for HTML date input
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAnnouncement) {
        await api.announcements.update(editingAnnouncement.id, formData)
        showToast.success('Updated successfully')
      } else {
        await api.announcements.create(formData)
        showToast.success('Created successfully')
      }
      resetForm()
      refreshData()
    } catch (error) {
      showToast.error('Save failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.announcements.delete(id)
      showToast.success('Deleted successfully')
      refreshData()
    } catch (error) {
      showToast.error('Delete failed')
    }
    setDeleteModal(null)
  }

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Announcements</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          onSubmit={handleSubmit} 
          className="card space-y-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <input className="input-field" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="input-field min-h-[100px]" placeholder="Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
          
          <div className="flex gap-4">
            <input className="input-field" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <input type="date" className="input-field" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">{editingAnnouncement ? 'Update' : 'Publish'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map(a => (
            <div key={a.id} className="card flex justify-between items-start border-l-4 border-primary hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{a.content}</p>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  {a.category && <span className="bg-gray-100 px-2 py-1 rounded-md">{a.category}</span>}
                  {a.expiresAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Expires: {new Date(a.expiresAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  title="Edit"
                  onClick={() => handleEdit(a)} 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  title="Delete"
                  onClick={() => setDeleteModal(a)} 
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No active announcements.</p>
          </div>
        )}
      </div>
      
      <ConfirmModal 
        isOpen={!!deleteModal} 
        onConfirm={() => handleDelete(deleteModal.id)} 
        onClose={() => setDeleteModal(null)} 
        title="Delete Announcement" 
        message={`Are you sure you want to delete "${deleteModal?.title}"? This cannot be undone.`} 
        type="danger" 
      />
    </div>
  )
}

export default Announcements