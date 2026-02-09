'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AdminProvider, useAdmin } from '@/lib/AdminContext';
import AdminSidebar from '@/components/AdminSidebar';

function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  // Listen for sidebar state changes via custom events
  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarOpen(e.detail.open);
      setSidebarWidth(e.detail.width || 0);
    };

    window.addEventListener('admin-sidebar-change' as any, handleSidebarChange);
    return () => window.removeEventListener('admin-sidebar-change' as any, handleSidebarChange);
  }, []);

  return (
    <>
      <div
        style={{
          marginLeft: sidebarOpen ? sidebarWidth + 'px' : '0px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
      <AdminSidebar onStateChange={(open, width) => {
        setSidebarOpen(open);
        setSidebarWidth(width);
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('admin-sidebar-change', { detail: { open, width } }));
      }} />
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
