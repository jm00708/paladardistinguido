import client from './client'

export const registerDiner = (email, guestDinerId = null) =>
  client.post('/diners/register/', { email, guest_diner_id: guestDinerId }).then((r) => r.data)
