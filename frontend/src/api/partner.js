import axios from 'axios'

const partnerClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

partnerClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('partner_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

partnerClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('partner_refresh_token')
        const { data } = await axios.post('/api/v1/auth/token/refresh/', { refresh })
        localStorage.setItem('partner_access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return partnerClient(original)
      } catch {
        localStorage.removeItem('partner_access_token')
        localStorage.removeItem('partner_refresh_token')
        window.location.href = '/aliado/login'
      }
    }
    return Promise.reject(error)
  },
)

export const partnerLogin = (email, password) =>
  axios.post('/api/v1/auth/token/', { username: email, password }).then(r => r.data)

export const getDashboardStats = () =>
  partnerClient.get('/dashboard/stats/').then(r => r.data)

export const getWeeklyTrend = () =>
  partnerClient.get('/dashboard/trend/').then(r => r.data)

export const getRecentHistory = (days = 1) =>
  partnerClient.get('/dashboard/history/', { params: { days } }).then(r => r.data)

export const getArchetypeInsights = () =>
  partnerClient.get('/dashboard/archetypes/').then(r => r.data)

export const getInventory = () =>
  partnerClient.get('/dashboard/inventory/').then(r => r.data)

export const updateInventoryItem = (id, data) =>
  partnerClient.patch(`/dashboard/inventory/${id}/`, data).then(r => r.data)

export default partnerClient
