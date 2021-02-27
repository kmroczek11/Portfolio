import React, { useContext } from 'react';
import './styles/navbar.css';
import { NavbarItem } from './Scene';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Html } from '@react-three/drei';
import { Shader, WebGLRenderer } from 'three';

interface NavProps {
    items: Array<NavbarItem>
}

const Navbar = React.memo(({ items }: NavProps) => {
    console.log('navbar rendered');
    const { state, dispatch } = useContext(AppContext);
    const { camera } = state.scene;

    const onClick = (element: string) => {
        dispatch({
            type: Types.SetCurrentElement,
            payload: element,
        })
    }

    return (
        <mesh position-y={3} renderOrder={999}>
            <meshStandardMaterial depthTest={false} />
            <Html fullscreen className='navbar-container'>
                <div className='logo-container' onClick={() => onClick('HOME')}>
                    <p className='full-name'>KAMIL MROCZEK</p>
                </div>
                <ul>
                    {
                        items.map((item: NavbarItem, index: number) =>
                            <li key={index} onClick={() => onClick(item.name)}>
                                <a>{item.name}</a>
                            </li>
                        )
                    }
                </ul>
            </Html>
        </mesh>
    )
})

export default Navbar;