import React, { Suspense, useContext } from 'react';
import Home from './Home';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveElement } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import Lifetime from './Lifetime';

const Scene = (): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);

    useFrame(() => {
        switch (state.scene.currentElement) {
            case 'HOME':
                state.scene.camera && moveElement(state.scene.camera, state.scene.camera.position, new Vector3(0, 0, 5));
                break;
            case 'O MNIE':
                state.scene.camera && moveElement(state.scene.camera, state.scene.camera.position, new Vector3(0, 0, -7));
                break;
            default:
                break;
        }
    })

    return (
        <>
            <Suspense fallback={
                null
            }>
                <Home />
                <Lifetime />
            </Suspense>
        </>
    )
}

export default Scene;