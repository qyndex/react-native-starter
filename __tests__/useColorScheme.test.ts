import { useColorScheme } from '../hooks/useColorScheme';
import { useColorScheme as _useColorScheme } from 'react-native';
import { renderHook } from '@testing-library/react-native';

jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    useColorScheme: jest.fn(),
  };
});

const mockedUseColorScheme = _useColorScheme as jest.MockedFunction<
  typeof _useColorScheme
>;

describe('useColorScheme', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns "light" when system scheme is null', () => {
    mockedUseColorScheme.mockReturnValue(null);
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('returns "dark" when system scheme is dark', () => {
    mockedUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('dark');
  });

  it('returns "light" when system scheme is light', () => {
    mockedUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });
});
