import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { authApi } from '../../api/auth'
import Spinner from '../../components/ui/Spinner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', phone_number: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.register(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data
      const msg = typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Registration failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">ParkSmart</span>
        </div>

        <div className="card animate-fade-in">
          <h1 className="text-xl font-bold text-white mb-1">Create an account</h1>
          <p className="text-sm text-gray-400 mb-6">Start parking smarter today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input className="input" placeholder="John" value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" placeholder="Doe" value={form.last_name} onChange={set('last_name')} required />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input type="tel" className="input" placeholder="+91 98765 43210" value={form.phone_number} onChange={set('phone_number')} />
            </div>

            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2" disabled={loading}>
              {loading && <Spinner size="sm" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
