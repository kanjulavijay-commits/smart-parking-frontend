import client from './client'

export const paymentsApi = {
  getMyPayments:   (params) => client.get('/api/payments/', { params }),
  getPayment:      (id)     => client.get(`/api/payments/${id}/`),
  initiatePayment: (data)   => client.post('/api/payments/initiate/', data),
  confirmPayment:  (data)   => client.post('/api/payments/confirm/', data),
  getInvoice:      (id)     => client.get(`/api/payments/invoices/${id}/`),
}
