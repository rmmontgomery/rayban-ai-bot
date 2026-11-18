import { AbsoluteFill, Audio, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FPS, type FilmProps, type TimedScene } from "../schema";
import { theme } from "./theme";
import { Derivation } from "./scenes/Derivation";
import { Illustrated } from "./scenes/Illustrated";
import { Simulation } from "./scenes/Simulation";
import { Timeline } from "./scenes/Timeline";
import { Title } from "./scenes/Title";

const body = (scene: TimedScene) => {
  switch (scene.type) {
    case "title":
      return <Title scene={scene} />;
    case "derivation":
      return <Derivation scene={scene} />;
    case "simulation":
      return <Simulation scene={scene} />;
    case "timeline":
      return <Timeline scene={scene} />;
    case "illustrated":
    case "video":
      return <Illustrated scene={scene} />;
  }
};

// Fades each scene in and out and plays its narration.
const SceneFrame = ({ scene }: { scene: TimedScene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, color: theme.ink, fontFamily: theme.sans, opacity }}>
      {body(scene)}
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
    </AbsoluteFill>
  );
};

export const Film = ({ scenes }: FilmProps) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg }}>
    <Series>
      {scenes.map((scene, i) => (
        <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(scene.seconds * FPS))}>
          <SceneFrame scene={scene} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
