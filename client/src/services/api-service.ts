import axios from 'axios';

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await axios.get<T>(`${this.baseUrl}/${endpoint}`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
        }
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await axios.post<T>(`${this.baseUrl}/${endpoint}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to post data to ${endpoint}: ${error.message}`);
        }
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await axios.put<T>(`${this.baseUrl}/${endpoint}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to put data to ${endpoint}: ${error.message}`);
        }
    }

    async delete<T>(endpoint: string): Promise<T> {
        try {
            const response = await axios.delete<T>(`${this.baseUrl}/${endpoint}`);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to delete data from ${endpoint}: ${error.message}`);
        }
    }
}

export default ApiService;