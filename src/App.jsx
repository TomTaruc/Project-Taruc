import { Routes, Route, Navigate } from 'react-router-dom'
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
import AdminDashboard from './pages/admin/Dashboard'
import ManageAppointments from './pages/admin/ManageAppointments'
import ClientRecords from './pages/admin/ClientRecords'
import Announcements from './pages/admin/Announcements'

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

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
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
                <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/appointments" element={<ProtectedRoute adminOnly><ManageAppointments /></ProtectedRoute>} />
                <Route path="/admin/records" element={<ProtectedRoute adminOnly><ClientRecords /></ProtectedRoute>} />
                <Route path="/admin/announcements" element={<ProtectedRoute adminOnly><Announcements /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
              </Routes>
            </main>
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