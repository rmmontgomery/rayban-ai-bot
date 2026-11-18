import katex from "katex";
import "katex/dist/katex.min.css";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedScene } from "../../schema";
import { theme } from "../theme";
import { Heading } from "./Heading";

const render = (latex: string) => {
  try {
    return katex.renderToString(latex, { displayMode: true, throwOnError: true });
  } catch {
    // Show the source rather than fail the whole film on one bad line.
    return katex.renderToString(`\\text{${latex.replace(/[\\{}$&#^_%~]/g, " ")}}`, { displayMode: true, throwOnError: false });
  }
};

export const Derivation = ({ scene }: { scene: Extract<TimedScene, { type: "derivation" }> }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = scene.steps.length;
  // Steps appear evenly across the first 80% of the scene, in step with the narration.
  const slot = (durationInFrames * 0.8) / n;
  const size = n > 5 ? 40 : n > 3 ? 48 : 58;
  return (
    <AbsoluteFill>
      <Heading>{scene.heading}</Heading>
      <div style={{ position: "absolute", top: 230, bottom: 60, left: 110, right: 110, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
        {scene.steps.map((step, i) => {
          const start = i * slot;
          const shown = interpolate(frame, [start, start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const current = frame >= start && frame < start + slot;
          return (
            <div key={i} style={{ opacity: shown, transform: `translateY(${(1 - shown) * 20}px)`, display: "flex", alignItems: "center", gap: 40 }}>
              <div style={{ flex: 1, fontSize: size, color: current ? theme.accent : theme.ink }} dangerouslySetInnerHTML={{ __html: render(step.latex) }} />
              <div style={{ width: 460, fontSize: 36, color: theme.dim }}>{step.note}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
