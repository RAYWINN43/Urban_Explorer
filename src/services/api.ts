import { Alert } from 'react-native';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});