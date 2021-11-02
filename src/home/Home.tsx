import { memo, useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import Photo from './Photo'
import Globe from './Globe'
import Texts from './Texts'
import Objects from './Objects'
import { Group, LoadingManager, Mesh, MeshStandardMaterial, ObjectLoader, Texture, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useThree } from '@react-three/fiber';
import { RoughnessMipmapper } from 'three-stdlib';

const manager = new LoadingManager();

manager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
}

manager.onLoad = () => {
    console.log('Loading complete!');
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = (url) => {
    console.log('There was an error loading ' + url);
};

const TEXLoader = new TextureLoader(manager);
const OBJLoader = new GLTFLoader(manager).setPath('models/');;

const Home = memo(() => {
    console.log('home rendered');
    const { state } = useContext(AppContext);
    const { gl } = useThree();
    const { currentItem } = state.scene;
    const [focus, setFocus] = useState<boolean>(false);

    const [photoTexture, setPhotoTexture] = useState<Texture>(null)
    const [maskTexture, setMaskTexture] = useState<Texture>(null)
    const [globeTexture, setGlobeTexture] = useState<Texture>(null)

    const [desktopOBJ, setDesktopOBJ] = useState<Group>(null)
    const [phoneOBJ, setPhoneOBJ] = useState<Group>(null)
    const [tabletOBJ, setTabletOBJ] = useState<Group>(null)

    const loadObject = (path: string, callback: (gltf) => void) => {
        console.log('loading object')
        const roughnessMipmapper = new RoughnessMipmapper(gl);

        OBJLoader.load(path, (gltf) => {
            gltf.scene.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    (child as Mesh).material = new MeshStandardMaterial({
                        color: '#000',
                        metalness: 5,
                        roughness: 0
                    })

                    // @ts-ignore: Unreachable code error
                    if (child.material.map) child.material.map.anisotropy = 16;
                    roughnessMipmapper.generateMipmaps((child as Mesh).material as MeshStandardMaterial);
                }
            });
            roughnessMipmapper.dispose();
            callback(gltf.scene);
        })
    }

    useEffect(() => {
        TEXLoader.load('images/photo.png', (texture) => {
            setPhotoTexture(texture);
            TEXLoader.load('images/mask.png', (texture) => {
                setMaskTexture(texture);
                TEXLoader.load('images/textures/night.jpg', (texture) => {
                    setGlobeTexture(texture);
                    loadObject('desktop.glb', (gltf) => {
                        setDesktopOBJ(gltf);
                        loadObject('phone.glb', (gltf) => {
                            setPhoneOBJ(gltf);
                            loadObject('tablet.glb', (gltf) => {
                                setTabletOBJ(gltf);
                            })
                        })
                    })
                })
            })
        });
    }, [])

    useEffect(() => {
        currentItem === 'home.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])

    return (
        <>

            {
                photoTexture && maskTexture &&
                <Photo
                    photoTexture={photoTexture}
                    maskTexture={maskTexture}
                    focus={focus}
                />
            }
            {
                globeTexture &&
                <Globe globeTexture={globeTexture}
                    focus={focus} />
            }
            <Texts focus={focus} />
            {
                desktopOBJ && phoneOBJ && tabletOBJ &&
                <Objects
                    desktopOBJ={desktopOBJ}
                    phoneOBJ={phoneOBJ}
                    tabletOBJ={tabletOBJ}
                />
            }
        </>
    )
})

export default Home;