'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, MapPin, X, Check } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  PROPERTIES,
  CITIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  PRICE_RANGES,
  type ListingType,
  type BHKType,
  type FurnishingType,
} from '@/lib/property-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function SearchResultsContent() {
  const searchParams = useSearchParams();

  const initialListingType = (searchParams.get('listingType') as ListingType) || 'rent';
  const initialCity = searchParams.get('city') || undefined;
  const initialBhk = (searchParams.get('bhk') as BHKType) || undefined;

  const [listingType, setListingType] = useState<ListingType>(initialListingType);
  const [city, setCity] = useState<string | undefined>(initialCity);
  const [selectedBhks, setSelectedBhks] = useState<Set<BHKType>>(
    initialBhk ? new Set([initialBhk]) : new Set()
  );
  const [selectedFurnishing, setSelectedFurnishing] = useState<Set<FurnishingType>>(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Set<number>>(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const listingTypeRanges = useMemo(() => {
    if (listingType === 'buy') {
      return PRICE_RANGES.filter((r) => r.min >= 5000000 || r.label.includes('Lakh') || r.label.includes('Crore'));
    }
    return PRICE_RANGES.filter((r) => r.max <= 100000);
  }, [listingType]);

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (p.listingType !== listingType) return false;
      if (city && p.city !== city) return false;
      if (selectedBhks.size > 0 && !selectedBhks.has(p.bhk)) return false;
      if (selectedFurnishing.size > 0 && !selectedFurnishing.has(p.furnishing)) return false;
      if (selectedPriceRanges.size > 0) {
        const matches = [...selectedPriceRanges].some((idx) => {
          const range = listingTypeRanges[idx];
          if (!range) return false;
          return p.price >= range.min && p.price <= range.max;
        });
        if (!matches) return false;
      }
      return true;
    });
  }, [listingType, city, selectedBhks, selectedFurnishing, selectedPriceRanges, listingTypeRanges]);

  const toggleBhk = (bhk: BHKType) => {
    setSelectedBhks((prev) => {
      const next = new Set(prev);
      if (next.has(bhk)) next.delete(bhk);
      else next.add(bhk);
      return next;
    });
  };

  const toggleFurnishing = (f: FurnishingType) => {
    setSelectedFurnishing((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const togglePriceRange = (idx: number) => {
    setSelectedPriceRanges((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const clearAll = () => {
    setSelectedBhks(new Set());
    setSelectedFurnishing(new Set());
    setSelectedPriceRanges(new Set());
    setCity(undefined);
  };

  const activeFilterCount =
    selectedBhks.size + selectedFurnishing.size + selectedPriceRanges.size + (city ? 1 : 0);

  const listingTypeTabs: { value: ListingType; label: string }[] = [
    { value: 'rent', label: 'Rent' },
    { value: 'buy', label: 'Buy' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const FiltersPanel = (
    <div className="space-y-6">
      {/* City */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-brand-charcoal">City</h3>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* BHK Type */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-brand-charcoal">BHK Type</h3>
        <div className="space-y-2">
          {BHK_OPTIONS.map((bhk) => (
            <button
              key={bhk}
              onClick={() => toggleBhk(bhk)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedBhks.has(bhk)
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-charcoal'
                  : 'border-border text-muted-foreground hover:border-brand-orange/40'
              }`}
            >
              {bhk}
              {selectedBhks.has(bhk) && <Check className="h-4 w-4 text-brand-orange" />}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-brand-charcoal">Price Range</h3>
        <div className="space-y-2">
          {listingTypeRanges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => togglePriceRange(idx)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedPriceRanges.has(idx)
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-charcoal'
                  : 'border-border text-muted-foreground hover:border-brand-orange/40'
              }`}
            >
              {range.label}
              {selectedPriceRanges.has(idx) && <Check className="h-4 w-4 text-brand-orange" />}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Furnishing */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-brand-charcoal">Furnishing</h3>
        <div className="space-y-2">
          {FURNISHING_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => toggleFurnishing(f)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedFurnishing.has(f)
                  ? 'border-brand-orange bg-brand-orange/5 text-brand-charcoal'
                  : 'border-border text-muted-foreground hover:border-brand-orange/40'
              }`}
            >
              {f}
              {selectedFurnishing.has(f) && <Check className="h-4 w-4 text-brand-orange" />}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="brandOutline" size="sm" className="w-full" onClick={clearAll}>
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Page Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-brand-charcoal">
            {city ? `Properties in ${city}` : 'Search Properties'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'listing' : 'listings'} found
          </p>
        </div>
      </div>

      {/* Listing Type Tabs */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          {listingTypeTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setListingType(tab.value);
                setSelectedPriceRanges(new Set());
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                listingType === tab.value
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'bg-secondary text-brand-charcoal/70 hover:bg-secondary/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Mobile Filter Button */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 bg-brand-orange text-white">{activeFilterCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 px-1">
                {FiltersPanel}
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-sm text-muted-foreground">{filteredProperties.length} results</span>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar — Desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-brand-orange" />
                <h2 className="text-lg font-semibold text-brand-charcoal">Filters</h2>
              </div>
              {FiltersPanel}
            </div>
          </aside>

          {/* Right Content — Property List */}
          <div className="min-w-0 flex-1">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-20 text-center">
                <div className="mb-3 rounded-full bg-secondary p-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-brand-charcoal">No properties found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters to see more results</p>
                {activeFilterCount > 0 && (
                  <Button variant="brandOutline" size="sm" className="mt-4" onClick={clearAll}>
                    <X className="mr-1 h-4 w-4" /> Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
