import React, { useCallback, useContext } from 'react';
import './styles/navbar.css';
import { NavbarItem } from './App';
import { motion } from 'framer-motion';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Link } from "react-router-dom";

interface NavProps {
    items: Array<NavbarItem>
}

const Navbar = ({ items }: NavProps): JSX.Element => {
    console.log('navbar rendered');
    const { state, dispatch } = useContext(AppContext);

    const onClick = (element: string) => {
        dispatch({
            type: Types.SetCurrentElement,
            payload: element,
        })
    }

    return (
        <>
            <Link className='full-name' to={'/'} onClick={() => onClick('HOME')} >KAMIL MROCZEK</ Link>
            <ul>
                {
                    items.map((item: NavbarItem, index: number) =>
                        <li key={index} onClick={() => onClick(item.name)}>
                            <Link to={item.link}>{item.name}</Link>
                        </li>
                    )
                }
            </ul>
        </>
    )
}

export default Navbar;