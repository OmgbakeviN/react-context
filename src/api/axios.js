import axios from 'axios';
import store from '../reduxtool/store'; // Importez votre store Redux

// Créez une instance Axios de base
const axiosInstance = axios.create({
  baseURL: 'https://fcom.pythonanywhere.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajoutez un intercepteur pour injecter le token avant chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérez le token directement depuis le store Redux
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exportez l'instance configurée
export default axiosInstance;