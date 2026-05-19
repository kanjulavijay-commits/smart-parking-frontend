import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, CreditCard, MapPin, Clock, Plus, ArrowRight, TrendingUp, Zap, Brain, Activity } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import { paymentsApi } from '../../api/payments'
import { aiApi } from '../../api/ai'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'
import TiltCard from '../../components/ui/TiltCard'

const STATUS_BADGE = {
  confirmed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  pending:   'bg-yellow-500/10  border-yellow-500/20  text-yellow-400',
  cancelled: 'bg-red-500/10    border-red-500/20    text-red-400',
  completed: 'bg-brand-500/10  border-brand-500/20  text-brand-400',
}

const AI_MODELS = [
  { name: 'CNN',  desc: 'VISION',   dot: 'bg-violet-400',  color: 'text-violet-400' },
  { name: 'RF',   desc: 'FORECAST', dot: 'bg-sky-400',     color: 'text-sky-400' },
  { name: 'LSTM', desc: 'DEMAND',   dot: 'bg-brand-400',   color: 'text-brand-400' },
  { name: 'SVM',  desc: 'CLASS.',   dot: 'bg-emerald-400', color: 'text-emerald-400' },
]

function Counter({ target, prefix = '', suffix = '', duration = 1800 }) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * numericTarget))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  const displayVal = typeof target === 'string' && target.includes('.')
    ? value.toFixed(0)
    : value

  return <span>{prefix}{displayVal}{suffix}</span>
}

const CARD_THEMES = {
  rose: {
    border: 'rgba(183,110,121,0.25)',
    glow:   'rgba(183,110,121,0.15)',
    top:    'linear-gradient(90deg, #B76E79, #AD7B5E)',
    icon:   'rgba(183,110,121,0.15)',
    text:   '#C9A0B8',
    num:    '#B76E79',
  },
  emerald: {
    border: 'rgba(16,185,129,0.25)',
    glow:   'rgba(16,185,129,0.12)',
    top:    'linear-gradient(90deg, #10b981, #059669)',
    icon:   'rgba(16,185,129,0.12)',
    text:   '#34d399',
    num:    '#10b981',
  },
  amber: {
    border: 'rgba(234,179,8,0.25)',
    glow:   'rgba(234,179,8,0.10)',
    top:    'linear-gradient(90deg, #eab308, #ca8a04)',
    icon:   'rgba(234,179,8,0.10)',
    text:   '#fbbf24',
    num:    '#eab308',
  },
  copper: {
    border: 'rgba(173,123,94,0.30)',
    glow:   'rgba(173,123,94,0.15)',
    top:    'linear-gradient(90deg, #AD7B5E, #8B503E)',
    icon:   'rgba(173,123,94,0.15)',
    text:   '#C9A0B8',
    num:    '#AD7B5E',
  },
}

const fade = { hidden: { opacity: 0, y: 24 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.23,1,0.32,1] } }) }

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
    { title: 'TOTAL BOOKINGS', value: bookings.length,               prefix: '',  suffix: '',  icon: CalendarCheck, theme: 'rose' },
    { title: 'ACTIVE NOW',     value: active,                        prefix: '',  suffix: '',  icon: MapPin,        theme: 'emerald' },
    { title: 'TOTAL SPENT',    value: totalPaid.toFixed(0),          prefix: '₹', suffix: '',  icon: CreditCard,    theme: 'amber' },
    { title: 'THIS MONTH',     value: thisMonthCount(bookings),      prefix: '',  suffix: '',  icon: Clock,         theme: 'copper' },
  ]

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <p className="text-[10px] text-gray-700 uppercase tracking-widest animate-pulse" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        LOADING INTEL...
      </p>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible" className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-brand-500/60 uppercase tracking-widest mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            // {getGreeting()}
          </p>
          <h1 className="text-3xl font-black tracking-tight leading-none" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            WELCOME,{' '}
            <span style={{
              background: 'linear-gradient(135deg,#C9A0B8,#B76E79,#AD7B5E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(183,110,121,0.5))',
            }}>
              {firstName}
            </span>
          </h1>
          <p className="text-xs text-gray-600 mt-2 uppercase tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            AI-POWERED PARKING INTELLIGENCE ONLINE
          </p>
        </div>
        <Link
          to="/parking"
          className="shine flex items-center gap-2 font-black px-5 py-3 rounded-xl transition-all duration-300 uppercase tracking-widest text-xs hover:scale-105 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg,#B76E79,#AD7B5E)',
            boxShadow: '0 4px 24px rgba(183,110,121,0.35), 0 0 0 1px rgba(183,110,121,0.2)',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#fff',
          }}
        >
          <Plus className="w-4 h-4" />
          BOOK SLOT
        </Link>
      </motion.div>

      {/* ── AI Status Bar ── */}
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(183,110,121,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Brain className="w-3.5 h-3.5 text-brand-500/60" />
          <span className="text-[9px] text-gray-600 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>AI ENGINE</span>
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
          {AI_MODELS.map((m) => (
            <div key={m.name} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 ${m.dot} rounded-full animate-pulse`} />
              <span className={`text-[9px] font-bold ${m.color}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{m.name}</span>
              <span className="text-[9px] text-gray-700 hidden sm:inline" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{m.desc}</span>
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>LIVE</span>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => {
          const t = CARD_THEMES[s.theme]
          return (
            <motion.div key={s.title} custom={2 + i} variants={fade} initial="hidden" animate="visible">
              <TiltCard intensity={10} className="h-full">
                <div className="relative rounded-2xl overflow-hidden h-full"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: `1px solid ${t.border}`,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 30px ${t.glow}`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: t.top }} />

                  {/* Corner glow */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full" style={{ background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)` }} />

                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-5">
                      <p className="text-[9px] uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace', color: t.text, opacity: 0.7 }}>{s.title}</p>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.icon }}>
                        <s.icon className="w-4 h-4" style={{ color: t.text }} />
                      </div>
                    </div>

                    <p className="text-4xl font-black leading-none" style={{ fontFamily: 'Orbitron, sans-serif', color: t.num, textShadow: `0 0 20px ${t.glow}` }}>
                      <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                    </p>

                    {/* Scan line effect */}
                    <div className="absolute left-0 right-0 h-px opacity-20" style={{ background: `linear-gradient(90deg, transparent, ${t.text}, transparent)`, animation: 'scan 3s linear infinite' }} />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )
        })}
      </div>

      {/* ── LSTM Forecast ── */}
      {forecast?.next_4_hours && (
        <motion.div custom={6} variants={fade} initial="hidden" animate="visible">
          <TiltCard intensity={4} glare={false}>
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.3) 100%)',
                border: '1px solid rgba(183,110,121,0.15)',
                boxShadow: '0 8px 60px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 -translate-y-16 opacity-30"
                style={{ background: 'radial-gradient(ellipse, rgba(183,110,121,0.3) 0%, transparent 70%)' }}
              />

              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(183,110,121,0.12)', border: '1px solid rgba(183,110,121,0.25)', boxShadow: '0 0 20px rgba(183,110,121,0.15)' }}
                  >
                    <TrendingUp className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      LSTM FORECAST
                    </h2>
                    <p className="text-[9px] text-gray-600 mt-0.5 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      NEXT 4 HOURS · LONG SHORT-TERM MEMORY
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-brand-400 px-3 py-1.5 rounded-lg uppercase tracking-widest"
                  style={{ background: 'rgba(183,110,121,0.1)', border: '1px solid rgba(183,110,121,0.25)', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  AI ACTIVE
                </span>
              </div>

              <div className="relative grid grid-cols-4 gap-3">
                {forecast.next_4_hours.map((h, i) => {
                  const occ = h.occupancy
                  const barColor = occ > 0.8 ? '#ef4444' : occ > 0.6 ? '#f97316' : occ > 0.4 ? '#eab308' : '#22c55e'
                  const barGlow  = occ > 0.8 ? 'rgba(239,68,68,0.4)' : occ > 0.6 ? 'rgba(249,115,22,0.4)' : occ > 0.4 ? 'rgba(234,179,8,0.4)' : 'rgba(34,197,94,0.4)'
                  return (
                    <motion.div
                      key={h.hour}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <p className="text-[9px] text-gray-600 uppercase mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{h.hour_label}</p>
                      <div className="relative h-16 flex items-end justify-center mb-4">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(occ * 64, 4)}px` }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.23,1,0.32,1] }}
                          className="w-10 rounded-t-lg"
                          style={{ background: `linear-gradient(0deg, ${barColor}cc, ${barColor})`, boxShadow: `0 0 16px ${barGlow}` }}
                        />
                      </div>
                      <p className="text-2xl font-black text-white leading-none" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: `0 0 15px ${barGlow}` }}>
                        {h.occupancy_pct}%
                      </p>
                      <p className="text-[9px] text-gray-600 mt-1 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{h.label}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      )}

      {/* ── Recent Bookings ── */}
      <motion.div custom={7} variants={fade} initial="hidden" animate="visible">
        <div className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.3) 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] text-gray-700 uppercase tracking-widest mb-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>// BOOKING LOG</p>
              <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>RECENT BOOKINGS</h2>
            </div>
            <Link to="/bookings"
              className="flex items-center gap-1.5 text-[9px] font-bold text-brand-500 hover:text-brand-400 uppercase tracking-widest transition-colors"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <CalendarCheck className="w-6 h-6 text-gray-700" />
              </div>
              <p className="text-xs text-gray-700 uppercase tracking-widest mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>NO MISSIONS LOGGED</p>
              <Link to="/parking"
                className="shine inline-flex items-center gap-2 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#B76E79,#AD7B5E)', boxShadow: '0 4px 20px rgba(183,110,121,0.3)', fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                <Zap className="w-3.5 h-3.5" /> DEPLOY NOW
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, ease: [0.23,1,0.32,1] }}>
                  <Link
                    to={`/bookings/${b.id}`}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 group hover:scale-[1.01]"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid rgba(183,110,121,0.2)'; e.currentTarget.style.background = 'rgba(183,110,121,0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(183,110,121,0.1)', border: '1px solid rgba(183,110,121,0.2)' }}
                      >
                        <MapPin className="w-4 h-4 text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {b.slot_info?.lot_name || 'PARKING SLOT'}
                        </p>
                        <p className="text-[10px] text-gray-700" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatDate(b.start_time)}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold border px-3 py-1 rounded-lg uppercase tracking-widest ${STATUS_BADGE[b.status] || STATUS_BADGE.completed}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {b.status}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
