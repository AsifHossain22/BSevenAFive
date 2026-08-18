'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* FailedIcon */}
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
          <XCircle className="w-12 h-12" />
        </div>

        {/* TitleAndDescription */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Unsuccessful
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            The transaction was cancelled or failed to process. Don't worry—your
            booking remains active under{' '}
            <span className="font-semibold text-blue-600">ACCEPTED</span> status
            so you can try again.
          </p>
        </div>

        {/* InfoBox */}
        <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-xl text-left flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-normal">
            If your card was charged, please wait a few minutes or contact
            support with your booking details.
          </p>
        </div>

        {/* NavigationActions */}
        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard/customer-dashboard/bookings"
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Return to Bookings & Retry</span>
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
