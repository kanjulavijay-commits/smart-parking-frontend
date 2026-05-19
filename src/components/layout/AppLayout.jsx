import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../store/authStore'

const AmbientOrbs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Rose orb — top left */}
    <div
      className="orb absolute -top-32 -left-32 w-[500px] h-[500px] animate-blob"
      style={{ background: 'radial-gradient(circle, rgba(183,110,121,0.22) 0%, transparent 70%)' }}
    />
    {/* Copper orb — bottom right */}
    <div
      className="orb absolute -bottom-48 -right-48 w-[600px] h-[600px] animate-blob animation-delay-4000"
      style={{ background: 'radial-gradient(circle, rgba(173,123,94,0.18) 0%, transparent 70%)' }}
    />
    {/* Mauve orb — center */}
    <div
      className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] animate-blob-slow animation-delay-2000"
      style={{ background: 'radial-gradient(circle, rgba(201,160,184,0.10) 0%, transparent 70%)' }}
    />
    {/* Grid overlay */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(183,110,121,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(183,110,121,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
  </div>
)

export default function AppLayout() {
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!accessToken) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-[#080202] relative overflow-hidden">
      <AmbientOrbs />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent z-30" />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
