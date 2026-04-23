import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TodosScreen from '../app/(tabs)/index';

// Mock safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock useColorScheme to return a deterministic value
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));

// Mock the auth hook -- unauthenticated state shows auth screen
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

// Mock supabase client
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

describe('TodosScreen', () => {
  it('shows auth screen when not logged in', () => {
    render(<TodosScreen />);
    // Auth screen shows sign-in form
    expect(screen.getByText('Welcome Back')).toBeTruthy();
  });

  it('shows demo credentials hint', () => {
    render(<TodosScreen />);
    expect(screen.getByText(/demo@example.com/)).toBeTruthy();
  });

  it('has email and password inputs', () => {
    render(<TodosScreen />);
    expect(screen.getByLabelText('Email address')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('has sign in button', () => {
    render(<TodosScreen />);
    expect(screen.getByLabelText('Sign in')).toBeTruthy();
  });
});
