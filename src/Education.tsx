import React, { useState, useRef } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { RoundedBox, Text } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

interface InstitutionItem {
    id: number,
    name: string,
    objSrc: string,
    desc: string,
    scale: number,
    x: number,
    y: number,
}

const Institution = ({ id, name, objSrc, desc, scale, x, y }: InstitutionItem): JSX.Element => {
    const obj = useLoader(OBJLoader, objSrc);

    useFrame(() => {
        obj.rotation.y += 0.01;
    })

    return (
        <group position={[x, y, -13]}>
            <mesh scale={[scale, scale, scale]}>
                <primitive object={obj} />
            </mesh>
            <Text
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={0.3}
                textAlign='center'
                anchorY={0.5}
            >
                {name}
            </Text>
            <Text
                color='#ff0000'
                font='fonts/Oswald.ttf'
                fontSize={0.15}
                textAlign='center'
                anchorY={1.5}
            >
                {desc}
            </Text>
        </group>
    )
}

const Education = React.memo(() => {
    const [institutionItems, setInstitutionItems] = useState<Array<InstitutionItem>>(
        [
            { id: 0, name: 'GIMNAZJUM\nW RZEZAWIE', objSrc: 'models/school.obj', desc: 'TUTAJ STAWIAŁEM SWOJE PIERWSZE KROKI\nPISAŁEM PROSTE STRONY I PROGRAMY\nSWOJĄ PRZYSZŁOŚĆ WIĄZAŁEM Z INFORMATYKĄ', scale: 0.1, x: -3, y: 1 },
            { id: 1, name: 'TECHNIKUM ŁĄCZNOŚCI\nNR 14 W KRAKOWIE', objSrc: 'models/college.obj', desc: 'TUTAJ POZNAŁEM BARDZIEJ ZAAWANSOWANE\nTECHNIKI PROGRAMOWANIA\nPOZNAŁEM PIERWSZE FRAMEWORKI\nSTWORZYŁEM WIELE ROZMAITYCH PROJEKTÓW', scale: 0.2, x: 0, y: 1 },
            { id: 2, name: 'POLITECHNIKA\nKRAKOWSKA', objSrc: 'models/uni.obj', desc: 'JESTEM NA PIERWSZYM ROKU\nNIESTACJONARNYCH STUDIÓW\nINFORMATYCZNYCH', scale: 0.2, x: 3, y: 1 },
        ]
    );

    return (
        <>
            {
                institutionItems.map((e: InstitutionItem, i: number) => <Institution key={i} {...e} />)
            }
        </>
    )
})

export default Education;