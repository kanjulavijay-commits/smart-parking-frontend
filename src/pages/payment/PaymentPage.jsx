import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import { paymentsApi } from '../../api/payments'
import Spinner from '../../components/ui/Spinner'

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
    if (!paymentId) {
      setError('No payment record found for this booking.')
      return
    }
    setPaying(true)
    setError('')
    try {
      await paymentsApi.confirmPayment(paymentId, method)
      setPaid(true)
    } catch (err) {
      const d = err.response?.data
      setError(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!booking) return <p className="text-center text-gray-400 py-20">Booking not found.</p>

  if (paid) {
    return (
      <div className="animate-fade-in max-w-md mx-auto text-center py-20 space-y-4">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
        <p className="text-gray-400">Your booking is confirmed. Show the QR code at the gate.</p>
        <button onClick={() => navigate(`/bookings/${bookingId}`)} className="btn-primary">
          View Booking
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-md space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
        <p className="text-sm text-gray-400 mt-1">Booking #{booking.id}</p>
      </div>

      {/* Order summary */}
      <div className="card space-y-3">
        <p className="text-sm font-semibold text-gray-300">Order Summary</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Slot {booking.slot_info?.slot_number || booking.slot}</span>
          <span className="text-gray-200">{booking.slot_info?.lot_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Duration</span>
          <span className="text-gray-200">{calcDuration(booking.start_time, booking.end_time)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-800 pt-3">
          <span className="font-semibold text-gray-200">Total</span>
          <span className="font-bold text-white text-lg">₹{booking.total_amount || '—'}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="card space-y-3">
        <p className="text-sm font-semibold text-gray-300">Payment Method</p>
        {[
          { id: 'card',  label: 'Credit / Debit Card' },
          { id: 'upi',   label: 'UPI' },
          { id: 'wallet',label: 'Wallet' },
        ].map((m) => (
          <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
            method === m.id ? 'border-brand-500/50 bg-brand-600/10' : 'border-gray-800 hover:border-gray-700'
          }`}>
            <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-blue-500" />
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-200">{m.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button onClick={handlePay} className="btn-primary w-full flex items-center justify-center gap-2" disabled={paying}>
        {paying && <Spinner size="sm" />}
        {paying ? 'Processing…' : `Pay ₹${booking.total_amount || ''}`}
      </button>
    </div>
  )
}

function calcDuration(start, end) {
  if (!start || !end) return '—'
  const h = (new Date(end) - new Date(start)) / 3600000
  return h > 0 ? `${h.toFixed(1)} hrs` : '—'
}
