import { motion } from 'framer-motion'

const colorMap = {
  blue:   { border: 'border-brand-500/25',   icon: 'text-brand-400',   bg: 'bg-brand-500/8',    bar: 'bg-brand-500' },
  green:  { border: 'border-emerald-500/25', icon: 'text-emerald-400', bg: 'bg-emerald-500/8',  bar: 'bg-emerald-500' },
  yellow: { border: 'border-yellow-500/25',  icon: 'text-yellow-400',  bg: 'bg-yellow-500/8',   bar: 'bg-yellow-500' },
  red:    { border: 'border-red-500/25',     icon: 'text-red-400',     bg: 'bg-red-500/8',      bar: 'bg-red-500' },
  orange: { border: 'border-brand-500/25',   icon: 'text-brand-400',   bg: 'bg-brand-500/8',    bar: 'bg-brand-500' },
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', change, index = 0 }) {
  const c = colorMap[color] || colorMap.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-black border ${c.border} rounded-2xl p-5 overflow-hidden group`}
    >
      <div className={`absolute top-0 left-0 right-0 h-px ${c.bar} opacity-60`} />
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{title}</p>
        <div className={`w-8 h-8 ${c.bg} border ${c.border} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
      </div>
      <p className="text-3xl font-black text-white font-mono">{value ?? '—'}</p>
      {change && <p className="text-[10px] font-mono text-gray-700 mt-2 uppercase tracking-wide">{change}</p>}
    </motion.div>
  )
}
