import { writeFile } from "node:fs/promises";
import { fal } from "@fal-ai/client";

const download = async (url: string, file: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download ${url}: ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
};

export const mediaEnabled = () => Boolean(process.env.FAL_KEY);

/** Generate a 16:9 still image. fal reads FAL_KEY from the environment. */
export async function makeImage(prompt: string, file: string) {
  const model = process.env.FAL_IMAGE_MODEL || "fal-ai/flux/dev";
  const result = await fal.subscribe(model, { input: { prompt, image_size: "landscape_16_9" } });
  const url = (result.data as { images?: { url: string }[] }).images?.[0]?.url;
  if (!url) throw new Error(`${model} returned no image.`);
  await download(url, file);
}

/** Generate a short video clip. */
export async function makeVideo(prompt: string, file: string) {
  const model = process.env.FAL_VIDEO_MODEL || "fal-ai/kling-video/v2.1/standard/text-to-video";
  const result = await fal.subscribe(model, { input: { prompt, aspect_ratio: "16:9", duration: "5" } });
  const url = (result.data as { video?: { url: string } }).video?.url;
  if (!url) throw new Error(`${model} returned no video.`);
  await download(url, file);
}
