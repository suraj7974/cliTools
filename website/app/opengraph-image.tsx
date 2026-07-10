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
          background: "#FAFAFB",
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
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            boxShadow: "0 40px 90px -20px rgba(79,70,229,0.22)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#F4F5F7",
              borderBottom: "1px solid #E5E7EB",
              padding: "16px 20px",
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#E3ABA2" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#E6CF9F" }} />
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#ABC9B2" }} />
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
              <span style={{ color: "#4338CA" }}>❯&nbsp;</span>
              <span style={{ color: "#1F2328" }}>pip install num</span>
              <span style={{ color: "#9AA1AC" }}>py</span>
              <div
                style={{
                  width: 22,
                  height: 46,
                  background: "#4F46E5",
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
          <span style={{ fontSize: 64, fontWeight: 700, color: "#111318" }}>
            cliTools
          </span>
          <span style={{ fontSize: 30, color: "#4B5563" }}>
            small, fast CLI tools in Go &amp; Rust
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
