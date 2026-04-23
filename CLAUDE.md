# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Starter -- Expo SDK 51 app with Supabase backend, authentication, and a real-time todo list. Tab-based navigation via expo-router, TypeScript strict mode, and automatic dark/light theme support. Targets iOS, Android, and Web from a single codebase.

**Key features:**
- Email/password authentication with Supabase Auth
- Todo list with create, complete, delete, and pull-to-refresh
- User profile with stats
- Row Level Security -- each user only sees their own data
- Demo account seeded for instant testing

## Commands

```bash
# Install
npm install                      # Install all dependencies

# Supabase (local dev)
npx supabase start               # Start local Supabase (DB, Auth, Studio)
npx supabase db reset             # Apply migrations + seed data
npx supabase status               # Show local URLs and keys

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

# Database
npx supabase gen types typescript --local > src/types/database.ts  # Regenerate types from schema
```

## Architecture

```
app/                             # Expo Router file-based routing (screens)
  _layout.tsx                    #   Root layout with AuthProvider
  (tabs)/                        #   Tab group
    _layout.tsx                  #     Tab navigator config (Todos + Profile)
    index.tsx                    #     Todos screen (auth gate + todo list)
    profile.tsx                  #     Profile screen (user info + stats)
src/
  lib/
    supabase.ts                  #   Supabase client (AsyncStorage session)
  hooks/
    useAuth.tsx                  #   Auth context + provider (signIn/signUp/signOut)
    useTodos.ts                  #   Todo CRUD hook (list/add/toggle/delete)
  components/
    AuthScreen.tsx               #   Login/signup form
    TodoItem.tsx                 #   Single todo row (checkbox + delete)
    AddTodoModal.tsx             #   Bottom sheet modal for new todos
  types/
    database.ts                  #   Supabase table types (Profile, Todo)
constants/                       # Theme constants
  Colors.ts                      #   Light/dark color palettes
hooks/                           # Platform hooks
  useColorScheme.ts              #   System theme hook (defaults to 'light')
supabase/
  migrations/
    20240101000000_initial_schema.sql  # profiles + todos + RLS + trigger
  seed.sql                       #   Demo user + 8 sample todos
__tests__/                       # Jest test files
```

### Data Flow

1. `app/_layout.tsx` wraps the entire app in `<AuthProvider>`
2. `useAuth()` manages Supabase session state via `onAuthStateChange`
3. Screens check `useAuth().user` -- show `<AuthScreen>` when null
4. `useTodos()` fetches/mutates todos via Supabase client with RLS enforcement
5. Profile screen queries both `profiles` and `todos` tables for stats

### Routing

Expo Router maps files in `app/` to routes automatically:
- `app/(tabs)/index.tsx` -> `/` (Todos tab)
- `app/(tabs)/profile.tsx` -> `/profile` (Profile tab)
- `app/+not-found.tsx` -> 404 fallback

### Theming

Colors are defined in `constants/Colors.ts` with `light` and `dark` objects. The `useColorScheme` hook wraps React Native's hook and defaults to `'light'` when the system preference is unavailable. Components apply theme colors inline via `style` props.

### Database Schema

**profiles** -- auto-created on signup via trigger
- `id` (uuid PK, references auth.users)
- `email`, `full_name`, `avatar_url` (text)
- `created_at` (timestamptz)

**todos** -- user-scoped task list
- `id` (uuid PK, auto-generated)
- `user_id` (uuid FK to auth.users)
- `title` (text, required), `description` (text), `completed` (boolean)
- `due_date` (timestamptz), `created_at` (timestamptz)

RLS policies enforce user-scoped access on both tables.

## Environment Variables

Copy `.env.example` to `.env` and fill in values. All client-side env vars must use the `EXPO_PUBLIC_` prefix:

- `EXPO_PUBLIC_SUPABASE_URL` -- Supabase project URL (or `http://localhost:54321` for local dev)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` -- Supabase anonymous/public key (get from `npx supabase status` locally)

Access in code: `process.env.EXPO_PUBLIC_SUPABASE_URL`

### Supabase Setup (Local)

```bash
npx supabase start              # Starts local Supabase (first run pulls Docker images)
npx supabase db reset           # Applies migrations + seeds demo data
npx supabase status             # Copy API URL + anon key into .env
```

Demo credentials after seeding: `demo@example.com` / `demo1234`

### Supabase Setup (Cloud)

1. Create a project at https://supabase.com/dashboard
2. Copy the project URL and anon key to `.env`
3. Run migrations: `npx supabase db push --linked`
4. Optionally seed: `psql <connection-string> < supabase/seed.sql`

## Testing

Tests use Jest with the `jest-expo` preset and `@testing-library/react-native` for component rendering.

Key patterns:
- Mock `react-native-safe-area-context` in every screen test (returns plain `View`)
- Mock `@/hooks/useColorScheme` to return a deterministic value (`'light'` or `'dark'`)
- Mock `@/src/hooks/useAuth` to control auth state in tests
- Mock `@/src/lib/supabase` to avoid real network calls
- Use `screen.getByText()` for content assertions, `screen.getByLabelText()` for interactive elements
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
- All Supabase queries go through the typed client in `src/lib/supabase.ts`
- Auth state is managed exclusively via `useAuth()` from `src/hooks/useAuth.tsx`
- ARIA accessibility labels required on all interactive elements (buttons, inputs, checkboxes)
- Keep `src/` stubs in sync if referenced by external tooling
