import { Vector3 } from 'three';
import { getRandomInt } from '../utils/randoms';

export function convexPointGenerator(): Vector3[] {
  let points = [];
  const radius = 20;
  // const period = getRandomInt(5, 60);
  const period = 40;
  const numberOfPoints = getRandomInt(10, 50);

  for (let i = 0; i <= numberOfPoints; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.abs(Math.random()) * period + radius;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const x = r * sinPhi * cosTheta;
    const y = r * sinPhi * sinTheta;
    const z = r * cosPhi;
    points.push(new Vector3(x, y, z));
  }

  return points;
}
