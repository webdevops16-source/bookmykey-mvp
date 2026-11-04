import { z } from 'zod';

export const LISTING_BUCKET = 'listing-images';
export const MAX_PHOTOS = 12;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// MIME type -> file extension for allowed photos
export const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const CATEGORY_VALUES = [
  'apartment',
  'villa',
  'independent_house',
  'builder_floor',
  'office_space',
  'retail_shop',
  'warehouse',
  'plot',
  'pg',
] as const;

export const COMMERCIAL_CATEGORIES: readonly string[] = [
  'office_space',
  'retail_shop',
  'warehouse',
];

export const FURNISHING_VALUES = [
  'fully_furnished',
  'semi_furnished',
  'unfurnished',
] as const;

/** "Independent House" -> "independent_house", "Semi-Furnished" -> "semi_furnished" */
export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** Form label -> database value. "Furnished" is stored as fully_furnished. */
export function toFurnishingValue(label: string): string {
  const slug = toSlug(label);
  return slug === 'furnished' ? 'fully_furnished' : slug;
}

export const listingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters.')
    .max(150, 'Title must be 150 characters or fewer.'),
  listing_type: z.enum(['rent', 'sale'], {
    errorMap: () => ({ message: 'Choose Rent or Sell.' }),
  }),
  category: z.enum(CATEGORY_VALUES, {
    errorMap: () => ({ message: 'Choose a valid property category.' }),
  }),
  bhk_size: z
    .number()
    .int()
    .min(0, 'BHK must be 0 or more.')
    .max(20, 'BHK must be 20 or fewer.')
    .nullable(),
  furnishing: z
    .enum(FURNISHING_VALUES, {
      errorMap: () => ({ message: 'Choose a valid furnishing option.' }),
    })
    .nullable(),
  price: z
    .number({ invalid_type_error: 'Enter a valid price.' })
    .positive('Enter a price greater than zero.')
    .max(100_000_000_000, 'Price is too large.'),
  city: z.string().min(1, 'Choose a city.'),
  locality: z
    .string()
    .trim()
    .min(1, 'Enter the locality or area.')
    .max(100, 'Locality must be 100 characters or fewer.'),
  address: z
    .string()
    .trim()
    .min(5, 'Enter the full address.')
    .max(500, 'Address must be 500 characters or fewer.'),
  description: z
    .string()
    .trim()
    .max(5000, 'Description must be 5000 characters or fewer.')
    .nullable(),
  status: z.enum(['draft', 'active']),
});

export type ListingInput = z.infer<typeof listingSchema>;
