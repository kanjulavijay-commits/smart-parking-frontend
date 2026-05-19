import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Camera, BarChart2, Brain, Layers, ArrowRight, Zap, Shield, Clock, ChevronDown } from 'lucide-react'
import { ContainerScroll } from '../components/ui/container-scroll-animation'
import { GlassFilter, GlassButton } from '../components/ui/liquid-glass'

const AI_MODELS = [
  {
    icon: Camera,
    name: 'CNN Vision',
    tag: 'Computer Vision',
    desc: 'MobileNetV2-based model analyzes live camera feeds to detect occupied vs available slots in real-time.',
    metric: '98%',
    metricLabel: 'Detection Accuracy',
    color: 'from-violet-500/20 to-violet-900/5',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Layers,
    name: 'Random Forest',
    tag: 'Ensemble Learning',
    desc: 'Predicts next-hour slot availability based on time-of-day, weekday patterns, and historical booking data.',
    metric: '94%',
    metricLabel: 'Prediction Accuracy',
    color: 'from-sky-500/20 to-sky-900/5',
    border: 'border-sky-500/20',
    iconColor: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    icon: BarChart2,
    name: 'LSTM Network',
    tag: 'Time Series AI',
    desc: 'Long Short-Term Memory network forecasts parking demand 4 hours ahead with sequence modeling.',
    metric: '4-hr',
    metricLabel: 'Forecast Window',
    color: 'from-amber-500/20 to-amber-900/5',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Brain,
    name: 'SVM Classifier',
    tag: 'Pattern Recognition',
    desc: 'Support Vector Machine classifies parking patterns and flags anomalies for smarter lot management.',
    metric: '91%',
    metricLabel: 'Classification Score',
    color: 'from-emerald-500/20 to-emerald-900/5',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
]

const STATS = [
  { value: '4', label: 'AI Models', sub: 'CNN · RF · LSTM · SVM' },
  { value: '98%', label: 'Accuracy', sub: 'Slot detection' },
  { value: '<500ms', label: 'Latency', sub: 'Real-time response' },
]

const STEPS = [
  { num: '01', icon: MapPin, title: 'Find a Lot', desc: 'Browse nearby parking lots with real-time availability powered by live CNN camera analysis.' },
  { num: '02', icon: Zap, title: 'Book Instantly', desc: 'Reserve your slot in seconds. Our LSTM model shows demand forecast so you pick the best time.' },
  { num: '03', icon: Shield, title: 'Park & Pay', desc: 'Drive in, park, and pay seamlessly. The system tracks your session and handles checkout.' },
]

// Mini dashboard rendered inside ContainerScroll
const SLOT_DATA = [
  'occupied','available','occupied','occupied','reserved','available','occupied','occupied',
  'available','occupied','occupied','available','occupied','occupied','reserved','occupied',
  'available','available','occupied','occupied','reserved','occupied','available','occupied',
  'occupied','occupied','available','occupied','occupied','available','occupied','occupied',
]

function DashboardPreview() {
  return (
    <div className="h-full bg-gray-950 flex flex-col overflow-hidden font-sans">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/80 border-b border-gray-800 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-gray-500 hidden sm:block">ParkSmart — Live Dashboard</span>
        <div className="ml-auto flex gap-2">
          {['CNN', 'RF', 'LSTM', 'SVM'].map(m => (
            <span key={m} className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 text-[10px] text-emerald-400">
              <span className="w-1 h-1 bg-emerald-400 rounded-full inline-block animate-pulse" />{m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-32 sm:w-44 bg-gray-900 border-r border-gray-800 p-3 flex flex-col gap-3 shrink-0">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Live Stats</p>
          {[
            { label: 'Available', val: 11, color: 'text-emerald-400' },
            { label: 'Occupied', val: 18, color: 'text-red-400' },
            { label: 'Reserved', val: 3, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[9px] text-gray-600 mb-0.5">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}

          <div className="mt-auto">
            <p className="text-[9px] text-gray-600 mb-1.5 uppercase tracking-wider">LSTM Forecast</p>
            <div className="flex items-end gap-0.5 h-10">
              {[55, 70, 85, 92].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{
                  height: `${v}%`,
                  background: v > 80 ? '#ef4444' : v > 65 ? '#f97316' : '#22c55e',
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {['Now', '+1h', '+2h', '+3h'].map(l => (
                <span key={l} className="text-[8px] text-gray-600">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="flex-1 p-3 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-semibold text-gray-200">Parking Lot A — Live View</h3>
              <p className="text-[9px] text-gray-500">CNN Vision · Updated 0.4s ago</p>
            </div>
            <div className="flex gap-2 text-[9px]">
              {[['emerald', 'Available'], ['red', 'Occupied'], ['yellow', 'Reserved']].map(([c, l]) => (
                <span key={l} className="flex items-center gap-1 text-gray-400">
                  <span className={`w-2 h-2 rounded-sm bg-${c}-500/50 border border-${c}-500`} />{l}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1">
            {SLOT_DATA.map((status, i) => (
              <div key={i} className={`aspect-square rounded text-[8px] font-bold flex items-center justify-center transition-all
                ${status === 'occupied' ? 'bg-red-500/25 border border-red-500/50 text-red-400' :
                  status === 'reserved' ? 'bg-yellow-500/25 border border-yellow-500/50 text-yellow-400' :
                  'bg-emerald-500/25 border border-emerald-500/50 text-emerald-400'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <GlassFilter />

      {/* ── Navbar ────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-gray-950/70 border-b border-white/5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <MapPin className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">ParkSmart</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Sign In</Link>
          <Link to="/register" className="text-sm bg-brand-600 hover:bg-brand-500 text-white font-medium px-5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/20">
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Live badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">4 AI Models Active — Real-time Detection</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            Smart Parking,{' '}
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400 bg-clip-text text-transparent bg-[length:200%] animate-shimmer">
              Reimagined
            </span>
            .
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The world's first parking platform powered by{' '}
            <span className="text-white font-medium">CNN · Random Forest · LSTM · SVM</span>
            {' '}— four AI engines working together to give you real-time slot detection, demand forecasting, and instant booking.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/25 hover:shadow-brand-500/30 hover:scale-105"
            >
              Start Parking Smarter
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white mb-0.5">{s.value}</p>
                <p className="text-xs font-semibold text-gray-300">{s.label}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── Dashboard Preview (ContainerScroll) ───── */}
      <section className="relative px-6">
        <ContainerScroll
          titleComponent={
            <div className="mb-8">
              <p className="text-sm font-medium text-brand-400 mb-3 uppercase tracking-widest">Live Intelligence</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Your Parking{' '}
                <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                  Intelligence Hub
                </span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto text-base">
                Real-time slot grid, AI model health, LSTM demand chart — all in one dashboard.
              </p>
            </div>
          }
        >
          <DashboardPreview />
        </ContainerScroll>
      </section>

      {/* ── AI Models Grid ───────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-purple-400 mb-3 uppercase tracking-widest">AI Engine Room</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Four Models.{' '}
              <span className="bg-gradient-to-r from-purple-400 to-brand-400 bg-clip-text text-transparent">One Platform.</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Each AI model is trained, evaluated, and deployed independently — then combined for superhuman parking intelligence.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {AI_MODELS.map((m) => (
              <motion.div
                key={m.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${m.color} border ${m.border} rounded-3xl p-6 group cursor-default`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 ${m.bg} rounded-2xl flex items-center justify-center`}>
                    <m.icon className={`w-6 h-6 ${m.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${m.iconColor}`}>{m.metric}</p>
                    <p className="text-xs text-gray-500">{m.metricLabel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-1">{m.tag}</p>
                  <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{m.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Model Active</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-emerald-400 mb-3 uppercase tracking-widest">How It Works</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Park in 3 Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative"
              >
                <div className="bg-white/3 border border-white/8 rounded-3xl p-6 hover:border-brand-500/30 transition-colors duration-300 h-full">
                  <div className="text-5xl font-black text-white/5 mb-4">{step.num}</div>
                  <div className="w-12 h-12 bg-brand-600/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'url("https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600&q=80") center center / cover',
            animation: 'moveBackground 60s linear infinite',
          }}
        />
        <GlassFilter />
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ready to Park{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">Smarter?</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join thousands of drivers using AI-powered parking intelligence every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <GlassButton className="text-white text-base">
                <span className="flex items-center gap-2 px-2 py-1">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </span>
              </GlassButton>
            </Link>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Already have an account? Sign in →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">ParkSmart</span>
        </div>
        <p className="text-xs text-gray-600">AI-powered smart parking · CNN · Random Forest · LSTM · SVM</p>
      </footer>
    </div>
  )
}
