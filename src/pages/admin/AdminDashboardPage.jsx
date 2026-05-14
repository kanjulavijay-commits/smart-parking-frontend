import { useEffect, useState } from 'react'
import { Users, MapPin, CalendarCheck, CreditCard, TrendingUp, Activity } from 'lucide-react'
import client from '../../api/client'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'

export default function AdminDashboardPage() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats from multiple endpoints in parallel
    Promise.all([
      client.get('/api/users/?limit=1'),
      client.get('/api/parking/lots/?limit=1'),
      client.get('/api/bookings/?limit=1'),
      client.get('/api/payments/?limit=1'),
    ]).then(([users, lots, bookings, payments]) => {
      setStats({
        users:    users.data.count    ?? users.data.length,
        lots:     lots.data.count     ?? lots.data.length,
        bookings: bookings.data.count ?? bookings.data.length,
        payments: payments.data.count ?? payments.data.length,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">System overview and management.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"    value={stats?.users}    icon={Users}         color="blue" />
        <StatCard title="Parking Lots"   value={stats?.lots}     icon={MapPin}        color="green" />
        <StatCard title="Total Bookings" value={stats?.bookings} icon={CalendarCheck} color="yellow" />
        <StatCard title="Transactions"   value={stats?.payments} icon={CreditCard}    color="red" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminCard
          icon={Users}
          title="User Management"
          description="View, activate, deactivate, and manage user roles."
          href="/api/users/"
          color="blue"
        />
        <AdminCard
          icon={MapPin}
          title="Parking Lots"
          description="Add, edit, and manage parking lots, floors, and zones."
          href="/api/parking/lots/"
          color="green"
        />
        <AdminCard
          icon={Activity}
          title="Live Monitoring"
          description="Real-time slot availability and sensor data."
          href="/api/parking/slots/"
          color="yellow"
        />
        <AdminCard
          icon={TrendingUp}
          title="Revenue Reports"
          description="Payment and revenue analytics."
          href="/api/payments/"
          color="red"
        />
      </div>

      {/* Admin panel hint */}
      <div className="card border-dashed border-gray-700">
        <p className="text-sm text-gray-400">
          For full database management, visit the{' '}
          <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300 underline">
            Django Admin Panel
          </a>
          .
        </p>
      </div>
    </div>
  )
}

function AdminCard({ icon: Icon, title, description, color }) {
  const colors = {
    blue:   'bg-brand-500/10 text-brand-400',
    green:  'bg-emerald-500/10 text-emerald-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red:    'bg-red-500/10 text-red-400',
  }
  return (
    <div className="card hover:border-gray-700 transition-colors cursor-default">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-semibold text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}
