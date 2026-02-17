'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'chata_admin_data_v1';

interface GalleryImage { id: string; src: string; alt: string; }
interface Review { id: string; name: string; text: string; rating: number; date: string; }
interface FAQ { id: string; question: string; answer: string; }
interface PricePackage { nights: number; price: number; }

interface SiteData {
  hero: { title: string; subtitle: string; backgroundImage: string; };
  gallery: GalleryImage[];
  pricing: { weekend: PricePackage; reset: PricePackage; week: PricePackage; };
  reviews: Review[];
  faq: FAQ[];
  contact: { phone: string; email: string; address: string; checkIn: string; checkOut: string; };
}

const defaultData: SiteData = {
  hero: {
    title: 'Únik do ticha pod horami.',
    subtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru.',
    backgroundImage: '/assets/hero.jpg',
  },
  gallery: [
    { id: '1', src: '/assets/gallery-1.jpg', alt: 'Interiér' },
    { id: '2', src: '/assets/gallery-2.jpg', alt: 'Obývačka' },
    { id: '3', src: '/assets/gallery-3.jpg', alt: 'Spálňa' },
    { id: '4', src: '/assets/gallery-4.jpg', alt: 'Kuchyňa' },
    { id: '5', src: '/assets/surrounding-2.jpg', alt: 'Okolie' },
    { id: '6', src: '/assets/surrounding-3.jpg', alt: 'Príroda' },
  ],
  pricing: {
    weekend: { nights: 2, price: 170 },
    reset: { nights: 3, price: 255 },
    week: { nights: 7, price: 550 },
  },
  reviews: [
    { id: '1', name: 'Jana K.', text: 'Nádherné miesto na oddych!', rating: 5, date: '2024-10' },
    { id: '2', name: 'Peter M.', text: 'Super výhľad, čistota, pokoj.', rating: 5, date: '2024-09' },
  ],
  faq: [
    { id: '1', question: 'Aký je čas príchodu a odchodu?', answer: 'Check-in od 15:00, check-out do 10:00.' },
    { id: '2', question: 'Je možné priviesť domáce zviera?', answer: 'Áno, po dohode.' },
    { id: '3', question: 'Je k dispozícii parkovanie?', answer: 'Áno, bezplatné parkovanie pre 2 autá.' },
  ],
  contact: {
    phone: '+421 900 123 456',
    email: 'info@chataprikastieli.sk',
    address: 'Necpaly, Turiec, Slovensko',
    checkIn: '15:00',
    checkOut: '10:00',
  },
};

interface AdminContextType {
  data: SiteData;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  updateData: (newData: Partial<SiteData>) => void;
  updateHero: (hero: Partial<SiteData['hero']>) => void;
  updateGallery: (gallery: GalleryImage[]) => void;
  updatePricing: (pricing: Partial<SiteData['pricing']>) => void;
  updateReviews: (reviews: Review[]) => void;
  updateFaq: (faq: FAQ[]) => void;
  updateContact: (contact: Partial<SiteData['contact']>) => void;
  resetAll: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isAdmin, setAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...defaultData, ...JSON.parse(saved) });
      if (sessionStorage.getItem('chata_admin') === 'true') setAdmin(true);
    } catch (e) { console.error(e); }
    setLoaded(true);
  }, []);

  const save = (newData: SiteData) => {
    setData(newData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch (e) { console.error(e); }
  };

  const updateData = (partial: Partial<SiteData>) => save({ ...data, ...partial });
  const updateHero = (hero: Partial<SiteData['hero']>) => save({ ...data, hero: { ...data.hero, ...hero } });
  const updateGallery = (gallery: GalleryImage[]) => save({ ...data, gallery });
  const updatePricing = (pricing: Partial<SiteData['pricing']>) => save({ ...data, pricing: { ...data.pricing, ...pricing } });
  const updateReviews = (reviews: Review[]) => save({ ...data, reviews });
  const updateFaq = (faq: FAQ[]) => save({ ...data, faq });
  const updateContact = (contact: Partial<SiteData['contact']>) => save({ ...data, contact: { ...data.contact, ...contact } });
  const resetAll = () => { localStorage.removeItem(STORAGE_KEY); setData(defaultData); };

  if (!loaded) return null;

  return (
    <AdminContext.Provider value={{ data, isAdmin, setAdmin, updateData, updateHero, updateGallery, updatePricing, updateReviews, updateFaq, updateContact, resetAll }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
