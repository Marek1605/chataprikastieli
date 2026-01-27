import { NextResponse } from 'next/server';
import { parseICSContent } from '@/lib/utils';

let cache: { data: string[]; timestamp: number } | null = null;
const CACHE_DURATION = 20 * 60 * 1000;

export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({ success: true, data: { bookedDates: cache.data, cachedAt: cache.timestamp, fromCache: true } });
    }

    const airbnbUrl = process.env.ICAL_URL_AIRBNB;
    const bookingUrl = process.env.ICAL_URL_BOOKING;
    
    const icalUrls: string[] = [];
    if (airbnbUrl && !airbnbUrl.includes('XXXXX')) icalUrls.push(airbnbUrl);
    if (bookingUrl && !bookingUrl.includes('XXXXX')) icalUrls.push(bookingUrl);

    if (icalUrls.length === 0) {
      return NextResponse.json({ success: true, data: { bookedDates: [], cachedAt: Date.now(), message: 'No iCal URLs configured' } });
    }

    const allBookedDates: string[] = [];
    const results = await Promise.allSettled(
      icalUrls.map(async (url) => {
        const response = await fetch(url, { next: { revalidate: 1200 }, headers: { 'User-Agent': 'ChataKastieli/1.0' } });
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
        return parseICSContent(await response.text());
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') allBookedDates.push(...result.value);
    }

    const uniqueDates = Array.from(new Set(allBookedDates));
    cache = { data: uniqueDates, timestamp: Date.now() };

    return NextResponse.json({ success: true, data: { bookedDates: uniqueDates, cachedAt: cache.timestamp, fromCache: false } });
  } catch (error) {
    if (cache) return NextResponse.json({ success: true, data: { bookedDates: cache.data, cachedAt: cache.timestamp, fromCache: true, stale: true } });
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export const revalidate = 1200;
