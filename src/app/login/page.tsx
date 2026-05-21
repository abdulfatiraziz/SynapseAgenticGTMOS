"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Key, Mail, User, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import s from './login.module.css';

interface UserRecord {
  name: string;
  email: string;
  role: string;
  password?: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('GTM Engineer');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default credentials
  const defaultAdmin = {
    name: 'GTM Admin',
    email: 'admin@synapse.ai',
    role: 'GTM Engineer',
    password: 'admin123'
  };

  useEffect(() => {
    // If user is already logged in, redirect directly to dashboard
    const currentUser = localStorage.getItem('synapse_user');
    if (currentUser) {
      router.push(redirectUrl);
    }

    // Initialize the client mock database with the default admin if empty
    const db = localStorage.getItem('synapse_users_db');
    if (!db) {
      localStorage.setItem('synapse_users_db', JSON.stringify([defaultAdmin]));
    }
  }, [router, redirectUrl]);

  const handleTabChange = (tab: 'signin' | 'register') => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  const handleQuickFill = () => {
    setEmail(defaultAdmin.email);
    setPassword(defaultAdmin.password);
    setName('');
    setActiveTab('signin');
    setError('');
  };

  const handleGuestSignIn = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate micro-animation delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    localStorage.setItem(
      'synapse_user',
      JSON.stringify({
        name: 'Guest Operator',
        email: 'guest@synapse.ai',
        role: 'GTM Evaluator',
      })
    );

    setSuccess('Welcome, Guest! Initializing GTM Control Room...');
    setTimeout(() => {
      router.push(redirectUrl);
      router.refresh();
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate micro-animation delay for premium authentic look
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (activeTab === 'signin') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      // Check client database
      const dbStr = localStorage.getItem('synapse_users_db');
      const users: UserRecord[] = dbStr ? JSON.parse(dbStr) : [defaultAdmin];

      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        // Save active session
        localStorage.setItem(
          'synapse_user',
          JSON.stringify({
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
          })
        );

        setSuccess('Authentication successful! Initializing GTM Control Room...');
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 500);
      } else {
        setError('Invalid email or password. Use quick-fill for admin demo.');
        setIsLoading(false);
      }
    } else {
      // Register
      if (!name || !email || !password) {
        setError('All registration fields are required.');
        setIsLoading(false);
        return;
      }

      const dbStr = localStorage.getItem('synapse_users_db');
      const users: UserRecord[] = dbStr ? JSON.parse(dbStr) : [defaultAdmin];

      const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        setError('An account with this email address already exists.');
        setIsLoading(false);
        return;
      }

      const newUser: UserRecord = {
        name,
        email: email.toLowerCase(),
        role,
        password,
      };

      // Save to mock database
      users.push(newUser);
      localStorage.setItem('synapse_users_db', JSON.stringify(users));

      // Auto login after successful signup
      localStorage.setItem(
        'synapse_user',
        JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        })
      );

      setSuccess('Account created successfully! Deploying workspace...');
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 500);
    }
  };

  return (
    <div className={s.loginPage}>
      <div className={s.noise} />
      <div className={s.glow} />

      <div className={s.container}>
        <div className={s.header}>
          <div className={s.logo}>SYNAPSE</div>
          <h2 className={s.title}>
            {activeTab === 'signin' ? 'Access GTM Control Center' : 'Register Operator'}
          </h2>
          <p className={s.subtitle}>
            {activeTab === 'signin' 
              ? 'Authorized GTM engineers and revenue operations only.' 
              : 'Setup a new local administrator account.'}
          </p>
        </div>

        <div className={s.tabs}>
          <button 
            type="button"
            className={`${s.tab} ${activeTab === 'signin' ? s.tabActive : ''}`}
            onClick={() => handleTabChange('signin')}
            id="tab-signin"
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`${s.tab} ${activeTab === 'register' ? s.tabActive : ''}`}
            onClick={() => handleTabChange('register')}
            id="tab-register"
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className={`${s.alert} ${s.alertError}`} id="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={`${s.alert} ${s.alertSuccess}`} id="login-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={s.form} id="auth-form">
          {activeTab === 'register' && (
            <div className={s.inputGroup}>
              <label htmlFor="fullname" className={s.label}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  id="fullname"
                  className={s.input} 
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>
          )}

          <div className={s.inputGroup}>
            <label htmlFor="email" className={s.label}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                id="email"
                className={s.input} 
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="operator@synapse.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            </div>
          </div>

          <div className={s.inputGroup}>
            <label htmlFor="password" className={s.label}>Security Key / Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                id="password"
                className={s.input} 
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            </div>
          </div>

          {activeTab === 'register' && (
            <div className={s.inputGroup}>
              <label htmlFor="operator-role" className={s.label}>Department Role</label>
              <div style={{ position: 'relative' }}>
                <select 
                  id="operator-role"
                  className={`${s.input} ${s.select}`} 
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="GTM Engineer">GTM Engineer (System Admin)</option>
                  <option value="RevOps Lead">RevOps Specialist</option>
                  <option value="VP Sales">Sales Operations Manager</option>
                  <option value="Growth Marketer">Growth Marketing Lead</option>
                </select>
                <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className={s.button}
            disabled={isLoading}
            id="auth-submit"
          >
            {isLoading ? 'Authenticating...' : (
              <>
                <span>{activeTab === 'signin' ? 'Verify Credentials' : 'Provision Workspace'}</span>
                <ChevronRight size={18} style={{ marginLeft: '4px' }} />
              </>
            )}
          </button>
        </form>

        <div className={s.quickFill}>
          <div className={s.quickFillLabel}>Testing or pitching the product?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <button 
              type="button" 
              className={s.quickFillBtn}
              onClick={handleQuickFill}
              disabled={isLoading}
              id="btn-quickfill"
            >
              <Shield size={14} />
              <span>Use Default Admin Credentials</span>
            </button>
            <button 
              type="button" 
              className={s.quickFillBtn}
              style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.25)', color: '#3b82f6' }}
              onClick={handleGuestSignIn}
              disabled={isLoading}
              id="btn-guest"
            >
              <span>Explore as Guest Operator →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', background: '#060810', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(59, 130, 246, 0.1)', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
