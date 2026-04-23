/**
 * Supabase database types.
 *
 * In a production app, generate these automatically:
 *   npx supabase gen types typescript --local > src/types/database.ts
 *
 * These hand-written types match the initial_schema.sql migration.
 */

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export interface TodoInsert {
  title: string;
  description?: string | null;
  due_date?: string | null;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
  due_date?: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      todos: {
        Row: Todo;
        Insert: Omit<Todo, 'id' | 'created_at' | 'completed'> & {
          id?: string;
          completed?: boolean;
        };
        Update: TodoUpdate;
      };
    };
  };
}
