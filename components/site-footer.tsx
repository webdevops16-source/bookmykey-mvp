import Link from 'next/link';
import { KeyRound, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-brand-charcoal">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-brand-orange" />
              <span className="text-xl font-bold text-white">
                bookmykey<span className="text-brand-orange">.in</span>
              </span>
            </Link>
            <p className="text-sm text-white/60">
              India&apos;s trusted real estate aggregator. Find your perfect home or list your property for free.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/search" className="hover:text-brand-orange">Rent Properties</Link></li>
              <li><Link href="/search?listingType=buy" className="hover:text-brand-orange">Buy Properties</Link></li>
              <li><Link href="/search?listingType=commercial" className="hover:text-brand-orange">Commercial</Link></li>
              <li><Link href="/post-property" className="hover:text-brand-orange">Post Property</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Top Cities</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Mumbai</li>
              <li>Bengaluru</li>
              <li>Delhi NCR</li>
              <li>Hyderabad</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Connect</h3>
            <div className="flex gap-3">
              <Facebook className="h-5 w-5 text-white/60 transition-colors hover:text-brand-orange" />
              <Twitter className="h-5 w-5 text-white/60 transition-colors hover:text-brand-orange" />
              <Instagram className="h-5 w-5 text-white/60 transition-colors hover:text-brand-orange" />
              <Linkedin className="h-5 w-5 text-white/60 transition-colors hover:text-brand-orange" />
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} bookmykey.in — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
