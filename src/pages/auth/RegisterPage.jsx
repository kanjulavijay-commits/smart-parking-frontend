import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { authApi } from '../../api/auth'
import Spinner from '../../components/ui/Spinner'

const GridBg = () => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: 'linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
  }} />
)

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirm: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirm) { setError('PASSWORDS DO NOT MATCH.'); return }
    setLoading(true)
    setError('')
    try {
      await authApi.register({
        full_name: `${form.first_name.trim()} ${form.last_name.trim()}`,
        email: form.email, phone: form.phone,
        password: form.password, password_confirm: form.password_confirm,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'object' ? Object.values(data).flat().join(' ') : 'REGISTRATION FAILED.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/3 border border-white/8 text-white rounded-xl px-4 py-3 placeholder-gray-700 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all duration-200 font-mono text-sm"
  const labelClass = "block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5"

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <GridBg />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-px h-1/2 bg-gradient-to-t from-brand-500/20 to-transparent" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">PARK<span className="text-brand-500">SMART</span></span>
          </div>
          <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-[0.3em]">// REGISTER OPERATOR</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border border-white/8 bg-white/2 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">CREATE ACCOUNT</h1>
              <p className="text-xs font-mono text-gray-600 mt-0.5">JOIN THE GRID</p>
            </div>
            <div className="text-[9px] font-mono text-brand-500/40 border border-brand-500/20 rounded px-2 py-1 uppercase">FREE</div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl px-4 py-3 mb-5 uppercase tracking-wide">
              ⚠ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>FIRST NAME</label>
                <input className={inputClass} placeholder="John" value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div>
                <label className={labelClass}>LAST NAME</label>
                <input className={inputClass} placeholder="Doe" value={form.last_name} onChange={set('last_name')} required />
              </div>
            </div>
            <div>
              <label className={labelClass}>EMAIL</label>
              <input type="email" className={inputClass} placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className={labelClass}>PHONE <span className="text-gray-700 normal-case">(optional)</span></label>
              <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>PASSWORD</label>
                <input type="password" className={inputClass} placeholder="Min 8 chars" value={form.password} onChange={set('password')} required minLength={8} />
              </div>
              <div>
                <label className={labelClass}>CONFIRM</label>
                <input type="password" className={inputClass} placeholder="Re-enter" value={form.password_confirm} onChange={set('password_confirm')} required minLength={8} />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black py-3.5 rounded-xl transition-all duration-200 uppercase tracking-widest text-sm disabled:opacity-50 mt-3"
            >
              {loading ? <Spinner size="sm" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'DEPLOYING...' : 'DEPLOY ACCOUNT →'}
            </motion.button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-center mt-6 space-y-2">
          <p className="text-xs font-mono text-gray-600">
            ALREADY DEPLOYED?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-400 font-bold transition-colors">SIGN IN</Link>
          </p>
          <Link to="/" className="text-[10px] font-mono text-gray-700 hover:text-gray-500 transition-colors block">
            ← BACK TO MISSION CONTROL
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
