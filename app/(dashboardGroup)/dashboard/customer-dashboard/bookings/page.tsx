/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Loader2, CreditCard, Ban } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCustomerBookings,
  cancelBooking,
  initiatePayment,
} from '@/service/customerService';

export default function CustomerBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        const resData = await getCustomerBookings();

        // BookingList
        const bookingsList = Array.isArray(resData)
          ? resData
          : resData?.data || resData?.bookings || resData?.result || [];

        setBookings(bookingsList);
      } catch (err) {
        toast.error('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const handleCancel = async (id: string) => {
    setActionLoadingId(id);
    const toastId = toast.loading('Cancelling booking...');

    try {
      await cancelBooking(id);
      setBookings(prev =>
        prev.map(b =>
          b.id === id || b._id === id ? { ...b, status: 'CANCELLED' } : b,
        ),
      );
      toast.success('Booking cancelled successfully.', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Could not cancel booking.', { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePayNow = async (id: string) => {
    setActionLoadingId(id);
    const toastId = toast.loading('Redirecting to secure gateway...');

    try {
      const res = await initiatePayment(id);

      const gatewayUrl = res?.gatewayUrl || res?.data?.gatewayUrl || res?.url;

      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        toast.error('Payment gateway URL not received from backend.', {
          id: toastId,
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not initiate payment.', {
        id: toastId,
      });
    } finally {
      setActionLoadingId(null);
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
            Pending Acceptance
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
      <Card className="p-8 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading your
        bookings...
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Track service status, process payments or cancel eligible requests.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    You have not made any service bookings yet.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map(b => {
                  const bId = b.id || b._id;
                  const isActioning = actionLoadingId === bId;
                  const isUnpaid = b.paymentStatus !== 'PAID';
                  const canPay =
                    isUnpaid &&
                    (b.status === 'ACCEPTED' || b.status === 'PENDING');

                  return (
                    <TableRow key={bId}>
                      <TableCell className="font-bold text-xs font-mono">
                        {bId}
                      </TableCell>
                      <TableCell>
                        {b.service?.title ||
                          b.service?.name ||
                          b.serviceCategory?.categoryName ||
                          b.serviceTitle ||
                          'Home Service'}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium">
                            {b.bookingDate
                              ? new Date(b.bookingDate).toLocaleDateString()
                              : 'N/A'}
                          </p>
                          <p className="text-muted-foreground">
                            {b.timeSlot
                              ? new Date(b.timeSlot).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        $
                        {b.totalAmount ||
                          b.price ||
                          b.amount ||
                          b.service?.price ||
                          0}
                      </TableCell>
                      <TableCell>{getStatusBadge(b.status)}</TableCell>
                      <TableCell className="text-right">
                        {isActioning ? (
                          <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* PayNowButton */}
                            {canPay && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 h-8 gap-1 cursor-pointer"
                                onClick={() => handlePayNow(bId)}
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Pay Now
                              </Button>
                            )}

                            {/* CancelButton */}
                            {(b.status === 'PENDING' ||
                              b.status === 'ACCEPTED') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8 gap-1 cursor-pointer"
                                onClick={() => handleCancel(bId)}
                              >
                                <Ban className="w-3.5 h-3.5" /> Cancel
                              </Button>
                            )}

                            {b.paymentStatus === 'PAID' && (
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-600 border-emerald-200"
                              >
                                Paid
                              </Badge>
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
