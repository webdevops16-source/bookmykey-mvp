import Link from 'next/link';
import { ShieldCheck, Zap, Users, ArrowRight, Building2, TrendingUp } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SearchBar } from '@/components/search-bar';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { PROPERTIES } from '@/lib/property-data';

export default function Home() {
  const featuredProperties = PROPERTIES.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-charcoal">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/38986357/pexels-photo-38986357.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Mumbai skyline"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal/90 via-brand-charcoal/80 to-brand-charcoal/60" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="text-center">
            <h1 className="animate-fade-in-up text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Find Your Perfect Home <br />
              Across <span className="text-brand-orange">India</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
              Search from thousands of verified rental and sale properties. No brokerage, no hassle — just your next home.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-orange" /> Verified Listings
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-orange" /> Zero Brokerage
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-orange" /> 50,000+ Happy Tenants
            </span>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { label: 'Active Listings', value: '12,000+', icon: Building2 },
            { label: 'Cities Covered', value: '8+', icon: TrendingUp },
            { label: 'Happy Customers', value: '50,000+', icon: Users },
            { label: 'Zero Brokerage', value: '100%', icon: ShieldCheck },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-brand-orange" />
              <div className="text-2xl font-bold text-brand-charcoal">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">Featured Properties</h2>
            <p className="mt-1 text-muted-foreground">Handpicked listings from across India&apos;s top cities</p>
          </div>
          <Button asChild variant="ghost" className="hidden text-brand-orange hover:text-brand-orange/80 sm:flex">
            <Link href="/search">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="brandOutline">
            <Link href="/search">View All Properties</Link>
          </Button>
        </div>
      </section>

      {/* Browse by City */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-brand-charcoal sm:text-3xl">Browse by City</h2>
          <p className="mt-1 text-center text-muted-foreground">Explore properties in India&apos;s most sought-after locations</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'Mumbai', img: 'https://images.pexels.com/photos/4843167/pexels-photo-4843167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { name: 'Bengaluru', img: 'https://images.pexels.com/photos/28304971/pexels-photo-28304971.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { name: 'Hyderabad', img: 'https://images.pexels.com/photos/4424414/pexels-photo-4424414.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
              { name: 'Chennai', img: 'https://images.pexels.com/photos/13690341/pexels-photo-13690341.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            ].map((city) => (
              <Link
                key={city.name}
                href={`/search?city=${encodeURIComponent(city.name)}`}
                className="group relative h-40 overflow-hidden rounded-lg"
              >
                <img
                  src={city.img}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="text-lg font-bold text-white">{city.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-brand-orange p-8 sm:p-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Own a Property? List it for Free</h2>
              <p className="mt-2 text-white/90">Reach 50,000+ potential tenants and buyers across India. No brokerage, no hidden charges.</p>
            </div>
            <Button asChild size="lg" className="shrink-0 bg-white text-brand-orange hover:bg-white/90">
              <Link href="/post-property">Post Property Now <ArrowRight className="ml-1 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
