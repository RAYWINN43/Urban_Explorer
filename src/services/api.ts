import { Alert } from 'react-native';
import { Lieu, ApiResponse } from '../types';
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=30',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getLieu = async (data: Lieu): Promise<ApiResponse<Lieu>> => {
  try {
    const response = await apiClient.post('/get', data);
    if (response.status === 201) {
      console.log('succès');
      console.log('Données envoyées :', data);
      return {
        success: true,
        data: response.data,
      };
    }
  } catch (error: any) {
    Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la soumission de l\'incident.');
    return {
      success: false,
    };
  }
};