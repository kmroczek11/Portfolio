import { useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { animate } from '../components/functions';

const Texts = ({ focus }: { focus: boolean }): JSX.Element => {
    const first = useRef(null);
    const second = useRef(null);
    const { t } = useTranslation();

    // useEffect(() => {
    //     if (!first.current || !second.current) return;

    //     const f = first.current;
    //     const s = second.current;

    //     if (focus) {
    //         animate(f.position, { x: -2, y: 0, z: 0.5 }, 5, 'expo.out');
    //         animate(s.position, { x: 2, y: -1, z: 0.5 }, 5, 'expo.out');
    //         animate(f, { fillOpacity: 1 }, 5, 'expo.out');
    //         animate(s, { fillOpacity: 1 }, 5, 'expo.out');
    //     } else {
    //         animate(f.position, { x: 0, y: 0, z: 0 }, 5, 'expo.out');
    //         animate(s.position, { x: 0, y: 0, z: 0 }, 5, 'expo.out');
    //         animate(f, { fillOpacity: 0 }, 5, 'expo.out');
    //         animate(s, { fillOpacity: 0 }, 5, 'expo.out');
    //     }
    // }, [focus])

    return (
        <>
            {/* <Text
                ref={first}
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
                fillOpacity={0}
                layers={1}
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
                layers={1}
            >
                {t('homeDesc.1')}
            </Text> */}
            <Text
                ref={first}
                position={[-2, 0, 0.5]}
                color='#fff'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
                layers={1}
            >
                {t('homeDesc.0')}
            </Text>
            <Text
                ref={second}
                position={[2, -1, 0.5]}
                color='#d4af37'
                font='fonts/Oswald.ttf'
                fontSize={1}
                textAlign='center'
                layers={1}
            >
                {t('homeDesc.1')}
            </Text>
        </>
    )
}

export default Texts;