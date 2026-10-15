import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-brand-orange" />
          <span className="text-xl font-bold tracking-tight text-brand-charcoal">
            bookmykey<span className="text-brand-orange">.in</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/search"
            className="text-sm font-medium text-brand-charcoal/70 transition-colors hover:text-brand-charcoal"
          >
            Rent
          </Link>
          <Link
            href="/search?listingType=buy"
            className="text-sm font-medium text-brand-charcoal/70 transition-colors hover:text-brand-charcoal"
          >
            Buy
          </Link>
          <Link
            href="/search?listingType=commercial"
            className="text-sm font-medium text-brand-charcoal/70 transition-colors hover:text-brand-charcoal"
          >
            Commercial
          </Link>
        </nav>
        <Button asChild variant="brand" size="sm" className="shadow-sm">
          <Link href="/post-property">Post Property for Free</Link>
        </Button>
      </div>
    </header>
  );
}
