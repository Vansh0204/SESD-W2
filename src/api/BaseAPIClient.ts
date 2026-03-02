import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Logger } from '../utils/logger';

export abstract class BaseAPIClient {
    protected readonly client: AxiosInstance;
    protected readonly baseURL: string;

    constructor(baseURL: string, headers?: Record<string, string>) {
        this.baseURL = baseURL;
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
            },
        });
    }

    protected async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.get(path, { params });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error(`Resource not found. Please check your input.`);
                } else if (error.response?.status === 401) {
                    throw new Error(`Unauthorized. Check your API key.`);
                } else if (error.response?.status === 429) {
                    throw new Error(`Rate limit exceeded. Please wait a moment and try again.`);
                } else if (error.code === 'ECONNABORTED') {
                    throw new Error(`Request timed out. Check your internet connection.`);
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            Logger.error('An unexpected error occurred.');
            throw error;
        }
    }
}
