import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Wrench, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      {/* BackgroundGlow */}
      <div className="relative flex items-center justify-center">
        {/* LargeFaded404Watermark */}
        <span className="text-[10rem] font-black leading-none text-primary/10 select-none sm:text-[14rem]">
          404
        </span>

        {/* CenterFloatingIconCard */}
        {/* <div className="absolute flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card shadow-lg sm:h-28 sm:w-28">
          <div className="relative">
            <Wrench className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
            <SearchX className="absolute -bottom-1 -right-2 h-6 w-6 text-destructive" />
          </div>
        </div> */}
      </div>

      {/* MainTextContent */}
      <div className="-mt-4 max-w-md space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-base text-muted-foreground">
          Oops! The page or service you are looking for doesn&apos;t exist, has
          been moved or is temporarily unavailable.
        </p>
      </div>

      {/* ActionButtons */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button variant="default" size="lg" className="gap-2">
          <Link href="/" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Button variant="outline" size="lg" className="gap-2">
          <Link href="/services" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Explore Services
          </Link>
        </Button>
      </div>
    </div>
  );
}
