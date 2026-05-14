import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, MapPin, CalendarCheck,
  CreditCard, Activity, ScrollText, ShieldCheck, LogOut, ArrowLeft,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const nav = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Overview',       end: true },
  { to: '/admin/users',    icon: Users,           label: 'Users' },
  { to: '/admin/lots',     icon: MapPin,           label: 'Parking Lots' },
  { to: '/admin/bookings', icon: CalendarCheck,   label: 'Bookings' },
  { to: '/admin/revenue',  icon: CreditCard,      label: 'Revenue' },
  { to: '/admin/live',     icon: Activity,        label: 'Live Monitor' },
  { to: '/admin/audit',    icon: ScrollText,      label: 'Audit Logs' },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  // Only admins (is_staff) can see this layout
  if (!user) return <Navigate to="/login" replace />
  if (!user.is_staff && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Admin Sidebar */}
      <aside className="w-64 shrink-0 h-screen sticky top-0 bg-gray-900 border-r border-purple-900/40 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Admin Panel</p>
              <p className="text-xs text-purple-400">ParkSmart</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-purple-900/40 space-y-0.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Back to App
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
