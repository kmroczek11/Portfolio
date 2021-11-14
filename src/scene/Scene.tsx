import React, { useContext, useEffect } from 'react';
import Home from '../home/Home';
import Education from '../education/Education';
import Projects from '../projects/Projects';
import Contact from '../contact/Contact';
import SceneController from './SceneController';
import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import Navbar from '../navigation/Navbar';
import { Environment, OrbitControls, Preload, useHelper } from '@react-three/drei';
import { Suspense } from 'react';
import Loader from '../components/Loader';
import { DirectionalLightHelper } from 'three';
import { AppContext } from '../context';
import { animate } from '../components/functions';
import gsap from 'gsap';

const navbar_items: Array<NavbarItem> = [
    { id: 0, name: 'education' },
    { id: 1, name: 'projects' },
    { id: 2, name: 'contact' },
]

export interface NavbarItem {
    id: number,
    name: string,
}

const Scene = (): JSX.Element => {
    console.log('scene rendered');
    const keyLight = useRef(null);
    const fillLight = useRef(null);
    const frontLight = useRef(null);
    const { camera } = useThree();
    // const { state } = useContext(AppContext);
    const timeline = gsap.timeline({ repeat: -1, yoyo: true });

    // useHelper(keyLight, DirectionalLightHelper, 0.5)
    // useHelper(fillLight, DirectionalLightHelper, 0.5)
    // useHelper(frontLight, DirectionalLightHelper, 0.5)

    useEffect(() => {
        if (!keyLight.current || !fillLight.current || !frontLight.current) return;

        const k = keyLight.current;
        const fi = fillLight.current;
        const fr = frontLight.current;

        k.position.set(camera.position.x + 5, 1, camera.position.z);
        fi.position.set(camera.position.x - 5, 0.5, camera.position.z);
        fr.position.set(camera.position.x - 5, -0.5, camera.position.z);

        k.target.position.set(camera.position.x, 0, camera.position.z - 5);
        fi.target.position.set(camera.position.x, 0, camera.position.z - 5);
        fr.target.position.set(camera.position.x, 0, camera.position.z - 5);

        k.target.updateMatrixWorld();
        fi.target.updateMatrixWorld();
        fr.target.updateMatrixWorld();
    })

    // useEffect(() => {
    //     if (!keyLight.current || !fillLight.current || !frontLight.current) return;

    //     const k = keyLight.current;
    //     const fi = fillLight.current;
    //     const fr = frontLight.current;

    //     state.scene.gui.add(k.position, 'x', 10, 20)
    //     state.scene.gui.add(k.position, 'y', -5, 5)
    //     state.scene.gui.add(k.position, 'z', -20, 15)

    //     state.scene.gui.add(fi.position, 'x', 10, 20)
    //     state.scene.gui.add(fi.position, 'y', -5, 5)
    //     state.scene.gui.add(fi.position, 'z', -20, 15)

    //     state.scene.gui.add(fr.position, 'x', 10, 20)
    //     state.scene.gui.add(fr.position, 'y', -5, 5)
    //     state.scene.gui.add(fr.position, 'z', -20, 15)
    // }, [fillLight.current])

    useEffect(() => {
        if (!fillLight.current) return;

        // animate(
        //     fillLight.current.position,
        //     { x: camera.position.x + 5, repeat: -1, yoyo: true },
        //     5,
        //     'power0'
        // )

        timeline.to(
            fillLight.current.position,
            { x: camera.position.x + 5, duration: 5 },
        )
        timeline.to(
            fillLight.current.position,
            { x: camera.position.x - 5, duration: 5 },
        )
    })

    return (
        <>
            <Suspense fallback={<Loader />}>
                <Environment
                    background={false}
                    files={['square.png', 'square.png', 'square.png', 'square.png', 'square.png', 'square.png']}
                    path='/images/textures/'
                // scene={scene} // adds the ability to pass a custom THREE.Scene
                />
                {/* <fog attach='fog' args={['#fff', camera.near, camera.far]} /> */}
                <Navbar items={navbar_items} />
                <Home />
                <Education />
                <Projects />
                <Contact />
                <directionalLight
                    ref={keyLight}
                    args={['#fff', 0.5]}
                />
                <directionalLight
                    ref={fillLight}
                    args={['#d4af37', 0.5]}
                />
                <directionalLight
                    ref={frontLight}
                    args={['#fff', 0.5]}
                />
                {/* <hemisphereLight args={['#fff', '#d4af37', 4]} />
                <spotLight
                    ref={light}
                    args={['#fff', 4]}
                    castShadow={true}
                    shadow-bias={-0.0001}
                    shadow-mapSize-width={1024 * 4}
                    shadow-mapSize-height={1024 * 4}
                /> */}
                <SceneController />
                <Preload all />
            </Suspense>
            {/* <OrbitControls /> */}
        </>
    )
}

export default Scene;