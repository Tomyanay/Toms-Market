
import axios from 'axios'

export const api=axios.create({
    baseURL:String(import.meta.env.VITE_BACKEND_URL),
    timeout:10000,
    withCredentials:true
})
