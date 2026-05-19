import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Zap, Brain, Shield, Music2, Facebook, Twitter, Youtube, Instagram } from 'lucide-react'
import { SmokeBackground } from '../components/ui/spooky-smoke-animation'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4'

const FOOTER_NAV = {
  Discover:      ['Labs & Workshops', 'Deep Dive Series', 'Global Circle', 'Resource Vault', 'Future Roadmap'],
  'The Mission': ['Origin Story', 'The Collective', 'Newsroom Hub', 'Join the Team'],
  Concierge:     ['Get in Touch', 'Legal Privacy', 'User Agreement', 'Report Concern'],
}

const SOCIALS = [Music2, Facebook, Twitter, Youtube, Instagram]

const STATS = [
  { value: '2,400+', label: 'Zones Mapped' },
  { value: '96.4%',  label: 'AI Accuracy' },
  { value: '18K+',   label: 'Daily Bookings' },
]

export default function LandingPage() {
  return (
    <main className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white">

      {/* ── Layer 0: Video background ────────────────── */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-[0]"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Layer 1: WebGL smoke ─────────────────────── */}
      <div className="fixed inset-0 z-[1] opacity-25 mix-blend-overlay pointer-events-none">
        <SmokeBackground smokeColor="#C9A0B8" />
      </div>

      {/* ── Layer 2: Dark mahogany tint ──────────────── */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,4,4,0.72) 0%, rgba(12,4,4,0.42) 40%, rgba(12,4,4,0.72) 80%, rgba(12,4,4,0.92) 100%)',
        }}
      />

      {/* ── Layer 3: Content ─────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col">

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between py-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/50">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              PARK<span className="text-brand-400">SMART</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {['CNN','RF','LSTM','SVM'].map((m) => (
              <span key={m} className="text-[8px] font-mono text-brand-400/50 border border-brand-500/15 rounded px-2 py-1 uppercase tracking-widest">
                {m}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg"
              style={{ background: 'linear-gradient(135deg,#B76E79,#AD7B5E)' }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-center pt-16 pb-10 md:pt-24"
        >
          <div className="inline-flex items-center gap-2.5 bg-white/6 border border-white/12 rounded-full px-5 py-2 mb-10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/65 uppercase tracking-widest">AI-Powered Parking Intelligence</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-8">
            FIND.<br />PARK.<br />
            <span
              style={{
                background: 'linear-gradient(135deg,#C9A0B8 0%,#B76E79 45%,#AD7B5E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CONQUER.
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/50 max-w-lg mx-auto mb-12 leading-relaxed">
            Real-time slot intelligence powered by CNN vision, RF forecast, LSTM demand prediction, and SVM classification.
            Never circle the block again.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-wider shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#B76E79,#AD7B5E)' }}
            >
              <Zap className="w-4 h-4" /> Start Parking Free
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/8 border border-white/15 hover:bg-white/14 text-white/75 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-sm backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="flex items-center justify-center gap-12 mt-16 flex-wrap"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-3xl md:text-4xl font-black"
                  style={{
                    background: 'linear-gradient(135deg,#C9A0B8,#B76E79)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {value}
                </p>
                <p className="text-[9px] text-white/35 mt-1 uppercase tracking-widest font-mono">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 pb-8"
        >
          {[
            { icon: Brain,  text: 'Multi-Model AI Engine' },
            { icon: MapPin, text: 'Live Zone Mapping' },
            { icon: Shield, text: 'Instant QR Entry' },
            { icon: Zap,    text: 'Sub-Second Booking' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2.5"
            >
              <Icon className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs text-white/55 font-medium">{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Spacer — keeps footer below the fold */}
        <div className="min-h-[26rem] md:min-h-[38rem]" />

        {/* ─────────── Liquid-Glass Footer ─────────── */}
        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64"
        >
          {/* Top 12-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">

            {/* Brand — col-span-5 */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
                </svg>
                <span className="text-xl font-medium">LUMINA</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Lumina provides premium clarity on global events and cosmic wonders — shared with all for free.
              </p>
            </div>

            {/* Links — col-span-7 */}
            <div className="md:col-span-7">
              <div className="grid grid-cols-3 gap-8">
                {Object.entries(FOOTER_NAV).map(([heading, links]) => (
                  <div key={heading}>
                    <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">{heading}</h4>
                    <ul className="text-xs space-y-2">
                      {links.map((link) => (
                        <li key={link}>
                          <a href="#" className="hover:text-white transition-colors">{link}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            <p className="text-[10px] uppercase tracking-widest opacity-50">Curated by @GotInGeorgiG</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Join the Journey:</span>
              <div className="flex items-center gap-3">
                {SOCIALS.map((Icon, i) => (
                  <a key={i} href="#" className="opacity-70 hover:opacity-100 transition-opacity hover:text-white">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.footer>

        <div className="h-10" />
      </div>
    </main>
  )
}
