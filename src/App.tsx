import React, { useContext, useMemo, useRef } from 'react';
import './styles/app.css';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Canvas, useFrame } from 'react-three-fiber';
import Navbar from './Navbar';
import Scene from './Scene';
import { Stats, useContextBridge } from '@react-three/drei';
import useMousePosition from './useMousePosition';

const navbar_items: Array<NavbarItem> = [
  { id: 0, name: 'education' },
  { id: 1, name: 'projects' },
  { id: 2, name: 'contact' },
]

export interface NavbarItem {
  id: number,
  name: string,
}

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
    particles.current.rotation.y = -0.1 * state.clock.getElapsedTime();
    if (x > 0) {
      particles.current.rotation.x = -y * (state.clock.getElapsedTime() * 0.000001);
      particles.current.rotation.y = x * (state.clock.getElapsedTime() * 0.000001);
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

const App = (): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const ContextBridge = useContextBridge(AppContext);

  return (
    <>
      <Navbar items={navbar_items} />
      <Canvas
        gl={{ antialias: true }}
        pixelRatio={window.devicePixelRatio}
        colorManagement={false}
        style={{ width: '100vw', height: '100vh' }}
        onCreated={({ camera, gl: { domElement } }) => {
          // camera.position.set(15, 0, -15);
          dispatch({
            type: Types.SetCanvas,
            payload: domElement,
          });
          dispatch({
            type: Types.SetCamera,
            payload: camera,
          });
        }}
      >
        <ContextBridge>
          <Scene />
        </ContextBridge>
        <Particles />
      </Canvas>
      <Stats showPanel={0} />
    </>
  )
}

export default App;
