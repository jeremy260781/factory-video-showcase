'use client';

import { useRef, useEffect, useState } from 'react';

interface LogoItem {
  id: number;
  name: string;
  website: string;
  imageUrl: string;
}

const mockVideos = [
  { id: '1', title: 'PCB Assembly Line - First Person Tour', factoryName: 'Shenzhen Tech Electronics', productType: 'Electronics Manufacturing', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '4:05' },
  { id: '2', title: 'Garment Production - From Fabric to Finished', factoryName: 'Guangzhou Textile Co.', productType: 'Textile & Apparel', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '3:09' },
  { id: '3', title: 'CNC Machining Process - Precision Parts', factoryName: 'Dongguan Precision Mfg', productType: 'Machinery & Parts', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '5:12' },
  { id: '4', title: 'LED Display Assembly Workshop Tour', factoryName: 'Shenzhen Optoelectronics', productType: 'Electronics', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '3:18' },
  { id: '5', title: 'Stainless Steel Kitchenware Production', factoryName: 'Yongkang Metalworks', productType: 'Kitchenware', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '4:27' },
  { id: '6', title: 'Injection Molding - Plastic Parts Factory', factoryName: 'Ningbo Plastics Co.', productType: 'Plastic Manufacturing', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', duration: '3:54' },
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [logos, setLogos] = useState<LogoItem[]>([
    { id: 1, name: 'TechCorp', website: 'techcorp.com', imageUrl: '' },
    { id: 2, name: 'GlobalTrade', website: 'globaltrade.com', imageUrl: '' },
    { id: 3, name: 'MegaBuy', website: 'megabuy.com', imageUrl: '' },
  ]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    const stored = localStorage.getItem('logos');
    if (stored) {
      setLogos(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: "-apple-system" }}>

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

      <section style={{ height: '60vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay muted loop playsInline style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 20px' }}>
          <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 700 }}>See Inside Chinese Factories in Real Time</h1>
          <p style={{ fontSize: 20, marginBottom: 32, opacity: 0.9 }}>First-Person Factory Tours – Direct from the Production Floor</p>
          <a href="#videos" style={{ backgroundColor: 'white', color: '#1e3a5f', padding: '16px 32px', borderRadius: 50, fontSize: 18, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Browse All Factory Videos</a>
        </div>
      </section>

      <section id="videos" style={{ padding: '80px 0', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 32, marginBottom: 12, fontWeight: 700, textAlign: 'center' }}>Featured Factory Videos</h2>
          <p style={{ color: '#666', textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>Real production lines, real quality.</p>
          <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            {mockVideos.slice(0, 3).map((video) => (
              <a key={video.id} href={`/video/${video.id}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
                  <video src={video.previewUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onMouseEnter={(e) => { const t = e.target as HTMLVideoElement; t.play().catch(() => {}); }}
                    onMouseLeave={(e) => { const t = e.target as HTMLVideoElement; t.pause(); t.currentTime = 0; }}
                  />
                </div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{video.title}</h3>
                  <p style={{ fontSize: 13, color: '#888' }}>{video.factoryName} • {video.productType}</p>
                </div>
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {mockVideos.slice(3, 6).map((video) => (
              <a key={video.id} href={`/video/${video.id}`} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
                  <video src={video.previewUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onMouseEnter={(e) => { const t = e.target as HTMLVideoElement; t.play().catch(() => {}); }}
                    onMouseLeave={(e) => { const t = e.target as HTMLVideoElement; t.pause(); t.currentTime = 0; }}
                  />
                </div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{video.title}</h3>
                  <p style={{ fontSize: 13, color: '#888' }}>{video.factoryName} • {video.productType}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

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

      {/* ===== Trusted By - 显示Logo图片 ===== */}
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

      <footer style={{ backgroundColor: '#111', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ marginBottom: 8, fontWeight: 400 }}>Connecting Global Buyers Directly with Chinese Manufacturers</p>
        <p style={{ color: '#666', marginTop: 16, fontSize: 14 }}>More factories coming soon...</p>
      </footer>

    </div>
  );
}