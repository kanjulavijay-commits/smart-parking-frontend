import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, MapPin, ChevronRight, Plus } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import Spinner from '../../components/ui/Spinner'

const STATUS_STYLE = {
  confirmed: { class: 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400', bar: 'bg-emerald-400' },
  pending:   { class: 'bg-yellow-500/8  border-yellow-500/20  text-yellow-400',  bar: 'bg-yellow-400' },
  cancelled: { class: 'bg-red-500/8     border-red-500/20     text-red-400',     bar: 'bg-red-400' },
  completed: { class: 'bg-brand-500/8   border-brand-500/20   text-brand-400',   bar: 'bg-brand-400' },
}

const FILTERS = ['all', 'confirmed', 'pending', 'completed', 'cancelled']

const fade = { hidden: { opacity: 0, y: 16 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }) }

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
    <div className="space-y-6">
      {/* Header */}
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible" className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// MISSION LOG</p>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">MY BOOKINGS</h1>
          <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wide">{bookings.length} TOTAL DEPLOYMENTS</p>
        </div>
        <Link
          to="/parking"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black px-4 py-2.5 rounded-xl transition-all duration-200 uppercase tracking-widest text-xs"
        >
          <Plus className="w-4 h-4" />
          NEW BOOKING
        </Link>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const isActive = filter === f
          const style = f !== 'all' ? STATUS_STYLE[f] : null
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[9px] font-mono font-bold whitespace-nowrap uppercase tracking-widest transition-all border ${
                isActive
                  ? f === 'all'
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-400'
                    : `${style?.class} border-current`
                  : 'bg-black border-white/6 text-gray-600 hover:text-gray-300 hover:border-white/12'
              }`}
            >
              {f}
            </button>
          )
        })}
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">LOADING MISSIONS...</p>
        </div>
      ) : shown.length === 0 ? (
        <div className="border border-dashed border-white/6 rounded-2xl py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-white/2 border border-white/6 rounded-2xl flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-gray-700" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">NO MISSIONS IN THIS CATEGORY</p>
          </div>
          <Link to="/parking" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all">
            FIND PARKING
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {shown.map((b, i) => {
            const style = STATUS_STYLE[b.status] || STATUS_STYLE.completed
            return (
              <motion.div key={b.id} custom={i} variants={fade} initial="hidden" animate="visible">
                <Link
                  to={`/bookings/${b.id}`}
                  className="relative flex items-center justify-between p-4 bg-black border border-white/6 hover:border-brand-500/20 rounded-xl transition-all duration-200 group overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${style.bar}`} />
                  <div className="flex items-center gap-4 pl-3">
                    <div className="w-10 h-10 bg-brand-500/8 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-4.5 h-4.5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-gray-200 group-hover:text-white uppercase tracking-wide transition-colors">
                        {b.slot_info?.lot_name || `BOOKING #${b.id}`}
                      </p>
                      <p className="text-[10px] font-mono text-gray-600 mt-0.5">
                        SLOT {b.slot_info?.slot_number || b.slot} · {formatDate(b.start_time)}
                      </p>
                      <p className="text-[9px] font-mono text-gray-700 mt-0.5">
                        {formatDate(b.start_time)} → {formatDate(b.end_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-mono font-bold border px-3 py-1.5 rounded-lg uppercase tracking-widest ${style.class}`}>
                      {b.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-brand-400 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
