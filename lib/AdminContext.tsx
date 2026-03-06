'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

const ADMIN_PASSWORD = 'ChataAdmin2025!';

interface GalleryImage { id: string; src: string; alt: string; }
interface Review { id: string; name: string; text: string; rating: number; date: string; }
interface FAQ { id: string; question: string; answer: string; }
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
  reset: {
    label: string;
    title: string;
    items: { icon: string; title: string; desc: string; }[];
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
    items: FAQ[];
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
      { id: '4', icon: '📐', title: 'Plocha', value: '120m2' },
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
      { id: '2', icon: '🚿', title: 'Kúpeľňa', items: ['Sprchovací kút', 'Kozmetika', 'Fen'] },
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
  reset: {
    label: 'RESET POBYT',
    title: 'Načerpajte novú energiu',
    items: [
      { icon: '☀️', title: 'Ranné prebudenie', desc: 'Prebuďte sa s prirodzeným svetlom a výhľadom na hory.' },
      { icon: '🚶', title: 'Prechádzky', desc: 'Objavte krásu okolitých lesov a dolín.' },
      { icon: '📵', title: 'Digital detox', desc: 'Odložte telefón a užite si čas s blízkymi.' },
      { icon: '😴', title: 'Kvalitný oddych', desc: 'Čistý horský vzduch a absolútne ticho.' },
    ],
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
      { id: '2', image: '/assets/surrounding-2.jpg', category: 'VÝLET', title: 'Ploská & Borisov', description: 'Populárne vrcholy.' },
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
      { id: '2', question: 'Je parkovanie?', answer: 'Áno, bezplatne pre 2 autá.' },
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
    copyright: '2026 Chata pri Kastieli',
    madeWith: 'Made with love',
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

interface AdminContextType {
  data: SiteData;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  updateSection: <K extends keyof SiteData>(section: K, value: Partial<SiteData[K]>) => void;
  resetAll: () => void;
  uploadImage: (file: File) => Promise<string>;
  saving: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isAdmin, setAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data from server on mount
  useEffect(() => {
    async function loadFromServer() {
      try {
        const res = await fetch('/api/admin-content');
        if (res.ok) {
          const serverData = await res.json();
          // Server data uses our SiteData shape — merge with defaults
          if (serverData && typeof serverData === 'object' && serverData.hero) {
            setData(prev => deepMerge(prev, serverData));
          }
        }
      } catch (e) {
        console.warn('Server load failed, using defaults:', e);
      }

      // Check admin session
      if (sessionStorage.getItem('chata_admin') === 'true') setAdmin(true);
      setLoaded(true);
    }
    loadFromServer();
  }, []);

  // Save to server
  const saveToServer = useCallback((newData: SiteData) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch('/api/admin-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_PASSWORD },
          body: JSON.stringify(newData),
        });
      } catch (e) {
        console.error('Save error:', e);
      } finally {
        setSaving(false);
      }
    }, 500);
  }, []);
  const updateSection = useCallback(<K extends keyof SiteData>(section: K, value: Partial<SiteData[K]>) => {
    setData(prev => {
      const newData = { ...prev, [section]: { ...prev[section], ...value } };
      // Save to server (fire and forget, with debounce effect via state)
      saveToServer(newData);
      return newData;
    });
  }, [saveToServer]);

  // Upload image to server — returns URL path (not base64!)
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin-upload', {
      method: 'POST',
      headers: { 'x-admin-token': ADMIN_PASSWORD },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }

    const result = await res.json();
    return result.url; // Server returns { url: '/uploads/xxx.jpg' }
  }, []);

  const resetAll = useCallback(() => {
    saveToServer(defaultData);
    setData(defaultData);
  }, [saveToServer]);

  if (!loaded) return null;

  return (
    <AdminContext.Provider value={{ data, isAdmin, setAdmin, updateSection, resetAll, uploadImage, saving }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}

// Deep merge helper — merges b into a, preserving a's structure
function deepMerge(a: any, b: any): any {
  if (b === null || b === undefined) return a;
  if (typeof a !== 'object' || typeof b !== 'object') return b;
  if (Array.isArray(a) && Array.isArray(b)) return b;
  const result = { ...a };
  for (const key of Object.keys(b)) {
    if (key in a) {
      result[key] = deepMerge(a[key], b[key]);
    } else {
      result[key] = b[key];
    }
  }
  return result;
}

export { defaultData };
export type { SiteData };
