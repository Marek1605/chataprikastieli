'use client';
import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

type Tab = 'hero' | 'overview' | 'gallery' | 'amenities' | 'pricing' | 'surroundings' | 'reviews' | 'faq' | 'contact' | 'seo' | 'settings';

export default function AdminSidebar() {
  const { 
    data, isAdmin, setAdmin, 
    updateHero, updateOverview, updateGallery, updateAmenities,
    updatePricing, updateSurroundings, updateReviews, updateFaq, 
    updateContact, updateSeo, resetAll 
  } = useAdmin();
  
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState<Tab>('hero');
  const [status, setStatus] = useState('');

  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 2000); };

  const login = () => {
    if (pw === 'ChataAdmin2025!') {
      sessionStorage.setItem('chata_admin', 'true');
      setAdmin(true);
      setShowLogin(false);
      setPw('');
    } else alert('Zlé heslo!');
  };

  const logout = () => {
    sessionStorage.removeItem('chata_admin');
    setAdmin(false);
    setShowPanel(false);
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (callback: (b64: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      flash('⏳ Komprimujem...');
      try {
        const compressed = await compressImage(file);
        callback(compressed);
        flash('✅ Uložené!');
      } catch { flash('❌ Chyba!'); }
    };
    input.click();
  };

  if (!isAdmin) {
    return (
      <>
        <button onClick={() => setShowLogin(true)} className="fixed bottom-4 left-4 w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-xl text-2xl z-50 shadow-xl border-2 border-amber-500">⚙️</button>
        {showLogin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500]" onClick={() => setShowLogin(false)}>
            <div className="bg-white p-6 rounded-xl w-80" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">🔐 Super Admin</h2>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Heslo" className="w-full p-3 border rounded-lg mb-3" onKeyDown={e => e.key === 'Enter' && login()} autoFocus />
              <button onClick={login} className="w-full p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold">Prihlásiť</button>
            </div>
          </div>
        )}
      </>
    );
  }

  const tabs = [
    { id: 'hero', icon: '🏠', label: 'Hero' },
    { id: 'overview', icon: '📋', label: 'O chate' },
    { id: 'gallery', icon: '🖼️', label: 'Galéria' },
    { id: 'amenities', icon: '🛋️', label: 'Vybavenie' },
    { id: 'pricing', icon: '💰', label: 'Cenník' },
    { id: 'surroundings', icon: '🗺️', label: 'Okolie' },
    { id: 'reviews', icon: '⭐', label: 'Recenzie' },
    { id: 'faq', icon: '❓', label: 'FAQ' },
    { id: 'contact', icon: '📞', label: 'Kontakt' },
    { id: 'seo', icon: '🔍', label: 'SEO' },
    { id: 'settings', icon: '⚙️', label: 'Nastavenia' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[400] bg-gradient-to-r from-amber-600 to-orange-600 text-white p-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">🔧 SUPER ADMIN</span>
          <button onClick={() => setShowPanel(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium">📝 Upraviť web</button>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="px-3 py-1 bg-white/20 rounded-lg">{status}</span>}
          <button onClick={logout} className="px-4 py-2 bg-white text-amber-600 rounded-lg font-bold">Odhlásiť</button>
        </div>
      </div>

      {showPanel && (
        <div className="fixed inset-0 bg-black/50 z-[450]" onClick={() => setShowPanel(false)}>
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">📝 Super Admin Panel</h2>
              <button onClick={() => setShowPanel(false)} className="text-2xl hover:text-white/70">✕</button>
            </div>

            <div className="flex flex-wrap gap-1 p-3 border-b bg-gray-50">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id as Tab)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-amber-500 text-white' : 'bg-white hover:bg-gray-100 border'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              
              {/* HERO */}
              {tab === 'hero' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">🏠 Hero sekcia</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hlavný titulok</label>
                    <input value={data.hero.title} onChange={e => { updateHero({ title: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Podtitulok</label>
                    <textarea value={data.hero.subtitle} onChange={e => { updateHero({ subtitle: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pozadie</label>
                    <div className="flex gap-2">
                      <input value={data.hero.backgroundImage} onChange={e => { updateHero({ backgroundImage: e.target.value }); flash('✅'); }} className="flex-1 p-3 border rounded-lg text-sm" />
                      <button onClick={() => uploadImage(src => updateHero({ backgroundImage: src }))} className="px-4 py-2 bg-amber-500 text-white rounded-lg">📁 Nahrať</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Badges (štítky)</label>
                    {data.hero.badges.map((badge, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={badge.icon} onChange={e => { const b = [...data.hero.badges]; b[i].icon = e.target.value; updateHero({ badges: b }); }} className="w-16 p-2 border rounded text-center" placeholder="🔒" />
                        <input value={badge.text} onChange={e => { const b = [...data.hero.badges]; b[i].text = e.target.value; updateHero({ badges: b }); }} className="flex-1 p-2 border rounded" placeholder="Text" />
                        <button onClick={() => { updateHero({ badges: data.hero.badges.filter((_, idx) => idx !== i) }); flash('✅'); }} className="px-3 bg-red-500 text-white rounded">✕</button>
                      </div>
                    ))}
                    <button onClick={() => { updateHero({ badges: [...data.hero.badges, { icon: '✨', text: 'Nový' }] }); flash('✅'); }} className="text-sm text-amber-600 hover:underline">+ Pridať badge</button>
                  </div>
                </>
              )}

              {/* OVERVIEW */}
              {tab === 'overview' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">📋 O chate</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Titulok sekcie</label>
                    <input value={data.overview.title} onChange={e => { updateOverview({ title: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Popis</label>
                    <textarea value={data.overview.description} onChange={e => { updateOverview({ description: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hlavné vlastnosti</label>
                    {data.overview.features.map((f, i) => (
                      <div key={f.id} className="flex gap-2 mb-2 p-2 bg-gray-50 rounded">
                        <input value={f.icon} onChange={e => { const arr = [...data.overview.features]; arr[i].icon = e.target.value; updateOverview({ features: arr }); }} className="w-12 p-2 border rounded text-center" />
                        <input value={f.title} onChange={e => { const arr = [...data.overview.features]; arr[i].title = e.target.value; updateOverview({ features: arr }); }} className="flex-1 p-2 border rounded" placeholder="Názov" />
                        <input value={f.description} onChange={e => { const arr = [...data.overview.features]; arr[i].description = e.target.value; updateOverview({ features: arr }); }} className="flex-1 p-2 border rounded" placeholder="Popis" />
                        <button onClick={() => { updateOverview({ features: data.overview.features.filter(x => x.id !== f.id) }); flash('✅'); }} className="px-2 bg-red-500 text-white rounded">✕</button>
                      </div>
                    ))}
                    <button onClick={() => { updateOverview({ features: [...data.overview.features, { id: Date.now().toString(), icon: '✨', title: 'Nová', description: 'Popis' }] }); flash('✅'); }} className="text-sm text-amber-600 hover:underline">+ Pridať vlastnosť</button>
                  </div>
                </>
              )}

              {/* GALLERY */}
              {tab === 'gallery' && (
                <>
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg">🖼️ Galéria ({data.gallery.length})</h3>
                    <button onClick={() => uploadImage(src => { updateGallery([...data.gallery, { id: Date.now().toString(), src, alt: 'Nový obrázok' }]); })} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold">➕ Pridať</button>
                  </div>
                  <p className="text-sm text-gray-500">Obrázky sa automaticky komprimujú. Klikni na obrázok pre úpravu.</p>
                  <div className="grid grid-cols-4 gap-2">
                    {data.gallery.map((img, i) => (
                      <div key={img.id} className="relative group">
                        <img src={img.src} alt={img.alt} className="w-full h-20 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded-lg transition-opacity">
                          {i > 0 && <button onClick={() => { const g = [...data.gallery]; [g[i], g[i-1]] = [g[i-1], g[i]]; updateGallery(g); flash('✅'); }} className="w-7 h-7 bg-white rounded text-xs">←</button>}
                          <button onClick={() => { updateGallery(data.gallery.filter(g => g.id !== img.id)); flash('✅'); }} className="w-7 h-7 bg-red-500 text-white rounded text-xs">✕</button>
                          {i < data.gallery.length - 1 && <button onClick={() => { const g = [...data.gallery]; [g[i], g[i+1]] = [g[i+1], g[i]]; updateGallery(g); flash('✅'); }} className="w-7 h-7 bg-white rounded text-xs">→</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* AMENITIES */}
              {tab === 'amenities' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">🛋️ Vybavenie chaty</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Titulok sekcie</label>
                    <input value={data.amenities.title} onChange={e => { updateAmenities({ title: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Položky vybavenia</label>
                    {data.amenities.items.map((item, i) => (
                      <div key={item.id} className="flex gap-2 mb-2 p-2 bg-gray-50 rounded">
                        <input value={item.icon} onChange={e => { const arr = [...data.amenities.items]; arr[i].icon = e.target.value; updateAmenities({ items: arr }); }} className="w-12 p-2 border rounded text-center" />
                        <input value={item.name} onChange={e => { const arr = [...data.amenities.items]; arr[i].name = e.target.value; updateAmenities({ items: arr }); }} className="flex-1 p-2 border rounded" placeholder="Názov" />
                        <input value={item.description} onChange={e => { const arr = [...data.amenities.items]; arr[i].description = e.target.value; updateAmenities({ items: arr }); }} className="flex-1 p-2 border rounded" placeholder="Popis" />
                        <button onClick={() => { updateAmenities({ items: data.amenities.items.filter(x => x.id !== item.id) }); flash('✅'); }} className="px-2 bg-red-500 text-white rounded">✕</button>
                      </div>
                    ))}
                    <button onClick={() => { updateAmenities({ items: [...data.amenities.items, { id: Date.now().toString(), icon: '✨', name: 'Nové', description: '' }] }); flash('✅'); }} className="text-sm text-amber-600 hover:underline">+ Pridať vybavenie</button>
                  </div>
                </>
              )}

              {/* PRICING */}
              {tab === 'pricing' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">💰 Cenník</h3>
                  {(['weekend', 'reset', 'week'] as const).map(pkg => (
                    <div key={pkg} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold mb-3">{pkg === 'weekend' ? '🌙 Víkendový pobyt' : pkg === 'reset' ? '⭐ Reset pobyt' : '📅 Týždenný pobyt'}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500">Počet nocí</label>
                          <input type="number" value={data.pricing[pkg].nights} onChange={e => { updatePricing({ [pkg]: { ...data.pricing[pkg], nights: +e.target.value } }); flash('✅'); }} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Celková cena €</label>
                          <input type="number" value={data.pricing[pkg].price} onChange={e => { updatePricing({ [pkg]: { ...data.pricing[pkg], price: +e.target.value } }); flash('✅'); }} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Cena/noc €</label>
                          <input type="number" value={data.pricing[pkg].perNight} onChange={e => { updatePricing({ [pkg]: { ...data.pricing[pkg], perNight: +e.target.value } }); flash('✅'); }} className="w-full p-2 border rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* SURROUNDINGS */}
              {tab === 'surroundings' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">🗺️ Okolie</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Titulok sekcie</label>
                    <input value={data.surroundings.title} onChange={e => { updateSurroundings({ title: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Atrakcie v okolí</label>
                    {data.surroundings.attractions.map((a, i) => (
                      <div key={a.id} className="flex gap-2 mb-2 p-2 bg-gray-50 rounded">
                        <input value={a.icon} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i].icon = e.target.value; updateSurroundings({ attractions: arr }); }} className="w-12 p-2 border rounded text-center" />
                        <input value={a.title} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i].title = e.target.value; updateSurroundings({ attractions: arr }); }} className="flex-1 p-2 border rounded" placeholder="Názov" />
                        <input value={a.distance} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i].distance = e.target.value; updateSurroundings({ attractions: arr }); }} className="w-24 p-2 border rounded" placeholder="10 min" />
                        <button onClick={() => { updateSurroundings({ attractions: data.surroundings.attractions.filter(x => x.id !== a.id) }); flash('✅'); }} className="px-2 bg-red-500 text-white rounded">✕</button>
                      </div>
                    ))}
                    <button onClick={() => { updateSurroundings({ attractions: [...data.surroundings.attractions, { id: Date.now().toString(), icon: '📍', title: 'Nová atrakcia', distance: '10 min' }] }); flash('✅'); }} className="text-sm text-amber-600 hover:underline">+ Pridať atrakciu</button>
                  </div>
                </>
              )}

              {/* REVIEWS */}
              {tab === 'reviews' && (
                <>
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg">⭐ Recenzie ({data.reviews.length})</h3>
                    <button onClick={() => { updateReviews([...data.reviews, { id: Date.now().toString(), name: 'Meno', text: 'Text recenzie...', rating: 5, date: new Date().toISOString().slice(0,7) }]); flash('✅'); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold">➕ Pridať</button>
                  </div>
                  {data.reviews.map((r, i) => (
                    <div key={r.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <input value={r.name} onChange={e => { const rev = [...data.reviews]; rev[i].name = e.target.value; updateReviews(rev); }} className="flex-1 p-2 border rounded" placeholder="Meno" />
                        <input value={r.date} onChange={e => { const rev = [...data.reviews]; rev[i].date = e.target.value; updateReviews(rev); }} className="w-28 p-2 border rounded" placeholder="2024-10" />
                        <select value={r.rating} onChange={e => { const rev = [...data.reviews]; rev[i].rating = +e.target.value; updateReviews(rev); }} className="p-2 border rounded">
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}⭐</option>)}
                        </select>
                        <button onClick={() => { updateReviews(data.reviews.filter(x => x.id !== r.id)); flash('✅'); }} className="px-3 bg-red-500 text-white rounded">✕</button>
                      </div>
                      <textarea value={r.text} onChange={e => { const rev = [...data.reviews]; rev[i].text = e.target.value; updateReviews(rev); }} className="w-full p-2 border rounded" rows={2} placeholder="Text recenzie" />
                    </div>
                  ))}
                </>
              )}

              {/* FAQ */}
              {tab === 'faq' && (
                <>
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg">❓ FAQ ({data.faq.length})</h3>
                    <button onClick={() => { updateFaq([...data.faq, { id: Date.now().toString(), question: 'Nová otázka?', answer: 'Odpoveď...' }]); flash('✅'); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg font-bold">➕ Pridať</button>
                  </div>
                  {data.faq.map((f, i) => (
                    <div key={f.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <input value={f.question} onChange={e => { const faq = [...data.faq]; faq[i].question = e.target.value; updateFaq(faq); }} className="flex-1 p-2 border rounded font-medium" placeholder="Otázka?" />
                        <button onClick={() => { updateFaq(data.faq.filter(x => x.id !== f.id)); flash('✅'); }} className="px-3 bg-red-500 text-white rounded">✕</button>
                      </div>
                      <textarea value={f.answer} onChange={e => { const faq = [...data.faq]; faq[i].answer = e.target.value; updateFaq(faq); }} className="w-full p-2 border rounded" rows={2} placeholder="Odpoveď..." />
                    </div>
                  ))}
                </>
              )}

              {/* CONTACT */}
              {tab === 'contact' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">📞 Kontaktné údaje</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Telefón</label>
                      <input value={data.contact.phone} onChange={e => { updateContact({ phone: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input value={data.contact.email} onChange={e => { updateContact({ email: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresa</label>
                    <input value={data.contact.address} onChange={e => { updateContact({ address: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Check-in</label>
                      <input value={data.contact.checkIn} onChange={e => { updateContact({ checkIn: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" placeholder="15:00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Check-out</label>
                      <input value={data.contact.checkOut} onChange={e => { updateContact({ checkOut: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" placeholder="10:00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Google Maps URL</label>
                    <input value={data.contact.mapUrl} onChange={e => { updateContact({ mapUrl: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg text-sm" />
                  </div>
                </>
              )}

              {/* SEO */}
              {tab === 'seo' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">🔍 SEO nastavenia</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title</label>
                    <input value={data.seo.title} onChange={e => { updateSeo({ title: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                    <p className="text-xs text-gray-500 mt-1">{data.seo.title.length}/60 znakov</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea value={data.seo.description} onChange={e => { updateSeo({ description: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" rows={3} />
                    <p className="text-xs text-gray-500 mt-1">{data.seo.description.length}/160 znakov</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Keywords</label>
                    <input value={data.seo.keywords} onChange={e => { updateSeo({ keywords: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" placeholder="chata, turiec, dovolenka" />
                  </div>
                </>
              )}

              {/* SETTINGS */}
              {tab === 'settings' && (
                <>
                  <h3 className="font-bold text-lg border-b pb-2">⚙️ Nastavenia</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-bold text-red-700 mb-2">🗑️ Reset všetkých dát</h4>
                    <p className="text-sm text-red-600 mb-3">Toto vymaže všetky zmeny a vráti predvolené hodnoty.</p>
                    <button onClick={() => { if(confirm('Naozaj resetovať VŠETKO?')) { resetAll(); flash('✅ Reset!'); }}} className="w-full p-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600">Resetovať všetko</button>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-bold text-amber-700 mb-2">ℹ️ Informácie</h4>
                    <p className="text-sm text-amber-600"><strong>Heslo:</strong> ChataAdmin2025!</p>
                    <p className="text-sm text-amber-600 mt-1">Zmeny sa ukladajú automaticky do prehliadača.</p>
                    <p className="text-sm text-amber-600 mt-1">Obrázky sú komprimované na max 800px.</p>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
