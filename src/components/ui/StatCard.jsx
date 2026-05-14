export default function StatCard({ title, value, icon: Icon, color = 'blue', change }) {
  const colors = {
    blue:   'bg-brand-500/10 text-brand-400',
    green:  'bg-emerald-500/10 text-emerald-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red:    'bg-red-500/10 text-red-400',
  }
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value ?? '—'}</p>
        {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
      </div>
    </div>
  )
}
