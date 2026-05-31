import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, User, MessageCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'
import showToast from '../../components/Toast'

const Chat = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    let isMounted = true

    const fetchMessages = async () => {
      try {
        // Fetch historical messages between user and counselor
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true })

        if (error) throw error
        if (isMounted) setMessages(data || [])
      } catch (error) {
        console.error("Chat load error:", error)
      } finally {
        if (isMounted) setLoading(false)
        scrollToBottom()
      }
    }

    if (user?.id) {
      fetchMessages()

      // Real-time subscription to catch incoming messages
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          if (isMounted) {
            setMessages(prev => [...prev, payload.new])
            scrollToBottom()
          }
        })
        .subscribe()

      return () => {
        isMounted = false
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id])

  // Scroll when new messages appear
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Construct message object
    const msgData = {
      sender_id: user.id,
      sender_name: user.name,
      // Assuming a generic counselor ID or null for broadcast in this demo schema
      receiver_id: 'counselor', 
      content: messageText,
    }

    // Optimistic UI Update
    const optimisticMsg = { ...msgData, id: Date.now().toString(), created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      const { error } = await supabase.from('messages').insert([msgData])
      if (error) throw error
    } catch (error) {
      console.error("Send failed:", error)
      // Revert optimistic update on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
      showToast.error("Failed to send message.")
      setNewMessage(messageText) // Put text back in input
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center text-gray-500 animate-pulse">Connecting to secure chat...</div>
  }

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto card p-0 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Counselor Chat</h2>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
            <p>Send a message to start the conversation.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message securely..."
            className="flex-1 input-field pr-12 py-3 bg-white"
            disabled={sending}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || sending}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white transition ${!newMessage.trim() || sending ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat