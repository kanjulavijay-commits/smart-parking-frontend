import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Check } from 'lucide-react'
import { authApi } from '../../api/auth'
import Spinner from '../../components/ui/Spinner'

const FEATURES = ['Real-time slot detection', 'LSTM demand forecasting', 'Instant booking']

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirm: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      await authApi.register({
        full_name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirm: form.password_confirm,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 backdrop-blur-sm text-sm"
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-blob" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-brand-600/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-emerald-600/10 rounded-full blur-[80px] animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">ParkSmart</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-4">Join the AI-powered parking revolution</p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FEATURES.map((f) => (
              <span key={f} className="flex items-center gap-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs px-3 py-1 rounded-full">
                <Check className="w-3 h-3" />{f}
              </span>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl px-4 py-3 mb-5"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name</label>
                <input className={inputClass} placeholder="John" value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input className={inputClass} placeholder="Doe" value={form.last_name} onChange={set('last_name')} required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label className={labelClass}>Phone <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
              <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Password</label>
                <input type="password" className={inputClass} placeholder="Min 8 chars" value={form.password} onChange={set('password')} required minLength={8} />
              </div>
              <div>
                <label className={labelClass}>Confirm</label>
                <input type="password" className={inputClass} placeholder="Re-enter" value={form.password_confirm} onChange={set('password_confirm')} required minLength={8} />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Creating account…' : 'Create Account — Free'}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-600 mt-5"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Sign in</Link>
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-3">
          <Link to="/" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">← Back to home</Link>
        </motion.div>
      </div>
    </div>
  )
}
