import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../store/authStore'

const GridBg = () => (
  <div className="fixed inset-0 pointer-events-none z-0" style={{
    backgroundImage: 'linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
  }} />
)

export default function AppLayout() {
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!accessToken) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-black relative overflow-hidden">
      <GridBg />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent z-10" />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
