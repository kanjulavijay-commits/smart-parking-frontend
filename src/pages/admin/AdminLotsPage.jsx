import { useEffect, useState } from 'react'
import { MapPin, Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { parkingApi } from '../../api/parking'
import { adminApi } from '../../api/admin'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const BLANK = { name: '', address: '', city: '', state: '', total_capacity: '', base_hourly_rate: '', latitude: '', longitude: '' }

export default function AdminLotsPage() {
  const [lots, setLots]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)   // lot being edited
  const [form, setForm]         = useState(BLANK)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const load = () => {
    setLoading(true)
    parkingApi.getLots().then(({ data }) => {
      setLots(data.results ?? data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(BLANK); setError(''); setShowForm(true) }
  const openEdit   = (lot) => { setEditing(lot); setForm({ ...lot }); setError(''); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditing(null) }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const { data } = await adminApi.updateLot(editing.id, form)
        setLots((prev) => prev.map((l) => l.id === editing.id ? data : l))
      } else {
        const { data } = await adminApi.createLot(form)
        setLots((prev) => [data, ...prev])
      }
      closeForm()
    } catch (err) {
      const d = err.response?.data
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (lot) => {
    if (!confirm(`Delete "${lot.name}"? This cannot be undone.`)) return
    await adminApi.deleteLot(lot.id)
    setLots((prev) => prev.filter((l) => l.id !== lot.id))
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Parking Lots</h1>
          <p className="text-sm text-gray-400 mt-1">{lots.length} lots in the system</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Lot
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="card border-purple-500/30 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <p className="font-semibold text-white">{editing ? `Edit — ${editing.name}` : 'New Parking Lot'}</p>
            <button onClick={closeForm} className="text-gray-500 hover:text-gray-300"><X className="w-4 h-4" /></button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Lot Name</label>
              <input className="input" value={form.name} onChange={set('name')} placeholder="City Center Parking" required />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={set('address')} placeholder="123 Main Street" required />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={set('city')} placeholder="Mumbai" required />
            </div>
            <div>
              <label className="label">State</label>
              <input className="input" value={form.state} onChange={set('state')} placeholder="Maharashtra" />
            </div>
            <div>
              <label className="label">Total Capacity</label>
              <input type="number" className="input" value={form.total_capacity} onChange={set('total_capacity')} placeholder="200" required min="1" />
            </div>
            <div>
              <label className="label">Base Hourly Rate (₹)</label>
              <input type="number" className="input" value={form.base_hourly_rate} onChange={set('base_hourly_rate')} placeholder="50" required min="0" step="0.01" />
            </div>
            <div>
              <label className="label">Latitude</label>
              <input type="number" className="input" value={form.latitude} onChange={set('latitude')} placeholder="19.0760" step="any" />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input type="number" className="input" value={form.longitude} onChange={set('longitude')} placeholder="72.8777" step="any" />
            </div>
            <div className="col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeForm} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2 text-sm" disabled={saving}>
                {saving ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving…' : editing ? 'Update Lot' : 'Create Lot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lots table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : lots.length === 0 ? (
        <EmptyState icon={MapPin} title="No parking lots" description="Create your first lot above."
          action={<button onClick={openCreate} className="btn-primary text-sm">Add Lot</button>} />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  {['Lot', 'City', 'Capacity', 'Rate/hr', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-4 px-4 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {lots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-medium">{lot.name}</p>
                          <p className="text-xs text-gray-600 truncate max-w-[180px]">{lot.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{lot.city}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-gray-200 font-medium">{lot.total_capacity}</div>
                      <div className="text-xs text-emerald-400">{lot.available_slots ?? '?'} free</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">₹{lot.base_hourly_rate}</td>
                    <td className="py-3.5 px-4">
                      <span className={lot.is_active ? 'badge-green' : 'badge-red'}>
                        {lot.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(lot)} className="p-1.5 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(lot)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
