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

// GetTechnicianBookings
export async function getTechnicianBookings() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/technician/bookings`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      const fallbackRes = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      if (!fallbackRes.ok) return [];
      const fallbackData = await fallbackRes.json();
      return (
        fallbackData.data || (Array.isArray(fallbackData) ? fallbackData : [])
      );
    }

    const resData = await res.json();
    return resData.data || (Array.isArray(resData) ? resData : []);
  } catch (error) {
    console.error('Error fetching technician bookings:', error);
    return [];
  }
}

// UpdateBookingStatus [Accept | Decline | Start | Complete]
export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${BACKEND_URL}/api/technician/bookings/${bookingId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      },
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update status');
    }

    revalidatePath('/dashboard/technician-dashboard');
    revalidatePath('/dashboard/technician-dashboard/bookings');

    return data;
  } catch (error: any) {
    console.error('Error updating status:', error);
    throw new Error(error.message || 'Server error updating status.');
  }
}

// TechnicianProfileDetails
export async function getTechnicianProfile() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/technician/profile`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const resData = await res.json();
    return resData.data || resData;
  } catch (error) {
    console.error('Error fetching technician profile:', error);
    return null;
  }
}

// UpdateTechnicianProfileAndServices
export async function updateTechnicianProfile(payload: {
  skills?: string;
  experienceYears?: number;
  hourlyRate?: number;
  bio?: string;
  avatarUrl?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/technician/profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update technician profile.');
    }

    revalidatePath('/dashboard/technician-dashboard/profile');
    return data;
  } catch (error: any) {
    console.error('Error updating technician profile:', error);
    throw new Error(error.message || 'Server error updating profile.');
  }
}

// AvailabilitySchedule
export async function getTechnicianAvailability() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/technician/availability`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const resData = await res.json();
    return resData.data || resData;
  } catch (error) {
    console.error('Error fetching technician availability:', error);
    return null;
  }
}

// UpdateAvailability
export async function updateTechnicianAvailability(
  schedule: Record<string, string[]>,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/api/technician/availability`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ schedule }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || 'Failed to update availability schedule.',
      );
    }

    revalidatePath('/dashboard/technician-dashboard/availability');
    return data;
  } catch (error: any) {
    console.error('Error updating availability schedule:', error);
    throw new Error(
      error.message || 'Server error updating availability schedule.',
    );
  }
}
