import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Sphere } from '@react-three/drei';
import globeVertexShader from '../shaders/globeVertex.glsl';
import globeFragmentShader from '../shaders/globeFragment.glsl';
import atmosphereVertexShader from '../shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from '../shaders/atmosphereFragment.glsl';
import { AdditiveBlending, BackSide, Texture } from 'three';
import useMousePosition from '../hooks/useMousePosition';
import { animate } from '../components/functions';

const Globe = ({ globeTexture, focus }: { globeTexture: Texture, focus: boolean }): JSX.Element => {
    const globe = useRef(null);
    const globeController = useRef(null);
    const { x, y } = useMousePosition('3D');

    useFrame(() => {
        if (!globe.current || !globeController.current) return;

        globe.current.rotation.y -= 0.005;
        animate(globeController.current.rotation, { x: -y * 0.3, y: x * 0.5 }, 2);
    })

    return (
        <>
            <group
                ref={globeController}
                position={[0, 0, -6]}
            >
                <Sphere
                    args={[5, 50, 50]}
                    ref={globe}
                >
                    <shaderMaterial
                        vertexShader={globeVertexShader}
                        fragmentShader={globeFragmentShader}
                        uniforms={
                            {
                                globeTexture: {
                                    value: globeTexture
                                }
                            }
                        }
                        attach="material"
                    />
                </Sphere>
            </group>
            <Sphere
                args={[5, 50, 50]}
                position={[0, 0, -6]}
                scale={[1.1, 1.1, 1.1]}
            >
                <shaderMaterial
                    vertexShader={atmosphereVertexShader}
                    fragmentShader={atmosphereFragmentShader}
                    blending={AdditiveBlending}
                    side={BackSide}
                    attach="material"
                />
            </Sphere>
        </>
    )
}

export default Globe;