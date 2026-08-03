'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  User as UserIcon,
  Wrench,
  Users,
  FolderTree,
  Home,
  Menu,
  X,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { ISidebarItem, IUserRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  role: IUserRole;
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // NavLinksUserRole
  const navLinks: Record<IUserRole, ISidebarItem[]> = {
    CUSTOMER: [
      {
        label: 'Overview',
        href: '/dashboard/customer-dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'My Bookings',
        href: '/dashboard/customer-dashboard/bookings',
        icon: Calendar,
      },
      {
        label: 'Payments',
        href: '/dashboard/customer-dashboard/payments',
        icon: CreditCard,
      },
      {
        label: 'Reviews',
        href: '/dashboard/customer-dashboard/reviews',
        icon: Star,
      },
      {
        label: 'Profile',
        href: '/dashboard/customer-dashboard/profile',
        icon: UserIcon,
      },
    ],
    TECHNICIAN: [
      {
        label: 'Overview',
        href: '/dashboard/technician-dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Booking Management',
        href: '/dashboard/technician-dashboard/bookings',
        icon: CheckSquare,
      },
      {
        label: 'Availability Scheduler',
        href: '/dashboard/technician-dashboard/availability',
        icon: Clock,
      },
      {
        label: 'Profile',
        href: '/dashboard/technician-dashboard/profile',
        icon: Wrench,
      },
    ],
    ADMIN: [
      {
        label: 'Overview',
        href: '/dashboard/admin-dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'User Management',
        href: '/dashboard/admin-dashboard/users',
        icon: Users,
      },
      {
        label: 'Category Management',
        href: '/dashboard/admin-dashboard/categories',
        icon: FolderTree,
      },
      {
        label: 'Profile',
        href: '/dashboard/admin-dashboard/profile',
        icon: UserIcon,
      },
    ],
  };

  const links = navLinks[role] || navLinks.CUSTOMER;

  // HighlightNavLink
  const isLinkActive = (href: string) => {
    const isBaseDashboard =
      href === '/dashboard/customer-dashboard' ||
      href === '/dashboard/technician-dashboard' ||
      href === '/dashboard/admin-dashboard';

    if (isBaseDashboard) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* MobileTopBarHeader */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card w-full">
        <div>
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">
            {role} Portal
          </p>
          <p className="text-xs font-bold text-foreground truncate max-w-45">
            {userName}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* MobileDrawerOverlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SidebarContainer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:static md:translate-x-0 shrink-0 h-full',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* HeaderSection */}
        <div className="p-4 border-b border-border/60 flex justify-between items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
              {role} Dashboard
            </p>
            <p className="text-sm font-semibold text-foreground truncate mt-0.5">
              {userName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* NavLinks */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(link => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    active
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground',
                  )}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* FooterSection */}
        <div className="p-3 border-t border-border mt-auto">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
