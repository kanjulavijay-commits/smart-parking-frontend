import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, CheckCircle, Zap, Smartphone, Wallet } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import { paymentsApi } from '../../api/payments'
import Spinner from '../../components/ui/Spinner'

const fade = { hidden: { opacity: 0, y: 16 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }) }

const METHODS = [
  { id: 'card',   label: 'CREDIT / DEBIT CARD', Icon: CreditCard },
  { id: 'upi',    label: 'UPI',                  Icon: Smartphone },
  { id: 'wallet', label: 'WALLET',               Icon: Wallet },
]

export default function PaymentPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking]   = useState(null)
  const [paymentId, setPaymentId] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [paying, setPaying]     = useState(false)
  const [paid, setPaid]         = useState(false)
  const [error, setError]       = useState('')
  const [method, setMethod]     = useState('card')

  useEffect(() => {
    Promise.all([
      bookingsApi.getBooking(bookingId),
      paymentsApi.getPaymentByBooking(bookingId),
    ]).then(([{ data: bk }, { data: pm }]) => {
      setBooking(bk)
      const results = pm.results ?? pm
      if (results.length > 0) setPaymentId(results[0].id)
    }).finally(() => setLoading(false))
  }, [bookingId])

  const handlePay = async () => {
    if (!paymentId) { setError('NO PAYMENT RECORD FOUND FOR THIS BOOKING.'); return }
    setPaying(true)
    setError('')
    try {
      await paymentsApi.confirmPayment(paymentId, method)
      setPaid(true)
    } catch (err) {
      const d = err.response?.data
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ').toUpperCase() : 'PAYMENT FAILED. PLEASE RETRY.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner size="lg" />
      <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">LOADING...</p>
    </div>
  )

  if (!booking) return <p className="text-center font-mono text-gray-700 py-20 uppercase tracking-widest">BOOKING NOT FOUND.</p>

  if (paid) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center py-20 space-y-6"
    >
      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </div>
      <div>
        <p className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-widest mb-2">// TRANSACTION COMPLETE</p>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">PAYMENT SUCCESSFUL</h1>
        <p className="text-xs font-mono text-gray-600 mt-2 uppercase tracking-wide">SHOW QR CODE AT THE GATE</p>
      </div>
      <button onClick={() => navigate(`/bookings/${bookingId}`)}
        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black px-8 py-3.5 rounded-xl transition-all uppercase tracking-widest text-xs"
      >
        <Zap className="w-4 h-4" /> VIEW BOOKING
      </button>
    </motion.div>
  )

  return (
    <div className="max-w-md space-y-5">
      <motion.button custom={0} variants={fade} initial="hidden" animate="visible"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-mono text-gray-700 hover:text-brand-400 uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> BACK
      </motion.button>

      <motion.div custom={1} variants={fade} initial="hidden" animate="visible">
        <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// TRANSACTION</p>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">COMPLETE PAYMENT</h1>
        <p className="text-xs font-mono text-gray-600 mt-1 uppercase">BOOKING #{booking.id}</p>
      </motion.div>

      {/* Order Summary */}
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible"
        className="relative bg-black border border-white/8 rounded-2xl p-5 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-brand-500 opacity-50" />
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-4">ORDER SUMMARY</p>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wide">SLOT</span>
            <span className="text-[10px] font-mono text-gray-300">{booking.slot_info?.slot_number || booking.slot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wide">LOCATION</span>
            <span className="text-[10px] font-mono text-gray-300 text-right max-w-[60%]">{booking.slot_info?.lot_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wide">DURATION</span>
            <span className="text-[10px] font-mono text-gray-300">{calcDuration(booking.start_time, booking.end_time)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-white/5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">TOTAL</span>
            <span className="text-2xl font-black text-white font-mono">₹{booking.total_amount || '—'}</span>
          </div>
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible"
        className="bg-black border border-white/8 rounded-2xl p-5 space-y-3"
      >
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest mb-4">PAYMENT METHOD</p>
        {METHODS.map(({ id, label, Icon }) => (
          <label key={id}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              method === id ? 'border-brand-500/30 bg-brand-500/5' : 'border-white/5 hover:border-white/12'
            }`}
          >
            <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="accent-orange-500" />
            <Icon className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-300">{label}</span>
          </label>
        ))}
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className="bg-red-500/8 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-xl px-4 py-3 uppercase tracking-wide"
        >
          ⚠ {error}
        </motion.div>
      )}

      <motion.button custom={4} variants={fade} initial="hidden" animate="visible"
        onClick={handlePay}
        disabled={paying}
        whileHover={{ scale: paying ? 1 : 1.02 }}
        whileTap={{ scale: paying ? 1 : 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50"
      >
        {paying ? <Spinner size="sm" /> : <Zap className="w-4 h-4" />}
        {paying ? 'PROCESSING...' : `PAY ₹${booking.total_amount || ''}`}
      </motion.button>
    </div>
  )
}

function calcDuration(start, end) {
  if (!start || !end) return '—'
  const h = (new Date(end) - new Date(start)) / 3600000
  return h > 0 ? `${h.toFixed(1)} HRS` : '—'
}
