import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Todo } from '@/src/types/database';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days}d`;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const dueLabel = formatDueDate(todo.due_date);
  const isOverdue = dueLabel?.includes('overdue') ?? false;

  return (
    <View style={[styles.container, { borderColor: colors.icon + '20' }]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(todo.id, !todo.completed)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        accessibilityLabel={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      >
        <Ionicons
          name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={todo.completed ? '#22c55e' : colors.icon}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            todo.completed && styles.completedTitle,
          ]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>
        {todo.description ? (
          <Text
            style={[styles.description, { color: colors.icon }]}
            numberOfLines={1}
          >
            {todo.description}
          </Text>
        ) : null}
        {dueLabel ? (
          <Text
            style={[
              styles.dueDate,
              { color: isOverdue ? '#ef4444' : colors.tint },
            ]}
          >
            {dueLabel}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete "${todo.title}"`}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
