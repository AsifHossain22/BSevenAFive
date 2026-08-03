'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateBookingStatus } from '@/service/technicianService';

export default function TechnicianBookingsPage({
  initialBookings = [],
}: {
  initialBookings?: any[];
}) {
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const toastId = toast.loading(`Updating status to ${newStatus}...`);

    try {
      await updateBookingStatus(id, newStatus);

      setBookings(prev =>
        prev.map(b =>
          b.id === id || b._id === id ? { ...b, status: newStatus } : b,
        ),
      );

      toast.success(
        `Booking status updated to ${newStatus.replace('_', ' ')}!`,
        {
          id: toastId,
        },
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status.', { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

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
      case 'DECLINED':
      case 'CANCELLED':
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 border-red-200"
          >
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Booking Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage live requests, update active service states, and complete
          bookings.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No bookings found in database.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map(booking => {
                  const bId = booking.id || booking._id;
                  const isLoading = loadingId === bId;

                  return (
                    <TableRow key={bId}>
                      <TableCell className="font-bold">{bId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {booking.customer?.name ||
                              booking.user?.name ||
                              booking.customerName ||
                              'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.customer?.email ||
                              booking.user?.email ||
                              booking.phone ||
                              ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.serviceCategory?.categoryName ||
                          booking.serviceCategory?.name ||
                          booking.serviceTitle ||
                          'Service'}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium">
                            {booking.bookingDate ||
                              (booking.createdAt
                                ? new Date(
                                    booking.createdAt,
                                  ).toLocaleDateString()
                                : 'N/A')}
                          </p>
                          <p className="text-muted-foreground">
                            {booking.timeSlot || booking.slot || ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ৳
                        {booking.totalAmount ||
                          booking.price ||
                          booking.amount ||
                          0}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {booking.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700 h-8 gap-1 cursor-pointer"
                                  onClick={() =>
                                    handleUpdateStatus(bId, 'ACCEPTED')
                                  }
                                >
                                  <Check className="w-3.5 h-3.5" /> Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8 gap-1 cursor-pointer"
                                  onClick={() =>
                                    handleUpdateStatus(bId, 'DECLINED')
                                  }
                                >
                                  <X className="w-3.5 h-3.5" /> Decline
                                </Button>
                              </>
                            )}

                            {booking.status === 'ACCEPTED' && (
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 h-8 gap-1 cursor-pointer"
                                onClick={() =>
                                  handleUpdateStatus(bId, 'IN_PROGRESS')
                                }
                              >
                                <Play className="w-3.5 h-3.5" /> Start Job
                              </Button>
                            )}

                            {booking.status === 'IN_PROGRESS' && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 h-8 gap-1 cursor-pointer"
                                onClick={() =>
                                  handleUpdateStatus(bId, 'COMPLETED')
                                }
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                                Complete
                              </Button>
                            )}

                            {(booking.status === 'COMPLETED' ||
                              booking.status === 'DECLINED' ||
                              booking.status === 'CANCELLED') && (
                              <span className="text-xs text-muted-foreground italic">
                                No actions available
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
