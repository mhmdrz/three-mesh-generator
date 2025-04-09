import { ShaderLib } from 'three';
import { MaterialTypes } from '../types.enum';
import {
  moltenMain,
  moltenTop,
  randomColorMain,
  randomColorTop,
  randomColorWithNoiseMain,
  randomColorWithNoiseTop,
  staticColorMain,
  staticColorTop,
  staticGradientMain,
  staticGradientTop,
} from './fragment-parts';

const phongFrag: string = ShaderLib.phong.fragmentShader;
const standardFrag: string = ShaderLib.standard.fragmentShader;

function fragGenerator(
  top: string,
  main: string,
  materialType: MaterialTypes
): string {
  let frag = '';
  const topPart = '#include <clipping_planes_pars_fragment>\n' + top;
  switch (materialType) {
    case MaterialTypes.Phong:
      frag = phongFrag.replace(
        '#include <clipping_planes_pars_fragment>',
        topPart
      );
      frag = frag.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        main
      );
      break;
    case MaterialTypes.Standard:
      frag = standardFrag.replace(
        '#include <clipping_planes_pars_fragment>',
        topPart
      );
      frag = frag.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        main
      );
  }
  return frag;
}

export const randomColorFragmentPhong: string = fragGenerator(
  randomColorTop,
  randomColorMain,
  MaterialTypes.Phong
);
export const randomColorFragmentStandard: string = fragGenerator(
  randomColorTop,
  randomColorMain,
  MaterialTypes.Standard
);

export const randomColorWithNoiseFragmentPhong: string = fragGenerator(
  randomColorWithNoiseTop,
  randomColorWithNoiseMain,
  MaterialTypes.Phong
);
export const randomColorWithNoiseFragmentStandard: string = fragGenerator(
  randomColorWithNoiseTop,
  randomColorWithNoiseMain,
  MaterialTypes.Standard
);

export const staticColorFragmentPhong: string = fragGenerator(
  staticColorTop,
  staticColorMain,
  MaterialTypes.Phong
);
export const staticColorFragmentStandard: string = fragGenerator(
  staticColorTop,
  staticColorMain,
  MaterialTypes.Standard
);

export const staticGradientFragmentPhong: string = fragGenerator(
  staticGradientTop,
  staticGradientMain,
  MaterialTypes.Phong
);
export const staticGradientFragmentStandard: string = fragGenerator(
  staticGradientTop,
  staticGradientMain,
  MaterialTypes.Standard
);

export const moltenFragmentPhong: string = fragGenerator(
  moltenTop,
  moltenMain,
  MaterialTypes.Phong
);
export const moltenFragmentStandard: string = fragGenerator(
  moltenTop,
  moltenMain,
  MaterialTypes.Standard
);
