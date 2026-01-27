'use client';

import { useState, useRef } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAdmin, logout, content, updateContent, gallery, addImage, removeImage, saveAll } = useAdmin();
  const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'settings'>('content');
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Prístup zamietnutý</h1>
          <p className="text-gray-500 mb-6">Najprv sa musíte prihlásiť ako admin.</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">
            Späť na web
          </button>
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
        addImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      addImage(newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const contentFields = [
    { key: 'hero.title', label: 'Hlavný nadpis', multiline: false },
    { key: 'hero.subtitle', label: 'Podnadpis', multiline: true },
    { key: 'contact.phone', label: 'Telefón', multiline: false },
    { key: 'contact.email', label: 'Email', multiline: false },
    { key: 'pricing.weekend', label: 'Cena víkend (€)', multiline: false },
    { key: 'pricing.reset', label: 'Cena reset (€)', multiline: false },
    { key: 'pricing.week', label: 'Cena týždeň (€)', multiline: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏔️</span>
            <div>
              <h1 className="font-bold">Chata Admin</h1>
              <p className="text-xs text-gray-400">Správa webu</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={saveAll} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium text-sm">
              💾 Uložiť všetko
            </button>
            <a href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-sm">
              👁️ Zobraziť web
            </a>
            <button onClick={logout} className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg font-medium text-sm">
              🚪 Odhlásiť
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'content', label: '📝 Obsah', icon: '📝' },
              { id: 'gallery', label: '🖼️ Galéria', icon: '🖼️' },
              { id: 'settings', label: '⚙️ Nastavenia', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-amber-500 text-amber-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab: Content */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">✏️ Úprava textov</h2>
              <p className="text-sm text-gray-500 mb-6">
                Upravte texty na webe. Zmeny sa prejavia po uložení.
              </p>
              
              <div className="space-y-4">
                {contentFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={content[field.key] || ''}
                        onChange={e => updateContent(field.key, e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={content[field.key] || ''}
                        onChange={e => updateContent(field.key, e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-bold text-amber-800 mb-2">💡 Tip: Inline editovanie</h3>
              <p className="text-sm text-amber-700">
                Na hlavnej stránke kliknite na tlačidlo "✏️ Upraviť" v admin paneli dole. 
                Potom môžete kliknúť priamo na texty a upraviť ich na mieste!
              </p>
            </div>
          </div>
        )}

        {/* Tab: Gallery */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">🖼️ Správa galérie</h2>
              
              {/* Add image */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="URL obrázka (https://...)"
                  className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button onClick={handleAddImageUrl} className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">
                  ➕ Pridať URL
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700">
                  📁 Nahrať súbor
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
                {gallery.map((src, index) => (
                  <div key={index} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white text-sm font-bold">#{index + 1}</span>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {gallery.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>Žiadne obrázky v galérii</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">⚙️ Nastavenia</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium mb-2">🔐 Admin heslo</h3>
                  <p className="text-sm text-gray-500 mb-2">Aktuálne heslo: <code className="bg-gray-200 px-2 py-1 rounded">chata2024</code></p>
                  <p className="text-xs text-gray-400">Pre zmenu hesla upravte súbor lib/AdminContext.tsx</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium mb-2">💾 Záloha dát</h3>
                  <p className="text-sm text-gray-500 mb-3">Všetky zmeny sa ukladajú do localStorage prehliadača.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const data = { content, gallery };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'chata-backup.json';
                        a.click();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm"
                    >
                      📥 Exportovať zálohu
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Vymazať všetky lokálne zmeny?')) {
                          localStorage.removeItem('chata_content');
                          localStorage.removeItem('chata_gallery');
                          window.location.reload();
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 text-sm"
                    >
                      🗑️ Reset na predvolené
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
