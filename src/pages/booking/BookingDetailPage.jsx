import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Clock, QrCode, CreditCard, X, ArrowLeft } from 'lucide-react'
import { bookingsApi } from '../../api/bookings'
import Spinner from '../../components/ui/Spinner'

const STATUS_BADGE = {
  confirmed: 'badge-green',
  pending:   'badge-yellow',
  cancelled: 'badge-red',
  completed: 'badge-blue',
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking]   = useState(null)
  const [qr, setQr]             = useState(null)
  const [loading, setLoading]   = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    bookingsApi.getBooking(id)
      .then(({ data }) => setBooking(data))
      .finally(() => setLoading(false))
  }, [id])

  const loadQR = async () => {
    const { data } = await bookingsApi.getQRCode(id)
    setQr(data.qr_image || data.qr_code)
  }

  const cancel = async () => {
    if (!confirm('Cancel this booking?')) return
    setCancelling(true)
    try {
      await bookingsApi.cancelBooking(id)
      setBooking((b) => ({ ...b, status: 'cancelled' }))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!booking) return <p className="text-gray-400 text-center py-20">Booking not found.</p>

  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </button>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Booking #{booking.id}</p>
            <h1 className="text-xl font-bold text-white">{booking.slot_info?.lot_name || 'Parking Slot'}</h1>
            <p className="text-sm text-gray-400 mt-1">Slot {booking.slot_info?.slot_number || booking.slot}</p>
          </div>
          <span className={STATUS_BADGE[booking.status] || 'badge-blue'}>{booking.status}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Check In</p>
            <p className="text-sm font-medium text-gray-200">{formatDate(booking.start_time)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Check Out</p>
            <p className="text-sm font-medium text-gray-200">{formatDate(booking.end_time)}</p>
          </div>
        </div>

        {booking.total_amount && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <span className="text-sm text-gray-400">Total Amount</span>
            <span className="text-lg font-bold text-white">₹{booking.total_amount}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        {booking.status === 'confirmed' && (
          <>
            <button onClick={loadQR} className="btn-secondary flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" />
              Show QR Code
            </button>
            <Link to={`/pay/${booking.id}`} className="btn-primary flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pay Now
            </Link>
          </>
        )}
        {['confirmed','pending'].includes(booking.status) && (
          <button
            onClick={cancel}
            disabled={cancelling}
            className="col-span-2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {cancelling ? <Spinner size="sm" /> : <X className="w-4 h-4" />}
            Cancel Booking
          </button>
        )}
      </div>

      {/* QR Code */}
      {qr && (
        <div className="card flex flex-col items-center py-8">
          <p className="text-sm text-gray-400 mb-4">Scan this QR at the gate</p>
          <img src={qr} alt="QR Code" className="w-48 h-48 rounded-xl" />
          <p className="text-xs text-gray-600 mt-4">Valid for this booking only</p>
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
