import React, { useEffect } from 'react';
import Home from '../home/Home';
import Education from '../education/Education';
import Projects from '../projects/Projects';
import Contact from '../contact/Contact';
import SceneController from './SceneController';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import Navbar from '../navigation/Navbar';

// const Skybox = React.memo(() => {
//     console.log('skybox rendered');
//     const textures: Array<string> = [
//         'images/textures/skybox/space_ft.png',
//         'images/textures/skybox/space_bk.png',
//         'images/textures/skybox/space_up.png',
//         'images/textures/skybox/space_dn.png',
//         'images/textures/skybox/space_rt.png',
//         'images/textures/skybox/space_lf.png'
//     ];

//     return <mesh>
//         <boxBufferGeometry args={[1000, 1000, 1000]} />
//         {
//             textures.map((value: string, i: number) => {
//                 const texture = new TextureLoader().load(value);
//                 console.log(texture);
//                 return <meshBasicMaterial key={i} attachArray='material' map={texture} side={BackSide} />;
//             })
//         }
//     </mesh>
// })

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
    const light = useRef(null);
    const { camera } = useThree();

    useEffect(() => {
        if (light.current) {
            light.current.position.set(
                camera.position.x + 10,
                camera.position.y + 10,
                camera.position.z + 10
            )
            console.log(light.current.position)
        }
    }, [camera.position])

    return (
        <>
            <Navbar items={navbar_items} />
            <Home />
            <Education />
            <Projects />
            <Contact />
            {/* <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} /> */}
            <hemisphereLight args={['#fff', '#d4af37', 4]} />
            <spotLight
                ref={light}
                args={['#fff', 2]}
                castShadow={true}
                shadow-bias={-0.0001}
                shadow-mapSize-width={1024 * 4}
                shadow-mapSize-height={1024 * 4}
            />
            <SceneController />
            {/* <Suspense fallback={null}>
                <Skybox />
            </Suspense> */}
            {/* <OrbitControls /> */}
        </>
    )
}

export default Scene;