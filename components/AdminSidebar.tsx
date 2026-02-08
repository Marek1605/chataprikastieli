'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/lib/AdminContext';

type Tab = 'hero' | 'content' | 'gallery' | 'pricing' | 'reviews' | 'faq' | 'settings';

export default function AdminSidebar() {
  const {
    isAdmin, isEditing, login, logout, toggleEditing,
    content, updateContent,
    addGalleryImage, removeGalleryImage, updateGalleryImage, moveGalleryImage,
    addReview, removeReview, updateReview,
    addFAQ, removeFAQ, updateFAQ,
    saveAll, resetToDefaults, exportData, importData, hasUnsavedChanges,
  } = useAdmin();

  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saveFlash, setSaveFlash] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  
  const fileRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Keyboard: Ctrl+Shift+A
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

  useEffect(() => { if (isAdmin) setHidden(false); }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setShowLogin(false);
      setPassword('');
      setError('');
    } else {
      setError('Nesprávne heslo');
    }
  };

  const handleSave = () => {
    saveAll();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addGalleryImage(ev.target?.result as string, file.name);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chata-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      importData(ev.target?.result as string) ? alert('✅ Import úspešný!') : alert('❌ Chyba importu');
    };
    reader.readAsText(file);
  };

  // ========== LOGIN BUTTON (SKRYTÝ) ==========
  if (!isAdmin) {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-3 left-3 w-8 h-8 rounded-full opacity-30 hover:opacity-50 transition-all z-50 bg-black/20 flex items-center justify-center text-xs"
          title="Admin (Ctrl+Shift+A)"
        >⚙</button>

        {showLogin && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[300] p-4" onClick={() => setShowLogin(false)}>
            <div className="bg-[#1e1e1e] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">⛰️</div>
                <div>
                  <h2 className="font-bold text-white text-lg">Admin Panel</h2>
                  <p className="text-xs text-gray-400">Správa obsahu webu</p>
                </div>
              </div>
              
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Heslo..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl mb-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                {error && <p className="text-red-400 text-xs mb-3 flex items-center gap-1">⚠️ {error}</p>}
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all">
                  Prihlásiť sa
                </button>
              </form>
              
              <button onClick={() => setShowLogin(false)} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-300 text-sm">
                Zrušiť
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ========== HIDDEN STATE - SHOW BUTTON ==========
  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-[200] bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white w-6 py-6 rounded-r-lg shadow-xl transition-all hover:w-8 border-r border-t border-b border-white/10"
        title="Otvoriť admin"
      >
        <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  // ========== TABS CONFIG ==========
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'hero', icon: '🏠', label: 'Hero' },
    { id: 'content', icon: '📝', label: 'Obsah' },
    { id: 'gallery', icon: '🖼️', label: 'Galéria' },
    { id: 'pricing', icon: '💰', label: 'Cenník' },
    { id: 'reviews', icon: '⭐', label: 'Recenzie' },
    { id: 'faq', icon: '❓', label: 'FAQ' },
    { id: 'settings', icon: '⚙️', label: 'Nastavenia' },
  ];

  const w = collapsed ? 'w-14' : 'w-80';

  // ========== MAIN SIDEBAR ==========
  return (
    <>
      <aside className={`fixed top-0 left-0 h-full ${w} bg-[#1e1e1e] text-white z-[200] transition-all duration-300 flex flex-col shadow-2xl border-r border-white/5`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm shrink-0">⛰️</div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">Chata Admin</p>
                <p className="text-[10px] text-gray-500 truncate">Správa obsahu</p>
              </div>
            </div>
          )}
          <div className="flex gap-0.5 shrink-0">
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-white/10 rounded-lg" title={collapsed ? 'Rozbaliť' : 'Zbaliť'}>
              <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => setHidden(true)} className="p-1.5 hover:bg-white/10 rounded-lg" title="Schovať">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className={`flex ${collapsed ? 'flex-col' : ''} gap-1 p-2 border-b border-white/10`}>
          <button
            onClick={toggleEditing}
            className={`flex items-center gap-2 ${collapsed ? 'justify-center p-2.5' : 'flex-1 px-3 py-2.5'} rounded-xl text-xs font-semibold transition-all ${
              isEditing ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
            title="Inline editovanie"
          >
            <span>{isEditing ? '✏️' : '👁️'}</span>
            {!collapsed && (isEditing ? 'Editovanie ON' : 'Editovať web')}
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges && !saveFlash}
            className={`flex items-center gap-2 ${collapsed ? 'justify-center p-2.5' : 'flex-1 px-3 py-2.5'} rounded-xl text-xs font-semibold transition-all ${
              saveFlash ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
              : hasUnsavedChanges ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-white/5 text-gray-500'
            }`}
            title="Uložiť zmeny"
          >
            <span>{saveFlash ? '✓' : '💾'}</span>
            {!collapsed && (saveFlash ? 'Uložené!' : hasUnsavedChanges ? 'Uložiť*' : 'Uložiť')}
          </button>
        </div>

        {/* TABS */}
        <div className={`${collapsed ? 'flex flex-col' : 'grid grid-cols-4'} gap-0.5 p-2 border-b border-white/10`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (collapsed) setCollapsed(false); }}
              className={`flex items-center justify-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-all ${
                activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
              title={tab.label}
            >
              <span className="text-sm">{tab.icon}</span>
              {!collapsed && <span className="hidden">{tab.label}</span>}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* ===== HERO TAB ===== */}
            {activeTab === 'hero' && (
              <>
                <Section title="🏠 Hero sekcia">
                  <Field label="Nadpis" value={content.hero.title} onChange={v => updateContent('hero.title', v)} />
                  <TextArea label="Podnadpis" value={content.hero.subtitle} onChange={v => updateContent('hero.subtitle', v)} rows={3} />
                  <ImageField 
                    label="Pozadie" 
                    value={content.hero.backgroundImage} 
                    onChange={v => updateContent('hero.backgroundImage', v)} 
                  />
                </Section>
              </>
            )}

            {/* ===== CONTENT TAB ===== */}
            {activeTab === 'content' && (
              <>
                <Section title="📞 Kontakt">
                  <Field label="Telefón" value={content.contact.phone} onChange={v => updateContent('contact.phone', v)} icon="📞" />
                  <Field label="Email" value={content.contact.email} onChange={v => updateContent('contact.email', v)} icon="✉️" />
                  <Field label="Adresa" value={content.contact.address} onChange={v => updateContent('contact.address', v)} icon="📍" />
                </Section>
                
                <Section title="🕐 Prevádzka">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Check-in" value={content.booking.checkIn} onChange={v => updateContent('booking.checkIn', v)} />
                    <Field label="Check-out" value={content.booking.checkOut} onChange={v => updateContent('booking.checkOut', v)} />
                  </div>
                </Section>
              </>
            )}

            {/* ===== GALLERY TAB ===== */}
            {activeTab === 'gallery' && (
              <>
                <Section title={`🖼️ Galéria (${content.gallery.length})`}>
                  {/* Add new */}
                  <div className="flex gap-1 mb-3">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      placeholder="URL obrázka..."
                      className="flex-1 px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button onClick={() => { if (newImageUrl) { addGalleryImage(newImageUrl); setNewImageUrl(''); } }} className="px-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold">+</button>
                  </div>
                  <button onClick={() => fileRef.current?.click()} className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-2 mb-3 border border-dashed border-white/20">
                    📁 Nahrať z počítača
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {content.gallery.map((img, i) => (
                      <div key={img.id} className="relative group">
                        <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect fill="%23333" width="60" height="60"/><text fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="8">?</text></svg>'; }} />
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-1 p-1">
                          <span className="text-[9px] text-gray-400">#{i + 1}</span>
                          <div className="flex gap-0.5">
                            {i > 0 && <button onClick={() => moveGalleryImage(i, i - 1)} className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded text-[8px] flex items-center justify-center">←</button>}
                            <button onClick={() => setEditingImage(img.id)} className="w-5 h-5 bg-blue-600 hover:bg-blue-500 rounded text-[8px] flex items-center justify-center">✎</button>
                            <button onClick={() => removeGalleryImage(img.id)} className="w-5 h-5 bg-red-600 hover:bg-red-500 rounded text-[8px] flex items-center justify-center">✕</button>
                            {i < content.gallery.length - 1 && <button onClick={() => moveGalleryImage(i, i + 1)} className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded text-[8px] flex items-center justify-center">→</button>}
                          </div>
                        </div>

                        {/* Edit modal */}
                        {editingImage === img.id && (
                          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[300] p-4" onClick={() => setEditingImage(null)}>
                            <div className="bg-[#2a2a2a] rounded-xl p-4 w-full max-w-sm space-y-3" onClick={e => e.stopPropagation()}>
                              <p className="text-sm font-semibold">Upraviť obrázok #{i + 1}</p>
                              <div className="aspect-video bg-black/50 rounded-lg overflow-hidden">
                                <img src={img.src} alt={img.alt} className="w-full h-full object-contain" />
                              </div>
                              <Field label="URL" value={img.src} onChange={v => updateGalleryImage(img.id, { src: v })} />
                              <Field label="Alt text" value={img.alt} onChange={v => updateGalleryImage(img.id, { alt: v })} />
                              <button onClick={() => setEditingImage(null)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold">Hotovo</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* ===== PRICING TAB ===== */}
            {activeTab === 'pricing' && (
              <>
                {(['weekend', 'reset', 'week'] as const).map((pkg, i) => (
                  <Section key={pkg} title={['🌙 Víkend', '⭐ Reset pobyt', '📅 Týždeň'][i]}>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Noci" type="number" value={String(content.pricing[pkg].nights)} onChange={v => updateContent(`pricing.${pkg}.nights`, parseInt(v) || 0)} />
                      <Field label="Cena (€)" type="number" value={String(content.pricing[pkg].price)} onChange={v => updateContent(`pricing.${pkg}.price`, parseInt(v) || 0)} />
                    </div>
                  </Section>
                ))}
              </>
            )}

            {/* ===== REVIEWS TAB ===== */}
            {activeTab === 'reviews' && (
              <>
                <Section title={`⭐ Recenzie (${content.reviews.length})`}>
                  <button 
                    onClick={() => addReview({ name: 'Nový hosť', date: 'Mesiac 2024', text: 'Skvelý pobyt!', rating: 5 })}
                    className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-semibold mb-3"
                  >
                    + Pridať recenziu
                  </button>
                  
                  <div className="space-y-3">
                    {content.reviews.map((review, i) => (
                      <div key={review.id} className="bg-white/5 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">Recenzia #{i + 1}</span>
                          <button onClick={() => removeReview(review.id)} className="text-red-400 hover:text-red-300 text-xs">🗑️</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="Meno" value={review.name} onChange={v => updateReview(review.id, { name: v })} small />
                          <Field label="Dátum" value={review.date} onChange={v => updateReview(review.id, { date: v })} small />
                        </div>
                        <TextArea label="Text" value={review.text} onChange={v => updateReview(review.id, { text: v })} rows={2} small />
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-1">Hodnotenie</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                              <button
                                key={n}
                                onClick={() => updateReview(review.id, { rating: n })}
                                className={`w-6 h-6 rounded ${review.rating >= n ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-500'} text-xs`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* ===== FAQ TAB ===== */}
            {activeTab === 'faq' && (
              <>
                <Section title={`❓ FAQ (${content.faq.length})`}>
                  <button 
                    onClick={() => addFAQ({ question: 'Nová otázka?', answer: 'Odpoveď...' })}
                    className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-semibold mb-3"
                  >
                    + Pridať otázku
                  </button>
                  
                  <div className="space-y-3">
                    {content.faq.map((item, i) => (
                      <div key={item.id} className="bg-white/5 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">FAQ #{i + 1}</span>
                          <button onClick={() => removeFAQ(item.id)} className="text-red-400 hover:text-red-300 text-xs">🗑️</button>
                        </div>
                        <Field label="Otázka" value={item.question} onChange={v => updateFAQ(item.id, { question: v })} small />
                        <TextArea label="Odpoveď" value={item.answer} onChange={v => updateFAQ(item.id, { answer: v })} rows={2} small />
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* ===== SETTINGS TAB ===== */}
            {activeTab === 'settings' && (
              <>
                <Section title="💾 Záloha dát">
                  <button onClick={handleExport} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 mb-2">
                    📥 Exportovať JSON
                  </button>
                  <button onClick={() => importRef.current?.click()} className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-dashed border-white/20">
                    📤 Importovať JSON
                  </button>
                  <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                </Section>

                <Section title="⚠️ Nebezpečná zóna">
                  <button 
                    onClick={() => confirm('Naozaj resetovať všetko na predvolené hodnoty?') && resetToDefaults()} 
                    className="w-full py-2.5 bg-red-600/50 hover:bg-red-600 rounded-lg text-xs font-semibold"
                  >
                    🗑️ Reset na predvolené
                  </button>
                </Section>

                <Section title="ℹ️ Informácie">
                  <div className="bg-white/5 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">Heslo:</span><code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">ChataAdmin2025!</code></div>
                    <div className="flex justify-between"><span className="text-gray-400">Skratka:</span><code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Ctrl+Shift+A</code></div>
                    <div className="flex justify-between"><span className="text-gray-400">Uloženie:</span><span className="text-gray-300">localStorage</span></div>
                  </div>
                </Section>
              </>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className={`border-t border-white/10 p-2 ${collapsed ? '' : 'flex items-center'}`}>
          {collapsed ? (
            <div className="flex flex-col gap-1">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-2 hover:bg-white/10 rounded-lg flex justify-center text-xs" title="Na vrch">⬆️</button>
              <button onClick={logout} className="p-2 hover:bg-red-600/50 rounded-lg flex justify-center text-xs" title="Odhlásiť">🚪</button>
            </div>
          ) : (
            <>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-2 hover:bg-white/10 rounded-lg text-xs">⬆️</button>
              <div className="flex-1" />
              <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-600/30 rounded-lg text-xs text-gray-400 hover:text-white">
                🚪 Odhlásiť
              </button>
            </>
          )}
        </div>
      </aside>

      {/* EDITING INDICATOR */}
      {isEditing && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[190] bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2">
          <span className="animate-pulse">✏️</span> Klikaj na texty pre úpravu
        </div>
      )}
    </>
  );
}

// ========== HELPER COMPONENTS ==========
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, icon, type = 'text', small }: { label: string; value: string; onChange: (v: string) => void; icon?: string; type?: string; small?: boolean }) {
  return (
    <div>
      <label className={`${small ? 'text-[9px]' : 'text-[10px]'} text-gray-400 block mb-1`}>{icon && <span className="mr-1">{icon}</span>}{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full ${small ? 'px-2 py-1.5 text-[11px]' : 'px-2.5 py-2 text-xs'} bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, small }: { label: string; value: string; onChange: (v: string) => void; rows?: number; small?: boolean }) {
  return (
    <div>
      <label className={`${small ? 'text-[9px]' : 'text-[10px]'} text-gray-400 block mb-1`}>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className={`w-full ${small ? 'px-2 py-1.5 text-[11px]' : 'px-2.5 py-2 text-xs'} bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y transition-colors`}
      />
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="text-[10px] text-gray-400 block mb-1">{label}</label>
      <div className="relative">
        <div className="aspect-video bg-white/5 rounded-lg overflow-hidden mb-2">
          <img src={value} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setEditing(!editing)} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-medium">
            {editing ? 'Zavrieť' : '✎ Upraviť URL'}
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-medium">
            📁 Nahrať
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
        {editing && (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full mt-2 px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="URL obrázka..."
          />
        )}
      </div>
    </div>
  );
}
