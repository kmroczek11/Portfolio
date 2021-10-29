import { useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

const Texts = ({ focus }: { focus: boolean }): JSX.Element => {
    const first = useRef(null);
    const second = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!first.current || !second.current) return;
        if (focus) {
            gsap.to(first.current.position, { x: -2, y: 0, z: 0.5, duration: 5, ease: 'expo.out' });
            gsap.to(second.current.position, { x: 2, y: -1, z: 0.5, duration: 5, ease: 'expo.out' });
            gsap.to(first.current, { duration: 5, ease: 'expo.out', fillOpacity: 1 });
            gsap.to(second.current, { duration: 5, ease: 'expo.out', fillOpacity: 1 });
        } else {
            gsap.to(first.current.position, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
            gsap.to(second.current.position, { x: 0, y: 0, z: 0, duration: 5, ease: 'expo.out' });
            gsap.to(first.current, { duration: 5, ease: 'expo.out', fillOpacity: 0 });
            gsap.to(second.current, { duration: 5, ease: 'expo.out', fillOpacity: 0 });
        }
    }, [focus])

    return (
        <>
            <Text
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
            </Text>
        </>
    )
}

export default Texts;