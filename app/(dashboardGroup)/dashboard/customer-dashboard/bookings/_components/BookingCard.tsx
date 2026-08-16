import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock3,
  User,
} from 'lucide-react';

export interface Booking {
  id: string;
  service: {
    title: string;
    price: number;
    category?: { categoryName: string };
  };
  timeSlot: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  address?: string;
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

const BACKEND_URL = process.env.BACKEND_API_URL;

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
}) => {
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

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
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

        {booking.status === 'REQUESTED' && onCancel && (
          <button className="btn-cancel" onClick={() => onCancel(booking.id)}>
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};
