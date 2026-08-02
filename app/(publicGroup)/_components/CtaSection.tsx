import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Are You a Skilled Service Professional?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Join thousands of technicians expanding their businesses with
          FixItNow. Get leads, manage schedules and get paid instantly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="cursor-pointer font-semibold"
          >
            Become a Technician
          </Button>
        </div>
      </div>
    </section>
  );
}
