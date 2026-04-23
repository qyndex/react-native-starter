import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to MyApp
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Built with Expo SDK 51 and expo-router
          </Text>
          <Text style={[styles.platform, { color: colors.tint }]}>
            Running on{' '}
            {Platform.select({
              ios: 'iOS',
              android: 'Android',
              web: 'Web',
              default: 'an unknown platform',
            })}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Get Started
          </Text>
          <Text style={[styles.cardBody, { color: colors.text }]}>
            Edit app/(tabs)/index.tsx to change this screen. Changes save
            and reload automatically.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1 },
  hero: { alignItems: 'center', marginBottom: 32, marginTop: 24 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', opacity: 0.7, marginBottom: 8 },
  platform: { fontSize: 14, fontWeight: '600' },
  card: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  cardBody: { fontSize: 14, lineHeight: 22, opacity: 0.8 },
});
