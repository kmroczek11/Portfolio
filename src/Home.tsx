import React, { Suspense, useContext, useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Vector3 } from 'three/src/math/Vector3';
import { moveObject, rotateAroundPoint } from './functions';
import { Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { AppContext } from './context';
import Loader from './Loader';

// const Texts = ({ focus }: { focus: boolean }): JSX.Element => {
const Texts = (): JSX.Element => {
    const texts = useRef([]);
    const { t, i18n } = useTranslation();

    useFrame(() => {
        [0, 1].forEach((e) => {
            var targetVector: Vector3;
            e === 0 ? targetVector = new Vector3(-2, 0, 0.5) : targetVector = new Vector3(2, -1, 0.5);
            moveObject(texts.current[e], texts.current[e].position, targetVector, 0.01);
        })
    })

    return (
        <>
            <Text
                ref={el => texts.current[0] = el}
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
            >
                {t('homeDesc.0')}
            </Text>
            <Text
                ref={el => texts.current[1] = el}
                color='#d4af37'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
            >
                {t('homeDesc.1')}
            </Text>
        </>
    )
}

// const Globe = ({ focus }: { focus: boolean }): JSX.Element => {
const Globe = (): JSX.Element => {
    const globe = useRef(null);
    const texture = useLoader(TextureLoader, 'images/textures/night.jpg');

    useFrame(() => {
        globe.current.rotation.y -= 0.005;
        if (globe.current.material.opacity < 1) globe.current.material.opacity += 0.01;
    })

    return (
        <mesh
            ref={globe}
            position={[0, 0, -6]}
        // receiveShadow
        >
            <sphereGeometry args={[6, 100, 100]} />
            <meshPhongMaterial transparent map={texture} opacity={0} />
        </mesh>
    )
}

// const Objects = ({ focus }: { focus: boolean }): JSX.Element => {
const Objects = (): JSX.Element => {
    const monitor = useLoader(OBJLoader, 'models/monitor.obj');
    const phone = useLoader(OBJLoader, 'models/phone.obj');
    const tablet = useLoader(OBJLoader, 'models/tablet.obj');

    useFrame(() => {
        monitor && rotateAroundPoint(monitor, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        phone && rotateAroundPoint(phone, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        tablet && rotateAroundPoint(tablet, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
    })

    return (
        <>
            <mesh position={[-4, 1, 0]}>
                <primitive object={monitor} />
            </mesh>
            <mesh position={[-4, -0.5, 0]}>
                <primitive object={phone} />
            </mesh>
            <mesh position={[4, 1, 0]}>
                <primitive object={tablet} />
            </mesh>
        </>
    )
}

const Photo = ({ focus }: { focus: boolean }): JSX.Element => {
    // const Photo = (): JSX.Element => {
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const photo = useRef(null);

    useFrame(() => {
        focus ?
            moveObject(photo.current, photo.current.position, new Vector3(0, 0, 0), 0.05) :
            moveObject(photo.current, photo.current.position, new Vector3(0, 0, 6), 0.05);
    })

    return (
        <mesh
            ref={photo}
            position={[0, 0, 6]}
        >
            <planeGeometry args={[6, 8]} />
            <meshStandardMaterial transparent map={photoTexture} />
        </mesh>
    )
}

const Home = React.memo(() => {
    console.log('home rendered');
    const { state } = useContext(AppContext);
    const { camera } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        camera && camera.position.z > 4 ? setFocus(true) : setFocus(false);
    }, [camera])

    return (
        <>
            <Suspense fallback={<Loader />}>
                <Photo focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Globe />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Texts />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Objects />
            </Suspense>
        </>
    )
})

export default Home;