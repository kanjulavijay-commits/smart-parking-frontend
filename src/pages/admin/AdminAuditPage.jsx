import { useEffect, useState } from 'react'
import { ScrollText, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '../../api/admin'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const ACTION_BADGE = {
  create: 'badge-green',
  update: 'badge-blue',
  delete: 'badge-red',
  login:  'badge-yellow',
  logout: 'badge-yellow',
}

export default function AdminAuditPage() {
  const [logs, setLogs]     = useState([])
  const [count, setCount]   = useState(0)
  const [page, setPage]     = useState(1)
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 25

  const load = (p = page) => {
    setLoading(true)
    adminApi.getAuditLogs({ page: p }).then(({ data }) => {
      setLogs(data.results ?? data)
      setCount(data.count ?? (data.results ?? data).length)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-sm text-gray-400 mt-1">{count} total events logged</p>
        </div>
        <button onClick={() => load()} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No audit logs" description="System events will appear here." />
      ) : (
        <>
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800">
                  <tr>
                    {['Timestamp', 'User', 'Action', 'Resource', 'Details'].map((h) => (
                      <th key={h} className="text-left py-4 px-4 text-xs text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{fmtDate(log.created_at)}</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">
                        {log.user?.full_name || log.user?.email || `User #${log.user}`}
                      </td>
                      <td className="py-3 px-4">
                        <span className={ACTION_BADGE[log.action?.toLowerCase()] || 'badge-blue'}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{log.resource_type || '—'}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs max-w-[240px] truncate" title={log.details}>
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
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
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })
}
