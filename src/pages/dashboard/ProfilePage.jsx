import { useState } from 'react'
import { User, Mail, Phone, Save } from 'lucide-react'
import { authApi } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import Spinner from '../../components/ui/Spinner'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [form, setForm]     = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone_number: user?.phone_number || '' })
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
    } catch (err) {
      setError('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account details.</p>
      </div>

      {/* Avatar */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 bg-brand-700 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-white">
            {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.first_name} {user?.last_name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="badge-blue mt-1">{user?.role || 'user'}</span>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="card space-y-5">
        <p className="font-semibold text-gray-200">Personal Information</p>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">First Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input className="input pl-10" value={form.first_name} onChange={set('first_name')} />
            </div>
          </div>
          <div>
            <label className="label">Last Name</label>
            <input className="input" value={form.last_name} onChange={set('last_name')} />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input className="input pl-10 opacity-60" value={user?.email || ''} disabled />
          </div>
          <p className="text-xs text-gray-600 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="label">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input className="input pl-10" placeholder="+91 98765 43210" value={form.phone_number} onChange={set('phone_number')} />
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
          {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
