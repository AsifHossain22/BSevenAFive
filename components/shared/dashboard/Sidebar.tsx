'use client';

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
} from 'lucide-react';
import { ISidebarItem, IUserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: IUserRole;
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();

  // NavLinks
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
        label: 'Jobs & Schedule',
        href: '/dashboard/technician-dashboard/jobs-schedule',
        icon: Wrench,
      },
      {
        label: 'My Profile',
        href: '/dashboard/technician-dashboard/profile',
        icon: UserIcon,
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
    ],
  };

  const links = navLinks[role] || navLinks.CUSTOMER;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card shrink-0 h-full sticky top-0">
      {/* HeaderSection */}
      <div className="p-4 border-b border-border/60">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
          {role} Dashboard
        </p>
        <p className="text-sm font-semibold text-foreground truncate mt-0.5">
          {userName}
        </p>
      </div>

      {/* NavLinks */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon;

          const isActive =
            pathname === link.href ||
            (link.href !== '/dashboard/customer-dashboard' &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Back to Home</span>
        </Link>
      </div>
    </aside>
  );
}
