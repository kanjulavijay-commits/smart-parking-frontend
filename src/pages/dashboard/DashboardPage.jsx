import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, CreditCard, MapPin, Clock, Plus, ArrowRight } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import { paymentsApi } from '../../api/payments'
import useAuthStore from '../../store/authStore'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'

const STATUS_BADGE = {
  confirmed: 'badge-green',
  pending:   'badge-yellow',
  cancelled: 'badge-red',
  completed: 'badge-blue',
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [bookings, setBookings]   = useState([])
  const [payments, setPayments]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      bookingsApi.getMyBookings({ limit: 5 }),
      paymentsApi.getMyPayments({ limit: 5 }),
    ]).then(([b, p]) => {
      setBookings(b.data.results ?? b.data)
      setPayments(p.data.results ?? p.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const active    = bookings.filter((b) => b.status === 'confirmed').length
  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {getGreeting()}, {user?.first_name || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening with your parking.</p>
        </div>
        <Link to="/parking" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Book Slot
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings"  value={bookings.length}       icon={CalendarCheck} color="blue" />
        <StatCard title="Active Now"      value={active}                icon={MapPin}        color="green" />
        <StatCard title="Total Spent"     value={`₹${totalPaid.toFixed(0)}`} icon={CreditCard} color="yellow" />
        <StatCard title="This Month"      value={thisMonthCount(bookings)} icon={Clock}      color="blue" />
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Bookings</h2>
          <Link to="/bookings" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <CalendarCheck className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No bookings yet.</p>
            <Link to="/parking" className="btn-primary inline-flex mt-4 text-sm">Find Parking</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Link
                key={b.id}
                to={`/bookings/${b.id}`}
                className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{b.slot_info?.lot_name || 'Parking Slot'}</p>
                    <p className="text-xs text-gray-500">{formatDate(b.start_time)}</p>
                  </div>
                </div>
                <span className={STATUS_BADGE[b.status] || 'badge-blue'}>{b.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function thisMonthCount(bookings) {
  const now = new Date()
  return bookings.filter((b) => {
    const d = new Date(b.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
