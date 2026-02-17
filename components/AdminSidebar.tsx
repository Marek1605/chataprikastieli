'use client';
import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

type Tab = 'hero' | 'overview' | 'gallery' | 'amenities' | 'atmosphere' | 'pricing' | 'booking' | 'surroundings' | 'reviews' | 'faq' | 'contact' | 'footer' | 'nav' | 'settings';

export default function AdminSidebar() {
  const { data, isAdmin, setAdmin, updateSection, updateFull, resetAll } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState<Tab>('hero');
  const [status, setStatus] = useState('');

  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(''), 1500); };
  const ok = () => flash('✅');

  const login = () => {
    if (pw === 'ChataAdmin2025!') {
      sessionStorage.setItem('chata_admin', 'true');
      setAdmin(true); setShowLogin(false); setPw('');
    } else alert('Zlé heslo!');
  };

  const logout = () => { sessionStorage.removeItem('chata_admin'); setAdmin(false); setShowPanel(false); };

  const compress = (file: File, maxW = 800, q = 0.6): Promise<string> => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW) { h = (h * maxW) / w; w = maxW; }
        c.width = w; c.height = h;
        c.getContext('2d')?.drawImage(img, 0, 0, w, h);
        res(c.toDataURL('image/jpeg', q));
      };
      img.onerror = rej;
      img.src = e.target?.result as string;
    };
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const upload = async (cb: (b64: string) => void) => {
    const i = document.createElement('input');
    i.type = 'file'; i.accept = 'image/*';
    i.onchange = async (e: any) => {
      const f = e.target.files?.[0]; if (!f) return;
      flash('⏳'); cb(await compress(f)); ok();
    };
    i.click();
  };

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
    { id: 'settings', icon: '⚙️', label: 'Reset' },
  ];

  const Input = ({ label, value, onChange, textarea, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) => (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {textarea ? <textarea value={value} onChange={e => { onChange(e.target.value); ok(); }} className="w-full p-2 border rounded text-sm" rows={rows} />
        : <input value={value} onChange={e => { onChange(e.target.value); ok(); }} className="w-full p-2 border rounded text-sm" />}
    </div>
  );

  const Num = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type="number" value={value} onChange={e => { onChange(+e.target.value); ok(); }} className="w-full p-2 border rounded text-sm" />
    </div>
  );

  const ImgBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick} className="w-full p-2 bg-amber-500 text-white rounded text-sm mb-3">📁 {label}</button>
  );

  const DelBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={() => { onClick(); ok(); }} className="px-2 py-1 bg-red-500 text-white rounded text-xs">✕</button>
  );

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
              <h2 className="text-xl font-bold">📝 Super Admin - VŠETKY SEKCIE</h2>
              <button onClick={() => setShowPanel(false)} className="text-2xl">✕</button>
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
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">🏠 Hero sekcia</h3>
                  <Input label="Titulok" value={data.hero.title} onChange={v => updateSection('hero', { title: v })} />
                  <Input label="Podtitulok" value={data.hero.subtitle} onChange={v => updateSection('hero', { subtitle: v })} textarea rows={3} />
                  <Input label="Rating" value={data.hero.rating} onChange={v => updateSection('hero', { rating: v })} />
                  <Input label="Rating text" value={data.hero.ratingText} onChange={v => updateSection('hero', { ratingText: v })} />
                  <Input label="Tlačidlo 1" value={data.hero.cta1} onChange={v => updateSection('hero', { cta1: v })} />
                  <Input label="Tlačidlo 2" value={data.hero.cta2} onChange={v => updateSection('hero', { cta2: v })} />
                  <ImgBtn label="Pozadie" onClick={() => upload(src => updateSection('hero', { backgroundImage: src }))} />
                  <p className="text-xs text-gray-500 font-medium mt-4">Badges (štítky):</p>
                  {data.hero.badges.map((b, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={b.icon} onChange={e => { const badges = [...data.hero.badges]; badges[i].icon = e.target.value; updateSection('hero', { badges }); }} className="w-12 p-1 border rounded text-center" />
                      <input value={b.text} onChange={e => { const badges = [...data.hero.badges]; badges[i].text = e.target.value; updateSection('hero', { badges }); }} className="flex-1 p-1 border rounded" />
                      <DelBtn onClick={() => updateSection('hero', { badges: data.hero.badges.filter((_, idx) => idx !== i) })} />
                    </div>
                  ))}
                  <button onClick={() => updateSection('hero', { badges: [...data.hero.badges, { icon: '✨', text: 'Nový' }] })} className="text-xs text-amber-600">+ Pridať</button>
                </div>
              )}

              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">📋 O chate</h3>
                  <Input label="Label" value={data.overview.label} onChange={v => updateSection('overview', { label: v })} />
                  <Input label="Titulok" value={data.overview.title} onChange={v => updateSection('overview', { title: v })} />
                  <Input label="Popis" value={data.overview.description} onChange={v => updateSection('overview', { description: v })} textarea rows={3} />
                  <ImgBtn label="Obrázok" onClick={() => upload(src => updateSection('overview', { image: src }))} />
                  <p className="text-xs text-gray-500 font-medium mt-4">Vlastnosti:</p>
                  {data.overview.features.map((f, i) => (
                    <div key={f.id} className="flex gap-1 items-center bg-gray-50 p-2 rounded">
                      <input value={f.icon} onChange={e => { const features = [...data.overview.features]; features[i].icon = e.target.value; updateSection('overview', { features }); }} className="w-10 p-1 border rounded text-center text-sm" />
                      <input value={f.title} onChange={e => { const features = [...data.overview.features]; features[i].title = e.target.value; updateSection('overview', { features }); }} className="flex-1 p-1 border rounded text-sm" />
                      <input value={f.value} onChange={e => { const features = [...data.overview.features]; features[i].value = e.target.value; updateSection('overview', { features }); }} className="w-16 p-1 border rounded text-sm" />
                      <DelBtn onClick={() => updateSection('overview', { features: data.overview.features.filter(x => x.id !== f.id) })} />
                    </div>
                  ))}
                  <button onClick={() => updateSection('overview', { features: [...data.overview.features, { id: Date.now().toString(), icon: '✨', title: 'Nové', value: '?' }] })} className="text-xs text-amber-600">+ Pridať</button>
                </div>
              )}

              {/* GALLERY */}
              {tab === 'gallery' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🖼️ Galéria ({data.gallery.images.length})</h3>
                    <button onClick={() => upload(src => updateSection('gallery', { images: [...data.gallery.images, { id: Date.now().toString(), src, alt: 'Nový' }] }))} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <Input label="Label" value={data.gallery.label} onChange={v => updateSection('gallery', { label: v })} />
                  <Input label="Titulok" value={data.gallery.title} onChange={v => updateSection('gallery', { title: v })} />
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {data.gallery.images.map((img, i) => (
                      <div key={img.id} className="relative group">
                        <img src={img.src} alt={img.alt} className="w-full h-16 object-cover rounded" />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded">
                          {i > 0 && <button onClick={() => { const imgs = [...data.gallery.images]; [imgs[i], imgs[i-1]] = [imgs[i-1], imgs[i]]; updateSection('gallery', { images: imgs }); ok(); }} className="w-5 h-5 bg-white rounded text-xs">←</button>}
                          <button onClick={() => { updateSection('gallery', { images: data.gallery.images.filter(x => x.id !== img.id) }); ok(); }} className="w-5 h-5 bg-red-500 text-white rounded text-xs">✕</button>
                          {i < data.gallery.images.length - 1 && <button onClick={() => { const imgs = [...data.gallery.images]; [imgs[i], imgs[i+1]] = [imgs[i+1], imgs[i]]; updateSection('gallery', { images: imgs }); ok(); }} className="w-5 h-5 bg-white rounded text-xs">→</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AMENITIES */}
              {tab === 'amenities' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🛋️ Vybavenie ({data.amenities.categories.length})</h3>
                    <button onClick={() => updateSection('amenities', { categories: [...data.amenities.categories, { id: Date.now().toString(), icon: '✨', title: 'Nové', items: ['Položka'] }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <Input label="Label" value={data.amenities.label} onChange={v => updateSection('amenities', { label: v })} />
                  <Input label="Titulok" value={data.amenities.title} onChange={v => updateSection('amenities', { title: v })} />
                  {data.amenities.categories.map((a, i) => (
                    <div key={a.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input value={a.icon} onChange={e => { const c = [...data.amenities.categories]; c[i].icon = e.target.value; updateSection('amenities', { categories: c }); }} className="w-10 p-1 border rounded text-center" />
                        <input value={a.title} onChange={e => { const c = [...data.amenities.categories]; c[i].title = e.target.value; updateSection('amenities', { categories: c }); }} className="flex-1 p-1 border rounded" />
                        <DelBtn onClick={() => updateSection('amenities', { categories: data.amenities.categories.filter(x => x.id !== a.id) })} />
                      </div>
                      <textarea value={a.items.join('\n')} onChange={e => { const c = [...data.amenities.categories]; c[i].items = e.target.value.split('\n'); updateSection('amenities', { categories: c }); }} className="w-full p-1 border rounded text-xs" rows={4} placeholder="Každý riadok = položka" />
                    </div>
                  ))}
                </div>
              )}

              {/* ATMOSPHERE */}
              {tab === 'atmosphere' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">🌅 Atmosféra</h3>
                  <Input label="Label" value={data.atmosphere.label} onChange={v => updateSection('atmosphere', { label: v })} />
                  <Input label="Titulok" value={data.atmosphere.title} onChange={v => updateSection('atmosphere', { title: v })} />
                  <Input label="Text 1" value={data.atmosphere.text1} onChange={v => updateSection('atmosphere', { text1: v })} textarea />
                  <Input label="Text 2" value={data.atmosphere.text2} onChange={v => updateSection('atmosphere', { text2: v })} textarea />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input label="Ranný titulok" value={data.atmosphere.morningTitle} onChange={v => updateSection('atmosphere', { morningTitle: v })} />
                      <ImgBtn label="Ranný obrázok" onClick={() => upload(src => updateSection('atmosphere', { morningImage: src }))} />
                    </div>
                    <div>
                      <Input label="Večerný titulok" value={data.atmosphere.eveningTitle} onChange={v => updateSection('atmosphere', { eveningTitle: v })} />
                      <ImgBtn label="Večerný obrázok" onClick={() => upload(src => updateSection('atmosphere', { eveningImage: src }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* PRICING */}
              {tab === 'pricing' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">💰 Cenník</h3>
                  <Input label="Label" value={data.pricing.label} onChange={v => updateSection('pricing', { label: v })} />
                  <Input label="Titulok" value={data.pricing.title} onChange={v => updateSection('pricing', { title: v })} />
                  <Input label="Text 'Najpopulárnejší'" value={data.pricing.popularText} onChange={v => updateSection('pricing', { popularText: v })} />
                  <Input label="Text tlačidla" value={data.pricing.ctaText} onChange={v => updateSection('pricing', { ctaText: v })} />
                  {(['weekend', 'reset', 'week'] as const).map(k => (
                    <div key={k} className="p-2 bg-gray-50 rounded">
                      <p className="font-bold text-xs mb-2">{k === 'weekend' ? '🌙 Víkend' : k === 'reset' ? '⭐ Reset' : '📅 Týždeň'}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Input label="Názov" value={data.pricing.packages[k].name} onChange={v => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], name: v } } })} />
                        <Input label="Popis" value={data.pricing.packages[k].desc} onChange={v => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], desc: v } } })} />
                        <Num label="Noci" value={data.pricing.packages[k].nights} onChange={v => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], nights: v } } })} />
                        <Num label="Cena €" value={data.pricing.packages[k].price} onChange={v => updateSection('pricing', { packages: { ...data.pricing.packages, [k]: { ...data.pricing.packages[k], price: v } } })} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BOOKING */}
              {tab === 'booking' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">📅 Rezervácia</h3>
                  <Input label="Label" value={data.booking.label} onChange={v => updateSection('booking', { label: v })} />
                  <Input label="Titulok" value={data.booking.title} onChange={v => updateSection('booking', { title: v })} />
                  <Num label="Cena/noc €" value={data.booking.pricePerNight} onChange={v => updateSection('booking', { pricePerNight: v })} />
                  <Num label="Min. nocí" value={data.booking.minNights} onChange={v => updateSection('booking', { minNights: v })} />
                  <Num label="Max. hostí" value={data.booking.maxGuests} onChange={v => updateSection('booking', { maxGuests: v })} />
                  <p className="text-xs text-gray-500 font-medium">Booking linky:</p>
                  {data.booking.bookingLinks.map((l, i) => (
                    <div key={l.id} className="flex gap-2 items-center">
                      <input value={l.name} onChange={e => { const links = [...data.booking.bookingLinks]; links[i].name = e.target.value; updateSection('booking', { bookingLinks: links }); }} className="w-24 p-1 border rounded text-sm" />
                      <input value={l.url} onChange={e => { const links = [...data.booking.bookingLinks]; links[i].url = e.target.value; updateSection('booking', { bookingLinks: links }); }} className="flex-1 p-1 border rounded text-sm" />
                      <DelBtn onClick={() => updateSection('booking', { bookingLinks: data.booking.bookingLinks.filter(x => x.id !== l.id) })} />
                    </div>
                  ))}
                  <button onClick={() => updateSection('booking', { bookingLinks: [...data.booking.bookingLinks, { id: Date.now().toString(), name: 'Nový', url: 'https://' }] })} className="text-xs text-amber-600">+ Pridať</button>
                </div>
              )}

              {/* SURROUNDINGS */}
              {tab === 'surroundings' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">🗺️ Okolie ({data.surroundings.attractions.length})</h3>
                    <button onClick={() => updateSection('surroundings', { attractions: [...data.surroundings.attractions, { id: Date.now().toString(), image: '', category: 'PRÍRODA', title: 'Nové', description: 'Popis...' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <Input label="Label" value={data.surroundings.label} onChange={v => updateSection('surroundings', { label: v })} />
                  <Input label="Titulok" value={data.surroundings.title} onChange={v => updateSection('surroundings', { title: v })} />
                  {data.surroundings.attractions.map((a, i) => (
                    <div key={a.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input value={a.category} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i].category = e.target.value; updateSection('surroundings', { attractions: arr }); }} className="w-20 p-1 border rounded text-xs" />
                        <input value={a.title} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i].title = e.target.value; updateSection('surroundings', { attractions: arr }); }} className="flex-1 p-1 border rounded text-sm" />
                        <DelBtn onClick={() => updateSection('surroundings', { attractions: data.surroundings.attractions.filter(x => x.id !== a.id) })} />
                      </div>
                      <textarea value={a.description} onChange={e => { const arr = [...data.surroundings.attractions]; arr[i].description = e.target.value; updateSection('surroundings', { attractions: arr }); }} className="w-full p-1 border rounded text-xs" rows={2} />
                      <button onClick={() => upload(src => { const arr = [...data.surroundings.attractions]; arr[i].image = src; updateSection('surroundings', { attractions: arr }); })} className="w-full p-1 bg-amber-500 text-white rounded text-xs">📁 Obrázok</button>
                    </div>
                  ))}
                </div>
              )}

              {/* REVIEWS */}
              {tab === 'reviews' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">⭐ Recenzie ({data.reviews.items.length})</h3>
                    <button onClick={() => updateSection('reviews', { items: [...data.reviews.items, { id: Date.now().toString(), name: 'Meno', text: 'Text...', rating: 5, date: '2024-01' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <Input label="Label" value={data.reviews.label} onChange={v => updateSection('reviews', { label: v })} />
                  <Input label="Titulok" value={data.reviews.title} onChange={v => updateSection('reviews', { title: v })} />
                  {data.reviews.items.map((r, i) => (
                    <div key={r.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input value={r.name} onChange={e => { const arr = [...data.reviews.items]; arr[i].name = e.target.value; updateSection('reviews', { items: arr }); }} className="flex-1 p-1 border rounded text-sm" />
                        <input value={r.date} onChange={e => { const arr = [...data.reviews.items]; arr[i].date = e.target.value; updateSection('reviews', { items: arr }); }} className="w-20 p-1 border rounded text-xs" />
                        <select value={r.rating} onChange={e => { const arr = [...data.reviews.items]; arr[i].rating = +e.target.value; updateSection('reviews', { items: arr }); }} className="p-1 border rounded text-sm">
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}⭐</option>)}
                        </select>
                        <DelBtn onClick={() => updateSection('reviews', { items: data.reviews.items.filter(x => x.id !== r.id) })} />
                      </div>
                      <textarea value={r.text} onChange={e => { const arr = [...data.reviews.items]; arr[i].text = e.target.value; updateSection('reviews', { items: arr }); }} className="w-full p-1 border rounded text-xs" rows={2} />
                    </div>
                  ))}
                </div>
              )}

              {/* FAQ */}
              {tab === 'faq' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold">❓ FAQ ({data.faq.items.length})</h3>
                    <button onClick={() => updateSection('faq', { items: [...data.faq.items, { id: Date.now().toString(), question: 'Otázka?', answer: 'Odpoveď...' }] })} className="px-3 py-1 bg-amber-500 text-white rounded text-sm font-bold">➕</button>
                  </div>
                  <Input label="Label" value={data.faq.label} onChange={v => updateSection('faq', { label: v })} />
                  <Input label="Titulok" value={data.faq.title} onChange={v => updateSection('faq', { title: v })} />
                  {data.faq.items.map((f, i) => (
                    <div key={f.id} className="p-2 bg-gray-50 rounded space-y-2">
                      <div className="flex gap-2 items-center">
                        <input value={f.question} onChange={e => { const arr = [...data.faq.items]; arr[i].question = e.target.value; updateSection('faq', { items: arr }); }} className="flex-1 p-1 border rounded text-sm font-medium" />
                        <DelBtn onClick={() => updateSection('faq', { items: data.faq.items.filter(x => x.id !== f.id) })} />
                      </div>
                      <textarea value={f.answer} onChange={e => { const arr = [...data.faq.items]; arr[i].answer = e.target.value; updateSection('faq', { items: arr }); }} className="w-full p-1 border rounded text-xs" rows={2} />
                    </div>
                  ))}
                </div>
              )}

              {/* CONTACT */}
              {tab === 'contact' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">📞 Kontakt</h3>
                  <Input label="Label" value={data.contact.label} onChange={v => updateSection('contact', { label: v })} />
                  <Input label="Titulok" value={data.contact.title} onChange={v => updateSection('contact', { title: v })} />
                  <Input label="Adresa - label" value={data.contact.addressLabel} onChange={v => updateSection('contact', { addressLabel: v })} />
                  <Input label="Adresa" value={data.contact.address} onChange={v => updateSection('contact', { address: v })} />
                  <Input label="Telefón - label" value={data.contact.phoneLabel} onChange={v => updateSection('contact', { phoneLabel: v })} />
                  <Input label="Telefón" value={data.contact.phone} onChange={v => updateSection('contact', { phone: v })} />
                  <Input label="Email - label" value={data.contact.emailLabel} onChange={v => updateSection('contact', { emailLabel: v })} />
                  <Input label="Email" value={data.contact.email} onChange={v => updateSection('contact', { email: v })} />
                  <Input label="Časy - label" value={data.contact.hoursLabel} onChange={v => updateSection('contact', { hoursLabel: v })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Check-in" value={data.contact.checkIn} onChange={v => updateSection('contact', { checkIn: v })} />
                    <Input label="Check-out" value={data.contact.checkOut} onChange={v => updateSection('contact', { checkOut: v })} />
                  </div>
                  <Input label="Mapa - label" value={data.contact.mapLabel} onChange={v => updateSection('contact', { mapLabel: v })} />
                </div>
              )}

              {/* FOOTER */}
              {tab === 'footer' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">📄 Footer</h3>
                  <Input label="Popis" value={data.footer.description} onChange={v => updateSection('footer', { description: v })} textarea rows={3} />
                  <Input label="Telefón" value={data.footer.phone} onChange={v => updateSection('footer', { phone: v })} />
                  <Input label="Email" value={data.footer.email} onChange={v => updateSection('footer', { email: v })} />
                  <Input label="Lokácia" value={data.footer.location} onChange={v => updateSection('footer', { location: v })} />
                  <Input label="Copyright" value={data.footer.copyright} onChange={v => updateSection('footer', { copyright: v })} />
                  <Input label="Made with" value={data.footer.madeWith} onChange={v => updateSection('footer', { madeWith: v })} />
                  <Input label="Privacy text" value={data.footer.privacyText} onChange={v => updateSection('footer', { privacyText: v })} />
                  <Input label="Terms text" value={data.footer.termsText} onChange={v => updateSection('footer', { termsText: v })} />
                  <Input label="Book via text" value={data.footer.bookViaText} onChange={v => updateSection('footer', { bookViaText: v })} />
                </div>
              )}

              {/* NAV */}
              {tab === 'nav' && (
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-2">🧭 Navigácia</h3>
                  <Input label="Domov" value={data.nav.home} onChange={v => updateSection('nav', { home: v })} />
                  <Input label="Galéria" value={data.nav.gallery} onChange={v => updateSection('nav', { gallery: v })} />
                  <Input label="Vybavenie" value={data.nav.amenities} onChange={v => updateSection('nav', { amenities: v })} />
                  <Input label="Rezervácia" value={data.nav.booking} onChange={v => updateSection('nav', { booking: v })} />
                  <Input label="Cenník" value={data.nav.pricing} onChange={v => updateSection('nav', { pricing: v })} />
                  <Input label="Okolie" value={data.nav.surroundings} onChange={v => updateSection('nav', { surroundings: v })} />
                  <Input label="Recenzie" value={data.nav.reviews} onChange={v => updateSection('nav', { reviews: v })} />
                  <Input label="FAQ" value={data.nav.faq} onChange={v => updateSection('nav', { faq: v })} />
                  <Input label="Kontakt" value={data.nav.contact} onChange={v => updateSection('nav', { contact: v })} />
                  <Input label="Tlačidlo Rezervovať" value={data.nav.bookNow} onChange={v => updateSection('nav', { bookNow: v })} />
                </div>
              )}

              {/* SETTINGS */}
              {tab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-2">⚙️ Nastavenia</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-600 mb-3">Toto vymaže VŠETKY zmeny!</p>
                    <button onClick={() => { if(confirm('Naozaj?')) resetAll(); }} className="w-full p-3 bg-red-500 text-white rounded font-bold">🗑️ Resetovať</button>
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
