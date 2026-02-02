'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
}

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  email: string;
  address: string;
  pricing: {
    weekend: { nights: number; price: number };
    reset: { nights: number; price: number };
    week: { nights: number; price: number };
  };
  gallery: GalleryImage[];
  checkIn: string;
  checkOut: string;
  customTexts: Record<string, string>;
}

interface AdminContextType {
  isAdmin: boolean;
  isEditing: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleEditing: () => void;
  content: SiteContent;
  updateContent: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  updateNestedContent: (path: string, value: any) => void;
  getText: (key: string, defaultValue: string) => string;
  setText: (key: string, value: string) => void;
  addGalleryImage: (src: string, alt?: string) => void;
  removeGalleryImage: (index: number) => void;
  moveGalleryImage: (from: number, to: number) => void;
  saveAll: () => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

const ADMIN_PASSWORD = 'ChataAdmin2025!';
const STORAGE_KEY = 'chata_admin_content';

const defaultContent: SiteContent = {
  heroTitle: 'Únik do ticha pod horami.',
  heroSubtitle: 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru.',
  phone: '+421 XXX XXX XXX',
  email: 'info@chataprikastieli.sk',
  address: 'Necpaly, Turiec, Slovensko',
  pricing: {
    weekend: { nights: 2, price: 170 },
    reset: { nights: 3, price: 255 },
    week: { nights: 7, price: 550 },
  },
  gallery: [
    { src: '/assets/gallery-1.jpg', alt: 'Interiér' },
    { src: '/assets/gallery-2.jpg', alt: 'Obývačka' },
    { src: '/assets/gallery-3.jpg', alt: 'Spálňa' },
    { src: '/assets/gallery-4.jpg', alt: 'Kuchyňa' },
    { src: '/assets/gallery-5.jpg', alt: 'Kúpeľňa' },
    { src: '/assets/gallery-6.jpg', alt: 'Terasa' },
    { src: '/assets/gallery-7.jpg', alt: 'Výhľad' },
    { src: '/assets/gallery-8.jpg', alt: 'Detail' },
    { src: '/assets/gallery-9.jpg', alt: 'Okolie' },
    { src: '/assets/gallery-10.jpg', alt: 'Exteriér' },
  ],
  checkIn: '15:00',
  checkOut: '10:00',
  customTexts: {},
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContent({ ...defaultContent, ...JSON.parse(saved) });
      if (sessionStorage.getItem('chata_admin') === 'true') setIsAdmin(true);
    } catch (e) {}
    setLoaded(true);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
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

  const updateContent = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedContent = (path: string, value: any) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const getText = (key: string, defaultValue: string): string => content.customTexts[key] || defaultValue;
  const setText = (key: string, value: string) => {
    setContent(prev => ({ ...prev, customTexts: { ...prev.customTexts, [key]: value } }));
  };

  const addGalleryImage = (src: string, alt: string = 'Obrázok') => {
    setContent(prev => ({ ...prev, gallery: [...prev.gallery, { src, alt }] }));
  };

  const removeGalleryImage = (index: number) => {
    setContent(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const moveGalleryImage = (from: number, to: number) => {
    setContent(prev => {
      const g = [...prev.gallery];
      const [item] = g.splice(from, 1);
      g.splice(to, 0, item);
      return { ...prev, gallery: g };
    });
  };

  const saveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    alert('✅ Uložené!');
  };

  const resetToDefaults = () => {
    if (confirm('Obnoviť predvolené hodnoty?')) {
      setContent(defaultContent);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportData = () => JSON.stringify(content, null, 2);
  const importData = (json: string): boolean => {
    try {
      setContent({ ...defaultContent, ...JSON.parse(json) });
      return true;
    } catch { return false; }
  };

  if (!loaded) return null;

  return (
    <AdminContext.Provider value={{
      isAdmin, isEditing, login, logout, toggleEditing,
      content, updateContent, updateNestedContent, getText, setText,
      addGalleryImage, removeGalleryImage, moveGalleryImage,
      saveAll, resetToDefaults, exportData, importData,
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
