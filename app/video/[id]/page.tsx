'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 读取后台数据
    const stored = localStorage.getItem('factory_videos');
    if (stored) {
      try {
        const allVideos = JSON.parse(stored);
        const found = allVideos.find((v: any) => v.id === parseInt(videoId));
        setVideo(found || null);
      } catch (e) {
        console.error('读取失败:', e);
      }
    }
    setLoading(false);
  }, [videoId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#111', 
        color: 'white' 
      }}>
        <p>加载中...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#111', 
        color: 'white' 
      }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>😕 视频不存在</h1>
        <Link href="/" style={{ color: '#4da3ff', textDecoration: 'none' }}>← 返回首页</Link>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
      backgroundColor: '#111',
      color: 'white',
    }}>

      {/* 返回按钮 */}
      <div style={{ padding: '24px' }}>
        <Link href="/#videos" style={{
          color: '#999',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ← Back to Videos
        </Link>
      </div>

      {/* 视频播放器 */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          backgroundColor: '#000',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          paddingTop: '56.25%',
        }}>
          <video
            src={video.video_url}
            poster={video.thumbnail_url}
            controls
            autoPlay
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* 视频信息 */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 24px',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '-0.3px',
          marginBottom: '16px',
        }}>
          {video.title}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            🏭 {video.factory_name}
          </span>
          <span style={{
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            📦 {video.product_name}
          </span>
          <span style={{
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            {video.category}
          </span>
          <span style={{ 
            color: '#fff', 
            fontSize: '12px', 
            backgroundColor: video.is_published ? '#2e7d32' : '#ff9800', 
            padding: '4px 14px', 
            borderRadius: '20px' 
          }}>
            {video.is_published ? '✅ 已上架' : '⏳ 待上架'}
          </span>
        </div>

        {video.description && (
          <p style={{
            fontSize: '16px',
            color: '#aaa',
            lineHeight: '1.8',
            fontWeight: '400',
            maxWidth: '700px',
            marginBottom: '32px',
          }}>
            {video.description}
          </p>
        )}

        <Link href="/contact" style={{
          padding: '14px 32px',
          backgroundColor: 'white',
          color: '#111',
          borderRadius: '50px',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Contact Us
        </Link>
      </div>

    </div>
  );
}