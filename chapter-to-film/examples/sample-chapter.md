# Chapter 3. The Harmonic Oscillator

## 3.1 Hooke's observation

In 1678 Robert Hooke published the law that bears his name: *ut tensio, sic vis* — as the extension, so the force. A spring stretched by a distance x from its rest position pulls back with a force proportional to x. Hooke had announced the result two years earlier as a Latin anagram, to secure priority without revealing it. The law is not exact for any real material, but for small displacements it holds for springs, for the bending of beams, and for the bonds between atoms, which is why the system it describes is the most widely used model in physics.

## 3.2 The equation of motion

Consider a mass m on a frictionless surface, attached to a spring of stiffness k. Newton's second law gives

m d²x/dt² = −k x.

Dividing by m and writing ω₀² = k/m,

d²x/dt² + ω₀² x = 0.

We look for a solution of the form x(t) = A cos(ω₀ t + φ). Differentiating twice gives −ω₀² A cos(ω₀ t + φ), which satisfies the equation identically. The two constants A and φ are fixed by the initial position and velocity. The period is

T = 2π/ω₀ = 2π √(m/k),

and it does not depend on the amplitude: a large oscillation and a small one take the same time. This property, isochronism, is what makes the oscillator a clock.

## 3.3 Energy

Multiply the equation of motion by the velocity dx/dt and integrate with respect to time. The result is

½ m (dx/dt)² + ½ k x² = E,

a constant. Kinetic and potential energy are exchanged twice in each period, and their sum is fixed by the amplitude: E = ½ k A².

## 3.4 Damping

No real oscillator runs forever. If the mass moves through a fluid, it feels a drag force proportional to its velocity, −b dx/dt, and the equation becomes

d²x/dt² + 2γ dx/dt + ω₀² x = 0, with γ = b/2m.

For light damping, γ < ω₀, the solution is

x(t) = A e^(−γt) cos(ω_d t + φ), where ω_d = √(ω₀² − γ²).

The mass still oscillates, slightly more slowly than before, inside an envelope that decays exponentially. The energy falls as e^(−2γt). When γ reaches ω₀ the oscillation disappears altogether and the mass returns to rest without overshooting: critical damping, the condition engineers aim for in a door closer or a car's suspension.
