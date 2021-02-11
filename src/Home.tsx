import React, { useEffect, useRef, useState, Suspense, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useFrame, useLoader } from 'react-three-fiber'
import Oswald from './Oswald.json';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { FontLoader } from 'three/src/loaders/FontLoader';
import Loader from 'react-loader-spinner'
import * as TWEEN from 'three-tween';
import { Vector3 } from 'three/src/math/Vector3';
import { moveElement, rotateAroundPoint } from './functions';

const Texts = (): JSX.Element => {
    const font = new FontLoader().parse(Oswald);
    const texts = useRef([]);

    const textOptions = {
        font,
        size: 0.5,
        height: 1
    };

    useFrame(() => {
        [0, 1].forEach((e) => {
            var targetVector;
            e == 0 ? targetVector = new Vector3(-6, 0, 0) : targetVector = new Vector3(2, -1, 0);
            moveElement(texts.current[e], texts.current[e].position, targetVector);
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

    return (
        <mesh
            ref={circle}
            position={[0, 0, -1]}
            receiveShadow
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

    return (
        <>
            <mesh position={[-4, 1, 0]}>
                <primitive object={monitor} />
            </mesh>
            <mesh position={[-4, -0.2, 0]}>
                <primitive object={phone} />
            </mesh>
            <mesh position={[4, 1, 0]}>
                <primitive object={tablet} />
            </mesh>
        </>
    )
}

const Photo = (): JSX.Element => {
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const photo = useRef(null);
    const direction = new Vector3();

    useFrame(() => {
        moveElement(photo.current, photo.current.position, new Vector3(0, 0, 0));
    })

    return (
        <>
            <mesh
                ref={photo}
                position={[0, 0, -2]}
            >
                <planeGeometry args={[8, 8]} />
                <meshStandardMaterial transparent map={photoTexture} />
            </mesh>
            <Objects />
        </>
    )
}

const Home = (): JSX.Element => {
    return (
        <>
            <directionalLight position={[0, 1, 1]} intensity={1} color={'#fff'} />
            <Photo />
            <Circle />
            <Texts />
        </>
    )
}

export default Home;