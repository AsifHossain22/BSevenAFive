import { CtaSection } from './_components/CtaSection';
import { HeroSection } from './_components/HeroSection';
import { HowItWorksSection } from './_components/HowItWorksSection';
import { ServicesSection } from './_components/ServicesSection';

export default function Home() {
  return (
    <>
      {/* HeroSection */}
      <HeroSection />

      {/* ServicesSection */}
      <ServicesSection />

      {/* HowItWorksSection */}
      <HowItWorksSection />

      {/* CTASection */}
      <CtaSection />
    </>
  );
}
