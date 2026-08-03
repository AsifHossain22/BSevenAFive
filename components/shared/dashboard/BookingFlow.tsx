/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBooking } from '@/service/customerService';
import { useRouter } from 'next/navigation';

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

export default function BookingFlow({
  service,
}: {
  service: { id: string; title: string; price: number };
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !selectedDate) {
      toast.error('Please select both date and time slot.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating booking request...');

    try {
      await createBooking({
        serviceId: service.id,
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        address,
        notes,
      });

      toast.success('Booking request placed successfully!', { id: toastId });
      router.push('/dashboard/customer-dashboard/bookings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place booking.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Book {service.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Price:{' '}
            <span className="font-bold text-primary">${service.price}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SelectDate */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Select Preferred
              Date
            </label>
            <Input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setSelectedDate(e.target.value)}
              required
            />
          </div>

          {/* TimeSlotPicker */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Select Time Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                    selectedSlot === slot
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* AddressAndInstructions */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Service Location
            </label>
            <Input
              placeholder="House/Apartment #, Road, Area, City"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Special Instructions (Optional)
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. Please bring a tall ladder or specific spare parts..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Confirm Booking Request
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
