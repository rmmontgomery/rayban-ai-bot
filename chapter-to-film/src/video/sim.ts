// Physics for the simulation scenes. Every function is a pure function of time,
// so any frame of the film can be rendered on its own.

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const G = 9.81;

/** Pendulum angle (radians) at time t, integrating the full nonlinear equation. */
export function pendulumAngle(t: number, startDeg: number, length: number) {
  let theta = (clamp(startDeg, -170, 170) * Math.PI) / 180;
  let omega = 0;
  const L = clamp(length, 0.3, 1);
  const dt = 1 / 600;
  // Semi-implicit Euler keeps the energy bounded over long scenes.
  for (let s = 0; s < t; s += dt) {
    omega -= (G / L) * Math.sin(theta) * dt;
    theta += omega * dt;
  }
  return theta;
}

/** Projectile position at time t; x and y in metres, y up. Loops after landing. */
export function projectile(t: number, angleDeg: number, speed: number) {
  const a = (clamp(angleDeg, 5, 85) * Math.PI) / 180;
  const v = clamp(speed, 0.3, 1) * 14;
  const flight = (2 * v * Math.sin(a)) / G;
  const tt = t % (flight + 1); // pause one second on the ground, then relaunch
  const tau = Math.min(tt, flight);
  return {
    x: v * Math.cos(a) * tau,
    y: Math.max(0, v * Math.sin(a) * tau - 0.5 * G * tau * tau),
    range: v * Math.cos(a) * flight,
    apex: (v * Math.sin(a)) ** 2 / (2 * G),
  };
}

/** Position on a Kepler ellipse (focus at origin, semi-major axis 1) at time t. */
export function orbit(t: number, eccentricity: number, period: number) {
  const e = clamp(eccentricity, 0, 0.8);
  const M = (2 * Math.PI * t) / period; // mean anomaly
  let E = M; // solve Kepler's equation M = E - e sin E by Newton's method
  for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return { x: Math.cos(E) - e, y: Math.sqrt(1 - e * e) * Math.sin(E) };
}

/** Wave height at (x, y) from one or two point sources; x, y in the unit square. */
export function wave(x: number, y: number, t: number, sources: number, wavelength: number) {
  const lambda = clamp(wavelength, 0.2, 1) * 0.25;
  const k = (2 * Math.PI) / lambda;
  const w = 2 * Math.PI * 0.6;
  const centres = sources >= 2 ? [[0.5, 0.38], [0.5, 0.62]] : [[0.5, 0.5]];
  let h = 0;
  for (const [cx, cy] of centres) h += Math.sin(k * Math.hypot(x - cx, y - cy) - w * t);
  return h / centres.length;
}

/** Displacement (-1..1) of a damped spring released from 1 at t = 0. */
export function spring(t: number, damping: number, stiffness: number) {
  const w0 = 2 + clamp(stiffness, 0.2, 1) * 6;
  const zeta = clamp(damping, 0, 1) * 0.5;
  const wd = w0 * Math.sqrt(1 - zeta * zeta);
  return Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
}
