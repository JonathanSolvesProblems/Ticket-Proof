import '../services/polyfills';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useAppStore } from '@/store/useAppStore';
import { AuthScreen } from '@/components/AuthScreen';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';

// Treasury config for XION blockchain
const treasuryConfig = {
  treasury: process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS!,
  gasPrice: '0.001uxion',
  rpcUrl: process.env.EXPO_PUBLIC_RPC_ENDPOINT!,
  restUrl: process.env.EXPO_PUBLIC_REST_ENDPOINT!,
  callbackUrl: process.env.EXPO_PUBLIC_CALLBACK_URL!,
};

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const { isAuthenticated, isLoading, initializeStore } = useAppStore();

  useEffect(() => {
    initializeStore();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <AbstraxionProvider config={treasuryConfig}>
      {!isAuthenticated ? (
        <>
          <AuthScreen />
          <StatusBar style="light" />
        </>
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </>
      )}
    </AbstraxionProvider>
  );
}
