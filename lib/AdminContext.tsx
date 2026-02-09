'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ============================================================
// TYPES
// ============================================================
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: 'interior' | 'exterior' | 'surroundings' | 'activities';
  order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  source?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PricingPeriod {
  id: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  pricePerNight: number;
  minNights: number;
  color: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  instagram?: string;
  facebook?: string;
  airbnb?: string;
  bookingCom?: string;
}

export interface SiteContent {
  texts: { [key: string]: string };
  images: { [key: string]: string };
  gallery: GalleryImage[];
  reviews: Review[];
  faq: FAQItem[];
  pricing: PricingPeriod[];
  contact: ContactInfo;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  settings: {
    maxGuests: number;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    defaultLang: string;
    maintenanceMode: boolean;
    bookingEnabled: boolean;
  };
}

export interface AdminContextType {
  // Auth
  isAdmin: boolean;
  isEditing: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  toggleEditing: () => void;

  // Content
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  getText: (key: string) => string;
  setText: (key: string, value: string) => void;
  getImage: (key: string) => string;
  setImage: (key: string, url: string) => void;

  // Gallery
  addGalleryImage: (image: Omit<GalleryImage, 'id' | 'order'>) => void;
  removeGalleryImage: (id: string) => void;
  updateGalleryImage: (id: string, data: Partial<GalleryImage>) => void;
  moveGalleryImage: (id: string, direction: 'up' | 'down') => void;

  // Reviews
  addReview: (review: Omit<Review, 'id'>) => void;
  removeReview: (id: string) => void;
  updateReview: (id: string, data: Partial<Review>) => void;

  // FAQ
  addFAQ: (faq: Omit<FAQItem, 'id' | 'order'>) => void;
  removeFAQ: (id: string) => void;
  updateFAQ: (id: string, data: Partial<FAQItem>) => void;
  moveFAQ: (id: string, direction: 'up' | 'down') => void;

  // Pricing
  addPricing: (period: Omit<PricingPeriod, 'id'>) => void;
  removePricing: (id: string) => void;
  updatePricing: (id: string, data: Partial<PricingPeriod>) => void;

  // Upload
  uploadImage: (file: File) => Promise<string | null>;

  // Persistence
  saveAll: () => Promise<boolean>;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  isSaving: boolean;
  isLoading: boolean;
  saveError: string | null;
}

// ============================================================
// DEFAULTS
// ============================================================
const AUTH_KEY = 'chata-admin-token';
const genId = () => Math.random().toString(36).substring(2, 10);

const emptyContent: SiteContent = {
  texts: {},
  images: {},
  gallery: [],
  reviews: [],
  faq: [],
  pricing: [],
  contact: { phone: '', email: '', address: '', mapUrl: '' },
  seo: { title: '', description: '', keywords: '', ogImage: '' },
  settings: { maxGuests: 6, checkInTime: '15:00', checkOutTime: '10:00', currency: 'EUR', defaultLang: 'sk', maintenanceMode: false, bookingEnabled: true },
};

// ============================================================
// API HELPERS
// ============================================================
function getToken(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(AUTH_KEY) || '';
}

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

async function apiPut<T>(url: string, data: any): Promise<T> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': getToken() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `PUT ${url} failed: ${res.status}`);
  }
  return res.json();
}

async function apiUpload(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin-upload', {
    method: 'POST',
    headers: { 'x-admin-token': getToken() },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

// ============================================================
// CONTEXT
// ============================================================
const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [serverContent, setServerContent] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load content from server on mount
  useEffect(() => {
    async function loadContent() {
      try {
        const data = await apiGet<SiteContent>('/api/admin-content');
        setContent(data);
        setServerContent(JSON.stringify(data));
      } catch (err) {
        console.error('Failed to load content:', err);
      } finally {
        setIsLoading(false);
        setLoaded(true);
      }
    }

    loadContent();

    // Check existing auth
    const token = sessionStorage.getItem(AUTH_KEY);
    if (token) setIsAdmin(true);
  }, []);

  const hasUnsavedChanges = loaded && JSON.stringify(content) !== serverContent;

  // Auth
  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem(AUTH_KEY, token);
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditing(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const toggleEditing = () => setIsEditing(prev => !prev);

  // Content updates (local state, saved to server on saveAll)
  const updateContent = (updates: Partial<SiteContent>) => {
    setContent(prev => ({ ...prev, ...updates }));
    setSaveError(null);
  };

  const getText = (key: string) => content.texts[key] || key;
  const setText = (key: string, value: string) => {
    setContent(prev => ({ ...prev, texts: { ...prev.texts, [key]: value } }));
  };

  const getImage = (key: string) => content.images[key] || '';
  const setImage = (key: string, url: string) => {
    setContent(prev => ({ ...prev, images: { ...prev.images, [key]: url } }));
  };

  // Gallery
  const addGalleryImage = (image: Omit<GalleryImage, 'id' | 'order'>) => {
    setContent(prev => ({
      ...prev,
      gallery: [...prev.gallery, { ...image, id: genId(), order: prev.gallery.length }],
    }));
  };
  const removeGalleryImage = (id: string) => {
    setContent(prev => ({
      ...prev,
      gallery: prev.gallery.filter(g => g.id !== id).map((g, i) => ({ ...g, order: i })),
    }));
  };
  const updateGalleryImage = (id: string, data: Partial<GalleryImage>) => {
    setContent(prev => ({
      ...prev,
      gallery: prev.gallery.map(g => g.id === id ? { ...g, ...data } : g),
    }));
  };
  const moveGalleryImage = (id: string, direction: 'up' | 'down') => {
    setContent(prev => {
      const arr = [...prev.gallery].sort((a, b) => a.order - b.order);
      const idx = arr.findIndex(g => g.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return { ...prev, gallery: arr.map((g, i) => ({ ...g, order: i })) };
    });
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id'>) => {
    setContent(prev => ({ ...prev, reviews: [...prev.reviews, { ...review, id: genId() }] }));
  };
  const removeReview = (id: string) => {
    setContent(prev => ({ ...prev, reviews: prev.reviews.filter(r => r.id !== id) }));
  };
  const updateReview = (id: string, data: Partial<Review>) => {
    setContent(prev => ({ ...prev, reviews: prev.reviews.map(r => r.id === id ? { ...r, ...data } : r) }));
  };

  // FAQ
  const addFAQ = (faq: Omit<FAQItem, 'id' | 'order'>) => {
    setContent(prev => ({
      ...prev,
      faq: [...prev.faq, { ...faq, id: genId(), order: prev.faq.length }],
    }));
  };
  const removeFAQ = (id: string) => {
    setContent(prev => ({
      ...prev,
      faq: prev.faq.filter(f => f.id !== id).map((f, i) => ({ ...f, order: i })),
    }));
  };
  const updateFAQ = (id: string, data: Partial<FAQItem>) => {
    setContent(prev => ({ ...prev, faq: prev.faq.map(f => f.id === id ? { ...f, ...data } : f) }));
  };
  const moveFAQ = (id: string, direction: 'up' | 'down') => {
    setContent(prev => {
      const arr = [...prev.faq].sort((a, b) => a.order - b.order);
      const idx = arr.findIndex(f => f.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return { ...prev, faq: arr.map((f, i) => ({ ...f, order: i })) };
    });
  };

  // Pricing
  const addPricing = (period: Omit<PricingPeriod, 'id'>) => {
    setContent(prev => ({ ...prev, pricing: [...prev.pricing, { ...period, id: genId() }] }));
  };
  const removePricing = (id: string) => {
    setContent(prev => ({ ...prev, pricing: prev.pricing.filter(p => p.id !== id) }));
  };
  const updatePricing = (id: string, data: Partial<PricingPeriod>) => {
    setContent(prev => ({ ...prev, pricing: prev.pricing.map(p => p.id === id ? { ...p, ...data } : p) }));
  };

  // Upload image to server
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const result = await apiUpload(file);
      return result.url;
    } catch (err: any) {
      setSaveError(err.message);
      return null;
    }
  };

  // Save to server
  const saveAll = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await apiPut('/api/admin-content', content);
      const json = JSON.stringify(content);
      setServerContent(json);
      setLastSaved(new Date());
      return true;
    } catch (err: any) {
      console.error('Save failed:', err);
      setSaveError(err.message || 'Uloženie zlyhalo');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [content]);

  const resetToDefaults = () => {
    setContent(emptyContent);
  };

  const exportData = () => JSON.stringify(content, null, 2);

  const importData = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      setContent(prev => ({ ...prev, ...parsed }));
      return true;
    } catch {
      return false;
    }
  };

  if (!loaded) return null;

  return (
    <AdminContext.Provider
      value={{
        isAdmin, isEditing, login, logout, toggleEditing,
        content, updateContent, getText, setText, getImage, setImage,
        addGalleryImage, removeGalleryImage, updateGalleryImage, moveGalleryImage,
        addReview, removeReview, updateReview,
        addFAQ, removeFAQ, updateFAQ, moveFAQ,
        addPricing, removePricing, updatePricing,
        uploadImage,
        saveAll, resetToDefaults, exportData, importData,
        hasUnsavedChanges, lastSaved, isSaving, isLoading, saveError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
