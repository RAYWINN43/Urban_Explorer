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

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const addEventToCalendar = async () => {
    try {

      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission refusée', "Impossible d'accéder au calendrier.");
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

      // fusion date + heure
      const startDate = new Date(date);
      startDate.setHours(time.getHours());
      startDate.setMinutes(time.getMinutes());

      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

      await Calendar.createEventAsync(writableCalendar.id, {
        title: lieu.title ?? 'Événement',
        startDate,
        endDate,
        notes: lieu.description?.replace(/<[^>]*>/g, '') ?? '',
        location: `${lieu.address_name ?? ''} ${lieu.address_city ?? ''}`
      });

      Alert.alert('Succès', 'Événement ajouté au calendrier');

    } catch (error) {
      Alert.alert('Erreur', "Impossible de créer l'événement.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {lieu.cover_url && (
        <Image
          source={{ uri: lieu.cover_url }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{lieu.title}</Text>

      <Text style={styles.field}>{lieu.address_name}</Text>
      <Text style={styles.field}>{lieu.address_street}</Text>
      <Text style={styles.field}>{lieu.address_zipcode}</Text>
      <Text style={styles.field}>{lieu.address_city}</Text>

      <View style={{ marginTop: 30 }}>
        <Button
          title={`Choisir la date : ${date.toLocaleDateString()}`}
          onPress={() => setShowDatePicker(true)}
        />

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onChangeDate}
          />
        )}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          title={`Choisir l'heure : ${time.toLocaleTimeString()}`}
          onPress={() => setShowTimePicker(true)}
        />

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            onChange={onChangeTime}
          />
        )}
      </View>

      <View style={{ marginTop: 20 }}>
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
    textAlign: 'center',
    marginBottom: 20
  },

  field: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6
  }

});