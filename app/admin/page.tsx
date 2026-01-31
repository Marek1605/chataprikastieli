'use client';

import { useState, useRef } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'overview' | 'content' | 'gallery' | 'pricing' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const { 
    isAdmin, logout, content, updateContent, updateNestedContent,
    addGalleryImage, removeGalleryImage, moveGalleryImage,
    saveAll, resetToDefaults, exportData, importData
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Prístup zamietnutý</h1>
          <p className="text-gray-500 mb-6">Najprv sa prihláste ako admin na hlavnej stránke.</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-wood hover:bg-wood-light text-white font-bold rounded-xl transition-colors"
          >
            Späť na web
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        addGalleryImage(base64, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      addGalleryImage(newImageUrl.trim());
      setNewImageUrl('');
    }
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
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        if (importData(json)) {
          alert('✅ Dáta boli úspešne importované!');
        } else {
          alert('❌ Chyba pri importovaní dát. Skontrolujte formát súboru.');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Prehľad', icon: '📊' },
    { id: 'content', label: 'Obsah', icon: '📝' },
    { id: 'gallery', label: 'Galéria', icon: '🖼️' },
    { id: 'pricing', label: 'Cenník', icon: '💰' },
    { id: 'settings', label: 'Nastavenia', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏔️</span>
            <div>
              <h1 className="font-bold text-lg">Chata Admin</h1>
              <p className="text-xs text-gray-400">Správa webu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={saveAll} 
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium text-sm flex items-center gap-2"
            >
              <span>💾</span> Uložiť
            </button>
            <Link 
              href="/" 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-sm flex items-center gap-2"
            >
              <span>👁️</span> Web
            </Link>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg font-medium text-sm flex items-center gap-2"
            >
              <span>🚪</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-1 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-wood text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">🖼️</div>
                <div className="text-2xl font-bold text-graphite">{content.gallery.length}</div>
                <div className="text-sm text-gray-500">Obrázkov v galérii</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-graphite">od {content.pricing.weekend.price}€</div>
                <div className="text-sm text-gray-500">Cena za víkend</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">📧</div>
                <div className="text-lg font-bold text-graphite truncate">{content.email}</div>
                <div className="text-sm text-gray-500">Kontaktný email</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">📞</div>
                <div className="text-lg font-bold text-graphite">{content.phone}</div>
                <div className="text-sm text-gray-500">Telefón</div>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <span>💡</span> Tip: Inline editovanie
                </h3>
                <p className="text-amber-700">
                  Na hlavnej stránke kliknite na tlačidlo <strong>"✏️ Editovať"</strong> v admin paneli. 
                  Potom môžete kliknúť priamo na texty a upraviť ich na mieste!
                </p>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold text-graphite flex items-center gap-2">
                <span>📝</span> Úprava obsahu
              </h2>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hlavný nadpis (Hero)</label>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={e => updateContent('heroTitle', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Podnadpis</label>
                  <textarea
                    value={content.heroSubtitle}
                    onChange={e => updateContent('heroSubtitle', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                    rows={3}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefón</label>
                    <input
                      type="text"
                      value={content.phone}
                      onChange={e => updateContent('phone', e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={content.email}
                      onChange={e => updateContent('email', e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
                  <input
                    type="text"
                    value={content.address}
                    onChange={e => updateContent('address', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input
                      type="text"
                      value={content.checkIn}
                      onChange={e => updateContent('checkIn', e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                      placeholder="15:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input
                      type="text"
                      value={content.checkOut}
                      onChange={e => updateContent('checkOut', e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                      placeholder="10:00"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold text-graphite flex items-center gap-2">
                <span>🖼️</span> Správa galérie
              </h2>
              
              {/* Add image */}
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="URL obrázka (https://...)"
                  className="flex-1 min-w-[200px] px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-wood"
                />
                <button 
                  onClick={handleAddImageUrl} 
                  className="px-6 py-3 bg-wood hover:bg-wood-light text-white font-bold rounded-xl"
                >
                  ➕ Pridať URL
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl"
                >
                  📁 Nahrať
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {content.gallery.map((img, index) => (
                  <div key={index} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23ddd" width="100" height="100"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em">?</text></svg>';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <span className="text-white text-sm font-bold">#{index + 1}</span>
                      <div className="flex gap-1">
                        {index > 0 && (
                          <button
                            onClick={() => moveGalleryImage(index, index - 1)}
                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
                            title="Posunúť doľava"
                          >
                            ←
                          </button>
                        )}
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
                          title="Odstrániť"
                        >
                          🗑️
                        </button>
                        {index < content.gallery.length - 1 && (
                          <button
                            onClick={() => moveGalleryImage(index, index + 1)}
                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
                            title="Posunúť doprava"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {content.gallery.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>Žiadne obrázky v galérii</p>
                </div>
              )}
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold text-graphite flex items-center gap-2">
                <span>💰</span> Správa cenníka
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-6">
                {(['weekend', 'reset', 'week'] as const).map((type) => (
                  <div key={type} className="border rounded-xl p-4">
                    <h3 className="font-bold text-graphite mb-4 capitalize">
                      {type === 'weekend' ? '🌙 Víkend' : type === 'reset' ? '⭐ Reset' : '📅 Týždeň'}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Počet nocí</label>
                        <input
                          type="number"
                          value={content.pricing[type].nights}
                          onChange={e => updateNestedContent(`pricing.${type}.nights`, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wood"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Cena (€)</label>
                        <input
                          type="number"
                          value={content.pricing[type].price}
                          onChange={e => updateNestedContent(`pricing.${type}.price`, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wood"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-graphite mb-4 flex items-center gap-2">
                  <span>⚙️</span> Nastavenia
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium mb-2">🔐 Admin heslo</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Aktuálne heslo: <code className="bg-gray-200 px-2 py-1 rounded">chata2024</code>
                    </p>
                    <p className="text-xs text-gray-400">
                      Pre zmenu hesla upravte súbor lib/AdminContext.tsx
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium mb-3">💾 Záloha a obnova</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                      >
                        📥 Exportovať zálohu
                      </button>
                      <button
                        onClick={() => importInputRef.current?.click()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium"
                      >
                        📤 Importovať zálohu
                      </button>
                      <input
                        ref={importInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                      <button
                        onClick={resetToDefaults}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium"
                      >
                        🗑️ Reset na predvolené
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <h3 className="font-medium text-amber-800 mb-2">⚠️ Dôležité</h3>
                    <p className="text-sm text-amber-700">
                      Všetky zmeny sa ukladajú do localStorage prehliadača. 
                      Pre trvalé zmeny exportujte zálohu a nahrajte ju na server.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
