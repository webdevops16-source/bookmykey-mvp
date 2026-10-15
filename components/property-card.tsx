import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize, Car } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Property, formatPrice } from '@/lib/property-data';

interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'list';
}

export function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  if (variant === 'list') {
    return (
      <Card className="group flex flex-col overflow-hidden border-border/60 transition-all duration-300 hover:shadow-xl sm:flex-row">
        <div className="relative h-56 shrink-0 overflow-hidden sm:h-auto sm:w-72">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <Badge className="bg-brand-orange text-white shadow-sm">
              {property.listingType === 'rent' ? 'For Rent' : property.listingType === 'buy' ? 'For Sale' : 'Commercial'}
            </Badge>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-brand-charcoal line-clamp-1">{property.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                {property.locality}, {property.city}
              </p>
            </div>
            <span className="shrink-0 text-xl font-bold text-brand-orange">
              {formatPrice(property.price, property.priceUnit)}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{property.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-charcoal/70">
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-brand-orange/70" /> {property.bhk}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-brand-orange/70" /> {property.bathrooms} Baths
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-brand-orange/70" /> {property.area}
            </span>
            {property.parking && (
              <span className="flex items-center gap-1.5">
                <Car className="h-4 w-4 text-brand-orange/70" /> Parking
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-sm text-muted-foreground">{property.furnishing}</span>
            <Button asChild variant="brand" size="sm">
              <Link href={`/search?detail=${property.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex flex-col overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3">
          <Badge className="bg-brand-orange text-white shadow-sm">
            {property.listingType === 'rent' ? 'For Rent' : property.listingType === 'buy' ? 'For Sale' : 'Commercial'}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-xl font-bold text-white">
            {formatPrice(property.price, property.priceUnit)}
          </span>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-brand-charcoal line-clamp-1">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
          {property.locality}, {property.city}
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm text-brand-charcoal/70">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-brand-orange/70" /> {property.bhk}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4 text-brand-orange/70" /> {property.area}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="brand" size="sm" className="w-full">
          <Link href={`/search?detail=${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
