<<<<<<< HEAD
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
=======

import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import SplashScreen from './splash-screen';
>>>>>>> 31aae1fa8ce7d2f936fc7459a909b4f147eff461

export default function RootLayout() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace('/landing');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}

