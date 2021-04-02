import React, { Suspense, useState } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Text } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';

interface InstitutionItem {
    id: number,
    name?: string,
    objSrc: string,
    desc?: string,
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
        <group position={[x, y, -18]}>
            <mesh scale={[scale, scale, scale]}>
                <primitive object={obj} />
                <meshBasicMaterial />
            </mesh>
            <Text
                color='#d4af37'
                font='fonts/Oswald.ttf'
                fontSize={0.3}
                textAlign='center'
                anchorY={0.5}
            >
                {name}
            </Text>
            <Text
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={0.15}
                textAlign='center'
                anchorY={2}
            >
                {desc}
            </Text>
        </group>
    )
}

const Education = React.memo(() => {
    const [institutionItems, setInstitutionItems] = useState<Array<InstitutionItem>>(
        [
            { id: 0, objSrc: 'models/school.obj', scale: 0.1, x: -3, y: 1 },
            { id: 1, objSrc: 'models/college.obj', scale: 0.2, x: 0, y: 1 },
            { id: 2, objSrc: 'models/uni.obj', scale: 0.2, x: 3, y: 1 },
        ]
    );
    const { t, i18n } = useTranslation();

    return (
        <Suspense fallback={<Loader />}>
            {
                institutionItems.map((e: InstitutionItem, i: number) => <Institution key={i} {...e} name={t(`educationTitles.${i}`)} desc={t(`educationDesc.${i}`)} />)
            }
        </Suspense>
    )
})

export default Education;