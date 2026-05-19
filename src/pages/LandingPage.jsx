import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Camera, BarChart2, Brain, Layers, ArrowRight, Zap, Shield, ChevronDown } from 'lucide-react'
import { ContainerScroll } from '../components/ui/container-scroll-animation'

// ── Grid background overlay
const GridBg = () => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: 'linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
  }} />
)

// ── Orange scan line accent
const ScanLine = () => (
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
)

const AI_MODELS = [
  { icon: Camera,   name: 'CNN VISION',      tag: 'COMPUTER VISION',   desc: 'MobileNetV2 analyzes live camera feeds. Detects occupied vs available in real-time.',  metric: '98%',  metricLabel: 'DETECTION ACCURACY' },
  { icon: Layers,   name: 'RANDOM FOREST',   tag: 'ENSEMBLE LEARNING', desc: 'Next-hour availability prediction using time-of-day, weekday, and historical data.', metric: '94%',  metricLabel: 'PREDICTION ACCURACY' },
  { icon: BarChart2,name: 'LSTM NETWORK',    tag: 'TIME SERIES AI',    desc: 'Forecasts parking demand 4 hours ahead with sequence modeling on booking patterns.',  metric: '4HR',  metricLabel: 'FORECAST WINDOW' },
  { icon: Brain,    name: 'SVM CLASSIFIER',  tag: 'PATTERN RECOGNITION',desc: 'Classifies parking patterns, flags anomalies, and powers smarter lot management.',   metric: '91%',  metricLabel: 'CLASSIFICATION SCORE' },
]

const SLOT_DATA = [
  'occupied','available','occupied','occupied','reserved','available','occupied','occupied',
  'available','occupied','occupied','available','occupied','occupied','reserved','occupied',
  'available','available','occupied','occupied','reserved','occupied','available','occupied',
  'occupied','occupied','available','occupied','occupied','available','occupied','occupied',
]

function DashboardPreview() {
  return (
    <div className="h-full bg-black flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', monospace" }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0d] border-b border-orange-500/20 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-600/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-600/80" />
          <div className="w-3 h-3 rounded-full bg-green-600/80" />
        </div>
        <span className="ml-2 text-[10px] text-orange-500/70 font-mono uppercase tracking-widest">PARKSMART // COMMAND CENTER</span>
        <div className="ml-auto flex gap-2">
          {['CNN', 'RF', 'LSTM', 'SVM'].map(m => (
            <span key={m} className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 rounded px-1.5 py-0.5 text-[9px] font-mono text-orange-400 uppercase">
              <span className="w-1 h-1 bg-orange-400 rounded-full inline-block animate-pulse" />{m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-36 sm:w-44 bg-[#080808] border-r border-orange-500/10 p-3 flex flex-col gap-3 shrink-0">
          <p className="text-[8px] font-mono text-orange-500/50 uppercase tracking-widest border-b border-orange-500/10 pb-1.5">LIVE TELEMETRY</p>
          {[
            { label: 'AVAILABLE', val: 11, color: 'text-emerald-400' },
            { label: 'OCCUPIED',  val: 18, color: 'text-red-400' },
            { label: 'RESERVED',  val: 3,  color: 'text-orange-400' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[8px] text-gray-600 font-mono mb-0.5">{s.label}</p>
              <p className={`text-3xl font-black font-mono ${s.color}`}>{s.val}</p>
            </div>
          ))}
          <div className="mt-auto">
            <p className="text-[8px] font-mono text-orange-500/50 mb-1.5 uppercase tracking-widest">LSTM · +4HR</p>
            <div className="flex items-end gap-0.5 h-10">
              {[55, 70, 85, 92].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${v}%`, background: v > 80 ? '#ef4444' : v > 65 ? '#f97316' : '#22c55e' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Parking grid */}
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">LOT A // CNN LIVE VIEW</h3>
              <p className="text-[8px] text-orange-500/50 font-mono">UPDATED 0.4s AGO</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-orange-400 uppercase">LIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {SLOT_DATA.map((status, i) => (
              <div key={i} className={`aspect-square rounded-sm text-[7px] font-mono font-bold flex items-center justify-center
                ${status === 'occupied' ? 'bg-red-500/20 border border-red-500/60 text-red-400' :
                  status === 'reserved' ? 'bg-orange-500/20 border border-orange-500/60 text-orange-400' :
                  'bg-emerald-500/20 border border-emerald-500/60 text-emerald-400'}`}>
                {String(i + 1).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-lg tracking-tight">PARK<span className="text-brand-500">SMART</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors font-medium px-4 py-2">
            SIGN IN
          </Link>
          <Link to="/register" className="text-sm bg-brand-500 hover:bg-brand-400 text-black font-black px-5 py-2 rounded-lg transition-all duration-200 uppercase tracking-wide">
            GET STARTED →
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-black">
        <GridBg />
        <ScanLine />

        {/* Orange diagonal accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5"
          style={{ background: 'linear-gradient(135deg, transparent 40%, #f97316 100%)' }} />
        <div className="absolute bottom-0 left-0 w-px h-2/3 bg-gradient-to-t from-brand-500/30 to-transparent" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto w-full"
        >
          {/* Status badge */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
            <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-brand-400 uppercase tracking-widest">4 AI ENGINES · ONLINE</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-[90px] font-black leading-none tracking-tighter">
              <span className="text-white">FIND.</span>
              <br />
              <span className="text-white">PARK.</span>
              <br />
              <span className="text-brand-500">DOMINATE.</span>
            </h1>
          </motion.div>

          <motion.div variants={fadeUp} className="max-w-xl mb-10">
            <p className="text-gray-400 text-lg leading-relaxed">
              The only parking platform with <span className="text-white font-semibold">CNN · Random Forest · LSTM · SVM</span> running live — real-time slot detection, 4-hour demand forecast, instant booking.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <Link
              to="/register"
              className="group flex items-center gap-3 bg-brand-500 hover:bg-brand-400 text-black font-black px-8 py-4 rounded-xl transition-all duration-200 uppercase tracking-wider text-sm hover:scale-105"
            >
              START FREE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-3 border border-white/15 hover:border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 uppercase tracking-wider text-sm"
            >
              SIGN IN
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-0 border border-white/8 rounded-2xl overflow-hidden max-w-lg">
            {[
              { val: '4',      label: 'AI MODELS',   sub: 'CNN·RF·LSTM·SVM' },
              { val: '98%',    label: 'ACCURACY',    sub: 'SLOT DETECTION' },
              { val: '<500ms', label: 'LATENCY',     sub: 'REAL-TIME' },
            ].map((s, i) => (
              <div key={s.label} className={`p-5 ${i < 2 ? 'border-r border-white/8' : ''} bg-white/2 hover:bg-white/4 transition-colors`}>
                <p className="text-2xl font-black font-mono text-brand-500">{s.val}</p>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest mt-1">{s.label}</p>
                <p className="text-[9px] text-gray-600 font-mono mt-0.5">{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-700">
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── Dashboard Preview ──────────────────────── */}
      <section className="relative bg-black px-6">
        <div className="absolute inset-0"><GridBg /></div>
        <ContainerScroll
          titleComponent={
            <div className="mb-8 text-left max-w-5xl mx-auto px-0">
              <p className="text-xs font-mono text-brand-500 mb-3 uppercase tracking-[0.3em]">// INTELLIGENCE HUB</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                COMMAND CENTER.<br />
                <span className="text-brand-500">LIVE & LETHAL.</span>
              </h2>
              <p className="text-gray-500 mt-4 text-base font-mono">
                Real-time parking grid · AI model telemetry · LSTM 4-hour forecast
              </p>
            </div>
          }
        >
          <DashboardPreview />
        </ContainerScroll>
      </section>

      {/* ── AI Models ──────────────────────────────── */}
      <section className="py-24 px-6 bg-black relative">
        <div className="absolute inset-0"><GridBg /></div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-xs font-mono text-brand-500 mb-3 uppercase tracking-[0.3em]">// AI ENGINE ROOM</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              FOUR MODELS.<br /><span className="text-brand-500">ONE MISSION.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {AI_MODELS.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(249,115,22,0.04)' }}
                className="bg-black p-8 group cursor-default transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 border border-brand-500/30 bg-brand-500/5 rounded-lg flex items-center justify-center group-hover:border-brand-500/60 group-hover:bg-brand-500/10 transition-all">
                    <m.icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black font-mono text-brand-500">{m.metric}</p>
                    <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{m.metricLabel}</p>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-brand-500/60 uppercase tracking-[0.2em] mb-2">{m.tag}</p>
                <h3 className="text-xl font-black text-white tracking-tight mb-3">{m.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                <div className="flex items-center gap-2 mt-5 pt-5 border-t border-white/5">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-brand-500/70 uppercase tracking-widest">MODEL ACTIVE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────── */}
      <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-14">
            <p className="text-xs font-mono text-brand-500 mb-3 uppercase tracking-[0.3em]">// PROTOCOL</p>
            <h2 className="text-4xl font-black text-white">3 STEPS. DONE.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: '01', icon: MapPin,  title: 'FIND',  desc: 'Browse nearby lots with live CNN camera analysis. See exactly what is occupied — in real-time.' },
              { num: '02', icon: Zap,     title: 'BOOK',  desc: 'Reserve your slot instantly. LSTM model shows you the best time to arrive.' },
              { num: '03', icon: Shield,  title: 'PARK',  desc: 'Drive in, park, pay. The system tracks your session and handles everything.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-[#050505] p-8 group hover:bg-black transition-colors"
              >
                <p className="text-6xl font-black font-mono text-white/5 mb-4 group-hover:text-brand-500/10 transition-colors">{step.num}</p>
                <div className="w-10 h-10 border border-brand-500/30 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="w-4 h-4 text-brand-500" />
                </div>
                <h3 className="text-xl font-black text-white tracking-widest mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="py-28 px-6 bg-black border-t border-brand-500/20 relative overflow-hidden">
        <div className="absolute inset-0"><GridBg /></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <p className="text-xs font-mono text-brand-500 mb-6 uppercase tracking-[0.3em]">// ZERO EXCUSES</p>
          <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
            STOP WASTING<br /><span className="text-brand-500">TIME SEARCHING.</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10 font-mono">
            4 AI models. Real-time detection. Instant booking.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-brand-500 hover:bg-brand-400 text-black font-black px-10 py-5 rounded-xl transition-all duration-200 uppercase tracking-wider text-base hover:scale-105"
          >
            DOMINATE THE CITY <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-700 text-xs font-mono mt-6">FREE TO START · NO CREDIT CARD</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-md flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-black text-sm tracking-tight">PARK<span className="text-brand-500">SMART</span></span>
          </div>
          <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">CNN · RF · LSTM · SVM</p>
        </div>
      </footer>
    </div>
  )
}
