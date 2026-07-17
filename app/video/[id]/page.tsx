'use client';

import { useParams } from 'next/navigation';

const allVideos = [
  {
    id: '1',
    title: 'PCB Assembly Line - First Person Tour',
    factoryName: 'Shenzhen Tech Electronics',
    productType: 'Electronics Manufacturing',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '4:05',
    description: 'Walk through a complete PCB assembly line in Shenzhen. See every step from component placement to quality testing. First-person perspective gives you the real factory floor experience.',
  },
  {
    id: '2',
    title: 'Garment Production - From Fabric to Finished',
    factoryName: 'Guangzhou Textile Co.',
    productType: 'Textile & Apparel',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '3:09',
    description: 'Follow the entire garment production process at our Guangzhou facility. From fabric cutting to stitching, pressing, and packaging — all captured from a first-person view.',
  },
  {
    id: '3',
    title: 'CNC Machining Process - Precision Parts',
    factoryName: 'Dongguan Precision Mfg',
    productType: 'Machinery & Parts',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '5:12',
    description: 'Experience precision CNC machining up close. This tour shows raw material transformation into high-tolerance parts, with detailed views of each machining stage.',
  },
  {
    id: '4',
    title: 'LED Display Assembly Workshop Tour',
    factoryName: 'Shenzhen Optoelectronics',
    productType: 'Electronics',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '3:18',
    description: 'Tour an LED display assembly workshop. See how panels are assembled, tested, and packaged. First-person perspective shows real working conditions.',
  },
  {
    id: '5',
    title: 'Stainless Steel Kitchenware Production',
    factoryName: 'Yongkang Metalworks',
    productType: 'Kitchenware',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '4:27',
    description: 'From raw stainless steel to finished kitchenware. This tour covers stamping, polishing, and quality inspection in a real production environment.',
  },
  {
    id: '6',
    title: 'Injection Molding - Plastic Parts Factory',
    factoryName: 'Ningbo Plastics Co.',
    productType: 'Plastic Manufacturing',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '3:54',
    description: 'See how injection molding works in a real factory. Watch the complete cycle from mold setup to finished plastic parts, captured from the operator\'s perspective.',
  },
];

export default function VideoDetailPage() {
  const params = useParams();
  const video = allVideos.find((v) => v.id === params.id);

  if (!video) {
    return (
      <div style={{ 
        minHeight: '100vh',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Helvetica Neue', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Video Not Found</h1>
          <a href="/" style={{ color: '#4da3ff', textDecoration: 'none', fontWeight: '600' }}>
            ← Back to Videos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Helvetica Neue', sans-serif",
      backgroundColor: '#111',
      color: 'white',
    }}>

      {/* 返回按钮 */}
      <div style={{ padding: '24px' }}>
        <a href="/#videos" style={{
          color: '#999',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ← Back to Videos
        </a>
      </div>

      {/* 视频播放器 - 全宽 */}
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
            src={video.videoUrl}
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
            {video.factoryName}
          </span>
          <span style={{
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            {video.productType}
          </span>
          <span style={{ color: '#999', fontSize: '14px' }}>
            {video.duration}
          </span>
        </div>

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

        <a href="/contact" style={{
          padding: '14px 32px',
          backgroundColor: 'white',
          color: '#111',
          borderRadius: '50px',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block',
          letterSpacing: '-0.2px',
        }}>
          Contact Us
        </a>
      </div>

    </div>
  );
}