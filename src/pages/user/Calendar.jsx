import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { appointments } from '../../utils/mockData'

const Calendar = () => {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  const userAppointments = appointments.filter(apt => apt.userId === user?.id)

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getAppointmentsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return userAppointments.filter(apt => apt.date === dateStr)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 md:p-4"></div>)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayAppointments = getAppointmentsForDay(day)
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()

    days.push(
      <div
        key={day}
        className={`p-2 md:p-4 border border-gray-200 min-h-24 ${
          isToday ? 'bg-primary/5 border-primary' : 'bg-white'
        }`}
      >
        <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-primary' : 'text-gray-900'}`}>
          {day}
        </div>
        <div className="space-y-1">
          {dayAppointments.map((apt) => (
            <div
              key={apt.id}
              className={`text-xs p-1 rounded ${
                apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{apt.time}</span>
              </div>
              <div className="truncate">{apt.type}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-gray-600">View your appointment schedule</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200 text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 border border-gray-200">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="p-2 md:p-4 bg-gray-50 border-b border-gray-200 text-center font-semibold text-gray-900 text-sm"
            >
              {dayName}
            </div>
          ))}
          {days}
        </div>

        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-gray-700">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/10 border border-primary rounded"></div>
            <span className="text-gray-700">Today</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
        {userAppointments.filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed').length > 0 ? (
          <div className="space-y-3">
            {userAppointments
              .filter(apt => apt.status !== 'cancelled' && apt.status !== 'completed')
              .slice(0, 5)
              .map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-gray-900">{apt.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {apt.time}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${
                    apt.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Calendar
