import textVertexShader from './shaders/textVertex.glsl';
import textFragmentShader from './shaders/textFragment.glsl';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Color } from 'three/src/math/Color';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { MaterialParameters } from 'three/src/materials/Material';
import { shaderMaterial } from '@react-three/drei/core/shaderMaterial';
import { Texture } from 'three';

interface TextMaterialParameters extends MaterialParameters {
  map: Texture;
  color?: ReactThreeFiber.Color;
  opacity?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textMaterial: TextMaterialParameters;
    }
  }
}

const TextMaterial = shaderMaterial(
  {
    color: new Color('grey'),
  },
  textVertexShader,
  textFragmentShader
);

extend({ TextMaterial });
