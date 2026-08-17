'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ArrowRight,
  Calendar,
  Receipt,
  Loader2,
} from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <div className="text-gray-500 text-sm">
            Loading payment details...
          </div>
        </div>
      }
    >
      <PaymentSuccessCard />
    </Suspense>
  );
}

function PaymentSuccessCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get('txnId');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/customer-dashboard/bookings');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* CheckIcon */}
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50/50">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* TitleAndDescription */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Thank you for your payment. Your booking has been confirmed and
            updated to{' '}
            <span className="font-semibold text-green-700">PAID</span>.
          </p>
        </div>

        {/* TransactionReference */}
        {txnId && (
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-left flex items-start gap-3">
            <Receipt className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                Transaction Reference -
              </p>
              <p className="text-sm font-mono font-medium text-gray-800 truncate">
                {txnId}
              </p>
            </div>
          </div>
        )}

        {/* RedirectNotice */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Redirecting to your dashboard in {countdown} seconds...</span>
        </div>

        {/* NavigationActions */}
        <div className="pt-2">
          <Link
            href="/dashboard/customer-dashboard/bookings"
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all duration-200"
          >
            <Calendar className="w-4 h-4" />
            <span>Go to My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
