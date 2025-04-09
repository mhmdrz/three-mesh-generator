import chroma from 'chroma-js';
import {
  Color,
  ShaderLib,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
} from 'three';
import {
  staticColorFragmentStandard,
  staticGradientFragmentStandard,
} from '../shaders/fragment';
import {
  darkColorGenerator,
  evenMoreDarkColorGenerator,
} from '../utils/colors';
import { getRandomFloat } from '../utils/randoms';

function bgColorsGenerator(): string[] {
  const random = Math.random();
  const base = darkColorGenerator();
  let colors = [base];

  if (random > 0.5) {
    colors.push(chroma(base).darken(getRandomFloat(0.1, 3)).hex());
  } else {
    colors.push(chroma(base).brighten(getRandomFloat(0.1, 3)).hex());
  }

  return colors;
}

export function staticBgColorGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    {
      staticColor: {
        value: new Color(evenMoreDarkColorGenerator()),
      },
    },
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: ShaderLib.standard.vertexShader,
    fragmentShader: staticColorFragmentStandard,
    lights: true,
  });

  return material;
}

export function staticBgGradientGenerator(): ShaderMaterial {
  const colors = bgColorsGenerator();
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    {
      resolution: {
        value: new Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(window.devicePixelRatio),
      },
      startColor: {
        value: new Color(colors[0]),
      },
      endColor: {
        value: new Color(colors[1]),
      },
      gradientAngle: {
        value: getRandomFloat(1, 360),
      },
      gradientOrigin: {
        value: new Vector2(getRandomFloat(0.3, 1), getRandomFloat(0.3, 1)),
      },
    },
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: ShaderLib.standard.vertexShader,
    fragmentShader: staticGradientFragmentStandard,
    lights: true,
  });

  return material;
}
