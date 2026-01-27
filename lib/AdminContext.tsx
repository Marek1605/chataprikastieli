'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isEditing: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleEditing: () => void;
  saveAll: () => void;
  content: Record<string, string>;
  updateContent: (key: string, value: string) => void;
  gallery: string[];
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const ADMIN_PASSWORD = 'chata2024';

const defaultContent: Record<string, string> = {
  'hero.title': 'Únik do ticha pod horami.',
  'hero.subtitle': 'Luxusná horská chata s panoramatickým výhľadom na Malú Fatru.',
  'contact.phone': '+421 XXX XXX XXX',
  'contact.email': 'info@chataprikastieli.sk',
};

const defaultGallery = [
  '/assets/gallery-1.jpg', '/assets/gallery-2.jpg', '/assets/gallery-3.jpg',
  '/assets/gallery-4.jpg', '/assets/gallery-5.jpg', '/assets/gallery-6.jpg',
  '/assets/gallery-7.jpg', '/assets/gallery-8.jpg', '/assets/gallery-9.jpg',
  '/assets/gallery-10.jpg',
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<Record<string, string>>(defaultContent);
  const [gallery, setGallery] = useState<string[]>(defaultGallery);

  useEffect(() => {
    const savedContent = localStorage.getItem('chata_content');
    if (savedContent) try { setContent({ ...defaultContent, ...JSON.parse(savedContent) }); } catch {}
    const savedGallery = localStorage.getItem('chata_gallery');
    if (savedGallery) try { setGallery(JSON.parse(savedGallery)); } catch {}
    if (sessionStorage.getItem('chata_admin') === 'true') setIsAdmin(true);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('chata_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => { setIsAdmin(false); setIsEditing(false); sessionStorage.removeItem('chata_admin'); };
  const toggleEditing = () => setIsEditing(!isEditing);
  const updateContent = (key: string, value: string) => setContent(prev => ({ ...prev, [key]: value }));
  
  const saveAll = () => {
    localStorage.setItem('chata_content', JSON.stringify(content));
    localStorage.setItem('chata_gallery', JSON.stringify(gallery));
    alert('✅ Uložené!');
  };

  const addImage = (url: string) => setGallery(prev => [...prev, url]);
  const removeImage = (index: number) => setGallery(prev => prev.filter((_, i) => i !== index));

  return (
    <AdminContext.Provider value={{ isAdmin, isEditing, login, logout, toggleEditing, saveAll, content, updateContent, gallery, addImage, removeImage }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
