import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  PlaneGeometry,
  ShaderLib,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three';

interface ParserOutput {
  material: ShaderMaterial;
  mesh: Mesh;
}

export function getHex(color: number): string {
  return '#' + new Color(color).getHexString();
}

export function backgroundParser(json: any): ParserOutput {
  const geometry = new PlaneGeometry(
    json.background.geometries[0].width,
    json.background.geometries[0].height,
    json.background.geometries[0].widthSegments,
    json.background.geometries[0].heightSegments
  );

  const isStatic = json.background.materials[0].fragmentShader.includes(
    'uniform vec3 staticColor;'
  );
  let uniforms = {};

  if (isStatic) {
    uniforms = {
      staticColor: {
        value: new Color(
          getHex(json.background.materials[0].uniforms.staticColor.value)
        ),
      },
    };
  } else {
    uniforms = {
      resolution: {
        value: new Vector2(
          json.background.materials[0].uniforms.resolution.value[0],
          json.background.materials[0].uniforms.resolution.value[1]
        ),
      },
      startColor: {
        value: new Color(
          getHex(json.background.materials[0].uniforms.startColor.value)
        ),
      },
      endColor: {
        value: new Color(
          getHex(json.background.materials[0].uniforms.endColor.value)
        ),
      },
      gradientAngle: {
        value: json.background.materials[0].uniforms.gradientAngle.value,
      },
      gradientOrigin: {
        value: new Vector2(
          json.background.materials[0].uniforms.gradientOrigin.value[0],
          json.background.materials[0].uniforms.gradientOrigin.value[1]
        ),
      },
    };
  }

  const matUniforms = UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    uniforms,
  ]);

  const material = new ShaderMaterial({
    uniforms: matUniforms,
    vertexShader: ShaderLib.standard.vertexShader,
    fragmentShader: json.background.materials[0].fragmentShader,
    lights: true,
  });

  const mesh = new Mesh(geometry, material);

  return {
    material: material,
    mesh: mesh,
  };
}

export function convexParser(json: any): ParserOutput {
  const posArray = new Float32Array(
    json.mesh.geometries[0].data.attributes.position.array
  );
  const normalArray = new Float32Array(
    json.mesh.geometries[0].data.attributes.normal.array
  );
  const posAttr = new BufferAttribute(
    posArray,
    json.mesh.geometries[0].data.attributes.position.itemSize,
    json.mesh.geometries[0].data.attributes.position.normalized
  );
  const normalAttr = new BufferAttribute(
    normalArray,
    json.mesh.geometries[0].data.attributes.normal.itemSize,
    json.mesh.geometries[0].data.attributes.normal.normalized
  );
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('normal', normalAttr);

  const isPhong = json.mesh.materials[0].vertexShader.includes('#define PHONG');
  let matUniforms = {};
  matUniforms = isPhong
    ? ShaderLib.phong.uniforms
    : ShaderLib.standard.uniforms;

  const uniforms = {
    time: {
      value: json.mesh.materials[0].uniforms.time.value,
    },
    resolution: {
      value: new Vector2(
        json.mesh.materials[0].uniforms.resolution.value[0],
        json.mesh.materials[0].uniforms.resolution.value[1]
      ),
    },
    colorCoef: {
      value: json.mesh.materials[0].uniforms.colorCoef.value,
    },
    lightnessCoef: {
      value: json.mesh.materials[0].uniforms.lightnessCoef.value,
    },
    thirdCoef: {
      value: new Vector3(0, 2, 4),
    },
    rdNoiseCoefRed: {
      value: json.mesh.materials[0].uniforms.rdNoiseCoefRed.value,
    },
    rdNoiseCoefGreen: {
      value: json.mesh.materials[0].uniforms.rdNoiseCoefGreen.value,
    },
    rdNoiseCoefBlue: {
      value: json.mesh.materials[0].uniforms.rdNoiseCoefBlue.value,
    },
    rdNoiseOpRed: {
      value: json.mesh.materials[0].uniforms.rdNoiseOpRed.value,
    },
    rdNoiseOpGreen: {
      value: json.mesh.materials[0].uniforms.rdNoiseOpGreen.value,
    },
    rdNoiseOpBlue: {
      value: json.mesh.materials[0].uniforms.rdNoiseOpBlue.value,
    },
    staticColor: {
      value: new Color(
        getHex(json.mesh.materials[0].uniforms.staticColor.value)
      ),
    },
    movement: {
      value: new Vector2(
        json.mesh.materials[0].uniforms.movement.value[0],
        json.mesh.materials[0].uniforms.movement.value[1]
      ),
    },
    noiseCoef: {
      value: json.mesh.materials[0].uniforms.noiseCoef.value,
    },
    amplitude: {
      value: json.mesh.materials[0].uniforms.amplitude.value,
    },
    frequency: {
      value: json.mesh.materials[0].uniforms.frequency.value,
    },
    sphereRadius: {
      value: 50,
    },
    sphereCoef: {
      value: json.mesh.materials[0].uniforms.sphereCoef.value,
    },
  };

  const material = new ShaderMaterial({
    uniforms: UniformsUtils.merge([matUniforms, uniforms]),
    vertexShader: json.mesh.materials[0].vertexShader,
    fragmentShader: json.mesh.materials[0].fragmentShader,
    lights: true,
  });
  const mesh = new Mesh(geometry, material);

  return {
    material: material,
    mesh: mesh,
  };
}
