import React, { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Vector3 } from 'three/src/math/Vector3';
import { rotateAroundPoint } from './functions';
import { Preload, Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { AppContext } from './context';
import Loader from './Loader';
import gsap from 'gsap';
import { BufferAttribute, BufferGeometry } from 'three';

const Texts = ({ focus }: { focus: boolean }): JSX.Element => {
    const texts = useRef([]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (focus) {
            texts.current[0] && gsap.to(texts.current[0].position, { x: -2, y: 0, z: 0.5, duration: 5, ease: 'expo.out' });
            texts.current[1] && gsap.to(texts.current[1].position, { x: 2, y: -1, z: 0.5, duration: 5, ease: 'expo.out' });
            texts.current[0] && gsap.to(texts.current[0], { duration: 5, ease: 'expo.out', fillOpacity: 1 });
            texts.current[1] && gsap.to(texts.current[1], { duration: 5, ease: 'expo.out', fillOpacity: 1 });
        } else {
            console.log('unfocused');
            texts.current[0] && gsap.to(texts.current[0].position, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
            texts.current[1] && gsap.to(texts.current[1].position, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
            texts.current[0] && gsap.to(texts.current[0], { duration: 5, ease: 'expo.out', fillOpacity: 0 });
            texts.current[1] && gsap.to(texts.current[1], { duration: 5, ease: 'expo.out', fillOpacity: 0 });
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
                fillOpacity={0}
            >
                {t('homeDesc.0')}
            </Text>
            <Text
                ref={el => texts.current[1] = el}
                color='#d4af37'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
                fillOpacity={0}
            >
                {t('homeDesc.1')}
            </Text>
        </>
    )
}

const Globe = ({ focus }: { focus: boolean }): JSX.Element => {
    const globe = useRef(null);
    const texture = useLoader(TextureLoader, 'images/textures/night.jpg');

    const randFloatSpread = (range: number) => {
        const min: number = -range / 2;
        const max: number = range / 2;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const [coords] = useMemo(() => {
        const distance: number = 6;
        const initialCoords: Array<number> = [];
        for (let i = 0; i < 1000; i++) {
            var theta = randFloatSpread(360);
            var phi = randFloatSpread(360);

            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);

            initialCoords.push(x, y, z);
        }
        console.log(initialCoords)

        const coords = new Float32Array(initialCoords)
        return [coords]
    }, [])

    useFrame(() => {
        if (globe.current)
            globe.current.rotation.y -= 0.005;
    })

    useEffect(() => {
        focus ?
            globe.current && gsap.to(globe.current.material, { duration: 5, ease: 'expo.out', opacity: 1 }) :
            globe.current && gsap.to(globe.current.material, { duration: 5, ease: 'expo.out', opacity: 0 });
    }, [focus])

    return (
        <points
            ref={globe}
            position={[0, 0, -6]}
        >
            <bufferGeometry>
                <bufferAttribute
                    attachObject={["attributes", "position"]}
                    count={coords.length / 3}
                    array={coords}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                sizeAttenuation
                attach="material"
                color='#fff'
                opacity={0}
                size={0.005}
            />
        </points>
    )
}

// const Objects = ({ focus }: { focus: boolean }): JSX.Element => {
const Objects = (): JSX.Element => {
    const monitor = useLoader(GLTFLoader, 'models/monitor.glb');
    const phone = useLoader(GLTFLoader, 'models/phone.glb');
    const tablet = useLoader(GLTFLoader, 'models/tablet.glb');

    useFrame(() => {
        monitor.scene && rotateAroundPoint(monitor.scene, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        phone.scene && rotateAroundPoint(phone.scene, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        tablet.scene && rotateAroundPoint(tablet.scene, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
    })

    return (
        <>
            <mesh position={[-4, 1, 0]}>
                <primitive object={monitor.scene} />
            </mesh>
            <mesh position={[-4, -0.5, 0]}>
                <primitive object={phone.scene} />
            </mesh>
            <mesh position={[4, 1, 0]}>
                <primitive object={tablet.scene} />
            </mesh>
        </>
    )
}

const Photo = ({ focus }: { focus: boolean }): JSX.Element => {
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const photo = useRef(null);

    useEffect(() => {
        focus ?
            photo.current && gsap.to(photo.current.position, { x: 0, y: 0, z: 0, duration: 2, ease: 'slow (0.1, 0.7, false)' }) :
            photo.current && gsap.to(photo.current.position, { x: 0, y: 0, z: 6, duration: 2, ease: 'slow (0.1, 0.7, false)' });
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
                {/* <Preload all /> */}
            </Suspense>
        </>
    )
})

export default Home;