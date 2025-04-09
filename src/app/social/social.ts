import {
  Color,
  ShaderLib,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three';
import {
  staticColorFragmentPhong,
  staticColorFragmentStandard,
  staticGradientFragmentStandard,
} from '../shaders/fragment';
import { staticWithUVPhong, staticWithUVStandard } from '../shaders/vertex';
import { getRandomInt } from '../utils/randoms';

const globalUniforms = {
  staticColor: {
    value: new Color(0x750000),
  },
};

export function socialPhongMaterialGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.phong.uniforms,
    globalUniforms,
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: staticWithUVPhong,
    fragmentShader: staticColorFragmentPhong,
    lights: true,
    // wireframe: true,
  });

  material.uniforms['shininess'].value = 20;

  return material;
}

export function socialStandardMaterialGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    globalUniforms,
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: staticWithUVStandard,
    fragmentShader: staticWithUVStandard,
    lights: true,
  });

  material.uniforms['roughness'].value = 0;
  material.uniforms['metalness'].value = 0.5;

  return material;
}

export function socialBgGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    {
      staticColor: {
        value: new Color('#000000'),
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

export function socialBgGradientGenerator(): ShaderMaterial {
  const colors = ['#485563', '#29323c'];
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
        value: 60,
      },
      gradientOrigin: {
        value: new Vector2(0.6, 0.1),
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

export function socialConvexPointsGenerator(): Vector3[] {
  let points = [];
  const radius = 20;
  const period = 30;
  const numberOfPoints = 50;

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

export function socialStandardMaterialCover(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    {
      staticColor: {
        value: new Color(0xc10005),
      },
    },
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: staticWithUVStandard,
    fragmentShader: staticColorFragmentStandard,
    lights: true,
  });

  material.uniforms['roughness'].value = 0;
  material.uniforms['metalness'].value = 0.5;

  return material;
}

export function socialStandardMaterialProfile(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    {
      staticColor: {
        value: new Color(0x4d4d4d),
      },
    },
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: staticWithUVStandard,
    fragmentShader: staticColorFragmentStandard,
    lights: true,
  });

  material.uniforms['roughness'].value = 0;
  material.uniforms['metalness'].value = 0.5;

  return material;
}
