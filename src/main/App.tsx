import React, { useEffect, useState } from 'react';
import '../styles/app.css';
import { AppContext } from '../context';
import Scene from '../scene/Scene';
import { Stats, useContextBridge } from '@react-three/drei';
import Effects from '../components/Effects';
import { ACESFilmicToneMapping, WebGLRenderer, PerspectiveCamera, sRGBEncoding } from 'three';
import { Canvas } from '@react-three/fiber';

const App = (): JSX.Element => {
  const ContextBridge = useContextBridge(AppContext);
  const [canvas, setCanvas] = useState<any>(null);
  const [camera, setCamera] = useState<PerspectiveCamera>(null);
  const [gl, setGL] = useState<WebGLRenderer>(null);

  const adjustCanvasSize = () => {
    // look up the size the canvas is being displayed
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    if (width == 0) return;

    if (width < 768)
      // swap width and height on mobile
      [width, height] = [height, width];

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      const ratio = window.devicePixelRatio;
      // you must pass false here or three.js sadly fights the browser
      gl.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // update any render target sizes here
    }
  }

  useEffect(() => {
    if (!camera || !gl) return;

    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize, false);
  }, [canvas?.clientWidth, camera, gl])

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
        onCreated={({ camera, gl, raycaster }) => {
          raycaster.layers.enableAll();
          gl.toneMapping = ACESFilmicToneMapping;
          setGL(gl);
          setCanvas(gl.domElement);
          setCamera(camera as PerspectiveCamera);
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
