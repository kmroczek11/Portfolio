import { SceneType } from './index';

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
    SetCurrentItem = 'SET_CURRENT_ELEMENT',
    SetFullScreen = 'SET_FULL_SCREEN',
    SetMode = 'SET_MODE',
}

type ScenePayload = {
    [Types.SetCurrentItem]: string;
    [Types.SetFullScreen]: boolean;
    [Types.SetMode]: string;
}

export type SceneActions = ActionMap<ScenePayload>[keyof ActionMap<ScenePayload>];

export const sceneReducer = (state: SceneType, action: SceneActions) => {
    switch (action.type) {
        case Types.SetCurrentItem:
            return { ...state, currentItem: action.payload };
        case Types.SetFullScreen:
            return { ...state, fullScreen: action.payload };
        case Types.SetMode:
            return { ...state, mode: action.payload };
        default:
            return state;
    }
}