import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Clock, Car, Zap } from 'lucide-react'
import { parkingApi } from '../../api/parking'
import { bookingsApi } from '../../api/bookings'
import Spinner from '../../components/ui/Spinner'

function toLocalInput(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const fade = { hidden: { opacity: 0, y: 16 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }) }

export default function BookSlotPage() {
  const { slotId } = useParams()
  const navigate = useNavigate()
  const now   = new Date()
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
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ').toUpperCase() : 'BOOKING FAILED.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-black border border-white/8 text-white rounded-xl px-4 py-3 placeholder-gray-700 focus:outline-none focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 transition-all font-mono text-sm"
  const labelClass = "flex items-center gap-1.5 text-[9px] font-mono text-gray-600 uppercase tracking-widest mb-1.5"

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">LOADING SLOT...</p>
    </div>
  )
  if (!slot) return <p className="text-center font-mono text-gray-700 py-20 uppercase tracking-widest">SLOT NOT FOUND.</p>

  return (
    <div className="max-w-lg space-y-5">
      <motion.button custom={0} variants={fade} initial="hidden" animate="visible"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-mono text-gray-700 hover:text-brand-400 uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK
      </motion.button>

      <motion.div custom={1} variants={fade} initial="hidden" animate="visible">
        <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// DEPLOY VEHICLE</p>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">BOOK SLOT</h1>
        <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wide">CONFIRM YOUR DEPLOYMENT WINDOW</p>
      </motion.div>

      {/* Slot info */}
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible"
        className="relative bg-black border border-white/8 rounded-2xl p-5 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-brand-500 opacity-50" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-mono font-black text-white uppercase tracking-wide">SLOT {slot.slot_number}</p>
            <p className="text-[10px] font-mono text-gray-600 mt-0.5 uppercase">{slot.slot_type} · {slot.lot_name || 'PARKING LOT'}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-white font-mono">₹{slot.hourly_rate}</p>
            <p className="text-[9px] font-mono text-gray-700 uppercase">PER HOUR</p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className="bg-red-500/8 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-xl px-4 py-3 uppercase tracking-wide"
        >
          ⚠ {error}
        </motion.div>
      )}

      <motion.form custom={3} variants={fade} initial="hidden" animate="visible"
        onSubmit={handleSubmit}
        className="bg-black border border-white/8 rounded-2xl p-6 space-y-5"
      >
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">MISSION PARAMETERS</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}><Calendar className="w-3 h-3" /> START TIME</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.start_time}
              min={toLocalInput(now)}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}><Clock className="w-3 h-3" /> END TIME</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.end_time}
              min={form.start_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}><Car className="w-3 h-3" /> VEHICLE PLATE</label>
          <input
            className={inputClass}
            placeholder="MH12AB1234"
            value={form.vehicle_plate}
            onChange={(e) => setForm({ ...form, vehicle_plate: e.target.value.toUpperCase() })}
            required
          />
        </div>

        {duration() > 0 && (
          <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex justify-between">
            <div>
              <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">DURATION</p>
              <p className="text-sm font-mono font-black text-gray-200 mt-1">{duration()} HRS</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">ESTIMATED COST</p>
              <p className="text-xl font-black text-white font-mono mt-1">₹{(duration() * (slot.hourly_rate || 0)).toFixed(0)}</p>
            </div>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50"
        >
          {submitting ? <Spinner size="sm" /> : <Zap className="w-4 h-4" />}
          {submitting ? 'DEPLOYING...' : 'CONFIRM BOOKING →'}
        </motion.button>
      </motion.form>
    </div>
  )
}
