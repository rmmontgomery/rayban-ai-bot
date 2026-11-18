import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedScene } from "../../schema";
import { theme } from "../theme";

type Props = { scene: Extract<TimedScene, { type: "illustrated" | "video" }> };

export const Illustrated = ({ scene }: Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Slow push-in so a still image does not sit dead on screen.
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const isClip = scene.media?.endsWith(".mp4");
  return (
    <AbsoluteFill>
      {scene.media ? (
        isClip ? (
          <OffthreadVideo src={staticFile(scene.media)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={staticFile(scene.media)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
        )
      ) : (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 30%, ${theme.panel}, ${theme.bg})` }} />
      )}
      <div
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, padding: "120px 110px 70px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
          fontFamily: theme.serif, fontSize: scene.media ? 54 : 76,
        }}
      >
        {scene.heading}
      </div>
    </AbsoluteFill>
  );
};
