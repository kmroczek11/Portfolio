import React, { useContext } from 'react';
import './styles/app.css';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Canvas } from 'react-three-fiber';
import Navbar from './Navbar';
import Scene from './Scene';
import { Stats, useContextBridge } from '@react-three/drei';

const navbar_items: Array<NavbarItem> = [
  { id: 0, name: 'EDUKACJA', link: '/education' },
  { id: 1, name: 'PROJEKTY', link: '/projects' },
  { id: 2, name: 'KONTAKT', link: '/contact' },
]

export interface NavbarItem {
  id: number,
  name: string,
  link: string,
}

const App = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const ContextBridge = useContextBridge(AppContext);

  return (
    <>
      <Navbar items={navbar_items} />
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
      </Canvas>
      <Stats showPanel={0} />
    </>
  )
}

export default App;
