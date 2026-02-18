'use client';
import { ReactNode } from 'react';
import { AdminProvider, useAdmin } from '@/lib/AdminContext';
import AdminSidebar from '@/components/AdminSidebar';

function Inner({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdmin();
  return <div className={isAdmin ? "pt-[52px]" : ""}>{children}</div>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <Inner>{children}</Inner>
      <AdminSidebar />
    </AdminProvider>
  );
}
