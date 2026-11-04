'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { AdminGate } from '@/components/admin-gate';
import { Button } from '@/components/ui/button';
import { LISTING_BUCKET } from '@/lib/listing-schema';

type Status = 'draft' | 'active' | 'closed';

interface Row {
  id: string;
  title: string;
  city: string;
  locality: string | null;
  listing_type: 'rent' | 'sale';
  category: string;
  price: number;
  status: Status;
  images: string[];
  created_at: string;
}

const STATUS_LABEL: Record<Status, string> = {
  draft: 'Draft',
  active: 'Live',
  closed: 'Closed',
};

const STATUS_STYLE: Record<Status, string> = {
  draft: 'bg-secondary text-muted-foreground',
  active: 'bg-green-100 text-green-800',
  closed: 'bg-amber-100 text-amber-800',
};

const priceFormat = new Intl.NumberFormat('en-IN');

export default function AdminListingsPage() {
  return <AdminGate>{() => <ListingsManager />}</AdminGate>;
}

function ListingsManager() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from('listings')
      .select(
        'id, title, city, locality, listing_type, category, price, status, images, created_at'
      )
      .order('created_at', { ascending: false });

    if (loadError) {
      setError(loadError.message);
      return;
    }
    setError(null);
    setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (row: Row, status: Status) => {
    setBusyId(row.id);
    const { error: updateError } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', row.id);
    setBusyId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
  };

  const remove = async (row: Row) => {
    const ok = window.confirm(
      `Delete "${row.title}" permanently? This also deletes its photos.`
    );
    if (!ok) return;

    setBusyId(row.id);
    const marker = `/${LISTING_BUCKET}/`;
    const paths = (row.images ?? [])
      .map((url) => url.split(marker)[1])
      .filter((p): p is string => !!p);

    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', row.id);

    if (deleteError) {
      setBusyId(null);
      setError(deleteError.message);
      return;
    }
    if (paths.length > 0) {
      await supabase.storage.from(LISTING_BUCKET).remove(paths);
    }
    setBusyId(null);
    await load();
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-brand-charcoal">Manage listings</h1>
          <Button asChild variant="brand">
            <Link href="/admin/post">
              <Plus className="mr-1 h-4 w-4" /> Post property
            </Link>
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {rows === null && !error && (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
          </div>
        )}

        {rows !== null && rows.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-10 text-center">
            <p className="font-medium text-brand-charcoal">No listings yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Post your first property to see it here.
            </p>
          </div>
        )}

        {rows !== null && rows.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-charcoal">{row.title}</p>
                      <p className="text-muted-foreground">
                        {[row.locality, row.city].filter(Boolean).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal">
                      {row.listing_type === 'rent' ? 'Rent' : 'Sale'}
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal">
                      &#8377;{priceFormat.format(Number(row.price))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[row.status]}`}
                      >
                        {STATUS_LABEL[row.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {row.status === 'active' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busyId === row.id}
                              onClick={() => setStatus(row, 'draft')}
                            >
                              Unpublish
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busyId === row.id}
                              onClick={() => setStatus(row, 'closed')}
                            >
                              Mark closed
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="brand"
                            disabled={busyId === row.id}
                            onClick={() => setStatus(row, 'active')}
                          >
                            Publish
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={busyId === row.id}
                          onClick={() => remove(row)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
