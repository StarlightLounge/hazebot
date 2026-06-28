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
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    prefix: '!',
    welcomeChannel: 'general-chat',
    autoMod: 'Relaxed (Block severe words)',
    logDeletedMessages: true
  });

  // Fetch Server Details and Settings
  useEffect(() => {
    if (status === "authenticated") {
      // Fetch Guild Name
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

      // Fetch Guild Settings from DB
      fetch(`/api/settings?guildId=${serverId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setSettings({
              prefix: data.prefix || '!',
              welcomeChannel: data.welcomeChannel || 'general-chat',
              autoMod: data.autoMod || 'Relaxed (Block severe words)',
              logDeletedMessages: data.logDeletedMessages ?? true
            });
          }
        })
        .catch(console.error);
    }
  }, [status, serverId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: serverId, ...settings })
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings", error);
    }
    setIsSaving(false);
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setSettings(prev => ({ ...prev, [target.name]: value }));
  };

  const handleMusicAction = async (action: string, url?: string) => {
    try {
      await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guildId: serverId, 
          userId: (session?.user as any)?.id || session?.user?.email,
          action, 
          url 
        })
      });
      if (action === 'PLAY') {
         setShowToast(true);
         setTimeout(() => setShowToast(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [brandingName, setBrandingName] = useState('');
  const [brandingAvatar, setBrandingAvatar] = useState('');

  const handleBrandingUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          guildId: serverId, 
          userId: (session?.user as any)?.id || session?.user?.email,
          action: 'UPDATE_BRANDING', 
          name: brandingName,
          avatar_url: brandingAvatar
        })
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  const [musicState, setMusicState] = useState<any>(null);

  useEffect(() => {
    if (activeTab !== 'music') return;
    const fetchMusicState = async () => {
      try {
        const res = await fetch(`/api/music?guildId=${serverId}`);
        const data = await res.json();
        if (data.musicState) setMusicState(data.musicState);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMusicState();
    const interval = setInterval(fetchMusicState, 3000);
    return () => clearInterval(interval);
  }, [activeTab, serverId]);

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
             <button onClick={() => setActiveTab('branding')} className={`btn ${activeTab === 'branding' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', border: activeTab === 'branding' ? '' : 'none', marginTop: '1rem', background: activeTab === 'branding' ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)', color: activeTab === 'branding' ? '#000' : 'white' }}><i className="fa-solid fa-robot"></i> Custom Bot</button>
             <button onClick={() => setActiveTab('music')} className={`btn ${activeTab === 'music' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'flex-start', border: activeTab === 'music' ? '' : 'none', background: activeTab === 'music' ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)', color: activeTab === 'music' ? '#000' : 'white' }}><i className="fa-solid fa-music"></i> Web Player</button>
          </div>
          
          {/* Content Area */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            
            {activeTab === 'general' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>General Settings</h2>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Bot Prefix</label>
                  <input type="text" name="prefix" value={settings.prefix} onChange={handleSettingChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Welcome Channel</label>
                  <select name="welcomeChannel" value={settings.welcomeChannel} onChange={handleSettingChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                    <option value="general-chat" style={{ color: 'black' }}># general-chat</option>
                    <option value="welcome" style={{ color: 'black' }}># welcome</option>
                  </select>
                </div>
                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary mt-4">{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Moderation Settings</h2>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Auto-Mod Filter</label>
                  <select name="autoMod" value={settings.autoMod} onChange={handleSettingChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}>
                    <option value="Strict (Block all profanity)" style={{ color: 'black' }}>Strict (Block all profanity)</option>
                    <option value="Relaxed (Block severe words)" style={{ color: 'black' }}>Relaxed (Block severe words)</option>
                    <option value="Off" style={{ color: 'black' }}>Off</option>
                  </select>
                </div>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <input type="checkbox" name="logDeletedMessages" checked={settings.logDeletedMessages} onChange={handleSettingChange} style={{ width: '20px', height: '20px' }} />
                   <label style={{ fontWeight: 'bold' }}>Log deleted messages</label>
                </div>
                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary mt-4">{isSaving ? 'Saving...' : 'Save Changes'}</button>
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

            {activeTab === 'branding' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Custom Bot Branding</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Change the bot's identity completely for this server. (Requires Premium)</p>
                <form onSubmit={handleBrandingUpdate}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Bot Nickname</label>
                    <input type="text" value={brandingName} onChange={(e) => setBrandingName(e.target.value)} placeholder="Enter a custom name..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Avatar Image URL</label>
                    <input type="text" value={brandingAvatar} onChange={(e) => setBrandingAvatar(e.target.value)} placeholder="https://example.com/image.png" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                  </div>
                  <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ background: 'var(--accent-green)', color: '#000' }}>{isSaving ? 'Updating...' : 'Update Branding'}</button>
                </form>
              </div>
            )}

            {activeTab === 'music' && (
              <div>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   Music Player
                   <span style={{ fontSize: '0.85rem', background: 'rgba(0, 255, 136, 0.2)', color: 'var(--accent-green)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>Connected to VC</span>
                </h2>
                
                {/* Now Playing */}
                <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', alignItems: 'center', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                   <div style={{ width: '100px', height: '100px', borderRadius: '8px', background: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop) center/cover', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}></div>
                   <div style={{ flex: 1 }}>
                     <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{musicState?.now_playing ? musicState.now_playing.title : 'Nothing Playing'}</h3>
                     <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{musicState?.now_playing ? 'Haze Bot' : 'Waiting for songs...'}</p>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>0:00</span>
                       <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: musicState?.is_playing ? '50%' : '0%', background: 'var(--accent-green)', borderRadius: '3px', boxShadow: '0 0 10px var(--accent-green)' }}></div>
                       </div>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>-:-</span>
                     </div>
                   </div>
                </div>

                {/* Player Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
                  <button onClick={() => handleMusicAction('SKIP')} className="btn btn-secondary" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-backward-step"></i></button>
                  <button onClick={() => handleMusicAction('PAUSE')} className="btn btn-primary" style={{ width: '65px', height: '65px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--accent-green)', color: 'black' }}><i className={`fa-solid ${musicState?.is_playing ? 'fa-pause' : 'fa-play'}`}></i></button>
                  <button onClick={() => handleMusicAction('SKIP')} className="btn btn-secondary" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-forward-step"></i></button>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
                    <button className="btn btn-secondary" style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--accent-green)' }}><i className="fa-solid fa-repeat"></i></button>
                    <button className="btn btn-secondary" style={{ background: 'transparent', border: 'none', padding: 0 }}><i className="fa-solid fa-shuffle"></i></button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                    <i className="fa-solid fa-volume-high" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}></i>
                    <input type="range" defaultValue="75" style={{ width: '80px', accentColor: 'var(--accent-green)', cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Queue UI */}
                <div style={{ marginTop: '3rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Queue</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input type="text" id="musicUrl" placeholder="Paste YouTube or Spotify link..." style={{ flex: '1', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                    <button onClick={() => {
                        const el = document.getElementById('musicUrl') as HTMLInputElement;
                        if(el && el.value) { handleMusicAction('PLAY', el.value); el.value = ''; }
                    }} className="btn btn-secondary"><i className="fa-solid fa-plus"></i> Add</button>
                  </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   {musicState?.queue?.map((item: any, i: number) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid transparent', transition: '0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                       <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', width: '20px', textAlign: 'center' }}>{i + 1}</span>
                       <strong style={{ fontSize: '1.05rem' }}>{item.title}</strong>
                     </div>
                   </div>
                   ))}
                   {(!musicState?.queue || musicState.queue.length === 0) && (
                     <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Queue is empty.</p>
                   )}
                </div>
                </div>
              </div>
            )}
             
          </div>
        </div>
      </div>

      {showToast && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'var(--accent-green)', color: 'var(--bg-main)', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideIn 0.3s ease-out' }}>
          <i className="fa-solid fa-check-circle"></i> Success!
        </div>
      )}

    </div>
  );
}
