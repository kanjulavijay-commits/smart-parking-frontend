import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Save, ShieldCheck } from 'lucide-react'
import { authApi } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'

const fade = { hidden: { opacity: 0, y: 16 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }) }

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [form, setForm]     = useState({ full_name: user?.full_name || '', phone_number: user?.phone_number || '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]   = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const { data } = await authApi.updateProfile(form)
      setUser(data)
      setSuccess(true)
    } catch {
      setError('UPDATE FAILED. TRY AGAIN.')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    || user?.email?.[0]?.toUpperCase() || '?'

  const inputClass = "w-full bg-black border border-white/8 text-white rounded-xl px-4 py-3 placeholder-gray-700 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all font-mono text-sm"
  const labelClass = "block text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-1.5"

  return (
    <div className="max-w-2xl space-y-5">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// OPERATOR FILE</p>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">PROFILE</h1>
        <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wide">MANAGE YOUR OPERATOR CREDENTIALS</p>
      </motion.div>

      {/* Identity Card */}
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible"
        className="relative bg-black border border-white/8 rounded-2xl p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-brand-500 opacity-50" />
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-brand-500/15 border border-brand-500/30 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-brand-400">{initials}</span>
          </div>
          <div>
            <p className="text-lg font-black text-white uppercase tracking-tight">{user?.full_name || 'OPERATOR'}</p>
            <p className="text-xs font-mono text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-3 h-3 text-brand-400" />
              <span className="text-[9px] font-mono text-brand-400 uppercase tracking-widest">{user?.role || 'USER'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      <motion.form custom={2} variants={fade} initial="hidden" animate="visible"
        onSubmit={handleSave}
        className="bg-black border border-white/8 rounded-2xl p-6 space-y-5"
      >
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">UPDATE CREDENTIALS</p>

        {success && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-xl px-4 py-3 uppercase tracking-wide"
          >
            ✓ PROFILE UPDATED SUCCESSFULLY
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/8 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-xl px-4 py-3 uppercase tracking-wide"
          >
            ⚠ {error}
          </motion.div>
        )}

        <div>
          <label className={labelClass}>FULL NAME</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input className={`${inputClass} pl-11`} value={form.full_name} onChange={set('full_name')} placeholder="John Doe" />
          </div>
        </div>

        <div>
          <label className={labelClass}>EMAIL ADDRESS <span className="text-gray-700 normal-case font-sans">(locked)</span></label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
            <input className={`${inputClass} pl-11 opacity-40 cursor-not-allowed`} value={user?.email || ''} disabled />
          </div>
        </div>

        <div>
          <label className={labelClass}>PHONE <span className="text-gray-700 normal-case font-sans">(optional)</span></label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input className={`${inputClass} pl-11`} placeholder="+91 98765 43210" value={form.phone_number} onChange={set('phone_number')} />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
          {saving ? 'UPDATING...' : 'SAVE CHANGES'}
        </motion.button>
      </motion.form>
    </div>
  )
}
