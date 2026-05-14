import { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { notificationsApi } from '../../api/notifications'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function NotificationsPage() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationsApi.getAll().then(({ data }) => {
      setItems(data.results ?? data)
    }).finally(() => setLoading(false))
  }, [])

  const markAllRead = async () => {
    await notificationsApi.markAllRead()
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unread = items.filter((n) => !n.is_read).length

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-400 mt-1">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={`card flex items-start gap-4 transition-colors ${!n.is_read ? 'border-brand-500/30 bg-brand-600/5' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.is_read ? 'bg-brand-400' : 'bg-gray-700'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">{n.title || n.message}</p>
                {n.title && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
                <p className="text-xs text-gray-600 mt-1">{formatDate(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}
