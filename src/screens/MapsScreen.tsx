import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocationMap } from '../components/LocationMap';

export const MapsScreen: React.FC = () => {

  return (
    <LocationMap/>
  );
};

const styles = StyleSheet.create({
  
});