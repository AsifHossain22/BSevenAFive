'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    async function verify() {
      if (!bookingId) return;
      try {
        // Call your backend to confirm payment session status
        await fetch(`/api/payments/verify?bookingId=${bookingId}`, {
          method: 'POST',
        });
        toast.success('Payment verified successfully!');
      } catch (err) {
        toast.error('Payment succeeded, but verification failed.');
      } finally {
        setVerifying(false);
      }
    }
    verify();
  }, [bookingId]);

  return (
    <div className="min-h-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-6 space-y-4">
        {verifying ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Verifying your payment status...
            </p>
          </div>
        ) : (
          <CardContent className="space-y-4 pt-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold">Payment Successful!</h2>
            <p className="text-sm text-muted-foreground">
              Your service booking has been confirmed and paid. The technician
              will arrive as scheduled.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push('/dashboard/customer/bookings')}
            >
              Go to My Bookings
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
