"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [servers, setServers] = useState<any[]>([]);
  const [loadingServers, setLoadingServers] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/guilds')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setServers(data);
          }
          setLoadingServers(false);
        })
        .catch(() => setLoadingServers(false));
    }
  }, [status]);

  if (status === "loading") {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect('/');
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <nav className="navbar scrolled">
        <div className="nav-container">
          <div className="logo">
            <img src="/assets/logo.png" alt="HazeBot Logo" className="logo-img" />
            <span className="logo-text">HazeBot Dashboard</span>
          </div>
          <div className="nav-cta">
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>{session?.user?.name || "HazeBot User"}</span>
                <img src={session?.user?.image || "/assets/logo.png"} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container" style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Select a Server</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Choose a server to configure HazeBot settings and modules.</p>
        
        {loadingServers ? (
           <div>Loading your servers from Discord...</div>
        ) : servers.length === 0 ? (
           <div>No servers found where you have administrative permissions.</div>
        ) : (
          <div className="server-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {servers.map((server) => (
              <Link key={server.id} href={`/dashboard/${server.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', transition: 'var(--transition)', height: '100%' }} 
                     onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'; e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.2)' }}
                     onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)' }}>
                  
                  {server.icon ? (
                     <img src={server.icon} alt={server.name} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                  ) : (
                     <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {server.name.charAt(0)}
                     </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{server.name}</h3>
                    {server.hasBot ? (
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <i className="fa-solid fa-check-circle"></i> Configured
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <i className="fa-solid fa-plus-circle"></i> Setup Required
                        </span>
                    )}
                  </div>
                  
                  <div style={{ color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
