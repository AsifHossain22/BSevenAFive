import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Wrench,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Calendar,
  UserCheck,
  MapPin,
  Clock,
} from 'lucide-react';
import { IBooking, IUserProfileResponse } from '@/lib/types';

async function getAdminOverview() {
  // TODO: APIFetchService
  const recentBookings: IBooking[] = [
    {
      id: 'JOB-3001',
      customerId: 'cust-101',
      customer: {
        id: 'cust-101',
        name: 'Arif Hasan',
        email: 'arif@example.com',
        role: 'CUSTOMER',
        activeStatus: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      technicianId: 'tech-1',
      technician: {
        id: 'tech-1',
        name: 'Kabir Hossain',
        email: 'kabir@example.com',
        role: 'TECHNICIAN',
        activeStatus: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      serviceId: 'srv-1',
      service: {
        id: 'srv-1',
        title: 'Full House Electrical Wiring Check',
        description: 'Safety check for whole electrical setup.',
        price: 2500,
        categoryId: 'cat-1',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      status: 'IN_PROGRESS',
      bookingDate: '2026-08-04',
      slotTime: '11:00 AM - 01:00 PM',
      totalAmount: 2500,
      notes: 'Road 11, Banani, Dhaka',
      createdAt: '2026-08-03',
      updatedAt: '2026-08-03',
    },
    {
      id: 'JOB-3002',
      customerId: 'cust-102',
      customer: {
        id: 'cust-102',
        name: 'Nusrat Jahan',
        email: 'nusrat@example.com',
        role: 'CUSTOMER',
        activeStatus: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      technicianId: 'tech-2',
      technician: {
        id: 'tech-2',
        name: 'Rahim Uddin',
        email: 'rahim@example.com',
        role: 'TECHNICIAN',
        activeStatus: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      serviceId: 'srv-2',
      service: {
        id: 'srv-2',
        title: 'Refrigerator Gas Refill & Compressor Check',
        description: 'Cooling issue resolution.',
        price: 3200,
        categoryId: 'cat-3',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      status: 'COMPLETED',
      bookingDate: '2026-08-03',
      slotTime: '02:00 PM - 04:00 PM',
      totalAmount: 3200,
      notes: 'Uttara Sector 4, Dhaka',
      createdAt: '2026-08-02',
      updatedAt: '2026-08-03',
    },
  ];

  return {
    totalUsers: 148,
    activeTechnicians: 32,
    totalBookings: 412,
    platformRevenue: 184500,
    recentBookings,
  };
}

export default async function AdminDashboardPage() {
  const userRes: IUserProfileResponse | null = await getUser();

  // Authentication
  if (!userRes?.data?.profile) redirect('/');

  const overview = await getAdminOverview();

  return (
    <div className="space-y-6">
      {/* HeaderSection */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor system performance, user activity, service status and total
          platform revenue.
        </p>
      </div>

      {/* AnalyticsCards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" /> +12% from last
              month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Technicians
            </CardTitle>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.activeTechnicians}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verified service providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <CalendarCheck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all service categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${overview.platformRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" /> Gross earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* PlatformActivity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" /> Live Service Activity &
            Bookings
          </h2>
          <Button variant="outline" size="sm">
            View All Bookings
          </Button>
        </div>

        {overview.recentBookings.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No system activity reported yet.
          </Card>
        ) : (
          <div className="grid gap-4">
            {overview.recentBookings.map(job => (
              <Card key={job.id}>
                <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">
                        {job.service?.title}
                      </span>
                      <Badge
                        className={
                          job.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-600'
                            : job.status === 'IN_PROGRESS'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <p>
                        Customer:{' '}
                        <span className="font-medium text-foreground">
                          {job.customer?.name}
                        </span>
                      </p>
                      <p>
                        Technician:{' '}
                        <span className="font-medium text-foreground">
                          {job.technician?.name || 'Unassigned'}
                        </span>
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {job.bookingDate} (
                        {job.slotTime})
                      </p>
                      <p className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />{' '}
                        {job.notes || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* PricingActions */}
                  <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <p className="text-lg font-bold text-primary">
                      ${job.totalAmount}
                    </p>

                    <Button size="sm" variant="outline" className="mt-2">
                      Manage Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
