import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Bell, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [aptData, notifData] = await Promise.all([
          api.appointments.getUserAppointments(),
          api.notifications.getUserNotifications()
        ]);
        
        setAppointments(aptData || []);
        setNotifications(notifData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Clock className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading dashboard...</span>
      </div>
    );
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here is your counseling overview for today.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="card bg-blue-50 border-blue-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Upcoming</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{upcomingAppointments}</p>
          <p className="text-sm text-gray-600 mt-1">Confirmed sessions</p>
        </div>

        <div className="card bg-yellow-50 border-yellow-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingAppointments}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting approval</p>
        </div>

        <div className="card bg-purple-50 border-purple-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{unreadNotifications}</p>
          <p className="text-sm text-gray-600 mt-1">Unread alerts</p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Recent Appointments
            </h2>
            <Link to="/user/my-appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {appointments.length > 0 ? (
              appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{apt.type}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(apt.status)}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {apt.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p>No recent appointments found.</p>
                <Link to="/user/book-appointment" className="text-blue-600 hover:underline mt-2 inline-block">Book a session today</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              Notifications
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className={`p-6 flex gap-4 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                  <div className="mt-1">
                    {notif.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : notif.type === 'alert' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p>You are all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
