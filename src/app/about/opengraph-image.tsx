import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "About — Built for Egyptian Businesses | Wujood";
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
          <span style={{ marginLeft: 12, padding: "4px 10px", borderRadius: 20, background: "rgba(0,201,183,0.12)", border: "1px solid rgba(0,201,183,0.25)", color: "#00C9B7", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>ABOUT</span>
        </div>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05, maxWidth: 920 }}>
          <span>About — </span>
          <span style={{ color: "#D4A853" }}>Built for</span>
          <span> </span>
          <span style={{ color: "#00C9B7" }}>Egyptian Businesses</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 20, color: "#8B8B8B", maxWidth: 720 }}>
          Arabic-first • EGP pricing • WhatsApp-native • PDPL-compliant for Egyptian SMEs.
        </div>
      </div>
    ),
    { ...size }
  );
}
