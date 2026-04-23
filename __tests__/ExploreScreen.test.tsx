import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProfileScreen from '../app/(tabs)/profile';

// Mock safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

// Mock the auth hook -- unauthenticated state
jest.mock('@/src/hooks/useAuth', () => ({
  useAuth: () => ({
    session: null,
    user: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
  },
}));

describe('ProfileScreen', () => {
  it('shows auth screen when not logged in', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Welcome Back')).toBeTruthy();
  });

  it('shows sign up toggle', () => {
    render(<ProfileScreen />);
    expect(screen.getByText(/Don't have an account/)).toBeTruthy();
  });
});
