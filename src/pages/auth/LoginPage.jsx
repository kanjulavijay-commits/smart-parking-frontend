import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authApi } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'

const AI_BADGES = ['CNN', 'RF', 'LSTM', 'SVM']

export default function LoginPage() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login(form)
      setTokens(data.access, data.refresh)
      const profile = await authApi.getProfile()
      setUser(profile.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated orbs */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-brand-600/20 rounded-full blur-[100px] animate-blob" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-emerald-600/10 rounded-full blur-[80px] animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-500/30">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ParkSmart
          </span>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your smart parking account</p>

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
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 pr-12 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 backdrop-blur-sm"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-brand-600/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-600 mt-5"
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Create one free
          </Link>
        </motion.p>

        {/* AI status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-4 mt-6"
        >
          {AI_BADGES.map((m) => (
            <div key={m} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {m}
            </div>
          ))}
          <span className="text-xs text-gray-700">· AI Active</span>
        </motion.div>

        {/* Back to home */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">← Back to home</Link>
        </motion.div>
      </div>
    </div>
  )
}
