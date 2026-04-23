# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Starter -- Expo SDK 51 app with tab-based navigation via expo-router, TypeScript strict mode, and automatic dark/light theme support. Targets iOS, Android, and Web from a single codebase.

## Commands

```bash
# Install
npm install                      # Install all dependencies

# Development
npx expo start                   # Start Expo dev server (press i/a/w for platform)
npx expo start --ios             # Launch iOS simulator directly
npx expo start --android         # Launch Android emulator directly
npx expo start --web             # Launch in browser

# Testing
npm test                         # Run Jest test suite
npm test -- --watch              # Run tests in watch mode
npm test -- --coverage           # Run tests with coverage report
npm test -- __tests__/HomeScreen.test.tsx  # Run a single test file

# Type checking and linting
npx tsc --noEmit                 # TypeScript type check (no output files)
npm run lint                     # ESLint (TypeScript + React rules)

# Build
npx expo export:web              # Export for web deployment
npx eas build --platform ios     # Cloud build for iOS (requires EAS setup)
npx eas build --platform android # Cloud build for Android (requires EAS setup)
```

## Architecture

```
app/                   # Expo Router file-based routing (screens)
  _layout.tsx          #   Root Stack navigator
  (tabs)/              #   Tab group
    _layout.tsx        #     Tab navigator config (Home + Explore)
    index.tsx          #     Home screen
    explore.tsx        #     Explore screen (feature list)
constants/             # Theme constants
  Colors.ts            #   Light/dark color palettes
hooks/                 # Custom React hooks
  useColorScheme.ts    #   System theme hook (defaults to 'light')
__tests__/             # Jest test files
  HomeScreen.test.tsx  #   Home screen rendering tests
  ExploreScreen.test.tsx # Explore screen rendering tests
  useColorScheme.test.ts # Hook behavior tests
  Colors.test.ts       #   Color constant validation
src/                   # Legacy stubs (not used at runtime)
```

### Routing

Expo Router maps files in `app/` to routes automatically:
- `app/(tabs)/index.tsx` -> `/` (Home tab)
- `app/(tabs)/explore.tsx` -> `/explore` (Explore tab)
- `app/+not-found.tsx` -> 404 fallback

### Theming

Colors are defined in `constants/Colors.ts` with `light` and `dark` objects. The `useColorScheme` hook wraps React Native's hook and defaults to `'light'` when the system preference is unavailable. Components apply theme colors inline via `style` props.

## Environment Variables

Copy `.env.example` to `.env` and fill in values. All client-side env vars must use the `EXPO_PUBLIC_` prefix:

- `EXPO_PUBLIC_SUPABASE_URL` -- Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` -- Supabase anonymous/public key

Access in code: `process.env.EXPO_PUBLIC_SUPABASE_URL`

## Testing

Tests use Jest with the `jest-expo` preset and `@testing-library/react-native` for component rendering.

Key patterns:
- Mock `react-native-safe-area-context` in every screen test (returns plain `View`)
- Mock `@/hooks/useColorScheme` to return a deterministic value (`'light'` or `'dark'`)
- Use `screen.getByText()` for content assertions
- Use `renderHook()` from `@testing-library/react-native` for hook tests
- Path alias `@/*` is mapped in `jest.config.js` via `moduleNameMapper`

## Rules

- TypeScript strict mode -- no `any` types
- Use Expo SDK APIs over bare React Native equivalents
- All colors must come from `constants/Colors.ts` -- no inline hex values
- Screens must support both light and dark themes
- Every new screen needs a corresponding test in `__tests__/`
- Mock native modules (SafeAreaView, navigation) in tests -- do not test native internals
- Use `Platform.select()` for platform-specific logic, not `Platform.OS === '...'` checks
- Keep `src/` stubs in sync if referenced by external tooling
