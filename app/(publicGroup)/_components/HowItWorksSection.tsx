import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Select a Service',
    description:
      'Choose from plumbing, electrical, HVAC and more. Describe your issue in a few simple clicks.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Book a Specialist',
    description:
      'Pick a date and time that works best for you. Match with background-checked, top-rated local pros.',
    icon: CalendarCheck,
  },
  {
    step: '03',
    title: 'Get It Fixed',
    description:
      'Sit back and relax. Your technician arrives on time, completes the job and guarantees quality.',
    icon: CheckCircle2,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-3 text-primary border-primary/30"
          >
            Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How FixItNow Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Getting your home repairs handled is fast, transparent and
            completely hassle-free.
          </p>
        </div>

        {/* StepsGrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* DesktopConnectingLine */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-border/60 -translate-y-1/2 z-0" />

          {steps.map((item, index) => {
            // const Icon = item.icon;
            return (
              <Card
                key={index}
                className="relative z-10 border-border/80 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center">
                  {/* StepNumberBadge */}
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mb-10 ring-10 ring-card group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300">
                    {item.step}
                  </div>

                  {/* Icon */}
                  {/* <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300">
                    <Icon className="w-8 h-8" />
                  </div> */}

                  {/* TextDetails */}
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
