import client from './client'

export const getFeed = (dinerId, archetype = null) =>
  client.get('/social/feed/', {
    params: { diner_id: dinerId, ...(archetype ? { archetype } : {}) },
  }).then(r => r.data)

export const getMyWall    = (dinerId) =>
  client.get('/social/wall/', { params: { diner_id: dinerId } }).then(r => r.data)

export const createPost   = (dinerId, payload) =>
  client.post('/social/wall/', { ...payload, diner_id: dinerId }).then(r => r.data)

export const reactToPost  = (postId, dinerId, reactionType) =>
  client.post(`/social/posts/${postId}/react/`, { diner_id: dinerId, reaction_type: reactionType }).then(r => r.data)

export const commentPost  = (postId, dinerId, text) =>
  client.post(`/social/posts/${postId}/comment/`, { diner_id: dinerId, text }).then(r => r.data)

export const toggleFollow = (targetDinerId, myDinerId) =>
  client.post(`/social/follow/${targetDinerId}/`, { diner_id: myDinerId }).then(r => r.data)

export const getMyPaladarType = (dinerId) =>
  client.get('/social/paladar-type/', { params: { diner_id: dinerId } }).then(r => r.data)

export const getAllPaladarTypes = () =>
  client.get('/social/paladar-types/').then(r => r.data)

export const getSuggestions = (dinerId) =>
  client.get('/social/suggestions/', { params: { diner_id: dinerId } }).then(r => r.data)
