import { Fragment, memo, Suspense, useContext, useEffect, useState } from 'react';
import './styles/navbar.css';
import { NavbarItem } from './Scene';
import { AppContext } from './context';
import { Types } from './context/reducers';
import { Html, Text } from '@react-three/drei';
import { MeshStandardMaterial, Shader, TextureLoader, WebGLRenderer } from 'three';
import { useTranslation } from 'react-i18next';
import { useLoader, useThree } from 'react-three-fiber';
import Loader from './Loader';

interface NavProps {
    items: Array<NavbarItem>
}

interface LanguageItem {
    imageSrc: string,
    name?: string,
    position?: number,
    onClick?: (element: string) => void,
}

interface ItemProps {
    name: string,
    position: number,
    onClick: (element: string) => void,
}

const Item = ({ name, position, onClick }: ItemProps): JSX.Element => {
    const [color, setColor] = useState<string>('#fff');

    return (
        <Text
            position-x={position}
            material-depthTest={false}
            // onBeforeRender={(renderer) => renderer.clearDepth()}
            onClick={() => onClick(name)}
            onPointerOver={() => setColor('#d4af37')}
            onPointerOut={() => setColor('#fff')}
            color={color}
            font='fonts/Oswald.ttf'
            fontSize={0.4}
            layers={[1]}
        >
            {name}
        </Text>
    )
}

const Language = ({ imageSrc, name, position, onClick }: LanguageItem) => {
    const texture = useLoader(TextureLoader, imageSrc);

    return (
        <mesh position-x={position} onClick={() => onClick(name)}>
            <planeBufferGeometry attach='geometry' args={[0.6, 0.6]} />
            <meshBasicMaterial
                attach='material'
                map={texture}
                depthTest={false}
                transparent
            />
        </mesh>
    )
}

const Navbar = memo(({ items }: NavProps) => {
    console.log('navbar rendered');
    const { state, dispatch } = useContext(AppContext);
    const { fullScreen } = state.scene;
    const [languages] = useState<Array<LanguageItem>>([
        { name: 'pl', imageSrc: 'images/flags/poland.png' },
        { name: 'en', imageSrc: 'images/flags/england.png' }
    ]);
    const { t, i18n } = useTranslation();
    const { camera } = useThree();
    const [hovered, setHovered] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    const onNavigationStarted = (name: string) => {
        dispatch({
            type: Types.SetCurrentItem,
            payload: name,
        });
    }

    const onLanguageChanged = (language: string) => {
        i18n.changeLanguage(language);
    };

    return !fullScreen ? (
        <group
            position={[camera.position.x, 3, camera.position.z - 5]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <group onClick={() => onNavigationStarted('home.to')}>
                <Text
                    position-x={-5}
                    color='#d4af37'
                    font='fonts/Oswald.ttf'
                    fontSize={1}
                    material-depthTest={false}
                    layers={[1]}
                >
                    M
                </Text>
                <Text
                    position-x={-3}
                    color='#fff'
                    font='fonts/Oswald.ttf'
                    fontSize={0.5}
                    material-depthTest={false}
                    layers={[1]}
                >
                    KAMIL MROCZEK
                </Text>
            </group>
            {
                items.map((item: NavbarItem, index: number) =>
                    <Fragment key={index}>
                        <Item
                            name={t(`navItems.${index}`)}
                            position={(index + 1) * 1.7}
                            onClick={() => onNavigationStarted(`${item.name}.to`)}
                        />
                    </Fragment>
                )
            }
            {
                languages.map((language: LanguageItem, index: number) =>
                    <Fragment key={index}>
                        <Suspense fallback={<Loader />}>
                            <Language
                                imageSrc={language.imageSrc}
                                name={language.name}
                                position={5.5 + (index + 1) * 0.7}
                                onClick={() => onLanguageChanged(language.name)}
                            />
                        </Suspense>
                    </Fragment>
                )
            }
        </group>
    ) : null;
})

export default Navbar;