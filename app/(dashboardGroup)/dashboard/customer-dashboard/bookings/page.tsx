/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  X,
  Clock,
  Calendar,
  User,
  MapPin,
  Wrench,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getCustomerBookings,
  cancelBooking,
  initiatePayment,
} from '@/service/customerService';

export default function CustomerBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await getCustomerBookings();

      let list: any[] = [];
      if (Array.isArray(resData)) {
        list = resData;
      } else if (Array.isArray((resData as any)?.data)) {
        list = (resData as any).data;
      } else if (Array.isArray((resData as any)?.data?.result)) {
        list = (resData as any).data.result;
      } else if (Array.isArray((resData as any)?.bookings)) {
        list = (resData as any).bookings;
      } else if (Array.isArray((resData as any)?.result)) {
        list = (resData as any).result;
      }

      setBookings(list);
    } catch (err: any) {
      toast.error(err.message || 'Could not fetch your bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    const toastId = toast.loading('Cancelling service booking...');

    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully!', { id: toastId });

      setBookings(prev =>
        prev.map(item => {
          const itemId = item.id || item._id;
          if (itemId === id) {
            return {
              ...item,
              status: 'CANCELLED',
              bookingStatus: 'CANCELLED',
            };
          }
          return item;
        }),
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking.', { id: toastId });
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayNow = async (id: string) => {
    setPayingId(id);
    const toastId = toast.loading('Initializing payment session...');

    try {
      const data = await initiatePayment(id);
      const paymentUrl =
        data?.data?.paymentUrl || data?.paymentUrl || data?.url;

      if (paymentUrl) {
        toast.success('Redirecting to payment gateway...', { id: toastId });
        window.location.href = paymentUrl;
      } else {
        toast.error(data?.message || 'Failed to get payment checkout URL.', {
          id: toastId,
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error initiating payment process.', {
        id: toastId,
      });
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-87.5 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Track active service requests, technician assignments and service
          history.
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No Bookings Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You have not booked any services yet.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map(req => {
            const id = req.id || req._id;
            const rawStatus = req.status || req.bookingStatus || '';
            const status = rawStatus.toUpperCase();

            const isPending = status === 'REQUESTED' || status === 'PENDING';
            const isAccepted = status === 'ACCEPTED';
            const isInProgress = status === 'IN_PROGRESS';
            const isPaid = status === 'PAID' || status === 'CONFIRMED';
            const isCompleted = status === 'COMPLETED';
            const isCancelled =
              status === 'CANCELLED' ||
              status === 'DECLINED' ||
              status === 'REJECTED';

            const isActionLoading = cancellingId === id;
            const isPayLoading = payingId === id;

            const serviceTitle =
              req.service?.title ||
              req.serviceName ||
              req.serviceTitle ||
              req.serviceCategory?.categoryName ||
              'Booked Service';

            const technicianName =
              req.technician?.name ||
              req.technicianName ||
              req.assignedTechnician?.name ||
              'Assigning Technician...';

            const rawDate = req.bookingDate || req.createdAt || req.date;
            const dateStr = rawDate
              ? new Date(rawDate).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A';

            const timeSlot = req.timeSlot || req.slot || 'Standard Shift';

            const amount =
              req.totalAmount ??
              req.price ??
              req.amount ??
              req.service?.price ??
              0;

            const address =
              req.address || req.location || 'Your Registered Address';

            return (
              <Card
                key={id}
                className="overflow-hidden border border-border/60 hover:border-primary/40 transition-all duration-200 shadow-sm"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Wrench className="w-5 h-5 text-primary shrink-0" />
                        <h3 className="text-lg font-bold text-foreground">
                          {serviceTitle}
                        </h3>
                        {isPending && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-600 border-amber-300 font-medium"
                          >
                            Awaiting Acceptance
                          </Badge>
                        )}
                        {isAccepted && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-300 font-medium"
                          >
                            Accepted (Payment Pending)
                          </Badge>
                        )}
                        {isInProgress && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-300 font-medium"
                          >
                            In Progress
                          </Badge>
                        )}
                        {isPaid && (
                          <Badge
                            variant="outline"
                            className="bg-sky-500/10 text-sky-600 border-sky-300 font-medium"
                          >
                            Confirmed & Paid
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-medium"
                          >
                            Completed
                          </Badge>
                        )}
                        {isCancelled && (
                          <Badge
                            variant="outline"
                            className="bg-rose-500/10 text-rose-600 border-rose-300 font-medium"
                          >
                            Cancelled
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Booking ID: <span className="font-mono">{id}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xl font-black text-primary bg-primary/5 px-3.5 py-1.5 rounded-lg border border-primary/10 self-start md:self-auto">
                      <DollarSign className="w-5 h-5 -mr-1" />
                      <span>{Number(amount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">
                        Technician:{' '}
                        <strong className="text-foreground">
                          {technicianName}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>
                        {dateStr} ({timeSlot})
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 sm:col-span-2 md:col-span-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">
                        Address:{' '}
                        <strong className="text-foreground">{address}</strong>
                      </span>
                    </div>
                  </div>

                  {(isPending || isAccepted) && (
                    <div className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-end gap-3">
                      {isAccepted && (
                        <Button
                          size="default"
                          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer font-semibold"
                          disabled={isPayLoading}
                          onClick={() => handlePayNow(id)}
                        >
                          {isPayLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                          Pay Now
                        </Button>
                      )}

                      <Button
                        size="default"
                        variant="outline"
                        className="w-full sm:w-auto border-destructive/40 text-destructive hover:bg-destructive/10 gap-2 cursor-pointer"
                        disabled={isActionLoading || isPayLoading}
                        onClick={() => handleCancelBooking(id)}
                      >
                        {isActionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
