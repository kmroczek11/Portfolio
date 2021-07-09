import { memo, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Vector3 } from 'three/src/math/Vector3';
import { rotateAroundPoint } from './functions';
import { Sphere, Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { AppContext } from './context';
import Loader from './Loader';
import gsap from 'gsap';
import globeVertexShader from './shaders/globeVertex.glsl';
import globeFragmentShader from './shaders/globeFragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';
import photoVertexShader from './shaders/photoVertex.glsl';
import photoFragmentShader from './shaders/photoFragment.glsl';
import { AdditiveBlending, BackSide, Color, DoubleSide } from 'three';
import useMousePosition from './useMousePosition';
import EffectText from './EffectText';

const Globe = ({ focus }: { focus: boolean }): JSX.Element => {
    const globe = useRef(null);
    const globeController = useRef(null);
    const { x, y } = useMousePosition('3D');

    useFrame(() => {
        if (globe.current)
            globe.current.rotation.y -= 0.005;
        if (globeController.current)
            gsap.to(globeController.current.rotation, { x: -y * 0.3, y: x * 0.5, duration: 2 })
    })

    return (
        <>
            <group
                ref={globeController}
                position={[0, 0, -6]}
            >
                <Sphere
                    args={[5, 50, 50]}
                    ref={globe}
                >
                    <shaderMaterial
                        vertexShader={globeVertexShader}
                        fragmentShader={globeFragmentShader}
                        uniforms={
                            {
                                globeTexture: {
                                    value: new TextureLoader().load('images/textures/night.jpg')
                                }
                            }
                        }
                        attach="material"
                    />
                </Sphere>
            </group>
            <Sphere
                args={[5, 50, 50]}
                position={[0, 0, -6]}
                scale={[1.1, 1.1, 1.1]}
            >
                <shaderMaterial
                    vertexShader={atmosphereVertexShader}
                    fragmentShader={atmosphereFragmentShader}
                    blending={AdditiveBlending}
                    side={BackSide}
                    attach="material"
                />
            </Sphere>
        </>
    )
}

const Texts = ({ focus }: { focus: boolean }): JSX.Element => {
    const first = useRef(null);
    const second = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (focus) {
            first.current && gsap.to(first.current.position, { x: -2, y: 0, z: 0.5, duration: 5, ease: 'expo.out' });
            second.current && gsap.to(second.current.position, { x: 2, y: -1, z: 0.5, duration: 5, ease: 'expo.out' });
            first.current && gsap.to(first.current, { duration: 5, ease: 'expo.out', fillOpacity: 1 });
            second.current && gsap.to(second.current, { duration: 5, ease: 'expo.out', fillOpacity: 1 });
        } else {
            first.current && gsap.to(first.current.position, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
            second.current && gsap.to(second.current.position, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
            first.current && gsap.to(first.current, { duration: 5, ease: 'expo.out', fillOpacity: 0 });
            second.current && gsap.to(second.current, { duration: 5, ease: 'expo.out', fillOpacity: 0 });
        }
    }, [focus])

    return (
        <>
            <Text
                ref={first}
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
                fillOpacity={0}
                layers={[1]}
            >
                {t('homeDesc.0')}
            </Text>
            <Text
                ref={second}
                color='#d4af37'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
                fillOpacity={0}
                layers={[1]}
            >
                {t('homeDesc.1')}
            </Text>
        </>
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
    const photo = useRef(null);
    const row: number = 3;
    const col: number = 4;
    // const particlesNum: number = row * col;
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const maskTexture = useLoader(TextureLoader, 'images/mask.png');

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const [positions, coordinates, speeds, offset] = useMemo(() => {
        const initialPositions: Array<number> = [];
        const initialCoordinates: Array<number> = [];
        const initialSpeeds: Array<number> = [];
        const initialOffset: Array<number> = [];

        for (let y = 0; y < row; y += 0.01) {
            let posY: number = y - row / 2;
            for (let x = 0; x < col; x += 0.01) {
                let posX: number = x - col / 2;
                initialPositions.push(posY * 2);
                initialPositions.push(posX * 2);
                initialPositions.push(0);
                initialCoordinates.push(y);
                initialCoordinates.push(x);
                initialCoordinates.push(0);
                initialSpeeds.push(rand(0.4, 1));
                initialOffset.push(rand(0, 5));
            }
        }

        const positions: Float32Array = new Float32Array(initialPositions);
        const coordinates: Float32Array = new Float32Array(initialCoordinates);
        const speeds: Float32Array = new Float32Array(initialSpeeds);
        const offset: Float32Array = new Float32Array(initialOffset);
        return [positions, coordinates, speeds, offset];
    }, [])

    const uniforms = useMemo(() => ({
        progress: { value: 0 },
        photo: { value: photoTexture },
        mask: { value: maskTexture },
        move: { value: 5 },
        time: { value: 0 }
    }), [])

    useEffect(() => {
        focus ?
            photo.current && gsap.to(photo.current.material.uniforms.move, { value: 0, duration: 5, ease: 'expo.out', }) :
            photo.current && gsap.to(photo.current.material.uniforms.move, { value: 5, duration: 5, ease: 'expo.out', onUpdate: () => { console.log(photo.current.material.uniforms.move); photo.current.geometry.verticesNeedUpdate = true }, });
    }, [focus])

    return (
        <points
            ref={photo}
        >
            <bufferGeometry>
                <bufferAttribute
                    attachObject={["attributes", "position"]}
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attachObject={["attributes", "aCoordinates"]}
                    count={coordinates.length / 3}
                    array={coordinates}
                    itemSize={3}
                />
                <bufferAttribute
                    attachObject={["attributes", "aSpeed"]}
                    count={speeds.length}
                    array={speeds}
                    itemSize={1}
                />
                <bufferAttribute
                    attachObject={["attributes", "aOffset"]}
                    count={offset.length}
                    array={offset}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={photoVertexShader}
                fragmentShader={photoFragmentShader}
                uniforms={uniforms}
                side={DoubleSide}
                transparent={true}
                // depthTest={false}
                // depthWrite={false}
            />
        </points>
    )
}

const Home = memo(() => {
    console.log('home rendered');
    const { state } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'home.end' ? setFocus(true) : setFocus(false);
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