import client from './client'

export const notificationsApi = {
  getAll:   (params) => client.get('/api/notifications/', { params }),
  markRead: (id)     => client.patch(`/api/notifications/${id}/`, { is_read: true }),
  markAllRead: ()    => client.post('/api/notifications/mark-all-read/'),
}
