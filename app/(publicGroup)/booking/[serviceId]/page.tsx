/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { getServiceById, createBooking } from '@/service/customerService';

interface BookingPageProps {
  params: Promise<{ serviceId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.serviceId;

  const router = useRouter();

  // ServiceDetailsState
  const [service, setService] = useState<any>(null);
  const [loadingService, setLoadingService] = useState(true);

  // FormState
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [address, setAddress] = useState(''); // Added Address State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // SetDefaultDateToTomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // FetchServiceDetails
  useEffect(() => {
    async function loadService() {
      if (!serviceId) return;
      try {
        setLoadingService(true);
        const data = await getServiceById(serviceId);
        setService(data);
      } catch (err) {
        console.error('Failed to load service:', err);
      } finally {
        setLoadingService(false);
      }
    }
    loadService();
  }, [serviceId]);

  // HandleFormSubmission
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

      // CombineDateAndTimeIntoISOFormat
      const isoSlot = new Date(
        `${selectedDate}T${selectedTime}:00.000Z`,
      ).toISOString();

      const payload = {
        serviceId: serviceId,
        bookingDate: selectedDate,
        timeSlot: isoSlot,
        address: address || 'Customer Address Default', // PassUserAddress
      };

      await createBooking(payload);

      setSuccessMsg(
        'Booking created successfully! Redirecting to dashboard...',
      );

      setTimeout(() => {
        router.push('/dashboard/customer-dashboard/bookings');
      }, 1500);
    } catch (err: any) {
      console.error('Booking Error:', err);
      setErrorMsg(
        err?.message ||
          'Failed to place booking. Please make sure you are logged in.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (data: any): string => {
    if (!data) return 'General';
    if (typeof data.category === 'object' && data.category !== null) {
      return data.category.categoryName || data.category.name || 'General';
    }
    return typeof data.category === 'string' ? data.category : 'General';
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

  const title = service
    ? typeof service.title === 'string'
      ? service.title
      : service.name || 'Service Booking'
    : 'Service Booking';

  const price = service
    ? service.price || service.hourlyRate || service.amount || 0
    : 0;
  const categoryLabel = getCategoryName(service);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* BackButton */}
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
          Select your preferred schedule slot to book this service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BookingForm */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="booking-form"
              onSubmit={handleBookingSubmit}
              className="space-y-5"
            >
              {/* ErrorAlert */}
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium flex items-start gap-2 border border-destructive/20">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SuccessAlert */}
              {successMsg && (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-start gap-2 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ServiceAddressInput */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-semibold">
                  Service Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your street address / location"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* DateInput */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-semibold">
                  Service Date
                </Label>
                <div className="relative">
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
              </div>

              {/* TimeInput */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-xs font-semibold">
                  Preferred Time
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

              <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>
                  You can reschedule or cancel before technician dispatch.
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                  Booking...
                </>
              ) : (
                'Confirm & Request Booking'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* SelectedServiceDetails */}
        <Card className="h-fit">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-bold">Service Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <Badge variant="secondary">{categoryLabel}</Badge>
            <h3 className="text-base font-bold text-foreground">{title}</h3>

            <div className="pt-3 border-t flex justify-between items-baseline">
              <span className="text-muted-foreground">Estimated Cost:</span>
              <span className="text-xl font-extrabold text-primary">
                ${price}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
