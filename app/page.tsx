'use client';

import { useRef, useEffect, useState } from 'react';

const DEFAULT_LOGOS = [
  { id: 1, name: 'TechCorp', website: 'techcorp.com', imageUrl: '' },
  { id: 2, name: 'GlobalTrade', website: 'globaltrade.com', imageUrl: '' },
  { id: 3, name: 'MegaBuy', website: 'megabuy.com', imageUrl: '' },
];

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  factory_name: string;
  product_name: string;
  is_published?: boolean;
  created_at: string;
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [logos, setLogos] = useState(DEFAULT_LOGOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
        }
      } catch (e) {
        console.error('加载视频失败:', e);
      }
      setLoading(false);
    }

    fetchVideos();

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const stored = localStorage.getItem('logos');
    if (stored) {
      try {
        setLogos(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const publishedVideos = videos.filter(v => v.is_published !== false).slice(0, 6);
  const firstRow = publishedVideos.slice(0, 3);
  const secondRow = publishedVideos.slice(3, 6);

  return (
    <div style={{ minHeight: '100vh', fontFamily: "-apple-system" }}>

      {/* ===== Header ===== */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 80, backgroundColor: 'white', borderBottom: '1px solid #e5e5e5', zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 28 }}>🤖</span>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Factory Direct</span>
          </a>
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>Factory Tour Videos</span>
          <a href="/contact" style={{ fontSize: 20, color: '#333', textDecoration: 'none', fontWeight: 'bold' }}>Contact Us</a>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section style={{ height: '60vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay muted loop playsInline poster="/hero-poster.jpg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 20px' }}>
          <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 700 }}>See Inside Chinese Factories in Real Time</h1>
          <p style={{ fontSize: 20, marginBottom: 32, opacity: 0.9 }}>First-Person Factory Tours – Direct from the Production Floor</p>
          <a href="#videos" style={{ backgroundColor: 'white', color: '#1e3a5f', padding: '16px 32px', borderRadius: 50, fontSize: 18, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Browse All Factory Videos</a>
        </div>
      </section>

      {/* ===== What Is This / How It Works ===== */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, marginBottom: 12, fontWeight: 700 }}>How It Works</h2>
          <p style={{ color: '#666', fontSize: 16, maxWidth: 640, margin: '0 auto 48px' }}>
            We help global buyers find real source factories — the video is the proof.
            Every tour is filmed on the actual production floor, no stock footage, no filters.
          </p>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '🎬', title: '1. Browse Real Factory Videos', desc: 'Watch first-person tours from real production lines across China.' },
              { icon: '👀', title: '2. Preview Free, Unlock Full', desc: 'Preview the first 15 seconds free. Unlock the full video for $19.99 when it looks right.' },
              { icon: '✅', title: '3. Verify Before You Visit', desc: 'Shortlist factories with confidence — then book a paid factory inspection for the final check.' },
            ].map((step) => (
              <div key={step.title} style={{ flex: 1, minWidth: 260, maxWidth: 300, padding: '32px 24px', borderRadius: 16, backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Videos ===== */}
      <section id="videos" style={{ padding: '80px 0', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 32, marginBottom: 12, fontWeight: 700, textAlign: 'center' }}>Featured Factory Videos</h2>
          <p style={{ color: '#666', textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
            {loading ? 'Loading...' : 'Real production lines, real quality.'}
          </p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading videos...</div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {firstRow.map((video) => (
                  <a key={video.id} href={`/video/${video.id}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
                      <video src={video.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'} poster={video.thumbnail_url || undefined} preload="none" muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onMouseEnter={(e) => { const t = e.target as HTMLVideoElement; t.play().catch(() => {}); }}
                        onMouseLeave={(e) => { const t = e.target as HTMLVideoElement; t.pause(); t.currentTime = 0; }}
                      />
                    </div>
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{video.title}</h3>
                      <p style={{ fontSize: 13, color: '#888' }}>{video.factory_name} • {video.category}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {secondRow.map((video) => (
                  <a key={video.id} href={`/video/${video.id}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
                      <video src={video.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'} poster={video.thumbnail_url || undefined} preload="none" muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        onMouseEnter={(e) => { const t = e.target as HTMLVideoElement; t.play().catch(() => {}); }}
                        onMouseLeave={(e) => { const t = e.target as HTMLVideoElement; t.pause(); t.currentTime = 0; }}
                      />
                    </div>
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{video.title}</h3>
                      <p style={{ fontSize: 13, color: '#888' }}>{video.factory_name} • {video.category}</p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== Why Choose Us ===== */}
      <section style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>Why Choose Us?</h2>
          <p style={{ color: '#666', textAlign: 'center', maxWidth: 600, margin: '0 auto 48px', fontSize: 16 }}>We bring transparency to global sourcing with first-person factory tours</p>
          <div style={{ display: 'flex', gap: 32, textAlign: 'center' }}>
            {[
              { icon: '🎥', title: 'Real Videos', desc: 'No filters, no edits.' },
              { icon: '🔍', title: 'AI Verified', desc: 'Quality and authenticity standards.' },
              { icon: '⚡', title: 'Fast Decisions', desc: 'Evaluate factories in minutes.' },
            ].map((item) => (
              <div key={item.title} style={{ flex: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Client Testimonials ===== */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>⭐ Client Testimonials</h2>
          <p style={{ color: '#666', textAlign: 'center', maxWidth: 600, margin: '0 auto 48px', fontSize: 16 }}>
            Real feedback from global buyers who found their manufacturing partners through us
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                stars: '⭐⭐⭐⭐⭐',
                text: '"We found a reliable PCB supplier within 3 days. The video gave us a real look at their production line — saved us a trip to China."',
                initials: 'JD', color: '#1e3a5f',
                name: 'J.D.', role: 'Purchasing Director, United States',
              },
              {
                stars: '⭐⭐⭐⭐⭐',
                text: '"We placed our first order with a factory we\'d never met in person. The video was more convincing than any brochure. 2 years and still going strong."',
                initials: 'ER', color: '#2e7d32',
                name: 'E.R.', role: 'Founder, Europe',
              },
              {
                stars: '⭐⭐⭐⭐⭐',
                text: '"We reviewed 10 factory videos and chose the most transparent one. Trust was built the moment we saw the real production floor."',
                initials: 'TK', color: '#b71c1c',
                name: 'T.K.', role: 'Supply Chain Manager, Asia',
              },
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: '#f9fafb', padding: '28px 24px', borderRadius: 12, border: '1px solid #eee' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{t.stars}</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 16 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 600 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#888', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40, paddingTop: 40, borderTop: '1px solid #eee' }}>
            {[
              { num: '500+', label: 'Global Buyers' },
              { num: '200+', label: 'Partner Factories' },
              { num: '95%', label: 'Satisfaction Rate' },
              { num: '30%', label: 'Avg. Cost Savings' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a5f' }}>{s.num}</div>
                <div style={{ color: '#666', fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trusted By ===== */}
      <section style={{ padding: '60px 0', backgroundColor: '#f9fafb', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 32 }}>Trusted By</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
            {logos.map((client) => (
              <div key={client.id} style={{ textAlign: 'center' }}>
                {client.imageUrl ? (
                  <img src={client.imageUrl} alt={client.name} style={{ maxWidth: 120, maxHeight: 60, objectFit: 'contain' }} />
                ) : (
                  <div style={{ backgroundColor: '#e8edf5', padding: '16px 28px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: '#555' }}>
                    {client.name}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#bbb' }}>Total: {logos.length} logos</p>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ backgroundColor: '#111', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ marginBottom: 8, fontWeight: 400 }}>Connecting Global Buyers Directly with Chinese Manufacturers</p>
        <p style={{ color: '#666', marginTop: 16, fontSize: 14 }}>More factories coming soon...</p>
      </footer>

    </div>
  );
}
