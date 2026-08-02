import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, Star, Users } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4" /> Trusted Local Professionals
        </div>

        {/* HeadingAndSubtitle */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Reliable Home Services at Your{' '}
          <span className="text-primary">Fingertips</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Book verified technicians for plumbing, electrical, appliance repair
          and more in just a few clicks.
        </p>

        {/* QuickSearchBar */}
        <div className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-card border border-border shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What service do you need? (e.g. Plumber, Electrician)"
              className="pl-10 border-none shadow-none focus-visible:ring-0"
            />
          </div>
          <Button size="lg" className="cursor-pointer">
            Search
          </Button>
        </div>

        {/* TrustBadges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-border/60">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              10,000+
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Jobs Completed
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              4.9 / 5.0
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Customer Rating
            </p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              500+
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Verified Technicians
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
