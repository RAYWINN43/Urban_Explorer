import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?where=lat_lon%20is%20not%20null&limit=30',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Requête envoyée : ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error: AxiosError) => {
    console.log('Erreur avant envoi de la requête :', error.name);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log('Message :', error.message);
    console.log('Status HTTP :', error.response?.status);
    console.log('URL appelée :', error.config?.url);

    return Promise.reject(error);
  }
);

export default apiClient;
