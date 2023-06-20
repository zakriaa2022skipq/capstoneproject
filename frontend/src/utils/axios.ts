import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.environment === 'development' ? process.env.SERVER_URL : '/',
});

export default instance;
