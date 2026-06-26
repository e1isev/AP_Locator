import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import MapScreen from './src/screens/MapScreen';
import CafeDetailScreen from './src/screens/CafeDetailScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'AP Locator' }} />
        <Stack.Screen
          name="CafeDetail"
          component={CafeDetailScreen}
          options={({ route }) => ({ title: route.params.cafe.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
