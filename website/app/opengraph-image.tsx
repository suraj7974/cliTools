import { ImageResponse } from "next/og";

export const alt =
  "cliTools — small, fast CLI tools in Go & Rust";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF9",
          fontFamily: "monospace",
        }}
      >
        {/* terminal card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 860,
            borderRadius: 18,
            border: "1px solid #E4E4E7",
            background: "#FFFFFF",
            boxShadow: "0 40px 90px -20px rgba(24,24,27,0.14)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#F4F4F5",
              borderBottom: "1px solid #E4E4E7",
              padding: "16px 20px",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#E0E0E4" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#E0E0E4" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#E0E0E4" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "36px 44px",
              fontSize: 40,
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ color: "#B45309" }}>❯&nbsp;</span>
              <span style={{ color: "#1B1B20" }}>pip install num</span>
              <span style={{ color: "#A1A1AA" }}>py</span>
              <div
                style={{
                  width: 22,
                  height: 46,
                  background: "#D97706",
                  marginLeft: 6,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            marginTop: 56,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: "#18181B" }}>
            cliTools
          </span>
          <span style={{ fontSize: 30, color: "#52525B" }}>
            small, fast CLI tools in Go &amp; Rust
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
