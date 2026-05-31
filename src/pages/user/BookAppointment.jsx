import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const BookAppointment = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    type: 'Personal Counseling',
    date: '',
    time: '09:00 AM',
    notes: '',
    is_anonymous: false
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Structure the data
    const appointmentData = {
      user_id: user?.id,
      user_name: formData.is_anonymous ? 'Anonymous' : (user?.name || 'User'),
      user_email: formData.is_anonymous ? 'anonymous@therapath.com' : (user?.email || ''),
      user_phone: formData.is_anonymous ? 'N/A' : (user?.phone || 'N/A'),
      date: formData.date,
      time: formData.time,
      type: formData.type,
      notes: formData.notes,
      is_anonymous: formData.is_anonymous,
      status: 'pending' // Default status
    };

    try {
      // First attempt: Standard insertion
      await api.appointments.create(appointmentData);
      
      setStatus('success');
      setMessage('Your appointment has been successfully requested. We will review and confirm shortly.');
      
      // Reset form
      setFormData({
        type: 'Personal Counseling',
        date: '',
        time: '09:00 AM',
        notes: '',
        is_anonymous: false
      });
      
    } catch (error) {
      console.warn('Initial booking attempt error:', error.message);
      
      // FALLBACK: If the Postgres Database expects an Integer but receives the Auth UUID,
      // we strip the mismatched user_id and retry relying purely on the user_email.
      if (error.message && (error.message.includes('type integer') || error.message.includes('invalid input syntax'))) {
        try {
          delete appointmentData.user_id; // Remove the crashing UUID
          
          await api.appointments.create(appointmentData);
          
          setStatus('success');
          setMessage('Your appointment has been successfully requested. We will review and confirm shortly.');
          
          setFormData({
            type: 'Personal Counseling',
            date: '',
            time: '09:00 AM',
            notes: '',
            is_anonymous: false
          });
          return; // Exit on successful fallback
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          setStatus('error');
          setMessage(retryError.message || 'Failed to book appointment. Please try again.');
        }
      } else {
        setStatus('error');
        setMessage(error.message || 'Failed to book appointment. Please try again.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-600">Schedule a counseling session that fits your availability.</p>
      </div>

      <div className="card bg-white shadow-sm border border-gray-100 p-8 rounded-xl">
        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Session Type
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="Personal Counseling">Personal Counseling</option>
                <option value="Academic Counseling">Academic Counseling</option>
                <option value="Career Counseling">Career Counseling</option>
                <option value="Crisis Intervention">Crisis Intervention</option>
              </select>
            </div>

            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="is_anonymous"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleChange}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-700">
                Keep this appointment anonymous
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" /> Preferred Date
              </label>
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Preferred Time
              </label>
              <select
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              className="input-field w-full resize-none"
              placeholder="Please share any specific concerns or topics you'd like to discuss..."
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <Calendar className="w-5 h-5" />
              )}
              {status === 'loading' ? 'Submitting...' : 'Confirm Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BookAppointment;