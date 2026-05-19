import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCheck, Radio } from 'lucide-react'
import { notificationsApi } from '../../api/notifications'
import Spinner from '../../components/ui/Spinner'

const fade = { hidden: { opacity: 0, y: 12 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05 } }) }

export default function NotificationsPage() {
  const [items, setItems]     = useState([])
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
    <div className="space-y-6">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible" className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono text-brand-500/60 uppercase tracking-widest mb-1">// SIGNAL FEED</p>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">ALERTS</h1>
          <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wide">
            {unread > 0 ? `${unread} UNREAD TRANSMISSIONS` : 'ALL CLEAR'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-black border border-white/8 hover:border-brand-500/30 text-gray-400 hover:text-brand-400 rounded-xl text-[9px] font-mono font-bold uppercase tracking-widest transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" /> MARK ALL READ
          </button>
        )}
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size="lg" />
          <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest animate-pulse">SCANNING FEED...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-white/6 rounded-2xl py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-white/2 border border-white/6 rounded-2xl flex items-center justify-center">
            <Radio className="w-6 h-6 text-gray-700" />
          </div>
          <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">NO TRANSMISSIONS</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n, i) => (
            <motion.div key={n.id} custom={i} variants={fade} initial="hidden" animate="visible"
              className={`relative flex items-start gap-4 p-4 bg-black rounded-xl border transition-all ${
                !n.is_read ? 'border-brand-500/20 bg-brand-500/3' : 'border-white/5'
              }`}
            >
              {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500 rounded-l-xl" />}
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-brand-400 animate-pulse' : 'bg-gray-800'}`} />
              <div className="flex-1 min-w-0 pl-1">
                <p className={`text-xs font-mono font-bold uppercase tracking-wide ${!n.is_read ? 'text-gray-200' : 'text-gray-500'}`}>
                  {n.title || n.message}
                </p>
                {n.title && <p className="text-[10px] font-mono text-gray-600 mt-1">{n.message}</p>}
                <p className="text-[9px] font-mono text-gray-700 mt-2 uppercase tracking-widest">{formatDate(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <span className="text-[8px] font-mono font-bold text-brand-400 bg-brand-500/8 border border-brand-500/20 px-2 py-1 rounded uppercase tracking-widest shrink-0">NEW</span>
              )}
            </motion.div>
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
