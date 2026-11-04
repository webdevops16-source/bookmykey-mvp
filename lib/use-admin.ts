'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export type AdminState = 'loading' | 'admin' | 'anonymous' | 'forbidden';

/**
 * Convenience check for the UI only. Real protection is Row Level Security
 * in the database: even if this check is bypassed, non-admins cannot write.
 */
export function useAdmin() {
  const [state, setState] = useState<AdminState>('loading');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!active) return;

      if (!session) {
        setUserId(null);
        setState('anonymous');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      if (!active) return;

      if (!error && data?.role === 'admin') {
        setUserId(session.user.id);
        setState('admin');
      } else {
        setUserId(null);
        setState('forbidden');
      }
    }

    check();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      // Defer so we never await Supabase calls inside the auth callback
      setTimeout(check, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { state, userId };
}
