import React, { useEffect, useRef, useState, Suspense, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useLoader, extend, useThree, ReactThreeFiber, Camera } from 'react-three-fiber'
import Oswald from './Oswald.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { FontLoader } from 'three/src/loaders/FontLoader';
import Loader from 'react-loader-spinner'
import { MutableRefObject } from 'react';
import { Vector3 } from 'three/src/math/Vector3';
import * as TWEEN from 'three-tween';
import FPSStats from "react-fps-stats";
extend({ OrbitControls, TransformControls })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
        }
    }
}

const Texts = (): JSX.Element => {
    const font = new FontLoader().parse(Oswald);
    const texts = useRef([]);
    const direction = new Vector3();
    const speed = 0.01;

    const textOptions = {
        font,
        size: 0.5,
        height: 1
    };

    useFrame(() => {
        [0, 1].forEach((e) => {
            const { position } = texts.current[e];
            var targetVector;
            e == 0 ? targetVector = new Vector3(-6, 0, 0) : targetVector = new Vector3(2, -1, 0);
            direction.subVectors(targetVector, position);
            const vector = direction.multiplyScalar(speed);

            texts.current[e].position.x += vector.x;
            texts.current[e].position.y += vector.y;
            texts.current[e].position.z += vector.z;
        })
    })

    return (
        <>
            <mesh ref={el => texts.current[0] = el}>
                <textGeometry args={['DEWELOPER, KTÓREGO', textOptions]} />
                <meshStandardMaterial />
            </mesh>
            <mesh ref={el => texts.current[1] = el}>
                <textGeometry args={['POTRZEBUJESZ', textOptions]} />
                <meshStandardMaterial color={'#ff4d17'} />
            </mesh>
        </>
    )
}

const Circle = (): JSX.Element => {
    const circle = useRef(null);
    const [scale, setScale] = useState<number>(1);
    const [reverse, setReverse] = useState<boolean>(null);

    useFrame(() => {
        // if (scale == 1) setReverse(false);
        // if (scale == 0) setReverse(true);
        // if (reverse) setScale(scale + 0.001);
        // if (!reverse) setScale(scale - 0.001);
    })

    return (
        <mesh
            ref={circle}
            position={[0, 0, -1]}
            receiveShadow
            scale={[1, 1, scale]}
        >
            <circleGeometry args={[3.5, 100]} />
            <meshPhongMaterial color={'#000'} />
        </mesh>
    )
}

const Objects = (): JSX.Element => {
    const monitor = useLoader(OBJLoader, 'models/monitor.obj');
    const phone = useLoader(OBJLoader, 'models/phone.obj');
    const tablet = useLoader(OBJLoader, 'models/tablet.obj');

    useFrame(() => {
        rotateAroundPoint(monitor, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1 * Math.PI / 180, true)
        rotateAroundPoint(phone, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1 * Math.PI / 180, true)
        rotateAroundPoint(tablet, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1 * Math.PI / 180, true)
    })

    const rotateAroundPoint = (obj, point, axis, theta, pointIsWorld) => {
        pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

        if (pointIsWorld) {
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if (pointIsWorld) {
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }

    return (
        <>
            <mesh position={[-4, 2, 0]} scale={[0.1, 0.1, 0.1]}>
                <primitive object={monitor} />
            </mesh>
            <mesh position={[-4, -1, 0]} rotation={[0, 90, 0]}>
                <primitive object={phone} />
            </mesh>
            <mesh position={[4, 2, 0]} scale={[0.01, 0.01, 0.01]} rotation={[0, 20, 0]}>
                <primitive object={tablet} />
            </mesh>
        </>
    )
}

const Photo = (): JSX.Element => {
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const photo = useRef(null);

    return (
        <>
            <mesh
                ref={photo}
            >
                <planeGeometry args={[8, 8]} />
                <meshStandardMaterial transparent map={photoTexture} />
            </mesh>
            <Objects />
        </>
    )
}

const Home = (): JSX.Element => {
    const [camera, setCamera] = useState<Camera>(null)
    const [canvas, setCanvas] = useState<HTMLCanvasElement>(null)

    return (
        <>
            <Canvas style={{ width: '100vw', height: '100vh' }}
                onCreated={({ camera, gl: { domElement } }) => {
                    setCamera(camera);
                    setCanvas(domElement);
                }}
            >
                <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} />
                <Suspense fallback={
                    null
                }>
                    <Photo />
                    <Circle />
                    <Texts />
                </Suspense>
                {camera && canvas && <orbitControls args={[camera, canvas]} />}
            </Canvas>
            <FPSStats />
        </>
    )
}

export default Home;