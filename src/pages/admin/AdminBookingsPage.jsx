import { useEffect, useState } from 'react'
import { CalendarCheck, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '../../api/admin'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const STATUS_BADGE = {
  confirmed: 'badge-green',
  pending:   'badge-yellow',
  cancelled: 'badge-red',
  completed: 'badge-blue',
  active:    'badge-green',
  no_show:   'badge-red',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [count, setCount]       = useState(0)
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState('')
  const [loading, setLoading]   = useState(true)
  const PAGE_SIZE = 20

  const load = (p = page) => {
    setLoading(true)
    const params = { page: p, ...(status && { status }) }
    adminApi.getAllBookings(params).then(({ data }) => {
      setBookings(data.results ?? data)
      setCount(data.count ?? (data.results ?? data).length)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { setPage(1); load(1) }, [status])
  useEffect(() => { load() }, [page])

  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">{count} total bookings</p>
        </div>
        <button onClick={() => load()} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              status === s ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No bookings found" description="Try a different filter." />
      ) : (
        <>
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    {['#', 'User', 'Slot / Lot', 'Start', 'End', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="text-left py-4 px-4 text-xs text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4 text-gray-600 text-xs font-mono">{String(b.id).slice(0, 8)}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {b.user_name || b.user?.full_name || `User #${b.user}`}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-200">{b.slot_info?.lot_name || '—'}</p>
                        <p className="text-xs text-gray-500">Slot {b.slot_info?.slot_number || b.slot}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{fmtDate(b.start_time)}</td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{fmtDate(b.end_time)}</td>
                      <td className="py-3 px-4 text-gray-200">
                        {b.final_price ? `₹${b.final_price}` : b.estimated_price ? `~₹${b.estimated_price}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={STATUS_BADGE[b.status] || 'badge-blue'}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} · {count} total
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary text-sm px-3 py-2 disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="btn-secondary text-sm px-3 py-2 disabled:opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
}
