import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import AppLayout   from './components/layout/AppLayout'
import AdminLayout from './components/layout/AdminLayout'

// Auth pages
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// App pages
import DashboardPage     from './pages/dashboard/DashboardPage'
import ProfilePage       from './pages/dashboard/ProfilePage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import FindParkingPage   from './pages/parking/FindParkingPage'
import BookingsPage      from './pages/booking/BookingsPage'
import BookingDetailPage from './pages/booking/BookingDetailPage'
import BookSlotPage      from './pages/booking/BookSlotPage'
import PaymentPage       from './pages/payment/PaymentPage'

// Admin pages
import AdminOverviewPage  from './pages/admin/AdminOverviewPage'
import AdminUsersPage     from './pages/admin/AdminUsersPage'
import AdminLotsPage      from './pages/admin/AdminLotsPage'
import AdminBookingsPage  from './pages/admin/AdminBookingsPage'
import AdminRevenuePage   from './pages/admin/AdminRevenuePage'
import AdminLivePage      from './pages/admin/AdminLivePage'
import AdminAuditPage     from './pages/admin/AdminAuditPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User app — sidebar + auth guard */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/parking"        element={<FindParkingPage />} />
            <Route path="/book/:slotId"   element={<BookSlotPage />} />
            <Route path="/bookings"       element={<BookingsPage />} />
            <Route path="/bookings/:id"   element={<BookingDetailPage />} />
            <Route path="/pay/:bookingId" element={<PaymentPage />} />
            <Route path="/notifications"  element={<NotificationsPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
          </Route>

          {/* Admin panel — purple sidebar + admin-only guard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index             element={<AdminOverviewPage />} />
            <Route path="users"      element={<AdminUsersPage />} />
            <Route path="lots"       element={<AdminLotsPage />} />
            <Route path="bookings"   element={<AdminBookingsPage />} />
            <Route path="revenue"    element={<AdminRevenuePage />} />
            <Route path="live"       element={<AdminLivePage />} />
            <Route path="audit"      element={<AdminAuditPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
