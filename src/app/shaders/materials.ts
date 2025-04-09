import {
  Color,
  ShaderLib,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three';
import { getRandomFloat, getRandomInt, randomSelector } from '../utils/randoms';
import { colorGenerator } from '../utils/colors';
import { GeometryTypes } from '../types.enum';
import {
  randomColorFragmentPhong,
  randomColorFragmentStandard,
  randomColorWithNoiseFragmentPhong,
  randomColorWithNoiseFragmentStandard,
  staticColorFragmentPhong,
  staticColorFragmentStandard,
} from './fragment';
import {
  staticWithUVPhong,
  staticWithUVStandard,
  vertDeformPhong,
  vertDeformStandard,
  vertDistortion2DPhong,
  vertDistortion2DStandard,
  vertDistortion3DPhong,
  vertDistortion3DStandard,
  vertDistortion4DPhong,
  vertDistortion4DStandard,
} from './vertex';

const globalUniforms = {
  time: {
    value: 0.0,
  },
  resolution: {
    value: new Vector2(window.innerWidth, window.innerHeight).multiplyScalar(
      window.devicePixelRatio
    ),
  },
  colorCoef: {
    value: getRandomFloat(0, 0.6),
  },
  lightnessCoef: {
    value: getRandomFloat(0.1, 0.7),
  },
  thirdCoef: {
    value: new Vector3(0, 2, 4),
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
  staticColor: {
    value: new Color(colorGenerator()),
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

export function phongMaterialGenerator(
  geometryType: GeometryTypes
): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.phong.uniforms,
    globalUniforms,
  ]);

  let verts: string[] = [];
  let frags: string[] = [
    randomColorFragmentPhong,
    randomColorWithNoiseFragmentPhong,
    staticColorFragmentPhong,
  ];

  switch (geometryType) {
    case GeometryTypes.Convex:
      verts = [staticWithUVPhong, vertDeformPhong];
      break;
    case GeometryTypes.Icosahedron:
      verts = [
        vertDistortion3DPhong,
        vertDistortion4DPhong,
        vertDeformPhong,
        vertDistortion2DPhong,
      ];
      break;
    case GeometryTypes.TorusKnot:
      verts = [staticWithUVPhong];
      break;
    case GeometryTypes.TetrahedronPure:
      verts = [staticWithUVPhong, vertDeformPhong];
      break;
    case GeometryTypes.Tetrahedron:
      verts = [
        staticWithUVPhong,
        vertDistortion3DPhong,
        vertDistortion4DPhong,
        vertDeformPhong,
        vertDistortion2DPhong,
      ];
      break;
    case GeometryTypes.Octahedron:
      verts = [staticWithUVPhong, vertDeformPhong];
      break;
  }

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: randomSelector(verts),
    fragmentShader: randomSelector(frags),
    lights: true,
  });

  material.uniforms['shininess'].value = getRandomInt(0, 100);

  return material;
}

export function standardMaterialGenerator(
  geometryType: GeometryTypes
): ShaderMaterial {
  const uniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    globalUniforms,
  ]);

  let verts: string[] = [];
  let frags: string[] = [
    randomColorFragmentStandard,
    randomColorWithNoiseFragmentStandard,
    staticColorFragmentStandard,
  ];

  switch (geometryType) {
    case GeometryTypes.Convex:
      verts = [staticWithUVStandard, vertDeformStandard];
      break;
    case GeometryTypes.Icosahedron:
      verts = [
        vertDistortion3DStandard,
        vertDistortion4DStandard,
        vertDeformStandard,
        vertDistortion2DStandard,
      ];
      break;
    case GeometryTypes.TorusKnot:
      verts = [staticWithUVStandard];
      break;
    case GeometryTypes.TetrahedronPure:
      verts = [staticWithUVStandard, vertDeformStandard];
      break;
    case GeometryTypes.Tetrahedron:
      verts = [
        staticWithUVStandard,
        vertDistortion3DStandard,
        vertDistortion4DStandard,
        vertDeformStandard,
        vertDistortion2DStandard,
      ];
      break;
    case GeometryTypes.Octahedron:
      verts = [staticWithUVStandard, vertDeformStandard];
      break;
  }

  const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: randomSelector(verts),
    fragmentShader: randomSelector(frags),
    lights: true,
  });

  material.uniforms['roughness'].value = getRandomFloat(0, 1);
  material.uniforms['metalness'].value = getRandomFloat(0, 0.5);

  return material;
}
