/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, LogOut, Settings, User, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { NavbarProps } from '@/lib/types';
import { logout } from '@/service/logout';
import { AuthModal } from '@/app/(authGroup)/_components/AuthModal';

// NavItems
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Technicians', href: '/technicians' },
];

// UserMenuItems
const userMenuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, action: 'dashboard' },
];

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const userData =
    user?.data?.profile ||
    (user as any)?.data ||
    (user as any)?.profile ||
    user;

  const isAuthenticated = Boolean(
    user?.success || user?.data || (user as any)?.id || (user as any)?.email,
  );

  const handleUserMenuAction = async (action: string) => {
    if (action === 'dashboard') {
      const role = user?.data?.profile?.role || userData?.role;

      if (role === 'CUSTOMER') {
        router.push('/dashboard/customer-dashboard');
      } else if (role === 'TECHNICIAN') {
        router.push('/dashboard/technician-dashboard');
      } else if (role === 'ADMIN') {
        router.push('/dashboard/admin-dashboard');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    if (action === 'logout') {
      await logout();
      toast.success('User Logged Out Successfully!');
      router.refresh();
      router.push('/');
    }
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-primary">FixItNow</span>
          </Link>

          {/* NavLinks */}
          <div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex md:items-center md:gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* UserDropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="cursor-pointer outline-none rounded-full focus:ring-2 focus:ring-primary/20">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground leading-none">
                        {userData?.email || ''}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {userMenuItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.action}
                        onClick={() => handleUserMenuAction(item.action)}
                        className="cursor-pointer"
                      >
                        <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleUserMenuAction('logout')}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <AuthModal
                defaultTab="login"
                triggerText="Login"
                variant="ghost"
              />
              <AuthModal
                defaultTab="register"
                triggerText="Register"
                variant="default"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
