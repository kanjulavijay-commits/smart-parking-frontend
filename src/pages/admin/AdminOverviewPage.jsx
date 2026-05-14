import { useEffect, useState } from 'react'
import { Users, MapPin, CalendarCheck, CreditCard, Activity, TrendingUp, Clock, AlertTriangle } from 'lucide-react'
import { adminApi } from '../../api/admin'
import { parkingApi } from '../../api/parking'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminOverviewPage() {
  const [stats, setStats]     = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [live, setLive]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getUsers({ limit: 1 }),
      parkingApi.getLots(),
      adminApi.getAllBookings({ limit: 1 }),
      adminApi.getRevenue(),
      adminApi.getLiveStatus(),
    ]).then(([users, lots, bookings, rev, liveData]) => {
      setStats({
        users:    users.data.count    ?? users.data.length,
        lots:     lots.data.count     ?? lots.data.length ?? (lots.data.results ?? lots.data).length,
        bookings: bookings.data.count ?? bookings.data.length,
        revenue:  rev.data.summary?.total_collected ?? 0,
      })
      setRevenue(rev.data.daily_revenue?.slice(0, 14).reverse() ?? [])
      setLive(liveData.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time platform health and statistics.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"      value={stats?.users}                     icon={Users}         color="blue" />
        <StatCard title="Parking Lots"     value={stats?.lots}                      icon={MapPin}        color="green" />
        <StatCard title="Total Bookings"   value={stats?.bookings}                  icon={CalendarCheck} color="yellow" />
        <StatCard title="Revenue Collected" value={`₹${Number(stats?.revenue ?? 0).toLocaleString('en-IN')}`} icon={CreditCard} color="red" />
      </div>

      {/* Live status bar */}
      {live && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <Activity className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{live.active_sessions ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Active Sessions</p>
          </div>
          <div className="card text-center">
            <MapPin className="w-6 h-6 text-brand-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{live.slot_stats?.available ?? '—'}</p>
            <p className="text-xs text-gray-500 mt-1">Available Slots</p>
          </div>
          <div className="card text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{live.slot_stats?.occupied ?? '—'}</p>
            <p className="text-xs text-gray-500 mt-1">Occupied Slots</p>
          </div>
        </div>
      )}

      {/* Revenue chart */}
      {revenue && revenue.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-semibold text-white">Revenue (Last 14 Days)</p>
              <p className="text-xs text-gray-500 mt-0.5">Daily collected payments</p>
            </div>
            <TrendingUp className="w-5 h-5 text-brand-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenue} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, color: '#f3f4f6' }}
                formatter={(v) => [`₹${v}`, 'Revenue']}
                labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Active sessions table */}
      {live?.sessions?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="font-semibold text-white">Live Sessions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['User', 'Vehicle', 'Slot', 'Check-in', 'Duration'].map((h) => (
                    <th key={h} className="text-left py-3 px-2 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {live.sessions.slice(0, 8).map((s) => (
                  <tr key={s.session_id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-2 text-gray-300">{s.user}</td>
                    <td className="py-3 px-2"><span className="badge-blue font-mono">{s.vehicle}</span></td>
                    <td className="py-3 px-2 text-gray-400">{s.floor} · {s.slot}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">{formatTime(s.check_in)}</td>
                    <td className="py-3 px-2">
                      <span className={s.overstay_minutes > 0 ? 'badge-red' : 'badge-green'}>
                        {s.overstay_minutes > 0 ? `+${s.overstay_minutes}m overstay` : `${s.duration_minutes}m`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
