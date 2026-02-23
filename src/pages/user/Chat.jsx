import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, User, Clock, CheckCircle, Heart, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { inquiries } from '../../utils/mockData'
import showToast from '../../components/Toast'

const Chat = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [subject, setSubject] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef(null)

  // Load user's existing inquiries as chat messages
  useEffect(() => {
    const userInquiries = inquiries.filter(
      i => i.email === user?.email || i.name === user?.name
    )

    if (userInquiries.length > 0) {
      setHasStarted(true)
      const chatMessages = []
      userInquiries.forEach(inquiry => {
        // User's message
        chatMessages.push({
          id: `user-${inquiry.id}`,
          sender: 'user',
          text: inquiry.message,
          subject: inquiry.subject,
          timestamp: inquiry.createdAt,
          status: inquiry.status,
        })
        // Counselor's reply (if responded)
        if (inquiry.status === 'responded' && inquiry.response) {
          chatMessages.push({
            id: `counselor-${inquiry.id}`,
            sender: 'counselor',
            text: inquiry.response,
            timestamp: inquiry.respondedAt,
            counselorName: 'TheraPath Counselor',
          })
        }
      })
      // Sort by timestamp
      chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      setMessages(chatMessages)
    } else {
      // Welcome message
      setMessages([
        {
          id: 'welcome',
          sender: 'counselor',
          text: `Hello ${user?.name?.split(' ')[0]}! 👋 Welcome to TheraPath Chat. I'm here to listen and support you. Feel free to share anything on your mind — this is a safe and confidential space. How can I help you today?`,
          timestamp: new Date().toISOString(),
          counselorName: 'TheraPath Counselor',
        },
      ])
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    const msgSubject = subject.trim() || 'Chat Message'

    // Add user message to chat
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      subject: msgSubject,
      timestamp: new Date().toISOString(),
      status: 'pending',
    }
    setMessages(prev => [...prev, userMsg])

    // Add to inquiries (so admin sees it in Inquiry Manager)
    const newInquiry = {
      id: inquiries.length + 1,
      name: user?.name || 'User',
      email: user?.email || '',
      phone: user?.phone || 'N/A',
      subject: msgSubject,
      message: inputText.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    inquiries.push(newInquiry)

    setInputText('')
    setSubject('')
    setHasStarted(true)
    setIsTyping(true)

    showToast.success('Message sent to counselor!')

    // Simulate counselor "seen" response delay
    setTimeout(() => {
      setIsTyping(false)
      const autoReply = {
        id: `auto-${Date.now()}`,
        sender: 'counselor',
        text: "Thank you for reaching out! Your message has been received and a counselor will respond shortly. If this is an emergency, please call our crisis hotline at +63 912 345 6789.",
        timestamp: new Date().toISOString(),
        counselorName: 'TheraPath Counselor',
      }
      setMessages(prev => [...prev, autoReply])
    }, 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = formatDate(msg.timestamp)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(msg)
    return groups
  }, {})

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-0 rounded-b-none border-b-0 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">TheraPath Counselor</h2>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
              Available · Replies sent to your inbox
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>100% Confidential</span>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 bg-white border border-gray-200 border-t-0 border-b-0 overflow-y-auto px-4 py-4 space-y-2">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium px-2">{date}</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {msgs.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'counselor' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1 shadow-sm">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[70%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  {msg.sender === 'counselor' && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{msg.counselorName}</span>
                  )}
                  {msg.subject && msg.sender === 'user' && (
                    <span className="text-xs text-gray-400 mb-1 mr-1">Re: {msg.subject}</span>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                    {msg.sender === 'user' && (
                      <>
                        {msg.status === 'responded' ? (
                          <CheckCircle className="w-3 h-3 text-primary" />
                        ) : (
                          <Clock className="w-3 h-3 text-gray-400" />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2 flex-shrink-0 self-end mb-1 shadow-sm">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-end gap-2 mb-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card rounded-t-none border-t-0"
      >
        {!hasStarted && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Subject (e.g. Academic Stress, Career Guidance...)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        )}
        <div className="flex items-end gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Press Enter to send)"
            rows={2}
            className="input-field resize-none flex-1 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="btn-primary flex-shrink-0 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed h-[52px] px-5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Your messages are confidential and sent directly to a counselor via the Inquiry Manager.
        </p>
      </motion.div>
    </div>
  )
}

export default Chat