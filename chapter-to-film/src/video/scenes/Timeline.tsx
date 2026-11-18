import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedScene } from "../../schema";
import { theme } from "../theme";
import { Heading } from "./Heading";

export const Timeline = ({ scene }: { scene: Extract<TimedScene, { type: "timeline" }> }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const slot = (durationInFrames * 0.8) / scene.events.length;
  return (
    <AbsoluteFill>
      <Heading>{scene.heading}</Heading>
      <div style={{ position: "absolute", top: 260, left: 150, right: 110, borderLeft: `4px solid ${theme.dim}`, paddingLeft: 50, display: "flex", flexDirection: "column", gap: 34 }}>
        {scene.events.map((e, i) => {
          const shown = interpolate(frame, [i * slot, i * slot + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: shown, position: "relative" }}>
              <div style={{ position: "absolute", left: -66, top: 12, width: 28, height: 28, borderRadius: 14, background: theme.accent }} />
              <div style={{ fontSize: 36, color: theme.accent, fontWeight: 700 }}>{e.when}</div>
              <div style={{ fontSize: 40, lineHeight: 1.25 }}>{e.what}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
