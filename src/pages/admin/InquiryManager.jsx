import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Search, Filter, CheckCircle, Clock, X } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [responseText, setResponseText] = useState('')

  useEffect(() => {
    let isMounted = true;

    const fetchInquiries = async () => {
      try {
        const data = await api.inquiries.getAllAdmin()
        if (isMounted) setInquiries(data || [])
      } catch (error) {
        console.error("Failed to fetch inquiries:", error)
        if (isMounted) showToast.error("Failed to load inquiries.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchInquiries()
    return () => { isMounted = false }
  }, [])

  const handleRespond = async (e) => {
    e.preventDefault()
    if (!selectedInquiry || !responseText.trim()) return

    const previousInquiries = [...inquiries]
    
    // Optimistic UI Update
    setInquiries(inquiries.map(inq => 
      inq.id === selectedInquiry.id 
        ? { ...inq, status: 'resolved', response: responseText, responded_at: new Date().toISOString() } 
        : inq
    ))
    
    setSelectedInquiry(null)
    setResponseText('')

    try {
      await api.inquiries.updateStatus(selectedInquiry.id, 'resolved', responseText)
      showToast.success('Response sent successfully')
    } catch (error) {
      console.error("Failed to send response:", error)
      setInquiries(previousInquiries) // Revert on failure
      showToast.error('Failed to send response. Please try again.')
    }
  }

  const filteredInquiries = inquiries.filter(inq => {
    const searchString = `${inq.name || ''} ${inq.email || ''} ${inq.subject || ''}`.toLowerCase()
    const matchesSearch = searchString.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || inq.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading inquiries...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiry Manager</h1>
        <p className="text-gray-600">Review and respond to client messages and questions.</p>
      </motion.div>

      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="sm:w-48 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map(inq => (
              <motion.div 
                key={inq.id} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`p-5 rounded-lg border ${inq.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{inq.subject}</h3>
                    <p className="text-sm text-gray-600">From: {inq.name} ({inq.email})</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${inq.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {inq.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{inq.message}</p>
                
                {inq.status === 'pending' ? (
                  <button 
                    onClick={() => setSelectedInquiry(inq)}
                    className="btn-primary text-sm py-2"
                  >
                    Respond
                  </button>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Your Response:</p>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{inq.response}</p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No inquiries found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInquiry(null)}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Respond to Inquiry</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-1">{selectedInquiry.subject}</p>
              <p className="text-sm text-gray-600">{selectedInquiry.message}</p>
            </div>
            <form onSubmit={handleRespond} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
                <textarea 
                  className="input-field min-h-[120px]" 
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here. This will be emailed to the client."
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedInquiry(null)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                <button type="submit" className="btn-primary">Send Response</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default InquiryManager