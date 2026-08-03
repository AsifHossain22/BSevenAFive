/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED' | string;
  createdAt?: string;
}

// BackendUrl
const BACKEND_URL = `${process.env.BACKEND_API_URL}`.replace(/\/$/, '');

// GetAllUsers
export async function getAllUsers(): Promise<IUser[]> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('accessToken')?.value || cookieStore.get('token')?.value;

    const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
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
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// UpdateUserStatus [Active | Banned]
export async function updateUserStatus(
  userId: string,
  newStatus: 'ACTIVE' | 'BANNED',
) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('accessToken')?.value || cookieStore.get('token')?.value;

    const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
          Cookie: `accessToken=${token}`,
        }),
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to update user status');
    }

    return data;
  } catch (error: any) {
    console.error('Error updating status:', error);
    throw new Error(error.message || 'Server error while updating status.');
  }
}
