'use client';

import { useState } from 'react';

interface LogoItem {
  id: number;
  name: string;
  website: string;
  imageUrl: string;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logos, setLogos] = useState<LogoItem[]>([
    { id: 1, name: 'TechCorp', website: 'techcorp.com', imageUrl: '' },
    { id: 2, name: 'GlobalTrade', website: 'globaltrade.com', imageUrl: '' },
    { id: 3, name: 'MegaBuy', website: 'megabuy.com', imageUrl: '' },
  ]);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoWebsite, setNewLogoWebsite] = useState('');
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [nextId, setNextId] = useState(4);
  const [message, setMessage] = useState('');

  const ADMIN_PASSWORD = 'asd123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setLoggedIn(true); setError(''); }
    else { setError('Incorrect password'); }
  };

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setNewLogoPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = () => {
    if (!newLogoName.trim()) return;
    const newLogos = [...logos, { id: nextId, name: newLogoName, website: newLogoWebsite, imageUrl: newLogoPreview || '' }];
    setLogos(newLogos);
    setNextId(nextId + 1);
    setNewLogoName('');
    setNewLogoWebsite('');
    setNewLogoPreview(null);
    localStorage.setItem('logos', JSON.stringify(newLogos));
    setMessage('✅ Logo uploaded successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteLogo = (id: number) => {
    const newLogos = logos.filter(l => l.id !== id);
    setLogos(newLogos);
    localStorage.setItem('logos', JSON.stringify(newLogos));
    setMessage('🗑️ Logo deleted!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontFamily: '-apple-system' }}>
        <div style={{ backgroundColor: 'white', padding: 48, borderRadius: 16, textAlign: 'center', width: 360, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: 48 }}>🔒</span>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>Admin Panel</h1>
          <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>Enter password to continue</p>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoFocus style={{ width: '100%', padding: 14, fontSize: 16, border: '1px solid #ddd', borderRadius: 10, marginBottom: 12, textAlign: 'center', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            {error && <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: 14, backgroundColor: '#1e3a5f', color: 'white', fontSize: 16, fontWeight: 600, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>Login</button>
          </form>
          <a href="/" style={{ display: 'block', marginTop: 24, color: '#999', textDecoration: 'none', fontSize: 14 }}>← Back to Site</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: '-apple-system' }}>
      
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e5e5', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🔒</span>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Admin Panel</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: 14 }}>View Site</a>
          <button onClick={() => setLoggedIn(false)} style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {message && (
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '14px 20px', borderRadius: 10, marginBottom: 24, textAlign: 'center', fontWeight: 600, fontSize: 14 }}>
            {message}
          </div>
        )}

        {/* ===== 上传视频 ===== */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📤 Upload New Video</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Title</label>
              <input type="text" placeholder="Video title" style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Factory Name</label>
              <input type="text" placeholder="Factory name" style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Product Type</label>
              <input type="text" placeholder="Product type" style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Duration</label>
              <input type="text" placeholder="e.g. 4:05" style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Description</label>
            <textarea placeholder="Video description" rows={3} style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>

          <label style={{ border: '2px dashed #ddd', borderRadius: 12, padding: '40px', textAlign: 'center', marginBottom: 16, color: '#999', display: 'block', cursor: 'pointer' }}>
            <span style={{ fontSize: 32 }}>🎬</span>
            <p style={{ marginTop: 8, fontSize: 14 }}>Click to select video file</p>
            <p style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>MP4 format supported</p>
            <input type="file" accept="video/mp4,video/*" style={{ display: 'none' }} />
          </label>

          <button style={{ width: '100%', padding: 14, backgroundColor: '#1e3a5f', color: 'white', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>Upload Video</button>
        </div>

        {/* ===== 上传Logo ===== */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>🏢 Upload Client Logo</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Company Name *</label>
              <input value={newLogoName} onChange={(e) => setNewLogoName(e.target.value)} placeholder="Company name" style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Website (optional)</label>
              <input value={newLogoWebsite} onChange={(e) => setNewLogoWebsite(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* 上传图片 */}
          <label style={{ border: '2px dashed #ddd', borderRadius: 12, padding: '40px', textAlign: 'center', marginBottom: 16, color: '#999', display: 'block', cursor: 'pointer' }}>
            {newLogoPreview ? (
              <img src={newLogoPreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '120px', borderRadius: 8 }} />
            ) : (
              <>
                <span style={{ fontSize: 32 }}>🖼️</span>
                <p style={{ marginTop: 8, fontSize: 14 }}>Click to select logo image</p>
                <p style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>PNG, JPG or SVG recommended</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleLogoFileSelect} style={{ display: 'none' }} />
          </label>

          <button onClick={handleUploadLogo} style={{ width: '100%', padding: 14, backgroundColor: '#10b981', color: 'white', fontSize: 15, fontWeight: 600, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
            ✅ Upload Logo
          </button>
        </div>

        {/* ===== Logo列表 ===== */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📋 Client Logo List ({logos.length})</h2>
          
          <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 80px', padding: '12px 16px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #e5e5e5', fontSize: 12, fontWeight: 600, color: '#888' }}>
              <span>#</span><span>COMPANY</span><span>WEBSITE</span><span></span>
            </div>
            {logos.map((logo) => (
              <div key={logo.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 80px', padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13, alignItems: 'center' }}>
                <span style={{ color: '#999' }}>{logo.id}</span>
                <span style={{ fontWeight: 500 }}>{logo.name}</span>
                <span style={{ color: '#666' }}>{logo.website || '-'}</span>
                <button onClick={() => handleDeleteLogo(logo.id)} style={{ padding: '6px 12px', backgroundColor: '#ffe8e8', color: '#e53e3e', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}