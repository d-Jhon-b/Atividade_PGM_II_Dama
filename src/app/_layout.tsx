import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
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
          name="index"
          options={{
            headerShown: false,
            title: 'Boas-Vindas',
          }}
        />
        <Stack.Screen
          name="screens/tela1"
          options={{
            headerShown: false,
            title: 'Boas-Vindas',
          }}
        />
        <Stack.Screen
          name="screens/tela2"
          options={{
            headerShown: true,
            title: 'Instruções',
            headerBackTitle: 'Início',
          }}
        />
        <Stack.Screen
          name="screens/tela3"
          options={{
            headerShown: false,
            title: 'Jogo de Dama',
          }}
        />
        <Stack.Screen
          name="screens/tela4"
          options={{
            headerShown: true,
            title: 'Créditos',
            headerBackTitle: 'Início',
          }}
        />
      </Stack>
    </>
  );
}
