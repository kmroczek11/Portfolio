import React, { Suspense, useContext, useState } from 'react';
import './styles/app.css';
import Navbar from './Navbar';
import Home from './Home';
import Loader from 'react-loader-spinner'
import { AppContext } from './context';
import { Types } from './reducers';
import { Canvas, extend, ReactThreeFiber, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import FPSStats from "react-fps-stats";
extend({ OrbitControls, TransformControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
}

const navbar_items: Array<NavbarItem> = [
  { id: 0, name: 'O MNIE', element: null },
  { id: 1, name: 'ŻYCIORYS', element: null },
  { id: 2, name: 'PROJEKTY', element: null },
  { id: 3, name: 'KONTAKT', element: null },
]

export interface NavbarItem {
  id: number,
  name: string,
  element: JSX.Element,
}

const App = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const [activeItem, setActiveItem] = useState<string>('HOME');

//   useFrame(() => {
//     const { position } = state.scene.camera;
//     const direction = new Vector3();
//     const speed = 0.01;
//     var targetVector = new Vector3(0, 0, 0);
//     direction.subVectors(targetVector, position);
//     const vector = direction.multiplyScalar(speed);

//     photo.current.position.x += vector.x;
//     photo.current.position.y += vector.y;
//     photo.current.position.z += vector.z;
// })

  const changeCameraPosition = (elementName: string) => {
    switch (elementName) {
      case 'O MNIE':
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Navbar items={navbar_items} />
      <Canvas style={{ width: '100vw', height: '100vh' }}
        onCreated={({ camera, gl: { domElement } }) => {
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
        <Home />
        {state.scene.camera && state.scene.canvas && <orbitControls args={[state.scene.camera, state.scene.canvas]} />}
      </Canvas>
      <FPSStats />
    </>
  )
}

export default App;
