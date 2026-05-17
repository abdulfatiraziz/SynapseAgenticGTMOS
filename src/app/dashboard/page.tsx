"use client";

import React from 'react';
import { TrendingUp, Users, Cpu, Activity } from 'lucide-react';

export default function DashboardHome() {
  const metrics = [
    { label: 'Deals Won (Q2)', value: '42', subValue: '$1.2M', trend: '+12.5%', icon: TrendingUp },
    { label: 'Revenue (YTD)', value: '$4.85M', subValue: 'Target: $6M', trend: '+8.2%', icon: Users },
    { label: 'Agents Running', value: '1,248', subValue: 'Online', trend: 'Optimum', icon: Cpu },
    { label: 'System Uptime', value: '99.98%', subValue: 'Healthy', trend: 'Stable', icon: Activity },
  ];

  return (
    <div>
      <div className="header-row">
        <h1>Executive Dashboard</h1>
        <div className="date-display">May 15, 2026</div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <metric.icon size={20} color="var(--accent-color)" />
              <span style={{ color: 'var(--success-color)', fontSize: '0.75rem', fontWeight: 600 }}>{metric.trend}</span>
            </div>
            <span className="metric-label">{metric.label}</span>
            <div className="metric-value">
              {metric.value} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{metric.subValue}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '32px' }}>
        <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '20px', fontFamily: 'var(--font-sora)', fontSize: '1.2rem' }}>High-Intent Signals (Mock Data)</h2>
          <div className="signals-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { company: 'CyberDyne Systems', signal: 'Job Post: "VP Revenue Ops"', source: 'LinkedIn', intensity: 'High' },
              { company: 'Starlight Retail', signal: 'Series B Funding ($42M)', source: 'Crunchbase', intensity: 'Medium' },
              { company: 'Global Logistics Corp', signal: 'Webinar Attendee: "AI in GTM"', source: 'Website', intensity: 'High' },
            ].map((sig, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sig.company}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sig.signal}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: sig.intensity === 'High' ? 'var(--error-color)' : 'var(--warning-color)' }}>{sig.intensity} Intent</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>via {sig.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '20px', fontFamily: 'var(--font-sora)', fontSize: '1.2rem' }}>Agent Load</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div className="load-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Outbound Processing</span>
                  <span>84%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <div style={{ width: '84%', height: '100%', background: 'var(--accent-color)', borderRadius: '3px' }}></div>
                </div>
             </div>
             <div className="load-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Data Enrichment</span>
                  <span>42%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <div style={{ width: '42%', height: '100%', background: 'var(--success-color)', borderRadius: '3px' }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
