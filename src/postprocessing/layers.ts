import { Layers } from "three/src/core/Layers";
import {
  BLOOM_LAYER_NUM,
  GRAYSCALE_LAYER_NUM,
  MULTIPASS_LAYER_NUM
} from "./constant";

export const bloomLayer = new Layers();
bloomLayer.set(BLOOM_LAYER_NUM);

export const grayscaleLayer = new Layers();
grayscaleLayer.set(GRAYSCALE_LAYER_NUM);

export const multipassLayer = new Layers();
multipassLayer.set(MULTIPASS_LAYER_NUM);