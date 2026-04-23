import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const FEATURES = [
  { id: '1', title: 'File-based routing', description: 'expo-router maps files to screens automatically.' },
  { id: '2', title: 'Cross-platform', description: 'One codebase targets iOS, Android, and Web.' },
  { id: '3', title: 'TypeScript', description: 'Full type safety with strict mode enabled.' },
  { id: '4', title: 'Safe Area', description: 'react-native-safe-area-context handles notches and home bars.' },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={FEATURES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.header, { color: colors.text }]}>Explore Features</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.item, { borderColor: colors.tint + '33' }]}>
            <Text style={[styles.itemTitle, { color: colors.tint }]}>{item.title}</Text>
            <Text style={[styles.itemDesc, { color: colors.text }]}>{item.description}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 20 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  item: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemDesc: { fontSize: 14, lineHeight: 20, opacity: 0.8 },
});
