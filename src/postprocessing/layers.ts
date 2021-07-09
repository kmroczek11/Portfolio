import { Layers } from "three/src/core/Layers";
import {
  BLOOM_LAYER_NUM,
  FILM_LAYER_NUM,
  MULTIPASS_LAYER_NUM
} from "./constant";

export const bloomLayer = new Layers();
bloomLayer.set(BLOOM_LAYER_NUM);

export const filmLayer = new Layers();
filmLayer.set(FILM_LAYER_NUM);

export const multipassLayer = new Layers();
multipassLayer.set(MULTIPASS_LAYER_NUM);