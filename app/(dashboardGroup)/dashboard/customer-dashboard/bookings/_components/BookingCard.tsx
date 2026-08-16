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
} from 'lucide-react';

export interface Booking {
  id: string;
  service: {
    title: string;
    price: number;
    category?: { categoryName: string };
  };
  timeSlot: string;
  status:
    | 'REQUESTED'
    | 'ACCEPTED'
    | 'PAID'
    | 'CONFIRMED'
    | 'COMPLETED'
    | 'CANCELLED';
  address?: string;
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
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

  const handlePayNow = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = `${process.env.BACKEND_API_URL}`.replace(/\/$/, '');

      const res = await fetch(`${BACKEND_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();

      if (data?.success && data?.data?.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      } else {
        alert(data?.message || 'Failed to initialize payment session.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('An error occurred while redirecting to Stripe payment.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="badge badge-paid">
            <CheckCircle2 size={14} /> Paid
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-accepted">
            <CreditCard size={14} /> Accepted
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge badge-confirmed">
            <CheckCircle size={14} /> Confirmed
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="badge badge-pending">
            <Clock3 size={14} /> Pending
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-cancelled">
            <AlertCircle size={14} /> Cancelled
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div>
          <span className="booking-category">
            {booking.service.category?.categoryName || 'Service'}
          </span>
          <h3 className="booking-title">{booking.service.title}</h3>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      <div className="booking-card-body">
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

      <div className="booking-card-footer">
        <div className="price-tag">
          <span className="price-label">Total Amount:</span>
          <span className="price-value">${booking.service.price}</span>
        </div>

        {/* ActionButtons */}
        <div className="card-actions" style={{ display: 'flex', gap: '8px' }}>
          {booking.status === 'ACCEPTED' && (
            <button
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

          {booking.status === 'REQUESTED' && onCancel && (
            <button className="btn-cancel" onClick={() => onCancel(booking.id)}>
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
