import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for ETF-NODES, operated by Ultron Technology (Foshan) Co., Ltd.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header style={{ height: 72, backgroundColor: "white", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <span style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>ETF-NODES</span>
          </a>
          <a href="/" style={{ fontSize: 14, color: "#1e3a5f", textDecoration: "none", fontWeight: 600 }}>← Back to Home</a>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Last updated: August 2026</p>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>1. Who We Are</h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: 1.7 }}>
            ETF-NODES is the sourcing and supplier-coordination service operated by Ultron Technology (Foshan) Co., Ltd.
            (address: Block 1, No.70 Guxin Rd., Zhangcha, Chancheng District, Foshan City, Guangdong, China).
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>2. Information We Collect</h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: 1.7 }}>
            When you submit a sourcing request or contact us, we collect the information you provide:
            your name, email address, company name, product requirements and other details you choose to share with us.
            We may also collect basic technical data (such as browser type and pages visited) to maintain and improve our website.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>3. How We Use Your Information</h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: 1.7 }}>
            We use your information to respond to your sourcing requests, coordinate supplier matching and factory
            verification, provide customer support, and keep you informed about the status of your inquiries.
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>4. Data Retention & Security</h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: 1.7 }}>
            We retain inquiry data only as long as needed to serve your request and meet legal obligations.
            We apply reasonable technical and organizational measures to protect your information.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>5. Your Rights</h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: 1.7 }}>
            You may request access to, correction of, or deletion of your personal information at any time by contacting us
            at the email below. We will respond within a reasonable timeframe.
          </p>
        </section>

        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>6. Contact Us</h2>
          <p style={{ color: "#444", fontSize: 15, lineHeight: 1.7 }}>
            Business email: <a href="mailto:jeremy.ou@ultronfs.com" style={{ color: "#1e3a5f" }}>jeremy.ou@ultronfs.com</a>
            <br />
            Phone: +86 181 3830 0804
            <br />
            Business Location: Foshan / Hongkong
          </p>
        </section>
      </main>
    </div>
  );
}
