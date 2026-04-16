import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'http://187.127.145.211:8080'
    : '',
});

export default api;
