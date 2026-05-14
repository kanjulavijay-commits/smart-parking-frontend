import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react'
import { parkingApi } from '../../api/parking'
import { bookingsApi } from '../../api/bookings'
import Spinner from '../../components/ui/Spinner'

function toLocalInput(date) {
  // Converts Date to "YYYY-MM-DDTHH:MM" for datetime-local inputs
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function BookSlotPage() {
  const { slotId } = useParams()
  const navigate = useNavigate()
  const now = new Date()
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000)

  const [slot, setSlot]         = useState(null)
  const [form, setForm]         = useState({ start_time: toLocalInput(now), end_time: toLocalInput(later), vehicle_plate: '' })
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    parkingApi.getSlot(slotId).then(({ data }) => setSlot(data)).finally(() => setLoading(false))
  }, [slotId])

  const duration = () => {
    const diff = (new Date(form.end_time) - new Date(form.start_time)) / 3600000
    return diff > 0 ? diff.toFixed(1) : 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await bookingsApi.createBooking({
        slot: slotId,
        start_time: new Date(form.start_time).toISOString(),
        end_time:   new Date(form.end_time).toISOString(),
        vehicle_plate: form.vehicle_plate,
      })
      navigate(`/bookings/${data.id}`)
    } catch (err) {
      const d = err.response?.data
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Booking failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!slot) return <p className="text-center text-gray-400 py-20">Slot not found.</p>

  return (
    <div className="animate-fade-in max-w-lg space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white">Book Slot</h1>
        <p className="text-sm text-gray-400 mt-1">Fill in your booking details below.</p>
      </div>

      {/* Slot summary */}
      <div className="card flex items-center gap-4">
        <div className="w-11 h-11 bg-brand-600/10 rounded-xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-100">Slot {slot.slot_number}</p>
          <p className="text-xs text-gray-500 mt-0.5">{slot.slot_type} • {slot.lot_name || 'Parking Lot'}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold text-white">₹{slot.hourly_rate}/hr</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start Time</label>
          <input
            type="datetime-local"
            className="input"
            value={form.start_time}
            min={toLocalInput(now)}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> End Time</label>
          <input
            type="datetime-local"
            className="input"
            value={form.end_time}
            min={form.start_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Vehicle Plate Number</label>
          <input
            className="input"
            placeholder="e.g. MH12AB1234"
            value={form.vehicle_plate}
            onChange={(e) => setForm({ ...form, vehicle_plate: e.target.value.toUpperCase() })}
            required
          />
        </div>

        {/* Estimate */}
        {duration() > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4 flex justify-between">
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-semibold text-gray-200">{duration()} hrs</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Estimated Cost</p>
              <p className="text-sm font-semibold text-white">₹{(duration() * (slot.hourly_rate || 0)).toFixed(0)}</p>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={submitting}>
          {submitting && <Spinner size="sm" />}
          {submitting ? 'Booking…' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}
