import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeCategories(onDataChange?: () => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        if (onDataChange) {
          onDataChange();
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return { isConnected };
}

export function useRealtimeAuthors(onDataChange?: () => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('authors-changes')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        if (onDataChange) {
          onDataChange();
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return { isConnected };
}

export function useRealtimeBlogPosts(onDataChange?: () => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        if (onDataChange) {
          onDataChange();
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);

  return { isConnected };
}
