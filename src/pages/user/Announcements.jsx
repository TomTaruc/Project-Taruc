import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Clock } from 'lucide-react';
import { api } from '../../services/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await api.announcements.getAll();
        setAnnouncements(data || []);
      } catch (error) {
        console.error('Failed to load announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Clock className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading announcements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <Megaphone className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
      </motion.div>

      {announcements.length > 0 ? (
        <div className="space-y-6">
          {announcements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                {item.priority === 'high' && (
                  <span className="badge badge-error">Important</span>
                )}
              </div>
              <p className="text-gray-600 whitespace-pre-wrap mb-4">{item.content}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-gray-100 pt-4">
                <Calendar className="w-4 h-4" />
                <span>
                  Posted on {new Date(item.created_at).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </span>
                <span className="ml-4">By {item.created_by || 'Admin'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No active announcements at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Announcements;