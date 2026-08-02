/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { IUserProfileResponse } from '@/lib/types';
import { cookies } from 'next/headers';

export const getUser = async (): Promise<IUserProfileResponse> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value || null;

    if (!accessToken) {
      return {
        success: false,
        message: 'User not logged in!',
      };
    }

    // FetchMyProfile
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      cache: 'no-store',
      next: {
        tags: ['my-profile'],
      },
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Failed to fetch profile`,
      };
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Error fetching user profile',
    };
  }
};
