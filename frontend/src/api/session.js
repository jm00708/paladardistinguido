import client from './client'

export const initSession = (table) =>
  client.get('/session/', { params: { table } }).then((r) => r.data)

export const createGuest = (ageVerified) =>
  client.post('/diners/guest/', { age_verified: ageVerified }).then((r) => r.data)

export const submitQuestionnaire = (dinerId, answers) =>
  client.post(`/diners/${dinerId}/questionnaire/`, answers).then((r) => r.data)
