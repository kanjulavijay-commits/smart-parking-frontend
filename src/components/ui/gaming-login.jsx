import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, Globe, X, Gamepad2 } from 'lucide-react'

// ─── FormInput ───────────────────────────────────────────
const FormInput = ({ icon, type, placeholder, value, onChange, required }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-brand-500/50 transition-colors text-sm"
    />
  </div>
)

// ─── SocialButton ────────────────────────────────────────
const SocialButton = ({ icon, label }) => (
  <button
    type="button"
    aria-label={label}
    className="flex items-center justify-center p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
  >
    {icon}
  </button>
)

// ─── ToggleSwitch ────────────────────────────────────────
const ToggleSwitch = ({ checked, onChange, id }) => (
  <div className="relative inline-block w-10 h-5 cursor-pointer">
    <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
    <div
      className={`absolute inset-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-brand-500' : 'bg-white/20'
      }`}
      onClick={onChange}
    >
      <div
        className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </div>
  </div>
)

// ─── VideoBackground ─────────────────────────────────────
const VideoBackground = ({ videoUrl }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-[#0C0404]/60 z-10" />
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  )
}

// ─── LoginForm ───────────────────────────────────────────
const LoginForm = ({ onSubmit, loading = false, error = '' }) => {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPw]   = useState(false)
  const [remember, setRemember]     = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(email, password, remember)
    setSubmitting(false)
  }

  const isLoading = loading || submitting

  return (
    <div className="p-8 rounded-2xl backdrop-blur-md bg-black/50 border border-white/10 shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="relative group inline-block">
          <span className="absolute -inset-2 bg-gradient-to-r from-brand-800/40 via-brand-500/30 to-brand-600/40 blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse rounded-xl" />
          <span className="relative text-3xl font-black text-white tracking-tight">
            PARK<span
              style={{
                background: 'linear-gradient(135deg,#C9A0B8,#B76E79,#AD7B5E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >SMART</span>
          </span>
        </h2>
        <p className="text-white/60 text-sm mt-2">Command access. AI-powered parking.</p>
        <div className="flex justify-center gap-2 mt-3">
          {['CNN','RF','LSTM','SVM'].map((m) => (
            <span key={m} className="text-[8px] font-mono text-brand-400/60 border border-brand-500/20 rounded px-1.5 py-0.5 uppercase tracking-widest">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl px-4 py-3 uppercase tracking-wide">
          ⚠ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          icon={<Mail className="text-white/40" size={16} />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <FormInput
            icon={<Lock className="text-white/40" size={16} />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            onClick={() => setShowPw(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <ToggleSwitch checked={remember} onChange={() => setRemember(!remember)} id="remember-me" />
            <label
              htmlFor="remember-me"
              className="text-xs text-white/60 cursor-pointer hover:text-white transition-colors uppercase tracking-widest font-mono"
              onClick={() => setRemember(!remember)}
            >
              Remember
            </label>
          </div>
          <a href="/forgot-password" className="text-xs text-white/50 hover:text-brand-400 transition-colors font-mono uppercase tracking-widest">
            Forgot?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white font-black text-sm uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          style={{
            background: isLoading
              ? 'rgba(173,123,94,0.6)'
              : 'linear-gradient(135deg,#B76E79,#AD7B5E)',
            boxShadow: '0 4px 24px rgba(183,110,121,0.25)',
          }}
        >
          {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM →'}
        </button>
      </form>

      {/* Social */}
      <div className="mt-7">
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-white/8 absolute w-full" />
          <span className="relative bg-transparent px-4 text-white/40 text-xs font-mono uppercase tracking-widest">
            quick access
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <SocialButton icon={<Globe size={16} />} label="Web" />
          <SocialButton icon={<X size={16} />} label="X" />
          <SocialButton icon={<Gamepad2 size={16} />} label="Gaming" />
        </div>
      </div>

      <p className="mt-7 text-center text-xs text-white/40 font-mono">
        NO ACCOUNT?{' '}
        <a href="/register" className="text-brand-400 hover:text-brand-300 transition-colors font-bold uppercase tracking-widest">
          REGISTER
        </a>
      </p>
    </div>
  )
}

// Named exports for individual use, default object for combined use
const GamingLogin = { LoginForm, VideoBackground }
export default GamingLogin
export { LoginForm, VideoBackground }
