'use client';

import { AdminProvider } from '@/lib/AdminContext';
import '../globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
