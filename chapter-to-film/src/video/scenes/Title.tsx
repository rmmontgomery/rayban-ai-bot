import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { TimedScene } from "../../schema";
import { theme } from "../theme";

export const Title = ({ scene }: { scene: Extract<TimedScene, { type: "title" }> }) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: 160 }}>
      <div style={{ fontFamily: theme.serif, fontSize: 104, lineHeight: 1.15, transform: `translateY(${rise}px)` }}>{scene.heading}</div>
      <div style={{ width: 160, height: 6, background: theme.accent, margin: "44px 0" }} />
      <div style={{ fontSize: 44, color: theme.dim }}>{scene.subheading}</div>
    </AbsoluteFill>
  );
};
