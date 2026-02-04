export enum UserRole {
  TEACHER = "teacher",
  ADMIN = "admin",
  STUDENT = "student",
}

export enum BookingStatus {
  CONFIRM = "confirm",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum WeekDay {
  SATURDAY = "saturday",
  SUNDAY = "sunday",
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  is_banned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface TutorProfile {
  id: string;
  user_id: string;
  category_id: string;
  description?: string;
  price_per_hour: number;
  featured: boolean;
  category: Category;
  userToTutor: User;
  availables?: Available[];
  bookings?: Booking[];
  _count?: {
    bookings: number;
  };
  averageRating?: number;
}

export interface Available {
  id: string;
  start_time: string;
  end_time: string;
  tutor_id: string;
  day: WeekDay;
}

export interface Booking {
  id: string;
  tutor_id: string;
  student_id: string;
  start_time: string;
  end_time: string;
  date: string;
  total_price: number;
  status: BookingStatus;
  bookingTutor?: TutorProfile;
  bookingStudent?: User;
  ratings?: Rating;
}

export interface Rating {
  id: string;
  booking_id: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
