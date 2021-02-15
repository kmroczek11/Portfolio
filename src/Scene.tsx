import React, { Suspense, useContext, useMemo } from 'react';
import Home from './Home';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveElement } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import Education from './Education';
import Projects from './Projects';

const Scene = (): JSX.Element => {
    console.log('scene rendered');
    const { state } = useContext(AppContext);
    const { camera, currentElement } = state.scene;

    useFrame(() => {
        switch (currentElement) {
            case 'HOME':
                camera && moveElement(camera, camera.position, new Vector3(0, 0, 5), 0.01);
                break;
            case 'EDUKACJA':
                camera && moveElement(camera, camera.position, new Vector3(0, 0, -10), 0.01);
                break;
            case 'PROJEKTY':
                camera && moveElement(camera, camera.position, new Vector3(10, 0, -10), 0.01);
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
                <Education />
                <Projects />
            </Suspense>
        </>
    )
}

export default Scene;