/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
}

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

const mapCategory = (category: any): ICategory => ({
  id: String(category?.id || category?._id || ''),
  name: category?.categoryName || category?.name || '',
  description: category?.categoryDescription || category?.description || '',
  icon: category?.icon || '',
  createdAt: category?.createdAt || '',
});

// GetAllCategories
export async function getAllCategories(): Promise<ICategory[]> {
  try {
    const headers = await getAuthHeaders();

    let res = await fetch(`${BACKEND_URL}/api/categories`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      res = await fetch(`${BACKEND_URL}/api/admin/categories`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
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

    return rawList.map(mapCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// CreateCategory
export async function createCategory(payload: {
  name: string;
  description?: string;
  icon?: string;
}) {
  try {
    const headers = await getAuthHeaders();

    const backendPayload = {
      categoryName: payload.name,
      categoryDescription: payload.description || '',
      name: payload.name,
      description: payload.description || '',
      icon: payload.icon || 'default-icon',
    };

    const res = await fetch(`${BACKEND_URL}/api/admin/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(backendPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message ||
          data.errorSources?.[0]?.message ||
          'Failed to create category',
      );
    }

    revalidatePath('/dashboard/admin-dashboard/categories');

    const rawCategory = data.data || data;
    return {
      success: true,
      data: mapCategory(rawCategory),
    };
  } catch (error: any) {
    console.error('Error creating category:', error);
    throw new Error(error.message || 'Server error while creating category.');
  }
}

// DeleteCategory
export async function deleteCategory(id: string) {
  try {
    const headers = await getAuthHeaders();

    let res = await fetch(`${BACKEND_URL}/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (res.status === 404) {
      res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers,
      });
    }

    if (res.status === 404) {
      res = await fetch(`${BACKEND_URL}/api/categories/delete/${id}`, {
        method: 'DELETE',
        headers,
      });
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete category');
    }

    revalidatePath('/dashboard/admin-dashboard/categories');

    return data;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    throw new Error(error.message || 'Server error while deleting category.');
  }
}
