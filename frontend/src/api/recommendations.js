import client from './client'

export const getRecommendation = (dinerId, menuItemId, tableNumber) =>
  client.post('/recommendations/', {
    diner_id: dinerId,
    menu_item_id: menuItemId,
    table_number: tableNumber,
  }).then((r) => r.data)

export const submitRating = (recommendationId, stars, comment = '') =>
  client.post(`/recommendations/${recommendationId}/rate/`, { stars, comment }).then((r) => r.data)

export const getWineDetail = (wineId) =>
  client.get(`/wines/${wineId}/`).then((r) => r.data)
