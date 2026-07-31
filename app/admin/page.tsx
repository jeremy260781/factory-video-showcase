'use client';

import { useState } from 'react';

// ===== 类型定义 =====
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

interface Logo {
  id: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPage() {
  // ===== 登录状态 =====
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // ===== 视频相关 =====
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      title: 'PCB Assembly Line - First Person Tour',
      description: '沉浸式参观PCB电路板生产线',
      video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail_url: 'https://picsum.photos/seed/pcb/400/300',
      category: 'Electronics Manufacturing',
      factory_name: 'Shenzhen Tech Electronics',
      product_name: 'PCB Assembly Line',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'CNC Machining Process - Precision Parts',
      description: '高精度CNC加工过程展示',
      video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail_url: 'https://picsum.photos/seed/cnc/400/300',
      category: 'Machinery & Parts',
      factory_name: 'Dongguan Precision Mfg',
      product_name: 'CNC Machining Process',
      created_at: new Date().toISOString(),
    },
  ]);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    category: '',
    factory_name: '',
    product_name: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // ===== Logo 相关 =====
  const [logos, setLogos] = useState<Logo[]>([
    {
      id: 1,
      image_url: 'https://picsum.photos/seed/logo1/200/100',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      image_url: 'https://picsum.photos/seed/logo2/200/100',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // ===== 通用 =====
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // ===== 登录验证 =====
  const handleLogin = () => {
    if (password === 'asd123') {
      setIsLoggedIn(true);
      showMessage('✅ 登录成功！', 'success');
    } else {
      showMessage('❌ 密码错误', 'error');
    }
  };

  // ===== 上传视频 =====
  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      showMessage('请选择一个视频文件', 'error');
      return;
    }
    if (!videoForm.title || !videoForm.factory_name || !videoForm.product_name) {
      showMessage('请填写标题、工厂名称和产品名称', 'error');
      return;
    }

    setUploadingVideo(true);
    showMessage('正在上传视频...', 'info');

    // 模拟上传延迟
    setTimeout(() => {
      const newVideo: Video = {
        id: Date.now(),
        title: videoForm.title,
        description: videoForm.description || '',
        video_url: URL.createObjectURL(videoFile),
        thumbnail_url: thumbnailFile ? URL.createObjectURL(thumbnailFile) : 'https://picsum.photos/seed/' + Date.now() + '/400/300',
        category: videoForm.category || '未分类',
        factory_name: videoForm.factory_name,
        product_name: videoForm.product_name,
        created_at: new Date().toISOString(),
      };

      setVideos([newVideo, ...videos]);
      setVideoForm({ title: '', description: '', category: '', factory_name: '', product_name: '' });
      setVideoFile(null);
      setThumbnailFile(null);
      setUploadingVideo(false);
      showMessage('✅ 视频上传成功！', 'success');
    }, 1500);
  };

  // ===== 删除视频 =====
  const deleteVideo = (id: number) => {
    if (!confirm('确定要删除这条视频吗？')) return;
    setVideos(videos.filter((v) => v.id !== id));
    showMessage('✅ 删除成功', 'success');
  };

  // ===== 上传 Logo =====
  const handleUploadLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile) {
      showMessage('请选择一张图片', 'error');
      return;
    }

    setUploadingLogo(true);
    showMessage('正在上传Logo...', 'info');

    setTimeout(() => {
      const newLogo: Logo = {
        id: Date.now(),
        image_url: URL.createObjectURL(logoFile),
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setLogos([newLogo, ...logos]);
      setLogoFile(null);
      setUploadingLogo(false);
      showMessage('✅ Logo上传成功！', 'success');
    }, 1000);
  };

  // ===== 删除 Logo =====
  const deleteLogo = (id: number) => {
    if (!confirm('确定要删除这个Logo吗？')) return;
    setLogos(logos.filter((l) => l.id !== id));
    showMessage('✅ Logo删除成功', 'success');
  };

  // ===== 未登录 =====
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>🔐 后台管理</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: 24 }}>请输入密码</p>
          <input
            type="password"
            placeholder="输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px', fontSize: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12, boxSizing: 'border-box' }}
          />
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '12px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
          >
            登录
          </button>
          {message && (
            <p style={{ marginTop: 12, textAlign: 'center', color: messageType === 'error' ? '#c62828' : '#2e7d32' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ===== 已登录 =====
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28 }}>📊 后台管理</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{ padding: '8px 16px', backgroundColor: '#ccc', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            退出
          </button>
        </div>

        {message && (
          <div style={{
            backgroundColor: messageType === 'success' ? '#e8f5e9' : messageType === 'error' ? '#ffebee' : '#e3f2fd',
            padding: '12px 20px',
            borderRadius: 8,
            marginBottom: 20,
            color: messageType === 'success' ? '#2e7d32' : messageType === 'error' ? '#c62828' : '#0d47a1'
          }}>
            {message}
          </div>
        )}

        {/* ===== 上传视频 ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>📹 上传视频</h2>
          <form onSubmit={handleUploadVideo}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input
                type="text"
                placeholder="视频标题 *"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="工厂名称 *"
                value={videoForm.factory_name}
                onChange={(e) => setVideoForm({ ...videoForm, factory_name: e.target.value })}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="产品名称 *"
                value={videoForm.product_name}
                onChange={(e) => setVideoForm({ ...videoForm, product_name: e.target.value })}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="类别（如: Electronics Manufacturing）"
                value={videoForm.category}
                onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }}
              />
              <input
                type="text"
                placeholder="描述（可选）"
                value={videoForm.description}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', gridColumn: '1 / -1' }}
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>选择视频文件 *</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required
                  style={{ padding: '8px', boxSizing: 'border-box' }}
                />
                {videoFile && <span style={{ marginLeft: 12, color: '#666' }}>📹 {videoFile.name}</span>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>选择缩略图（可选）</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  style={{ padding: '8px', boxSizing: 'border-box' }}
                />
                {thumbnailFile && <span style={{ marginLeft: 12, color: '#666' }}>🖼️ {thumbnailFile.name}</span>}
              </div>
            </div>
            <button
              type="submit"
              disabled={uploadingVideo}
              style={{ marginTop: 16, padding: '12px 32px', backgroundColor: uploadingVideo ? '#999' : '#1e3a5f', color: 'white', border: 'none', borderRadius: 6, cursor: uploadingVideo ? 'default' : 'pointer', fontSize: 16 }}
            >
              {uploadingVideo ? '上传中...' : '📤 上传视频'}
            </button>
          </form>
        </div>

        {/* ===== 视频列表 ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>📋 视频列表 ({videos.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {videos.map((v) => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: 8, flexWrap: 'wrap' }}>
                <div>
                  <strong>{v.title}</strong>
                  <span style={{ color: '#888', marginLeft: 12 }}>{v.factory_name} • {v.category}</span>
                </div>
                <button
                  onClick={() => deleteVideo(v.id)}
                  style={{ padding: '4px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                  删除
                </button>
              </div>
            ))}
            {videos.length === 0 && <p style={{ color: '#999' }}>暂无视频</p>}
          </div>
        </div>

        {/* ===== 上传 Logo ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>🏢 上传 Logo</h2>
          <form onSubmit={handleUploadLogo}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>选择 Logo 图片</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                required
                style={{ padding: '8px', boxSizing: 'border-box' }}
              />
              {logoFile && <span style={{ marginLeft: 12, color: '#666' }}>🖼️ {logoFile.name}</span>}
            </div>
            <button
              type="submit"
              disabled={uploadingLogo}
              style={{ marginTop: 16, padding: '12px 32px', backgroundColor: uploadingLogo ? '#999' : '#1e3a5f', color: 'white', border: 'none', borderRadius: 6, cursor: uploadingLogo ? 'default' : 'pointer', fontSize: 16 }}
            >
              {uploadingLogo ? '上传中...' : '📤 上传 Logo'}
            </button>
          </form>
        </div>

        {/* ===== Logo 列表 ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>🖼️ Logo 列表 ({logos.length})</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {logos.map((l) => (
              <div key={l.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                <img src={l.image_url} alt="Logo" style={{ maxWidth: 120, maxHeight: 60, objectFit: 'contain' }} />
                <button
                  onClick={() => deleteLogo(l.id)}
                  style={{ marginTop: 8, padding: '4px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                  删除
                </button>
              </div>
            ))}
            {logos.length === 0 && <p style={{ color: '#999' }}>暂无 Logo</p>}
          </div>
        </div>

      </div>
    </div>
  );
}