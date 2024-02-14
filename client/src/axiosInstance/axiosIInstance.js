// axios instance
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://busbuzz.onrender.com',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;