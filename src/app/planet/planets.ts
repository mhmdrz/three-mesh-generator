import { ShaderLib, ShaderMaterial, UniformsUtils } from 'three';
import { simplex3D } from '../shaders/noises';

const planetUniforms = {
  height: {
    value: 1.0,
  },
  freq: {
    value: 1.0,
  },
};

const vertexTop = `varying vec3 vViewPosition;
uniform float height;
uniform float freq;

varying vec4 vPosition;
varying vec4 vNorm;
varying float elevation;

${simplex3D}`;

const vertexMain = `#include <fog_vertex>
vPosition = modelMatrix * vec4(position, 1.0);
vNorm = modelMatrix * vec4(normal, 1.0);

elevation = height * 1.0 * (snoise(freq * 0.01 * vec3(vPosition)));
elevation += height * 0.5 * (snoise(freq * 0.02 * vec3(vPosition)));
elevation += height * 0.25 * (snoise(freq * 0.04 * vec3(vPosition)));
elevation += height * 0.125 * (snoise(freq * 0.08 * vec3(vPosition)));
elevation += height * 0.0625 * (snoise(freq * 0.160 * vec3(vPosition)));
elevation += height * 0.03125 * (snoise(freq * 0.320 * vec3(vPosition)));
elevation += height * 0.0156 * (snoise(freq * 0.640 * vec3(vPosition)));

vPosition = vPosition + vNorm * 0.2 * elevation;

elevation = elevation*-1.0;

gl_Position = projectionMatrix * viewMatrix * vPosition;`;

let vertex = ShaderLib.standard.vertexShader.replace(
  'varying vec3 vViewPosition;',
  vertexTop
);
vertex = vertex.replace('#include <fog_vertex>', vertexMain);

export function planetMaterialGenerator(): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    planetUniforms,
  ]);
  const material = new ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: ShaderLib.standard.fragmentShader,
    vertexShader: vertex,
    lights: true,
  });

  return material;
}
