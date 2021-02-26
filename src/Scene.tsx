import React, { Suspense, useContext, useEffect, useMemo } from 'react';
import Home from './Home';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { tweenObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import Education from './Education';
import Projects from './Projects';
import Contact from './Contact';
import { Text, useProgress } from '@react-three/drei';
import TWEEN from '@tweenjs/tween.js';

const Loader = (): JSX.Element => {
    const { active, progress, errors, item, loaded, total } = useProgress();
    console.log(progress);

    return <Text
        position-z={1}
        color='#ff0000'
        font='fonts/Oswald.ttf'
        fontSize={2}
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
    const options = {
        duration: 5000,
        easing: TWEEN.Easing.Quadratic.InOut,
        update: (d: Vector3) => {
            // console.log(`Updating: ${d}`);
        },
        callback: () => {
            // console.log('Completed');
        }
    }

    useFrame(() => {
        TWEEN.update();
    })

    useEffect(() => {
        switch (currentElement) {
            case 'HOME':
                camera && tweenObject(camera.position, new Vector3(0, 0, 5), options);
                break;
            case 'EDUKACJA':
                camera && tweenObject(camera.position, new Vector3(0, 0, -10), options);
                break;
            case 'PROJEKTY':
                camera && tweenObject(camera.position, new Vector3(10, 0, -10), options);
                break;
            case 'KONTAKT':
                camera && tweenObject(camera.position, new Vector3(10, 0, 5), options);
                break;
            default:
                break;
        }
    }, [currentElement])

    return (
        <>
            <Suspense fallback={<Loader />}>
                <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} />
                <Home />
                <Education />
                <Projects />
                <Contact />
            </Suspense>
        </>
    )
}

export default Scene;