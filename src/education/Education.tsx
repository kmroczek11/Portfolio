import { Fragment, memo, useContext, useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context';
import { animate } from '../components/functions';

interface InstitutionItem {
    name?: string,
    objSrc: string,
    desc?: string,
    x: number,
    y: number,
    focus?: boolean
}

const Institution = ({ name, objSrc, desc, x, y, focus }: InstitutionItem): JSX.Element => {
    const obj = useLoader(GLTFLoader, objSrc);
    const insitution = useRef(null);

    useFrame(() => {
        obj.scene.rotation.y += 0.01;
    })

    useEffect(() => {
        if (!insitution.current) return;
        focus ?
            animate(insitution.current.scale, { x: 1, y: 1, z: 1 }, 5, 'expo.out') :
            animate(insitution.current.scale, { x: 0, y: 0, z: 0 }, 5, 'expo.out');
    }, [focus])

    useEffect(() => {
        obj.scene.traverse((object) => {
            object.layers.set(2);
        });
    }, [obj])

    return (
        <group
            ref={insitution}
            position={[x, y, -18]}
        >
            <mesh rotation-x={1.2}>
                <primitive object={obj.scene} />
                <meshStandardMaterial />
            </mesh>
            <Text
                color='#e6cd7e'
                font='fonts/Oswald.ttf'
                fontSize={0.25}
                textAlign='center'
                anchorY={1.3}
                layers={1}
            >
                {name}
            </Text>
            <Text
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={0.12}
                textAlign='center'
                anchorY={2.5}
                layers={1}
            >
                {desc}
            </Text>
        </group>
    )
}

const Education = memo(() => {
    const [institutionItems] = useState<Array<InstitutionItem>>(
        [
            { objSrc: 'models/school.glb', x: -3, y: 1 },
            { objSrc: 'models/college.glb', x: 0, y: 1 },
            { objSrc: 'models/uni.glb', x: 3, y: 1 },
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
        <>
            {
                institutionItems.map((institution: InstitutionItem, index: number) =>
                    <Fragment key={index}>
                        <Institution
                            name={t(`educationTitles.${index}`)}
                            desc={t(`educationDesc.${index}`)}
                            focus={focus}
                            {...institution}
                        />
                    </Fragment>
                )
            }
        </>
    )
})

export default Education;