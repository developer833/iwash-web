/**
 * A card hanging on a stretchy string, attached at one end.
 *
 * Position-based dynamics (XPBD) with a small compliance on every distance
 * constraint, so the string really stretches when pulled and recoils with a
 * swing when released. The card is a rigid three-point body (peak, middle,
 * bottom): the string is tied to the peak and the weight sits below it, so
 * it swings, twists and settles like a real card on a string.
 *
 * Units are CSS pixels and seconds, y grows downward. No DOM in here.
 */

type Constraint = {
  a: number;
  b: number;
  rest: number;
  /** Compliance (1 / stiffness). 0 is perfectly rigid. */
  alpha: number;
  /** Only resists stretching, lets the string go slack. */
  oneSided: boolean;
};

export type HangingCardOptions = {
  anchorX: number;
  anchorY: number;
  /** Number of string segments. */
  segments?: number;
  /** Rest length of each segment. */
  segmentLength?: number;
  /** Card height; the string is tied to its top point. */
  cardHeight?: number;
  gravity?: number;
};

const SUBSTEPS = 10;
const ITERATIONS = 2;
const FIXED_FRAME = 1 / 60;

export class HangingCard {
  readonly anchorX: number;
  readonly anchorY: number;
  readonly segments: number;
  readonly segmentLength: number;
  readonly cardHeight: number;
  readonly gravity: number;

  /** Point positions: 0..segments is the string (the last is the card's peak), then card middle, card bottom. */
  x: Float64Array;
  y: Float64Array;
  private px: Float64Array;
  private py: Float64Array;
  private w: Float64Array;
  private cons: Constraint[] = [];

  readonly peak: number;
  readonly mid: number;
  readonly bottom: number;

  /** Where the pointer holds the card's middle, or null when free. */
  private hold: { x: number; y: number } | null = null;
  private time = 0;
  /** Gentle breeze, 0 turns it off. */
  breeze = 1;

  constructor(opts: HangingCardOptions) {
    this.anchorX = opts.anchorX;
    this.anchorY = opts.anchorY;
    this.segments = opts.segments ?? 8;
    this.segmentLength = opts.segmentLength ?? 20;
    this.cardHeight = opts.cardHeight ?? 240;
    this.gravity = opts.gravity ?? 2100;

    const n = this.segments + 3;
    this.peak = this.segments;
    this.mid = this.segments + 1;
    this.bottom = this.segments + 2;

    this.x = new Float64Array(n);
    this.y = new Float64Array(n);
    this.px = new Float64Array(n);
    this.py = new Float64Array(n);
    this.w = new Float64Array(n);

    // Slightly off the vertical so it swings in when the page loads.
    const lean = 0.35;
    const dirX = Math.sin(lean);
    const dirY = Math.cos(lean);
    for (let i = 0; i < n; i++) {
      let dist: number;
      if (i <= this.peak) dist = i * this.segmentLength;
      else if (i === this.mid) dist = this.peak * this.segmentLength + this.cardHeight / 2;
      else dist = this.peak * this.segmentLength + this.cardHeight;
      this.x[i] = this.px[i] = this.anchorX + dirX * dist;
      this.y[i] = this.py[i] = this.anchorY + dirY * dist;
    }

    // Inverse masses: light string, heavier card.
    for (let i = 0; i < this.peak; i++) this.w[i] = 1 / 0.25;
    this.w[0] = 0;
    this.w[this.peak] = 1 / 0.6;
    this.w[this.mid] = 1 / 5;
    this.w[this.bottom] = 1 / 3;

    const stringAlpha = 1 / 24000;
    for (let i = 0; i < this.segments; i++) {
      this.cons.push({ a: i, b: i + 1, rest: this.segmentLength, alpha: stringAlpha, oneSided: true });
    }
    const half = this.cardHeight / 2;
    this.cons.push({ a: this.peak, b: this.mid, rest: half, alpha: 0, oneSided: false });
    this.cons.push({ a: this.mid, b: this.bottom, rest: half, alpha: 0, oneSided: false });
    this.cons.push({ a: this.peak, b: this.bottom, rest: this.cardHeight, alpha: 0, oneSided: false });
  }

  /** Natural length from the anchor to the card's middle when hanging straight. */
  get reach() {
    return this.peak * this.segmentLength + this.cardHeight / 2;
  }

  /** How far past its natural length the string is stretched, 0 at rest. */
  get stretch() {
    let len = 0;
    for (let i = 0; i < this.segments; i++) {
      len += Math.hypot(this.x[i + 1] - this.x[i], this.y[i + 1] - this.y[i]);
    }
    return Math.max(0, len / (this.segments * this.segmentLength) - 1);
  }

  /** Card angle in radians: 0 when hanging straight down. */
  get angle() {
    return Math.atan2(this.x[this.peak] - this.x[this.bottom], this.y[this.bottom] - this.y[this.peak]);
  }

  get isHeld() {
    return this.hold !== null;
  }

  /** Hold the card's middle at a point. The point is eased past a limit so it feels like a rubber band. */
  holdAt(x: number, y: number) {
    const dx = x - this.anchorX;
    const dy = y - this.anchorY;
    const d = Math.hypot(dx, dy) || 1;
    const soft = this.reach * 1.05;
    const hard = this.reach * 1.3;
    let target = d;
    if (d > soft) target = Math.min(hard, soft + (d - soft) * 0.45);
    this.hold = { x: this.anchorX + (dx / d) * target, y: this.anchorY + (dy / d) * target };
  }

  release() {
    this.hold = null;
  }

  /** Give the card a push, in px/s. */
  nudge(vx: number, vy: number) {
    for (let i = 1; i < this.x.length; i++) {
      this.px[i] -= (vx * FIXED_FRAME) / SUBSTEPS;
      this.py[i] -= (vy * FIXED_FRAME) / SUBSTEPS;
    }
  }

  /** Advance by `dt` seconds (any size; it is split into fixed frames). */
  advance(dt: number, accelY = 0) {
    let left = Math.min(dt, 0.05);
    while (left > 1e-6) {
      const step = Math.min(left, FIXED_FRAME);
      this.frame(step, accelY);
      left -= step;
    }
  }

  private frame(dt: number, accelY: number) {
    const h = dt / SUBSTEPS;
    for (let s = 0; s < SUBSTEPS; s++) this.substep(h, accelY);
  }

  private substep(h: number, accelY: number) {
    const n = this.x.length;
    this.time += h;
    const g = this.gravity + accelY;
    const breeze = this.breeze * (38 * Math.sin(this.time * 0.9) + 22 * Math.sin(this.time * 2.3 + 1.2));

    // Stretching the string soaks up energy: the more it is stretched, the more it is damped,
    // so letting go of a full pull snaps back and settles instead of whipping around.
    const strain = this.stretch;
    for (let i = 0; i < n; i++) {
      if (this.w[i] === 0) continue;
      let vx = (this.x[i] - this.px[i]) / h;
      let vy = (this.y[i] - this.py[i]) / h;
      // Air drag, stronger on the light string so it does not whip.
      const drag = Math.exp(-((i < this.peak ? 2.6 : 0.55) + 9 * strain) * h);
      vx *= drag;
      vy *= drag;
      vx += breeze * h * (i >= this.peak ? 1 : 0.4);
      vy += g * h;
      // Tame runaway speeds after a hard release.
      const speed = Math.hypot(vx, vy);
      if (speed > 1800) {
        vx *= 1800 / speed;
        vy *= 1800 / speed;
      }
      this.px[i] = this.x[i];
      this.py[i] = this.y[i];
      this.x[i] += vx * h;
      this.y[i] += vy * h;
    }

    this.x[0] = this.anchorX;
    this.y[0] = this.anchorY;

    const lambdas = new Float64Array(this.cons.length + 1);
    const h2 = h * h;
    for (let it = 0; it < ITERATIONS; it++) {
      for (let c = 0; c < this.cons.length; c++) {
        const k = this.cons[c];
        const dx = this.x[k.b] - this.x[k.a];
        const dy = this.y[k.b] - this.y[k.a];
        const d = Math.hypot(dx, dy) || 1e-9;
        const C = d - k.rest;
        if (k.oneSided && C < 0) {
          lambdas[c] = 0;
          continue;
        }
        const wa = this.w[k.a];
        const wb = this.w[k.b];
        const at = k.alpha / h2;
        const dl = (-C - at * lambdas[c]) / (wa + wb + at);
        lambdas[c] += dl;
        const nx = dx / d;
        const ny = dy / d;
        this.x[k.a] -= wa * dl * nx;
        this.y[k.a] -= wa * dl * ny;
        this.x[k.b] += wb * dl * nx;
        this.y[k.b] += wb * dl * ny;
      }

      if (this.hold) {
        // Pull the card's middle toward the pointer with a stiff but soft spring.
        const i = this.mid;
        const dx = this.x[i] - this.hold.x;
        const dy = this.y[i] - this.hold.y;
        const d = Math.hypot(dx, dy) || 1e-9;
        const at = 1 / 90000 / h2;
        const dl = (-d - at * lambdas[lambdas.length - 1]) / (this.w[i] + at);
        lambdas[lambdas.length - 1] += dl;
        this.x[i] += this.w[i] * dl * (dx / d);
        this.y[i] += this.w[i] * dl * (dy / d);
      }
    }
  }
}
