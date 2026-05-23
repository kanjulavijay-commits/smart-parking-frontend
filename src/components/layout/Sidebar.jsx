import { NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MapPin, CalendarCheck, Bell, User, LogOut, ShieldCheck, Zap, Cpu } from 'lucide-react'
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
  const initials = user?.full_name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col relative z-20"
      style={{
        background: 'linear-gradient(180deg, rgba(12,4,4,0.98) 0%, rgba(8,2,2,0.99) 100%)',
        borderRight: '1px solid rgba(183,110,121,0.12)',
        boxShadow: '4px 0 40px rgba(0,0,0,0.5), inset -1px 0 0 rgba(183,110,121,0.08)',
      }}
    >
      {/* Inner glow strip */}
      <div className="absolute top-0 bottom-0 right-0 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(183,110,121,0.3) 30%, rgba(183,110,121,0.15) 70%, transparent)' }}
      />

      {/* Logo */}
      <div className="relative px-5 py-5" style={{ borderBottom: '1px solid rgba(183,110,121,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 glow-rose-sm"
            style={{ background: 'linear-gradient(135deg, #B76E79, #AD7B5E)', boxShadow: '0 0 20px rgba(183,110,121,0.4)' }}
          >
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              PARK<span style={{ background: 'linear-gradient(135deg,#C9A0B8,#B76E79,#AD7B5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SMART</span>
            </div>
            <p className="text-[9px] text-brand-500/50 uppercase tracking-widest mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>// COMMAND CENTER</p>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(183,110,121,0.07)' }}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[9px] text-gray-600 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>SYSTEM ONLINE</span>
          <div className="flex-1" />
          <span className="text-[9px] text-brand-500/50 font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>AI ACTIVE</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] text-gray-700 uppercase tracking-widest px-2 mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>NAVIGATION</p>
        {nav.map(({ to, icon: Icon, label, code }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'border border-transparent text-gray-600 hover:text-gray-200 hover:bg-white/4'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(183,110,121,0.15), rgba(173,123,94,0.08))',
                      border: '1px solid rgba(183,110,121,0.25)',
                      boxShadow: '0 0 20px rgba(183,110,121,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  />
                )}
                <span className={`relative text-[8px] w-5 shrink-0 ${isActive ? 'text-brand-500/70' : 'text-gray-700'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{code}</span>
                <Icon className={`relative w-4 h-4 shrink-0 transition-all duration-300 ${isActive ? 'text-brand-400 drop-shadow-[0_0_6px_rgba(183,110,121,0.8)]' : ''}`} />
                <span className="relative text-[11px] font-bold tracking-widest flex-1 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
                {isActive && (
                  <span className="relative w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: '#B76E79', boxShadow: '0 0 6px rgba(183,110,121,0.8)' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {(user?.is_staff || user?.role?.name === 'admin') && (
          <>
            <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <p className="text-[9px] text-gray-700 uppercase tracking-widest px-2 mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>ADMIN</p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 border ${
                  isActive
                    ? 'bg-red-500/10 border-red-500/25 text-red-400'
                    : 'border-transparent text-gray-600 hover:text-red-300 hover:bg-red-500/5'
                }`
              }
            >
              <span className="text-[8px] w-5 shrink-0 text-gray-700" style={{ fontFamily: 'JetBrains Mono, monospace' }}>06</span>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-bold tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>ADMIN PANEL</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid rgba(183,110,121,0.1)' }}>
        <Link to="/parking"
          className="shine flex items-center gap-2 px-3 py-2.5 rounded-xl mb-2 transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(183,110,121,0.2), rgba(173,123,94,0.15))',
            border: '1px solid rgba(183,110,121,0.3)',
            boxShadow: '0 0 20px rgba(183,110,121,0.1)',
          }}
        >
          <Zap className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span className="text-[10px] font-bold tracking-widest text-brand-300 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>BOOK A SLOT</span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(183,110,121,0.25), rgba(173,123,94,0.15))',
              border: '1px solid rgba(183,110,121,0.3)',
              boxShadow: '0 0 12px rgba(183,110,121,0.15)',
            }}
          >
            <span className="text-sm font-black text-brand-300" style={{ fontFamily: 'Orbitron, sans-serif' }}>{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-300 truncate uppercase tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {user?.full_name?.split(' ')[0] || 'OPERATOR'}
            </p>
            <p className="text-[9px] text-gray-700 truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
        >
          <span className="w-5 shrink-0" />
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>SIGN OUT</span>
        </button>
      </div>
    </aside>
  )
}
