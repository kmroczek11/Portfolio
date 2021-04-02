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
import gsap from 'gsap';

const Texts = ({ focus }: { focus: boolean }): JSX.Element => {
    const texts = useRef([]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (focus) {
            texts.current[0] && gsap.to(texts.current[0].position, { duration: 5, ease: 'slow (0.1, 0.7, false)', x: -2, y: 0, z: 0.5 });
            texts.current[1] && gsap.to(texts.current[1].position, { duration: 5, ease: 'slow (0.1, 0.7, false)', x: 2, y: -1, z: 0.5 });
        } else {
            texts.current[0] && gsap.to(texts.current[0].position, { duration: 5, ease: 'slow (0.1, 0.7, false)', x: 0, y: 0, z: 0 });
            texts.current[1] && gsap.to(texts.current[1].position, { duration: 5, ease: 'slow (0.1, 0.7, false)', x: 0, y: 0, z: 0 });
        }
    }, [focus])

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

const Globe = ({ focus }: { focus: boolean }): JSX.Element => {
    const globe = useRef(null);
    const texture = useLoader(TextureLoader, 'images/textures/night.jpg');

    useFrame(() => {
        globe.current.rotation.y -= 0.005;
    })

    useEffect(() => {
        focus ?
            globe.current && gsap.to(globe.current.material, { duration: 5, ease: 'slow (0.1, 0.7, false)', opacity: 1 }) :
            globe.current && gsap.to(globe.current.material, { duration: 5, ease: 'slow (0.1, 0.7, false)', opacity: 0 })
    }, [focus])

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
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const photo = useRef(null);

    useEffect(() => {
        focus ?
            photo.current && gsap.to(photo.current.position, { duration: 2, ease: 'slow (0.1, 0.7, false)', x: 0, y: 0, z: 0 }) :
            photo.current && gsap.to(photo.current.position, { duration: 2, ease: 'slow (0.1, 0.7, false)', x: 0, y: 0, z: 6 });
    }, [focus])

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
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem == 'home.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    return (
        <>
            <Suspense fallback={<Loader />}>
                <Photo focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Globe focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Texts focus={focus} />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Objects />
            </Suspense>
        </>
    )
})

export default Home;