'use client';
import { useState, useEffect } from 'react';

const PASS = 'ChataAdmin2025!';

export default function AdminSidebar() {
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('chata_admin') === 'true') setIsAdmin(true);
  }, []);

  const login = () => {
    if (pw === PASS) {
      sessionStorage.setItem('chata_admin', 'true');
      setIsAdmin(true);
      setShow(false);
      window.location.reload();
    } else {
      alert('Zlé heslo!');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('chata_admin');
    setIsAdmin(false);
    window.location.reload();
  };

  if (isAdmin) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[400] bg-green-600 text-white p-3 flex justify-between items-center">
        <span className="font-bold">🔧 ADMIN AKTÍVNY - prejdi na Galériu</span>
        <button onClick={logout} className="px-4 py-1 bg-white text-green-600 rounded font-bold">Odhlásiť</button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setShow(true)} className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 rounded-xl text-2xl z-50 shadow-xl">⚙️</button>
      {show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[500]" onClick={() => setShow(false)}>
          <div className="bg-white p-6 rounded-xl w-80" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">🔐 Admin</h2>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Heslo" className="w-full p-3 border rounded mb-3" />
            <button onClick={login} className="w-full p-3 bg-green-500 text-white rounded font-bold">Prihlásiť</button>
          </div>
        </div>
      )}
    </>
  );
}
