import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MapPin, CalendarCheck, CreditCard, Bell, User, LogOut, ShieldCheck, Zap } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const nav = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'DASHBOARD',    code: '01' },
  { to: '/parking',       icon: MapPin,           label: 'FIND PARKING', code: '02' },
  { to: '/bookings',      icon: CalendarCheck,    label: 'MY BOOKINGS',  code: '03' },
  { to: '/notifications', icon: Bell,             label: 'ALERTS',       code: '04' },
  { to: '/profile',       icon: User,             label: 'PROFILE',      code: '05' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-black border-r border-white/6 flex flex-col relative z-20">
      {/* subtle vertical grid line */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px)',
        backgroundSize: '100% 60px',
      }} />

      {/* Logo */}
      <div className="relative px-5 py-5 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <MapPin className="w-4.5 h-4.5 text-black" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white">PARK<span className="text-brand-500">SMART</span></span>
            <p className="text-[9px] font-mono text-brand-500/50 uppercase tracking-widest">// COMMAND CENTER</p>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="relative px-5 py-2.5 border-b border-white/6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">SYSTEM ONLINE</span>
          <div className="flex-1" />
          <span className="text-[9px] font-mono text-brand-500/40">AI ACTIVE</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest px-2 mb-3">NAVIGATION</p>
        {nav.map(({ to, icon: Icon, label, code }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/10 border border-brand-500/25 text-brand-400'
                  : 'border border-transparent text-gray-600 hover:text-gray-200 hover:bg-white/4'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-[8px] font-mono w-5 shrink-0 ${isActive ? 'text-brand-500/60' : 'text-gray-700'}`}>{code}</span>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-mono font-bold tracking-widest flex-1">{label}</span>
                {isActive && <span className="w-1 h-1 bg-brand-500 rounded-full" />}
              </>
            )}
          </NavLink>
        ))}

        {(user?.is_staff || user?.role === 'admin') && (
          <>
            <div className="h-px bg-white/5 my-3" />
            <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest px-2 mb-2">ADMIN</p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                  isActive
                    ? 'bg-red-500/10 border-red-500/25 text-red-400'
                    : 'border-transparent text-gray-600 hover:text-red-300 hover:bg-red-500/5'
                }`
              }
            >
              <span className="text-[8px] font-mono w-5 shrink-0 text-gray-700">06</span>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-mono font-bold tracking-widest">ADMIN PANEL</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="relative px-3 py-4 border-t border-white/6 space-y-1">
        <Link to="/parking"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 transition-all mb-2"
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[10px] font-mono font-bold tracking-widest">BOOK A SLOT</span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-brand-500/20 border border-brand-500/30 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-brand-400">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-mono font-bold text-gray-300 truncate uppercase tracking-wide">
              {user?.full_name?.split(' ')[0] || 'OPERATOR'}
            </p>
            <p className="text-[9px] font-mono text-gray-700 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:text-red-400 hover:bg-red-500/8 transition-all"
        >
          <span className="text-[8px] font-mono w-5 shrink-0" />
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-mono font-bold tracking-widest">SIGN OUT</span>
        </button>
      </div>
    </aside>
  )
}
