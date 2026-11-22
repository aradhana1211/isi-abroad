/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from 'CommonJS/common'

type AxiosMethods = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'

interface fetchOptions {
  method?: AxiosMethods
  path: string
  data?: object | any
  options?: object | any
}

const fetch = ({ method = 'get', path, data = {}, options = {} }: fetchOptions) => {
  return axiosClient.request({ method, url: path, data, ...options })
}

const login = async (data: any) => {
  return await fetch({ path: 'auth/login', data, method: 'post' })
}

const checkLogin = async () => {
  return await fetch({ path: 'user' })
}

const http = {
  login,
  fetch,
  checkLogin
}

export default http
