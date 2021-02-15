import React, { useContext } from 'react';
import './styles/app.css';
import Navbar from './Navbar';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Canvas, extend, ReactThreeFiber } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import FPSStats from "react-fps-stats";
import Scene from './Scene';
extend({ OrbitControls, TransformControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

const navbar_items: Array<NavbarItem> = [
  { id: 0, name: 'EDUKACJA' },
  { id: 1, name: 'PROJEKTY' },
  { id: 2, name: 'KONTAKT' },
]

export interface NavbarItem {
  id: number,
  name: string,
}

const App = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <Navbar items={navbar_items} />
      <Canvas style={{ width: '100vw', height: '100vh' }}
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
        <AppContext.Provider value={{ state, dispatch }}>
          <Scene />
        </AppContext.Provider>
        {/* {state.scene.camera && state.scene.canvas && <orbitControls args={[state.scene.camera, state.scene.canvas]} />} */}
      </Canvas>
      <FPSStats />
    </>
  )
}

export default App;
