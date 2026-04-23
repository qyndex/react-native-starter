import { useColorScheme as _useColorScheme } from 'react-native';

/**
 * Wrapper around React Native's useColorScheme hook.
 * Returns 'light' when the system scheme cannot be determined.
 */
export function useColorScheme(): 'light' | 'dark' {
  return _useColorScheme() ?? 'light';
}
