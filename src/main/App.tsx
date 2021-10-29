import React, { useContext, useEffect, useState } from 'react';
import '../styles/app.css';
import { AppContext } from '../context';
import Scene from '../scene/Scene';
import { Stats, useContextBridge } from '@react-three/drei';
import Effects from '../components/Effects';
import { ACESFilmicToneMapping, WebGLRenderer, PerspectiveCamera, sRGBEncoding } from 'three';
import { Types } from '../context/reducers';
import { Canvas } from '@react-three/fiber';
import DialogBox from '../components/DialogBox';
import { useTranslation } from 'react-i18next';

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
  const [canvas, setCanvas] = useState<any>(null);
  const [camera, setCamera] = useState<PerspectiveCamera>(null);
  const { dispatch } = useContext(AppContext);
  const { t } = useTranslation();

  const enterFullScreenMode = () => {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
    else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if (canvas.msRequestFullScreen) {
      canvas.msRequestFullScreen();
    } else {
      alert('Fullscreen not supported in your browser')
    }
  }

  const adjustCanvasSize = () => {
    // look up the size the canvas is being displayed
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    if (width < 768) {
      // swap width and height on mobile
      [width, height] = [height, width];

      dispatch({
        type: Types.SetMode,
        payload: 'mobile',
      });
    } else
      dispatch({
        type: Types.SetMode,
        payload: 'desktop',
      });

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
    if (!gl || !camera) return;

    // console.log = console.warn = () => { };
    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize, false);
  }, [gl, camera])

  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          physicallyCorrectLights: true,
          outputEncoding: sRGBEncoding
        }}
        dpr={window.devicePixelRatio}
        // raycaster={{
        //   filter: (items, state) => {
        //     console.log('raycaster', state.mouse)
        //     return items;
        //   }
        // }}
        shadows
        linear
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh'
        }}
        onCreated={({ camera, gl, raycaster }) => {
          // camera.position.set(15, 0, -15);
          raycaster.layers.enableAll();
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          setGL(gl);
          setCanvas(gl.domElement);
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
      {
        canvas?.clientWidth < 768 &&
        <DialogBox
          title={t('mobileDialog.0')}
          content={t('mobileDialog.1')}
          agreeTxt={t('mobileDialog.2')}
          disagreeTxt={t('mobileDialog.3')}
          onAgreed={enterFullScreenMode}
        />
      }
      <Stats showPanel={0} />
    </>
  )
}

export default App;
