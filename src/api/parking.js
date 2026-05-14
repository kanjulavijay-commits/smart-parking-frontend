import client from './client'

export const parkingApi = {
  getLots:          ()       => client.get('/api/parking/lots/'),
  getLot:           (id)     => client.get(`/api/parking/lots/${id}/`),
  getSlots:         (params) => client.get('/api/parking/slots/', { params }),
  getSlot:          (id)     => client.get(`/api/parking/slots/${id}/`),
  getAvailability:  (lotId)  => client.get(`/api/parking/lots/${lotId}/availability/`),
  getFloors:        (lotId)  => client.get(`/api/parking/floors/`, { params: { lot: lotId } }),
  getZones:         (params) => client.get('/api/parking/zones/', { params }),
}
