import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, MapPin, ChevronRight } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const STATUS_BADGE = {
  confirmed: 'badge-green',
  pending:   'badge-yellow',
  cancelled: 'badge-red',
  completed: 'badge-blue',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    bookingsApi.getMyBookings().then(({ data }) => {
      setBookings(data.results ?? data)
    }).finally(() => setLoading(false))
  }, [])

  const shown = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">{bookings.length} total bookings</p>
        </div>
        <Link to="/parking" className="btn-primary text-sm">+ New Booking</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all','confirmed','pending','completed','cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : shown.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings"
          description="You don't have any bookings in this category."
          action={<Link to="/parking" className="btn-primary text-sm">Find Parking</Link>}
        />
      ) : (
        <div className="space-y-3">
          {shown.map((b) => (
            <Link
              key={b.id}
              to={`/bookings/${b.id}`}
              className="card flex items-center justify-between hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-brand-600/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-100">{b.slot_info?.lot_name || `Booking #${b.id}`}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Slot {b.slot_info?.slot_number || b.slot} • {formatDate(b.start_time)}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formatDate(b.start_time)} → {formatDate(b.end_time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={STATUS_BADGE[b.status] || 'badge-blue'}>{b.status}</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
