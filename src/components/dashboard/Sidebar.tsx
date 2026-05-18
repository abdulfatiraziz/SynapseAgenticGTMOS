"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Mail, 
  UserPlus, 
  Target, 
  BarChart3, 
  Database, 
  Users, 
  Wallet, 
  Server, 
  Lightbulb,
  Network,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Executive Home', icon: LayoutDashboard, path: '/dashboard', id: 'home' },
    { name: 'Organization Map', icon: Network, path: '/dashboard/org-map', id: 'org-map' },
    { name: 'Outbound Automation', icon: Mail, path: '/dashboard/outbound', id: 'outbound' },
    { name: 'Inbound Automation', icon: UserPlus, path: '/dashboard/inbound', id: 'inbound' },
    { name: 'LinkedIn Ads (ABM)', icon: Target, path: '/dashboard/ads', id: 'linkedin-ads' },
    { name: 'RevOps Automation', icon: BarChart3, path: '/dashboard/revops', id: 'revops' },
    { name: 'CRM Enrichment', icon: Database, path: '/dashboard/enrichment', id: 'enrichment' },
    { name: 'Client Performance', icon: Users, path: '/dashboard/clients', id: 'client-performance' },
    { name: 'Financials', icon: Wallet, path: '/dashboard/financials', id: 'financials' },
    { name: 'System Health', icon: Server, path: '/dashboard/health', id: 'system-health' },
    { name: 'Strategic & BI', icon: Lightbulb, path: '/dashboard/bi', id: 'strategic-bi' },
  ];

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
          <div className="avatar">GT</div>
          <div className="user-info">
            <span className="user-name">GTM Admin</span>
            <span className="user-role">GTM Engineer</span>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
