'use client';
import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

type Tab = 'hero' | 'gallery' | 'pricing' | 'reviews' | 'faq' | 'contact' | 'settings';

export default function AdminSidebar() {
  const { data, isAdmin, setAdmin, updateHero, updateGallery, updatePricing, updateReviews, updateFaq, updateContact, resetAll } = useAdmin();
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

  // KOMPRIMÁCIA OBRÁZKA - zmenší veľkosť pre localStorage
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Zmenši ak je väčší než maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Komprimuj ako JPEG
          const compressed = canvas.toDataURL('image/jpeg', quality);
          console.log(`Compressed: ${(file.size/1024).toFixed(0)}KB -> ${(compressed.length/1024).toFixed(0)}KB`);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (callback: (base64: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      flash('⏳ Komprimujem...');
      try {
        const compressed = await compressImage(file, 800, 0.6);
        callback(compressed);
        flash('✅ Uložené!');
      } catch (err) {
        console.error(err);
        flash('❌ Chyba!');
      }
    };
    input.click();
  };

  if (!isAdmin) {
    return (
      <>
        <button onClick={() => setShowLogin(true)} className="fixed bottom-4 left-4 w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-xl text-2xl z-50 shadow-xl border-2 border-gray-600">⚙️</button>
        {showLogin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500]" onClick={() => setShowLogin(false)}>
            <div className="bg-white p-6 rounded-xl w-80" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">🔐 Admin prihlásenie</h2>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Heslo" className="w-full p-3 border rounded-lg mb-3" onKeyDown={e => e.key === 'Enter' && login()} autoFocus />
              <button onClick={login} className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold">Prihlásiť</button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[400] bg-gradient-to-r from-green-600 to-green-700 text-white p-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">🔧 ADMIN</span>
          <button onClick={() => setShowPanel(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium">📝 Upraviť obsah</button>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="px-3 py-1 bg-white/20 rounded-lg">{status}</span>}
          <button onClick={logout} className="px-4 py-2 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100">Odhlásiť</button>
        </div>
      </div>

      {showPanel && (
        <div className="fixed inset-0 bg-black/50 z-[450]" onClick={() => setShowPanel(false)}>
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">📝 Správa obsahu</h2>
              <button onClick={() => setShowPanel(false)} className="text-2xl hover:text-gray-600">✕</button>
            </div>

            <div className="flex flex-wrap gap-1 p-3 border-b bg-gray-50">
              {[
                { id: 'hero', icon: '🏠', label: 'Hero' },
                { id: 'gallery', icon: '🖼️', label: 'Galéria' },
                { id: 'pricing', icon: '💰', label: 'Cenník' },
                { id: 'reviews', icon: '⭐', label: 'Recenzie' },
                { id: 'faq', icon: '❓', label: 'FAQ' },
                { id: 'contact', icon: '📞', label: 'Kontakt' },
                { id: 'settings', icon: '⚙️', label: 'Nastavenia' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as Tab)} className={`px-3 py-2 rounded-lg font-medium ${tab === t.id ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-100'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              {tab === 'hero' && (
                <>
                  <h3 className="font-bold text-lg">🏠 Hero sekcia</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Titulok</label>
                    <input value={data.hero.title} onChange={e => { updateHero({ title: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Podtitulok</label>
                    <textarea value={data.hero.subtitle} onChange={e => { updateHero({ subtitle: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pozadie</label>
                    <div className="flex gap-2">
                      <input value={data.hero.backgroundImage} onChange={e => { updateHero({ backgroundImage: e.target.value }); flash('✅'); }} className="flex-1 p-3 border rounded-lg" />
                      <button onClick={() => uploadImage(src => updateHero({ backgroundImage: src }))} className="px-4 py-2 bg-green-500 text-white rounded-lg">📁</button>
                    </div>
                  </div>
                </>
              )}

              {tab === 'gallery' && (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">🖼️ Galéria ({data.gallery.length})</h3>
                    <button onClick={() => uploadImage(src => { updateGallery([...data.gallery, { id: Date.now().toString(), src, alt: 'Nový' }]); })} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">➕ Pridať</button>
                  </div>
                  <p className="text-sm text-gray-500">Obrázky sú automaticky komprimované pre úsporu miesta.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {data.gallery.map((img, i) => (
                      <div key={img.id} className="relative group">
                        <img src={img.src} alt={img.alt} className="w-full h-24 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded-lg">
                          {i > 0 && <button onClick={() => { const g = [...data.gallery]; [g[i], g[i-1]] = [g[i-1], g[i]]; updateGallery(g); flash('✅'); }} className="w-8 h-8 bg-white rounded text-sm">←</button>}
                          <button onClick={() => { updateGallery(data.gallery.filter(g => g.id !== img.id)); flash('✅'); }} className="w-8 h-8 bg-red-500 text-white rounded text-sm">✕</button>
                          {i < data.gallery.length - 1 && <button onClick={() => { const g = [...data.gallery]; [g[i], g[i+1]] = [g[i+1], g[i]]; updateGallery(g); flash('✅'); }} className="w-8 h-8 bg-white rounded text-sm">→</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === 'pricing' && (
                <>
                  <h3 className="font-bold text-lg">💰 Cenník</h3>
                  {(['weekend', 'reset', 'week'] as const).map(pkg => (
                    <div key={pkg} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">{pkg === 'weekend' ? '🌙 Víkend' : pkg === 'reset' ? '⭐ Reset' : '📅 Týždeň'}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs">Noci</label>
                          <input type="number" value={data.pricing[pkg].nights} onChange={e => { updatePricing({ [pkg]: { ...data.pricing[pkg], nights: +e.target.value } }); flash('✅'); }} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                          <label className="text-xs">Cena €</label>
                          <input type="number" value={data.pricing[pkg].price} onChange={e => { updatePricing({ [pkg]: { ...data.pricing[pkg], price: +e.target.value } }); flash('✅'); }} className="w-full p-2 border rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {tab === 'reviews' && (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">⭐ Recenzie ({data.reviews.length})</h3>
                    <button onClick={() => { updateReviews([...data.reviews, { id: Date.now().toString(), name: 'Nový', text: 'Text', rating: 5, date: new Date().toISOString().slice(0,7) }]); flash('✅'); }} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">➕</button>
                  </div>
                  {data.reviews.map((r, i) => (
                    <div key={r.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <input value={r.name} onChange={e => { const rev = [...data.reviews]; rev[i].name = e.target.value; updateReviews(rev); }} className="flex-1 p-2 border rounded" placeholder="Meno" />
                        <select value={r.rating} onChange={e => { const rev = [...data.reviews]; rev[i].rating = +e.target.value; updateReviews(rev); }} className="p-2 border rounded">
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}⭐</option>)}
                        </select>
                        <button onClick={() => { updateReviews(data.reviews.filter(x => x.id !== r.id)); flash('✅'); }} className="px-3 bg-red-500 text-white rounded">✕</button>
                      </div>
                      <textarea value={r.text} onChange={e => { const rev = [...data.reviews]; rev[i].text = e.target.value; updateReviews(rev); }} className="w-full p-2 border rounded" rows={2} />
                    </div>
                  ))}
                </>
              )}

              {tab === 'faq' && (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">❓ FAQ ({data.faq.length})</h3>
                    <button onClick={() => { updateFaq([...data.faq, { id: Date.now().toString(), question: 'Otázka?', answer: 'Odpoveď' }]); flash('✅'); }} className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">➕</button>
                  </div>
                  {data.faq.map((f, i) => (
                    <div key={f.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex gap-2">
                        <input value={f.question} onChange={e => { const faq = [...data.faq]; faq[i].question = e.target.value; updateFaq(faq); }} className="flex-1 p-2 border rounded" />
                        <button onClick={() => { updateFaq(data.faq.filter(x => x.id !== f.id)); flash('✅'); }} className="px-3 bg-red-500 text-white rounded">✕</button>
                      </div>
                      <textarea value={f.answer} onChange={e => { const faq = [...data.faq]; faq[i].answer = e.target.value; updateFaq(faq); }} className="w-full p-2 border rounded" rows={2} />
                    </div>
                  ))}
                </>
              )}

              {tab === 'contact' && (
                <>
                  <h3 className="font-bold text-lg">📞 Kontakt</h3>
                  <div><label className="block text-sm font-medium mb-1">Telefón</label><input value={data.contact.phone} onChange={e => { updateContact({ phone: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Email</label><input value={data.contact.email} onChange={e => { updateContact({ email: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">Adresa</label><input value={data.contact.address} onChange={e => { updateContact({ address: e.target.value }); flash('✅'); }} className="w-full p-3 border rounded-lg" /></div>
                </>
              )}

              {tab === 'settings' && (
                <>
                  <h3 className="font-bold text-lg">⚙️ Nastavenia</h3>
                  <button onClick={() => { if(confirm('Resetovať?')) { resetAll(); flash('✅'); }}} className="w-full p-3 bg-red-500 text-white rounded-lg font-bold">🗑️ Resetovať všetko</button>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                    <p className="font-bold text-yellow-800">⚠️ Limit úložiska</p>
                    <p className="text-yellow-700">Obrázky sú komprimované na max 800px. Ak stále nestačí miesto, zmaž staré obrázky.</p>
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
