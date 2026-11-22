import axios from 'axios'
import linkifyHtml from 'linkify-html'

export const getToken = () => {
  return localStorage.getItem('jwt')
}

export const setToken = (token: string) => {
  return localStorage.setItem('jwt', token)
}
export const removeBlankPairs = (obj: object) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => key.trim() !== '' && value !== '' && value !== null && value !== undefined)
  )
}

export const linkify = (content?: string, options = {}) => {
  const withOptions = {
    target: '_blank',
    ...options
  }
  return linkifyHtml(content ?? '', withOptions)
}

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-type': 'application/json'
  }
})

axiosClient.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*'
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      // TODO: handle internal server error
    } else if (error.response.status === 401) {
      // handle unauthorized request
      localStorage.clear()
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export default axiosClient
