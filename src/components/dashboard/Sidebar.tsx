"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  Server, 
  Network,
  LogOut,
  Settings,
  Play
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({ name: 'GTM Admin', role: 'GTM Engineer' });

  useEffect(() => {
    const stored = localStorage.getItem('synapse_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({
          name: parsed.name || 'GTM Admin',
          role: parsed.role || 'GTM Engineer'
        });
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('synapse_user');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Executive Home', icon: LayoutDashboard, path: '/dashboard', id: 'home' },
    { name: 'Control Center', icon: Settings, path: '/dashboard/control-center', id: 'control-center' },
    { name: 'Organization Map', icon: Network, path: '/dashboard/org-map', id: 'org-map' },
    { name: 'GTM Flow Simulator', icon: Play, path: '/dashboard/simulation', id: 'simulation' },
    { name: 'Agentic Infrastructure', icon: Database, path: '/dashboard/infrastructure', id: 'infrastructure' },
    { name: 'Live Observability', icon: Server, path: '/dashboard/monitoring', id: 'monitoring' },
  ];

  const avatarLetters = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'GT';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-placeholder">S</div>
          <div className="logo-info">
            <span className="logo-text">SYNAPSE</span>
            <div className="logo-subtitle">GTM Motion Dashboard</div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.id} 
              href={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{avatarLetters}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          id="btn-logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
