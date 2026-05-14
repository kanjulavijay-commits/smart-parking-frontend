import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MapPin, CalendarCheck, CreditCard, Bell, User, LogOut, Settings, ShieldCheck } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const nav = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/parking',            icon: MapPin,          label: 'Find Parking' },
  { to: '/bookings',           icon: CalendarCheck,   label: 'My Bookings' },
  { to: '/payments',           icon: CreditCard,      label: 'Payments' },
  { to: '/notifications',      icon: Bell,            label: 'Notifications' },
  { to: '/profile',            icon: User,            label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">ParkSmart</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        {(user?.is_staff || user?.role === 'admin') && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mt-2 border ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                  : 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/10 border-transparent'
              }`
            }
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {user?.first_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
