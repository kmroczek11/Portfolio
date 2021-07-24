import React, { useMemo, useRef } from 'react';
import '../styles/app.css';
import useMousePosition from '../hooks/useMousePosition';
import { useFrame } from 'react-three-fiber';

const Particles = (): JSX.Element => {
    const particles = useRef(null);
    const { x, y } = useMousePosition('2D');
    const [coords] = useMemo(() => {
        const particlesCnt: number = 5000;
        const posArray = new Float32Array(particlesCnt * 3);
        for (let i = 0; i < particlesCnt * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        return [posArray]
    }, [])

    useFrame((state) => {
        if (particles.current) {
            particles.current.rotation.y = -0.1 * state.clock.getElapsedTime();
            if (x > 0) {
                particles.current.rotation.x = -y * (state.clock.getElapsedTime() * 0.000001);
                particles.current.rotation.y = x * (state.clock.getElapsedTime() * 0.000001);
            }
        }
    })

    return (
        <>
            <points ref={particles}>
                <bufferGeometry>
                    <bufferAttribute
                        attachObject={["attributes", "position"]}
                        count={coords.length / 3}
                        array={coords}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    sizeAttenuation
                    attach="material"
                    color='#fff'
                    opacity={0}
                    size={0.005}
                />
            </points>
        </>
    )
}

export default Particles;