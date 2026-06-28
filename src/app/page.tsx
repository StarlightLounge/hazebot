"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(20px)';
      (card as HTMLElement).style.transition = `all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.1}s`;
      observer.observe(card);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="/assets/logo.png" alt="HazeBot Logo" className="logo-img" />
            <span className="logo-text">HazeBot</span>
          </div>
          <ul className="nav-links">
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#commands">Commands</Link></li>
            <li><Link href="#premium">Premium</Link></li>
          </ul>
          <div className="nav-cta">
            {session ? (
              <Link href="/dashboard" className="btn btn-primary">
                Dashboard <i className="fa-solid fa-arrow-right"></i>
              </Link>
            ) : (
              <button onClick={() => signIn('discord', { callbackUrl: '/dashboard' })} className="btn btn-primary">
                Login with Discord <i className="fa-brands fa-discord"></i>
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse"></span> V2.0 IS LIVE
          </div>
          <h1 className="hero-title">Elevate Your Community with <span className="highlight">HazeBot</span></h1>
          <p className="hero-subtitle">The ultimate companion for moderation, automated alerts, and custom interactions. Build a professional, engaged, and thriving community.</p>
          <div className="hero-buttons">
            {session ? (
              <Link href="/dashboard" className="btn btn-primary btn-large">Go to Dashboard</Link>
            ) : (
              <button onClick={() => signIn('discord', { callbackUrl: '/dashboard' })} className="btn btn-primary btn-large">Add to Discord</button>
            )}
            <Link href="#features" className="btn btn-secondary btn-large">Explore Features</Link>
          </div>
          
          <div className="stats-container">
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Servers</p>
            </div>
            <div className="stat-item">
              <h3>5M+</h3>
              <p>Users</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="glass-card mockup-card">
            <div className="mockup-header">
              <div className="dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-title"># general-chat</div>
            </div>
            <div className="mockup-body">
              <div className="chat-message">
                <img src="/assets/logo.png" alt="Bot Avatar" className="chat-avatar" />
                <div className="message-content">
                  <span className="username">HazeBot <span className="bot-tag">APP</span></span>
                  <span className="timestamp">Today at 4:20 PM</span>
                  <div className="message-bubble">
                    <strong>Alert:</strong> It's that time! The daily chill session has begun. Use <code>/join</code> to hop in voice! 🌿
                  </div>
                </div>
              </div>
              <div className="chat-message user-msg">
                <div className="default-avatar"><i className="fa-solid fa-user"></i></div>
                <div className="message-content">
                  <span className="username">Streamer</span>
                  <span className="timestamp">Today at 4:21 PM</span>
                  <div className="message-bubble">
                    /play lofi-beats
                  </div>
                </div>
              </div>
              <div className="chat-message">
                <img src="/assets/logo.png" alt="Bot Avatar" className="chat-avatar" />
                <div className="message-content">
                  <span className="username">HazeBot <span className="bot-tag">APP</span></span>
                  <span className="timestamp">Today at 4:21 PM</span>
                  <div className="message-bubble success">
                    🎵 Now playing: <strong>Chill Lofi Beats to Relax To</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="floating-icon icon-1"><i className="fa-solid fa-shield-halved"></i></div>
          <div className="floating-icon icon-2"><i className="fa-solid fa-clock"></i></div>
          <div className="floating-icon icon-3"><i className="fa-solid fa-music"></i></div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-desc">Everything you need to manage your community, packed into one sleek interface.</p>
        </div>
        <div className="features-grid">
          
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h3>Smart Moderation</h3>
            <p>Automate your server's security with advanced filters, auto-kicks, and detailed mod logs.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-stopwatch"></i></div>
            <h3>Custom Timers</h3>
            <p>Set up scheduled alerts, reminders, and thematic 420 events to keep your community engaged.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-code"></i></div>
            <h3>Custom Commands</h3>
            <p>Create powerful, dynamic text commands and auto-responders unique to your server's culture.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-ranking-star"></i></div>
            <h3>Leveling System</h3>
            <p>Reward active members with XP, custom rank cards, and automatic role assignments.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-music"></i></div>
            <h3>High-Quality Audio</h3>
            <p>Stream crystal clear music directly into your voice channels with full playback controls.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-chart-pie"></i></div>
            <h3>Server Analytics</h3>
            <p>Track your server's growth, message activity, and engagement with beautiful dashboards.</p>
          </div>
          
        </div>
        </div>
      </section>

      <section className="features" id="commands" style={{ background: 'var(--bg-secondary)', padding: '5rem 0' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Essential Commands</h2>
          <p className="section-desc">Just a taste of what HazeBot can do out of the box.</p>
        </div>
        <div className="features-grid" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '0 2rem' }}>
           <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-green)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}><code>/setup</code></h3>
              <p style={{ color: 'var(--text-muted)' }}>Initializes HazeBot and creates essential roles and channels.</p>
           </div>
           <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-purple)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}><code>/ban @user [reason]</code></h3>
              <p style={{ color: 'var(--text-muted)' }}>Ban a user securely and log the action in the mod-logs channel.</p>
           </div>
           <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-green)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}><code>/play [song name]</code></h3>
              <p style={{ color: 'var(--text-muted)' }}>Searches and plays high-quality audio directly in your voice channel.</p>
           </div>
           <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-purple)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}><code>/timer create [duration]</code></h3>
              <p style={{ color: 'var(--text-muted)' }}>Start a custom countdown timer with an automated ping upon completion.</p>
           </div>
        </div>
      </section>

      <section className="features" id="premium" style={{ padding: '5rem 0' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">HazeBot Premium</h2>
          <p className="section-desc">Take your server to the next level with exclusive perks.</p>
        </div>
        <div className="features-grid" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '0 2rem' }}>
          <div className="feature-card" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'linear-gradient(135deg, rgba(20,18,28,0.8) 0%, rgba(30,26,45,0.8) 100%)' }}>
            <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}><i className="fa-solid fa-palette"></i></div>
            <h3>Custom Branding</h3>
            <p>Change the bot's avatar and name in your server for a fully white-labeled experience.</p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'linear-gradient(135deg, rgba(20,18,28,0.8) 0%, rgba(30,26,45,0.8) 100%)' }}>
            <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}><i className="fa-solid fa-bolt"></i></div>
            <h3>Priority Audio Queue</h3>
            <p>Skip the public bot congestion. Premium servers get dedicated high-priority audio nodes.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
           <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Upgrade to Premium for $4.99 / mo</h3>
           <Link href="#" className="btn btn-primary btn-large" style={{ background: '#FF424D', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 24px rgba(255, 66, 77, 0.4)' }}>
             <i className="fa-brands fa-patreon" style={{ fontSize: '1.25rem' }}></i> Support on Patreon
           </Link>
           <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>Unlock instant Discord rewards via Patreon.</p>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-box glass-card">
          <h2>Ready to transform your server?</h2>
          <p>Join thousands of other communities already using HazeBot to power up their engagement.</p>
          {session ? (
            <Link href="/dashboard" className="btn btn-primary btn-large mt-4">Go to Dashboard</Link>
          ) : (
            <button onClick={() => signIn('discord', { callbackUrl: '/dashboard' })} className="btn btn-primary btn-large mt-4">Invite HazeBot Now</button>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col brand-col">
            <div className="logo">
              <img src="/assets/logo.png" alt="HazeBot Logo" className="logo-img" />
              <span className="logo-text">HazeBot</span>
            </div>
            <p>The premium Discord companion built for modern communities.</p>
            <div className="socials">
              <Link href="#"><i className="fa-brands fa-twitter"></i></Link>
              <Link href="#"><i className="fa-brands fa-discord"></i></Link>
              <Link href="#"><i className="fa-brands fa-github"></i></Link>
            </div>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#commands">Commands</Link></li>
              <li><Link href="#premium">Premium</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="#home">Dashboard</Link></li>
              <li><Link href="#">Support Server</Link></li>
              <li><Link href="#">API</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 HazeBot. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
