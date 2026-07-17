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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Helvetica Neue', sans-serif",
      backgroundColor: '#1e3a5f',
    }}>

      {/* ===== Header ===== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e5e5',
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px' }}>🤖</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Factory Direct</span>
            </a>
          </div>
          <a href="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', textDecoration: 'none' }}>
            Factory Tour Videos
          </a>
          <a href="/contact" style={{
            fontSize: '20px',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}>
            Contact Us
          </a>
        </div>
      </header>

      {/* ===== Contact Section ===== */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>

          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            letterSpacing: '-0.3px',
            textAlign: 'center',
            marginBottom: '12px',
            color: 'white',
          }}>
            Contact Us
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            marginBottom: '48px',
            fontSize: '16px',
          }}>
            Get in touch with us for factory tours and inquiries
          </p>

          {/* ===== Form ===== */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            marginBottom: '48px',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <span style={{ fontSize: '48px' }}>✅</span>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>
                  Thank You!
                </h2>
                <p style={{ color: '#666' }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#333',
                  }}>
                    Name
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
                      fontSize: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#333',
                  }}>
                    Email
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
                      fontSize: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Company */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#333',
                  }}>
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
                      fontSize: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#333',
                  }}>
                    Message
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
                      fontSize: '16px',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button type="submit" style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.2px',
                }}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* ===== Contact Info ===== */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📧</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Email</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Coming soon</p>
            </div>
            <div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>WeChat</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Coming soon</p>
            </div>
            <div>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📞</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Phone</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Coming soon</p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{
        backgroundColor: '#111',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <p style={{ marginBottom: '8px', fontWeight: '400' }}>
          Connecting Global Buyers Directly with Chinese Manufacturers
        </p>
        <p style={{ color: '#666', marginTop: '16px', fontSize: '14px', fontWeight: '400' }}>
          More factories coming soon...
        </p>
      </footer>

    </div>
  );
}