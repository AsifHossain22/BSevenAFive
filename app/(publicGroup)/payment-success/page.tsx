'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const txnId = searchParams.get('txnId');

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.replace('/dashboard/customer-dashboard/bookings');
    }, 1500);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* SuccessIcon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Your payment has been received successfully.
          </p>
        </div>

        {/* TransactionInfo */}
        {(bookingId || txnId) && (
          <div className="space-y-1">
            {bookingId && (
              <p className="text-xs text-muted-foreground">
                Booking ID: {bookingId}
              </p>
            )}

            {txnId && (
              <p className="text-xs text-muted-foreground">
                Transaction ID: {txnId}
              </p>
            )}
          </div>
        )}

        {/* Redirect */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to your bookings...</span>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccessFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Confirming your payment...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
