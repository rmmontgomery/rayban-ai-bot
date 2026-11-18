import { Composition } from "remotion";
import { FPS, type FilmProps } from "../schema";
import { Film } from "./Film";

const sample: FilmProps = {
  title: "Sample",
  scenes: [{ type: "title", heading: "Chapter to Film", subheading: "Run the film command to render a chapter", narration: "", seconds: 4 }],
};

export const Root = () => (
  <Composition
    id="Film"
    component={Film}
    width={1920}
    height={1080}
    fps={FPS}
    durationInFrames={FPS * 4}
    defaultProps={sample}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(1, Math.round(props.scenes.reduce((s, sc) => s + sc.seconds, 0) * FPS)),
    })}
  />
);
