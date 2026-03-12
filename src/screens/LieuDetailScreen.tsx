import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type LieuDetailRouteProp = RouteProp<RootStackParamList, 'LieuDetailScreen'>;

interface Props {
  route: LieuDetailRouteProp;
}

const LieuDetailScreen: React.FC<Props> = ({ route }) => {
  const { lieu } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.price}>{lieu.price_detail.replace(/<[^>]*>/g,'')}</Text>
      {lieu.cover_url && (
        <Image
          source={{ uri: lieu.cover_url }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text style={styles.title}>{lieu.title}</Text>

      <Text style={styles.field}>{lieu.address_name}</Text>
      <Text style={styles.field}>{lieu.address_street}</Text>
      <Text style={styles.field}>{lieu.address_zipcode}</Text>
      <Text style={styles.field}>{lieu.address_city}</Text>
      <Text style={styles.description}>À propos: </Text>
      <Text style={styles.desc}>{lieu.description?.replace(/<[^>]*>/g,'')}</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 20,
  },

  image: {
    width: '100%',
    borderRadius: 10,
    height: 300,
    alignSelf: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 30,
    textAlign: "center",
  },

  field: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  difficulte: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 35,
  },

  description: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#222",
    marginTop: 20,
    marginBottom: 30,
  },

  desc: {
    fontSize: 13,
    lineHeight: 24,
    color: "#555",
    fontStyle: "italic",
    textAlign: "justify",
  },

  price: {
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#e0e0e0",
    padding: 10,
    width: "auto",
    borderRadius: 30,
  },
});

export default LieuDetailScreen;