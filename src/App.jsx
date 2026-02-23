import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Layout/Sidebar'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/user/Dashboard'
import BookAppointment from './pages/user/BookAppointment'
import MyAppointments from './pages/user/MyAppointments'
import UserCalendar from './pages/user/Calendar'
import UserAnnouncements from './pages/user/Announcements'
import UserNotifications from './pages/user/Notifications'
import AdminDashboard from './pages/admin/Dashboard'
import ManageAppointments from './pages/admin/ManageAppointments'
import ClientRecords from './pages/admin/ClientRecords'
import Announcements from './pages/admin/Announcements'
import FollowUpReminders from './pages/admin/FollowUpReminders'
import BarangayMap from './pages/admin/BarangayMap'
import CounselorRoster from './pages/admin/CounselorRoster'
import InquiryManager from './pages/admin/InquiryManager'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/user/dashboard" replace />
  }
  
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />
  }
  
  return children
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {isAuthenticated ? (
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-0 lg:ml-64">
            <Navbar />
            <main className="flex-1 p-4 lg:p-6 bg-gray-50">
              <Routes>
                <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/user/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
                <Route path="/user/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
                <Route path="/user/calendar" element={<ProtectedRoute><UserCalendar /></ProtectedRoute>} />
                <Route path="/user/announcements" element={<ProtectedRoute><UserAnnouncements /></ProtectedRoute>} />
                <Route path="/user/notifications" element={<ProtectedRoute><UserNotifications /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/appointments" element={<ProtectedRoute adminOnly><ManageAppointments /></ProtectedRoute>} />
                <Route path="/admin/records" element={<ProtectedRoute adminOnly><ClientRecords /></ProtectedRoute>} />
                <Route path="/admin/announcements" element={<ProtectedRoute adminOnly><Announcements /></ProtectedRoute>} />
                <Route path="/admin/inquiries" element={<ProtectedRoute adminOnly><InquiryManager /></ProtectedRoute>} />
                <Route path="/admin/counselors" element={<ProtectedRoute adminOnly><CounselorRoster /></ProtectedRoute>} />
                <Route path="/admin/barangay-map" element={<ProtectedRoute adminOnly><BarangayMap /></ProtectedRoute>} />
                <Route path="/admin/follow-ups" element={<ProtectedRoute adminOnly><FollowUpReminders /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App