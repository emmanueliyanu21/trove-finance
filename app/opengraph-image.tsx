import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          gap: 28,
          background: "#059A83",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 108,
              height: 108,
              borderRadius: 28,
              background: "#FFFFFF",
              color: "#059A83",
              fontSize: 64,
              fontWeight: 700,
            }}
          >
            T
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: -2,
            }}
          >
            Trove
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#E0F5E1",
          }}
        >
          Portfolio Dashboard
        </div>
      </div>
    ),
    { ...size }
  );
}
