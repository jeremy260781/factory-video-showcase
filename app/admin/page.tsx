'use client';

import { useState, useEffect } from 'react';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  factory_name: string;
  product_name: string;
  is_published: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', category: '', factory_name: '', product_name: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 6000);
  };

  // ===== 登录(通过 API 验证,前端不保存密码) =====
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        showMessage('✅ Login successful', 'success');
        loadVideos();
      } else {
        showMessage('❌ Wrong password', 'error');
      }
    } catch (e) {
      showMessage('❌ Login failed, please try again', 'error');
    }
  };

  // ===== 从 API 加载视频(数据存 OSS) =====
  const loadVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (Array.isArray(data)) setVideos(data);
    } catch (e) {
      console.error('加载视频失败:', e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadVideos();
      loadContactMessages();
    }
  }, [isLoggedIn]);

  // ===== 从 API 加载联系留言 =====
  const loadContactMessages = async () => {
    try {
      const res = await fetch('/api/contact', {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setContactMessages(data);
      }
    } catch (e) {
      console.error('加载留言失败:', e);
    }
  };

  // ===== OSS 上传文件 =====
  const uploadToOSS = async (file: File, folder: string): Promise<string | null> => {
    try {
      // 1. 从 API 获取签名上传 URL
      const tokenRes = await fetch('/api/oss/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
          contentType: file.type,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error);

      // 2. 直接用签名 URL 上传文件到 OSS(私有,播放时动态签名)
      const uploadRes = await fetch(tokenData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('OSS upload failed');

      return tokenData.publicUrl;
    } catch (err: any) {
      console.error('OSS upload error:', err);
      throw err;
    }
  };

  // ===== 上传视频 =====
  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile || !videoForm.title || !videoForm.factory_name || !videoForm.product_name) {
      showMessage('Please fill in: title, factory, product, and select a video file', 'error');
      return;
    }

    setUploadingVideo(true);
    showMessage('Uploading video to OSS...', 'info');

    try {
      // 上传视频到 OSS
      const videoUrl = await uploadToOSS(videoFile, 'videos');

      // 上传缩略图到 OSS
      let thumbnailUrl = '';
      if (thumbnailFile) {
        showMessage('Uploading thumbnail...', 'info');
        thumbnailUrl = (await uploadToOSS(thumbnailFile, 'thumbnails')) || '';
      }

      // 保存视频信息到 OSS(videos.json)
      showMessage('Saving to storage...', 'info');
      const saveRes = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          title: videoForm.title,
          description: videoForm.description || '',
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          category: videoForm.category || 'Uncategorized',
          factory_name: videoForm.factory_name,
          product_name: videoForm.product_name,
        }),
      });

      const saveResult = await saveRes.json();

      if (!saveRes.ok) {
        showMessage('❌ Save error: ' + (saveResult.error || 'Failed'), 'error');
        setUploadingVideo(false);
        return;
      }

      // 重置表单
      setVideoForm({ title: '', description: '', category: '', factory_name: '', product_name: '' });
      setVideoFile(null);
      setThumbnailFile(null);
      setUploadingVideo(false);
      showMessage('✅ Video published successfully!', 'success');

      // 刷新列表
      loadVideos();
    } catch (err: any) {
      showMessage('❌ ' + (err.message || 'Upload failed'), 'error');
      setUploadingVideo(false);
    }
  };

  // ===== 删除视频 =====
  const deleteVideo = async (id: number) => {
    if (!confirm('Delete this video permanently?')) return;

    const res = await fetch(`/api/videos?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    });

    if (res.ok) {
      showMessage('✅ Video deleted', 'success');
      setVideos(videos.filter(v => v.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      showMessage('❌ Delete failed: ' + (data.error || 'Unknown'), 'error');
    }
  };

  // ===== 切换发布状态 =====
  const togglePublish = async (video: Video) => {
    const res = await fetch(`/api/videos?id=${video.id}`, {
      method: 'PATCH',
      headers: { 'x-admin-password': password },
    });

    if (res.ok) {
      showMessage(video.is_published ? '📪 Video unpublished' : '📬 Video published', 'success');
      loadVideos();
    } else {
      const data = await res.json().catch(() => ({}));
      showMessage('❌ Update failed: ' + (data.error || 'Unknown'), 'error');
    }
  };

  // ===== 未登录 =====
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>🔐 Admin Panel</h2>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: 24 }}>Enter password</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px', fontSize: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12, boxSizing: 'border-box' }}
          />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
            Login
          </button>
          {message && <p style={{ marginTop: 12, textAlign: 'center', color: messageType === 'error' ? '#c62828' : '#2e7d32' }}>{message}</p>}
        </div>
      </div>
    );
  }

  // ===== 已登录 =====
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28 }}>📊 Admin Panel</h1>
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', backgroundColor: '#ccc', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
        </div>

        {message && (
          <div style={{
            backgroundColor: messageType === 'success' ? '#e8f5e9' : messageType === 'error' ? '#ffebee' : '#e3f2fd',
            padding: '12px 20px', borderRadius: 8, marginBottom: 20,
            color: messageType === 'success' ? '#2e7d32' : messageType === 'error' ? '#c62828' : '#0d47a1'
          }}>{message}</div>
        )}

        {/* ===== Upload Video ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>📹 Upload New Video</h2>
          <form onSubmit={handleUploadVideo}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input type="text" placeholder="Video title *" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }} />
              <input type="text" placeholder="Factory name *" value={videoForm.factory_name} onChange={(e) => setVideoForm({ ...videoForm, factory_name: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }} />
              <input type="text" placeholder="Product name *" value={videoForm.product_name} onChange={(e) => setVideoForm({ ...videoForm, product_name: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }} />
              <input type="text" placeholder="Category (e.g. Electronics)" value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }} />
              <input type="text" placeholder="Description (optional)" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', gridColumn: '1 / -1' }} />

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>🎥 Video file * <span style={{ color: '#999', fontWeight: 400 }}>(will upload to Alibaba Cloud OSS)</span></label>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required
                  style={{ padding: '8px' }} />
                {videoFile && <span style={{ marginLeft: 12, color: '#666' }}>📹 {videoFile.name}</span>}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>🖼️ Thumbnail (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  style={{ padding: '8px' }} />
                {thumbnailFile && <span style={{ marginLeft: 12, color: '#666' }}>🖼️ {thumbnailFile.name}</span>}
              </div>
            </div>

            <button type="submit" disabled={uploadingVideo}
              style={{
                marginTop: 16, padding: '12px 32px',
                backgroundColor: uploadingVideo ? '#999' : '#1e3a5f',
                color: 'white', border: 'none', borderRadius: 6,
                cursor: uploadingVideo ? 'default' : 'pointer', fontSize: 16
              }}>
              {uploadingVideo ? '⏳ Uploading...' : '📤 Upload to OSS & Publish'}
            </button>
          </form>
        </div>

        {/* ===== Video List ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>📋 Video List ({videos.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {videos.map((v) => (
              <div key={v.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: 8, flexWrap: 'wrap', gap: 8
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <strong>{v.title}</strong>
                  <span style={{ color: '#888', marginLeft: 12, fontSize: 13 }}>{v.factory_name} • {v.category}</span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: v.is_published ? '#2e7d32' : '#ff9800' }}>
                    {v.is_published ? '✅ Published' : '⏳ Draft'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => togglePublish(v)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: v.is_published ? '#ff9800' : '#4CAF50',
                      color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13
                    }}>
                    {v.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteVideo(v.id)}
                    style={{ padding: '4px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {videos.length === 0 && <p style={{ color: '#999' }}>No videos yet. Upload your first factory tour!</p>}
          </div>
        </div>

        {/* ===== 联系留言 ===== */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 12, marginTop: 24 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>📩 Contact Messages ({contactMessages.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {contactMessages.map((m) => (
              <div key={m.id} style={{ padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <strong>{m.name}</strong>
                  <span style={{ color: '#888', fontSize: 13 }}>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: 13, color: '#555', margin: '4px 0' }}>
                  📧 {m.email}{m.company ? ` • 🏢 ${m.company}` : ''}
                </p>
                <p style={{ fontSize: 14, color: '#333', margin: '4px 0 0' }}>{m.message}</p>
              </div>
            ))}
            {contactMessages.length === 0 && <p style={{ color: '#999' }}>No messages yet.</p>}
          </div>
        </div>

        {/* ===== Payment Records Link ===== */}
        <div style={{ backgroundColor: '#fff3e0', padding: '16px 24px', borderRadius: 12, marginTop: 24 }}>
          <p style={{ fontSize: 14, color: '#e65100' }}>
            💰 <strong>Video unlock revenue:</strong> Each full video unlock costs <strong>$19.99 USD</strong>. Payments are processed via Stripe and recorded in cloud storage.
          </p>
        </div>

      </div>
    </div>
  );
}
