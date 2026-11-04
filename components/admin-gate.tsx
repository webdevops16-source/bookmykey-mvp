'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAdmin } from '@/lib/use-admin';
import { Button } from '@/components/ui/button';

export function AdminGate({
  children,
}: {
  children: (userId: string) => ReactNode;
}) {
  const router = useRouter();
  const { state, userId } = useAdmin();

  useEffect(() => {
    if (state === 'anonymous') router.replace('/admin/login');
  }, [state, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (state === 'loading' || state === 'anonymous') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (state === 'forbidden' || !userId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <h1 className="text-2xl font-bold text-brand-charcoal">No admin access</h1>
        <p className="max-w-md text-muted-foreground">
          This account is signed in but is not an admin. Sign out and use the admin
          account.
        </p>
        <Button variant="brand" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm">
          <nav className="flex items-center gap-5 font-medium text-brand-charcoal">
            <Link href="/admin/post" className="hover:text-brand-orange">
              Post property
            </Link>
            <Link href="/admin/listings" className="hover:text-brand-orange">
              Manage listings
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-brand-orange">
              View site
            </Link>
          </nav>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
      {children(userId)}
    </>
  );
}
