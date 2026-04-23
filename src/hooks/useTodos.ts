import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Todo, TodoInsert } from '@/src/types/database';
import { useAuth } from '@/src/hooks/useAuth';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addTodo: (todo: TodoInsert) => Promise<{ error: string | null }>;
  toggleTodo: (id: string, completed: boolean) => Promise<{ error: string | null }>;
  deleteTodo: (id: string) => Promise<{ error: string | null }>;
}

export function useTodos(): UseTodosReturn {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTodos(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (todo: TodoInsert): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error: insertError } = await supabase
      .from('todos')
      .insert({
        user_id: user.id,
        title: todo.title,
        description: todo.description ?? null,
        due_date: todo.due_date ?? null,
      })
      .select()
      .single();

    if (insertError) {
      return { error: insertError.message };
    }

    if (data) {
      setTodos((prev) => [data, ...prev]);
    }
    return { error: null };
  };

  const toggleTodo = async (id: string, completed: boolean): Promise<{ error: string | null }> => {
    const { error: updateError } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id);

    if (updateError) {
      return { error: updateError.message };
    }

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
    return { error: null };
  };

  const deleteTodo = async (id: string): Promise<{ error: string | null }> => {
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    setTodos((prev) => prev.filter((t) => t.id !== id));
    return { error: null };
  };

  return {
    todos,
    loading,
    error,
    refresh: fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
