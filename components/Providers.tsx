'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdminSidebar />
    </>
  );
}
