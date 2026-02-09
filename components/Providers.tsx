'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';
import { AdminProvider, useAdmin } from '@/lib/AdminContext';
import AdminSidebar from '@/components/AdminSidebar';

function AdminLayout({ children }: { children: ReactNode }) {
  const [marginLeft, setMarginLeft] = useState(0);

  const handleSidebarChange = useCallback((open: boolean, width: number) => {
    setMarginLeft(open ? width : 0);
  }, []);

  return (
    <>
      <div
        id="main-content"
        style={{
          marginLeft: marginLeft > 0 ? `${marginLeft}px` : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          width: marginLeft > 0 ? `calc(100% - ${marginLeft}px)` : '100%',
        }}
      >
        {children}
      </div>
      <AdminSidebar onStateChange={handleSidebarChange} />
    </>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}
