import { MutableRefObject } from "react";
import { Camera } from "three";

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
    AddChild = 'ADD_CHILD',
    SetCurrentElement = 'SET_CURRENT_ELEMENT',
}

type SceneType = {
    canvas: HTMLCanvasElement;
    camera: Camera;
    children: Array<MutableRefObject<any>>;
    currentElement: string;
}

type ScenePayload = {
    [Types.SetCanvas]: HTMLCanvasElement;
    [Types.SetCamera]: Camera;
    [Types.AddChild]: MutableRefObject<any>;
    [Types.SetCurrentElement]: string;
}

export type SceneActions = ActionMap<ScenePayload>[keyof ActionMap<ScenePayload>];

export const sceneReducer = (state: SceneType, action: SceneActions) => {
    switch (action.type) {
        case Types.SetCanvas:
            return { ...state, canvas: action.payload };
        case Types.SetCamera:
            return { ...state, camera: action.payload };
        case Types.AddChild:
            return { ...state, children: [...state.children, action.payload] };
        case Types.SetCurrentElement:
            return { ...state, currentElement: action.payload };
        default:
            return state;
    }
}