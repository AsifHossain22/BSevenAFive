import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { IBooking, IUserProfileResponse } from '@/lib/types';

async function getTechnicianJobs(): Promise<IBooking[]> {
  // TODO: APIFetchService
  return [
    {
      id: 'JOB-2001',
      customerId: 'cust-1',
      customer: {
        id: 'cust-1',
        name: 'Sufian Ahmed',
        email: 'sufian@example.com',
        role: 'CUSTOMER',
        activeStatus: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      technicianId: 'tech-1',
      serviceId: 'srv-1',
      service: {
        id: 'srv-1',
        title: 'AC Deep Cleaning & Service',
        description: 'Complete indoor and outdoor unit wash.',
        price: 1500,
        categoryId: 'cat-1',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      status: 'ACCEPTED',
      bookingDate: '2026-08-05',
      slotTime: '10:00 AM - 12:00 PM',
      totalAmount: 1500,
      notes: 'House 12, Road 5, Dhanmondi, Dhaka',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    },
    {
      id: 'JOB-2002',
      customerId: 'cust-2',
      customer: {
        id: 'cust-2',
        name: 'Tanvir Hossain',
        email: 'tanvir@example.com',
        role: 'CUSTOMER',
        activeStatus: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      technicianId: 'tech-1',
      serviceId: 'srv-2',
      service: {
        id: 'srv-2',
        title: 'Plumbing Repair & Pipe Leakage',
        description: 'Fixing water leakages.',
        price: 800,
        categoryId: 'cat-2',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      status: 'COMPLETED',
      bookingDate: '2026-08-02',
      slotTime: '03:00 PM - 05:00 PM',
      totalAmount: 800,
      notes: 'Block B, Bashundhara R/A, Dhaka',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    },
  ];
}

export default async function TechnicianDashboardPage() {
  const userRes: IUserProfileResponse | null = await getUser();
  if (!userRes?.data?.profile) redirect('/');

  const jobs = await getTechnicianJobs();

  const pendingCount = jobs.filter(
    j => j.status === 'ACCEPTED' || j.status === 'REQUESTED',
  ).length;
  const completedCount = jobs.filter(j => j.status === 'COMPLETED').length;
  const totalEarnings = jobs
    .filter(j => j.status === 'COMPLETED')
    .reduce((sum, j) => sum + j.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Technician Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your assigned service requests, track schedules and update job
          status.
        </p>
      </div>

      {/* JobCards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${totalEarnings}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* JobsList */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" /> Assigned Jobs & Schedule
        </h2>

        {jobs.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No assigned jobs available right now.
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
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
                            : 'bg-amber-500/10 text-amber-600'
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Customer:{' '}
                      <span className="font-medium text-foreground">
                        {job.customer?.name}
                      </span>{' '}
                      ({job.customer?.email})
                    </p>

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

                  {/* ActionsAndPrice */}
                  <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <p className="text-lg font-bold text-primary">
                      ৳{job.totalAmount}
                    </p>

                    {job.status === 'ACCEPTED' && (
                      <Button size="sm" variant="default" className="mt-2">
                        Mark Completed
                      </Button>
                    )}
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
