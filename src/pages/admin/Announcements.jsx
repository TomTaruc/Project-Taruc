import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react'
import { api } from '../../services/api'
import ConfirmModal from '../../components/modals/ConfirmModal'
import showToast from '../../components/Toast'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', category: '', priority: 'medium', expiresAt: '' })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    setIsLoading(true)
    try {
      const data = await api.announcements.getAll()
      setAnnouncements(data || [])
    } catch (error) {
      showToast.error('Failed to load announcements')
    } finally {
      setIsLoading(false)
    }
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
      setShowForm(false)
      setEditingAnnouncement(null)
      fetchAnnouncements()
    } catch (error) {
      showToast.error('Save failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.announcements.delete(id)
      showToast.success('Deleted successfully')
      fetchAnnouncements()
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
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">New Announcement</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <input className="input-field" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="input-field" placeholder="Content" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
          <div className="flex gap-4">
            <input className="input-field" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <input type="date" className="input-field" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="card flex justify-between items-start">
            <div>
              <h3 className="font-bold">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteModal(a)} className="text-red-600"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
      
      <ConfirmModal isOpen={!!deleteModal} onConfirm={() => handleDelete(deleteModal.id)} onClose={() => setDeleteModal(null)} title="Delete" message="Confirm deletion?" type="danger" />
    </div>
  )
}
export default Announcements