import React, { useContext, useEffect, useRef, useState } from 'react';
import '../styles/app.css';
import { AppContext } from '../context';
import Scene from '../scene/Scene';
import { Stats, useContextBridge } from '@react-three/drei';
import Effects from '../components/Effects';
import { ACESFilmicToneMapping, Intersection, Vector2, WebGLRenderer, PerspectiveCamera } from 'three';
import { Types } from '../context/reducers';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

// const Camera = (props) => {
//   const ref = useRef(null);
//   // const { setDefaultCamera } = useThree();
//   // useEffect(() => void setDefaultCamera(ref.current), [])
//   useFrame(() => ref.current.updateMatrixWorld())

//   return <perspectiveCamera ref={ref} {...props} />
// }

const App = (): JSX.Element => {
  const ContextBridge = useContextBridge(AppContext);
  const [gl, setGL] = useState<WebGLRenderer>(null);
  const [camera, setCamera] = useState<PerspectiveCamera>(null);

  const adjustCanvasSize = () => {
    if (gl && camera) {
      const canvas = gl.domElement;
      // look up the size the canvas is being displayed
      let width = canvas.clientWidth;
      let height = canvas.clientHeight;

      if (width < 768)
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
  }

  useEffect(() => {
    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize, false);
  }, [gl, camera])

  return (
    <>
      <Canvas
        gl={{ antialias: true }}
        dpr={window.devicePixelRatio}
        raycaster={{
          filter: (items, state) => {
            console.log('raycaster', state.mouse)
            return items;
          }
        }}
        shadows
        linear
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh'
        }}
        // raycaster={{
        //   filter: (intersects, s) => {
        //     console.log(s.mouse)
        //     return intersects;
        //   }
        // }}
        onCreated={({ camera, gl, raycaster }) => {
          camera.position.set(15, 0, -15);
          raycaster.layers.enableAll();
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          setGL(gl);
          setCamera(camera as PerspectiveCamera);
        }}
      >
        {/* <Camera/> */}
        <ContextBridge>
          <Scene />
        </ContextBridge>
        {/* <Particles /> */}
        <Effects />
      </Canvas>
      <Stats showPanel={0} />
    </>
  )
}

export default App;
