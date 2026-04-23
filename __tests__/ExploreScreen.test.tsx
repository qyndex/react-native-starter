import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ExploreScreen from '../app/(tabs)/explore';

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

describe('ExploreScreen', () => {
  it('renders the Explore Features header', () => {
    render(<ExploreScreen />);
    expect(screen.getByText('Explore Features')).toBeTruthy();
  });

  it('renders all four feature items', () => {
    render(<ExploreScreen />);
    expect(screen.getByText('File-based routing')).toBeTruthy();
    expect(screen.getByText('Cross-platform')).toBeTruthy();
    expect(screen.getByText('TypeScript')).toBeTruthy();
    expect(screen.getByText('Safe Area')).toBeTruthy();
  });

  it('renders feature descriptions', () => {
    render(<ExploreScreen />);
    expect(
      screen.getByText('expo-router maps files to screens automatically.')
    ).toBeTruthy();
    expect(
      screen.getByText('One codebase targets iOS, Android, and Web.')
    ).toBeTruthy();
    expect(
      screen.getByText('Full type safety with strict mode enabled.')
    ).toBeTruthy();
    expect(
      screen.getByText(
        'react-native-safe-area-context handles notches and home bars.'
      )
    ).toBeTruthy();
  });
});
