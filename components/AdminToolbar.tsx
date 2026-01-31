'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import Link from 'next/link';

export default function AdminToolbar() {
  const { isAdmin, isEditing, login, logout, toggleEditing, saveAll } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  // Login button (skrytý v rohu)
  if (!isAdmin) {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-black/5 hover:bg-black/15 rounded-full flex items-center justify-center opacity-20 hover:opacity-100 transition-all z-50 text-xl"
          title="Admin"
        >
          ⚙️
        </button>

        {showLogin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🔐</div>
                <h2 className="text-xl font-bold text-graphite">Admin prihlásenie</h2>
              </div>
              
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Heslo"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-wood transition-colors"
                  autoFocus
                />
                
                {error && (
                  <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                    <span>⚠️</span> {error}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-wood hover:bg-wood-light text-white font-bold rounded-xl transition-colors"
                  >
                    Prihlásiť
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setShowLogin(false); setPassword(''); setError(''); }}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-graphite font-bold rounded-xl transition-colors"
                  >
                    Zrušiť
                  </button>
                </div>
              </form>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                💡 Heslo: chata2024
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Admin toolbar
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200]">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center gap-1 p-1.5 border border-white/10">
        {/* Admin badge */}
        <div className="px-3 py-2 flex items-center gap-2">
          <span className="text-lg">🔐</span>
          <span className="text-sm font-medium text-amber-400 hidden sm:inline">Admin</span>
        </div>
        
        <div className="w-px h-8 bg-white/20" />
        
        {/* Toggle inline editing */}
        <button
          onClick={toggleEditing}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            isEditing 
              ? 'bg-yellow-500 text-black' 
              : 'hover:bg-white/10'
          }`}
          title={isEditing ? 'Vypnúť editovanie' : 'Zapnúť editovanie'}
        >
          <span>✏️</span>
          <span className="hidden sm:inline">{isEditing ? 'Editovanie ON' : 'Editovať'}</span>
        </button>
        
        {/* Save button */}
        <button
          onClick={saveAll}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-500 transition-colors flex items-center gap-2"
          title="Uložiť všetky zmeny"
        >
          <span>💾</span>
          <span className="hidden sm:inline">Uložiť</span>
        </button>
        
        {/* Admin panel link */}
        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
          title="Otvoriť admin panel"
        >
          <span>📊</span>
          <span className="hidden sm:inline">Panel</span>
        </Link>
        
        <div className="w-px h-8 bg-white/20" />
        
        {/* Logout */}
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
          title="Odhlásiť"
        >
          <span>🚪</span>
        </button>
      </div>
      
      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap animate-pulse">
          ✏️ Klikni na text pre úpravu
        </div>
      )}
    </div>
  );
}
