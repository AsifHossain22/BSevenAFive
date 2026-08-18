'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock3,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
} from 'lucide-react';

import { initiatePayment } from '@/service/customerService';

export interface Booking {
  id: string;
  service: {
    title: string;
    price: number;
    category?: {
      categoryName?: string;
      name?: string;
    };
  };
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  timeSlot: string;
  status:
    | 'REQUESTED'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'DECLINED'
    | 'PAID'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
  address?: string;
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
  role?: 'CUSTOMER' | 'TECHNICIAN';

  onCancel?: (id: string) => void;
  onAccept?: (id: string) => Promise<void> | void;
  onReject?: (id: string) => Promise<void> | void;
  onComplete?: (id: string) => Promise<void> | void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  role = 'CUSTOMER',
  onCancel,
  onAccept,
  onReject,
  onComplete,
}) => {
  const [loading, setLoading] = useState(false);

  const formattedDate = new Date(booking.timeSlot).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(booking.timeSlot).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // StripePayment
  const handlePayNow = async () => {
    try {
      setLoading(true);

      const result = await initiatePayment(booking.id);

      const paymentUrl = result?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error(
          result?.message || 'Stripe payment URL was not returned.',
        );
      }

      // RedirectCustomerToStripe
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment initialization error:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to initialize Stripe payment.',
      );
      setLoading(false);
    }
  };

  // BookingAction
  const handleAction = async (
    actionFn?: (id: string) => Promise<void> | void,
  ) => {
    if (!actionFn) {
      return;
    }

    try {
      setLoading(true);

      await actionFn(booking.id);
    } catch (error) {
      console.error('Action error:', error);
    } finally {
      setLoading(false);
    }
  };

  // StatusBadge
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'PAID':
      case 'CONFIRMED':
        return (
          <span className="badge badge-paid">
            <CheckCircle2 size={14} />

            {status === 'PAID' ? 'Paid' : 'Confirmed'}
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-accepted">
            <CheckCircle size={14} />
            Accepted
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="badge badge-pending">
            <Clock3 size={14} />
            Pending
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-accepted">
            <Clock3 size={14} />
            In Progress
          </span>
        );

      case 'COMPLETED':
        return (
          <span className="badge badge-completed">
            <CheckCircle2 size={14} />
            Completed
          </span>
        );
      case 'REJECTED':
      case 'DECLINED':
      case 'CANCELLED':
        return (
          <span className="badge badge-cancelled">
            <AlertCircle size={14} />

            {status === 'REJECTED' || status === 'DECLINED'
              ? 'Rejected'
              : 'Cancelled'}
          </span>
        );

      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="booking-card">
      {/* Header */}
      <div className="booking-card-header">
        <div>
          <span className="booking-category">
            {booking.service.category?.categoryName ||
              booking.service.category?.name ||
              'Service'}
          </span>
          <h3 className="booking-title">{booking.service.title}</h3>
        </div>

        {getStatusBadge(booking.status)}
      </div>

      {/* Body */}
      <div className="booking-card-body">
        {role === 'TECHNICIAN' && booking.customer?.name && (
          <div className="info-row">
            <User size={16} />
            <span>Customer: {booking.customer.name}</span>
          </div>
        )}

        <div className="info-row">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>

        <div className="info-row">
          <Clock size={16} />
          <span>{formattedTime}</span>
        </div>

        {booking.address && (
          <div className="info-row">
            <MapPin size={16} />
            <span>{booking.address}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="booking-card-footer">
        <div className="price-tag">
          <span className="price-label">Total Amount:</span>

          <span className="price-value">${booking.service.price}</span>
        </div>

        {/* Actions */}
        <div
          className="card-actions"
          style={{
            display: 'flex',
            gap: '8px',
          }}
        >
          {/* Customer */}
          {role === 'CUSTOMER' && (
            <>
              {/* PayNow */}
              {booking.status === 'ACCEPTED' && (
                <button
                  type="button"
                  className="btn-pay"
                  onClick={handlePayNow}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <CreditCard size={16} />
                  )}

                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              )}

              {/* Cancel */}
              {booking.status === 'REQUESTED' && onCancel && (
                <button
                  type="button"
                  className="btn-cancel cursor-pointer"
                  onClick={() => handleAction(onCancel)}
                  disabled={loading}
                >
                  Cancel Booking
                </button>
              )}
            </>
          )}

          {/* Technician */}
          {role === 'TECHNICIAN' && (
            <>
              {/* AcceptOrReject */}
              {booking.status === 'REQUESTED' && (
                <>
                  {onAccept && (
                    <button
                      type="button"
                      className="btn-accept"
                      onClick={() => handleAction(onAccept)}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--color-success, #16a34a)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Accept
                    </button>
                  )}

                  {onReject && (
                    <button
                      type="button"
                      className="btn-reject"
                      onClick={() => handleAction(onReject)}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--color-danger, #dc2626)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  )}
                </>
              )}

              {/* Complete */}
              {(booking.status === 'CONFIRMED' ||
                booking.status === 'PAID' ||
                booking.status === 'IN_PROGRESS') &&
                onComplete && (
                  <button
                    type="button"
                    className="btn-complete"
                    onClick={() => handleAction(onComplete)}
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--color-primary, #2563eb)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Mark Completed
                  </button>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
