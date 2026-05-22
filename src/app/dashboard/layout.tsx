"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "@/components/dashboard/Sidebar";
import { ChevronRight } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('synapse_user');
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    }
  }, [router, pathname]);

  if (checkingAuth || !isAuthenticated) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#060810',
          color: '#f0f4ff',
          fontFamily: 'var(--font-sora, sans-serif)',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(59, 130, 246, 0.1)',
            borderTopColor: '#3b82f6',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span style={{ fontSize: '0.85rem', color: '#64748b', letterSpacing: '0.1em', fontWeight: 600 }}>
          SYNAPSE OS SECURE CHANNEL INITIALIZING...
        </span>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('synapse_sidebar_collapsed');
    if (stored === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('synapse_sidebar_collapsed', String(newState));
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      {isSidebarCollapsed && (
        <button 
          onClick={toggleSidebar} 
          className="floating-sidebar-toggle"
          title="Expand Sidebar"
          aria-label="Expand Sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

