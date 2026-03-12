import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraCapture } from '../components/CameraCapture';

export const ProfilScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = () => {
    if (!photoUri) {
      Alert.alert('Erreur', 'Vous devez prendre une photo.');
      return;
    }

    Vibration.vibrate(300);
    setIsSaving(true)
    Alert.alert('Succès', 'Photo de profil enregistrée.');
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

      {photoUri && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>Sauvegarder</Text>
          
        </TouchableOpacity>
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
    padding: 15,
    borderRadius: 10,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});