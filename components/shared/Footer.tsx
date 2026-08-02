import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BrandInfo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Wrench className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-primary">FixItNow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for fast, reliable and professional home
              services.
            </p>
          </div>

          {/* QuickLinks */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/technicians"
                  className="hover:text-primary transition-colors"
                >
                  Technicians
                </Link>
              </li>
            </ul>
          </div>

          {/* CustomerSupport */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/help"
                  className="hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Contact Us
            </h4>
            <p className="text-sm text-muted-foreground">
              Support: support@fixitnow.com
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Available 24/7 for emergency repairs
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} <b>FixItNow.</b> All rights
          reserved.{' '}
          <strong>
            Developed by <span className="text-primary">Hi ASIF</span>
          </strong>
        </div>
      </div>
    </footer>
  );
}
