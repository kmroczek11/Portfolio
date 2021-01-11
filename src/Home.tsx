import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useLoader, extend, useThree, ReactThreeFiber, Camera } from 'react-three-fiber'
import Oswald from './Oswald.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { FontLoader } from 'three/src/loaders/FontLoader';
extend({ OrbitControls, TransformControls })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
        }
    }
}

const Home = (): JSX.Element => {
    const [camera, setCamera] = useState<Camera>(null)
    const [canvas, setCanvas] = useState<HTMLCanvasElement>(null)
    const circle = useRef(null);
    const photo = useRef(null);
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const font = new FontLoader().parse(Oswald);
    const monitor = useLoader(OBJLoader, 'models/monitor.obj');
    const phone = useLoader(OBJLoader, 'models/phone.obj');
    const tablet = useLoader(OBJLoader, 'models/tablet.obj');

    const textOptions = {
        font,
        size: 0.5,
        height: 1
    };

    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}
            onCreated={({ camera, gl: { domElement } }) => {
                setCamera(camera);
                setCanvas(domElement);
            }}
        >
            <directionalLight position={[0, 0, 1]} intensity={1} color={'#fff'} />
            <mesh
                ref={circle}
                position={[0, 0, -1]}
                receiveShadow>
                <circleGeometry args={[3.5, 100]} />
                <meshPhongMaterial color={'#000'} />
            </mesh>
            <mesh
                ref={photo}
            >
                <planeGeometry args={[8, 8]} />
                <meshStandardMaterial transparent map={photoTexture} />
            </mesh>
            <mesh position={[-6, 0, 0]}>
                <textGeometry args={['DEWELOPER, KTÓREGO', textOptions]} />
                <meshStandardMaterial />
            </mesh>
            <mesh position={[2, -1, 0]}>
                <textGeometry args={['POTRZEBUJESZ', textOptions]} />
                <meshStandardMaterial color={'#ff4d17'} />
            </mesh>
            <mesh position={[-6, 2, 0]} scale={[0.1, 0.1, 0.1]}>
                <primitive object={monitor} />
            </mesh>
            <mesh position={[-5, -1, 0]}>
                <primitive object={phone} />
            </mesh>
            <mesh position={[4, 2, 0]} scale={[0.01, 0.01, 0.01]}>
                <primitive object={tablet} />
            </mesh>
            {camera && canvas && <orbitControls args={[camera, canvas]} />}
        </Canvas>
    )
}

export default Home;