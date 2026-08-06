'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('表单数据:', form);

    setSubmitted(true);
    setLoading(false);
    setForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        backgroundColor: '#1e3a5f',
      }}
    >
      {/* 顶部导航 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e5e5',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a href="/" style={{ textDecoration: 'none', fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f' }}>
            🏭 Factory Direct
          </a>
          <div style={{ display: 'flex', gap: '30px' }}>
            <a href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '15px' }}>
              Home
            </a>
            <a href="/contact" style={{ textDecoration: 'none', color: '#2563eb', fontSize: '15px', fontWeight: 'bold' }}>
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <section style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: '700', textAlign: 'center', color: 'white', marginBottom: '8px' }}>
            Contact Us
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '40px', fontSize: '16px' }}>
            Get in touch with us for factory tours and inquiries
          </p>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <span style={{ fontSize: '48px' }}>✅</span>
                <h2 style={{ fontSize: '22px', marginTop: '12px', marginBottom: '6px' }}>Thank You!</h2>
                <p style={{ color: '#666' }}>We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '20px',
                    padding: '10px 32px',
                    backgroundColor: '#1e3a5f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us what you're looking for..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: loading ? '#999' : '#1e3a5f',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: loading ? 'default' : 'pointer',
                  }}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>

                <p style={{ textAlign: 'center', color: '#aaa', fontSize: '12px', marginTop: '12px' }}>
                  We'll respond within 24 hours
                </p>
              </form>
            )}
          </div>

          {/* 联系方式 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            <div>
              <div style={{ fontSize: '28px' }}>📧</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: '4px' }}>
                Email
              </p>
              <a href="mailto:jeremy.ou@ultronfs.com" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0, textDecoration: 'none' }}>
                jeremy.ou@ultronfs.com
              </a>
            </div>
            <div>
              <div style={{ fontSize: '28px' }}>💬</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: '4px' }}>
                WeChat
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                jeremy15078393
              </p>
            </div>
            <div>
              <div style={{ fontSize: '28px' }}>📞</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: '4px' }}>
                Phone / WhatsApp
              </p>
              <a href="tel:+8618138300804" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0, textDecoration: 'none' }}>
                +86 181 3830 0804
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer
        style={{
          backgroundColor: '#111',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '14px', color: '#888' }}>
          © 2026 Factory Direct. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
