import React, { useContext } from 'react';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { Types } from './context/reducers';

const SceneController = (): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);
    const { camera, currentItem } = state.scene;

    useFrame(() => {
        switch (currentItem) {
            case 'home':
                camera && moveObject(camera, camera.position, new Vector3(0, 0, 5), 0.01);
                break;
            case 'education':
                camera && moveObject(camera, camera.position, new Vector3(0, 0, -10), 0.01);
                break;
            case 'projects':
                camera && moveObject(camera, camera.position, new Vector3(10, 0, -10), 0.01);
                break;
            case 'contact':
                camera && moveObject(camera, camera.position, new Vector3(10, 0, 5), 0.01);
                break;
            default:
                break;
        }
    })

    return null;
}

export default SceneController;