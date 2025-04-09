import {
  Color,
  ShaderLib,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three';
import {
  moltenFragmentPhong,
  randomColorWithNoiseFragmentPhong,
  staticColorFragmentPhong,
} from '../shaders/fragment';
import { classicPerlin3D, noise4D } from '../shaders/noises';
import {
  staticWithUVPhong,
  vertDeformPhong,
  vertDistortion2DPhong,
  vertDistortion3DPhong,
  vertDistortion4DPhong,
} from '../shaders/vertex';
import { colorGenerator } from '../utils/colors';
import { getRandomFloat, getRandomInt } from '../utils/randoms';

const globalUniforms = {
  time: {
    value: 0.0,
  },
  resolution: {
    value: new Vector2(window.innerWidth, window.innerHeight).multiplyScalar(
      window.devicePixelRatio
    ),
  },
  rdNoiseCoefRed: {
    value: getRandomFloat(0.5, 1),
  },
  rdNoiseCoefGreen: {
    value: getRandomFloat(0.5, 1),
  },
  rdNoiseCoefBlue: {
    value: getRandomFloat(0.5, 1),
  },
  rdNoiseOpRed: {
    value: getRandomFloat(0.0, 0.7),
  },
  rdNoiseOpGreen: {
    value: getRandomFloat(0.0, 0.7),
  },
  rdNoiseOpBlue: {
    value: getRandomFloat(0.0, 0.7),
  },
  rdNoiseScale: {
    value: new Vector2(10, 10),
  },
  movement: {
    value: new Vector2(
      getRandomInt(500, 3000),
      window.innerHeight
    ).multiplyScalar(window.devicePixelRatio),
  },
  noiseCoef: {
    value: getRandomFloat(10, 30),
  },
  amplitude: {
    value: getRandomFloat(2, 11),
  },
  frequency: {
    value: getRandomFloat(20, 51),
  },
  sphereRadius: {
    value: 50,
  },
  sphereCoef: {
    value: getRandomFloat(2.0, 20.0),
  },
  staticColor: {
    value: new Color(0x558022),
  },
  // moltenUvScale: {
  //   value: new Vector2(1, 1),
  // },
  // moltenPermutations: {
  //   value: 50,
  // },
  // moltenIterations: {
  //   value: 5,
  // },
  // moltenColor1: {
  //   value: new Color(colorGenerator()),
  // },
  // moltenColor2: {
  //   value: new Color(colorGenerator()),
  // },
  // moltenColor3: {
  //   value: new Color(colorGenerator()),
  // },
  // moltenBrightness: {
  //   value: 3,
  // },
  // moltenSpeed: {
  //   value: 1,
  // },
};

function fragGenerator(top: string, main: string): string {
  let frag = '';
  const topPart = '#include <clipping_planes_pars_fragment>\n' + top;
  frag = ShaderLib.phong.fragmentShader.replace(
    '#include <clipping_planes_pars_fragment>',
    topPart
  );
  frag = frag.replace('vec4 diffuseColor = vec4( diffuse, opacity );', main);
  return frag;
}

function vertexGenerator(top: string, main: string): string {
  let vert = '';
  const topPart = 'varying vec3 vViewPosition;\n' + top;
  const mainPart = '#include <fog_vertex>\n' + main;
  vert = ShaderLib.phong.vertexShader.replace(
    'varying vec3 vViewPosition;',
    topPart
  );
  vert = vert.replace('#include <fog_vertex>', mainPart);
  return vert;
}

/* VERTEX */
// TODO: apply to all vertecies
const staticVertTop = ['varying vec3 vPos;', 'varying vec2 vUv;'].join('\n');
const staticVertMain = ['vPos = normalize(position);', 'vUv = uv;'].join('\n');
const staticVert = vertexGenerator(staticVertTop, staticVertMain);

/* FRAGMENT */
const randomWithNoiseTop = [
  'uniform float time;',
  'uniform float rdNoiseCoefRed;',
  'uniform float rdNoiseCoefGreen;',
  'uniform float rdNoiseCoefBlue;',
  'uniform float rdNoiseOpRed;',
  'uniform float rdNoiseOpGreen;',
  'uniform float rdNoiseOpBlue;',
  'uniform vec2 rdNoiseScale;',
  'varying vec3 vPos;',
  classicPerlin3D,
].join('\n');
const randomWithNoiseMain = [
  'float posX = vPos.x * 0.15;',
  'float posY = vPos.y * 0.15;',
  'float r = abs(sin( (posX + time * 0.125 ) * 4.0 )) * 0.2 + rdNoiseOpRed;',
  'float g = abs(sin( (posY + time * 0.245 ) * 2.0 )) * 0.2 + rdNoiseOpGreen;',
  'float b = abs(sin( (posY - time * 0.333 ) * 2.0 )) * 0.2 + rdNoiseOpBlue;',
  'r += cnoise(vec3(posX*4.0,posY*4.0, time)) * rdNoiseCoefRed;',
  'g += cnoise(vec3(posX*8.0,posY*5.0, time*2.0)) * rdNoiseCoefGreen;',
  'b += cnoise(vec3(posX*12.0,posY*6.0, time*3.0)) * rdNoiseCoefBlue;',
  'vec3 col = vec3(r, g, b);',
  'vec4 diffuseColor = vec4(col, opacity);',
].join('\n');
const randomWithNoise = fragGenerator(randomWithNoiseTop, randomWithNoiseMain);

export function testMaterialGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.phong.uniforms,
    globalUniforms,
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertDistortion2DPhong,
    fragmentShader: staticColorFragmentPhong,
    lights: true,
  });

  material.uniforms['shininess'].value = 20;

  console.log(material);

  return material;
}

export function testStandardMaterialGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    globalUniforms,
  ]);

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: staticVert,
    fragmentShader: randomWithNoise,
    lights: true,
  });

  material.uniforms['roughness'].value = 0;
  material.uniforms['metalness'].value = 0.5;

  console.log(material);

  return material;
}
