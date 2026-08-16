'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Clock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { getServiceById, createBooking } from '@/service/customerService';
import { IGenericApiResponse, IService } from '@/lib/types';

interface BookingPageProps {
  params: Promise<{ serviceId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.serviceId;
  const router = useRouter();

  const [service, setService] = useState<IService | null>(null);
  const [loadingService, setLoadingService] = useState<boolean>(true);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    async function loadService() {
      if (!serviceId) return;
      try {
        setLoadingService(true);
        const res: IGenericApiResponse<IService> | IService =
          await getServiceById(serviceId);

        if ('data' in res && res.data) {
          setService(res.data);
        } else {
          setService(res as IService);
        }
      } catch (err) {
        console.error('Failed to load service:', err);
      } finally {
        setLoadingService(false);
      }
    }
    loadService();
  }, [serviceId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedDate || !selectedTime) {
      setErrorMsg('Please select both a preferred date and time slot.');
      return;
    }

    try {
      setIsSubmitting(true);

      const combinedDateTime = new Date(
        `${selectedDate}T${selectedTime}:00`,
      ).toISOString();

      const payload = {
        serviceId,
        timeSlot: combinedDateTime,
        bookingDate: selectedDate,
        address: address.trim() || 'Service Location',
        technicianId: service?.technicianId || undefined,
        notes: notes.trim() || undefined,
      };

      await createBooking(payload);

      setSuccessMsg(
        'Booking successfully scheduled! Redirecting to your dashboard...',
      );

      setTimeout(() => {
        router.push('/dashboard/customer-dashboard/bookings');
      }, 1500);
    } catch (err: unknown) {
      console.error('Booking Error:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to place booking. Please check your authentication.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingService) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Preparing booking details...
        </p>
      </div>
    );
  }

  const categoryName = service?.category?.name || 'General';

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link
        href={`/services/${serviceId}`}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Service Details
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Confirm Your Booking
        </h1>
        <p className="text-sm text-muted-foreground">
          Select your schedule slot and provide service details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Schedule & Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="booking-form"
              onSubmit={handleBookingSubmit}
              className="space-y-5"
            >
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium flex items-start gap-2 border border-destructive/20">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-start gap-2 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-semibold">
                  Service Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-xs font-semibold">
                  Preferred Time Slot
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map(
                    time => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-xs gap-1 cursor-pointer"
                      >
                        <Clock className="w-3 h-3" /> {time}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-semibold">
                  Service Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Street, City, House / Apartment No."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs font-semibold">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Describe specific issues or special requests..."
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  You can manage or cancel your request from your customer
                  dashboard.
                </span>
              </div>
            </form>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              form="booking-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting
                  Request...
                </>
              ) : (
                'Confirm & Request Booking'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-fit">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-bold">Service Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <Badge variant="secondary">{categoryName}</Badge>
            <h3 className="text-base font-bold text-foreground">
              {service?.title || 'Selected Service'}
            </h3>
            <p className="text-muted-foreground line-clamp-2">
              {service?.description}
            </p>

            <div className="pt-3 border-t flex justify-between items-baseline">
              <span className="text-muted-foreground">Price:</span>
              <span className="text-xl font-extrabold text-primary">
                ${service?.price || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
