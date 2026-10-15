export type ListingType = 'rent' | 'buy' | 'commercial';
export type BHKType = '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5+ BHK' | 'Office' | 'Shop' | 'Warehouse';
export type FurnishingType = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type PropertyCategory = 'Apartment' | 'Villa' | 'Independent House' | 'Builder Floor' | 'Office Space' | 'Retail Shop' | 'Warehouse';

export interface Property {
  id: string;
  title: string;
  price: number;
  priceUnit: 'month' | 'onwards';
  listingType: ListingType;
  bhk: BHKType;
  category: PropertyCategory;
  furnishing: FurnishingType;
  city: string;
  locality: string;
  address: string;
  image: string;
  area: string;
  bathrooms: number;
  parking: boolean;
  description: string;
  featured: boolean;
}

export const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad',
];

export const BHK_OPTIONS: BHKType[] = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Office', 'Shop', 'Warehouse'];

export const FURNISHING_OPTIONS: FurnishingType[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

export const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: '₹1,00,000+', min: 100000, max: 99999999 },
  { label: 'Under ₹50 Lakhs', min: 0, max: 5000000 },
  { label: '₹50L - ₹1 Crore', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹2 Crore', min: 10000000, max: 20000000 },
  { label: '₹2 Crore+', min: 20000000, max: 99999999 },
];

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Spacious 2 BHK in Sobha Dream Acres',
    price: 35000,
    priceUnit: 'month',
    listingType: 'rent',
    bhk: '2 BHK',
    category: 'Apartment',
    furnishing: 'Semi-Furnished',
    city: 'Bengaluru',
    locality: 'Panathur Road',
    address: 'Sobha Dream Acres, Panathur Road, Bellandur, Bengaluru 560103',
    image: 'https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,250 sq.ft',
    bathrooms: 2,
    parking: true,
    description: 'A beautifully designed 2 BHK apartment with premium amenities including swimming pool, gym, clubhouse, and 24/7 security. Located in the heart of Bellandur with easy access to IT parks.',
    featured: true,
  },
  {
    id: '2',
    title: 'Luxury 3 BHK Apartment in Lodha Bellissimo',
    price: 125000,
    priceUnit: 'month',
    listingType: 'rent',
    bhk: '3 BHK',
    category: 'Apartment',
    furnishing: 'Furnished',
    city: 'Mumbai',
    locality: 'Worli',
    address: 'Lodha Bellissimo, Spring Leaf, Worli, Mumbai 400018',
    image: 'https://images.pexels.com/photos/16110999/pexels-photo-16110999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,850 sq.ft',
    bathrooms: 3,
    parking: true,
    description: 'Sea-facing luxury apartment with modular kitchen, Italian marble flooring, and panoramic views of the Arabian Sea. Premium fittings throughout.',
    featured: true,
  },
  {
    id: '3',
    title: 'Modern 2 BHK in Prestige Falcon City',
    price: 28000,
    priceUnit: 'month',
    listingType: 'rent',
    bhk: '2 BHK',
    category: 'Apartment',
    furnishing: 'Unfurnished',
    city: 'Bengaluru',
    locality: 'Kanakapura Road',
    address: 'Prestige Falcon City, Kanakapura Road, Bengaluru 560062',
    image: 'https://images.pexels.com/photos/31656167/pexels-photo-31656167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,180 sq.ft',
    bathrooms: 2,
    parking: true,
    description: 'Spacious unfurnished 2 BHK in a premium gated community with landscaped gardens, children\'s play area, and multipurpose sports court.',
    featured: true,
  },
  {
    id: '4',
    title: 'Ready-to-Move 3 BHK Villa for Sale',
    price: 8500000,
    priceUnit: 'onwards',
    listingType: 'buy',
    bhk: '3 BHK',
    category: 'Villa',
    furnishing: 'Semi-Furnished',
    city: 'Hyderabad',
    locality: 'Kokapet',
    address: 'My Home Avatar, Kokapet, Narsing, Hyderabad 500075',
    image: 'https://images.pexels.com/photos/7031581/pexels-photo-7031581.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '2,400 sq.ft',
    bathrooms: 3,
    parking: true,
    description: 'Independent villa with private garden, terrace sit-out, and premium specifications. Gated community with clubhouse, pool, and security.',
    featured: true,
  },
  {
    id: '5',
    title: 'Premium 4 BHK Penthouse in DLF Camellias',
    price: 250000000,
    priceUnit: 'onwards',
    listingType: 'buy',
    bhk: '4 BHK',
    category: 'Apartment',
    furnishing: 'Furnished',
    city: 'Delhi NCR',
    locality: 'Golf Course Road, Gurgaon',
    address: 'DLF Camellias, Golf Course Road, Sector 42, Gurgaon 122002',
    image: 'https://images.pexels.com/photos/27451770/pexels-photo-27451770.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '4,200 sq.ft',
    bathrooms: 5,
    parking: true,
    description: 'Ultra-luxury penthouse with double-height ceilings, private pool, and sky deck. World-class amenities including concierge service and spa.',
    featured: true,
  },
  {
    id: '6',
    title: 'Commercial Office Space in Cyber Tower',
    price: 85000,
    priceUnit: 'month',
    listingType: 'commercial',
    bhk: 'Office',
    category: 'Office Space',
    furnishing: 'Furnished',
    city: 'Hyderabad',
    locality: 'HITEC City',
    address: 'Cyber Towers, HITEC City, Madhapur, Hyderabad 500081',
    image: 'https://images.pexels.com/photos/4424414/pexels-photo-4424414.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,800 sq.ft',
    bathrooms: 2,
    parking: true,
    description: 'Grade A furnished office space with workstations, conference room, and high-speed internet. Prime location in HITEC City with metro connectivity.',
    featured: true,
  },
  {
    id: '7',
    title: '1 BHK Studio in Aundh',
    price: 15000,
    priceUnit: 'month',
    listingType: 'rent',
    bhk: '1 BHK',
    category: 'Apartment',
    furnishing: 'Furnished',
    city: 'Pune',
    locality: 'Aundh',
    address: ' Rohan Mithila, Aundh, Pune 411007',
    image: 'https://images.pexels.com/photos/31656168/pexels-photo-31656168.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '550 sq.ft',
    bathrooms: 1,
    parking: false,
    description: 'Compact fully furnished studio apartment ideal for working professionals. Close to IT Park and daily convenience stores.',
    featured: false,
  },
  {
    id: '8',
    title: '3 BHK Independent House for Sale',
    price: 12000000,
    priceUnit: 'onwards',
    listingType: 'buy',
    bhk: '3 BHK',
    category: 'Independent House',
    furnishing: 'Unfurnished',
    city: 'Chennai',
    locality: 'Velachery',
    address: '5th Cross Street, Velachery, Chennai 600042',
    image: 'https://images.pexels.com/photos/8482510/pexels-photo-8482510.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,800 sq.ft',
    bathrooms: 3,
    parking: true,
    description: 'Independent house with car parking, borewell, and rooftop. Proximity to schools, hospitals, and Taramani IT corridor.',
    featured: false,
  },
  {
    id: '9',
    title: 'Retail Shop in Premium Mall Location',
    price: 45000,
    priceUnit: 'month',
    listingType: 'commercial',
    bhk: 'Shop',
    category: 'Retail Shop',
    furnishing: 'Unfurnished',
    city: 'Mumbai',
    locality: 'Lower Parel',
    address: 'High Street Phoenix, Lower Parel, Mumbai 400013',
    image: 'https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '800 sq.ft',
    bathrooms: 1,
    parking: true,
    description: 'High-footfall retail space on the ground floor of a premium mall. Glass frontage with excellent visibility and power backup.',
    featured: false,
  },
  {
    id: '10',
    title: '2 BHK Builder Floor in Sector 56',
    price: 22000,
    priceUnit: 'month',
    listingType: 'rent',
    bhk: '2 BHK',
    category: 'Builder Floor',
    furnishing: 'Semi-Furnished',
    city: 'Delhi NCR',
    locality: 'Sector 56, Gurgaon',
    address: 'F-Block, Sector 56, Gurgaon 122011',
    image: 'https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,000 sq.ft',
    bathrooms: 2,
    parking: true,
    description: 'Builder floor with modular kitchen, geysers, and ACs in all rooms. Walking distance to metro station and market.',
    featured: false,
  },
  {
    id: '11',
    title: 'Luxury 3 BHK with Sea View in ECR',
    price: 45000,
    priceUnit: 'month',
    listingType: 'rent',
    bhk: '3 BHK',
    category: 'Apartment',
    furnishing: 'Furnished',
    city: 'Chennai',
    locality: 'ECR, Palavakkam',
    address: 'Bay Vista, ECR, Palavakkam, Chennai 600041',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '1,650 sq.ft',
    bathrooms: 3,
    parking: true,
    description: 'Beachfront apartment with stunning sea views, fully furnished with premium decor. Access to private beach and infinity pool.',
    featured: false,
  },
  {
    id: '12',
    title: 'Warehouse Space in Logistics Park',
    price: 120000,
    priceUnit: 'month',
    listingType: 'commercial',
    bhk: 'Warehouse',
    category: 'Warehouse',
    furnishing: 'Unfurnished',
    city: 'Kolkata',
    locality: 'Dankuni',
    address: 'Dankuni Logistics Park, NH-16, Dankuni, Kolkata 712311',
    image: 'https://images.pexels.com/photos/4843167/pexels-photo-4843167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    area: '10,000 sq.ft',
    bathrooms: 2,
    parking: true,
    description: 'Large warehouse with high ceilings, loading docks, and ample truck movement space. 24/7 security with CCTV surveillance.',
    featured: false,
  },
];

export function formatPrice(price: number, unit: 'month' | 'onwards'): string {
  if (unit === 'month') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 2)} Lac`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}
