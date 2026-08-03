/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  Wrench,
  Layers,
} from 'lucide-react';
import { IUserProfileResponse } from '@/lib/types';
import { getAllCategories } from '@/service/categoryService';
import { getAllBookings } from '@/service/bookingService';
import { getAllUsers } from '@/service/adminUserService';

async function getAdminOverviewData() {
  const [users, categories, bookings] = await Promise.all([
    getAllUsers(),
    getAllCategories(),
    getAllBookings(),
  ]);

  // TotalUsers
  const totalUsers = users.length;
  const totalTechnicians = users.filter(
    u => u.role === 'TECHNICIAN' || (u as any).isTechnician,
  ).length;

  const totalBookings = bookings.length;
  const totalCategories = categories.length;

  // CalculateRevenue
  const totalRevenue = bookings.reduce((sum, item) => {
    const cost = item.totalAmount || item.price || item.amount || 0;
    return sum + Number(cost);
  }, 0);

  // DynamicRecentActivity
  const recentActivity = bookings.slice(0, 5).map((job: any) => ({
    id: job.id || job._id || `JOB-${Math.floor(Math.random() * 8999 + 1000)}`,
    customerName:
      job.customer?.name ||
      job.user?.name ||
      job.customerName ||
      'General Customer',
    serviceTitle:
      job.serviceCategory?.categoryName ||
      job.serviceCategory?.name ||
      job.service?.title ||
      job.serviceTitle ||
      'Home Service',
    technicianName: job.technician?.name || job.technicianName || 'Unassigned',
    status: job.status || 'PENDING',
    bookingDate:
      job.bookingDate ||
      (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'),
    totalAmount: job.totalAmount || job.price || job.amount || 0,
  }));

  return {
    metrics: {
      totalUsers,
      totalTechnicians,
      totalBookings,
      totalCategories,
      totalRevenue,
    },
    recentActivity,
  };
}

export default async function AdminDashboardOverviewPage() {
  const userRes: IUserProfileResponse | null = await getUser();
  if (!userRes?.data?.profile) redirect('/');

  const data = await getAdminOverviewData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide metrics, overall financial revenue and recent booking
          activity.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Technicians
            </CardTitle>
            <Wrench className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.totalTechnicians}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.totalCategories}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.totalBookings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${data.metrics.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RecentActivity */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Recent Bookings
        </h2>

        {data.recentActivity.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No recent bookings found in database.
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.recentActivity.map((job: any) => (
              <Card key={job.id}>
                <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">
                        {job.serviceTitle}
                      </span>
                      <Badge
                        className={
                          job.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-600'
                            : job.status === 'ACCEPTED'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Customer:{' '}
                      <span className="font-medium text-foreground">
                        {job.customerName}
                      </span>{' '}
                      | Assigned Tech:{' '}
                      <span className="font-medium text-foreground">
                        {job.technicianName}
                      </span>
                    </p>

                    <div className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                      <Calendar className="w-3.5 h-3.5" /> Date:{' '}
                      {job.bookingDate}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <p className="text-lg font-bold text-primary">
                      ${job.totalAmount}
                    </p>
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
