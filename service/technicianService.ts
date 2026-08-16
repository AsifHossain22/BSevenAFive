/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BACKEND_URL = `${process.env.BACKEND_API_URL}`.replace(/\/$/, '');

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const rawToken =
    cookieStore.get('accessToken')?.value ||
    cookieStore.get('token')?.value ||
    '';

  const authHeader = rawToken.startsWith('Bearer ')
    ? rawToken
    : rawToken
      ? `Bearer ${rawToken}`
      : '';

  const cleanToken = rawToken.replace(/^Bearer\s+/i, '');

  return {
    'Content-Type': 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...(cleanToken
      ? { Cookie: `accessToken=${cleanToken}; token=${cleanToken}` }
      : {}),
  };
}

// GetTechnicianBookings
export async function getTechnicianBookings() {
  try {
    const headers = await getAuthHeaders();
    let res = await fetch(`${BACKEND_URL}/api/technician/bookings`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      res = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
    }

    if (!res.ok) {
      console.error('Fetch bookings failed. Status:', res.status);
      return [];
    }

    const resData = await res.json();

    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.result)) return resData.data.result;
    if (Array.isArray(resData?.bookings)) return resData.bookings;
    if (Array.isArray(resData?.result)) return resData.result;

    return [];
  } catch (error) {
    console.error('Error fetching technician bookings:', error);
    return [];
  }
}

// UpdateBookingStatus [Accept | Decline | Start | Complete]
export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const headers = await getAuthHeaders();

    let res = await fetch(
      `${BACKEND_URL}/api/technician/bookings/${bookingId}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      },
    );

    if (!res.ok) {
      res = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
    }

    if (!res.ok) {
      res = await fetch(
        `${BACKEND_URL}/api/bookings/${bookingId}/${status.toLowerCase()}`,
        {
          method: 'PATCH',
          headers,
        },
      );
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to update status to ${status}`);
    }

    // RevalidateCustomerAndTechnicianRoutes
    revalidatePath('/dashboard/technician-dashboard');
    revalidatePath('/dashboard/technician-dashboard/bookings');
    revalidatePath('/dashboard/customer-dashboard/bookings');

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
