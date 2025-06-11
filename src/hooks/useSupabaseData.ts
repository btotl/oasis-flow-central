
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

export const useSupabaseData = <T extends Record<string, any>>(
  table: TableName,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData((result as T[]) || []);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};
