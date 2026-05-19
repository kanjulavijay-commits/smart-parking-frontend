import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, CreditCard, MapPin, Clock, Plus, ArrowRight, TrendingUp, Zap, Brain } from 'lucide-react'
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
  { name: 'CNN', desc: 'Vision', color: 'text-violet-400', dot: 'bg-violet-400' },
  { name: 'RF',  desc: 'Forecast', color: 'text-sky-400',    dot: 'bg-sky-400' },
  { name: 'LSTM',desc: 'Demand',   color: 'text-amber-400',  dot: 'bg-amber-400' },
  { name: 'SVM', desc: 'Class.',   color: 'text-emerald-400',dot: 'bg-emerald-400' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

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
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  )

  const STAT_CARDS = [
    { title: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'from-brand-500/20 to-brand-900/5', border: 'border-brand-500/20', iconColor: 'text-brand-400', bg: 'bg-brand-500/10' },
    { title: 'Active Now',     value: active,           icon: MapPin,        color: 'from-emerald-500/20 to-emerald-900/5', border: 'border-emerald-500/20', iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Total Spent',    value: `₹${totalPaid.toFixed(0)}`, icon: CreditCard, color: 'from-yellow-500/20 to-yellow-900/5', border: 'border-yellow-500/20', iconColor: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'This Month',     value: thisMonthCount(bookings), icon: Clock, color: 'from-purple-500/20 to-purple-900/5', border: 'border-purple-500/20', iconColor: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-7">
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            {getGreeting()}, <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">{firstName}</span> 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Your AI-powered parking intelligence is ready.</p>
        </div>
        <Link to="/parking" className="group flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-5 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-brand-600/20 hover:scale-105">
          <Plus className="w-4 h-4" />
          Book Slot
        </Link>
      </motion.div>

      {/* AI Status Bar */}
      <motion.div variants={cardVariants} className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-2xl px-5 py-3">
        <Brain className="w-4 h-4 text-gray-500" />
        <span className="text-xs text-gray-500 font-medium">AI Engine Status</span>
        <div className="flex-1 h-px bg-white/5 mx-1" />
        {AI_MODELS.map((m) => (
          <div key={m.name} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 ${m.dot} rounded-full animate-pulse`} />
            <span className={`text-xs font-semibold ${m.color}`}>{m.name}</span>
            <span className="text-xs text-gray-600 hidden sm:inline">{m.desc}</span>
          </div>
        ))}
        <span className="text-xs text-emerald-500 font-medium ml-1">● Live</span>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
              <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* LSTM Forecast */}
      {forecast?.next_4_hours && (
        <motion.div variants={cardVariants} className="bg-white/3 border border-white/8 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">LSTM Demand Forecast — Next 4 Hours</h2>
                <p className="text-xs text-gray-600">Long Short-Term Memory · {forecast.forecast_from}</p>
              </div>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-medium">AI Prediction</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {forecast.next_4_hours.map((h, i) => (
              <motion.div
                key={h.hour}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="bg-gray-900/50 border border-white/5 rounded-2xl p-3 text-center"
              >
                <p className="text-xs text-gray-500 mb-3">{h.hour_label}</p>
                <div className="relative h-16 flex items-end justify-center mb-3">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(h.occupancy * 64, 6)}px` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    className="w-10 rounded-t-lg"
                    style={{ background: h.occupancy > 0.8 ? '#ef4444' : h.occupancy > 0.6 ? '#f97316' : h.occupancy > 0.4 ? '#eab308' : '#22c55e' }}
                  />
                </div>
                <p className="text-lg font-black text-white">{h.occupancy_pct}%</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{h.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Bookings */}
      <motion.div variants={cardVariants} className="bg-white/3 border border-white/8 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Recent Bookings</h2>
          <Link to="/bookings" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm mb-4">No bookings yet — let AI find you the perfect spot.</p>
            <Link to="/parking" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors">
              <Zap className="w-4 h-4" /> Find Parking
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  to={`/bookings/${b.id}`}
                  className="flex items-center justify-between p-4 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-600/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-4.5 h-4.5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{b.slot_info?.lot_name || 'Parking Slot'}</p>
                      <p className="text-xs text-gray-600">{formatDate(b.start_time)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold border px-3 py-1 rounded-full ${STATUS_BADGE[b.status] || STATUS_BADGE.completed}`}>
                    {b.status}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
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
