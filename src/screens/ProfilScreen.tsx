import React, { useEffect, useState } from 'react';
import { StyleSheet,View,Text,TouchableOpacity,Image,Alert,Vibration} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraCapture } from '../components/CameraCapture';

const PHOTO_KEY = 'profile_photo_uri';

export const ProfilScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSavedPhoto();
  }, []);

  const loadSavedPhoto = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem(PHOTO_KEY);
      if (savedPhoto) {
        setPhotoUri(savedPhoto);
      }
    } catch (error) {
      console.log('Erreur chargement photo :', error);
    }
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      Alert.alert('Erreur', 'Vous devez prendre une photo.');
      return;
    }

    try {
      setIsSaving(true);

      await AsyncStorage.setItem(PHOTO_KEY, photoUri);

      Vibration.vibrate(300);
      Alert.alert('Succès', 'Photo de profil enregistrée.');
    } catch (error) {
      console.log('Erreur sauvegarde photo :', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder la photo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPhoto = async () => {
    try {
      await AsyncStorage.removeItem(PHOTO_KEY);
      setPhotoUri(null);
      setShowCamera(false);
      setIsSaving(false);
    } catch (error) {
      console.log('Erreur suppression photo :', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Photo de profil</Text>

      {!showCamera ? (
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => setShowCamera(true)}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera" size={40} color="white" />
              <Text style={styles.placeholderText}>Ajouter une photo</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <CameraCapture
          onPictureTaken={(uri) => {
            setPhotoUri(uri);
            setShowCamera(false);
            setIsSaving(false);
          }}
        />
      )}

      {photoUri && !showCamera && (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveText}>
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setShowCamera(true)}
          >
            <Text style={styles.retryText}>Reprendre la photo</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  profileContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    marginTop: 10,
  },
  saveButton: {
    marginTop: 40,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});