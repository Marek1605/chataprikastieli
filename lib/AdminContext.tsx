'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ===========================================
// TYPY
// ===========================================
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface Review {
  id: string;
  name: string;
  date: string;
  text: string;
  rating: number;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface SiteContent {
  // Hero
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  
  // Contact info
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  
  // Pricing
  pricing: {
    weekend: { nights: number; price: number };
    reset: { nights: number; price: number };
    week: { nights: number; price: number };
  };
  
  // Gallery
  gallery: GalleryImage[];
  
  // Reviews
  reviews: Review[];
  
  // FAQ
  faq: FAQItem[];
  
  // Booking
  booking: {
    checkIn: string;
    checkOut: string;
  };
  
  // Custom texts & images
  customTexts: Record<string, string>;
  customImages: Record<string, string>;
}

interface AdminContextType {
  isAdmin: boolean;
  isEditing: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleEditing: () => void;
  content: SiteContent;
  updateContent: (path: string, value: any) => void;
  getText: (key: string, defaultValue: string) => string;
  setText: (key: string, value: string) => void;
  getImage: (key: string, defaultValue: string) => string;
  setImage: (key: string, value: string) => void;
  addGalleryImage: (src: string, alt?: string) => void;
  removeGalleryImage: (id: string) => void;
  updateGalleryImage: (id: string, data: Partial<GalleryImage>) => void;
  moveGalleryImage: (from: number, to: number) => void;
  addReview: (review: Omit<Review, 'id'>) => void;
  removeReview: (id: string) => void;
  updateReview: (id: string, data: Partial<Review>) => void;
  addFAQ: (item: Omit<FAQItem, 'id'>) => void;
  removeFAQ: (id: string) => void;
  updateFAQ: (id: string, data: Partial<FAQItem>) => void;
  saveAll: () => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  hasUnsavedChanges: boolean;
}

const ADMIN_PASSWORD = 'ChataAdmin2025!';
const STORAGE_KEY = 'chata_admin_v3';
const genId = () => Math.random().toString(36).substr(2, 9);

const defaultContent: SiteContent = {
  hero: {
    title: 'Únik do ticha pod horami.',
    subtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru. Moderný dizajn, absolútne súkromie a nezabudnuteľné zážitky v srdci Turca.',
    backgroundImage: '/assets/hero.jpg',
  },
  contact: {
    phone: '+421 XXX XXX XXX',
    email: 'info@chataprikastieli.sk',
    address: 'Necpaly, Turiec, Slovensko',
  },
  pricing: {
    weekend: { nights: 2, price: 170 },
    reset: { nights: 3, price: 255 },
    week: { nights: 7, price: 550 },
  },
  gallery: [
    { id: '1', src: '/assets/gallery-1.jpg', alt: 'Interiér chaty' },
    { id: '2', src: '/assets/gallery-2.jpg', alt: 'Obývačka' },
    { id: '3', src: '/assets/gallery-3.jpg', alt: 'Spálňa' },
    { id: '4', src: '/assets/gallery-4.jpg', alt: 'Kuchyňa' },
    { id: '5', src: '/assets/gallery-5.jpg', alt: 'Kúpeľňa' },
    { id: '6', src: '/assets/gallery-6.jpg', alt: 'Terasa' },
    { id: '7', src: '/assets/gallery-7.jpg', alt: 'Výhľad' },
    { id: '8', src: '/assets/gallery-8.jpg', alt: 'Detail' },
    { id: '9', src: '/assets/gallery-9.jpg', alt: 'Okolie' },
    { id: '10', src: '/assets/gallery-10.jpg', alt: 'Exteriér' },
  ],
  reviews: [
    { id: '1', name: 'Jana K.', date: 'Október 2024', text: 'Absolútne nádherné miesto! Chata predčila všetky naše očakávania.', rating: 5 },
    { id: '2', name: 'Martin S.', date: 'September 2024', text: 'Ideálne miesto pre romantický víkend vo dvojici.', rating: 5 },
    { id: '3', name: 'Petra N.', date: 'August 2024', text: 'Strávili sme tu úžasný týždeň s rodinou.', rating: 5 },
  ],
  faq: [
    { id: '1', question: 'Aký je čas príchodu a odchodu?', answer: 'Check-in od 15:00, check-out do 10:00.' },
    { id: '2', question: 'Môžem si priviesť domáce zviera?', answer: 'Áno, domáce zvieratá sú vítané po dohode.' },
    { id: '3', question: 'Je k dispozícii parkovanie?', answer: 'Áno, bezplatné parkovanie pre 2 autá.' },
    { id: '4', question: 'Je v chate WiFi?', answer: 'Áno, vysokorýchlostné WiFi v celej chate.' },
  ],
  booking: { checkIn: '15:00', checkOut: '10:00' },
  customTexts: {},
  customImages: {},
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loaded, setLoaded] = useState(false);
  const [savedJson, setSavedJson] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setContent({ ...defaultContent, ...JSON.parse(saved) });
        setSavedJson(saved);
      } else {
        setSavedJson(JSON.stringify(defaultContent));
      }
      if (sessionStorage.getItem('chata_admin') === 'true') setIsAdmin(true);
    } catch (e) {}
    setLoaded(true);
  }, []);

  const hasUnsavedChanges = JSON.stringify(content) !== savedJson;

  const login = (pw: string) => {
    if (pw === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('chata_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditing(false);
    sessionStorage.removeItem('chata_admin');
  };

  const toggleEditing = () => setIsEditing(p => !p);

  const updateContent = (path: string, value: any) => {
    setContent(prev => {
      const c = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let curr: any = c;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!curr[keys[i]]) curr[keys[i]] = {};
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = value;
      return c;
    });
  };

  const getText = (key: string, def: string) => content.customTexts[key] || def;
  const setText = (key: string, val: string) => setContent(p => ({ ...p, customTexts: { ...p.customTexts, [key]: val } }));
  const getImage = (key: string, def: string) => content.customImages[key] || def;
  const setImage = (key: string, val: string) => setContent(p => ({ ...p, customImages: { ...p.customImages, [key]: val } }));

  // Gallery
  const addGalleryImage = (src: string, alt = 'Obrázok') => setContent(p => ({ ...p, gallery: [...p.gallery, { id: genId(), src, alt }] }));
  const removeGalleryImage = (id: string) => setContent(p => ({ ...p, gallery: p.gallery.filter(g => g.id !== id) }));
  const updateGalleryImage = (id: string, data: Partial<GalleryImage>) => setContent(p => ({ ...p, gallery: p.gallery.map(g => g.id === id ? { ...g, ...data } : g) }));
  const moveGalleryImage = (from: number, to: number) => setContent(p => {
    const g = [...p.gallery];
    const [item] = g.splice(from, 1);
    g.splice(to, 0, item);
    return { ...p, gallery: g };
  });

  // Reviews
  const addReview = (r: Omit<Review, 'id'>) => setContent(p => ({ ...p, reviews: [...p.reviews, { ...r, id: genId() }] }));
  const removeReview = (id: string) => setContent(p => ({ ...p, reviews: p.reviews.filter(r => r.id !== id) }));
  const updateReview = (id: string, data: Partial<Review>) => setContent(p => ({ ...p, reviews: p.reviews.map(r => r.id === id ? { ...r, ...data } : r) }));

  // FAQ
  const addFAQ = (f: Omit<FAQItem, 'id'>) => setContent(p => ({ ...p, faq: [...p.faq, { ...f, id: genId() }] }));
  const removeFAQ = (id: string) => setContent(p => ({ ...p, faq: p.faq.filter(f => f.id !== id) }));
  const updateFAQ = (id: string, data: Partial<FAQItem>) => setContent(p => ({ ...p, faq: p.faq.map(f => f.id === id ? { ...f, ...data } : f) }));

  // Persistence
  const saveAll = () => { const j = JSON.stringify(content); localStorage.setItem(STORAGE_KEY, j); setSavedJson(j); };
  const resetToDefaults = () => { setContent(defaultContent); localStorage.removeItem(STORAGE_KEY); setSavedJson(JSON.stringify(defaultContent)); };
  const exportData = () => JSON.stringify(content, null, 2);
  const importData = (json: string) => { try { setContent({ ...defaultContent, ...JSON.parse(json) }); return true; } catch { return false; } };

  if (!loaded) return null;

  return (
    <AdminContext.Provider value={{
      isAdmin, isEditing, login, logout, toggleEditing,
      content, updateContent, getText, setText, getImage, setImage,
      addGalleryImage, removeGalleryImage, updateGalleryImage, moveGalleryImage,
      addReview, removeReview, updateReview,
      addFAQ, removeFAQ, updateFAQ,
      saveAll, resetToDefaults, exportData, importData, hasUnsavedChanges,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
