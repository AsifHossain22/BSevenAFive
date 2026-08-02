/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthActionResult = {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
};

// LoginAction
export const loginAction = async (
  redirectTo: string | null,
  prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> => {
  const email = formData.get('email');
  const password = formData.get('password');

  const payload = {
    email,
    password,
  };

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result: AuthActionResult = await res.json();

    if (result.success && result.data?.accessToken) {
      const cookieStore = await cookies();

      // SetAccessTokenToCookie
      cookieStore.set('accessToken', result.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1d
        sameSite: 'lax',
        path: '/',
      });

      // SetRefreshTokenToCookie
      if (result.data.refreshToken) {
        cookieStore.set('refreshToken', result.data.refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7d
          sameSite: 'lax',
          path: '/',
        });
      }

      // DecodeJWTToken
      const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;
      const role = decodedToken?.role;

      if (role) {
        cookieStore.set('userRole', role, { path: '/' });
      }

      // ClearCachedUserProfile
      revalidateTag('my-profile', '');

      if (
        redirectTo &&
        typeof redirectTo === 'string' &&
        redirectTo.startsWith('/') &&
        !redirectTo.startsWith('//')
      ) {
        redirect(redirectTo);
      }

      // 2. RedirectToRoleBasedDashboards
      if (role === 'CUSTOMER') {
        redirect('/dashboard/customer');
      } else if (role === 'TECHNICIAN') {
        redirect('/dashboard/technician');
      } else if (role === 'ADMIN') {
        redirect('/dashboard/admin');
      } else {
        redirect('/dashboard');
      }
    }

    return result;
  } catch (error: any) {
    if (
      error?.message === 'NEXT_REDIRECT' ||
      error?.digest?.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      message: error?.message || 'Failed to authenticate with server',
    };
  }
};

// RegistrationAction
export const registerAction = async (
  prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> => {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role') || 'CUSTOMER';

  const payload = {
    name,
    email,
    password,
    role,
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const result: AuthActionResult = await res.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to connect to backend server',
    };
  }
};
