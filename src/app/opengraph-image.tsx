import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wujood — Your Business, Online. In EGP. In Arabic.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "#0A0A0A",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, border: "2px solid #D4A853", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4A853", fontSize: 18 }}>◉</div>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 0.5 }}>Wujood</span>
          <span style={{ color: "#D4A853", fontSize: 22, fontWeight: 700 }}>وجود</span>
        </div>
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          <span>Your customers are searching </span>
          <span style={{ color: "#D4A853" }}>for you</span>
          <span> on WhatsApp.</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 20, color: "#8B8B8B", maxWidth: 700 }}>
          Website builder • WhatsApp CRM • Social tools — for Egyptian SMEs. From 1,250 EGP/month.
        </div>
      </div>
    ),
    { ...size }
  );
}
