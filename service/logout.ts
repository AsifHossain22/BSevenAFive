'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const logout = async () => {
  const cookieStore = await cookies();

  // 1. DeleteAuthenticationAndRoleCookies
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');

  // 2. ClearCached
  revalidateTag('my-profile', 'max');
};
