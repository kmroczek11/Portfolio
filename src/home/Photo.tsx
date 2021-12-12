import { useEffect, useMemo, useRef } from 'react';
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { animate } from '../components/functions';
import photoVertexShader from '../shaders/photoVertex.glsl';
import photoFragmentShader from '../shaders/photoFragment.glsl';
import { DoubleSide } from 'three';

const row: number = 3;
const col: number = 4;

const Photo = ({ focus }: { focus: boolean }): JSX.Element => {
    const photo = useRef(null);
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const maskTexture = useLoader(TextureLoader, 'images/mask.png');

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const [positions, coordinates, speeds, offset] = useMemo(() => {
        const initialPositions: Array<number> = [];
        const initialCoordinates: Array<number> = [];
        const initialSpeeds: Array<number> = [];
        const initialOffset: Array<number> = [];

        for (let x = 0; x < row; x += 0.003) {
            let posX: number = x - row / 2;
            for (let y = 0; y < col; y += 0.003) {
                let posY: number = y - col / 2;
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
        move: { value: 5 },
        time: { value: 0 }
    }), [photoTexture, maskTexture])

    useEffect(() => {
        if (!photo.current) return;

        focus ?
            animate(photo.current.material.uniforms.move, { value: 0 }, 5, 'expo.out') :
            animate(photo.current.material.uniforms.move, { value: 5 }, 5, 'expo.out', null, () => photo.current.geometry.verticesNeedUpdate = true);
    }, [focus])

    return (
        <points
            ref={photo}
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
    )
}

export default Photo;