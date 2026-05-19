import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, CreditCard, MapPin, Clock, Plus, ArrowRight, TrendingUp, Zap, Brain, Activity } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import { paymentsApi } from '../../api/payments'
import { aiApi } from '../../api/ai'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'

const STATUS_BADGE = {
  confirmed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  pending:   'bg-yellow-500/10  border-yellow-500/20  text-yellow-400',
  cancelled: 'bg-red-500/10    border-red-500/20    text-red-400',
  completed: 'bg-brand-500/10  border-brand-500/20  text-brand-400',
}

const AI_MODELS = [
  { name: 'CNN',  desc: 'VISION',    dot: 'bg-violet-400',  color: 'text-violet-400' },
  { name: 'RF',   desc: 'FORECAST',  dot: 'bg-sky-400',     color: 'text-sky-400' },
  { name: 'LSTM', desc: 'DEMAND',    dot: 'bg-brand-400',   color: 'text-brand-400' },
  { name: 'SVM',  desc: 'CLASS.',    dot: 'bg-emerald-400', color: 'text-emerald-400' },
]

const fade = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }) }

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      bookingsApi.getMyBookings({ limit: 5 }),
      paymentsApi.getMyPayments({ limit: 5 }),
      aiApi.getLSTMForecast().catch(() => null),
    ]).then(([b, p, f]) => {
      setBookings(b.data.results ?? b.data)
      setPayments(p.data.results ?? p.data)
      if (f) setForecast(f.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const active    = bookings.filter((b) => b.status === 'confirmed').length
  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const firstName = user?.full_name?.split(' ')[0]?.toUpperCase() || 'OPERATOR'

  const STATS = [
    { title: 'TOTAL BOOKINGS', value: bookings.length, icon: CalendarCheck, color: 'blue' },
    { title: 'ACTIVE NOW',     value: active,           icon: MapPin,        color: 'green' },
    { title: 'TOTAL SPENT',    value: `₹${totalPaid.toFixed(0)}`, icon: CreditCard, color: 'yellow' },
    { title: 'THIS MONTH',     value: thisMonthCount(bookings), icon: Clock, color: 'orange' },
  ]

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">LOADING INTEL...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible" className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// {getGreeting()}</p>
          <h1 className="text-2xl font-black text-white tracking-tight">
            WELCOME, <span className="text-brand-500">{firstName}</span>
          </h1>
          <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wide">AI-POWERED PARKING INTELLIGENCE ONLINE</p>
        </div>
        <Link
          to="/parking"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black px-4 py-2.5 rounded-xl transition-all duration-200 uppercase tracking-widest text-xs"
        >
          <Plus className="w-4 h-4" />
          BOOK SLOT
        </Link>
      </motion.div>

      {/* AI Status Bar */}
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible"
        className="flex items-center gap-3 bg-black border border-white/6 rounded-xl px-5 py-3"
      >
        <Brain className="w-3.5 h-3.5 text-gray-700" />
        <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">AI ENGINE</span>
        <div className="w-px h-4 bg-white/8 mx-1" />
        {AI_MODELS.map((m) => (
          <div key={m.name} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 ${m.dot} rounded-full animate-pulse`} />
            <span className={`text-[9px] font-mono font-bold ${m.color}`}>{m.name}</span>
            <span className="text-[9px] font-mono text-gray-700 hidden sm:inline">{m.desc}</span>
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] font-mono text-emerald-400 font-bold">LIVE</span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => {
          const colorMap = {
            blue:   { border: 'border-brand-500/20',   icon: 'text-brand-400',   bg: 'bg-brand-500/8',   bar: 'bg-brand-500' },
            green:  { border: 'border-emerald-500/20', icon: 'text-emerald-400', bg: 'bg-emerald-500/8', bar: 'bg-emerald-400' },
            yellow: { border: 'border-yellow-500/20',  icon: 'text-yellow-400',  bg: 'bg-yellow-500/8',  bar: 'bg-yellow-500' },
            orange: { border: 'border-brand-500/20',   icon: 'text-brand-400',   bg: 'bg-brand-500/8',   bar: 'bg-brand-500' },
          }
          const c = colorMap[s.color]
          return (
            <motion.div key={s.title} custom={2 + i} variants={fade} initial="hidden" animate="visible"
              whileHover={{ scale: 1.03 }}
              className={`relative bg-black border ${c.border} rounded-2xl p-5 overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-px ${c.bar} opacity-50`} />
              <div className="flex items-start justify-between mb-4">
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{s.title}</p>
                <div className={`w-7 h-7 ${c.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`w-3.5 h-3.5 ${c.icon}`} />
                </div>
              </div>
              <p className="text-3xl font-black text-white font-mono">{s.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* LSTM Forecast */}
      {forecast?.next_4_hours && (
        <motion.div custom={6} variants={fade} initial="hidden" animate="visible"
          className="bg-black border border-white/6 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-500/8 border border-brand-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">LSTM DEMAND FORECAST</h2>
                <p className="text-[9px] font-mono text-gray-700 mt-0.5 uppercase">NEXT 4 HOURS · LONG SHORT-TERM MEMORY</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-brand-400 bg-brand-500/8 border border-brand-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest">AI ACTIVE</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {forecast.next_4_hours.map((h, i) => (
              <motion.div
                key={h.hour}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white/2 border border-white/5 rounded-xl p-3 text-center"
              >
                <p className="text-[9px] font-mono text-gray-700 uppercase mb-3">{h.hour_label}</p>
                <div className="relative h-16 flex items-end justify-center mb-3">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(h.occupancy * 64, 4)}px` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    className="w-8 rounded-t"
                    style={{ background: h.occupancy > 0.8 ? '#ef4444' : h.occupancy > 0.6 ? '#f97316' : h.occupancy > 0.4 ? '#eab308' : '#22c55e' }}
                  />
                </div>
                <p className="text-xl font-black text-white font-mono">{h.occupancy_pct}%</p>
                <p className="text-[9px] font-mono text-gray-700 mt-0.5 uppercase">{h.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Bookings */}
      <motion.div custom={7} variants={fade} initial="hidden" animate="visible"
        className="bg-black border border-white/6 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-0.5">// BOOKING LOG</p>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">RECENT BOOKINGS</h2>
          </div>
          <Link to="/bookings" className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-brand-500 hover:text-brand-400 uppercase tracking-widest transition-colors">
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/6 rounded-xl">
            <div className="w-14 h-14 bg-white/3 border border-white/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="w-6 h-6 text-gray-700" />
            </div>
            <p className="text-xs font-mono text-gray-700 uppercase tracking-widest mb-4">NO MISSIONS LOGGED</p>
            <Link to="/parking" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all">
              <Zap className="w-3.5 h-3.5" /> DEPLOY NOW
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link
                  to={`/bookings/${b.id}`}
                  className="flex items-center justify-between p-4 bg-white/2 hover:bg-white/4 border border-white/5 hover:border-brand-500/20 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-500/8 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-wide">
                        {b.slot_info?.lot_name || 'PARKING SLOT'}
                      </p>
                      <p className="text-[10px] font-mono text-gray-700">{formatDate(b.start_time)}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono font-bold border px-3 py-1 rounded-lg uppercase tracking-widest ${STATUS_BADGE[b.status] || STATUS_BADGE.completed}`}>
                    {b.status}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'GOOD MORNING' : h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'
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
