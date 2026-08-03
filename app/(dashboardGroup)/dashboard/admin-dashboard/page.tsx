import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Wrench,
  Shield,
  Layers,
} from 'lucide-react';
import { IUserProfileResponse } from '@/lib/types';

async function getAdminOverviewData() {
  // TODO: Replace with your actual API fetch service
  return {
    metrics: {
      totalUsers: 148,
      totalTechnicians: 32,
      totalBookings: 412,
      totalRevenue: 184500,
    },
    recentActivity: [
      {
        id: 'JOB-2001',
        customerName: 'Sufian Ahmed',
        serviceTitle: 'AC Deep Cleaning & Service',
        technicianName: 'Tanvir Hossain',
        status: 'ACCEPTED',
        bookingDate: '2026-08-05',
        totalAmount: 1500,
      },
      {
        id: 'JOB-2002',
        customerName: 'Arif Hasan',
        serviceTitle: 'Plumbing Repair & Pipe Leakage',
        technicianName: 'Kabir Hossain',
        status: 'COMPLETED',
        bookingDate: '2026-08-02',
        totalAmount: 800,
      },
    ],
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">
              Platform Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${data.metrics.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RecentActivityList */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Recent Bookings
        </h2>

        <div className="grid gap-4">
          {data.recentActivity.map(job => (
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
                    <Calendar className="w-3.5 h-3.5" /> Date: {job.bookingDate}
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
      </div>
    </div>
  );
}
