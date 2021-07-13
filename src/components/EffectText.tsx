import React, { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import { Color, ReactThreeFiber, useLoader } from 'react-three-fiber';
import { FontLoader } from 'three/src/loaders/FontLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Vector3 } from 'three/src/math/Vector3';
import './TextMaterial';

interface EffectTextItem {
    text: string,
    vAlign?: string,
    hAlign?: string,
    size?: number,
    color?: ReactThreeFiber.Color,
    opacity?: number,
    layers?: [channel: number],
}

const EffectText = forwardRef(({ text, vAlign = 'center', hAlign = 'center', size = 1, color = 'white', opacity = 1, layers, ...props }: EffectTextItem, ref): JSX.Element => {
    const font = useLoader(FontLoader, '/fonts/Roboto.json');
    const texture = useLoader(TextureLoader, '/fonts/Roboto.png');
    const config = useMemo(
        () => ({ font, size: 5, height: 2 }),
        [font]
    );
    const mesh = useRef(null);

    useLayoutEffect(() => {
        const size = new Vector3();
        mesh.current.geometry.computeBoundingBox();
        mesh.current.geometry.boundingBox.getSize(size);
        mesh.current.position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x;
        mesh.current.position.y = vAlign === 'center' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
    }, [text])

    return (
        <group ref={ref} {...props} scale={[0.1 * size, 0.1 * size, 0.1]}>
            <mesh ref={mesh} layers={layers}>
                <textGeometry args={[text, config]} />
                {/* <textMaterial
                    color={color}
                    opacity={opacity}
                    map={texture}
                /> */}
                <meshPhongMaterial color={0xFF0000}/>
            </mesh>
        </group>
    )
})

export default EffectText;