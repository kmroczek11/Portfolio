import { Camera, Scene, ShaderMaterial, Vector2 } from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
// import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
// import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import postVertexShader from "../shaders/postVertex.glsl";
import postFragmentShader from "../shaders/postFragment.glsl";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

export const createRenderPass = (scene: Scene, camera: Camera) =>
  new RenderPass(scene, camera);

export const bloomPass = new BloomPass(
  1.5, // strength
  27, // kernel size
  5, // sigma ?
  256 // blur render target resolution
);

// export const filmPass = new FilmPass(
//   0.95, // noise intensity
//   0.35, // scanline intensity
//   648, // scanline count
//   false // grayscale
// );

// export const filmPass = new GlitchPass();

const center = new Vector2(0, 0);
const angle = 0;
const scale = 0.75;
export const filmPass = new DotScreenPass(center, angle, scale);

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
    "baseTexture"
  );
  finalPass.renderToScreen = true;

  return finalPass;
};
