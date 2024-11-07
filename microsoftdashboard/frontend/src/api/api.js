import axios from 'axios';

const API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api"


const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getData = async (endpoint) => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        throw error.response.data; 
    }
};

export const postData = async (endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw error.response.data; 
    }
};

