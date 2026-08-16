/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Check,
  X,
  Clock,
  Calendar,
  User,
  MapPin,
  Wrench,
  DollarSign,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getTechnicianBookings,
  updateBookingStatus,
} from '@/service/technicianService';

export default function TechnicianBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);

  const [actionState, setActionState] = useState<{
    id: string;
    action: 'ACCEPTED' | 'DECLINED';
  } | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await getTechnicianBookings();

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

      setRequests(list);
    } catch (err: any) {
      toast.error(err.message || 'Could not fetch booking requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (
    id: string,
    newStatus: 'ACCEPTED' | 'DECLINED',
  ) => {
    setActionState({ id, action: newStatus });
    const toastId = toast.loading(
      `Updating request to ${newStatus.toLowerCase()}...`,
    );

    try {
      await updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus.toLowerCase()} successfully!`, {
        id: toastId,
      });

      setRequests(prev => {
        if (newStatus === 'DECLINED') {
          return prev.filter(item => (item.id || item._id) !== id);
        }

        return prev.map(item => {
          const itemId = item.id || item._id;
          if (itemId === id) {
            return {
              ...item,
              status: newStatus,
              bookingStatus: newStatus,
            };
          }
          return item;
        });
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status.', {
        id: toastId,
      });
    } finally {
      setActionState(null);
    }
  };

  const visibleRequests = requests.filter(req => {
    const rawStatus = req.status || req.bookingStatus || '';
    const status = rawStatus.toUpperCase();
    return (
      status !== 'DECLINED' && status !== 'REJECTED' && status !== 'CANCELLED'
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-87.5 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading service requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
        <p className="text-sm text-muted-foreground">
          Review job details, verify schedules and accept or decline incoming
          customer bookings.
        </p>
      </div>

      {visibleRequests.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No Service Requests</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You currently have no new or active job requests in your queue.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleRequests.map(req => {
            const id = req.id || req._id;
            const rawStatus = req.status || req.bookingStatus || '';
            const status = rawStatus.toUpperCase();

            const isPending = status === 'REQUESTED' || status === 'PENDING';
            const isAccepted =
              status === 'ACCEPTED' || status === 'IN_PROGRESS';
            const isCompleted = status === 'COMPLETED';

            const isAccepting =
              actionState?.id === id && actionState?.action === 'ACCEPTED';
            const isDeclining =
              actionState?.id === id && actionState?.action === 'DECLINED';
            const isAnyActionLoading = actionState?.id === id;

            const serviceTitle =
              req.service?.title ||
              req.serviceName ||
              req.serviceTitle ||
              req.serviceCategory?.categoryName ||
              'Home Maintenance Service';

            const customerName =
              req.user?.name ||
              req.customer?.name ||
              req.customerName ||
              req.userName ||
              'Client';

            const phone =
              req.user?.phone || req.customer?.phone || req.phone || 'N/A';

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
              req.address ||
              req.user?.address ||
              req.customer?.address ||
              'Service Location Provided on Acceptance';

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
                            Pending Request
                          </Badge>
                        )}
                        {isAccepted && (
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-300 font-medium"
                          >
                            {status === 'IN_PROGRESS'
                              ? 'In Progress'
                              : 'Accepted'}
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
                        Client:{' '}
                        <strong className="text-foreground">
                          {customerName}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>{phone}</span>
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

                  <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-end gap-3">
                    {isPending ? (
                      <>
                        {/* DeclineButton */}
                        <Button
                          size="default"
                          variant="outline"
                          className="w-full sm:w-auto border-destructive/40 text-destructive hover:bg-destructive/10 gap-2 cursor-pointer"
                          disabled={isAnyActionLoading}
                          onClick={() => handleStatusChange(id, 'DECLINED')}
                        >
                          {isDeclining ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Decline Request
                        </Button>

                        {/* AcceptButton */}
                        <Button
                          size="default"
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer"
                          disabled={isAnyActionLoading}
                          onClick={() => handleStatusChange(id, 'ACCEPTED')}
                        >
                          {isAccepting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Accept Request
                        </Button>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground italic text-right w-full">
                        Status is updated to{' '}
                        <strong className="uppercase">{status}</strong>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
