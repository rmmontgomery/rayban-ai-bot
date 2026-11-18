import { z } from "zod";

// One scene of the film. `narration` is what the voice says while it is on screen.
const base = { narration: z.string().describe("Spoken narration for this scene, 40-110 words, written for the ear.") };

export const TitleScene = z.object({
  type: z.literal("title"),
  ...base,
  heading: z.string(),
  subheading: z.string(),
});

export const DerivationScene = z.object({
  type: z.literal("derivation"),
  ...base,
  heading: z.string(),
  steps: z
    .array(
      z.object({
        latex: z.string().describe("One line of the derivation in KaTeX-compatible LaTeX, no $ delimiters."),
        note: z.string().describe("A few words saying what was done in this step, or empty."),
      }),
    )
    .describe("2-7 lines revealed one after another."),
});

export const SimulationScene = z.object({
  type: z.literal("simulation"),
  ...base,
  heading: z.string(),
  kind: z.enum(["pendulum", "projectile", "orbit", "wave", "spring"]),
  // Dimensionless knobs; each simulation documents how it reads them.
  a: z.number().describe("pendulum: start angle in degrees. projectile: launch angle in degrees. orbit: eccentricity 0-0.8. wave: number of sources (1 or 2). spring: damping 0-1."),
  b: z.number().describe("pendulum: length 0.3-1. projectile: speed 0.3-1. orbit: number of bodies 1-3. wave: wavelength 0.2-1. spring: stiffness 0.2-1."),
  caption: z.string(),
});

export const IllustratedScene = z.object({
  type: z.literal("illustrated"),
  ...base,
  heading: z.string(),
  imagePrompt: z.string().describe("Prompt for an image generator: subject, setting, style. No text in the image."),
});

export const VideoScene = z.object({
  type: z.literal("video"),
  ...base,
  heading: z.string(),
  videoPrompt: z.string().describe("Prompt for a 5-second AI video clip. Use sparingly, for moments that need motion."),
});

export const TimelineScene = z.object({
  type: z.literal("timeline"),
  ...base,
  heading: z.string(),
  events: z.array(z.object({ when: z.string(), what: z.string() })).describe("3-6 dated events in order."),
});

export const Scene = z.discriminatedUnion("type", [
  TitleScene,
  DerivationScene,
  SimulationScene,
  IllustratedScene,
  VideoScene,
  TimelineScene,
]);

export const Storyboard = z.object({
  title: z.string(),
  field: z.string().describe("The field of the chapter, e.g. 'classical mechanics' or 'medieval history'."),
  scenes: z.array(Scene),
});

export type Scene = z.infer<typeof Scene>;
export type Storyboard = z.infer<typeof Storyboard>;

// What the renderer receives: the scene plus its timing and local media files.
export type TimedScene = Scene & {
  seconds: number;
  audio?: string; // file name inside the film's asset folder
  media?: string; // image or video file name inside the asset folder
};
export type FilmProps = { title: string; scenes: TimedScene[] };

export const FPS = 30;
// Narration pace used to time scenes that have no recorded audio.
export const WORDS_PER_MINUTE = 150;
export const estimateSeconds = (text: string) =>
  Math.max(4, (text.trim().split(/\s+/).length / WORDS_PER_MINUTE) * 60 + 1);
