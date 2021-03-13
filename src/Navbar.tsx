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
            <div className="logo-container">
                <svg
                    className="logo"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 100"
                    fill="rgba(255, 255, 255, 0)"
                >
                    <path d="M 50 100 L 50 0 L 100 50 L 150 0 L 150 100" />
                </svg>
                <Link className='full-name' to={'/'}>KAMIL MROCZEK</ Link>
            </div>
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