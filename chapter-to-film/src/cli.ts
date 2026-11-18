import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { makeImage, makeVideo, mediaEnabled } from "./media.js";
import { renderFilm } from "./render.js";
import { Storyboard, estimateSeconds, type FilmProps, type TimedScene } from "./schema.js";
import { writeStoryboard } from "./storyboard.js";
import { speak } from "./voice.js";

const USAGE = `Usage:
  npm run film -- <chapter.md|.txt>             chapter -> storyboard -> film
  npm run film -- <storyboard.json>             render an existing (edited) storyboard
Options:
  --storyboard-only    stop after writing the storyboard, so you can review and edit it
  --out <folder>       where to put the film (default: out/<chapter name>)`;

async function main() {
  const args = process.argv.slice(2);
  const outFlag = args.indexOf("--out");
  const outArg = outFlag >= 0 ? args[outFlag + 1] : undefined;
  const input = args.find((a, i) => !a.startsWith("--") && (outFlag < 0 || i !== outFlag + 1));
  if (!input) return console.log(USAGE);
  const storyboardOnly = args.includes("--storyboard-only");
  const outDir = path.resolve(outArg ?? path.join("out", path.parse(input).name.replace(/\.storyboard$/, "")));
  const assetDir = path.join(outDir, "assets");
  await mkdir(assetDir, { recursive: true });

  const maxVideoClips = Number(process.env.MAX_VIDEO_CLIPS ?? 3);
  const text = await readFile(input, "utf8");
  let storyboard: Storyboard;
  if (input.endsWith(".json")) {
    storyboard = Storyboard.parse(JSON.parse(text));
  } else {
    console.log("Writing the storyboard with Claude...");
    storyboard = await writeStoryboard(text, { maxVideoClips, language: process.env.FILM_LANGUAGE });
    await writeFile(path.join(outDir, "storyboard.json"), JSON.stringify(storyboard, null, 2));
  }
  const words = storyboard.scenes.reduce((n, s) => n + s.narration.split(/\s+/).length, 0);
  console.log(`Storyboard: ${storyboard.scenes.length} scenes, ${words} words of narration.`);
  if (storyboardOnly) return console.log(`Saved ${path.join(outDir, "storyboard.json")}`);

  if (!process.env.VOICE_API_KEY || !process.env.VOICE_ID) console.log("No voice configured: the film will be silent, timed at reading pace.");
  if (!mediaEnabled()) console.log("No FAL_KEY: illustrated and video scenes will use plain title cards.");

  let clips = 0;
  const scenes: TimedScene[] = [];
  for (const [i, scene] of storyboard.scenes.entries()) {
    const id = String(i + 1).padStart(2, "0");
    console.log(`Scene ${id}/${storyboard.scenes.length}: ${scene.type}`);
    const timed: TimedScene = { ...scene, seconds: estimateSeconds(scene.narration) };
    if (scene.narration.trim()) {
      const spoken = await speak(scene.narration, path.join(assetDir, `${id}.mp3`));
      if (spoken !== null) {
        timed.audio = `${id}.mp3`;
        timed.seconds = spoken + 0.8; // short breath between scenes
      }
    }
    if (mediaEnabled()) {
      if (scene.type === "video" && clips < maxVideoClips) {
        await makeVideo(scene.videoPrompt, path.join(assetDir, `${id}.mp4`));
        timed.media = `${id}.mp4`;
        clips++;
      } else if (scene.type === "illustrated" || scene.type === "video") {
        const prompt = scene.type === "video" ? scene.videoPrompt : scene.imagePrompt;
        await makeImage(prompt, path.join(assetDir, `${id}.jpg`));
        timed.media = `${id}.jpg`;
      }
    }
    scenes.push(timed);
  }

  const props: FilmProps = { title: storyboard.title, scenes };
  const total = scenes.reduce((s, sc) => s + sc.seconds, 0);
  console.log(`Rendering ${(total / 60).toFixed(1)} minutes of film...`);
  const outFile = path.join(outDir, "film.mp4");
  await renderFilm(props, assetDir, outFile);
  console.log(`Done: ${outFile}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
