import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import { MapsScreen } from './src/screens/MapsScreen';
import { ProfilScreen } from './src/screens/ProfilScreen';
import LieuDetailScreen from './src/screens/LieuDetailScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Accueil') iconName = 'home';
          else if (route.name === 'Maps') iconName = 'map';
          else if (route.name === 'Profil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Maps" component={MapsScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator>

        {/* Tabs */}
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* écran détail */}
        <Stack.Screen
          name="LieuDetail"
          component={LieuDetailScreen}
          options={{ title: "Détail du lieu" }}
        />

      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
    </SafeAreaView>
  );
}