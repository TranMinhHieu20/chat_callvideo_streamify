import axios from 'axios'

const base_URL = 'http://localhost:3001/api'

const axiosInstance = axios.create({
  baseURL: base_URL,
  withCredentials: true // send cookies with requests
})

export default axiosInstance
