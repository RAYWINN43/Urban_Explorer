import { Alert } from 'react-native';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30&where=lat_lon%20IS%20NOT%20NULL',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
