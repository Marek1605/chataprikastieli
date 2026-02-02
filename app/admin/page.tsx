'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Admin sa ovláda cez sidebar na hlavnej stránke
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">⚙️</div>
        <p className="text-gray-500">Presmerovávam na stránku...</p>
        <p className="text-xs text-gray-400 mt-2">Admin panel sa otvára na ľavej strane webu</p>
      </div>
    </div>
  );
}
