'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DEMO_VIDEOS: Record<string, any> = {
  '1': { id: 1, title: 'PCB Assembly Line - First Person Tour', description: '沉浸式参观PCB电路板生产线', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Electronics Manufacturing', factory_name: 'Shenzhen Tech Electronics', product_name: 'PCB Assembly Line', is_published: true },
  '2': { id: 2, title: 'Garment Production - From Fabric to Finished', description: '从面料到成衣的完整生产流程', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Textile & Apparel', factory_name: 'Guangzhou Textile Co.', product_name: 'Garment Production', is_published: true },
  '3': { id: 3, title: 'CNC Machining Process - Precision Parts', description: '高精度CNC加工过程展示', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Machinery & Parts', factory_name: 'Dongguan Precision Mfg', product_name: 'CNC Machining Process', is_published: true },
  '4': { id: 4, title: 'LED Display Assembly Workshop Tour', description: 'LED显示屏组装车间参观', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Electronics', factory_name: 'Shenzhen Optoelectronics', product_name: 'LED Display Assembly', is_published: true },
  '5': { id: 5, title: 'Stainless Steel Kitchenware Production', description: '不锈钢厨具生产工艺', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Kitchenware', factory_name: 'Yongkang Metalworks', product_name: 'Stainless Steel Kitchenware', is_published: true },
  '6': { id: 6, title: 'Injection Molding - Plastic Parts Factory', description: '注塑成型塑料零件工厂', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_url: '', category: 'Plastic Manufacturing', factory_name: 'Ningbo Plastics Co.', product_name: 'Injection Molding', is_published: true },
};

export default function VideoDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [payStep, setPayStep] = useState<'email' | 'pay'>('email');
  const [payMessage, setPayMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);

  // ===== 加载视频 =====
  useEffect(() => {
    async function loadVideo() {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((v: any) => String(v.id) === videoId);
          if (found) {
            setVideo({ ...found, is_published: found.is_published ?? true });
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('加载视频失败:', e);
      }
      if (DEMO_VIDEOS[videoId]) {
        setVideo(DEMO_VIDEOS[videoId]);
      } else {
        setVideo(null);
      }
      setLoading(false);
    }
    loadVideo();
  }, [videoId]);

  // ===== 检查是否已解锁 =====
  const checkUnlock = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/payments/check?video_id=${videoId}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.unlocked) {
        setIsUnlocked(true);
        setShowPaywall(false);
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }
    } catch {}
  }, [videoId]);

  // ===== 恢复上次输入的邮箱 + 处理支付返回 =====
  useEffect(() => {
    // 支付成功后返回:?unlocked=1
    if (searchParams.get('unlocked') === '1') {
      const savedEmail = localStorage.getItem('viewer_email');
      if (savedEmail) {
        setIsUnlocked(true);
        setShowPaywall(false);
      }
    }

    const savedEmail = localStorage.getItem('viewer_email');
    if (savedEmail) {
      setCustomerEmail(savedEmail);
      checkUnlock(savedEmail);
    }
  }, [checkUnlock, searchParams]);

  // ===== 15秒预览限制 =====
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && !isUnlocked) {
      const ct = videoRef.current.currentTime;
      if (ct >= 15) {
        videoRef.current.pause();
        setShowPaywall(true);
      }
    }
  }, [isUnlocked]);

  // ===== 提交邮箱,开始支付 =====
  const handleProceedToPay = () => {
    if (!customerEmail || !customerEmail.includes('@')) {
      setPayMessage('Please enter a valid email address');
      return;
    }
    localStorage.setItem('viewer_email', customerEmail);
    setPayStep('pay');
    setPayMessage('');
    handlePay();
  };

  // ===== 发起支付(Stripe Checkout) =====
  const handlePay = async () => {
    setPaymentLoading(true);
    setPayMessage('');

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: parseInt(videoId),
          customer_email: customerEmail,
          customer_name: '',
          return_url: `${window.location.origin}/video/${videoId}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPayMessage(data.error || 'Payment failed. Please try again.');
        setPaymentLoading(false);
        return;
      }

      // 跳转到 Stripe Checkout 支付页面
      window.location.href = data.hosted_page_url;
    } catch (err: any) {
      setPayMessage('Network error. Please try again.');
      setPaymentLoading(false);
    }
  };

  // ===== 播放/暂停 =====
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isUnlocked) {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: 'white' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: 'white' }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>😕 Video not found</h1>
        <Link href="/" style={{ color: '#4da3ff', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif", backgroundColor: '#111', color: 'white' }}>

      {/* 返回按钮 */}
      <div style={{ padding: '24px' }}>
        <Link href="/#videos" style={{ color: '#999', textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          ← Back to Videos
        </Link>
      </div>

      {/* ===== 视频播放器 + 付费遮罩 ===== */}
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ backgroundColor: '#000', borderRadius: 16, overflow: 'hidden', position: 'relative', paddingTop: '56.25%' }}>
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url}
            controls={isUnlocked}
            autoPlay
            muted={!isUnlocked}
            playsInline
            onClick={isUnlocked ? togglePlay : undefined}
            onTimeUpdate={handleTimeUpdate}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: isUnlocked ? 'pointer' : 'default' }}
          />

          {/* ===== 付费遮罩（15秒后弹出） ===== */}
          {showPaywall && !isUnlocked && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '20px',
              zIndex: 10,
            }}>
              {/* 预览已结束 */}
              {payStep === 'email' && (
                <div style={{ textAlign: 'center', maxWidth: 440 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Preview Ended</h2>
                  <p style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>
                    You've watched the 15-second preview. Unlock the full video to see the complete factory tour.
                  </p>

                  <input
                    type="email"
                    placeholder="Your email address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleProceedToPay()}
                    style={{
                      width: '100%', padding: '14px 16px', fontSize: 16,
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white', outline: 'none',
                      marginBottom: 12, boxSizing: 'border-box',
                    }}
                  />

                  <button
                    onClick={handleProceedToPay}
                    style={{
                      width: '100%', padding: '14px', fontSize: 16, fontWeight: 600,
                      backgroundColor: '#4CAF50', color: 'white', border: 'none',
                      borderRadius: 8, cursor: 'pointer',
                    }}
                  >
                    Unlock Full Video — $1
                  </button>

                  {payMessage && (
                    <p style={{ marginTop: 12, color: '#ff6b6b', fontSize: 13 }}>{payMessage}</p>
                  )}

                  <p style={{ color: '#888', fontSize: 12, marginTop: 16 }}>
                    🔒 Secure payment via Stripe. One-time purchase, watch forever.
                  </p>
                </div>
              )}

              {/* 正在支付 */}
              {payStep === 'pay' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
                  <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                    {paymentLoading ? 'Redirecting to payment...' : 'Complete Payment'}
                  </h2>
                  <p style={{ color: '#aaa', fontSize: 14 }}>
                    {paymentLoading ? 'You will be redirected to Stripe secure checkout.' : ''}
                  </p>
                  {payMessage && (
                    <p style={{ marginTop: 12, color: '#ff6b6f', fontSize: 13 }}>{payMessage}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== 视频信息 ===== */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 16 }}>{video.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
            🏭 {video.factory_name}
          </span>
          <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
            📦 {video.product_name}
          </span>
          <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
            {video.category}
          </span>
          {isUnlocked && (
            <span style={{ color: '#fff', fontSize: 12, backgroundColor: '#2e7d32', padding: '4px 14px', borderRadius: 20 }}>
              ✅ Unlocked
            </span>
          )}
        </div>

        {video.description && (
          <p style={{ fontSize: 16, color: '#aaa', lineHeight: 1.8, maxWidth: 700, marginBottom: 32 }}>
            {video.description}
          </p>
        )}

        <Link href="/contact" style={{
          padding: '14px 32px', backgroundColor: 'white', color: '#111',
          borderRadius: 50, fontSize: 15, fontWeight: 600,
          textDecoration: 'none', display: 'inline-block',
        }}>
          Contact Us
        </Link>
      </div>

    </div>
  );
}
