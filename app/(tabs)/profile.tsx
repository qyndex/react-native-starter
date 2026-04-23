import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/src/hooks/useAuth';
import { AuthScreen } from '@/src/components/AuthScreen';
import { supabase } from '@/src/lib/supabase';
import { Profile } from '@/src/types/database';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);

      const [profileResult, todosResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
          .from('todos')
          .select('id, completed')
          .eq('user_id', user.id),
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
      }

      if (todosResult.data) {
        setTodoStats({
          total: todosResult.data.length,
          completed: todosResult.data.filter((t) => t.completed).length,
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </SafeAreaView>
    );
  }

  const completionRate =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar / Initials */}
        <View style={[styles.avatarCircle, { backgroundColor: colors.tint + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.tint }]}>
            {(profile?.full_name ?? user.email ?? '?')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>
          {profile?.full_name || 'Unknown User'}
        </Text>
        <Text style={[styles.email, { color: colors.icon }]}>
          {user.email}
        </Text>

        {/* Stats card */}
        <View style={[styles.statsCard, { backgroundColor: colors.icon + '10' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {todoStats.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Total Todos
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.icon + '30' }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>
              {todoStats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Completed
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.icon + '30' }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.tint }]}>
              {completionRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>
              Done Rate
            </Text>
          </View>
        </View>

        {/* Info rows */}
        <View style={styles.infoSection}>
          <View style={[styles.infoRow, { borderColor: colors.icon + '20' }]}>
            <Ionicons name="calendar-outline" size={20} color={colors.icon} />
            <Text style={[styles.infoLabel, { color: colors.icon }]}>Joined</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
          <View style={[styles.infoRow, { borderColor: colors.icon + '20' }]}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.icon} />
            <Text style={[styles.infoLabel, { color: colors.icon }]}>Platform</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {Platform.select({
                ios: 'iOS',
                android: 'Android',
                web: 'Web',
                default: 'Unknown',
              })}
            </Text>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: '#ef4444' + '40' }]}
          onPress={signOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    width: 1,
    marginVertical: 4,
  },
  infoSection: {
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
});
