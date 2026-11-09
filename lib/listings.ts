import { PROPERTIES, normalizeDbListing, type Property } from './property-data';
import { supabase } from './supabase-client';

export async function fetchListingsFromSupabase(): Promise<Property[]> {
  if (!supabase) {
    return PROPERTIES;
  }

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load listings from Supabase:', error);
    return PROPERTIES;
  }

  return (data ?? []).map((row) => normalizeDbListing(row as any));
}
