import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, Check, X, User } from 'lucide-react';
import { api } from '../../services/api';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch all appointments across the system
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await api.appointments.getAllAdmin();
      setAppointments(data || []);
    } catch (error) {
      console.error('Failed to fetch admin appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.appointments.updateStatus(id, newStatus);
      // Update local state instantly for snappy UI
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const searchString = `${apt.user_name} ${apt.type}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Clock className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading system appointments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
        <p className="text-gray-600">Review, confirm, and update counseling sessions.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="sm:w-48 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 appearance-none w-full"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 rounded-tl-lg">Client</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{apt.user_name}</p>
                          <p className="text-xs text-gray-500">{apt.is_anonymous ? 'Anonymous Request' : apt.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> 
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {apt.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-gray-700">{apt.type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(apt.status)}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
                              title="Confirm Appointment"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Cancel Appointment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button 
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            className="text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No appointments match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageAppointments;