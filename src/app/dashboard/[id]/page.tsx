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
          `}} />
          
          {/* Sidebar */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
             <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}><i className="fa-solid fa-gear"></i> General</button>
             <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}><i className="fa-solid fa-shield-halved"></i> Moderation</button>
             <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}><i className="fa-solid fa-stopwatch"></i> Timers</button>
             <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}><i className="fa-solid fa-code"></i> Commands</button>
          </div>
          
          {/* Content */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
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

             <button className="btn btn-primary mt-4">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
