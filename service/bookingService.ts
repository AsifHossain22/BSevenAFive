/* eslint-disable @typescript-eslint/no-explicit-any */
'server-only';

import { cookies } from 'next/headers';

export interface IBooking {
  id: string;
  bookingDate?: string;
  createdAt?: string;
  status: string;
  totalAmount?: number;
  price?: number;
  amount?: number;
  customer?: { name?: string; email?: string };
  user?: { name?: string; email?: string };
  customerName?: string;
  technician?: { name?: string; email?: string };
  technicianName?: string;
  serviceCategory?: { name?: string; categoryName?: string };
  service?: { title?: string; name?: string };
  serviceTitle?: string;
}

const BACKEND_URL = `${process.env.BACKEND_API_URL}`.replace(/\/$/, '');

export async function getAllBookings(): Promise<IBooking[]> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('accessToken')?.value || cookieStore.get('token')?.value;

    const res = await fetch(`${BACKEND_URL}/api/admin/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
          Cookie: `accessToken=${token}`,
        }),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch bookings: ${res.statusText}`);
    }

    const resData = await res.json();
    let rawList: any[] = [];

    if (Array.isArray(resData)) {
      rawList = resData;
    } else if (Array.isArray(resData?.data)) {
      rawList = resData.data;
    } else if (Array.isArray(resData?.result)) {
      rawList = resData.result;
    } else if (Array.isArray(resData?.data?.result)) {
      rawList = resData.data.result;
    }

    return rawList;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}
