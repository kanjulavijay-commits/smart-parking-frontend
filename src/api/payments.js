import client from './client'

export const paymentsApi = {
  getMyPayments:      (params) => client.get('/api/payments/', { params }),
  getPayment:         (id)     => client.get(`/api/payments/${id}/`),
  getPaymentByBooking:(bookingId) => client.get('/api/payments/', { params: { booking: bookingId } }),
  confirmPayment:     (paymentId, method) => client.post(`/api/payments/${paymentId}/confirm/`, { method }),
  getInvoice:         (id)     => client.get(`/api/payments/invoices/${id}/`),
}
