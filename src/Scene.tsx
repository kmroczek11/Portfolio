import React, { useContext } from 'react';
import Home from './Home';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveElement } from './functions';
import { Vector3 } from 'three/src/math/Vector3';

const Scene = (): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);

    useFrame(() => {
        console.log(state.scene.camera);
        switch (state.scene.currentElement) {
            case 'HOME':
                state.scene.camera && moveElement(state.scene.camera, state.scene.camera.position, new Vector3(0, 10, 0));
                break;
            case 'O MNIE':
                console.log('o mnie');
                state.scene.camera && moveElement(state.scene.camera, state.scene.camera.position, new Vector3(0, 0, -5));
            default:
                break;
        }
    })

    return (
        <>
            <Home />
        </>
    )
}

export default Scene;