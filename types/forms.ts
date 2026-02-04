export interface TutorFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookingInput {
  tutor_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface CreateReviewInput {
  booking_id: string;
  rating: number;
  review?: string;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateTutorProfileInput {
  description?: string;
  price_per_hour?: number;
  category_id?: string;
}

export interface UpdateAvailabilityInput {
  availability: Array<{
    day: string;
    start_time: string;
    end_time: string;
  }>;
}
