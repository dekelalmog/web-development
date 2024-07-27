import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: SERVER_URL,
});

apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token found');
    }
    const unintercepted = axios.create();
    const { data } = await unintercepted.get(`${SERVER_URL}/users/refresh-token`, {
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
    });

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
};

export default apiClient;