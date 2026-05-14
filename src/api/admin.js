import client from './client'

export const adminApi = {
  // Users
  getUsers:       (params) => client.get('/api/users/', { params }),
  updateUser:     (id, data) => client.patch(`/api/users/${id}/`, data),
  deleteUser:     (id) => client.delete(`/api/users/${id}/`),

  // Audit logs
  getAuditLogs:   (params) => client.get('/api/users/audit-logs/', { params }),

  // Parking lots (admin can create/edit)
  createLot:      (data) => client.post('/api/parking/lots/', data),
  updateLot:      (id, data) => client.patch(`/api/parking/lots/${id}/`, data),
  deleteLot:      (id) => client.delete(`/api/parking/lots/${id}/`),

  // All bookings (admin sees all)
  getAllBookings:  (params) => client.get('/api/bookings/', { params }),

  // Revenue report
  getRevenue:     () => client.get('/api/payments/admin/revenue/'),

  // Live gate status
  getLiveStatus:  (lotId) => client.get('/api/bookings/gate/status/', { params: { lot_id: lotId } }),

  // Trigger overstay check
  checkOverstays: () => client.post('/api/bookings/gate/check-overstays/'),

  // Payment summary
  getPaymentSummary: () => client.get('/api/payments/summary/'),

  // Support tickets
  getSupportTickets: (params) => client.get('/api/users/support/', { params }),
  updateTicket:   (id, data) => client.patch(`/api/users/support/${id}/`, data),
}
