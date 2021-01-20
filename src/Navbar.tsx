import React, { useCallback, useContext } from 'react';
import './styles/navbar.css';
import { NavbarItem } from './App';
import { motion } from 'framer-motion';
import { AppContext } from './context';
import { useFrame } from 'react-three-fiber';
import { moveElement } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { Types } from './reducers';

const icon = {
    hidden: {
        opacity: 0,
        pathLength: 0,
        fill: 'rgba(255,77,23,0)'
    },
    visible: {
        opacity: 1,
        pathLength: 1,
        fill: 'rgba(255,77,23,0)'
    }
};

interface NavProps {
    items: Array<NavbarItem>
}

const Navbar = ({ items }: NavProps): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);

    const onClick = (element: string) => {
        dispatch({
            type: Types.SetCurrentElement,
            payload: element,
        })
    }

    return (
        <div className='navbar-container'>
            <div className='logo-container'>
                <motion.svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 200 100'
                    className='logo'
                >
                    <motion.path
                        d='M 50 100 L 50 0 L 100 50 L 150 0 L 150 100'
                        variants={icon}
                        initial='hidden'
                        animate='visible'
                        transition={{
                            default: { duration: 2, ease: 'easeInOut' },
                            fill: { duration: 2, ease: [1, 0, 0.8, 1] }
                        }}
                    />
                </motion.svg>
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
        </div>
    )
}

export default Navbar;