import React from 'react';
import '../styles/app.css';
import { AppContext } from '../context';
import Scene from '../scene/Scene';
import { Stats, useContextBridge } from '@react-three/drei';
import Effects from '../components/Effects';
import { ACESFilmicToneMapping, sRGBEncoding } from 'three';
import { Canvas } from '@react-three/fiber';

const App = (): JSX.Element => {
  const ContextBridge = useContextBridge(AppContext);

  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          physicallyCorrectLights: true,
          outputEncoding: sRGBEncoding
        }}
        dpr={window.devicePixelRatio}
        camera={{ far: 20 }}
        linear
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh'
        }}
        onCreated={({ gl, raycaster }) => {
          raycaster.layers.enableAll();
          gl.toneMapping = ACESFilmicToneMapping;
        }}
      >
        <ContextBridge>
          <Scene />
        </ContextBridge>
        <Effects />
      </Canvas>
      <Stats showPanel={0} />
    </>
  )
}

export default App;
