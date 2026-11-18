import assert from "node:assert/strict";
import { test } from "node:test";
import { Storyboard, estimateSeconds } from "../src/schema.js";
import { orbit, pendulumAngle, projectile, spring } from "../src/video/sim.js";
import { readFileSync } from "node:fs";

test("small-angle pendulum returns to its start after one period", () => {
  const L = 0.8;
  const T = 2 * Math.PI * Math.sqrt(L / 9.81);
  const start = (5 * Math.PI) / 180;
  assert.ok(Math.abs(pendulumAngle(T, 5, L) - start) < 0.01 * start + 1e-3);
  assert.ok(Math.abs(pendulumAngle(T / 2, 5, L) + start) < 0.02 * start + 1e-3);
});

test("large-angle pendulum swings slower than the small-angle formula", () => {
  const T = 2 * Math.PI * Math.sqrt(0.8 / 9.81);
  // After one small-angle period a 120 degree swing has not yet come back.
  assert.ok(pendulumAngle(T, 120, 0.8) < (110 * Math.PI) / 180);
});

test("projectile at 45 degrees has range v^2/g and lands on the ground", () => {
  const v = 14;
  const p = projectile(0.5, 45, 1);
  assert.ok(Math.abs(p.range - (v * v) / 9.81) < 1e-9);
  assert.ok(Math.abs(p.apex - p.range / 4) < 1e-9);
  const flight = (2 * v * Math.SQRT1_2) / 9.81;
  assert.ok(projectile(flight, 45, 1).y < 1e-9);
});

test("orbit stays on its ellipse and is periodic", () => {
  const e = 0.5;
  for (const t of [0, 1.3, 2.9, 4.4]) {
    const { x, y } = orbit(t, e, 6);
    // Ellipse centred at (-e, 0) with semi-axes 1 and sqrt(1 - e^2).
    assert.ok(Math.abs((x + e) ** 2 + y ** 2 / (1 - e * e) - 1) < 1e-9);
  }
  assert.ok(Math.abs(orbit(0, e, 6).x - (1 - e)) < 1e-9); // perihelion
  assert.ok(Math.abs(orbit(7.5, e, 6).x - orbit(1.5, e, 6).x) < 1e-9);
});

test("damped spring starts at 1, at rest, and decays", () => {
  assert.equal(spring(0, 0.3, 0.6), 1);
  assert.ok(Math.abs(spring(1e-4, 0.3, 0.6) - 1) < 1e-6);
  assert.ok(Math.abs(spring(20, 0.3, 0.6)) < 0.01);
});

test("example storyboard matches the schema", () => {
  const sb = Storyboard.parse(JSON.parse(readFileSync("examples/pendulum.storyboard.json", "utf8")));
  assert.equal(sb.scenes.length, 9);
  assert.ok(estimateSeconds(sb.scenes[0].narration) > 4);
});
