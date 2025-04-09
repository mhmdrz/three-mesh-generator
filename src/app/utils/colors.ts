import chroma from 'chroma-js';
import { getRandomFloat } from './randoms';

export function colorGenerator(): string {
  const chars = '0123456789abcdef';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += chars.charAt(Math.floor(Math.random() * 16));
  }
  return hex;
}

export function darkColorGenerator(): string {
  let color = '#';
  for (let i = 0; i < 3; i++)
    color += (
      '0' + Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString(16)
    ).slice(-2);
  return color;
}

export function evenMoreDarkColorGenerator(): string {
  return chroma(darkColorGenerator()).darken(getRandomFloat(0.1, 3)).hex();
}

export function basicGradientGenerator(): Array<string> {
  const base = darkColorGenerator();
  const random = Math.random();
  let array = [base];

  if (random > 0.5) {
    array.push(
      chroma(darkColorGenerator()).darken(getRandomFloat(0.1, 3)).hex()
    );
  } else {
    array.push(
      chroma(darkColorGenerator()).brighten(getRandomFloat(0.1, 3)).hex()
    );
  }
  return array;
}
