import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { authApi } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'

const GridBg = () => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: 'linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
  }} />
)

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
      setError(err.response?.data?.detail || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/3 border border-white/8 text-white rounded-xl px-4 py-3.5 placeholder-gray-700 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200 font-mono text-sm"

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <GridBg />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="absolute bottom-0 right-1/4 w-px h-1/2 bg-gradient-to-t from-brand-500/20 to-transparent" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">PARK<span className="text-brand-500">SMART</span></span>
          </div>
          <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-[0.3em]">// COMMAND ACCESS</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border border-white/8 bg-white/2 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-7">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">SIGN IN</h1>
              <p className="text-xs font-mono text-gray-600 mt-0.5">ENTER YOUR CREDENTIALS</p>
            </div>
            <div className="flex gap-1.5">
              {['CNN','RF','LSTM','SVM'].map(m => (
                <span key={m} className="text-[8px] font-mono text-brand-500/50 border border-brand-500/20 rounded px-1 py-0.5">{m}</span>
              ))}
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl px-4 py-3 mb-5 uppercase tracking-wide">
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
              <input type="email" className={inputClass} placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">PASSWORD</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className={`${inputClass} pr-12`} placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-[10px] font-mono text-gray-600 hover:text-brand-400 transition-colors uppercase tracking-widest">
                  FORGOT PASSWORD?
                </Link>
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black py-3.5 rounded-xl transition-all duration-200 uppercase tracking-widest text-sm disabled:opacity-50 mt-3"
            >
              {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
            </motion.button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-center mt-6 space-y-2">
          <p className="text-xs font-mono text-gray-600">
            NO ACCOUNT?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-400 font-bold uppercase transition-colors">
              REGISTER NOW
            </Link>
          </p>
          <Link to="/" className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors block">
            ← BACK TO MISSION CONTROL
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
