import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/src/hooks/useAuth';
import { useTodos } from '@/src/hooks/useTodos';
import { AuthScreen } from '@/src/components/AuthScreen';
import { TodoItem } from '@/src/components/TodoItem';
import { AddTodoModal } from '@/src/components/AddTodoModal';

type FilterType = 'all' | 'active' | 'completed';

export default function TodosScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, loading: authLoading } = useAuth();
  const { todos, loading, error, refresh, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </SafeAreaView>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.tint }]}>{activeCount}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Active</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: '#22c55e' }]}>{completedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Done</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{todos.length}</Text>
          <Text style={[styles.statLabel, { color: colors.icon }]}>Total</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterTab,
              filter === f && { backgroundColor: colors.tint + '20' },
            ]}
            onPress={() => setFilter(f)}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === f }}
            accessibilityLabel={`Show ${f} todos`}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f ? colors.tint : colors.icon },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Todo list */}
      {loading && !refreshing ? (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-done-outline"
                size={48}
                color={colors.icon}
              />
              <Text style={[styles.emptyText, { color: colors.icon }]}>
                {filter === 'all'
                  ? 'No todos yet. Tap + to add one!'
                  : filter === 'active'
                    ? 'All caught up!'
                    : 'Nothing completed yet.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating add button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={() => setShowAddModal(true)}
        accessibilityRole="button"
        accessibilityLabel="Add new todo"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddTodoModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
