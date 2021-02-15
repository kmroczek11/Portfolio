import React, { useState, useRef } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Oswald from './Oswald.json';
import { FontLoader } from 'three/src/loaders/FontLoader';

const Texts = (): JSX.Element => {
    const font = new FontLoader().parse(Oswald);
    const texts = useRef([]);

    const headerOptions = {
        font,
        size: 0.15,
        height: 0.5
    };

    const descOptions = {
        font,
        size: 0.1,
        height: 0
    };

    return (
        <>
            <mesh position={[-3.6, 0, -13]} ref={el => texts.current[0] = el}>
                <textGeometry args={['GIMNAZJUM W RZEZAWIE', headerOptions]} />
                <meshStandardMaterial color={'#ff4d17'} />
            </mesh>
            <mesh position={[-4.2, -0.4, -13]} ref={el => texts.current[1] = el}>
                <textGeometry args={['TUTAJ STAWIAŁEM SWOJE PIERWSZE KROKI\nPISAŁEM PROSTE STRONY I PROGRAMY\nSWOJĄ PRZYSZŁOŚĆ WIĄZAŁEM Z INFORMATYKĄ', descOptions]} />
                <meshStandardMaterial />
            </mesh>
            <mesh position={[-0.7, 0, -13]} ref={el => texts.current[2] = el}>
                <textGeometry args={['TECHNIKUM ŁĄCZNOŚCI\nNR 14 W KRAKOWIE', headerOptions]} />
                <meshStandardMaterial color={'#ff4d17'} />
            </mesh>
            <mesh position={[-1, -0.8, -13]} ref={el => texts.current[3] = el}>
                <textGeometry args={['TUTAJ POZNAŁEM BARDZIEJ ZAAWANSOWANE\nTECHNIKI PROGRAMOWANIA\nPOZNAŁEM PIERWSZE FRAMEWORKI\nSTWORZYŁEM WIELE ROZMAITYCH PROJEKTÓW', descOptions]} />
                <meshStandardMaterial />
            </mesh>
            <mesh position={[2.2, 0, -13]} ref={el => texts.current[4] = el}>
                <textGeometry args={['POLITECHNIKA\nKRAKOWSKA', headerOptions]} />
                <meshStandardMaterial color={'#ff4d17'} />
            </mesh>
            <mesh position={[2.4, -0.8, -13]} ref={el => texts.current[5] = el}>
                <textGeometry args={['JESTEM NA PIERWSZYM ROKU\nNIESTACJONARNYCH STUDIÓW\nINFORMATYCZNYCH', descOptions]} />
                <meshStandardMaterial />
            </mesh>
        </>
    )
}

const Objects = (): JSX.Element => {
    const school = useLoader(OBJLoader, 'models/school.obj');
    const college = useLoader(OBJLoader, 'models/college.obj');
    const uni = useLoader(OBJLoader, 'models/uni.obj');

    useFrame(() => {
        school.rotation.y += 0.01;
        college.rotation.y += 0.01;
        uni.rotation.y += 0.01;
    })

    return (
        <>
            <mesh position={[-3, 1, -13]} scale={[0.1, 0.1, 0.1]}>
                <primitive object={school} />
            </mesh>
            <mesh position={[0, 1, -13]} scale={[0.2, 0.2, 0.2]}>
                <primitive object={college} />
            </mesh>
            <mesh position={[3, 1, -13]} scale={[0.2, 0.2, 0.2]}>
                <primitive object={uni} />
            </mesh>
        </>
    )
}

const Education = React.memo(() => {
    return (
        <>
            <Objects />
            <Texts />
        </>
    )
})

export default Education;