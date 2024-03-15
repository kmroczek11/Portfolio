import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { animate } from '../components/functions';
import photoVertexShader from '../shaders/photoVertex.glsl';
import photoFragmentShader from '../shaders/photoFragment.glsl';
import { DoubleSide } from 'three';

const ROW: number = 3;
const COL: number = 4;
const STEP: number = 0.01;

const Photo = ({ focus }: { focus: boolean }): JSX.Element => {
    const photo = useRef(null);
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const maskTexture = useLoader(TextureLoader, 'images/mask.png');
    const [isActive, setIsActive] = useState<boolean>(focus);

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const [positions, coordinates, speeds, offset] = useMemo(() => {
        const initialPositions: Array<number> = [];
        const initialCoordinates: Array<number> = [];
        const initialSpeeds: Array<number> = [];
        const initialOffset: Array<number> = [];

        for (let x = 0; x < ROW; x += STEP) {
            let posX: number = x - ROW / 2;
            for (let y = 0; y < COL; y += STEP) {
                let posY: number = y - COL / 2;
                initialPositions.push(posX * 2);
                initialPositions.push(posY * 2);
                initialPositions.push(0);
                initialCoordinates.push(x);
                initialCoordinates.push(y);
                initialCoordinates.push(0);
                initialSpeeds.push(rand(0.4, 1));
                initialOffset.push(rand(0, 5));
            }
        }

        const positions: Float32Array = new Float32Array(initialPositions);
        const coordinates: Float32Array = new Float32Array(initialCoordinates);
        const speeds: Float32Array = new Float32Array(initialSpeeds);
        const offset: Float32Array = new Float32Array(initialOffset);

        return [positions, coordinates, speeds, offset];
    }, [])

    const uniforms = useMemo(() => ({
        progress: { value: 0 },
        photo: { value: photoTexture },
        mask: { value: maskTexture },
        move: { value: 0 },
        time: { value: 0 }
    }), [photoTexture, maskTexture])

    useEffect(() => {
        if (!photo.current) return;

        setIsActive(true);

        focus ?
            animate(photo.current.material.uniforms.move, { value: 0 }, 5, 'expo.out', () => setIsActive(false)) :
            animate(photo.current.material.uniforms.move, { value: 5 }, 5, 'expo.out', () => focus && setIsActive(false));
    }, [focus])

    return (
        <>
            {/* <points
                ref={photo}
                visible={isActive}
            >
                <bufferGeometry>
                    <bufferAttribute
                        attachObject={["attributes", "position"]}
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attachObject={["attributes", "aCoordinates"]}
                        count={coordinates.length / 3}
                        array={coordinates}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attachObject={["attributes", "aSpeed"]}
                        count={speeds.length}
                        array={speeds}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attachObject={["attributes", "aOffset"]}
                        count={offset.length}
                        array={offset}
                        itemSize={1}
                    />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={photoVertexShader}
                    fragmentShader={photoFragmentShader}
                    uniforms={uniforms}
                    side={DoubleSide}
                    transparent={true}
                />
            </points>
            <mesh visible={focus && !isActive}>
                <planeBufferGeometry attach='geometry' args={[ROW * 2, COL * 2]} />
                <meshBasicMaterial attach='material' map={photoTexture} transparent />
            </mesh> */}
            <mesh>
                <planeBufferGeometry attach='geometry' args={[ROW * 2, COL * 2]} />
                <meshBasicMaterial attach='material' map={photoTexture} transparent />
            </mesh> 
        </>
    )
}

export default Photo;