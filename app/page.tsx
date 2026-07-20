'use client';

import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LogoItem {
  id: number;
  name: string;
  website: string;
  imageUrl: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  factory_name: string;
  product_name: string;
  created_at: string;
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [logos, setLogos] = useState<LogoItem[]>([
    { id: 1, name: 'TechCorp', website: 'techcorp.com', imageUrl: '' },
    { id: 2, name: 'GlobalTrade', website: 'globaltrade.com', imageUrl: '' },
    { id: 3, name: 'MegaBuy', website: 'megabuy.com', imageUrl: '' },
  ]);
  const [loading, setLoading] = useState(true);

  // ===== 从 Supabase 读取视频数据 =====
  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      if (data && data.length > 0) {
        setVideos(data);
      } else {
        // 演示数据
        setVideos([
          { id: 1, title: 'PCB Assembly Line - First Person Tour', description: '沉浸式参观PCB电路板生产线', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Electronics Manufacturing', factory_name: 'Shenzhen Tech Electronics', product_name: 'PCB Assembly Line', created_at: '' },
          { id: 2, title: 'Garment Production - From Fabric to Finished', description: '从面料到成衣的完整生产流程', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Textile & Apparel', factory_name: 'Guangzhou Textile Co.', product_name: 'Garment Production', created_at: '' },
          { id: 3, title: 'CNC Machining Process - Precision Parts', description: '高精度CNC加工过程展示', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Machinery & Parts', factory_name: 'Dongguan Precision Mfg', product_name: 'CNC Machining Process', created_at: '' },
          { id: 4, title: 'LED Display Assembly Workshop Tour', description: 'LED显示屏组装车间参观', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Electronics', factory_name: 'Shenzhen Optoelectronics', product_name: 'LED Display Assembly', created_at: '' },
          { id: 5, title: 'Stainless Steel Kitchenware Production', description: '不锈钢厨具生产工艺', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Kitchenware', factory_name: 'Yongkang Metalworks', product_name: 'Stainless Steel Kitchenware', created_at: '' },
          { id: 6, title: 'Injection Molding - Plastic Parts Factory', description: '注塑成型塑料零件工厂', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Plastic Manufacturing', factory_name: 'Ningbo Plastics Co.', product_name: 'Injection Molding', created_at: '' },
        ]);
      }
      setLoading(false);
    }

    fetchVideos();
  }, []);

  // ===== Logo 从 localStorage 读取 =====
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    const stored = localStorage.getItem('logos');
    if (stored) {
      setLogos(JSON.parse(stored));
    }
  }, []);

  // ===== 视频分两行显示 =====
  const displayVideos = videos.slice(0, 6);
  const firstRow = displayVideos.slice(0, 3);
  const secondRow = displayVideos.slice(3, 6);

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
                      <video src={video.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
                      <video src={video.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
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
          <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            ⭐ Client Testimonials
          </h2>
          <p style={{ color: '#666', textAlign: 'center', maxWidth: 600, margin: '0 auto 48px', fontSize: 16 }}>
            Real feedback from global buyers who found their manufacturing partners through us
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <div style={{ backgroundColor: '#f9fafb', padding: '28px 24px', borderRadius: 12, border: '1px solid #eee' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 16 }}>
                “We found a reliable PCB supplier within 3 days. The video gave us a real look at their production line — saved us a trip to China.”
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 600 }}>JD</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>J.D.</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Purchasing Director, United States</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '28px 24px', borderRadius: 12, border: '1px solid #eee' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 16 }}>
                “We placed our first order with a factory we'd never met in person. The video was more convincing than any brochure. 2 years and still going strong.”
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 600 }}>ER</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>E.R.</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Founder, Europe</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '28px 24px', borderRadius: 12, border: '1px solid #eee' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#333', marginBottom: 16 }}>
                “We reviewed 10 factory videos and chose the most transparent one. Trust was built the moment we saw the real production floor.”
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#b71c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 600 }}>TK</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>T.K.</div>
                  <div style={{ color: '#888', fontSize: 12 }}>Supply Chain Manager, Asia</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 40, paddingTop: 40, borderTop: '1px solid #eee' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a5f' }}>500+</div>
              <div style={{ color: '#666', fontSize: 13 }}>Global Buyers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a5f' }}>200+</div>
              <div style={{ color: '#666', fontSize: 13 }}>Partner Factories</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a5f' }}>95%</div>
              <div style={{ color: '#666', fontSize: 13 }}>Satisfaction Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#1e3a5f' }}>30%</div>
              <div style={{ color: '#666', fontSize: 13 }}>Avg. Cost Savings</div>
            </div>
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