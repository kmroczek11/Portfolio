import { Camera, Scene, ShaderMaterial } from 'three';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import postVertexShader from '../shaders/postVertex.glsl';
import postFragmentShader from '../shaders/postFragment.glsl';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

export const createRenderPass = (scene: Scene, camera: Camera) =>
  new RenderPass(scene, camera);

export const bloomPass = new BloomPass(
  1.5, // strength
  27, // kernel size
  5, // sigma ?
  256 // blur render target resolution
);

export const grayscalePass = new ShaderPass(LuminosityShader);

export const createFinalPass = (
  pixelRatio: number,
  bloomComposer?: EffectComposer,
  filmComposer?: EffectComposer,
  multipassComposer?: EffectComposer
) => {
  const finalPass = new ShaderPass(
    new ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: {
          value: bloomComposer && bloomComposer.renderTarget2.texture,
        },
        filmTexture: {
          value: filmComposer && filmComposer.renderTarget2.texture,
        },
        multipassTexture: {
          value: multipassComposer && multipassComposer.renderTarget2.texture,
        },
        resolution: {
          value: {
            x: 1 / (window.innerWidth * pixelRatio),
            y: 1 / (window.innerHeight * pixelRatio),
          },
        },
      },
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
      defines: {},
    }),
    'baseTexture'
  );
  finalPass.renderToScreen = true;

  return finalPass;
};
