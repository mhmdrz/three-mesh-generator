import { ShaderLib } from 'three';
import { MaterialTypes } from '../types.enum';
import { classicNoise2D, classicPerlin3D, noise4D } from './noises';

const phongVert: string = ShaderLib.phong.vertexShader;
const standardVert: string = ShaderLib.standard.vertexShader;

function vertexGenerator(
  top: string,
  main: string,
  materialType: MaterialTypes
): string {
  let vert = '';
  const topPart = 'varying vec3 vViewPosition;\n' + top;
  const mainPart = '#include <fog_vertex>\n' + main;
  switch (materialType) {
    case MaterialTypes.Phong:
      vert = phongVert.replace('varying vec3 vViewPosition;', topPart);
      vert = vert.replace('#include <fog_vertex>', mainPart);
      break;
    case MaterialTypes.Standard:
      vert = standardVert.replace('varying vec3 vViewPosition;', topPart);
      vert = vert.replace('#include <fog_vertex>', mainPart);
  }
  return vert;
}

const staticWithUVTop: string = [
  'varying vec3 vPos;',
  'varying vec2 vUv;',
].join('\n');
const staticWithUVMain: string = [
  'vPos = normalize(position);',
  'vUv = uv;',
].join('\n');

const vertDeformTop: string = [
  'uniform vec2 resolution;',
  'uniform vec2 movement;',
  'uniform float time;',
  'varying vec3 v_position;',
  'varying vec3 v_normal;',
  'varying vec3 vPos;',
  'varying vec2 vUv;',
].join('\n');
const vertDeformMain: string = [
  'vPos = normalize(position);',
  'vUv = uv;',
  'float effect_intensity = 2.0 * movement.x / resolution.x;',
  'vec3 new_position = position + effect_intensity * (0.5 + 0.5 * cos(position.x + 4.0 * time)) * normal;',
  'vec4 mv_position = modelViewMatrix * vec4(new_position, 1.0);',
  'v_position = mv_position.xyz;',
  'v_normal = normalize(normalMatrix * normal);',
  'gl_Position = projectionMatrix * mv_position;',
].join('\n');

const vertDistortion3DTop: string = [
  'varying vec3 vPos;',
  'varying float noise;',
  'uniform float time;',
  'uniform float noiseCoef;',
  'varying vec2 vUv;',
  classicPerlin3D,
  'float turbulence( vec3 p ) {',
  'float w = 100.0;',
  'float t = -.5;',
  'for (float f = 1.0 ; f <= 10.0 ; f++ ){',
  'float power = pow( 2.0, f );',
  't += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );',
  '}',
  'return t;',
  '}',
].join('\n');
const vertDistortion3DMain: string = [
  'vPos = normalize(position);',
  'vUv = uv;',
  'noise = noiseCoef *  -.10 * turbulence( .5 * normal + time );',
  'float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );',
  'float displacement = - 10. * noise + b;',
  'vec3 newPosition = position + normal * displacement;',
  'gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );',
].join('\n');

const vertDistortion4DTop: string = [
  'varying vec3 vPos;',
  'uniform float time;',
  'uniform float amplitude;',
  'uniform float frequency;',
  'varying vec2 vUv;',
  noise4D,
].join('\n');
const vertDistortion4DMain: string = [
  'vPos = normalize(position);',
  'vUv = uv;',
  'vNormal = normalMatrix * normalize(normal);',
  'float distortion = snoise(vec4(normal * frequency, time)) * amplitude;',
  'vec3 newPosition = position + (normal * distortion);',
  'gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);',
].join('\n');

const vertDistortion2DTop: string = [
  'varying vec3 vPos;',
  'uniform float time;',
  'uniform float sphereRadius;',
  'uniform float sphereCoef;',
  'varying float v_elevation;',
  'varying vec3 v_position;',
  'varying vec3 v_normal;',
  'varying vec2 vUv;',
  classicNoise2D,
  'vec3 getDisplacedPosition(vec3 position) {',
  'float shift = sphereCoef * cnoise(vec2(3.0 * cos(atan(position.z, position.x)), 2.0 * time + 3.0 * acos(position.y / sphereRadius)));',
  'return position + normal * shift;',
  '}',
].join('\n');
const vertDistortion2DMain: string = [
  'vPos = normalize(position);',
  'vUv = uv;',
  'vec3 new_position = getDisplacedPosition(position);',
  'vec4 mv_position = modelViewMatrix * vec4(new_position, 1.0);',
  'v_position = mv_position.xyz;',
  'v_elevation = length(new_position);',
  'gl_Position = projectionMatrix * mv_position;',
].join('\n');

export const staticWithUVPhong: string = vertexGenerator(
  staticWithUVTop,
  staticWithUVMain,
  MaterialTypes.Phong
);
export const staticWithUVStandard: string = vertexGenerator(
  staticWithUVTop,
  staticWithUVMain,
  MaterialTypes.Standard
);
export const vertDeformPhong: string = vertexGenerator(
  vertDeformTop,
  vertDeformMain,
  MaterialTypes.Phong
);
export const vertDeformStandard: string = vertexGenerator(
  vertDeformTop,
  vertDeformMain,
  MaterialTypes.Standard
);
export const vertDistortion3DPhong: string = vertexGenerator(
  vertDistortion3DTop,
  vertDistortion3DMain,
  MaterialTypes.Phong
);
export const vertDistortion3DStandard: string = vertexGenerator(
  vertDistortion3DTop,
  vertDistortion3DMain,
  MaterialTypes.Standard
);
export const vertDistortion4DPhong: string = vertexGenerator(
  vertDistortion4DTop,
  vertDistortion4DMain,
  MaterialTypes.Phong
);
export const vertDistortion4DStandard: string = vertexGenerator(
  vertDistortion4DTop,
  vertDistortion4DMain,
  MaterialTypes.Standard
);
export const vertDistortion2DPhong: string = vertexGenerator(
  vertDistortion2DTop,
  vertDistortion2DMain,
  MaterialTypes.Phong
);
export const vertDistortion2DStandard: string = vertexGenerator(
  vertDistortion2DTop,
  vertDistortion2DMain,
  MaterialTypes.Standard
);
