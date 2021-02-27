import React, { Suspense, useContext, useMemo } from 'react';
import Home from './Home';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import Navbar from './Navbar';
import Education from './Education';
import Projects from './Projects';
import Contact from './Contact';
import { Text, useProgress } from '@react-three/drei';

const navbar_items: Array<NavbarItem> = [
    { id: 0, name: 'EDUKACJA' },
    { id: 1, name: 'PROJEKTY' },
    { id: 2, name: 'KONTAKT' },
]

export interface NavbarItem {
    id: number,
    name: string,
}

const Loader = (): JSX.Element => {
    const { active, progress, errors, item, loaded, total } = useProgress();
    console.log(progress);

    return <Text
        color='#ff0000'
        font='fonts/Oswald.ttf'
        fontSize={0.5}
        textAlign='center'
    >
        Poczekaj chwilkę...{'\n'}
        Załadowano {progress}%
  </Text>
}

const Scene = (): JSX.Element => {
    console.log('scene rendered');
    const { state } = useContext(AppContext);
    const { camera, currentElement } = state.scene;

    useFrame(() => {
        switch (currentElement) {
            case 'HOME':
                camera && moveObject(camera, camera.position, new Vector3(0, 0, 5), 0.01);
                break;
            case 'EDUKACJA':
                camera && moveObject(camera, camera.position, new Vector3(0, 0, -10), 0.01);
                break;
            case 'PROJEKTY':
                camera && moveObject(camera, camera.position, new Vector3(10, 0, -10), 0.01);
                break;
            case 'KONTAKT':
                camera && moveObject(camera, camera.position, new Vector3(10, 0, 5), 0.01);
                break;
            default:
                break;
        }
    })

    return (
        <>
            <Suspense fallback={<Loader />}>
                <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} />
                <Navbar items={navbar_items} />
                <Home />
                <Education />
                <Projects />
                <Contact />
            </Suspense>
        </>
    )
}

export default Scene;