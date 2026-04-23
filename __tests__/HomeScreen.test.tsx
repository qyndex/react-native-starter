import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/index';

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

describe('HomeScreen', () => {
  it('renders the welcome title', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Welcome to MyApp')).toBeTruthy();
  });

  it('renders the subtitle mentioning Expo SDK', () => {
    render(<HomeScreen />);
    expect(
      screen.getByText('Built with Expo SDK 51 and expo-router')
    ).toBeTruthy();
  });

  it('renders the Get Started card', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Get Started')).toBeTruthy();
    expect(
      screen.getByText(/Edit app\/\(tabs\)\/index\.tsx/)
    ).toBeTruthy();
  });

  it('shows the running platform text', () => {
    render(<HomeScreen />);
    // In test environment Platform.select returns the default or ios
    expect(screen.getByText(/Running on/)).toBeTruthy();
  });
});
