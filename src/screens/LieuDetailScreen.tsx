import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
  Platform
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';

type LieuDetailRouteProp = RouteProp<RootStackParamList, 'LieuDetailScreen'>;

interface Props {
  route: LieuDetailRouteProp;
}

export default function LieuDetailScreen({ route }: Props) {

  const { lieu } = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChangeDate = (event: any, date?: Date) => {

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
  };

  const addEventToCalendar = async () => {
    try {

      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          "Impossible d'accéder au calendrier."
        );
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      const writableCalendar = calendars.find(
        (calendar) => calendar.allowsModifications
      );

      if (!writableCalendar) {
        Alert.alert(
          'Erreur',
          'Aucun calendrier disponible pour écrire un événement.'
        );
        return;
      }

      const startDate = selectedDate;
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      await Calendar.createEventAsync(writableCalendar.id, {
        title: lieu.title ?? 'Événement',
        startDate,
        endDate,
        notes: lieu.description ?? '',
        location: `${lieu.address_name ?? ''} ${lieu.address_city ?? ''}`
      });

      Alert.alert('Succès', 'Événement ajouté au calendrier');

    } catch (error) {
      Alert.alert('Erreur', "Impossible de créer l'événement");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {lieu.price_detail && (
        <Text style={styles.price}>{lieu.price_detail}</Text>
      )}

      {lieu.cover_url && (
        <Image
          source={{ uri: lieu.cover_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{lieu.title}</Text>

      <Text style={styles.field}>{lieu.address_name}</Text>
      <Text style={styles.field}>{lieu.address_street}</Text>
      <Text style={styles.field}>{lieu.address_zipcode}</Text>
      <Text style={styles.field}>{lieu.address_city}</Text>

      <Text style={styles.description}>À propos</Text>
      <Text style={styles.desc}>{lieu.description}</Text>

      {/* Sélecteur date */}
      <View style={styles.dateContainer}>

        <Button
          title={`Choisir date : ${selectedDate.toLocaleString()}`}
          onPress={() => setShowPicker(true)}
        />

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}

      </View>

      {/* Bouton calendrier */}
      <View style={styles.calendarButton}>
        <Button
          title="Ajouter au calendrier"
          onPress={addEventToCalendar}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },

  content: {
    padding: 20
  },

  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20
  },

  field: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8
  },

  description: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'center'
  },

  desc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    textAlign: 'justify'
  },

  price: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 20,
    marginBottom: 15
  },

  dateContainer: {
    marginTop: 30
  },

  calendarButton: {
    marginTop: 20
  }

});