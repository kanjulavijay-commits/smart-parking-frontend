import client from './client'

export const authApi = {
  login:              (data) => client.post('/api/auth/login/', data),
  register:           (data) => client.post('/api/users/register/', data),
  logout:             (data) => client.post('/api/auth/logout/', data),
  refreshToken:       (data) => client.post('/api/auth/refresh/', data),
  verifyEmail:        (data) => client.post('/api/auth/verify-email/', data),
  forgotPassword:     (data) => client.post('/api/auth/forgot-password/', data),
  resetPassword:      (data) => client.post('/api/auth/reset-password/', data),
  getProfile:         ()     => client.get('/api/users/me/'),
  updateProfile:      (data) => client.patch('/api/users/me/', data),
}
