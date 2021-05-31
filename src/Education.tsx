import React, { Suspense, useContext, useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';
import { AppContext } from './context';
import gsap from 'gsap';

interface InstitutionItem {
    id: number,
    name?: string,
    objSrc: string,
    desc?: string,
    scale: number,
    x: number,
    y: number,
    focus?: boolean
}

const Institution = ({ id, name, objSrc, desc, scale, x, y, focus }: InstitutionItem): JSX.Element => {
    const obj = useLoader(GLTFLoader, objSrc);
    const insitution = useRef(null);

    useFrame(() => {
        obj.scene.rotation.y += 0.01;
    })

    useEffect(() => {
        focus ?
            insitution.current && gsap.to(insitution.current.scale, { x: 1, y: 1, z: 1, duration: 5, ease: 'expo.out' }) :
            insitution.current && gsap.to(insitution.current.scale, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
    }, [focus])

    return (
        <group
            ref={insitution}
            position={[x, y, -18]}
            scale={[0, 0, 0]}
        >
            <mesh scale={[scale, scale, scale]}>
                <primitive object={obj.scene} />
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
    const [institutionItems] = useState<Array<InstitutionItem>>(
        [
            { id: 0, objSrc: 'models/school.glb', scale: 0.1, x: -3, y: 1 },
            { id: 1, objSrc: 'models/college.glb', scale: 0.2, x: 0, y: 1 },
            { id: 2, objSrc: 'models/uni.glb', scale: 0.2, x: 3, y: 1 },
        ]
    );
    const { t } = useTranslation();
    const { state } = useContext(AppContext);
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'education.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    return (
        <Suspense fallback={<Loader />}>
            {
                institutionItems.map((e: InstitutionItem, i: number) =>
                    <Institution
                        key={i} {...e}
                        name={t(`educationTitles.${i}`)}
                        desc={t(`educationDesc.${i}`)}
                        focus={focus}
                    />
                )
            }
        </Suspense>
    )
})

export default Education;