import { classicPerlin3D, simplex } from './noises';

export const randomColorTop: string = [
  'uniform float time;',
  'uniform vec2 resolution;',
  'uniform float colorCoef;',
  'uniform float lightnessCoef;',
  'uniform vec3 thirdCoef;',
  'vec3 randomColor(in vec2 fragCoord)',
  '{',
  'vec2 uv = fragCoord/resolution.xy;',
  'vec3 col = colorCoef + lightnessCoef*cos(time+uv.xyx+thirdCoef);',
  'return col;',
  '}',
].join('\n');
export const randomColorMain: string = [
  'vec3 col = randomColor(gl_FragCoord.xy);',
  'vec4 diffuseColor = vec4(col, opacity);',
].join('\n');

export const randomColorWithNoiseTop: string = [
  'uniform float time;',
  'uniform float rdNoiseCoefRed;',
  'uniform float rdNoiseCoefGreen;',
  'uniform float rdNoiseCoefBlue;',
  'uniform float rdNoiseOpRed;',
  'uniform float rdNoiseOpGreen;',
  'uniform float rdNoiseOpBlue;',
  'varying vec3 vPos;',
  classicPerlin3D,
].join('\n');
export const randomColorWithNoiseMain: string = [
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

export const staticColorTop: string = ['uniform vec3 staticColor;'].join('\n');
export const staticColorMain: string = [
  'vec3 col = staticColor;',
  'vec4 diffuseColor = vec4(col, opacity);',
].join('\n');

export const staticGradientTop: string = [
  'uniform vec2 resolution;',
  'uniform vec3 startColor;',
  'uniform vec3 endColor;',
  'uniform float gradientAngle;',
  'uniform vec2 gradientOrigin;',
].join('\n');
export const staticGradientMain: string = [
  'vec2 uv = gl_FragCoord.xy/resolution.xy;',
  'float currentAngle = -gradientAngle;',
  'vec2 origin = gradientOrigin;',
  'uv -= origin;',
  'float angle = radians(90.0) - radians(currentAngle) + atan(uv.y, uv.x);',
  'float len = length(uv);',
  'uv = vec2(cos(angle) * len, sin(angle) * len) + origin;',
  'vec3 col = mix(startColor, endColor, smoothstep(0.0, 1.0, uv.x));',
  'vec4 diffuseColor = vec4(col, opacity);',
].join('\n');

export const moltenTop: string = [
  '#define F4 0.309016994374947451',
  'uniform float time;',
  'uniform float moltenPermutations;',
  'uniform float moltenIterations;',
  'uniform vec2 moltenUvScale;',
  'uniform vec3 moltenColor1;',
  'uniform vec3 moltenColor2;',
  'uniform vec3 moltenColor3;',
  'uniform float moltenBrightness;',
  'uniform float moltenSpeed;',
  'varying vec2 vUv;',
  simplex,
  'float hash(float n) {',
  'return fract(sin(n)*93942.234);',
  '}',
  'float clampedNoise( vec4 p ) {',
  'return clamp( 0.4 * 0.2 + snoise( p ), 0.0, 1.0 );',
  '}',
  'mat2 m = mat2(0.6,0.8,-0.8,0.6);',
  'float fbm(vec4 p) {',
  'float f = 0.0;',
  'f += 0.5 * clampedNoise(vec4( p.xy * m, p.zw * m ));',
  'p *= 2.02;',
  'f += 0.25 * clampedNoise(vec4( p.xy * m, p.zw * m ));',
  'p *= 2.01;',
  'f += 0.125 * clampedNoise(vec4( p.xy * m, p.zw * m ));',
  'p *= 2.03;',
  'f += 0.0625 * clampedNoise(vec4( p.xy * m, p.zw * m ));',
  'f /= 0.9375;',
  'return f;',
  '}',
].join('\n');
export const moltenMain: string = [
  'vec2 p = vUv * moltenUvScale;',
  'float elapsed = time * moltenSpeed * 0.01;',
  'float s = vUv.x * moltenUvScale.x;',
  'float t = vUv.y * moltenUvScale.y;',
  'float multiplier = moltenIterations / ( 2.0 * PI );',
  'float nx = cos( s * 2.0 * PI ) * multiplier;',
  'float ny = cos( t * 2.0 * PI ) * multiplier;',
  'float nz = sin( s * 2.0 * PI ) * multiplier;',
  'float nw = sin( t * 2.0 * PI ) * multiplier;',
  'vec4 tile4d = vec4( nx, ny, nz, nw );',
  'vec2 a = vec2(',
  'fbm( tile4d + elapsed * 1.1 ),',
  'fbm( tile4d - elapsed * 1.3 )',
  ');',
  'vec2 b = vec2(',
  'fbm( tile4d + elapsed * 1.2 + a.x * 2.0 ),',
  'fbm( tile4d - elapsed * 1.2 + a.y * 3.0 )',
  ');',
  'float surf = fbm( tile4d + elapsed + length( b ) * moltenPermutations );',
  'vec3 col = moltenBrightness * (',
  '( ( b.x + surf ) * moltenColor1 ) +',
  '( ( b.y + surf ) * moltenColor2 ) +',
  '( ( surf + b.x ) * moltenColor3 )',
  ');',
  'vec4 diffuseColor = vec4(col, opacity);',
].join('\n');
