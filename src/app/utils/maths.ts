export function mod(n: number, m: number): number {
  return ((m % n) + n) % n;
}

export function toRadians(angle: number): number {
  return angle * (Math.PI / 180);
}
