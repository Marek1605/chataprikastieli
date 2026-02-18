'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const STORAGE_KEY = 'chata_mega_admin_v2';

interface GalleryImage { id: string; src: string; alt: string; }
interface Review { id: string; name: string; text: string; rating: number; date: string; }
interface FAQItem { id: string; question: string; answer: string; }
interface Amenity { id: string; icon: string; title: string; items: string[]; }
interface Attraction { id: string; image: string; category: string; title: string; description: string; }
interface BookingLink { id: string; name: string; url: string; }

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    badges: { icon: string; text: string; }[];
    rating: string;
    ratingText: string;
    cta1: string;
    cta2: string;
  };
  overview: {
    label: string;
    title: string;
    description: string;
    features: { id: string; icon: string; title: string; value: string; }[];
    image: string;
  };
  gallery: {
    label: string;
    title: string;
    images: GalleryImage[];
  };
  amenities: {
    label: string;
    title: string;
    categories: Amenity[];
  };
  atmosphere: {
    label: string;
    title: string;
    morningTitle: string;
    morningImage: string;
    eveningTitle: string;
    eveningImage: string;
    text1: string;
    text2: string;
  };
  pricing: {
    label: string;
    title: string;
    popularText: string;
    ctaText: string;
    packages: {
      weekend: { name: string; desc: string; nights: number; price: number; };
      reset: { name: string; desc: string; nights: number; price: number; };
      week: { name: string; desc: string; nights: number; price: number; };
    };
  };
  booking: {
    label: string;
    title: string;
    pricePerNight: number;
    minNights: number;
    maxGuests: number;
    bookingLinks: BookingLink[];
  };
  surroundings: {
    label: string;
    title: string;
    attractions: Attraction[];
  };
  reviews: {
    label: string;
    title: string;
    items: Review[];
  };
  faq: {
    label: string;
    title: string;
    items: FAQItem[];
  };
  contact: {
    label: string;
    title: string;
    addressLabel: string;
    address: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    hoursLabel: string;
    checkIn: string;
    checkOut: string;
    mapLabel: string;
  };
  footer: {
    description: string;
    phone: string;
    email: string;
    location: string;
    copyright: string;
    madeWith: string;
    privacyText: string;
    termsText: string;
    bookViaText: string;
  };
  nav: {
    home: string;
    gallery: string;
    amenities: string;
    booking: string;
    pricing: string;
    surroundings: string;
    reviews: string;
    faq: string;
    contact: string;
    bookNow: string;
  };
}

const defaultData: SiteData = {
  hero: {
    title: 'Únik do ticha pod horami.',
    subtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru.',
    backgroundImage: '/assets/hero.jpg',
    badges: [
      { icon: '🔒', text: 'Súkromie' },
      { icon: '🏔️', text: 'Výhľad' },
      { icon: '🤫', text: 'Kľud' },
      { icon: '🔑', text: 'Self check-in' },
    ],
    rating: '4.9/5',
    ratingText: 'Hostia sa vracajú',
    cta1: 'Rezervovať pobyt',
    cta2: 'Overiť dostupnosť',
  },
  overview: {
    label: 'O CHATE',
    title: 'Váš horský únik',
    description: 'Moderná chata s tradičným duchom, kde sa stretáva komfort s prírodou.',
    features: [
      { id: '1', icon: '🛏️', title: 'Spálne', value: '3' },
      { id: '2', icon: '👥', title: 'Hostia', value: '6-8' },
      { id: '3', icon: '🚿', title: 'Kúpeľne', value: '2' },
      { id: '4', icon: '📐', title: 'Plocha', value: '120m²' },
    ],
    image: '/assets/gallery-1.jpg',
  },
  gallery: {
    label: 'FOTOGALÉRIA',
    title: 'Nahliadnite dovnútra',
    images: [
      { id: '1', src: '/assets/gallery-1.jpg', alt: 'Interiér' },
      { id: '2', src: '/assets/gallery-2.jpg', alt: 'Obývačka' },
      { id: '3', src: '/assets/gallery-3.jpg', alt: 'Spálňa' },
      { id: '4', src: '/assets/gallery-4.jpg', alt: 'Kuchyňa' },
    ],
  },
  amenities: {
    label: 'VYBAVENIE CHATY',
    title: 'Všetko pre váš komfort',
    categories: [
      { id: '1', icon: '🍳', title: 'Kuchyňa', items: ['Indukčná varná doska', 'Kávovar', 'Chladnička'] },
      { id: '2', icon: '🚿', title: 'Kúpeľňa', items: ['Sprchový kút', 'Kozmetika', 'Fén'] },
      { id: '3', icon: '🛏️', title: 'Spálňa', items: ['Kvalitné postele', 'Obliečky', 'Závesy'] },
      { id: '4', icon: '🛋️', title: 'Obývačka', items: ['Smart TV', 'Netflix', 'Reproduktor'] },
      { id: '5', icon: '🌲', title: 'Exteriér', items: ['Terasa', 'Gril', 'Parkovanie'] },
      { id: '6', icon: '🎿', title: 'Aktivity', items: ['Turistika', 'Lyžovanie', 'Cyklistika'] },
    ],
  },
  atmosphere: {
    label: 'ATMOSFÉRA',
    title: 'Každý moment má svoju krásu',
    morningTitle: 'Ranná atmosféra',
    morningImage: '/assets/gallery-2.jpg',
    eveningTitle: 'Večerná atmosféra',
    eveningImage: '/assets/gallery-3.jpg',
    text1: 'Ráno vás zobudí jemné svetlo prenikajúce cez okná s výhľadom na hory.',
    text2: 'Večer si vychutnajte západ slnka z terasy s pohárom vína.',
  },
  pricing: {
    label: 'CENNÍK',
    title: 'Vyberte si ideálny pobyt',
    popularText: 'Najpopulárnejší',
    ctaText: 'Chcem tento pobyt',
    packages: {
      weekend: { name: 'Víkendový pobyt', desc: 'Piatok - Nedeľa', nights: 2, price: 200 },
      reset: { name: 'Reset pobyt', desc: 'Ideálny krátky únik', nights: 3, price: 300 },
      week: { name: 'Týždenný pobyt', desc: 'Plnohodnotná dovolenka', nights: 7, price: 650 },
    },
  },
  booking: {
    label: 'REZERVÁCIA',
    title: 'Vyberte si termín',
    pricePerNight: 100,
    minNights: 2,
    maxGuests: 8,
    bookingLinks: [
      { id: '1', name: 'Airbnb', url: 'https://airbnb.com' },
      { id: '2', name: 'Booking.com', url: 'https://booking.com' },
    ],
  },
  surroundings: {
    label: 'OKOLIE A ATRAKCIE',
    title: 'Objavte krásu Turca',
    attractions: [
      { id: '1', image: '/assets/surrounding-1.jpg', category: 'PRÍRODA', title: 'Necpalská dolina', description: 'Krásna prírodná dolina.' },
      { id: '2', image: '/assets/surrounding-2.jpg', category: 'VÝLET', title: 'Ploská & Borišov', description: 'Populárne vrcholy.' },
      { id: '3', image: '/assets/surrounding-3.jpg', category: 'PRECHÁDZKA', title: 'Necpalské vodopády', description: 'Romantické vodopády.' },
      { id: '4', image: '/assets/surrounding-4.jpg', category: 'CELOROČNE', title: 'Jasenská dolina', description: 'Lyžovanie aj turistika.' },
    ],
  },
  reviews: {
    label: 'RECENZIE',
    title: 'Čo hovoria hostia',
    items: [
      { id: '1', name: 'Jana K.', text: 'Nádherné miesto!', rating: 5, date: '2024-10' },
      { id: '2', name: 'Peter M.', text: 'Super výhľad!', rating: 5, date: '2024-09' },
    ],
  },
  faq: {
    label: 'FAQ',
    title: 'Často kladené otázky',
    items: [
      { id: '1', question: 'Aký je čas príchodu?', answer: 'Check-in od 15:00, check-out do 10:00.' },
      { id: '2', question: 'Je parkovanie?', answer: 'Áno, bezplatné pre 2 autá.' },
    ],
  },
  contact: {
    label: 'KONTAKT',
    title: 'Kontaktujte nás',
    addressLabel: 'Adresa',
    address: 'Necpaly 90, 038 12',
    phoneLabel: 'Telefón',
    phone: '+421 915 327 597',
    emailLabel: 'Email',
    email: 'chataprikastieli@gmail.com',
    hoursLabel: 'Časy',
    checkIn: '15:00',
    checkOut: '10:00',
    mapLabel: 'Nájdite nás',
  },
  footer: {
    description: 'Luxusná horská chata v Turci.',
    phone: '+421 915 327 597',
    email: 'info@chataprikastieli.sk',
    location: 'Necpaly, Turiec',
    copyright: '© 2026 Chata pri Kaštieli',
    madeWith: 'Made with ❤️',
    privacyText: 'Ochrana súkromia',
    termsText: 'Obchodné podmienky',
    bookViaText: 'REZERVUJTE CEZ:',
  },
  nav: {
    home: 'Domov',
    gallery: 'Galéria',
    amenities: 'Vybavenie',
    booking: 'Rezervácia',
    pricing: 'Cenník',
    surroundings: 'Okolie',
    reviews: 'Recenzie',
    faq: 'FAQ',
    contact: 'Kontakt',
    bookNow: 'Rezervovať',
  },
};

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

interface AdminContextType {
  data: SiteData;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  updateSection: <K extends keyof SiteData>(section: K, value: Partial<SiteData[K]>) => void;
  resetAll: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isAdmin, setAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = deepMerge(defaultData, parsed);
        setData(merged);
        console.log('Admin data loaded:', Object.keys(parsed));
      }
      if (sessionStorage.getItem('chata_admin') === 'true') {
        setAdmin(true);
      }
    } catch (e) {
      console.error('Load error:', e);
    }
    setLoaded(true);
  }, []);

  const updateSection = useCallback(<K extends keyof SiteData>(section: K, value: Partial<SiteData[K]>) => {
    setData(prev => {
      const newData = {
        ...prev,
        [section]: { ...prev[section], ...value }
      };
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        console.log('Saved section:', section, Object.keys(value));
      } catch (e) {
        console.error('Save error:', e);
        alert('Chyba pri ukladaní! Skúste menšie obrázky.');
      }
      return newData;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
    window.location.reload();
  }, []);

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wood"></div>
    </div>;
  }

  return (
    <AdminContext.Provider value={{ data, isAdmin, setAdmin, updateSection, resetAll }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export { defaultData };
export type { SiteData };
