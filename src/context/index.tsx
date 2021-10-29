import { GUI } from 'dat.gui';
import * as dat from 'dat.gui';
import React, { createContext, Dispatch, useReducer } from 'react';
import { sceneReducer, SceneActions } from './reducers';

export type SceneType = {
    currentItem: string;
    fullScreen: boolean;
    gui: GUI;
    mode: string;
}

type InitialStateType = {
    scene: SceneType;
}

const initialState = {
    scene: {
        currentItem: 'home.end',
        fullScreen: false,
        gui: new dat.GUI(),
        mode: 'desktop'
    }
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