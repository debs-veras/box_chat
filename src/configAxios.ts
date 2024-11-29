import axios, { AxiosInstance } from 'axios';
import { API_URL } from './utils/api';

const getAxios = async (timeout: number = 600000) => {
    // const token: string | null = localStorage.getItem('@admin_Token');
    const instance: AxiosInstance = axios.create({
        baseURL: API_URL,
        timeout: timeout,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    });

    return instance
}

export default getAxios;