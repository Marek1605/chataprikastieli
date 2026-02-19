'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { pricingConfig, siteConfig } from '@/lib/config';
import { useAdmin } from '@/lib/AdminContext';
import {
  formatDateISO,
  formatDateDisplay,
  calculateNights,
  getMinNights,
  isRangeAvailable,
  isValidEmail,
  cn,
} from '@/lib/utils';

export default function Booking() {
  const t = useTranslations('booking');
  const tCal = useTranslations('calendar');
  const tVal = useTranslations('validation');
  const locale = useLocale();
  const { data: adminData } = useAdmin();

  // CENA Z ADMIN PANELU
  const pricePerNight = adminData?.booking?.pricePerNight || pricingConfig?.basePrice || 100;
  const adminMinNights = adminData?.booking?.minNights || 2;

  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    note: '',
    gdprConsent: false,
  });

  const weekdays = tCal.raw('weekdays') as string[];
  const months = tCal.raw('months') as string[];

  useEffect(() => {
    async function loadBookedDates() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/ical');
        const data = await res.json();
        if (data.success && data.data?.bookedDates) {
          setBookedDates(data.data.bookedDates);
        }
        setLoadError(false);
      } catch (error) {
        console.error('Failed to load availability:', error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookedDates();
  }, []);

  // VYPOCET S CENOU Z ADMIN
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const totalPrice = nights * pricePerNight;
  const minNights = checkIn ? getMinNights(checkIn) : adminMinNights;
  const isMinNightsValid = nights >= minNights || !checkIn || !checkOut;

  const handleDateClick = useCallback(
    (dateStr: string) => {
      const date = new Date(dateStr);

      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(date);
        setCheckOut(null);
        setIsSelectingCheckOut(true);
      } else if (isSelectingCheckOut) {
        if (date > checkIn && isRangeAvailable(checkIn, date, bookedDates)) {
          setCheckOut(date);
          setIsSelectingCheckOut(false);
        } else {
          setCheckIn(date);
          setCheckOut(null);
        }
      }
    },
    [checkIn, checkOut, isSelectingCheckOut, bookedDates]
  );

  const renderCalendar = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateISO(date);
      const isPast = date < today;
      const isBooked = bookedDates.includes(dateStr);
      const isToday = date.getTime() === today.getTime();
      const isCheckIn = checkIn && dateStr === formatDateISO(checkIn);
      const isCheckOut = checkOut && dateStr === formatDateISO(checkOut);
      const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;
      const isDisabled = isPast || isBooked;

      days.push(
        <button
          key={dateStr}
          onClick={() => !isDisabled && handleDateClick(dateStr)}
          disabled={isDisabled}
          className={cn(
            'calendar-day',
            isPast && 'disabled',
            isBooked && !isPast && 'booked',
            isToday && 'today',
            isCheckIn && 'selected range-start',
            isCheckOut && 'selected range-end',
            isInRange && 'in-range'
          )}
          aria-label={`${day}. ${months[month]}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!checkIn || !checkOut) newErrors.dates = tVal('datesRequired');
    if (!isMinNightsValid) newErrors.minNights = tVal('minNightsNotMet');
    if (!formData.name.trim()) newErrors.name = tVal('nameRequired');
    if (!isValidEmail(formData.email)) newErrors.email = tVal('emailInvalid');
    if (!formData.phone.trim()) newErrors.phone = tVal('phoneRequired');
    if (!formData.gdprConsent) newErrors.gdpr = tVal('gdprRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn: formatDateISO(checkIn!),
          checkOut: formatDateISO(checkOut!),
          nights,
          estimatedPrice: totalPrice,
          language: locale,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
      } else {
        alert(t('submitError'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(t('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <section id="booking" className="py-20 bg-cream">
        <div className="container-custom text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-display mb-4">{t('successTitle')}</h2>
            <p className="text-gray-600 mb-6">{t('successMessage')}</p>
            <button onClick={() => setShowSuccess(false)} className="btn btn-primary">
              {t('newBooking')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-cream">
      <div className="container-custom">
        <header className="text-center mb-12">
          <span className="section-label">{t('label')}</span>
          <h2 className="section-title">{t('title')}</h2>
          <p className="text-gray-600 mt-4">
            Cena: <strong className="text-wood text-xl">{pricePerNight}€</strong> / noc
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button onClick={goToPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-xl">←</button>
              <div className="flex gap-8">
                <span className="font-medium">{months[currentMonth]} {currentYear}</span>
                <span className="font-medium hidden md:inline">{months[nextMonth]} {nextYear}</span>
              </div>
              <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-xl">→</button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wood"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">{renderCalendar(currentYear, currentMonth)}</div>
                </div>
                <div className="hidden md:block">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">{renderCalendar(nextYear, nextMonth)}</div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t text-sm">
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-white border rounded" />{t('legendAvailable')}</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-booked rounded" />{t('legendBooked')}</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 bg-graphite rounded" />{t('legendSelected')}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div>
                <div className="text-xs text-gray-500 mb-1">{t('checkIn')}</div>
                <div className="font-medium">{checkIn ? formatDateDisplay(checkIn, locale, months) : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{t('checkOut')}</div>
                <div className="font-medium">{checkOut ? formatDateDisplay(checkOut, locale, months) : '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{t('nights')}</div>
                <div className="font-medium">{nights || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{t('estPrice')}</div>
                <div className="font-medium text-lg text-wood">{totalPrice ? `${totalPrice}€` : '—'}</div>
              </div>
            </div>

            {!isMinNightsValid && (
              <div className="notice notice-warning mt-4">
                <span>⚠️</span>
                <span>{t('minNightsWarning')} {minNights}. {t('pleaseSelectLonger')}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-display text-xl mb-6">{t('formTitle')}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">{t('name')}</label>
                <input type="text" className={cn('form-input', errors.name && 'error')} placeholder={t('namePlaceholder')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div>
                <label className="form-label">{t('email')}</label>
                <input type="email" className={cn('form-input', errors.email && 'error')} placeholder={t('emailPlaceholder')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label">{t('phone')}</label>
                <input type="tel" className={cn('form-input', errors.phone && 'error')} placeholder={t('phonePlaceholder')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div>
                <label className="form-label">{t('guests')}</label>
                <select className="form-input" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>

              <div>
                <label className="form-label">{t('note')}</label>
                <textarea className="form-input min-h-[80px]" placeholder={t('notePlaceholder')} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
              </div>

              {checkIn && checkOut && (
                <div className="bg-cream p-4 rounded-lg">
                  <h4 className="font-medium mb-3">{t('summary')}</h4>
                  <div className="text-sm space-y-1 text-gray-600">
                    <div className="flex justify-between"><span>{t('checkIn')}:</span><span>{formatDateDisplay(checkIn, locale, months)}</span></div>
                    <div className="flex justify-between"><span>{t('checkOut')}:</span><span>{formatDateDisplay(checkOut, locale, months)}</span></div>
                    <div className="flex justify-between"><span>{t('nights')}:</span><span>{nights}</span></div>
                    <div className="flex justify-between font-semibold text-graphite pt-2 border-t">
                      <span>{t('estPrice')}:</span>
                      <span className="text-wood">{totalPrice}€</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" checked={formData.gdprConsent} onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })} />
                  <span className="text-sm text-gray-600">{t('gdpr')}</span>
                </label>
                {errors.gdpr && <p className="form-error">{errors.gdpr}</p>}
              </div>

              <button type="submit" disabled={isSubmitting || !isMinNightsValid} className="btn btn-primary w-full">
                {isSubmitting ? t('submitting') : t('submit')}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-500 mb-3">{t('orBook')}</p>
                <div className="flex gap-3 justify-center">
                  {adminData?.booking?.bookingLinks?.length > 0 ? (
                    adminData.booking.bookingLinks.map(link => (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        {link.name}
                      </a>
                    ))
                  ) : (
                    <>
                      <a href={siteConfig.booking.airbnb} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Airbnb</a>
                      <a href={siteConfig.booking.bookingCom} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Booking.com</a>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
