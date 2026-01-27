// Booking types
export interface BookedDate {
  date: string; // YYYY-MM-DD format
}

export interface BookingSelection {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface PricingConfig {
  offSeason: number;
  season: number;
  topSeason: number;
  currency: string;
  minNights: {
    default: number;
    holidays: number;
    topSeason: number;
  };
  holidays: string[]; // MM-DD format
  topSeasonMonths: number[];
  seasonMonths: number[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  guests: number;
  note?: string;
  gdprConsent: boolean;
  checkIn: string;
  checkOut: string;
  nights: number;
  estimatedPrice: number;
  language: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  gdprConsent: boolean;
}

// iCal types
export interface ICalEvent {
  start: Date;
  end: Date;
  summary?: string;
}

export interface ICalCache {
  data: string[];
  timestamp: number;
}

// Gallery types
export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Surrounding place types
export interface SurroundingPlace {
  id: string;
  type: string;
  titleKey: string;
  descKey: string;
  image: string;
}

// Review types
export interface Review {
  id: string;
  rating: number;
  textKey: string;
  author: string;
  dateKey: string;
}

// FAQ types
export interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

// Package types
export interface PricingPackage {
  id: string;
  nameKey: string;
  durationKey: string;
  nights: number;
  price: number;
  features: string[];
  popular?: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ICalApiResponse extends ApiResponse {
  data?: {
    bookedDates: string[];
    cachedAt: number;
  };
}
