import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Coordinates, LocationMapProps } from '../types';
import apiClient from '../services/api';
import { ApiResponse, Lieu } from '../types';

export const LocationMap: React.FC<LocationMapProps> = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [userLocation, setUserLocation] = useState<Coordinates>()
  const [selectedMarker, setSelectedMarker] = useState<Lieu | null>()
  const [lastPressedMarker, setLastPressedMarker] = useState<string>('');

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setErrorMsg("Permission de localisation refusée.");
          setIsLoading(false);
          return;
        }
        const currentPosition = await Location.getCurrentPositionAsync({});
        const coords: Coordinates = {
          lat: currentPosition.coords.latitude,
          lon: currentPosition.coords.longitude,
        };
        setUserLocation(coords);
      } catch (error) {
        setErrorMsg("Impossible de récupérer la position actuelle.");
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  
  const fetchLieux = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Lieu>>(
        ``
      );
      setLieux(response.data.results)
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue');
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLieux();
  }, []);
  

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Recherche de votre position...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  /*// Si on veut centrer la position sur Paris
  const initialRegion: Region = {
    latitude: 48.8566, 
    longitude: 2.3522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };//*/

  // Si on veut centrer la position sur l'utilisateur
  const initialRegion: Region = {
    latitude: userLocation.lat, 
    longitude: userLocation.lon,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };//*/

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {lieux.map((location) => 
          <Marker coordinate={{
            latitude:location.lat_lon.lat,
            longitude:location.lat_lon.lon, }}
            pinColor="blue"
            key={location.id}
            title={location.title}
            description={location.description?.replace(/<[^>]*>/g,'')}
            opacity={.7}
            zIndex={1}
            onPress={() => {
              lastPressedMarker!=location.id? setLastPressedMarker(location.id) :
              setSelectedMarker(location)}}/>
        )}
        <Marker coordinate={initialRegion}
        pinColor="red"
        isPreselected={true}
        zIndex={10} />
      </MapView>

      <Modal
        isVisible={!!selectedMarker}
        onBackdropPress={() => setSelectedMarker(null)}
        style={styles.modal}
      >
        <ScrollView style={styles.callout}>
          <Text style={styles.title}>{selectedMarker?.title}</Text>
          <Text>{selectedMarker?.description?.replace(/<[^>]*>/g,'')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedMarker(null)}
          >
            <Text>Fermer</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  mapContainer: {
    height: '100%'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  callout: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginTop: 50,
    marginBottom:50
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});