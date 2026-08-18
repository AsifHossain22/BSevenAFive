'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const handleTryAgain = () => {
    router.replace('/dashboard/customer-dashboard/bookings');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* FailedIcon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-9 h-9 text-destructive" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-sm text-muted-foreground">
            Your Stripe payment was cancelled. No payment was completed.
          </p>
        </div>

        {/* BookingInfo */}
        {bookingId && (
          <p className="text-xs text-muted-foreground">
            Booking ID: {bookingId}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleTryAgain}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Return to My Bookings
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentFailedLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading payment details...</span>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<PaymentFailedLoading />}>
      <PaymentFailedContent />
    </Suspense>
  );
}
