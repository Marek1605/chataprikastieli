'use client';

import { ReactNode } from 'react';
import { AdminProvider } from '@/lib/AdminContext';
import AdminToolbar from '@/components/AdminToolbar';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      {children}
      <AdminToolbar />
    </AdminProvider>
  );
}
