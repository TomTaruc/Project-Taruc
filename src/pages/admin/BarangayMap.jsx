import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Map, Users, TrendingUp } from 'lucide-react'
import { api } from '../../services/api'
import showToast from '../../components/Toast'

const BarangayMap = () => {
  const [barangays, setBarangays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchBarangays = async () => {
      try {
        const data = await api.barangays.getAll()
        if (isMounted) setBarangays(data || [])
      } catch (error) {
        console.error("Error fetching barangay data:", error)
        if (isMounted) showToast.error("Failed to load barangay demographic data.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBarangays()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading geographical data...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Barangay Demographics</h1>
        <p className="text-gray-600">Overview of client distribution across different barangays.</p>
      </motion.div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Map className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Client Distribution</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4">Barangay Name</th>
                <th className="p-4">Active Clients</th>
                <th className="p-4">Total Cases</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {barangays.length > 0 ? (
                barangays.map((bgy) => (
                  <tr key={bgy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{bgy.name}</td>
                    <td className="p-4 text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {bgy.active_clients || 0}
                    </td>
                    <td className="p-4 text-gray-600">{bgy.total_cases || 0}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${bgy.active_clients > 10 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {bgy.active_clients > 10 ? 'High Activity' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No barangay data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BarangayMap