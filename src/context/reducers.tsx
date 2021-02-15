import { MutableRefObject } from "react";
import { Camera } from "three";
import { SceneType } from "./index";

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        payload: M[Key];
    }
};

export enum Types {
    SetCanvas = 'SET_CANVAS',
    SetCamera = 'SET_CAMERA',
    SetCurrentElement = 'SET_CURRENT_ELEMENT',
}

type ScenePayload = {
    [Types.SetCanvas]: HTMLCanvasElement;
    [Types.SetCamera]: Camera;
    [Types.SetCurrentElement]: string;
}

export type SceneActions = ActionMap<ScenePayload>[keyof ActionMap<ScenePayload>];

export const sceneReducer = (state: SceneType, action: SceneActions) => {
    switch (action.type) {
        case Types.SetCanvas:
            return { ...state, canvas: action.payload };
        case Types.SetCamera:
            return { ...state, camera: action.payload };
        case Types.SetCurrentElement:
            return { ...state, currentElement: action.payload };
        default:
            return state;
    }
}