import React, { Suspense, useContext, useState, useEffect } from 'react';
import Home from './Home';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import Education from './Education';
import Projects from './Projects';
import Contact from './Contact';
import { OrbitControls, Text, useProgress } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { TextureLoader, BackSide } from 'three';

interface LoaderProps {
    position?: [x: number, y: number, z: number]
}

const Loader = ({ position }: LoaderProps): JSX.Element => {
    const { progress } = useProgress();
    const { t, i18n } = useTranslation();
    console.log(progress);

    return <Text
        position={position}
        color='#ff4d17'
        font='fonts/Oswald.ttf'
        fontSize={0.5}
        textAlign='center'
    >
        {t('loadingMessage', { progress: progress })}
    </Text>
}

const Skybox = React.memo(() => {
    console.log('skybox rendered');
    const textures: Array<string> = [
        'images/textures/skybox/space_ft.png',
        'images/textures/skybox/space_bk.png',
        'images/textures/skybox/space_up.png',
        'images/textures/skybox/space_dn.png',
        'images/textures/skybox/space_rt.png',
        'images/textures/skybox/space_lf.png'
    ];

    return <mesh>
        <boxBufferGeometry args={[1000, 1000, 1000]} />
        {
            textures.map((value: string, i: number) => {
                const texture = new TextureLoader().load(value);
                console.log(texture);
                return <meshBasicMaterial key={i} attachArray='material' map={texture} side={BackSide} />;
            })
        }
    </mesh>
})

const Scene = (): JSX.Element => {
    console.log('scene rendered');
    const { state } = useContext(AppContext);
    const { camera } = state.scene;
    const [currentItem, setCurrentItem] = useState<string>('');

    const unlisten = window.appHistory.listen((location: any) => {
        setCurrentItem(location.pathname.split('/')[1]);
    })

    useFrame(() => {
        switch (currentItem) {
            case '':
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

    return (
        <>
            <Suspense fallback={<Loader />}>
                <Home />
            </Suspense>
            <Suspense fallback={<Loader position={[0, 0, -13]} />}>
                <Education />
            </Suspense>
            <Suspense fallback={<Loader position={[10, 0, -13]} />}>
                <Projects />
            </Suspense>
            <Contact />
            <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} />
            <ambientLight color={'#404040'} />
            <Suspense fallback={null}>
                <Skybox />
            </Suspense>
            {/* <OrbitControls listenToKeyEvents /> */}
        </>
    )
}

export default Scene;