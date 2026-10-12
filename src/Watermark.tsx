// "Made with PixelScript" mark, shown on videos rendered for the Free plan (props.watermark = true).
// Sits top-right, clear of Instagram/YouTube's bottom and right-side buttons.
import React from "react";
import {AbsoluteFill, getInputProps} from "remotion";

export const Watermark: React.FC = () => {
  const {watermark} = getInputProps() as {watermark?: boolean};
  if (!watermark) return null;
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          top: 222,
          right: 48,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 18px 10px 12px",
          borderRadius: 18,
          background: "rgba(14,12,11,.62)",
          border: "2px solid rgba(255,255,255,.14)",
          fontFamily: "Inter, 'DejaVu Sans', sans-serif",
          color: "#F3EEE8",
          opacity: 0.9,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#FF7A45" />
          <rect x="20" y="10" width="24" height="44" rx="4" fill="#1A0E08" />
          {[16, 26, 36, 46].map((y) => (
            <React.Fragment key={y}>
              <rect x="13" y={y} width="4" height="4" rx="1" fill="#1A0E08" />
              <rect x="47" y={y} width="4" height="4" rx="1" fill="#1A0E08" />
            </React.Fragment>
          ))}
          <rect x="24" y="22" width="16" height="20" rx="2" fill="#FF7A45" />
        </svg>
        <div style={{display: "flex", flexDirection: "column", lineHeight: 1.05}}>
          <span style={{fontSize: 15, opacity: 0.75}}>Made with</span>
          <span style={{fontSize: 24, fontWeight: 900, letterSpacing: "0.02em"}}>PIXEL<span style={{color: "#FF7A45"}}>SCRIPT</span></span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Wraps a video component so the watermark is drawn over every frame when asked for.
export function withWatermark<P extends object>(C: React.FC<P>): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => (
    <AbsoluteFill>
      <C {...props} />
      <Watermark />
    </AbsoluteFill>
  );
  return Wrapped;
}
