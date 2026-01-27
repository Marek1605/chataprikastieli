'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';

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
    } else {
      setError('Nesprávne heslo');
    }
  };

  if (!isAdmin) {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-all z-50"
          title="Admin"
        >
          ⚙️
        </button>

        {showLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
              <h2 className="text-xl font-bold mb-4">🔐 Admin</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Heslo"
                  className="w-full px-4 py-3 border rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600">
                    Prihlásiť
                  </button>
                  <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                    Zrušiť
                  </button>
                </div>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">Hint: chata2024</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-full shadow-2xl z-[100] flex items-center gap-1 p-1.5">
      <span className="px-3 text-sm text-amber-400 font-medium">🔐 Admin</span>
      <div className="w-px h-6 bg-white/20" />
      
      <button
        onClick={toggleEditing}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isEditing ? 'bg-yellow-500 text-black' : 'hover:bg-white/10'}`}
      >
        {isEditing ? '✏️ Editovanie' : '✏️ Upraviť'}
      </button>
      
      <button onClick={saveAll} className="px-4 py-2 rounded-full text-sm font-medium bg-green-600 hover:bg-green-500">
        💾 Uložiť
      </button>
      
      <a href="/admin" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10">
        📊 Panel
      </a>
      
      <div className="w-px h-6 bg-white/20" />
      
      <button onClick={logout} className="px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600">
        🚪
      </button>
    </div>
  );
}
