/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  CheckCircle2,
  CreditCard,
  Loader2,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { getCustomerDashboardSummary } from '@/service/customerService';

export default function CustomerDashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    recentBookings: [] as any[],
  });

  useEffect(() => {
    async function fetchSummaryData() {
      try {
        setLoading(true);
        const data = await getCustomerDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load dynamic summary:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummaryData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 border-amber-200"
          >
            Pending
          </Badge>
        );
      case 'ACCEPTED':
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-600 border-blue-200"
          >
            Accepted
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-600 border-purple-200"
          >
            In Progress
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 border-green-200"
          >
            Completed
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mr-2 text-primary" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Here is what is happening with your home service requests and
            activity.
          </p>
        </div>
        <Button className="shrink-0 gap-2 cursor-pointer">
          <Link href="/services">
            <PlusCircle className="w-4 h-4" /> Book New Service
          </Link>
        </Button>
      </div>

      {/* DynamicCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Calendar className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime service requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {summary.activeBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending, accepted & ongoing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Jobs
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {summary.completedBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fulfilled services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Payments processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RecentBookingsFeed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
            <Link href="/dashboard/customer-dashboard/bookings">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {summary.recentBookings.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No recent service requests found. Click &ldquo;Book New
              Service&rdquo; to place an order.
            </div>
          ) : (
            <div className="space-y-4">
              {summary.recentBookings.map((booking: any) => {
                const bId = booking.id || booking._id;
                return (
                  <div
                    key={bId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {booking.serviceCategory?.categoryName ||
                          booking.serviceTitle ||
                          'Home Repair Service'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ID: <span className="font-mono">{bId}</span> • Date:{' '}
                        {booking.bookingDate || 'N/A'} ({booking.timeSlot || ''}
                        )
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">
                        ৳
                        {booking.totalAmount ||
                          booking.price ||
                          booking.amount ||
                          0}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
