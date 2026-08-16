/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Loader2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cancelBooking, getCustomerBookings } from '@/service/customerService';

export default function CustomerBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCustomerBookings();

      let list: any[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.bookings)) {
        list = res.bookings;
      } else if (Array.isArray(res?.data?.bookings)) {
        list = res.data.bookings;
      } else if (Array.isArray(res?.result)) {
        list = res.result;
      }

      setBookings(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();

    if (searchParams.get('payment') === 'success') {
      toast.success('Payment completed successfully!');
    }
  }, [loadBookings, searchParams]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully.');

      setBookings(prevBookings =>
        prevBookings.filter(b => (b.id || b._id) !== bookingId),
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-87.5 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">
          Loading your bookings...
        </p>
      </div>
    );
  }

  const visibleBookings = bookings.filter(booking => {
    const status = (
      booking.status ||
      booking.bookingStatus ||
      ''
    ).toUpperCase();
    return status !== 'CANCELLED' && status !== 'DECLINED';
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground">
            View active bookings and complete payments for confirmed services.
          </p>
        </div>
      </div>

      {visibleBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Bookings Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You haven&apos;t placed any active bookings yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleBookings.map(booking => {
            const id = booking.id || booking._id;
            const status = (
              booking.status ||
              booking.bookingStatus ||
              ''
            ).toUpperCase();

            const isPending = status === 'REQUESTED' || status === 'PENDING';
            const isAccepted = status === 'ACCEPTED' || status === 'CONFIRMED';
            const isCompleted = status === 'COMPLETED';
            const isPaid =
              status === 'PAID' ||
              booking.paymentStatus === 'PAID' ||
              isCompleted;

            const price =
              booking.service?.price ??
              booking.totalAmount ??
              booking.price ??
              booking.amount ??
              0;

            const dateValue = booking.timeSlot || booking.bookingDate;
            const formattedDate = dateValue
              ? new Date(dateValue).toLocaleDateString('en-US', {
                  dateStyle: 'medium',
                })
              : 'Scheduled';

            return (
              <Card
                key={id}
                className="border shadow-sm flex flex-col justify-between"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-semibold">
                      {booking.service?.title ||
                        booking.serviceName ||
                        'Requested Service'}
                    </CardTitle>

                    {isPending && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-600 border-amber-300"
                      >
                        Pending Acceptance
                      </Badge>
                    )}
                    {isAccepted && !isPaid && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-300"
                      >
                        Accepted
                      </Badge>
                    )}
                    {isPaid && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-600 border-blue-300"
                      >
                        Paid
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 text-xs text-muted-foreground py-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-foreground" />
                    <span>Date: {formattedDate}</span>
                  </div>
                  <div className="pt-2 font-bold text-sm text-primary">
                    Amount: ${price}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t flex flex-col gap-2">
                  {isPending && (
                    <div className="w-full space-y-2 text-center">
                      <p className="text-xs text-amber-600 italic">
                        Waiting for technician approval...
                      </p>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5 h-8 text-xs cursor-pointer"
                            disabled={cancellingId === id}
                          >
                            {cancellingId === id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            Cancel Request
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to cancel?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently cancel your booking request for{' '}
                              <strong>
                                {booking.service?.title ||
                                  booking.serviceName ||
                                  'this service'}
                              </strong>
                              .
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Keep Booking
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                              onClick={() => handleCancelBooking(id)}
                            >
                              Yes, Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {/* AcceptedState */}
                  {isAccepted && !isPaid && (
                    <Button
                      size="sm"
                      className="w-full bg-primary text-white gap-2 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/dashboard/customer-dashboard/checkout/${id}`,
                        )
                      }
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Now
                    </Button>
                  )}

                  {/* PaidState */}
                  {isPaid && (
                    <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs w-full font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Payment Completed
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
