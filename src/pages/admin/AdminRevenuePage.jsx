import { useEffect, useState } from 'react'
import { CreditCard, TrendingUp, Receipt, BarChart2, RefreshCw } from 'lucide-react'
import { adminApi } from '../../api/admin'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#111827', border: '1px solid #1f2937', borderRadius: 12, color: '#f3f4f6' },
}

export default function AdminRevenuePage() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getRevenue().then(({ data: d }) => setData(d)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const summary = data?.summary ?? {}
  const daily   = (data?.daily_revenue ?? []).slice(0, 30).reverse()

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Payment and earnings overview.</p>
        </div>
        <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collected"  value={`₹${fmt(summary.total_collected)}`}  icon={CreditCard}  color="green" />
        <StatCard title="Pending Payments" value={`₹${fmt(summary.total_pending)}`}     icon={Receipt}     color="yellow" />
        <StatCard title="Total Refunded"   value={`₹${fmt(summary.total_refunded)}`}    icon={TrendingUp}  color="red" />
        <StatCard title="Transactions"     value={summary.total_payments ?? 0}           icon={BarChart2}   color="blue" />
      </div>

      {/* Area chart — daily revenue */}
      {daily.length > 0 && (
        <div className="card">
          <p className="font-semibold text-white mb-1">Daily Revenue (Last 30 Days)</p>
          <p className="text-xs text-gray-500 mb-6">Total payments collected per day</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`} />
              <Tooltip {...TOOLTIP_STYLE}
                formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
                labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'long' })} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar chart — daily transaction count */}
      {daily.length > 0 && (
        <div className="card">
          <p className="font-semibold text-white mb-1">Daily Transactions</p>
          <p className="text-xs text-gray-500 mb-6">Number of payments per day</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={daily} barSize={16}>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Transactions']}
                labelFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'long' })} />
              <Bar dataKey="transactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily revenue breakdown table */}
      {daily.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <p className="font-semibold text-white">Daily Breakdown</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  {['Date', 'Revenue', 'Transactions', 'Avg. per Transaction'].map((h) => (
                    <th key={h} className="text-left py-3 px-6 text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {[...daily].reverse().map((d) => (
                  <tr key={d.date} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-6 text-gray-300">
                      {new Date(d.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="py-3 px-6 text-emerald-400 font-medium">
                      ₹{Number(d.revenue).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-6 text-gray-400">{d.transactions}</td>
                    <td className="py-3 px-6 text-gray-400">
                      ₹{d.transactions ? (d.revenue / d.transactions).toFixed(0) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {daily.length === 0 && (
        <div className="card text-center py-16">
          <BarChart2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400">No revenue data yet. Payments will appear here.</p>
        </div>
      )}
    </div>
  )
}

function fmt(v) {
  return Number(v ?? 0).toLocaleString('en-IN')
}
