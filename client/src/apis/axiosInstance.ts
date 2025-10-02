import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URI


const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
})


export default axiosInstance