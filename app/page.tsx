'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';

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
  const [loading, setLoading] = useState(true);

  // 询盘表单状态
  const [form, setForm] = useState({ name: '', email: '', company: '', need: '', market: '', quantity: '' });
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

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
  }, []);

  const publishedVideos = videos.filter(v => v.is_published !== false).slice(0, 6);
  const firstRow = publishedVideos.slice(0, 3);
  const secondRow = publishedVideos.slice(3, 6);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: `Sourcing Request — What to source: ${form.need}\nTarget market: ${form.market || 'N/A'}\nEstimated quantity: ${form.quantity || 'N/A'}`,
        }),
      });
      if (res.ok) {
        setFormState('sent');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  }

  const sectionTitle = { fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 12, color: '#1a1a1a' } as const;
  const sectionSub = { color: '#666', textAlign: 'center', maxWidth: 640, margin: '0 auto 48px', fontSize: 16, lineHeight: 1.7 } as const;

  return (
    <div style={{ minHeight: '100vh', fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

      {/* ===== Header ===== */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 72, backgroundColor: 'white', borderBottom: '1px solid #e5e5e5', zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap' }}>ETF-NODES</span>
          </a>
          <nav style={{ display: 'flex', gap: 20, fontSize: 14, color: '#444', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <a href="#what-we-source" style={{ color: '#444', textDecoration: 'none' }}>What We Source</a>
            <a href="#how-we-support" style={{ color: '#444', textDecoration: 'none' }}>How It Works</a>
            <a href="#factory-evidence" style={{ color: '#444', textDecoration: 'none' }}>Factory Evidence</a>
            <a href="#about" style={{ color: '#444', textDecoration: 'none' }}>About Us</a>
          </nav>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section style={{ height: 600, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video ref={videoRef} autoPlay muted loop playsInline poster="/hero-poster.jpg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,20,35,0.62)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '100px 20px 40px', maxWidth: 900 }}>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', letterSpacing: 2, textTransform: 'uppercase', opacity: 0.85, marginBottom: 14 }}>China Sourcing · Factory Verified · Export-Ready</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', marginBottom: 14, fontWeight: 700, lineHeight: 1.15 }}>Your China Sourcing Partner for Verified Supply Chains</h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', marginBottom: 0, opacity: 0.92, lineHeight: 1.6, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
            We help global buyers find suitable, reliable Chinese suppliers — from supplier matching and factory verification to quality follow-up and export coordination.
          </p>
        </div>
        {/* 信任条 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, backgroundColor: 'rgba(10,20,35,0.55)', backdropFilter: 'blur(4px)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', color: 'white', fontSize: 16, textAlign: 'center', lineHeight: 1.4 }}>
            <span><strong style={{ fontSize: 16, color: '#FFC94D' }}>20+</strong> supplier relationships developed</span>
            <span><strong style={{ fontSize: 16, color: '#FFC94D' }}>30+</strong> sourcing projects supported</span>
            <span>Buyers supported across <strong style={{ fontSize: 16, color: '#FFC94D' }}>15</strong> markets</span>
            <span><strong style={{ fontSize: 16, color: '#FFC94D' }}>93%</strong> client satisfaction</span>
          </div>
        </div>
      </section>

      {/* ===== What We Help You Source ===== */}
      <section id="what-we-source" style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={sectionTitle}>What We Help You Source</h2>
          <p style={sectionSub}>
            We focus on categories where we have verified factory partners and real sourcing experience.
            For anything else, we scope it as a selected custom-manufacturing project.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '💧', title: 'Filtration & Water Treatment Components', desc: 'RO systems, filter cartridges, membranes, housings and water treatment parts from verified manufacturers in Guangdong.' },
              { icon: '⚙️', title: 'Industrial Components', desc: 'Fasteners, fittings, hardware and engineered components from our audited partner factories.' },
              { icon: '🏭', title: 'Custom Manufacturing Projects', desc: 'Selected custom-manufacturing projects — evaluated case by case against our factory network.' },
              { icon: '🔗', title: 'Supplier Matching for Buyer Requirements', desc: 'Tell us what you need; we identify and shortlist suitable suppliers from our verified network.' },
            ].map((item) => (
              <div key={item.title} style={{ flex: '1 1 240px', maxWidth: 300, padding: '28px 24px', borderRadius: 16, backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12, lineHeight: 1 }}>{item.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#1a1a1a', minHeight: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.title}</h3>
                <p style={{ color: '#444', fontSize: 14, lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How We Support Buyers ===== */}
      <section id="how-we-support" style={{ padding: '80px 0', backgroundColor: '#1e3a5f', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ ...sectionTitle, color: 'white' }}>How We Support Buyers</h2>
          <p style={{ ...sectionSub, color: 'rgba(255,255,255,0.85)' }}>
            From the first inquiry to shipment, we coordinate the practical steps of sourcing in China.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { n: '1', icon: '🔍', title: 'Supplier Matching', desc: 'We review your requirements and shortlist suitable suppliers from our verified factory network.' },
              { n: '2', icon: '🏭', title: 'Factory Verification Support', desc: 'We help verify factories through on-site visits, audits and real production-floor evidence.' },
              { n: '3', icon: '📋', title: 'Quality Follow-up', desc: 'Pre-shipment inspection, production checks and issue follow-up before your goods leave the factory.' },
              { n: '4', icon: '📦', title: 'Sample & Specification Coordination', desc: 'We coordinate samples, specifications and revisions between you and the factory.' },
              { n: '5', icon: '🚢', title: 'Export Coordination', desc: 'Documentation, logistics and export formalities handled so your order ships smoothly.' },
            ].map((step) => (
              <div key={step.n} style={{ flex: '1 1 190px', maxWidth: 210, padding: '26px 20px', borderRadius: 14, backgroundColor: 'white', border: '1px solid #e5e7eb', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 12, flexShrink: 0 }}>{step.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#1a1a1a', minHeight: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step.title}</h3>
                <p style={{ color: '#444', fontSize: 13, lineHeight: 1.6, flex: 1 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Who We Work With ===== */}
      <section id="who-we-work-with" style={{ padding: '80px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={sectionTitle}>Who We Work With</h2>
          <p style={sectionSub}>We support buyers at every stage of their China sourcing journey.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { icon: '🚢', title: 'Importers', desc: 'Buyers bringing China-sourced goods into their local market.' },
              { icon: '📦', title: 'Distributors', desc: 'Companies expanding product lines with verified factory supply.' },
              { icon: '🏷️', title: 'Product Brands', desc: 'Brands looking for reliable manufacturing partners and OEM support.' },
              { icon: '🏗️', title: 'Engineering Companies', desc: 'Project teams sourcing components and custom parts.' },
              { icon: '🧾', title: 'Procurement Teams', desc: 'Corporate buyers who need supplier vetting and follow-up support.' },
            ].map((item) => (
              <div key={item.title} style={{ padding: '26px 20px', borderRadius: 14, backgroundColor: '#f8fafc', border: '1px solid #e5e7eb', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 34, marginBottom: 12, lineHeight: 1 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#1a1a1a', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.title}</h3>
                <p style={{ color: '#444', fontSize: 13, lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Factory Evidence (视频墙) ===== */}
      <section id="factory-evidence" style={{ padding: '80px 0', backgroundColor: '#1e3a5f', color: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ ...sectionTitle, color: 'white', marginBottom: 12 }}>Factory Evidence — See the Real Production Floor</h2>
          <p style={{ ...sectionSub, color: 'rgba(255,255,255,0.85)', maxWidth: 960 }}>
            First-person tours filmed on actual production lines. The video is the proof — no stock footage, no filters.
          </p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading videos...</div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
                {firstRow.map((video) => (
                  <a key={video.id} href={`/video/${video.id}`} style={{ flex: '1 1 30%', minWidth: 260, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
                      <video src={video.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'} poster={video.thumbnail_url || undefined} preload="none" muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'white' }}>{video.title}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{video.factory_name} • {video.category}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {secondRow.map((video) => (
                  <a key={video.id} href={`/video/${video.id}`} style={{ flex: '1 1 30%', minWidth: 260, textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
                      <video src={video.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4'} poster={video.thumbnail_url || undefined} preload="none" muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'white' }}>{video.title}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{video.factory_name} • {video.category}</p>
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
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={sectionTitle}>Why Choose Us?</h2>
          <p style={sectionSub}>Transparency and practical coordination across your China sourcing journey</p>
          <div style={{ display: 'flex', gap: 32, textAlign: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '🎥', title: 'Real Factory Evidence', desc: 'First-person tours filmed on actual production floors. No stock footage.' },
              { icon: '🔍', title: 'Verified Partner Network', desc: 'Factories audited and vetted through our sourcing work.' },
              { icon: '🤝', title: 'End-to-End Coordination', desc: 'Matching, verification, quality follow-up and export handled.' },
            ].map((item) => (
              <div key={item.title} style={{ flex: '1 1 240px', maxWidth: 300 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>{item.title}</h3>
                <p style={{ color: '#444', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Client Testimonials + Stats ===== */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={sectionTitle}>⭐ Client Testimonials</h2>
          <p style={sectionSub}>Real feedback from global buyers who found their manufacturing partners through us</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { stars: '⭐⭐⭐⭐⭐', text: '"We found a reliable PCB supplier within 3 days. The video gave us a real look at their production line — saved us a trip to China."', initials: 'JD', color: '#1e3a5f', name: 'J.D.', role: 'Purchasing Director, United States' },
              { stars: '⭐⭐⭐⭐⭐', text: '"We placed our first order with a factory we\'d never met in person. The video was more convincing than any brochure. 2 years and still going strong."', initials: 'ER', color: '#2e7d32', name: 'E.R.', role: 'Founder, Europe' },
              { stars: '⭐⭐⭐⭐⭐', text: '"We reviewed 10 factory videos and chose the most transparent one. Trust was built the moment we saw the real production floor."', initials: 'TK', color: '#b71c1c', name: 'T.K.', role: 'Supply Chain Manager, Asia' },
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: '#f9fafb', padding: '28px 24px', borderRadius: 12, border: '1px solid #eee' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.stars}</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333', marginBottom: 16 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 600 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: '#888', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== About Us ===== */}
      <section id="about" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={sectionTitle}>About Us</h2>
          <p style={{ ...sectionSub, maxWidth: 1100 }}>
            ETF-NODES is the sourcing and supplier-coordination service operated by Ultron Technology (Foshan) Co., Ltd.
          </p>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: '36px 32px', lineHeight: 1.8, color: '#444', fontSize: 15 }}>
            <p style={{ marginBottom: 16, textAlign: 'justify' }}>
              Founded in 2019, our company is a dedicated sourcing partner specializing in the integration of factory resources across a wide range of product categories, including home appliances, furniture, home furnishings, building materials, outdoor products, and pet supplies. To ensure seamless operations, we have established a coordinated team of over 30 professionals based in Hong Kong (Sai Ying Pun), Shenzhen, and Foshan. Over the years, we have successfully delivered one-stop, professional, efficient, and cost-effective procurement solutions to over 100 clients spanning more than 20 countries worldwide.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>Business email</div>
                <div style={{ fontSize: 14 }}><a href="mailto:jeremy.ou@ultronfs.com" style={{ color: '#1e3a5f' }}>jeremy.ou@ultronfs.com</a></div>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>Phone</div>
                <div style={{ fontSize: 14 }}>+86 181 3830 0804</div>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>Location</div>
                <div style={{ fontSize: 14 }}>Foshan / Shenzhen / Hong Kong</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 最终询盘区 ===== */}
      <section id="sourcing-request" style={{ padding: '90px 20px', backgroundColor: '#1e3a5f', color: 'white' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, marginBottom: 16 }}>Start Your China Sourcing Request</h2>
          <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.7, marginBottom: 40, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Tell us what you need, your target market and key requirements. We will review your request and help identify the next practical sourcing step.
          </p>

          {formState === 'sent' ? (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '40px 24px', borderRadius: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Thank you — request received.</p>
              <p style={{ fontSize: 14, opacity: 0.85 }}>We will review your request and respond within 1 business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name *" style={{ padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 15, color: '#111', backgroundColor: '#ffffff' }} />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" style={{ padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 15, color: '#111', backgroundColor: '#ffffff' }} />
              </div>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" style={{ padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 15, color: '#111', backgroundColor: '#ffffff' }} />
              <textarea required rows={4} value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} placeholder="What do you need to source? *" style={{ padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 15, color: '#111', backgroundColor: '#ffffff', resize: 'vertical', fontFamily: 'inherit' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <select value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} style={{ padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 15, color: '#111', backgroundColor: 'white' }}>
                  <option value="">Target market (optional)</option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Other">Other</option>
                </select>
                <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Estimated quantity (optional)" style={{ padding: '14px 16px', borderRadius: 10, border: 'none', fontSize: 15, color: '#111', backgroundColor: '#ffffff' }} />
              </div>
              <button type="submit" disabled={formState === 'sending'} style={{ marginTop: 8, backgroundColor: 'white', color: '#1e3a5f', padding: '16px 32px', borderRadius: 50, fontSize: 17, fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}>
                {formState === 'sending' ? 'Submitting...' : 'Request Supplier Evaluation'}
              </button>
              {formState === 'error' && <p style={{ color: '#ffd0d0', fontSize: 14, textAlign: 'center' }}>Something went wrong. Please try again or email us directly.</p>}
              <p style={{ fontSize: 12, opacity: 0.7, textAlign: 'center', marginTop: 4 }}>We typically respond within 1 business day.</p>
            </form>
          )}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ backgroundColor: '#111', color: 'white', padding: '48px 20px 64px', textAlign: 'center' }}>
        <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.7, maxWidth: 1100, margin: '0 auto 24px' }}>
          ETF-NODES is the sourcing and supplier-coordination service operated by Ultron Technology (Foshan) Co., Ltd.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 13, color: '#999', marginBottom: 16 }}>
          <span>Business email: <a href="mailto:jeremy.ou@ultronfs.com" style={{ color: '#bbb', textDecoration: 'none' }}>jeremy.ou@ultronfs.com</a></span>
          <span>Phone: <a href="tel:+8618138300804" style={{ color: '#bbb', textDecoration: 'none' }}>+86 181 3830 0804</a></span>
          <span>Business Location: Foshan / Hongkong</span>
          <span>Working Hours: 8:30am-17:30pm</span>
        </div>
        <a href="/privacy" style={{ color: '#888', fontSize: 13, textDecoration: 'underline' }}>Privacy Policy</a>
      </footer>

    </div>
  );
}
