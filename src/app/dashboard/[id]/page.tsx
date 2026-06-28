"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ServerSettings() {
  const { data: session, status } = useSession();
  const params = useParams();
  const serverId = params.id as string;
  const [serverName, setServerName] = useState<string>("Loading...");
  const [activeTab, setActiveTab] = useState('general');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/guilds')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const server = data.find(s => s.id === serverId);
            if (server) setServerName(server.name);
            else setServerName("Unknown Server");
          }
        })
        .catch(() => setServerName("Error loading server"));
    }
  }, [status, serverId]);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (status === "loading") return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (status === "unauthenticated") redirect('/');

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <nav className="navbar scrolled">
        <div className="nav-container">
          <div className="logo">
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
              <i className="fa-solid fa-arrow-left"></i>
              <span className="logo-text">Dashboard</span>
            </Link>
          </div>
          <div className="nav-cta">
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>{session?.user?.name || "HazeBot User"}</span>
                <img src={session?.user?.image || "/assets/logo.png"} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container" style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{serverName}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Server ID: {serverId}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="settings-layout">
          <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 768px) {
              .settings-layout {
                grid-template-columns: 1fr 3fr !important;
              }
            }
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}} />
          
          {/* Sidebar */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
             <button onClick={() => setActiveTab('general')} className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', border: activeTab === 'general' ? '' : 'none' }}><i className="fa-solid fa-gear"></i> General</button>
             <button onClick={() => setActiveTab('moderation')} className={`btn ${activeTab === 'moderation' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', border: activeTab === 'moderation' ? '' : 'none' }}><i className="fa-solid fa-shield-halved"></i> Moderation</button>
             <button onClick={() => setActiveTab('timers')} className={`btn ${activeTab === 'timers' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', border: activeTab === 'timers' ? '' : 'none' }}><i className="fa-solid fa-stopwatch"></i> Timers</button>
             <button onClick={() => setActiveTab('commands')} className={`btn ${activeTab === 'commands' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', border: activeTab === 'commands' ? '' : 'none' }}><i className="fa-solid fa-code"></i> Commands</button>
          </div>
          
          {/* Content Area */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            
            {activeTab === 'general' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>General Settings</h2>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Bot Prefix</label>
                  <input type="text" defaultValue="!" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Welcome Channel</label>
                  <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                    <option style={{ color: 'black' }}># general-chat</option>
                    <option style={{ color: 'black' }}># welcome</option>
                  </select>
                </div>
                <button onClick={handleSave} className="btn btn-primary mt-4">Save Changes</button>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Moderation Settings</h2>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Auto-Mod Filter</label>
                  <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                    <option style={{ color: 'black' }}>Strict (Block all profanity)</option>
                    <option style={{ color: 'black' }}>Relaxed (Block severe words)</option>
                    <option style={{ color: 'black' }}>Off</option>
                  </select>
                </div>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                   <label style={{ fontWeight: 'bold' }}>Log deleted messages</label>
                </div>
                <button onClick={handleSave} className="btn btn-primary mt-4">Save Changes</button>
              </div>
            )}

            {activeTab === 'timers' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Active Timers</h2>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Daily 420 Reminder</strong>
                     <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pings @everyone at 4:20 PM</span>
                   </div>
                   <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', background: 'rgba(255,0,0,0.2)', color: '#ff6b6b' }}>Delete</button>
                </div>
                <button className="btn btn-secondary mt-4" style={{ border: '1px dashed rgba(255,255,255,0.2)' }}><i className="fa-solid fa-plus"></i> Create New Timer</button>
              </div>
            )}

            {activeTab === 'commands' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Custom Commands</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create unique text responses for your server.</p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <input type="text" placeholder="Command name (e.g. !socials)" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  <input type="text" placeholder="Bot response" style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  <button onClick={handleSave} className="btn btn-primary">Add</button>
                </div>
              </div>
            )}
             
          </div>
        </div>
      </div>

      {showToast && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'var(--accent-green)', color: 'var(--bg-main)', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.3s ease-out' }}>
          <i className="fa-solid fa-check-circle"></i> Settings Saved Successfully!
        </div>
      )}

    </div>
  );
}
