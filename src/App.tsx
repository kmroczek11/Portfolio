import React, { useContext } from 'react';
import './styles/app.css';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Canvas } from 'react-three-fiber';
import Navbar from './Navbar';
import Scene from './Scene';
import { Stars, Stats, useContextBridge } from '@react-three/drei';

const navbar_items: Array<NavbarItem> = [
  { id: 0, name: 'education' },
  { id: 1, name: 'projects' },
  { id: 2, name: 'contact' },
]

export interface NavbarItem {
  id: number,
  name: string,
}

const App = (): JSX.Element => {
  const { dispatch } = useContext(AppContext);
  const ContextBridge = useContextBridge(AppContext);

  return (
    <>
      <Navbar items={navbar_items} />
      <Canvas
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
        {/* <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={4} // Size factor (default=4)
          saturation={0} // Saturation 0-1 (default=0)
          fade // Faded dots (default=false)
        /> */}
      </Canvas>
      <Stats showPanel={0} />
    </>
  )
}

export default App;
