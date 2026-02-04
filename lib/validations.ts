import { z } from "zod";
import { UserRole } from "@/types";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const bookingSchema = z.object({
  tutor_id: z.string().uuid(),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

export const reviewSchema = z.object({
  booking_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

export const tutorProfileSchema = z.object({
  category_id: z.string().uuid("Please select a category"),
  description: z.string().optional(),
  price_per_hour: z.number().min(1, "Price must be at least $1"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});
