import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, QrCode, CreditCard, X, ArrowLeft, Zap } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import Spinner from '../../components/ui/Spinner'

const STATUS_STYLE = {
  confirmed: 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400',
  pending:   'bg-yellow-500/8  border-yellow-500/20  text-yellow-400',
  cancelled: 'bg-red-500/8     border-red-500/20     text-red-400',
  completed: 'bg-brand-500/8   border-brand-500/20   text-brand-400',
}

const fade = { hidden: { opacity: 0, y: 16 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }) }

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking]     = useState(null)
  const [qr, setQr]               = useState(null)
  const [loading, setLoading]     = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    bookingsApi.getBooking(id).then(({ data }) => setBooking(data)).finally(() => setLoading(false))
  }, [id])

  const loadQR = async () => {
    try {
      const { data } = await bookingsApi.getQRCode(id)
      setQr(data.qr_image_url)
    } catch {}
  }

  const cancel = async () => {
    if (!confirm('CONFIRM ABORT — cancel this booking?')) return
    setCancelling(true)
    try {
      await bookingsApi.cancelBooking(id)
      setBooking((b) => ({ ...b, status: 'cancelled' }))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">LOADING INTEL...</p>
    </div>
  )
  if (!booking) return <p className="text-center font-mono text-gray-700 py-20 uppercase tracking-widest">BOOKING NOT FOUND.</p>

  const statusStyle = STATUS_STYLE[booking.status] || STATUS_STYLE.completed

  return (
    <div className="max-w-2xl space-y-5">
      <motion.button custom={0} variants={fade} initial="hidden" animate="visible"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-mono text-gray-700 hover:text-brand-400 uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK TO MISSIONS
      </motion.button>

      {/* Main card */}
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible"
        className="relative bg-black border border-white/8 rounded-2xl p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-brand-500 opacity-50" />
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-1">// BOOKING #{booking.id}</p>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              {booking.slot_info?.lot_name || 'PARKING SLOT'}
            </h1>
            <p className="text-xs font-mono text-gray-600 mt-1 uppercase">
              SLOT {booking.slot_info?.slot_number || booking.slot}
            </p>
          </div>
          <span className={`text-[9px] font-mono font-bold border px-3 py-1.5 rounded-lg uppercase tracking-widest ${statusStyle}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/2 border border-white/6 rounded-xl p-4">
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-2">CHECK IN</p>
            <p className="text-sm font-mono font-bold text-gray-200">{formatDate(booking.start_time)}</p>
          </div>
          <div className="bg-white/2 border border-white/6 rounded-xl p-4">
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-2">CHECK OUT</p>
            <p className="text-sm font-mono font-bold text-gray-200">{formatDate(booking.end_time)}</p>
          </div>
        </div>

        {booking.total_amount && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">TOTAL AMOUNT</span>
            <span className="text-2xl font-black text-white font-mono">₹{booking.total_amount}</span>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
        <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
          {booking.status === 'confirmed' && (
            <>
              <button onClick={loadQR}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-black border border-white/8 hover:border-white/14 text-gray-400 hover:text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all"
              >
                <QrCode className="w-4 h-4" /> SHOW QR
              </button>
              <Link to={`/pay/${booking.id}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black text-[10px] font-mono font-black uppercase tracking-widest transition-all"
              >
                <Zap className="w-4 h-4" /> PAY NOW
              </Link>
            </>
          )}
          <button
            onClick={cancel}
            disabled={cancelling}
            className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-500/70 hover:text-red-400 hover:bg-red-500/8 text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-40"
          >
            {cancelling ? <Spinner size="sm" /> : <X className="w-4 h-4" />}
            ABORT BOOKING
          </button>
        </motion.div>
      )}

      {/* QR Code */}
      {qr && (
        <motion.div custom={3} variants={fade} initial="hidden" animate="visible"
          className="bg-black border border-white/8 rounded-2xl p-6 flex flex-col items-center"
        >
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-4">SCAN QR AT GATE</p>
          <div className="p-3 bg-white rounded-xl">
            <img src={qr} alt="QR Code" className="w-44 h-44" />
          </div>
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mt-4">VALID FOR THIS BOOKING ONLY</p>
        </motion.div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
