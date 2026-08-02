'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, Star, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

// SampleActivityData
const activityData = [
  { month: 'Jan', bookings: 1, spent: 45 },
  { month: 'Feb', bookings: 2, spent: 120 },
  { month: 'Mar', bookings: 0, spent: 0 },
  { month: 'Apr', bookings: 3, spent: 210 },
  { month: 'May', bookings: 1, spent: 65 },
  { month: 'Jun', bookings: 4, spent: 340 },
  { month: 'Jul', bookings: 2, spent: 150 },
];

export default function CustomerDashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Overview</h1>
        <p className="text-sm text-muted-foreground">
          Track your service requests, monthly spending and activity statistics.
        </p>
      </div>

      {/* MetricCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$930</div>
            <p className="text-xs text-muted-foreground">
              Across 5 service types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-emerald-600 font-medium">
              92% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews Left</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Average rating: 4.9 ★
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AnalyticsCharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MonthlySpendingChart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Monthly Service Expenses ($)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient
                    id="spendingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#spendingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MonthlyBookingFrequencyChart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Booking Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
