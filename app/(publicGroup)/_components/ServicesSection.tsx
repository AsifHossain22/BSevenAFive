import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Zap,
  Droplet,
  Flame,
  Home,
  Paintbrush,
  ArrowRight,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Plumbing Repair',
    description:
      'Fix leaks, unclog drains and install water fixtures with top-rated local plumbers.',
    icon: Droplet,
    startingPrice: '$49',
    popular: true,
  },
  {
    title: 'Electrical Services',
    description:
      'Safe wiring, outlet replacements, breaker repairs and custom lighting setups.',
    icon: Zap,
    startingPrice: '$59',
    popular: true,
  },
  {
    title: 'HVAC & Heating',
    description:
      'Air conditioning repair, heating maintenance, filter replacements and duct cleaning.',
    icon: Flame,
    startingPrice: '$69',
    popular: false,
  },
  {
    title: 'Appliance Maintenance',
    description:
      'Refrigerators, washing machines, microwaves and dishwasher diagnostic & repair.',
    icon: Wrench,
    startingPrice: '$45',
    popular: false,
  },
  {
    title: 'Painting & Touchups',
    description:
      'Interior/exterior wall painting, drywall repair, touch-ups and plastering.',
    icon: Paintbrush,
    startingPrice: '$79',
    popular: false,
  },
  {
    title: 'General Handyman',
    description:
      'TV mounting, furniture assembly, door hardware repair and general home fixes.',
    icon: Home,
    startingPrice: '$39',
    popular: false,
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-3 text-primary border-primary/30"
            >
              Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Our Most Popular Services
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Book skilled, background-checked professionals for all your home
              maintenance needs.
            </p>
          </div>

          <Link href="/services" className="shrink-0">
            <Button
              variant="outline"
              className="gap-2 cursor-pointer w-full sm:w-auto hover:bg-primary"
            >
              View All Services{' '}
              <ArrowRight className="w-4 h-4 hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* ServicesGrid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="relative flex flex-col justify-between border-border/80 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between">
                  <div>
                    {/* IconAndPopularBadge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      {service.popular && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  {/* PricingFooter */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Starting from
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {service.startingPrice}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary hover:translate-x-1 transition-transform duration-150 cursor-pointer">
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
