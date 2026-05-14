import client from './client'

export const bookingsApi = {
  getMyBookings:   (params) => client.get('/api/bookings/', { params }),
  getBooking:      (id)     => client.get(`/api/bookings/${id}/`),
  createBooking:   (data)   => client.post('/api/bookings/', data),
  cancelBooking:   (id)     => client.post(`/api/bookings/${id}/cancel/`),
  getQRCode:       (id)     => client.get(`/api/bookings/${id}/qr/`),
  checkIn:         (data)   => client.post('/api/bookings/checkin/', data),
  checkOut:        (data)   => client.post('/api/bookings/checkout/', data),
}
