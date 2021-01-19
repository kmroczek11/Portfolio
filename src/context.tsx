import React, { createContext, Dispatch, MutableRefObject, useReducer } from 'react';
import { Camera } from 'three';
import { sceneReducer, SceneActions } from './reducers';

type SceneType = {
    canvas: HTMLCanvasElement;
    camera: Camera;
    children: Array<MutableRefObject<any>>
}

type InitialStateType = {
    scene: SceneType;
}

const initialState = {
    scene: { canvas: null, camera: null, children: [] }
}

const AppContext = createContext<{
    state: InitialStateType;
    dispatch: Dispatch<SceneActions>;
}>({
    state: initialState,
    dispatch: () => null
});

const mainReducer = ({ scene }: InitialStateType, action: SceneActions) => ({
    scene: sceneReducer(scene, action),
});

const AppProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(mainReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider };