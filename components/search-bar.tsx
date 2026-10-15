'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CITIES, BHK_OPTIONS, type ListingType, type BHKType } from '@/lib/property-data';

const TAB_DEFS: { value: ListingType; label: string }[] = [
  { value: 'rent', label: 'Rent' },
  { value: 'buy', label: 'Buy' },
  { value: 'commercial', label: 'Commercial' },
];

interface SearchBarProps {
  defaultTab?: ListingType;
  defaultCity?: string;
  defaultBhk?: BHKType;
}

export function SearchBar({ defaultTab = 'rent', defaultCity, defaultBhk }: SearchBarProps) {
  const router = useRouter();
  const [tab, setTab] = useState<ListingType>(defaultTab);
  const [city, setCity] = useState<string | undefined>(defaultCity);
  const [bhk, setBhk] = useState<string | undefined>(defaultBhk);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('listingType', tab);
    if (city) params.set('city', city);
    if (bhk) params.set('bhk', bhk);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={(v) => setTab(v as ListingType)}>
        <TabsList className="h-auto w-full justify-start gap-1 rounded-b-none bg-white p-1.5 sm:w-auto">
          {TAB_DEFS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-md px-6 py-2 text-sm font-semibold data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-3 rounded-lg rounded-tl-none border border-border bg-white p-4 shadow-lg sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <MapPin className="h-5 w-5 shrink-0 text-brand-orange" />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="border-0 px-0 text-base focus:ring-0">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="flex flex-1 items-center gap-2">
          <Home className="h-5 w-5 shrink-0 text-brand-orange" />
          <Select value={bhk} onValueChange={setBhk}>
            <SelectTrigger className="border-0 px-0 text-base focus:ring-0">
              <SelectValue placeholder="Property Type (BHK)" />
            </SelectTrigger>
            <SelectContent>
              {BHK_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="brand"
          size="lg"
          className="shrink-0 gap-2 sm:px-8"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>
    </div>
  );
}
