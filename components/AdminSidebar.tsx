'use client';
import { useState, useCallback } from 'react';
import { useAdmin } from '@/lib/AdminContext';

type Tab = 'hero' | 'reset' | 'overview' | 'gallery' | 'amenities' | 'atmosphere' | 'pricing' | 'booking' | 'surroundings' | 'reviews' | 'faq' | 'contact' | 'footer' | 'nav' | 'settings';

export default function AdminSidebar() {
  const { data, isAdmin, setAdmin, updateSection, resetAll, uploadImage: serverUpload, saving } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState<Tab>('hero');
  const [status, setStatus] = useState('');

  const flash = useCallback((m: string) => { setStatus(m); setTimeout(() => setStatus(''), 1500); }, []);

  const login = () => {
    if (pw === 'ChataAdmin2025!') {
      sessionStorage.setItem('chata_admin', 'true');
      setAdmin(true); setShowLogin(false); setPw('');
    } else alert('Zlé heslo!');
  };

  const logout = () => { sessionStorage.removeItem('chata_admin'); setAdmin(false); setShowPanel(false); };

  // Kompresia obrázkov - menšie súbory
  // Nahranie obrázka NA SERVER
  const uploadImage = useCallback((callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      flash('⏳ Nahrávam na server...');
      try {
        const url = await serverUpload(file);
        callback(url);
        flash('✅ Uložené na server!');
      } catch (err) {
        console.error('Upload error:', err);
        flash('❌ Chyba pri nahrávaní!');
      }
    };
    input.click();
  }, [serverUpload, flash]);

  if (!isAdmin) return (
    <>
      <button onClick={() => setShowLogin(true)} className="fixed bottom-4 left-4 w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-xl text-2xl z-50 shadow-xl border-2 border-amber-500">⚙️</button>
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500]" onClick={() => setShowLogin(false)}>
          <div className="bg-white p-6 rounded-xl w-80" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">🔐 Super Admin</h2>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Heslo" className="w-full p-3 border rounded-lg mb-3" onKeyDown={e => e.key === 'Enter' && login()} autoFocus />
            <button onClick={login} className="w-full p-3 bg-amber-500 text-white rounded-lg font-bold">Prihlásiť</button>
          </div>
        </div>
      )}
    </>
  );

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'hero', icon: '🏠', label: 'Hero' },
    { id: 'overview', icon: '📋', label: 'O chate' },
    { id: 'gallery', icon: '🖼️', label: 'Galéria' },
    { id: 'amenities', icon: '🛋️', label: 'Vybavenie' },
    { id: 'atmosphere', icon: '🌅', label: 'Atmosféra' },
    { id: 'pricing', icon: '💰', label: 'Cenník' },
    { id: 'booking', icon: '📅', label: 'Rezervácia' },
    { id: 'surroundings', icon: '🗺️', label: 'Okolie' },
    { id: 'reviews', icon: '⭐', label: 'Recenzie' },
    { id: 'faq', icon: '❓', label: 'FAQ' },
    { id: 'contact', icon: '📞', label: 'Kontakt' },
    { id: 'footer', icon: '📄', label: 'Footer' },
    { id: 'nav', icon: '🧭', label: 'Navigácia' },
    { id: 'reset', icon: '🔋', label: 'Reset pobyt' },
    { id: 'settings', icon: '⚙️', label: 'Reset' },
  ];

  const inputClass = "w-full p-2 border rounded text-sm";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";
  const btnClass = "w-full p-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm mb-2 cursor-pointer";
  const delBtnClass = "px-2 py-1 bg-red-500 text-white rounded text-xs";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[400] bg-gradient-to-r from-amber-600 to-orange-600 text-white p-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-bold">🔧 SUPER ADMIN</span>
          <button onClick={() => setShowPanel(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg">📝 Upraviť web</button>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="px-3 py-1 bg-white/20 rounded">{status}</span>}
          <button onClick={logout} className="px-4 py-2 bg-white text-amber-600 rounded-lg font-bold">Odhlásiť</button>
        </div>
      </div>

      {showPanel && (
        <div className="fixed inset-0 bg-black/50 z-[450]" onClick={() => setShowPanel(false)}>
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">📝 Super Admin</h2>
              <button onClick={() => setShowPanel(false)} className="text-2xl hover:text-white/70">✕</button>
            </div>

            <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 sticky top-[56px] z-10">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-2 py-1 rounded text-xs font-medium ${tab === t.id ? 'bg-amber-500 text-white' : 'bg-white border hover:bg-gray-100'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              
              {/* HERO */}
              {tab === 'hero' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">🏠 Hero sekcia</h3>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.hero.title} onChange={e => updateSection('hero', { title: e.target.value })} /></div>
                  <div><label className={labelClass}>Podtitulok</label><textarea className={inputClass} rows={3} value={data.hero.subtitle} onChange={e => updateSection('hero', { subtitle: e.target.value })} /></div>
                  <div><label className={labelClass}>Rating</label><input className={inputClass} value={data.hero.rating} onChange={e => updateSection('hero', { rating: e.target.value })} /></div>
                  <div><label className={labelClass}>Rating text</label><input className={inputClass} value={data.hero.ratingText} onChange={e => updateSection('hero', { ratingText: e.target.value })} /></div>
                  <div><label className={labelClass}>Tlačidlo 1</label><input className={inputClass} value={data.hero.cta1} onChange={e => updateSection('hero', { cta1: e.target.value })} /></div>
                  <div><label className={labelClass}>Tlačidlo 2</label><input className={inputClass} value={data.hero.cta2} onChange={e => updateSection('hero', { cta2: e.target.value })} /></div>
                  <button type="button" className={btnClass} onClick={() => uploadImage(src => updateSection('hero', { backgroundImage: src }))}>📁 Nahrať pozadie</button>
                  <p className="text-xs text-gray-500 font-medium">Badges:</p>
                  {data.hero.badges.map((b, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className="w-12 p-1 border rounded text-center" value={b.icon} onChange={e => { const badges = [...data.hero.badges]; badges[i] = { ...badges[i], icon: e.target.value }; updateSection('hero', { badges }); }} />
                      <input className="flex-1 p-1 border rounded" value={b.text} onChange={e => { const badges = [...data.hero.badges]; badges[i] = { ...badges[i], text: e.target.value }; updateSection('hero', { badges }); }} />
                      <button type="button" className={delBtnClass} onClick={() => updateSection('hero', { badges: data.hero.badges.filter((_, idx) => idx !== i) })}>✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateSection('hero', { badges: [...data.hero.badges, { icon: '✨', text: 'Nový' }] })} className="text-xs text-amber-600">+ Pridať</button>
                </div>
              )}

              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">📋 O chate</h3>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.overview.label} onChange={e => updateSection('overview', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.overview.title} onChange={e => updateSection('overview', { title: e.target.value })} /></div>
                  <div><label className={labelClass}>Popis</label><textarea className={inputClass} rows={3} value={data.overview.description} onChange={e => updateSection('overview', { description: e.target.value })} /></div>
                  <button type="button" className={btnClass} onClick={() => uploadImage(src => updateSection('overview', { image: src }))}>📁 Nahrať obrázok</button>
                  <p className="text-xs text-gray-500 font-medium">Vlastnosti:</p>
                  {data.overview.features.map((f, i) => (
                    <div key={f.id} className="flex gap-1 items-center bg-gray-50 p-2 rounded">
                      <input className="w-10 p-1 border rounded text-center text-sm" value={f.icon} onChange={e => { const features = [...data.overview.features]; features[i] = { ...features[i], icon: e.target.value }; updateSection('overview', { features }); }} />
                      <input className="flex-1 p-1 border rounded text-sm" value={f.title} onChange={e => { const features = [...data.overview.features]; features[i] = { ...features[i], title: e.target.value }; updateSection('overview', { features }); }} />
                      <input className="w-16 p-1 border rounded text-sm" value={f.value} onChange={e => { const features = [...data.overview.features]; features[i] = { ...features[i], value: e.target.value }; updateSection('overview', { features }); }} />
                      <button type="button" className={delBtnClass} onClick={() => updateSection('overview', { features: data.overview.features.filter(x => x.id !== f.id) })}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* GALLERY */}
              {tab === 'gallery' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🖼️ Galéria ({data.gallery.images.length})</h3>
                    <button type="button" onClick={() => uploadImage(src => updateSection('gallery', { images: [...data.gallery.images, { id: Date.now().toString(), src, alt: 'Nový' }] }))} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.gallery.label} onChange={e => updateSection('gallery', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.gallery.title} onChange={e => updateSection('gallery', { title: e.target.value })} /></div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {data.gallery.images.map((img, i) => (
                      <div key={img.id} className="relative group">
                        <img src={img.src} alt={img.alt} className="w-full h-16 object-cover rounded" />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded transition-opacity">
                          {i > 0 && <button type="button" onClick={() => { const imgs = [...data.gallery.images]; [imgs[i], imgs[i-1]] = [imgs[i-1], imgs[i]]; updateSection('gallery', { images: imgs }); }} className="w-5 h-5 bg-white rounded text-xs">←</button>}
                          <button type="button" onClick={() => updateSection('gallery', { images: data.gallery.images.filter(x => x.id !== img.id) })} className="w-5 h-5 bg-red-500 text-white rounded text-xs">✕</button>
                          {i < data.gallery.images.length - 1 && <button type="button" onClick={() => { const imgs = [...data.gallery.images]; [imgs[i], imgs[i+1]] = [imgs[i+1], imgs[i]]; updateSection('gallery', { images: imgs }); }} className="w-5 h-5 bg-white rounded text-xs">→</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AMENITIES */}
              {tab === 'amenities' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🛋️ Vybavenie ({data.amenities.categories.length})</h3>
                    <button type="button" onClick={() => updateSection('amenities', { categories: [...data.amenities.categories, { id: Date.now().toString(), icon: '✨', title: 'Nové', items: ['Položka'] }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.amenities.label} onChange={e => updateSection('amenities', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.amenities.title} onChange={e => updateSection('amenities', { title: e.target.value })} /></div>
                  {data.amenities.categories.map((a, i) => (
                    <div key={a.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input className="w-10 p-1 border rounded text-center" value={a.icon} onChange={e => { const c = [...data.amenities.categories]; c[i] = { ...c[i], icon: e.target.value }; updateSection('amenities', { categories: c }); }} />
                        <input className="flex-1 p-1 border rounded" value={a.title} onChange={e => { const c = [...data.amenities.categories]; c[i] = { ...c[i], title: e.target.value }; updateSection('amenities', { categories: c }); }} />
                        <button type="button" className={delBtnClass} onClick={() => updateSection('amenities', { categories: data.amenities.categories.filter(x => x.id !== a.id) })}>✕</button>
                      </div>
                      <textarea className="w-full p-1 border rounded text-xs" rows={4} placeholder="Každý riadok = položka" value={a.items.join('\n')} onChange={e => { const c = [...data.amenities.categories]; c[i] = { ...c[i], items: e.target.value.split('\n') }; updateSection('amenities', { categories: c }); }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ATMOSPHERE */}
              {tab === 'atmosphere' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">🌅 Atmosféra</h3>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.atmosphere.label} onChange={e => updateSection('atmosphere', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.atmosphere.title} onChange={e => updateSection('atmosphere', { title: e.target.value })} /></div>
                  <div><label className={labelClass}>Text 1</label><textarea className={inputClass} rows={2} value={data.atmosphere.text1} onChange={e => updateSection('atmosphere', { text1: e.target.value })} /></div>
                  <div><label className={labelClass}>Text 2</label><textarea className={inputClass} rows={2} value={data.atmosphere.text2} onChange={e => updateSection('atmosphere', { text2: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div><label className={labelClass}>Ranný titulok</label><input className={inputClass} value={data.atmosphere.morningTitle} onChange={e => updateSection('atmosphere', { morningTitle: e.target.value })} /></div>
                      <button type="button" className={btnClass + " mt-2"} onClick={() => uploadImage(src => { updateSection('atmosphere', { morningImage: src }); })}>📁 Ranný obrázok</button>
                      {data.atmosphere.morningImage && <img src={data.atmosphere.morningImage} alt="Preview" className="w-full h-20 object-cover rounded mt-1" />}
                    </div>
                    <div>
                      <div><label className={labelClass}>Večerný titulok</label><input className={inputClass} value={data.atmosphere.eveningTitle} onChange={e => updateSection('atmosphere', { eveningTitle: e.target.value })} /></div>
                      <button type="button" className={btnClass + " mt-2"} onClick={() => uploadImage(src => { updateSection('atmosphere', { eveningImage: src }); })}>📁 Večerný obrázok</button>
                      {data.atmosphere.eveningImage && <img src={data.atmosphere.eveningImage} alt="Preview" className="w-full h-20 object-cover rounded mt-1" />}
                    </div>
                  </div>
                </div>
              )}

              {/* PRICING */}
              {tab === 'pricing' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">💰 Cenník</h3>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.pricing.label} onChange={e => updateSection('pricing', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.pricing.title} onChange={e => updateSection('pricing', { title: e.target.value })} /></div>
                  <div><label className={labelClass}>Text "Najpopulárnejší"</label><input className={inputClass} value={data.pricing.popularText} onChange={e => updateSection('pricing', { popularText: e.target.value })} /></div>
                  <div><label className={labelClass}>Text tlačidla</label><input className={inputClass} value={data.pricing.ctaText} onChange={e => updateSection('pricing', { ctaText: e.target.value })} /></div>
                  {(['weekend', 'reset', 'week'] as const).map(k => (
                    <div key={k} className="p-2 bg-gray-50 rounded">
                      <p className="font-bold text-xs mb-2">{k === 'weekend' ? '🌙 Víkend' : k === 'reset' ? '⭐ Reset' : '📅 Týždeň'}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={labelClass}>Názov</label><input className={inputClass} value={data.pricing.packages[k].name} onChange={e => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], name: e.target.value } } })} /></div>
                        <div><label className={labelClass}>Popis</label><input className={inputClass} value={data.pricing.packages[k].desc} onChange={e => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], desc: e.target.value } } })} /></div>
                        <div><label className={labelClass}>Noci</label><input type="number" className={inputClass} value={data.pricing.packages[k].nights} onChange={e => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], nights: +e.target.value } } })} /></div>
                        <div><label className={labelClass}>Cena €</label><input type="number" className={inputClass} value={data.pricing.packages[k].price} onChange={e => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], price: +e.target.value } } })} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BOOKING */}
              {tab === 'booking' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">📅 Rezervácia</h3>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.booking.label} onChange={e => updateSection('booking', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.booking.title} onChange={e => updateSection('booking', { title: e.target.value })} /></div>
                  <div><label className={labelClass}>Cena/noc € (pre kalkuláciu)</label><input type="number" className={inputClass} value={data.booking.pricePerNight} onChange={e => updateSection('booking', { pricePerNight: +e.target.value })} /></div>
                  <div><label className={labelClass}>Min. nocí</label><input type="number" className={inputClass} value={data.booking.minNights} onChange={e => updateSection('booking', { minNights: +e.target.value })} /></div>
                  <div><label className={labelClass}>Max. hostí</label><input type="number" className={inputClass} value={data.booking.maxGuests} onChange={e => updateSection('booking', { maxGuests: +e.target.value })} /></div>
                  <p className="text-xs text-gray-500 font-medium">Booking linky:</p>
                  {data.booking.bookingLinks.map((l, i) => (
                    <div key={l.id} className="flex gap-2 items-center">
                      <input className="w-24 p-1 border rounded text-sm" value={l.name} onChange={e => { const links = [...data.booking.bookingLinks]; links[i] = { ...links[i], name: e.target.value }; updateSection('booking', { bookingLinks: links }); }} />
                      <input className="flex-1 p-1 border rounded text-sm" value={l.url} onChange={e => { const links = [...data.booking.bookingLinks]; links[i] = { ...links[i], url: e.target.value }; updateSection('booking', { bookingLinks: links }); }} />
                      <button type="button" className={delBtnClass} onClick={() => updateSection('booking', { bookingLinks: data.booking.bookingLinks.filter(x => x.id !== l.id) })}>✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateSection('booking', { bookingLinks: [...data.booking.bookingLinks, { id: Date.now().toString(), name: 'Nový', url: 'https://' }] })} className="text-xs text-amber-600">+ Pridať</button>
                </div>
              )}

              {/* SURROUNDINGS */}
              {tab === 'surroundings' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🗺️ Okolie ({data.surroundings.attractions.length})</h3>
                    <button type="button" onClick={() => updateSection('surroundings', { attractions: [...data.surroundings.attractions, { id: Date.now().toString(), image: '', category: 'PRÍRODA', title: 'Nové', description: 'Popis...' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.surroundings.label} onChange={e => updateSection('surroundings', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.surroundings.title} onChange={e => updateSection('surroundings', { title: e.target.value })} /></div>
                  {data.surroundings.attractions.map((a, i) => (
                    <div key={a.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input className="w-24 p-1 border rounded text-xs" value={a.category} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i] = { ...arr[i], category: e.target.value }; updateSection('surroundings', { attractions: arr }); }} placeholder="Kategória" />
                        <input className="flex-1 p-1 border rounded text-sm" value={a.title} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i] = { ...arr[i], title: e.target.value }; updateSection('surroundings', { attractions: arr }); }} placeholder="Názov" />
                        <button type="button" className={delBtnClass} onClick={() => updateSection('surroundings', { attractions: data.surroundings.attractions.filter(x => x.id !== a.id) })}>✕</button>
                      </div>
                      <textarea className="w-full p-1 border rounded text-xs" rows={2} value={a.description} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i] = { ...arr[i], description: e.target.value }; updateSection('surroundings', { attractions: arr }); }} placeholder="Popis" />
                      <button type="button" onClick={() => uploadImage(src => { const arr = [...data.surroundings.attractions]; arr[i] = { ...arr[i], image: src }; updateSection('surroundings', { attractions: arr }); })} className="w-full p-1 bg-amber-500 text-white rounded text-xs">📁 Nahrať obrázok</button>
                      {a.image && <img src={a.image} alt="Preview" className="w-full h-16 object-cover rounded" />}
                    </div>
                  ))}
                </div>
              )}

              {/* REVIEWS */}
              {tab === 'reviews' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">⭐ Recenzie ({data.reviews.items.length})</h3>
                    <button type="button" onClick={() => updateSection('reviews', { items: [...data.reviews.items, { id: Date.now().toString(), name: 'Meno', text: 'Text...', rating: 5, date: '2024-01' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.reviews.label} onChange={e => updateSection('reviews', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.reviews.title} onChange={e => updateSection('reviews', { title: e.target.value })} /></div>
                  {data.reviews.items.map((r, i) => (
                    <div key={r.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input className="flex-1 p-1 border rounded text-sm" value={r.name} onChange={e => { const arr = [...data.reviews.items]; arr[i] = { ...arr[i], name: e.target.value }; updateSection('reviews', { items: arr }); }} placeholder="Meno" />
                        <input className="w-20 p-1 border rounded text-xs" value={r.date} onChange={e => { const arr = [...data.reviews.items]; arr[i] = { ...arr[i], date: e.target.value }; updateSection('reviews', { items: arr }); }} placeholder="Dátum" />
                        <select className="p-1 border rounded text-sm" value={r.rating} onChange={e => { const arr = [...data.reviews.items]; arr[i] = { ...arr[i], rating: +e.target.value }; updateSection('reviews', { items: arr }); }}>
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}⭐</option>)}
                        </select>
                        <button type="button" className={delBtnClass} onClick={() => updateSection('reviews', { items: data.reviews.items.filter(x => x.id !== r.id) })}>✕</button>
                      </div>
                      <textarea className="w-full p-1 border rounded text-xs" rows={2} value={r.text} onChange={e => { const arr = [...data.reviews.items]; arr[i] = { ...arr[i], text: e.target.value }; updateSection('reviews', { items: arr }); }} placeholder="Text recenzie" />
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ */}
              {tab === 'faq' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">❓ FAQ ({data.faq.items.length})</h3>
                    <button type="button" onClick={() => updateSection('faq', { items: [...data.faq.items, { id: Date.now().toString(), question: 'Otázka?', answer: 'Odpoveď...' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.faq.label} onChange={e => updateSection('faq', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.faq.title} onChange={e => updateSection('faq', { title: e.target.value })} /></div>
                  {data.faq.items.map((f, i) => (
                    <div key={f.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input className="flex-1 p-1 border rounded text-sm font-medium" value={f.question} onChange={e => { const arr = [...data.faq.items]; arr[i] = { ...arr[i], question: e.target.value }; updateSection('faq', { items: arr }); }} placeholder="Otázka" />
                        <button type="button" className={delBtnClass} onClick={() => updateSection('faq', { items: data.faq.items.filter(x => x.id !== f.id) })}>✕</button>
                      </div>
                      <textarea className="w-full p-1 border rounded text-xs" rows={2} value={f.answer} onChange={e => { const arr = [...data.faq.items]; arr[i] = { ...arr[i], answer: e.target.value }; updateSection('faq', { items: arr }); }} placeholder="Odpoveď" />
                    </div>
                  ))}
                </div>
              )}

              {/* CONTACT */}
              {tab === 'contact' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">📞 Kontakt</h3>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.contact.label} onChange={e => updateSection('contact', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.contact.title} onChange={e => updateSection('contact', { title: e.target.value })} /></div>
                  <div><label className={labelClass}>Adresa - label</label><input className={inputClass} value={data.contact.addressLabel} onChange={e => updateSection('contact', { addressLabel: e.target.value })} /></div>
                  <div><label className={labelClass}>Adresa</label><input className={inputClass} value={data.contact.address} onChange={e => updateSection('contact', { address: e.target.value })} /></div>
                  <div><label className={labelClass}>Telefón - label</label><input className={inputClass} value={data.contact.phoneLabel} onChange={e => updateSection('contact', { phoneLabel: e.target.value })} /></div>
                  <div><label className={labelClass}>Telefón</label><input className={inputClass} value={data.contact.phone} onChange={e => updateSection('contact', { phone: e.target.value })} /></div>
                  <div><label className={labelClass}>Email - label</label><input className={inputClass} value={data.contact.emailLabel} onChange={e => updateSection('contact', { emailLabel: e.target.value })} /></div>
                  <div><label className={labelClass}>Email</label><input className={inputClass} value={data.contact.email} onChange={e => updateSection('contact', { email: e.target.value })} /></div>
                  <div><label className={labelClass}>Časy - label</label><input className={inputClass} value={data.contact.hoursLabel} onChange={e => updateSection('contact', { hoursLabel: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelClass}>Check-in</label><input className={inputClass} value={data.contact.checkIn} onChange={e => updateSection('contact', { checkIn: e.target.value })} /></div>
                    <div><label className={labelClass}>Check-out</label><input className={inputClass} value={data.contact.checkOut} onChange={e => updateSection('contact', { checkOut: e.target.value })} /></div>
                  </div>
                  <div><label className={labelClass}>Mapa - label</label><input className={inputClass} value={data.contact.mapLabel} onChange={e => updateSection('contact', { mapLabel: e.target.value })} /></div>
                </div>
              )}

              {/* FOOTER */}
              {tab === 'footer' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">📄 Footer</h3>
                  <div><label className={labelClass}>Popis</label><textarea className={inputClass} rows={3} value={data.footer.description} onChange={e => updateSection('footer', { description: e.target.value })} /></div>
                  <div><label className={labelClass}>Telefón</label><input className={inputClass} value={data.footer.phone} onChange={e => updateSection('footer', { phone: e.target.value })} /></div>
                  <div><label className={labelClass}>Email</label><input className={inputClass} value={data.footer.email} onChange={e => updateSection('footer', { email: e.target.value })} /></div>
                  <div><label className={labelClass}>Lokácia</label><input className={inputClass} value={data.footer.location} onChange={e => updateSection('footer', { location: e.target.value })} /></div>
                  <div><label className={labelClass}>Copyright</label><input className={inputClass} value={data.footer.copyright} onChange={e => updateSection('footer', { copyright: e.target.value })} /></div>
                  <div><label className={labelClass}>Made with</label><input className={inputClass} value={data.footer.madeWith} onChange={e => updateSection('footer', { madeWith: e.target.value })} /></div>
                  <div><label className={labelClass}>Privacy text</label><input className={inputClass} value={data.footer.privacyText} onChange={e => updateSection('footer', { privacyText: e.target.value })} /></div>
                  <div><label className={labelClass}>Terms text</label><input className={inputClass} value={data.footer.termsText} onChange={e => updateSection('footer', { termsText: e.target.value })} /></div>
                  <div><label className={labelClass}>Book via text</label><input className={inputClass} value={data.footer.bookViaText} onChange={e => updateSection('footer', { bookViaText: e.target.value })} /></div>
                </div>
              )}

              {/* NAV */}
              {tab === 'nav' && (
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-2">🧭 Navigácia</h3>
                  <div><label className={labelClass}>Domov</label><input className={inputClass} value={data.nav.home} onChange={e => updateSection('nav', { home: e.target.value })} /></div>
                  <div><label className={labelClass}>Galéria</label><input className={inputClass} value={data.nav.gallery} onChange={e => updateSection('nav', { gallery: e.target.value })} /></div>
                  <div><label className={labelClass}>Vybavenie</label><input className={inputClass} value={data.nav.amenities} onChange={e => updateSection('nav', { amenities: e.target.value })} /></div>
                  <div><label className={labelClass}>Rezervácia</label><input className={inputClass} value={data.nav.booking} onChange={e => updateSection('nav', { booking: e.target.value })} /></div>
                  <div><label className={labelClass}>Cenník</label><input className={inputClass} value={data.nav.pricing} onChange={e => updateSection('nav', { pricing: e.target.value })} /></div>
                  <div><label className={labelClass}>Okolie</label><input className={inputClass} value={data.nav.surroundings} onChange={e => updateSection('nav', { surroundings: e.target.value })} /></div>
                  <div><label className={labelClass}>Recenzie</label><input className={inputClass} value={data.nav.reviews} onChange={e => updateSection('nav', { reviews: e.target.value })} /></div>
                  <div><label className={labelClass}>FAQ</label><input className={inputClass} value={data.nav.faq} onChange={e => updateSection('nav', { faq: e.target.value })} /></div>
                  <div><label className={labelClass}>Kontakt</label><input className={inputClass} value={data.nav.contact} onChange={e => updateSection('nav', { contact: e.target.value })} /></div>
                  <div><label className={labelClass}>Tlačidlo Rezervovať</label><input className={inputClass} value={data.nav.bookNow} onChange={e => updateSection('nav', { bookNow: e.target.value })} /></div>
                </div>
              )}


              {/* RESET POBYT */}
              {tab === 'reset' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🔋 Reset pobyt ({(data.reset?.items || []).length})</h3>
                    <button type="button" onClick={() => updateSection('reset', { items: [...(data.reset?.items || []), { icon: '✨', title: 'Nový', desc: 'Popis...' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <div><label className={labelClass}>Label</label><input className={inputClass} value={data.reset?.label || ''} onChange={e => updateSection('reset', { label: e.target.value })} /></div>
                  <div><label className={labelClass}>Titulok</label><input className={inputClass} value={data.reset?.title || ''} onChange={e => updateSection('reset', { title: e.target.value })} /></div>
                  {(data.reset?.items || []).map((item: any, i: number) => (
                    <div key={i} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input className="w-12 p-1 border rounded text-center" value={item.icon} onChange={e => { const items = [...(data.reset?.items || [])]; items[i] = { ...items[i], icon: e.target.value }; updateSection('reset', { items }); }} />
                        <input className="flex-1 p-1 border rounded text-sm" value={item.title} onChange={e => { const items = [...(data.reset?.items || [])]; items[i] = { ...items[i], title: e.target.value }; updateSection('reset', { items }); }} />
                        <button type="button" className={delBtnClass} onClick={() => updateSection('reset', { items: (data.reset?.items || []).filter((_: any, idx: number) => idx !== i) })}>✕</button>
                      </div>
                      <textarea className="w-full p-1 border rounded text-xs" rows={2} value={item.desc} onChange={e => { const items = [...(data.reset?.items || [])]; items[i] = { ...items[i], desc: e.target.value }; updateSection('reset', { items }); }} />
                    </div>
                  ))}
                </div>
              )}

              {/* SETTINGS */}
              {tab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">⚙️ Nastavenia</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-600 mb-3">Toto vymaže VŠETKY zmeny!</p>
                    <button type="button" onClick={() => { if(confirm('Naozaj resetovať všetko?')) resetAll(); }} className="w-full p-3 bg-red-500 text-white rounded font-bold">🗑️ Resetovať</button>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm">
                    <p><strong>Heslo:</strong> ChataAdmin2025!</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
