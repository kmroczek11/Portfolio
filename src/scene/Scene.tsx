import React, { useEffect } from 'react';
import Home from '../home/Home';
import Education from '../education/Education';
import Projects from '../projects/Projects';
import Contact from '../contact/Contact';
import SceneController from './SceneController';
import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import Navbar from '../navigation/Navbar';
import { Environment, OrbitControls, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import Loader from '../components/Loader';
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
    const keyLight = useRef(null);
    const fillLight = useRef(null);
    const frontLight = useRef(null);
    const { camera } = useThree();
    const timeline = gsap.timeline({ repeat: -1, yoyo: true });

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

    useEffect(() => {
        if (!fillLight.current) return;

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
                />
                <Navbar items={navbar_items} />
                <Home />
                <Education />
                <Projects />
                <Contact />
                <directionalLight
                    ref={keyLight}
                    args={['#fff', 1]}
                />
                <directionalLight
                    ref={fillLight}
                    args={['#e6cd7e', 1]}
                />
                <directionalLight
                    ref={frontLight}
                    args={['#fff', 1]}
                />
                <SceneController />
                <Preload all />
            </Suspense>
            {/* <OrbitControls/> */}
        </>
    )
}

export default Scene;