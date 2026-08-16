/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { IUserProfileResponse } from '@/lib/types';
import { getTechnicianBookings } from '@/service/technicianService';

async function getTechnicianOverviewData() {
  const resData = await getTechnicianBookings();

  let bookings: any[] = [];
  if (Array.isArray(resData)) {
    bookings = resData;
  } else if (Array.isArray(resData?.data)) {
    bookings = resData.data;
  } else if (Array.isArray(resData?.bookings)) {
    bookings = resData.bookings;
  } else if (Array.isArray(resData?.result)) {
    bookings = resData.result;
  }

  const pendingRequests = bookings.filter(b => {
    const s = (b.status || b.bookingStatus || '').toUpperCase();
    return s === 'PENDING' || s === 'REQUESTED';
  }).length;

  const upcomingJobs = bookings.filter(b => {
    const s = (b.status || b.bookingStatus || '').toUpperCase();
    return s === 'ACCEPTED' || s === 'IN_PROGRESS';
  }).length;

  const completedJobs = bookings.filter(b => {
    const s = (b.status || b.bookingStatus || '').toUpperCase();
    return s === 'COMPLETED';
  }).length;

  const totalEarnings = bookings
    .filter(b => {
      const s = (b.status || b.bookingStatus || '').toUpperCase();
      return s === 'COMPLETED';
    })
    .reduce((sum, item) => {
      const val =
        item.totalAmount ??
        item.amount ??
        item.price ??
        item.service?.price ??
        0;
      return sum + Number(val);
    }, 0);

  const recentRequests = bookings.slice(0, 5).map(job => {
    const status = (job.status || job.bookingStatus || 'PENDING').toUpperCase();
    const customerName =
      job.user?.name ||
      job.customer?.name ||
      job.customerName ||
      job.userName ||
      'Customer';

    const serviceName =
      job.service?.title ||
      job.serviceName ||
      job.serviceTitle ||
      job.serviceCategory?.categoryName ||
      job.serviceCategory?.name ||
      'Home Service';

    const rawDate = job.bookingDate || job.createdAt || job.date;
    const dateStr = rawDate ? new Date(rawDate).toLocaleDateString() : 'N/A';

    const amount =
      job.totalAmount ?? job.amount ?? job.price ?? job.service?.price ?? 0;

    return {
      id: job.id || job._id,
      customerName,
      serviceName,
      date: dateStr,
      timeSlot: job.timeSlot || job.slot || 'Standard Shift',
      amount,
      status,
    };
  });

  return {
    metrics: {
      pendingRequests,
      upcomingJobs,
      completedJobs,
      totalEarnings,
    },
    recentRequests,
  };
}

export default async function TechnicianDashboardPage() {
  const userRes: IUserProfileResponse | null = await getUser();
  if (!userRes?.data?.profile) redirect('/login');

  const data = await getTechnicianOverviewData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Technician Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Real-time metrics from your scheduled services and
          earnings.
        </p>
      </div>

      {/* DynamicCards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Jobs</CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.upcomingJobs}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Accepted & in-progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.metrics.completedJobs}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${data.metrics.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed jobs revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DynamicActivityList */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Active Job Requests
        </h2>

        {data.recentRequests.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No active job requests found in your queue.
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.recentRequests.map(job => (
              <Card key={job.id}>
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">
                        {job.serviceName}
                      </span>
                      <Badge
                        className={
                          job.status === 'ACCEPTED'
                            ? 'bg-blue-500/10 text-blue-600'
                            : job.status === 'COMPLETED'
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
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📅 Date: {job.date} | ⏰ Slot: {job.timeSlot}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">
                      ${job.amount.toFixed(2)}
                    </span>
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
