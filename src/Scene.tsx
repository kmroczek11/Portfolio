import React from 'react';
import Home from './Home';
import Education from './Education';
import Projects from './Projects';
import Contact from './Contact';
import SceneController from './SceneController';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';

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

const Scene = (): JSX.Element => {
    console.log('scene rendered');

    return (
        <>
            <Home />
            <Education />
            <Projects />
            <Contact />
            <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} />
            <ambientLight color={'#404040'} />
            <SceneController />
            {/* <Suspense fallback={null}>
                <Skybox />
            </Suspense> */}
            {/* <OrbitControls /> */}
        </>
    )
}

export default Scene;