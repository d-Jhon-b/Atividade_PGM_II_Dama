// App.tsx - Arquivo principal na raiz chamando as telas de src/app/screens
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Tela1Screen from './src/app/screens/tela1';
import Tela2Screen from './src/app/screens/tela2';
import Tela3Screen from './src/app/screens/tela3';
import Tela4Screen from './src/app/screens/tela4';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
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
            component={Tela1Screen}
            options={{
              headerShown: false,
              title: 'Boas-Vindas',
            }}
          />
          <Stack.Screen
            name="Tela2"
            component={Tela2Screen}
            options={{
              headerShown: true,
              title: 'Instruções',
              headerBackTitle: 'Início',
            }}
          />
          <Stack.Screen
            name="Tela3"
            component={Tela3Screen}
            options={{
              headerShown: false,
              title: 'Jogo de Dama',
            }}
          />
          <Stack.Screen
            name="Tela4"
            component={Tela4Screen}
            options={{
              headerShown: true,
              title: 'Créditos',
              headerBackTitle: 'Início',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
