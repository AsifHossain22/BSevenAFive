/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getTechnicianAvailability,
  updateTechnicianAvailability,
} from '@/service/technicianService';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export default function TechnicianAvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [schedule, setSchedule] = useState<Record<string, string[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);
        const data = await getTechnicianAvailability();
        if (data?.schedule || data) {
          setSchedule(prev => ({ ...prev, ...(data.schedule || data) }));
        }
      } catch (err) {
        toast.error('Failed to load current availability schedule.');
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, []);

  const toggleSlot = (slot: string) => {
    const currentSlots = schedule[selectedDay] || [];
    const isSelected = currentSlots.includes(slot);

    const updatedSlots = isSelected
      ? currentSlots.filter(s => s !== slot)
      : [...currentSlots, slot];

    setSchedule({
      ...schedule,
      [selectedDay]: updatedSlots,
    });
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving availability schedule...');

    try {
      await updateTechnicianAvailability(schedule);
      toast.success('Availability schedule saved successfully!', {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err.message || 'Could not save schedule.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading availability
        calendar...
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Availability Scheduler
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure working hours and available time slots for customer
            bookings.
          </p>
        </div>
        <Button
          onClick={handleSaveSchedule}
          disabled={isSaving}
          className="flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Schedule
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* DaySelection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Select Day
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {DAYS_OF_WEEK.map(day => {
              const activeCount = (schedule[day] || []).length;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 font-bold text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <span>{day}</span>
                  <Badge variant={activeCount > 0 ? 'default' : 'secondary'}>
                    {activeCount > 0 ? `${activeCount} slots` : 'Off'}
                  </Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* SlotSelectionGrid */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Time Slots for{' '}
              {selectedDay}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click time slots to enable or disable them for customer bookings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIME_SLOTS.map(slot => {
                const isSelected = (schedule[selectedDay] || []).includes(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={`p-4 rounded-xl border text-center font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 font-semibold shadow-xs'
                        : 'border-dashed border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    {slot}
                    <p className="text-xs mt-1 font-normal">
                      {isSelected ? '✓ Available' : '✕ Unavailable'}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
