import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@/src/hooks/useAuth';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
