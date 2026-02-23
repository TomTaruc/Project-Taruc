import { useState } from 'react'
import { motion } from 'framer-motion'
import { Inbox, Mail, Phone, User, MessageSquare, Send, Filter, CheckCircle } from 'lucide-react'
import { inquiries } from '../../utils/mockData'
import showToast from '../../components/Toast'

const InquiryManager = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [responseText, setResponseText] = useState('')

  const filteredInquiries = filterStatus === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === filterStatus)

  const handleRespond = (inquiry) => {
    if (!responseText.trim()) {
      showToast.error('Please enter a response message')
      return
    }

    const inquiryObj = inquiries.find(i => i.id === inquiry.id)
    if (inquiryObj) {
      inquiryObj.status = 'responded'
      inquiryObj.response = responseText
      inquiryObj.respondedAt = new Date().toISOString()
      showToast.success('Response sent successfully')
      setSelectedInquiry(null)
      setResponseText('')
    }
  }

  const getStatusBadge = (status) => {
    return status === 'pending' ? 'badge-warning' : 'badge-success'
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiry Manager</h1>
        <p className="text-gray-600">Manage and respond to client inquiries</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filter:</span>
          {['all', 'pending', 'responded'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Inquiries' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredInquiries.length > 0 ? (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-lg border-l-4 transition-all duration-200 ${
                  inquiry.status === 'pending'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        inquiry.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <Inbox className={`w-5 h-5 ${
                          inquiry.status === 'pending' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.subject}</h3>
                        <span className={`badge ${getStatusBadge(inquiry.status)} text-xs`}>
                          {inquiry.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{inquiry.email}</span>
                      </div>
                      {inquiry.phone !== 'N/A' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{inquiry.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white rounded-lg mb-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </div>
                      <p className="text-sm text-gray-700">{inquiry.message}</p>
                    </div>

                    {inquiry.status === 'responded' && inquiry.response && (
                      <div className="p-4 bg-green-100 rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Response</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{inquiry.response}</p>
                        <p className="text-xs text-gray-600">
                          Responded on: {new Date(inquiry.respondedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Received: {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {inquiry.status === 'pending' && (
                  <>
                    {selectedInquiry?.id === inquiry.id ? (
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Response
                        </label>
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={4}
                          className="input-field resize-none mb-3"
                          placeholder="Type your response here..."
                        />
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleRespond(inquiry)}
                            className="btn-primary flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send Response
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInquiry(null)
                              setResponseText('')
                            }}
                            className="btn-ghost"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Respond to Inquiry
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">
              {filterStatus !== 'all'
                ? `No ${filterStatus} inquiries at this time`
                : 'No inquiries have been received yet'}
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
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Inbox className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {inquiries.filter(i => i.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Awaiting response</p>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Responded</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {inquiries.filter(i => i.status === 'responded').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Successfully handled</p>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
          <p className="text-sm text-gray-600 mt-1">All inquiries</p>
        </div>
      </motion.div>
    </div>
  )
}

export default InquiryManager
