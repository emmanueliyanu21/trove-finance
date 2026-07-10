export type TrendRange = "1D" | "1W" | "1M" | "ALL";

export interface TrendPoint {
  x: number;
  y: number;
}

const POINTS_BY_RANGE: Record<TrendRange, number> = {
  "1D": 24,
  "1W": 28,
  "1M": 30,
  ALL: 36,
};

const FREQUENCY_BY_RANGE: Record<TrendRange, number> = {
  "1D": 3,
  "1W": 2.2,
  "1M": 1.6,
  ALL: 1.1,
};

export function buildIllustrativeTrend(start: number, end: number, range: TrendRange): TrendPoint[] {
  const points = POINTS_BY_RANGE[range];
  const frequency = FREQUENCY_BY_RANGE[range];
  const amplitude = Math.abs(end - start) * 0.12 + Math.max(start, end) * 0.01;

  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const base = start + (end - start) * t;
    const wobble =
      Math.sin(t * Math.PI * frequency) * amplitude * (1 - t * 0.4) +
      Math.sin(t * Math.PI * frequency * 2.7 + 1.3) * amplitude * 0.3;
    return { x: i, y: Math.max(0, base + wobble) };
  });
}
