import { getUser } from '@/service/getUser';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { IBooking, IBookingStatus, IUserProfileResponse } from '@/lib/types';

// TODO: FetchServiceFromDB
async function getTechnicianJobs(): Promise<IBooking[]> {
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
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      },
      technicianId: 'tech-1',
      serviceId: 'srv-1',
      service: {
        id: 'srv-1',
        title: 'AC Deep Cleaning & Servicing',
        description: 'Complete indoor and outdoor unit cleaning',
        price: 1500,
        categoryId: 'cat-1',
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      },
      status: 'ACCEPTED',
      bookingDate: '2026-08-05',
      slotTime: '10:00 AM - 12:00 PM',
      totalAmount: 1500,
      notes: 'House 12, Road 5, Dhanmondi, Dhaka | Phone: +8801700000000',
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
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      },
      technicianId: 'tech-1',
      serviceId: 'srv-2',
      service: {
        id: 'srv-2',
        title: 'Plumbing Repair & Leakage Fix',
        description: 'Fixing water leakages in bathroom',
        price: 1200,
        categoryId: 'cat-2',
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      },
      status: 'IN_PROGRESS',
      bookingDate: '2026-08-04',
      slotTime: '02:00 PM - 04:00 PM',
      totalAmount: 1200,
      notes: 'Block B, Bashundhara R/A, Dhaka | Phone: +8801800000000',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    },
    {
      id: 'JOB-2003',
      customerId: 'cust-3',
      customer: {
        id: 'cust-3',
        name: 'Ayesha Rahman',
        email: 'ayesha@example.com',
        role: 'CUSTOMER',
        activeStatus: 'ACTIVE',
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      },
      technicianId: 'tech-1',
      serviceId: 'srv-3',
      service: {
        id: 'srv-3',
        title: 'Refrigerator Gas Refill',
        description: 'Refilling fridge compressor gas',
        price: 2500,
        categoryId: 'cat-1',
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      },
      status: 'COMPLETED',
      bookingDate: '2026-08-01',
      slotTime: '11:00 AM - 01:00 PM',
      totalAmount: 2500,
      notes: 'Sector 4, Uttara, Dhaka | Phone: +8801900000000',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    },
  ];
}

export default async function TechnicianJobsPage() {
  const userRes: IUserProfileResponse | null = await getUser();
  if (!userRes?.data?.profile) redirect('/');

  const jobs = await getTechnicianJobs();

  // StatusBadge
  const getStatusBadge = (status: IBookingStatus) => {
    switch (status) {
      case 'REQUESTED':
      case 'ACCEPTED':
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-300"
          >
            Pending
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-600 border-blue-300"
          >
            In Progress
          </Badge>
        );
      case 'COMPLETED':
      case 'PAID':
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 border-green-300"
          >
            Completed
          </Badge>
        );
      case 'CANCELLED':
      case 'DECLINED':
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 border-red-300"
          >
            Cancelled
          </Badge>
        );
    }
  };

  const renderJobList = (filteredJobs: IBooking[]) => {
    if (filteredJobs.length === 0) {
      return (
        <Card className="p-8 text-center text-muted-foreground">
          No job requests found in this section.
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredJobs.map(job => (
          <Card key={job.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground font-semibold">
                    {job.id}
                  </span>
                  <h3 className="font-bold text-base text-foreground">
                    {job.service?.title || 'Service Details'}
                  </h3>
                  {getStatusBadge(job.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 shrink-0 text-primary" />
                    <span className="font-medium text-foreground">
                      {job.customer?.name || 'Customer'}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0 text-primary" />
                    <span>{job.customer?.email || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0 text-primary" />
                    <span>
                      {job.bookingDate} ({job.slotTime})
                    </span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 shrink-0 text-primary" />
                    <span className="truncate">
                      {job.notes || 'No location notes provided'}
                    </span>
                  </p>
                </div>
              </div>

              {/* PriceAndAction */}
              <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-border gap-2">
                <div className="text-left md:text-right">
                  <p className="text-xs text-muted-foreground">Fee</p>
                  <p className="text-xl font-bold text-primary">
                    ${job.totalAmount}
                  </p>
                </div>

                <div className="flex gap-2">
                  {(job.status === 'ACCEPTED' ||
                    job.status === 'REQUESTED') && (
                    <Button size="sm" variant="default">
                      Start Job
                    </Button>
                  )}
                  {job.status === 'IN_PROGRESS' && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Assigned Jobs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          View, manage and update status for all assigned service bookings.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderJobList(jobs)}
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {renderJobList(
            jobs.filter(
              j => j.status === 'ACCEPTED' || j.status === 'REQUESTED',
            ),
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {renderJobList(jobs.filter(j => j.status === 'IN_PROGRESS'))}
        </TabsContent>
        <TabsContent value="done" className="mt-4">
          {renderJobList(
            jobs.filter(j => j.status === 'COMPLETED' || j.status === 'PAID'),
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
