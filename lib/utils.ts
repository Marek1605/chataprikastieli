import { pricingConfig } from './config';

// Date formatting utilities
export function formatDateISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatMonthDay(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateDisplay(date: Date, locale: string, months: string[]): string {
  const monthName = months[date.getMonth()];
  const shortMonth = monthName.substring(0, 3);
  return `${date.getDate()}. ${shortMonth} ${date.getFullYear()}`;
}

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Pricing utilities
export function getNightPrice(date: Date): number {
  const month = date.getMonth() + 1;
  const monthDay = formatMonthDay(date);
  
  if (pricingConfig.holidays.includes(monthDay)) {
    return pricingConfig.topSeason;
  }
  if (pricingConfig.topSeasonMonths.includes(month)) {
    return pricingConfig.topSeason;
  }
  if (pricingConfig.seasonMonths.includes(month)) {
    return pricingConfig.season;
  }
  return pricingConfig.offSeason;
}

export function calculateTotalPrice(checkIn: Date, checkOut: Date): number {
  let total = 0;
  const current = new Date(checkIn);
  
  while (current < checkOut) {
    total += getNightPrice(current);
    current.setDate(current.getDate() + 1);
  }
  
  return total;
}

export function getMinNights(date: Date): number {
  const monthDay = formatMonthDay(date);
  const month = date.getMonth() + 1;
  
  if (pricingConfig.holidays.includes(monthDay)) {
    return pricingConfig.minNights.holidays;
  }
  if (pricingConfig.topSeasonMonths.includes(month)) {
    return pricingConfig.minNights.topSeason;
  }
  return pricingConfig.minNights.default;
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
}

// Check if date range is available
export function isRangeAvailable(checkIn: Date, checkOut: Date, bookedDates: string[]): boolean {
  const current = new Date(checkIn);
  
  while (current < checkOut) {
    if (bookedDates.includes(formatDateISO(current))) {
      return false;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return true;
}

// Get dates for next available weekend
export function getNextAvailableWeekend(nights: number, bookedDates: string[]): { checkIn: Date; checkOut: Date } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkIn = new Date(today);
  
  // Find next Friday
  while (checkIn.getDay() !== 5) {
    checkIn.setDate(checkIn.getDate() + 1);
  }
  
  // If it's already past, move to next week
  if (checkIn <= today) {
    checkIn.setDate(checkIn.getDate() + 7);
  }
  
  // Try to find available weekend in next 8 weeks
  for (let i = 0; i < 8; i++) {
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);
    
    if (isRangeAvailable(checkIn, checkOut, bookedDates)) {
      return { checkIn, checkOut };
    }
    
    checkIn.setDate(checkIn.getDate() + 7);
  }
  
  return null;
}

// iCal parsing utilities
export function parseICSDate(dateStr: string): Date {
  return new Date(
    parseInt(dateStr.substring(0, 4)),
    parseInt(dateStr.substring(4, 6)) - 1,
    parseInt(dateStr.substring(6, 8))
  );
}

export function parseICSContent(icsText: string): string[] {
  const bookedDays: string[] = [];
  const events = icsText.split('BEGIN:VEVENT');
  
  for (let i = 1; i < events.length; i++) {
    const event = events[i];
    const dtStartMatch = event.match(/DTSTART[^:]*:(\d{8})/);
    const dtEndMatch = event.match(/DTEND[^:]*:(\d{8})/);
    
    if (dtStartMatch && dtEndMatch) {
      const startDate = parseICSDate(dtStartMatch[1]);
      const endDate = parseICSDate(dtEndMatch[1]);
      const current = new Date(startDate);
      
      // DTEND is checkout date, so last booked night is day before
      while (current < endDate) {
        bookedDays.push(formatDateISO(current));
        current.setDate(current.getDate() + 1);
      }
    }
  }
  
  return bookedDays;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Basic validation - at least 9 digits
  return phone.replace(/\D/g, '').length >= 9;
}

// Class name utility
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
