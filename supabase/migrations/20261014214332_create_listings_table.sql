/*
# Create listings table for bookmykey.in property listings

1. New Tables
- `listings`
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null) — property title entered by the owner
  - `listing_type` (text, not null) — 'rent', 'buy', or 'commercial'
  - `category` (text, not null) — property category: Apartment, Villa, Independent House, Builder Floor, Office Space, Retail Shop, Warehouse
  - `bhk` (text, not null) — BHK size: 1 BHK, 2 BHK, 3 BHK, 4 BHK, 5+ BHK, Office, Shop, Warehouse
  - `furnishing` (text, not null) — Furnished, Semi-Furnished, or Unfurnished
  - `price` (integer, not null) — monthly rent or sale price in INR
  - `city` (text, not null) — city where the property is located
  - `locality` (text, not null) — area/locality within the city
  - `address` (text, not null) — full street address
  - `description` (text) — optional detailed description of the property
  - `image_urls` (text array, default empty) — array of image URLs for the listing
  - `created_at` (timestamptz, default now()) — when the listing was created

2. Security
- Enable RLS on `listings`.
- This is a single-tenant app with no sign-in screen, so the anon-key client
  needs full CRUD access. All policies use `TO anon, authenticated` with
  `USING (true)` / `WITH CHECK (true)` because the data is intentionally
  public — anyone can browse and post listings.

3. Indexes
- `listings_city_idx` on `city` for city-filtered searches
- `listings_listing_type_idx` on `listing_type` for tab-based filtering
- `listings_created_at_idx` on `created_at DESC` for newest-first ordering
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  listing_type text NOT NULL CHECK (listing_type IN ('rent', 'buy', 'commercial')),
  category text NOT NULL,
  bhk text NOT NULL,
  furnishing text NOT NULL CHECK (furnishing IN ('Furnished', 'Semi-Furnished', 'Unfurnished')),
  price integer NOT NULL CHECK (price >= 0),
  city text NOT NULL,
  locality text NOT NULL,
  address text NOT NULL,
  description text DEFAULT '',
  image_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_listings" ON listings;
CREATE POLICY "anon_select_listings"
ON listings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_listings" ON listings;
CREATE POLICY "anon_insert_listings"
ON listings FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_listings" ON listings;
CREATE POLICY "anon_update_listings"
ON listings FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_listings" ON listings;
CREATE POLICY "anon_delete_listings"
ON listings FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS listings_city_idx ON listings (city);
CREATE INDEX IF NOT EXISTS listings_listing_type_idx ON listings (listing_type);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings (created_at DESC);
