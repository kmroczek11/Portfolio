import React, { useContext, useState } from 'react';
import './styles/navbar.css';
import { NavbarItem } from './App';
import { AppContext } from './context';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface NavProps {
    items: Array<NavbarItem>
}

interface LanguageItem {
    name: string,
    src: string,
}

const Navbar = ({ items }: NavProps): JSX.Element => {
    console.log('navbar rendered');
    const { state } = useContext(AppContext);
    const [languages] = useState<Array<LanguageItem>>([
        { name: 'pl', src: 'images/flags/poland.png' },
        { name: 'en', src: 'images/flags/england.png' }
    ]);
    const { t, i18n } = useTranslation();

    const onClick = (language: string) => i18n.changeLanguage(language);

    return !state.scene.fullScreen ? (
        <div className='navbar-container'>
            <Link className='full-name' to={'/'}>KAMIL MROCZEK</ Link>
            <ul>
                {
                    items.map((item: NavbarItem, index: number) =>
                        <li key={index}>
                            <Link to={item.link}>{t(`navItems.${index}`)}</Link>
                        </li>
                    )
                }
                {
                    languages.map((language: LanguageItem, index: number) =>
                        <img key={index} src={language.src} onClick={() => onClick(language.name)} />)
                }
            </ul>
        </div>
    ) : null;
}

export default Navbar;