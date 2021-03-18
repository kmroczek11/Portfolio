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
    SetCurrentItem = 'SET_CURRENT_ELEMENT',
    SetFullScreen = 'SET_FULL_SCREEN'
}

type ScenePayload = {
    [Types.SetCanvas]: HTMLCanvasElement;
    [Types.SetCamera]: Camera;
    [Types.SetCurrentItem]: string;
    [Types.SetFullScreen]: boolean;
}

export type SceneActions = ActionMap<ScenePayload>[keyof ActionMap<ScenePayload>];

export const sceneReducer = (state: SceneType, action: SceneActions) => {
    switch (action.type) {
        case Types.SetCanvas:
            return { ...state, canvas: action.payload };
        case Types.SetCamera:
            return { ...state, camera: action.payload };
        case Types.SetCurrentItem:
            return { ...state, currentItem: action.payload };
        case Types.SetFullScreen:
            return { ...state, fullScreen: action.payload };
        default:
            return state;
    }
}