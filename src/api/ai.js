import client from './client'

export const aiApi = {
  getLSTMForecast: (lotId) =>
    client.get('/api/ai/lstm-forecast/', { params: lotId ? { lot_id: lotId } : {} }),

  getRFPrediction: (params) =>
    client.get('/api/ai/rf-predict/', { params }),

  getDatasetStatus: () =>
    client.get('/api/ai/dataset-status/'),

  getAiStats: () =>
    client.get('/api/ai/stats/'),

  mockAnalyze: (lotId) =>
    client.post('/api/ai/mock-analyze/', { lot_id: lotId }),
}
