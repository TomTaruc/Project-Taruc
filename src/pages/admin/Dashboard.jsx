import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { api } from '../../services/api'
import StatCard from '../../components/cards/StatCard'

const COLORS = ['#0CA678', '#F9C74F', '#3b82f6', '#ef4444', '#8b5cf6']

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [clientRecords, setClientRecords] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appts, inqs, records] = await Promise.all([
          api.appointments.getAllAdmin(),
          api.inquiries.getAllAdmin(),
          api.clientRecords.getAllAdmin(),
        ])
        setAppointments(appts || [])
        setInquiries(inqs || [])
        setClientRecords(records || [])

        // Build recent activity from latest items
        const activity = []
        if (appts?.length) {
          const sorted = [...appts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          sorted.slice(0, 2).forEach(a => {
            activity.push({ color: 'bg-green-500', text: `Appointment booked by ${a.user_name || a.user_email || 'a user'}`, time: a.created_at })
          })
        }
        if (inqs?.length) {
          const sorted = [...inqs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          sorted.slice(0, 1).forEach(i => {
            activity.push({ color: 'bg-yellow-500', text: `New inquiry received from ${i.name || 'Anonymous'}`, time: i.created_at })
          })
        }
        if (records?.length) {
          const sorted = [...records].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          sorted.slice(0, 1).forEach(r => {
            activity.push({ color: 'bg-primary', text: `Client record for ${r.client_name || 'a client'}`, time: r.created_at })
          })
        }
        activity.sort((a, b) => new Date(b.time) - new Date(a.time))
        setRecentActivity(activity.slice(0, 4))
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Derived stats
  const totalAppointments = appointments.length
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
  const completedAppointments = appointments.filter(a => a.status === 'completed').length
  const totalInquiries = inquiries.length
  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length
  const activeRecords = clientRecords.filter(r => r.status === 'active').length
  const uniqueClients = new Set(appointments.map(a => a.user_email)).size

  // Chart data — appointments by month (last 6 months)
  const appointmentChartData = (() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ month: MONTH_NAMES[d.getMonth()], year: d.getFullYear(), monthNum: d.getMonth(), appointments: 0 })
    }
    appointments.forEach(a => {
      if (!a.date) return
      const d = new Date(a.date)
      const entry = months.find(m => m.monthNum === d.getMonth() && m.year === d.getFullYear())
      if (entry) entry.appointments++
    })
    return months
  })()

  // Pie chart — appointments by type
  const appointmentTypeData = (() => {
    const counts = {}
    appointments.forEach(a => {
      const type = a.type || a.appointment_type || 'Other'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  })()

  const stats = [
    { icon: Calendar, title: 'Total Appointments', value: totalAppointments, color: 'primary', trend: { direction: 'up', value: '', label: 'from database' } },
    { icon: Clock, title: 'Pending', value: pendingAppointments, color: 'warning' },
    { icon: Users, title: 'Total Clients', value: uniqueClients, color: 'info', trend: { direction: 'up', value: '', label: 'unique users' } },
    { icon: MessageSquare, title: 'Inquiries', value: totalInquiries, color: 'success' },
  ]

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'just now'
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of counseling center operations and statistics</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Appointment Trends</h2>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          {appointmentChartData.every(d => d.appointments === 0) ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <p>No appointment data available yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Bar dataKey="appointments" fill="#0CA678" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Types</h2>
          {appointmentTypeData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <p>No appointment data available yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Confirmed Appointments</span>
              <span className="text-lg font-semibold text-green-600">{confirmedAppointments}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Completed Sessions</span>
              <span className="text-lg font-semibold text-blue-600">{completedAppointments}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Active Records</span>
              <span className="text-lg font-semibold text-primary">{activeRecords}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Inquiries</span>
              <span className="text-lg font-semibold text-yellow-600">{pendingInquiries}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${item.color} mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.text}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(item.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
