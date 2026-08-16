/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Clock, Calendar, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  getTechnicianBookings,
  updateBookingStatus,
} from '@/service/technicianService';

export default function TechnicianBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await getTechnicianBookings();

      let list: any[] = [];
      if (Array.isArray(resData)) {
        list = resData;
      } else if (Array.isArray(resData?.data)) {
        list = resData.data;
      } else if (Array.isArray(resData?.bookings)) {
        list = resData.bookings;
      } else if (Array.isArray(resData?.result)) {
        list = resData.result;
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
    setActionLoadingId(id);
    const toastId = toast.loading(
      `Updating request to ${newStatus.toLowerCase()}...`,
    );

    try {
      await updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus.toLowerCase()} successfully!`, {
        id: toastId,
      });

      setRequests(prev =>
        prev.map(item =>
          item.id === id || item._id === id
            ? { ...item, status: newStatus }
            : item,
        ),
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update booking status.', {
        id: toastId,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-87.5 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">
          Loading service requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
        <p className="text-sm text-muted-foreground">
          Review pending customer service requests and accept or decline them.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Pending Requests</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You currently have no new service requests.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => {
            const id = req.id || req._id;
            const rawStatus = req.status || req.bookingStatus || '';
            const status = rawStatus.toUpperCase();

            const isPending = status === 'REQUESTED' || status === 'PENDING';
            const isAccepted = status === 'ACCEPTED';
            const isDeclined = status === 'DECLINED' || status === 'REJECTED';
            const isActionLoading = actionLoadingId === id;

            return (
              <Card
                key={id}
                className="border shadow-sm flex flex-col justify-between"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-semibold">
                      {req.service?.title ||
                        req.serviceName ||
                        req.serviceTitle ||
                        'Service Request'}
                    </CardTitle>

                    {isPending && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-600 border-amber-300"
                      >
                        Pending
                      </Badge>
                    )}
                    {isAccepted && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-300"
                      >
                        Accepted
                      </Badge>
                    )}
                    {isDeclined && (
                      <Badge
                        variant="outline"
                        className="bg-rose-500/10 text-rose-600 border-rose-300"
                      >
                        Declined
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 text-xs text-muted-foreground py-2">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-foreground" />
                    <span>
                      Customer:{' '}
                      {req.user?.name ||
                        req.customerName ||
                        req.userName ||
                        'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-foreground" />
                    <span>
                      Date:{' '}
                      {req.bookingDate
                        ? new Date(req.bookingDate).toLocaleDateString()
                        : req.timeSlot
                          ? new Date(req.timeSlot).toLocaleDateString()
                          : 'N/A'}
                    </span>
                  </div>
                  {(req.address || req.user?.address) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-foreground" />
                      <span>Address: {req.address || req.user?.address}</span>
                    </div>
                  )}
                  <div className="pt-2 font-bold text-sm text-primary">
                    Payout: ${req.totalAmount || req.price || req.amount || 0}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t flex gap-2">
                  {isPending ? (
                    <>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1 cursor-pointer"
                        disabled={isActionLoading}
                        onClick={() => handleStatusChange(id, 'ACCEPTED')}
                      >
                        {isActionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Accept Request
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 gap-1 cursor-pointer"
                        disabled={isActionLoading}
                        onClick={() => handleStatusChange(id, 'DECLINED')}
                      >
                        {isActionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        Decline
                      </Button>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center w-full">
                      Status updated to {status}
                    </p>
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
