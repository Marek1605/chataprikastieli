'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'chata_super_admin_v1';

interface GalleryImage { id: string; src: string; alt: string; category?: string; }
interface Review { id: string; name: string; text: string; rating: number; date: string; }
interface FAQ { id: string; question: string; answer: string; }
interface PricePackage { nights: number; price: number; perNight: number; }
interface Feature { id: string; icon: string; title: string; description: string; }
interface Attraction { id: string; icon: string; title: string; distance: string; }

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    badges: { icon: string; text: string; }[];
  };
  overview: {
    title: string;
    subtitle: string;
    description: string;
    features: Feature[];
  };
  gallery: GalleryImage[];
  amenities: {
    title: string;
    subtitle: string;
    items: { id: string; icon: string; name: string; description: string; }[];
  };
  pricing: {
    weekend: PricePackage;
    reset: PricePackage;
    week: PricePackage;
  };
  surroundings: {
    title: string;
    subtitle: string;
    attractions: Attraction[];
  };
  reviews: Review[];
  faq: FAQ[];
  contact: {
    phone: string;
    email: string;
    address: string;
    checkIn: string;
    checkOut: string;
    mapUrl: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const defaultData: SiteData = {
  hero: {
    title: 'Únik do ticha pod horami.',
    subtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru. Moderný dizajn, absolútne súkromie a nezabudnuteľné zážitky v srdci Turca.',
    backgroundImage: '/assets/hero.jpg',
    badges: [
      { icon: '🔒', text: 'Súkromie' },
      { icon: '🏔️', text: 'Výhľad' },
      { icon: '🤫', text: 'Kľud' },
      { icon: '🔑', text: 'Self check-in' },
    ],
  },
  overview: {
    title: 'Váš horský únik',
    subtitle: 'O chate',
    description: 'Moderná chata s tradičným duchom, kde sa stretáva komfort s prírodou.',
    features: [
      { id: '1', icon: '🛏️', title: '3 spálne', description: 'Pre 6-8 hostí' },
      { id: '2', icon: '🚿', title: '2 kúpeľne', description: 'Moderné vybavenie' },
      { id: '3', icon: '🏔️', title: 'Terasa', description: 'Panoramatický výhľad' },
      { id: '4', icon: '🅿️', title: 'Parkovanie', description: 'Pre 2 autá' },
    ],
  },
  gallery: [
    { id: '1', src: '/assets/gallery-1.jpg', alt: 'Interiér', category: 'interior' },
    { id: '2', src: '/assets/gallery-2.jpg', alt: 'Obývačka', category: 'interior' },
    { id: '3', src: '/assets/gallery-3.jpg', alt: 'Spálňa', category: 'interior' },
    { id: '4', src: '/assets/gallery-4.jpg', alt: 'Kuchyňa', category: 'interior' },
    { id: '5', src: '/assets/surrounding-2.jpg', alt: 'Okolie', category: 'exterior' },
    { id: '6', src: '/assets/surrounding-3.jpg', alt: 'Príroda', category: 'exterior' },
  ],
  amenities: {
    title: 'Vybavenie chaty',
    subtitle: 'Všetko pre váš komfort',
    items: [
      { id: '1', icon: '📺', name: 'Smart TV', description: 'Netflix, YouTube' },
      { id: '2', icon: '📶', name: 'WiFi', description: 'Vysokorýchlostný internet' },
      { id: '3', icon: '🍳', name: 'Plne vybavená kuchyňa', description: 'Všetko potrebné' },
      { id: '4', icon: '🔥', name: 'Krb', description: 'Romantická atmosféra' },
      { id: '5', icon: '🧺', name: 'Práčka', description: 'Pre dlhšie pobyty' },
      { id: '6', icon: '❄️', name: 'Klimatizácia', description: 'Komfort v lete' },
    ],
  },
  pricing: {
    weekend: { nights: 2, price: 340, perNight: 170 },
    reset: { nights: 3, price: 459, perNight: 153 },
    week: { nights: 7, price: 980, perNight: 140 },
  },
  surroundings: {
    title: 'Čo nájdete v okolí',
    subtitle: 'Atrakcie a aktivity',
    attractions: [
      { id: '1', icon: '⛷️', title: 'Ski Martinky', distance: '15 min' },
      { id: '2', icon: '🥾', title: 'Turistické trasy', distance: '5 min' },
      { id: '3', icon: '🏊', title: 'Aquapark', distance: '20 min' },
      { id: '4', icon: '🏰', title: 'Kaštieľ Necpaly', distance: '2 min' },
    ],
  },
  reviews: [
    { id: '1', name: 'Jana K.', text: 'Nádherné miesto na oddych! Výhľad je úžasný a chata má všetko čo potrebujete.', rating: 5, date: '2024-10' },
    { id: '2', name: 'Peter M.', text: 'Super výhľad, čistota, pokoj. Určite sa vrátime!', rating: 5, date: '2024-09' },
    { id: '3', name: 'Lucia S.', text: 'Perfektný víkendový únik. Odporúčam všetkým.', rating: 5, date: '2024-08' },
  ],
  faq: [
    { id: '1', question: 'Aký je čas príchodu a odchodu?', answer: 'Check-in je od 15:00 a check-out do 10:00. Po dohode možné upraviť.' },
    { id: '2', question: 'Je možné priviesť domáce zviera?', answer: 'Áno, domáce zvieratá sú vítané po predchádzajúcej dohode.' },
    { id: '3', question: 'Je k dispozícii parkovanie?', answer: 'Áno, máme bezplatné parkovanie pre 2 autá priamo pri chate.' },
    { id: '4', question: 'Aké platobné metódy akceptujete?', answer: 'Akceptujeme bankový prevod a platbu kartou.' },
  ],
  contact: {
    phone: '+421 900 123 456',
    email: 'info@chataprikastieli.sk',
    address: 'Chata pri Kaštieli, Necpaly 123, 038 12 Necpaly',
    checkIn: '15:00',
    checkOut: '10:00',
    mapUrl: 'https://maps.google.com/?q=49.0735,18.8735',
  },
  seo: {
    title: 'Chata pri Kaštieli - Luxusná horská chata v Turci',
    description: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru. Ideálne miesto pre rodinnú dovolenku.',
    keywords: 'chata, Turiec, Malá Fatra, ubytovanie, dovolenka',
  },
};

interface AdminContextType {
  data: SiteData;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  updateHero: (hero: Partial<SiteData['hero']>) => void;
  updateOverview: (overview: Partial<SiteData['overview']>) => void;
  updateGallery: (gallery: GalleryImage[]) => void;
  updateAmenities: (amenities: Partial<SiteData['amenities']>) => void;
  updatePricing: (pricing: Partial<SiteData['pricing']>) => void;
  updateSurroundings: (surroundings: Partial<SiteData['surroundings']>) => void;
  updateReviews: (reviews: Review[]) => void;
  updateFaq: (faq: FAQ[]) => void;
  updateContact: (contact: Partial<SiteData['contact']>) => void;
  updateSeo: (seo: Partial<SiteData['seo']>) => void;
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
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({ ...defaultData, ...parsed });
      }
      if (sessionStorage.getItem('chata_admin') === 'true') setAdmin(true);
    } catch (e) { console.error(e); }
    setLoaded(true);
  }, []);

  const saveData = (newData: SiteData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Save error:', e);
      alert('Chyba ukladania! Skús zmazať staré obrázky.');
    }
  };

  const updateHero = (hero: Partial<SiteData['hero']>) => saveData({ ...data, hero: { ...data.hero, ...hero } });
  const updateOverview = (overview: Partial<SiteData['overview']>) => saveData({ ...data, overview: { ...data.overview, ...overview } });
  const updateGallery = (gallery: GalleryImage[]) => saveData({ ...data, gallery });
  const updateAmenities = (amenities: Partial<SiteData['amenities']>) => saveData({ ...data, amenities: { ...data.amenities, ...amenities } });
  const updatePricing = (pricing: Partial<SiteData['pricing']>) => saveData({ ...data, pricing: { ...data.pricing, ...pricing } });
  const updateSurroundings = (surroundings: Partial<SiteData['surroundings']>) => saveData({ ...data, surroundings: { ...data.surroundings, ...surroundings } });
  const updateReviews = (reviews: Review[]) => saveData({ ...data, reviews });
  const updateFaq = (faq: FAQ[]) => saveData({ ...data, faq });
  const updateContact = (contact: Partial<SiteData['contact']>) => saveData({ ...data, contact: { ...data.contact, ...contact } });
  const updateSeo = (seo: Partial<SiteData['seo']>) => saveData({ ...data, seo: { ...data.seo, ...seo } });
  const resetAll = () => { localStorage.removeItem(STORAGE_KEY); setData(defaultData); };

  if (!loaded) return null;

  return (
    <AdminContext.Provider value={{ 
      data, isAdmin, setAdmin, 
      updateHero, updateOverview, updateGallery, updateAmenities,
      updatePricing, updateSurroundings, updateReviews, updateFaq, 
      updateContact, updateSeo, resetAll 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
