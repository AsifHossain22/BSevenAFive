/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BACKEND_URL = `${process.env.BACKEND_API_URL}`.replace(/\/$/, '');

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('accessToken')?.value || cookieStore.get('token')?.value;

  return {
    'Content-Type': 'application/json',
    ...(token && {
      Authorization: `Bearer ${token}`,
      Cookie: `accessToken=${token}`,
    }),
  };
}

// GetAllServices
export async function getAllServices(query?: {
  category?: string;
  search?: string;
}) {
  try {
    const searchParams = new URLSearchParams();
    if (query?.category) searchParams.append('category', query.category);
    if (query?.search) searchParams.append('search', query.search);

    const res = await fetch(
      `${BACKEND_URL}/api/services?${searchParams.toString()}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const fallbackRes = await fetch(
        `${BACKEND_URL}/api/technician/services`,
        {
          cache: 'no-store',
        },
      );
      if (!fallbackRes.ok) return [];
      const fallbackData = await fallbackRes.json();
      return (
        fallbackData.data || (Array.isArray(fallbackData) ? fallbackData : [])
      );
    }

    const resData = await res.json();
    return resData.data || (Array.isArray(resData) ? resData : []);
  } catch (error) {
    console.error('Error fetching public services:', error);
    return [];
  }
}

// GetSingleServiceDetailsByID
export async function getServiceById(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/services/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const fallbackRes = await fetch(
        `${BACKEND_URL}/api/technician/services/${id}`,
        {
          cache: 'no-store',
        },
      );

      if (!fallbackRes.ok) return null;
      const fallbackData = await fallbackRes.json();
      return fallbackData.data || fallbackData;
    }

    const resData = await res.json();
    return resData.data || resData;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    return null;
  }
}

// GetCustomerBookings
export async function getCustomerBookings() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/bookings/my-bookings`, {
      method: 'GET',
      headers,
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const resData = await res.json();

    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.bookings)) return resData.data.bookings;
    if (Array.isArray(resData?.bookings)) return resData.bookings;
    if (Array.isArray(resData?.result)) return resData.result;

    return [];
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return [];
  }
}

// CreateBooking
export async function createBooking(payload: {
  serviceId: string;
  technicianId?: string;
  bookingDate: string;
  timeSlot: string;
  address: string;
  notes?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to place booking request.');
    }

    revalidatePath('/dashboard/customer-dashboard/bookings');
    return data;
  } catch (error: any) {
    console.error('Error creating booking:', error);
    throw new Error(error.message || 'Server error creating booking.');
  }
}

// CancelBooking
export async function cancelBooking(bookingId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to cancel booking.');
    }

    revalidatePath('/dashboard/customer-dashboard/bookings');
    return data;
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    throw new Error(error.message || 'Server error cancelling booking.');
  }
}

// InitiateStripePayment
export async function initiatePayment(bookingId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${BACKEND_URL}/api/payments/initiate/${bookingId}`,
      {
        method: 'POST',
        headers,
      },
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to initiate payment gateway.');
    }

    return data;
  } catch (error: any) {
    console.error('Error initiating payment:', error);
    throw new Error(error.message || 'Payment initiation failed.');
  }
}

// SubmitServiceReview
export async function submitReview(payload: {
  bookingId: string;
  rating: number;
  comment: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit review.');
    }

    revalidatePath('/dashboard/customer-dashboard/reviews');
    return data;
  } catch (error: any) {
    console.error('Error submitting review:', error);
    throw new Error(error.message || 'Server error submitting review.');
  }
}

// GetCustomerDashboardSummary
export async function getCustomerDashboardSummary() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/bookings/my-bookings/stats`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      const bookings = await getCustomerBookings();

      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(
        (b: any) =>
          b.status === 'PENDING' ||
          b.status === 'ACCEPTED' ||
          b.status === 'IN_PROGRESS',
      ).length;
      const completedBookings = bookings.filter(
        (b: any) => b.status === 'COMPLETED',
      ).length;
      const totalSpent = bookings
        .filter(
          (b: any) => b.paymentStatus === 'PAID' || b.status === 'COMPLETED',
        )
        .reduce(
          (sum: number, b: any) =>
            sum + Number(b.totalAmount || b.price || b.amount || 0),
          0,
        );

      return {
        totalBookings,
        activeBookings,
        completedBookings,
        totalSpent,
        recentBookings: bookings.slice(0, 5),
      };
    }

    const resData = await res.json();
    return resData.data || resData;
  } catch (error) {
    console.error('Error fetching customer summary:', error);
    return {
      totalBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
      totalSpent: 0,
      recentBookings: [],
    };
  }
}

export async function getAllTechnicians() {
  const res = await fetch(`${BACKEND_URL}/api/technicians`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return res.json();
}
