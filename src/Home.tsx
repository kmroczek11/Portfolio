import React, { useEffect, useRef, useState, Suspense, forwardRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Vector3 } from 'three/src/math/Vector3';
import { tweenObject, rotateAroundPoint } from './functions';
import { Text } from '@react-three/drei';
import { Euler, MeshStandardMaterial } from 'three';
import TWEEN from '@tweenjs/tween.js';

const Texts = (): JSX.Element => {
    const texts = useRef([]);

    useEffect(() => {
        [0, 1].forEach((e) => {
            var targetVector;
            e == 0 ? targetVector = new Vector3(-2, 0, 0.5) : targetVector = new Vector3(2, -1, 0.5);
            tweenObject(texts.current[e].position, targetVector, {
                duration: 5000,
                easing: TWEEN.Easing.Quadratic.InOut,
                update: (d: Vector3) => {
                    // console.log(`Updating: ${d}`);
                },
                callback: () => {
                    // console.log('Completed');
                }
            })
        })
    }, [])

    return (
        <>
            <Text
                ref={el => texts.current[0] = el}
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
            >
                DEWELOPER, KTÓREGO
            </Text>
            <Text
                ref={el => texts.current[1] = el}
                color='#ff0000'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
            >
                POTRZEBUJESZ
            </Text>
        </>
    )
}

const Circle = (): JSX.Element => {
    const circle = useRef(null);

    return (
        <mesh
            ref={circle}
            position={[0, 0, -0.5]}
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

    const degToRad = (degrees: number) => degrees * (Math.PI / 180);

    useFrame(() => {
        rotateAroundPoint(monitor, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        rotateAroundPoint(phone, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        rotateAroundPoint(tablet, new Vector3(0, 0, 0), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        TWEEN.update();
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

const Photo = (): JSX.Element => {
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const photo = useRef(null);

    useEffect(() => {
        tweenObject(photo.current.position, new Vector3(0, 0, 0), {
            duration: 5000,
            easing: TWEEN.Easing.Quadratic.InOut,
            update: (d: Vector3) => {
                // console.log(`Updating: ${d}`);
            },
            callback: () => {
                // console.log('Completed');
            }
        })
    }, [])

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

const Home = React.memo(() => {
    console.log('home rendered');

    return (
        <>
            <Photo />
            <Circle />
            <Texts />
        </>
    )
})

export default Home;