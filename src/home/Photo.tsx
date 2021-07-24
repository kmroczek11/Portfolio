import { useEffect, useMemo, useRef } from 'react';
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import gsap from 'gsap';
import photoVertexShader from '../shaders/photoVertex.glsl';
import photoFragmentShader from '../shaders/photoFragment.glsl';
import { DoubleSide } from 'three';

const Photo = ({ focus }: { focus: boolean }): JSX.Element => {
    const photo = useRef(null);
    const row: number = 3;
    const col: number = 4;
    // const particlesNum: number = row * col;
    const photoTexture = useLoader(TextureLoader, 'images/photo.png');
    const maskTexture = useLoader(TextureLoader, 'images/mask.png');

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const [positions, coordinates, speeds, offset] = useMemo(() => {
        const initialPositions: Array<number> = [];
        const initialCoordinates: Array<number> = [];
        const initialSpeeds: Array<number> = [];
        const initialOffset: Array<number> = [];

        for (let y = 0; y < row; y += 0.01) {
            let posY: number = y - row / 2;
            for (let x = 0; x < col; x += 0.01) {
                let posX: number = x - col / 2;
                initialPositions.push(posY * 2);
                initialPositions.push(posX * 2);
                initialPositions.push(0);
                initialCoordinates.push(y);
                initialCoordinates.push(x);
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
    }), [])

    useEffect(() => {
        focus ?
            photo.current && gsap.to(photo.current.material.uniforms.move, { value: 0, duration: 5, ease: 'expo.out', }) :
            photo.current && gsap.to(photo.current.material.uniforms.move, { value: 5, duration: 5, ease: 'expo.out', onUpdate: () => photo.current.geometry.verticesNeedUpdate = true, });
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
            // depthTest={false}
            // depthWrite={false}
            />
        </points>
    )
}

export default Photo;