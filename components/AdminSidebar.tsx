'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/lib/AdminContext';

type Tab = 'content' | 'gallery' | 'pricing' | 'settings';

export default function AdminSidebar() {
  const {
    isAdmin, isEditing, login, logout, toggleEditing,
    content, updateContent, updateNestedContent,
    addGalleryImage, removeGalleryImage, moveGalleryImage,
    saveAll, resetToDefaults, exportData, importData,
  } = useAdmin();

  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saveFlash, setSaveFlash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+Shift+A to toggle admin
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdmin) {
          setIsHidden(h => !h);
        } else {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) setIsHidden(false);
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setShowLogin(false);
      setPassword('');
      setError('');
      setIsHidden(false);
    } else {
      setError('Nesprávne heslo');
    }
  };

  const handleSave = () => {
    saveAll();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addGalleryImage(ev.target?.result as string, file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chata-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (importData(ev.target?.result as string)) {
        alert('✅ Import úspešný!');
      } else {
        alert('❌ Chyba importu');
      }
    };
    reader.readAsText(file);
  };

  // ==========================================
  // Login trigger button (skrytý v rohu)
  // ==========================================
  if (!isAdmin) {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-3 left-3 w-8 h-8 rounded-full opacity-[0.08] hover:opacity-60 transition-all z-50 text-sm bg-black/10 flex items-center justify-center"
          title="Admin (Ctrl+Shift+A)"
        >
          ⚙️
        </button>

        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] p-4" onClick={() => setShowLogin(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg">⛰️</div>
                <div>
                  <h2 className="font-bold text-graphite">Admin panel</h2>
                  <p className="text-xs text-gray-400">Správa obsahu webu</p>
                </div>
              </div>
              
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Zadajte heslo..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs mb-3">⚠️ {error}</p>}
                <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-sm">
                  Prihlásiť sa
                </button>
              </form>
              
              <button onClick={() => setShowLogin(false)} className="w-full mt-2 py-2 text-gray-400 hover:text-gray-600 text-sm">
                Zrušiť
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ==========================================
  // Collapsed mini bar (WordPress-style)
  // ==========================================
  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-[200] bg-gray-900 hover:bg-gray-800 text-white w-8 py-4 rounded-r-lg shadow-lg transition-all hover:w-10 group"
        title="Otvoriť admin panel"
      >
        <svg className="w-4 h-4 mx-auto group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  // ==========================================
  // Tab navigation items
  // ==========================================
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'content', icon: '📝', label: 'Obsah' },
    { id: 'gallery', icon: '🖼️', label: 'Galéria' },
    { id: 'pricing', icon: '💰', label: 'Cenník' },
    { id: 'settings', icon: '⚙️', label: 'Nastavenia' },
  ];

  const sidebarWidth = isCollapsed ? 'w-14' : 'w-80';

  // ==========================================
  // Full sidebar
  // ==========================================
  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full ${sidebarWidth} bg-gray-900 text-white z-[200] transition-all duration-300 flex flex-col shadow-2xl`}>
        
        {/* === Header === */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center text-sm shrink-0">⛰️</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">Chata Admin</p>
                <p className="text-[10px] text-gray-400 truncate">chataprikastieli.sk</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title={isCollapsed ? 'Rozbaliť' : 'Zbaliť'}
            >
              <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIsHidden(true)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title="Schovať panel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* === Quick Actions === */}
        <div className={`flex ${isCollapsed ? 'flex-col' : ''} gap-1 p-2 border-b border-white/10`}>
          <button
            onClick={toggleEditing}
            className={`flex items-center gap-2 ${isCollapsed ? 'justify-center p-2' : 'flex-1 px-3 py-2'} rounded-lg text-xs font-medium transition-all ${
              isEditing 
                ? 'bg-yellow-500 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isEditing ? 'Vypnúť editovanie' : 'Inline editovanie'}
          >
            <span className="text-sm">{isEditing ? '✏️' : '👁️'}</span>
            {!isCollapsed && (isEditing ? 'Editujem' : 'Editovať')}
          </button>
          
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 ${isCollapsed ? 'justify-center p-2' : 'flex-1 px-3 py-2'} rounded-lg text-xs font-medium transition-all ${
              saveFlash ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
            title="Uložiť zmeny"
          >
            <span className="text-sm">{saveFlash ? '✓' : '💾'}</span>
            {!isCollapsed && (saveFlash ? 'Uložené!' : 'Uložiť')}
          </button>
        </div>

        {/* === Tab Navigation === */}
        <div className={`flex ${isCollapsed ? 'flex-col' : ''} gap-0.5 p-2 border-b border-white/10`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (isCollapsed) setIsCollapsed(false); }}
              className={`flex items-center gap-2 ${isCollapsed ? 'justify-center p-2' : 'flex-1 px-2 py-2 justify-center'} rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white/15 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={tab.label}
            >
              <span className="text-sm">{tab.icon}</span>
              {!isCollapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </div>

        {/* === Tab Content (scrollable) === */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 scrollbar-thin">
            
            {/* Content Tab */}
            {activeTab === 'content' && (
              <>
                <SectionLabel label="Hero sekcia" />
                <InputField label="Nadpis" value={content.heroTitle} onChange={v => updateContent('heroTitle', v)} />
                <TextAreaField label="Podnadpis" value={content.heroSubtitle} onChange={v => updateContent('heroSubtitle', v)} />
                
                <SectionLabel label="Kontaktné údaje" />
                <InputField label="Telefón" value={content.phone} onChange={v => updateContent('phone', v)} icon="📞" />
                <InputField label="Email" value={content.email} onChange={v => updateContent('email', v)} icon="✉️" />
                <InputField label="Adresa" value={content.address} onChange={v => updateContent('address', v)} icon="📍" />
                
                <SectionLabel label="Prevádzka" />
                <div className="grid grid-cols-2 gap-2">
                  <InputField label="Check-in" value={content.checkIn} onChange={v => updateContent('checkIn', v)} />
                  <InputField label="Check-out" value={content.checkOut} onChange={v => updateContent('checkOut', v)} />
                </div>

                {isEditing && (
                  <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-xs text-yellow-300 leading-relaxed">
                      ✏️ <strong>Inline režim aktívny!</strong> Klikajte na texty priamo na stránke a upravujte ich.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <>
                <SectionLabel label={`Galéria (${content.gallery.length} fotiek)`} />
                
                {/* Upload controls */}
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      placeholder="URL obrázka..."
                      className="flex-1 px-2.5 py-2 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30"
                    />
                    <button
                      onClick={() => { if (newImageUrl.trim()) { addGalleryImage(newImageUrl.trim()); setNewImageUrl(''); } }}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium shrink-0"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
                  >
                    📁 Nahrať súbor
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>

                {/* Image grid */}
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {content.gallery.map((img, i) => (
                    <div key={i} className="relative group aspect-square bg-white/10 rounded-lg overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect fill="%23444" width="60" height="60"/><text fill="%23888" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10">?</text></svg>'; }}
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {i > 0 && (
                          <button onClick={() => moveGalleryImage(i, i - 1)} className="w-6 h-6 bg-white/20 hover:bg-white/40 rounded text-[10px] flex items-center justify-center">←</button>
                        )}
                        <button onClick={() => removeGalleryImage(i)} className="w-6 h-6 bg-red-600 hover:bg-red-500 rounded text-[10px] flex items-center justify-center">✕</button>
                        {i < content.gallery.length - 1 && (
                          <button onClick={() => moveGalleryImage(i, i + 1)} className="w-6 h-6 bg-white/20 hover:bg-white/40 rounded text-[10px] flex items-center justify-center">→</button>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                        <span className="text-[9px] text-gray-300">#{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <>
                {([
                  { key: 'weekend', label: '🌙 Víkend', color: 'blue' },
                  { key: 'reset', label: '⭐ Reset pobyt', color: 'amber' },
                  { key: 'week', label: '📅 Týždeň', color: 'green' },
                ] as const).map(pkg => (
                  <div key={pkg.key} className="bg-white/5 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-white">{pkg.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Noci</label>
                        <input
                          type="number"
                          value={content.pricing[pkg.key].nights}
                          onChange={e => updateNestedContent(`pricing.${pkg.key}.nights`, parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Cena (€)</label>
                        <input
                          type="number"
                          value={content.pricing[pkg.key].price}
                          onChange={e => updateNestedContent(`pricing.${pkg.key}.price`, parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <>
                <SectionLabel label="Záloha" />
                <div className="space-y-2">
                  <button onClick={handleExport} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                    📥 Exportovať JSON
                  </button>
                  <button onClick={() => importRef.current?.click()} className="w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                    📤 Importovať JSON
                  </button>
                  <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                </div>

                <SectionLabel label="Nebezpečná zóna" />
                <button onClick={resetToDefaults} className="w-full py-2.5 bg-red-600/80 hover:bg-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                  🗑️ Reset na predvolené
                </button>

                <SectionLabel label="Info" />
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Heslo</span>
                    <code className="text-gray-300 bg-white/10 px-1.5 py-0.5 rounded text-[10px]">chata2024</code>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Skratka</span>
                    <code className="text-gray-300 bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Ctrl+Shift+A</code>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Uloženie</span>
                    <span className="text-gray-300 text-[10px]">localStorage</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* === Footer === */}
        <div className={`border-t border-white/10 p-2 ${isCollapsed ? '' : 'flex items-center gap-2'}`}>
          {isCollapsed ? (
            <div className="flex flex-col gap-1">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-2 hover:bg-white/10 rounded-lg flex justify-center" title="Na vrch">
                <span className="text-sm">⬆️</span>
              </button>
              <button onClick={logout} className="p-2 hover:bg-red-600/50 rounded-lg flex justify-center" title="Odhlásiť">
                <span className="text-sm">🚪</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 hover:bg-white/10 rounded-lg text-xs"
                title="Na vrch stránky"
              >
                ⬆️
              </button>
              <div className="flex-1" />
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-600/50 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
              >
                <span>🚪</span> Odhlásiť
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Spacer to push page content right */}
      <div className={`${isCollapsed ? 'pl-14' : 'pl-80'} transition-all duration-300`} style={{ display: 'none' }} />

      {/* Editing mode indicator */}
      {isEditing && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[190] bg-yellow-500 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse">
          <span>✏️</span> Inline editovanie aktívne — klikaj na texty
        </div>
      )}
    </>
  );
}

// ==========================================
// Helper components
// ==========================================
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider pt-2">{label}</p>
  );
}

function InputField({ label, value, onChange, icon }: { label: string; value: string; onChange: (v: string) => void; icon?: string }) {
  return (
    <div>
      <label className="text-[10px] text-gray-400 block mb-1">{icon && <span className="mr-1">{icon}</span>}{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-2 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] text-gray-400 block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full px-2.5 py-2 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30 resize-y transition-colors"
      />
    </div>
  );
}
