import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

// UserRole
export type IUserRole = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';

// UserStatus
export type IUserActiveStatus = 'ACTIVE' | 'BLOCKED';

// BookingStatus
export type IBookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// PaymentStatus
export type IPaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Profile
export type IProfile = {
  id: string;
  profilePhoto: string | null;
  bio: string | null;
  skills?: string[];
  experienceYears?: number | null;
  hourlyRate?: number | null;
  location?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

// User
export type IUser = {
  id: string;
  name: string;
  email: string;
  role: IUserRole;
  activeStatus: IUserActiveStatus;
  profile?: IProfile | null;
  createdAt: string;
  updatedAt: string;
};

// ServiceCategory
export type IServiceCategory = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Service
export type IService = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  rating?: number;
  categoryId: string;
  category?: IServiceCategory;
  technicianId?: string;
  technician?: IUser;
  createdAt: string;
  updatedAt: string;
};

// Booking
export type IBooking = {
  id: string;
  customerId: string;
  customer?: IUser;
  technicianId: string;
  technician?: IUser;
  serviceId: string;
  service?: IService;
  status: IBookingStatus;
  bookingDate: string;
  slotTime: string;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Payment
export type IPayment = {
  id: string;
  bookingId: string;
  booking?: IBooking;
  amount: number;
  status: IPaymentStatus;
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

// Review
export type IReview = {
  id: string;
  bookingId: string;
  customerId: string;
  customer?: IUser;
  technicianId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

// AuthUserResponse
export type IAuthUserResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
};

// APIResponse
export type IGenericApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

// UserProfile
export type IUserProfileData = {
  id?: string;
  name?: string;
  email?: string;
  phone?: number;
  role?: IUserRole;
  activeStatus?: IUserActiveStatus;
  profile?: IProfile | null;
  address?: string;
};

// UserProfileResponse
export type IUserProfileResponse = {
  success: boolean;
  message?: string;
  data?: {
    profile?: IUserProfileData;
  };
};

export type NavbarProps = {
  user?: IUserProfileResponse | null;
};

// Sidebar
export type ISidebarItem = {
  label: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
};
