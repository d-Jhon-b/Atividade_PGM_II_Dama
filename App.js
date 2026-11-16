// App.js - Ponto de entrada do aplicativo (compatível com SnackExpoDev e Expo 55)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Tela1 from './tela1';
import Tela2 from './tela2';
import Tela3 from './tela3';
import Tela4 from './tela4';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tela1"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#f8fafc',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Tela1"
        component={Tela1}
        options={{
          headerShown: false,
          title: 'Boas-Vindas',
        }}
      />
      <Stack.Screen
        name="Tela2"
        component={Tela2}
        options={{
          title: 'Instruções',
          headerBackTitle: 'Início',
        }}
      />
      <Stack.Screen
        name="Tela3"
        component={Tela3}
        options={{
          headerShown: false,
          title: 'Jogo de Dama',
        }}
      />
      <Stack.Screen
        name="Tela4"
        component={Tela4}
        options={{
          title: 'Créditos',
          headerBackTitle: 'Início',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer independent={true}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
