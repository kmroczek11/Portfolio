import React, { useContext } from 'react';
import './styles/app.css';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Canvas, extend, ReactThreeFiber } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import FPSStats from "react-fps-stats";
import Scene from './Scene';
import { useContextBridge } from '@react-three/drei';
extend({ OrbitControls, TransformControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

const App = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const ContextBridge = useContextBridge(AppContext);

  return (
    <>
      <Canvas
        colorManagement={false}
        style={{ width: '100vw', height: '100vh' }}
        onCreated={({ camera, gl: { domElement } }) => {
          // camera.position.set(0, 0, -10);
          dispatch({
            type: Types.SetCanvas,
            payload: domElement,
          })
          dispatch({
            type: Types.SetCamera,
            payload: camera,
          })
        }}
      >
        <ContextBridge>
          <Scene />
        </ContextBridge>
        {/* {state.scene.camera && state.scene.canvas && <orbitControls args={[state.scene.camera, state.scene.canvas]} />} */}
      </Canvas>
      <FPSStats />
    </>
  )
}

export default App;
