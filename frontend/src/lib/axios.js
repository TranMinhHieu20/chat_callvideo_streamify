import axios from 'axios'

const base_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: base_URL,
  withCredentials: true // send cookies with requests
})

export default axiosInstance
