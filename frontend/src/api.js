// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',  // Asegúrate de que este es el puerto que usa Django
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/Users/register/', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/Users/login/', credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await api.post('/Users/refresh_token/', { refresh_token: refreshToken });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};