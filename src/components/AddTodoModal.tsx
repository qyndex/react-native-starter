import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TodoInsert } from '@/src/types/database';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (todo: TodoInsert) => Promise<{ error: string | null }>;
}

export function AddTodoModal({ visible, onClose, onAdd }: AddTodoModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await onAdd({
      title: title.trim(),
      description: description.trim() || null,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setTitle('');
      setDescription('');
      setLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.overlay}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.handle} />

          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            New Todo
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.icon + '40',
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.icon}
              value={title}
              onChangeText={setTitle}
              autoFocus
              accessibilityLabel="Todo title"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Description (optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  color: colors.text,
                  borderColor: colors.icon + '40',
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Add some details..."
              placeholderTextColor={colors.icon}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              accessibilityLabel="Todo description"
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.icon + '40' }]}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.tint }]}
              onPress={handleAdd}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Add todo"
            >
              <Text style={styles.addText}>
                {loading ? 'Adding...' : 'Add Todo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
