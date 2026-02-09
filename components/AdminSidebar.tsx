'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import type { GalleryImage } from '@/lib/AdminContext';

// ============================================================
// TYPES
// ============================================================
type Tab = 'content' | 'gallery' | 'pricing' | 'reviews' | 'faq' | 'contact' | 'seo' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'content', label: 'Obsah', icon: '📝' },
  { id: 'gallery', label: 'Galéria', icon: '🖼️' },
  { id: 'pricing', label: 'Cenník', icon: '💰' },
  { id: 'reviews', label: 'Recenzie', icon: '⭐' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'contact', label: 'Kontakt', icon: '📞' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'settings', label: 'Nastavenia', icon: '⚙️' },
];

// ============================================================
// SMALL UI COMPONENTS
// ============================================================
function Input({ label, value, onChange, type = 'text', placeholder, multiline, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; multiline?: boolean; rows?: number;
}) {
  const cls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all';
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
      ) : (
        <input className={cls} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function Card({ title, children, actions, collapsible }: {
  title: string; children: React.ReactNode; actions?: React.ReactNode; collapsible?: boolean;
}) {
  const [open, setOpen] = useState(!collapsible);
  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-3 ${collapsible ? 'cursor-pointer hover:bg-white/[0.02]' : ''}`}
        onClick={() => collapsible && setOpen(!open)}>
        <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">{title}</h4>
        <div className="flex items-center gap-2">
          {actions}
          {collapsible && <span className={`text-white/30 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>}
        </div>
      </div>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function ConfirmButton({ onClick, label, className = '' }: { onClick: () => void; label: string; className?: string }) {
  const [c, setC] = useState(false);
  useEffect(() => { if (c) { const t = setTimeout(() => setC(false), 3000); return () => clearTimeout(t); } }, [c]);
  return (
    <button onClick={e => { e.stopPropagation(); if (c) { onClick(); setC(false); } else setC(true); }}
      className={`text-xs px-2.5 py-1 rounded-lg transition-all ${c ? 'bg-red-500 text-white' : `bg-white/5 text-red-400 hover:bg-red-500/10 ${className}`}`}>
      {c ? 'Potvrdiť?' : label}
    </button>
  );
}

// ============================================================
// IMAGE UPLOAD COMPONENT
// ============================================================
function ImageUploader({ onUploaded, label = 'Nahrať obrázok' }: { onUploaded: (url: string) => void; label?: string }) {
  const { uploadImage } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploading(true);
    setError('');
    setProgress(`Nahrávam ${file.name} (${(file.size / 1024).toFixed(0)}KB)...`);

    try {
      const url = await uploadImage(file);
      if (url) {
        onUploaded(url);
        setProgress('');
      } else {
        setError('Upload zlyhal');
      }
    } catch (err: any) {
      setError(err.message || 'Upload zlyhal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className={`w-full py-3 border-2 border-dashed rounded-xl text-xs font-medium transition-all ${
          uploading ? 'border-blue-500/30 bg-blue-500/5 text-blue-400 animate-pulse' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 hover:bg-white/[0.02]'
        }`}
      >
        {uploading ? progress : `📁 ${label}`}
      </button>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleFile} />
      {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
    </div>
  );
}

// ============================================================
// TAB: CONTENT
// ============================================================
function ContentTab() {
  const { content, setText } = useAdmin();
  const groups = [
    { name: 'Hero', prefix: 'hero.' },
    { name: 'Prehľad', prefix: 'overview.' },
    { name: 'Ostatné sekcie', prefix: '' },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/40 italic">Upravte texty stránky. Po úprave kliknite Uložiť.</p>
      {groups.map(g => {
        const keys = Object.keys(content.texts).filter(k =>
          g.prefix ? k.startsWith(g.prefix) : !k.startsWith('hero.') && !k.startsWith('overview.')
        );
        if (!keys.length) return null;
        return (
          <Card key={g.name} title={g.name} collapsible>
            {keys.map(k => (
              <Input key={k} label={k} value={content.texts[k] || ''} onChange={v => setText(k, v)}
                multiline={k.includes('text') || k.includes('subtitle') || k.includes('description')} />
            ))}
          </Card>
        );
      })}
    </div>
  );
}

// ============================================================
// TAB: GALLERY (with real upload)
// ============================================================
function GalleryTab() {
  const { content, addGalleryImage, removeGalleryImage, updateGalleryImage, moveGalleryImage } = useAdmin();
  const sorted = [...content.gallery].sort((a, b) => a.order - b.order);
  const categories: GalleryImage['category'][] = ['interior', 'exterior', 'surroundings', 'activities'];
  const catLabels: Record<string, string> = { interior: 'Interiér', exterior: 'Exteriér', surroundings: 'Okolie', activities: 'Aktivity' };
  const [newCat, setNewCat] = useState<GalleryImage['category']>('interior');

  return (
    <div className="space-y-3">
      <Card title={`Obrázky (${sorted.length})`}>
        {sorted.length === 0 ? (
          <p className="text-xs text-white/30 italic py-4 text-center">Žiadne obrázky. Nahrajte prvý.</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {sorted.map((img, idx) => (
              <div key={img.id} className="group flex items-start gap-2 p-2 bg-white/[0.03] rounded-lg hover:bg-white/[0.06] transition-all">
                <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <input className="w-full bg-transparent text-xs text-white border-b border-transparent hover:border-white/10 focus:border-blue-500/50 focus:outline-none py-0.5 truncate"
                    value={img.alt} onChange={e => updateGalleryImage(img.id, { alt: e.target.value })} placeholder="Popis..." />
                  <div className="flex items-center gap-2">
                    <select className="bg-white/5 text-[10px] text-white/60 rounded px-1.5 py-0.5 border border-white/10"
                      value={img.category} onChange={e => updateGalleryImage(img.id, { category: e.target.value as GalleryImage['category'] })}>
                      {categories.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{catLabels[c]}</option>)}
                    </select>
                    <span className="text-[10px] text-white/20 truncate flex-1">{img.url}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveGalleryImage(img.id, 'up')} disabled={idx === 0} className="p-1 hover:bg-white/10 rounded text-[10px] disabled:opacity-20">▲</button>
                  <button onClick={() => moveGalleryImage(img.id, 'down')} disabled={idx === sorted.length - 1} className="p-1 hover:bg-white/10 rounded text-[10px] disabled:opacity-20">▼</button>
                  <button onClick={() => removeGalleryImage(img.id)} className="p-1 hover:bg-red-500/20 text-red-400 rounded text-[10px]">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Pridať obrázok">
        <div className="space-y-1 mb-2">
          <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Kategória pre nové obrázky</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={newCat} onChange={e => setNewCat(e.target.value as GalleryImage['category'])}>
            {categories.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{catLabels[c]}</option>)}
          </select>
        </div>
        <ImageUploader label="Nahrať fotku z počítača" onUploaded={url => {
          addGalleryImage({ url, alt: 'Nový obrázok', category: newCat });
        }} />
      </Card>
    </div>
  );
}

// ============================================================
// TAB: PRICING
// ============================================================
function PricingTab() {
  const { content, addPricing, removePricing, updatePricing } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [np, setNp] = useState({ name: '', dateFrom: '', dateTo: '', pricePerNight: 0, minNights: 1, color: '#3498db' });

  return (
    <div className="space-y-3">
      {content.pricing.map(p => (
        <Card key={p.id} title={`${p.name} — ${p.pricePerNight}€/noc`} collapsible actions={<ConfirmButton onClick={() => removePricing(p.id)} label="Zmazať" />}>
          <Input label="Názov" value={p.name} onChange={v => updatePricing(p.id, { name: v })} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Od" value={p.dateFrom} onChange={v => updatePricing(p.id, { dateFrom: v })} type="date" />
            <Input label="Do" value={p.dateTo} onChange={v => updatePricing(p.id, { dateTo: v })} type="date" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Cena/noc</label>
              <div className="flex items-center gap-1">
                <input className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                  type="number" value={p.pricePerNight} onChange={e => updatePricing(p.id, { pricePerNight: +e.target.value })} />
                <span className="text-xs text-white/40">€</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Min. nocí</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                type="number" value={p.minNights} onChange={e => updatePricing(p.id, { minNights: +e.target.value })} min={1} />
            </div>
          </div>
        </Card>
      ))}
      {adding ? (
        <Card title="Nové obdobie">
          <Input label="Názov" value={np.name} onChange={v => setNp(x => ({ ...x, name: v }))} placeholder="Napr. Vianočná sezóna" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Od" value={np.dateFrom} onChange={v => setNp(x => ({ ...x, dateFrom: v }))} type="date" />
            <Input label="Do" value={np.dateTo} onChange={v => setNp(x => ({ ...x, dateTo: v }))} type="date" />
          </div>
          <div className="space-y-1"><label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Cena/noc (€)</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" type="number" value={np.pricePerNight} onChange={e => setNp(x => ({ ...x, pricePerNight: +e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (np.name && np.pricePerNight > 0) { addPricing(np); setNp({ name: '', dateFrom: '', dateTo: '', pricePerNight: 0, minNights: 1, color: '#3498db' }); setAdding(false); } }}
              className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30">Pridať</button>
            <button onClick={() => setAdding(false)} className="flex-1 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10">Zrušiť</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-all">+ Pridať obdobie</button>
      )}
    </div>
  );
}

// ============================================================
// TAB: REVIEWS
// ============================================================
function ReviewsTab() {
  const { content, addReview, removeReview, updateReview } = useAdmin();
  const [adding, setAdding] = useState(false);
  const [nr, setNr] = useState({ name: '', rating: 5, text: '', date: '', source: '' });

  return (
    <div className="space-y-3">
      {content.reviews.map(r => (
        <Card key={r.id} title={`${r.name} ${'★'.repeat(r.rating)}`} collapsible actions={<ConfirmButton onClick={() => removeReview(r.id)} label="Zmazať" />}>
          <Input label="Meno" value={r.name} onChange={v => updateReview(r.id, { name: v })} />
          <div className="flex gap-1 py-1">{[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => updateReview(r.id, { rating: n })} className={`text-lg ${n <= r.rating ? 'text-yellow-400' : 'text-white/10'}`}>★</button>
          ))}</div>
          <Input label="Text" value={r.text} onChange={v => updateReview(r.id, { text: v })} multiline />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Dátum" value={r.date} onChange={v => updateReview(r.id, { date: v })} placeholder="2024-12" />
            <Input label="Zdroj" value={r.source || ''} onChange={v => updateReview(r.id, { source: v })} placeholder="Airbnb" />
          </div>
        </Card>
      ))}
      {adding ? (
        <Card title="Nová recenzia">
          <Input label="Meno" value={nr.name} onChange={v => setNr(x => ({ ...x, name: v }))} />
          <div className="flex gap-1 py-1">{[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setNr(x => ({ ...x, rating: n }))} className={`text-lg ${n <= nr.rating ? 'text-yellow-400' : 'text-white/10'}`}>★</button>
          ))}</div>
          <Input label="Text" value={nr.text} onChange={v => setNr(x => ({ ...x, text: v }))} multiline />
          <div className="flex gap-2">
            <button onClick={() => { if (nr.name && nr.text) { addReview(nr); setNr({ name: '', rating: 5, text: '', date: '', source: '' }); setAdding(false); } }}
              className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30">Pridať</button>
            <button onClick={() => setAdding(false)} className="flex-1 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10">Zrušiť</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-all">+ Pridať recenziu</button>
      )}
    </div>
  );
}

// ============================================================
// TAB: FAQ
// ============================================================
function FAQTab() {
  const { content, addFAQ, removeFAQ, updateFAQ, moveFAQ } = useAdmin();
  const sorted = [...content.faq].sort((a, b) => a.order - b.order);
  const [adding, setAdding] = useState(false);
  const [nf, setNf] = useState({ question: '', answer: '' });

  return (
    <div className="space-y-3">
      {sorted.map((f, idx) => (
        <Card key={f.id} title={f.question.substring(0, 40) + (f.question.length > 40 ? '...' : '')} collapsible actions={
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button onClick={() => moveFAQ(f.id, 'up')} disabled={idx === 0} className="p-1 hover:bg-white/10 rounded text-[10px] disabled:opacity-20">▲</button>
            <button onClick={() => moveFAQ(f.id, 'down')} disabled={idx === sorted.length - 1} className="p-1 hover:bg-white/10 rounded text-[10px] disabled:opacity-20">▼</button>
            <ConfirmButton onClick={() => removeFAQ(f.id)} label="✕" />
          </div>
        }>
          <Input label="Otázka" value={f.question} onChange={v => updateFAQ(f.id, { question: v })} />
          <Input label="Odpoveď" value={f.answer} onChange={v => updateFAQ(f.id, { answer: v })} multiline rows={4} />
        </Card>
      ))}
      {adding ? (
        <Card title="Nová otázka">
          <Input label="Otázka" value={nf.question} onChange={v => setNf(x => ({ ...x, question: v }))} />
          <Input label="Odpoveď" value={nf.answer} onChange={v => setNf(x => ({ ...x, answer: v }))} multiline rows={4} />
          <div className="flex gap-2">
            <button onClick={() => { if (nf.question && nf.answer) { addFAQ(nf); setNf({ question: '', answer: '' }); setAdding(false); } }}
              className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30">Pridať</button>
            <button onClick={() => setAdding(false)} className="flex-1 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10">Zrušiť</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-all">+ Pridať FAQ</button>
      )}
    </div>
  );
}

// ============================================================
// TAB: CONTACT
// ============================================================
function ContactTab() {
  const { content, updateContent } = useAdmin();
  const c = content.contact;
  const u = (d: Partial<typeof c>) => updateContent({ contact: { ...c, ...d } });

  return (
    <div className="space-y-3">
      <Card title="Kontaktné údaje">
        <Input label="Telefón" value={c.phone} onChange={v => u({ phone: v })} placeholder="+421..." />
        <Input label="Email" value={c.email} onChange={v => u({ email: v })} />
        <Input label="Adresa" value={c.address} onChange={v => u({ address: v })} />
        <Input label="Google Maps URL" value={c.mapUrl || ''} onChange={v => u({ mapUrl: v })} placeholder="https://maps..." />
      </Card>
      <Card title="Sociálne siete" collapsible>
        <Input label="Instagram" value={c.instagram || ''} onChange={v => u({ instagram: v })} placeholder="@chataprikastieli" />
        <Input label="Facebook" value={c.facebook || ''} onChange={v => u({ facebook: v })} placeholder="https://facebook.com/..." />
        <Input label="Airbnb" value={c.airbnb || ''} onChange={v => u({ airbnb: v })} />
        <Input label="Booking.com" value={c.bookingCom || ''} onChange={v => u({ bookingCom: v })} />
      </Card>
    </div>
  );
}

// ============================================================
// TAB: SEO
// ============================================================
function SEOTab() {
  const { content, updateContent } = useAdmin();
  const s = content.seo;
  const u = (d: Partial<typeof s>) => updateContent({ seo: { ...s, ...d } });

  return (
    <div className="space-y-3">
      <Card title="SEO">
        <Input label="Titulok" value={s.title} onChange={v => u({ title: v })} />
        <Input label="Meta popis" value={s.description} onChange={v => u({ description: v })} multiline />
        <Input label="Kľúčové slová" value={s.keywords} onChange={v => u({ keywords: v })} multiline rows={2} />
        <Input label="OG obrázok" value={s.ogImage} onChange={v => u({ ogImage: v })} />
      </Card>
    </div>
  );
}

// ============================================================
// TAB: SETTINGS
// ============================================================
function SettingsTab() {
  const { content, updateContent, resetToDefaults, exportData, importData, lastSaved } = useAdmin();
  const s = content.settings;
  const u = (d: Partial<typeof s>) => updateContent({ settings: { ...s, ...d } });
  const importRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState('');

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `chata-backup-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result as string);
      setImportStatus(ok ? '✓ Importované' : '✕ Chyba'); setTimeout(() => setImportStatus(''), 3000);
    };
    reader.readAsText(file); e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <Card title="Všeobecné">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Max. hostí</label>
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" type="number"
            value={s.maxGuests} onChange={e => u({ maxGuests: +e.target.value })} min={1} max={20} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Check-in" value={s.checkInTime} onChange={v => u({ checkInTime: v })} type="time" />
          <Input label="Check-out" value={s.checkOutTime} onChange={v => u({ checkOutTime: v })} type="time" />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-white">Rezervácie zapnuté</span>
          <button onClick={() => u({ bookingEnabled: !s.bookingEnabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${s.bookingEnabled ? 'bg-green-500' : 'bg-white/10'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${s.bookingEnabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div><span className="text-sm text-white">Údržbový mód</span><p className="text-[10px] text-white/30">Stránka zobrazí Údržba</p></div>
          <button onClick={() => u({ maintenanceMode: !s.maintenanceMode })}
            className={`relative w-11 h-6 rounded-full transition-colors ${s.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${s.maintenanceMode ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </Card>
      <Card title="Zálohovanie" collapsible>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30">📥 Export</button>
          <button onClick={() => importRef.current?.click()} className="flex-1 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/30">
            {importStatus || '📤 Import'}
          </button>
        </div>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        {lastSaved && <p className="text-[10px] text-white/30 text-center">Naposledy uložené: {lastSaved.toLocaleString('sk-SK')}</p>}
      </Card>
      <Card title="Nebezpečná zóna" collapsible>
        <ConfirmButton onClick={resetToDefaults} label="Obnoviť predvolené" />
      </Card>
    </div>
  );
}

// ============================================================
// MAIN SIDEBAR
// ============================================================
export default function AdminSidebar() {
  const { isAdmin, isEditing, login, logout, toggleEditing, saveAll, hasUnsavedChanges, isSaving, saveError } = useAdmin();

  const [hidden, setHidden] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [saveFlash, setSaveFlash] = useState(false);

  // Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        isAdmin ? setHidden(h => !h) : setShowLogin(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAdmin]);

  // Unsaved warning
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleLogin = async () => {
    const ok = await login(password);
    if (ok) { setShowLogin(false); setHidden(false); setPassword(''); setLoginError(''); }
    else setLoginError('Nesprávne heslo');
  };

  const handleSave = async () => {
    const ok = await saveAll();
    if (ok) { setSaveFlash(true); setTimeout(() => setSaveFlash(false), 2000); }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'content': return <ContentTab />;
      case 'gallery': return <GalleryTab />;
      case 'pricing': return <PricingTab />;
      case 'reviews': return <ReviewsTab />;
      case 'faq': return <FAQTab />;
      case 'contact': return <ContactTab />;
      case 'seo': return <SEOTab />;
      case 'settings': return <SettingsTab />;
    }
  };

  // LOGIN MODAL
  if (showLogin && !isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowLogin(false)}>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">⛰️</div>
            <h3 className="text-lg font-bold text-white">Chata Admin</h3>
            <p className="text-xs text-white/40 mt-1">Zadajte heslo</p>
          </div>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLoginError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Heslo..." autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 mb-3" />
          {loginError && <p className="text-red-400 text-xs text-center mb-3">{loginError}</p>}
          <button onClick={handleLogin} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all">Prihlásiť</button>
        </div>
      </div>
    );
  }

  // TRIGGER BUTTON
  if (!isAdmin || hidden) {
    return (
      <button onClick={() => isAdmin ? setHidden(false) : setShowLogin(true)}
        className="fixed bottom-4 left-4 z-[9999] w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-xl flex items-center justify-center text-white/30 hover:text-white/80 transition-all border border-white/5 hover:border-white/20 group"
        title="Admin (Ctrl+Shift+A)">
        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  // COLLAPSED
  if (collapsed) {
    return (
      <aside className="fixed top-0 left-0 h-full w-14 bg-[#111] border-r border-white/[0.06] z-[9999] flex flex-col items-center py-3 gap-1 shadow-2xl">
        <button onClick={() => setCollapsed(false)} className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center text-sm mb-2">⛰️</button>
        <button onClick={toggleEditing} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${isEditing ? 'bg-yellow-500/20 text-yellow-400' : 'hover:bg-white/5 text-white/40'}`} title="Editovať">✏️</button>
        <button onClick={handleSave} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${saveFlash ? 'bg-green-500/20 text-green-400' : hasUnsavedChanges ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/5 text-white/20'}`} title="Uložiť">💾</button>
        <div className="w-8 h-px bg-white/10 my-1" />
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setCollapsed(false); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-white/30 hover:bg-white/5'}`} title={t.label}>{t.icon}</button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setHidden(true)} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:bg-white/5" title="Schovať">✕</button>
      </aside>
    );
  }

  // FULL SIDEBAR
  return (
    <aside className="fixed top-0 left-0 h-full w-80 bg-[#111] border-r border-white/[0.06] z-[9999] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-base shadow-lg shadow-blue-500/10">⛰️</div>
          <div><p className="text-sm font-bold text-white">Chata Admin</p><p className="text-[10px] text-white/30">Server-side ukladanie</p></div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setCollapsed(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/30" title="Zbaliť">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setHidden(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-white/30" title="Schovať">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 px-4 py-3 border-b border-white/[0.06]">
        <button onClick={toggleEditing}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${isEditing ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
          {isEditing ? '✏️ Editovanie ON' : '👁️ Editovať'}
        </button>
        <button onClick={handleSave} disabled={!hasUnsavedChanges && !saveFlash}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            saveFlash ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
            : isSaving ? 'bg-blue-500/20 text-blue-400 animate-pulse'
            : hasUnsavedChanges ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/20'
            : 'bg-white/5 text-white/20'
          }`}>
          {saveFlash ? '✓ Uložené!' : isSaving ? 'Ukladám...' : hasUnsavedChanges ? '💾 Uložiť*' : '💾 Uložené'}
        </button>
      </div>

      {/* Error */}
      {saveError && (
        <div className="mx-3 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">{saveError}</div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-white/[0.06]">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-white/35 hover:bg-white/5'}`}>
            <span className="text-xs">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">{renderTab()}</div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-white/30">Prihlásený</span>
        </div>
        <button onClick={logout} className="text-[10px] text-red-400/60 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10">Odhlásiť</button>
      </div>
    </aside>
  );
}
