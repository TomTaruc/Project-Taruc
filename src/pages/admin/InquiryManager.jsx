import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Clock, Search, Send } from 'lucide-react';
import { api } from '../../services/api';

const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for handling the reply action
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const data = await api.inquiries.getAllAdmin();
      setInquiries(data || []);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (id, currentStatus) => {
    // If it's already resolved, don't do anything
    if (currentStatus === 'resolved') return;

    try {
      await api.inquiries.updateStatus(id, 'resolved', 'Resolved by admin without direct response.');
      // Update local UI
      setInquiries(inquiries.map(inq => 
        inq.id === id ? { ...inq, status: 'resolved' } : inq
      ));
    } catch (error) {
      console.error('Failed to mark resolved:', error);
      alert('Failed to update inquiry. Please try again.');
    }
  };

  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;

    try {
      await api.inquiries.updateStatus(id, 'resolved', replyText);
      // Update local UI
      setInquiries(inquiries.map(inq => 
        inq.id === id ? { ...inq, status: 'resolved', response: replyText } : inq
      ));
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Clock className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading inquiries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiry Manager</h1>
        <p className="text-gray-600">Review and respond to messages from the contact form.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>

        <div className="space-y-4">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inq) => (
              <div key={inq.id} className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{inq.subject}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        inq.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{inq.name} ({inq.email})</span>
                      <span className="text-gray-300">•</span>
                      <span>{new Date(inq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="bg-white p-4 rounded border border-gray-100 text-gray-700 text-sm">
                      {inq.message}
                    </div>

                    {inq.response && (
                      <div className="mt-3 bg-blue-50 p-4 rounded border border-blue-100 text-blue-900 text-sm">
                        <span className="font-semibold block mb-1">Admin Response:</span>
                        {inq.response}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 min-w-[140px]">
                    {inq.status === 'pending' && replyingTo !== inq.id && (
                      <>
                        <button 
                          onClick={() => setReplyingTo(inq.id)}
                          className="btn-primary py-2 text-sm w-full flex justify-center items-center gap-2"
                        >
                          <Send className="w-4 h-4" /> Reply
                        </button>
                        <button 
                          onClick={() => handleResolve(inq.id, inq.status)}
                          className="btn-outline py-2 text-sm w-full flex justify-center items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark Resolved
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Reply Form Dropdown */}
                {replyingTo === inq.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Write a response:</label>
                    <textarea
                      rows="3"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="input-field w-full mb-3"
                      placeholder="Type your reply here..."
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSendReply(inq.id)}
                        className="btn-primary py-2 px-6 text-sm flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Send Reply & Resolve
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No inquiries found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InquiryManager;