import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/src/hooks/useAuth';

export function AuthScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = isSignUp
      ? await signUp(email.trim(), password, fullName.trim())
      : await signIn(email.trim(), password);

    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              {isSignUp
                ? 'Sign up to start managing your todos'
                : 'Sign in to access your todos'}
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      borderColor: colors.icon + '40',
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="John Doe"
                  placeholderTextColor={colors.icon}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoComplete="name"
                  accessibilityLabel="Full name"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.icon + '40',
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                accessibilityLabel="Email address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.icon + '40',
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="Your password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                accessibilityLabel="Password"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.tint }]}
              onPress={handleSubmit}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={isSignUp ? 'Sign up' : 'Sign in'}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchMode}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            accessibilityRole="button"
            accessibilityLabel={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
          >
            <Text style={[styles.switchText, { color: colors.icon }]}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={{ color: colors.tint, fontWeight: '600' }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.demoHint}>
            <Text style={[styles.demoText, { color: colors.icon }]}>
              Demo: demo@example.com / demo1234
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
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
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
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
  button: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchMode: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
  },
  demoHint: {
    marginTop: 16,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
