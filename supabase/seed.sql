-- Seed data for development
-- This runs after migrations via: npx supabase db reset
--
-- Note: In local dev, create a user through the Auth UI (localhost:54323)
-- or via the Supabase dashboard, then these todos will be associated
-- with that user. For demo purposes, we insert todos for a known demo user.

-- Create a demo user (password: demo1234)
-- This uses Supabase's auth.users table directly for seeding only.
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'demo@example.com',
  crypt('demo1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo User"}',
  'authenticated',
  'authenticated'
) on conflict (id) do nothing;

-- Create identity for the demo user
insert into auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'demo@example.com',
  'email',
  '{"sub":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","email":"demo@example.com"}',
  now(),
  now(),
  now()
) on conflict (provider_id, provider) do nothing;

-- The trigger auto-creates the profile, but in case it didn't fire:
insert into public.profiles (id, email, full_name)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'demo@example.com',
  'Demo User'
) on conflict (id) do nothing;

-- Sample todos for the demo user
insert into public.todos (user_id, title, description, completed, due_date) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Set up Supabase project', 'Create a new Supabase project and add the URL and anon key to .env', true, now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Configure authentication', 'Enable email/password auth in the Supabase dashboard', true, now() - interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Build the todo list UI', 'Create components for listing, adding, and completing todos', true, now()),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Add pull-to-refresh', 'Implement pull-to-refresh on the todo list for a native feel', false, now() + interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Push notifications', 'Set up Expo push notifications for due-date reminders', false, now() + interval '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dark mode polish', 'Fine-tune colors and contrast for the dark theme', false, now() + interval '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Write unit tests', 'Add tests for auth flows and todo CRUD operations', false, now() + interval '7 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Deploy to App Store', 'Use EAS Build to create production builds for iOS and Android', false, now() + interval '14 days');
