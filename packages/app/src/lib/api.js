/* eslint-disable camelcase */
import axios from 'axios'
import { urlBase } from '../utils/definitions'

const api = axios.create({
  baseURL: urlBase,
})

api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token')
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
