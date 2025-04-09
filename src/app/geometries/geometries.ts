import {
  IcosahedronGeometry,
  Mesh,
  OctahedronGeometry,
  ShaderMaterial,
  TetrahedronGeometry,
  TorusKnotGeometry,
} from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { convexPointGenerator } from '../points/points';
import {
  phongMaterialGenerator,
  standardMaterialGenerator,
} from '../shaders/materials';
import { GeometryTypes } from '../types.enum';
import { getRandomInt, randomSelector } from '../utils/randoms';

interface GeometryOutput {
  state: GeometryTypes;
  material: ShaderMaterial;
  mesh: Mesh;
}

function convexGenerator(): GeometryOutput {
  const points = convexPointGenerator();
  const materials = [
    phongMaterialGenerator(GeometryTypes.Convex),
    standardMaterialGenerator(GeometryTypes.Convex),
  ];

  const material = randomSelector(materials);
  const geometry = new ConvexGeometry(points);
  const mesh = new Mesh(geometry, material);

  return {
    state: GeometryTypes.Convex,
    material: material,
    mesh: mesh,
  };
}

function icosahedronGenerator(): GeometryOutput {
  const materials = [
    phongMaterialGenerator(GeometryTypes.Icosahedron),
    standardMaterialGenerator(GeometryTypes.Icosahedron),
  ];
  const geometry = new IcosahedronGeometry(
    getRandomInt(25, 50),
    getRandomInt(5, 100)
  );

  const material = randomSelector(materials);
  const mesh = new Mesh(geometry, material);
  return {
    state: GeometryTypes.Icosahedron,
    material: material,
    mesh: mesh,
  };
}

function torusKnotGenerator(): GeometryOutput {
  const materials = [
    phongMaterialGenerator(GeometryTypes.TorusKnot),
    standardMaterialGenerator(GeometryTypes.TorusKnot),
  ];
  const geometry = new TorusKnotGeometry(
    getRandomInt(15, 25),
    getRandomInt(3, 8),
    300,
    20,
    getRandomInt(1, 8),
    getRandomInt(1, 8)
  );

  const material = randomSelector(materials);
  const mesh = new Mesh(geometry, material);
  return {
    state: GeometryTypes.TorusKnot,
    material: material,
    mesh: mesh,
  };
}

function tetrahedronGenerator(): GeometryOutput {
  const materialsPure = [
    phongMaterialGenerator(GeometryTypes.TetrahedronPure),
    standardMaterialGenerator(GeometryTypes.TetrahedronPure),
  ];
  const materials = [
    phongMaterialGenerator(GeometryTypes.Tetrahedron),
    standardMaterialGenerator(GeometryTypes.Tetrahedron),
  ];

  const random = Math.random();
  let isPure = false;
  if (random > 0.5) {
    isPure = false;
  } else {
    isPure = true;
  }
  const geometry = new TetrahedronGeometry(
    getRandomInt(25, 50),
    isPure ? 0 : 1
  );

  const material = isPure
    ? randomSelector(materialsPure)
    : randomSelector(materials);

  const mesh = new Mesh(geometry, material);
  return {
    state: GeometryTypes.Tetrahedron,
    material: material,
    mesh: mesh,
  };
}

function octahedronGenerator(): GeometryOutput {
  const materials = [
    phongMaterialGenerator(GeometryTypes.Octahedron),
    standardMaterialGenerator(GeometryTypes.Octahedron),
  ];
  const geometry = new OctahedronGeometry(getRandomInt(25, 50));
  const material = randomSelector(materials);
  const mesh = new Mesh(geometry, material);
  return {
    state: GeometryTypes.Octahedron,
    material: material,
    mesh: mesh,
  };
}

export function singleGeometrySelector(): GeometryOutput {
  return convexGenerator();
}

export function randomGeometrySelector(): GeometryOutput {
  const array = [
    convexGenerator(),
    icosahedronGenerator(),
    torusKnotGenerator(),
    tetrahedronGenerator(),
    octahedronGenerator(),
  ];

  return randomSelector(array);
}
