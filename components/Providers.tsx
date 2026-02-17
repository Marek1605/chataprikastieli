'use client';
import { ReactNode } from 'react';
import { AdminProvider } from '@/lib/AdminContext';
import AdminSidebar from '@/components/AdminSidebar';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <div className="pt-[60px]">{children}</div>
      <AdminSidebar />
    </AdminProvider>
  );
}
