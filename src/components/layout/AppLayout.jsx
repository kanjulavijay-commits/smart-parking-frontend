import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../store/authStore'

export default function AppLayout() {
  const accessToken = useAuthStore((s) => s.accessToken)

  // If not logged in, redirect to login page
  if (!accessToken) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
