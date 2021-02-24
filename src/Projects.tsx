import React, { Suspense, useContext, useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text } from '@react-three/drei';

interface ProjectItem {
    id: number,
    name: string,
    videoSrc: string,
    imageSrc: string,
    desc: string,
    x: number,
    y: number,
    active: boolean,
    onActive?: (name: string) => void,
}

const Project = ({ id, name, videoSrc, imageSrc, desc, x, y, active, onActive }: ProjectItem): JSX.Element => {
    // const [ax, ay] = useAspect('cover', 2, 3);
    const [hovered, setHovered] = useState<boolean>(false);
    const [video] = useState(() => {
        const vid = document.createElement('video');
        vid.src = videoSrc;
        vid.onerror = () => console.log(`${name} error ${vid.error.code}; details: ${vid.error.message}`);
        vid.crossOrigin = 'Anonymous';
        vid.loop = true;
        vid.controls = true;
        vid.load();
        return vid;
    });
    const project = useRef(null);
    const technologies = useRef(null);
    const description = useRef(null);
    const texture = useLoader(TextureLoader, imageSrc);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    useFrame(() => {
        if (active) {
            project && moveObject(project.current, project.current.position, new Vector3(10, 0.3, -11.5), 0.1);
            technologies && moveObject(technologies.current, technologies.current.position, new Vector3(10, -0.65, -11.5), 0.1);
            description && moveObject(description.current, description.current.position, new Vector3(11.2, 0.3, -11.6), 0.1);
        }
        if (!active) {
            project && moveObject(project.current, project.current.position, new Vector3(x, y, -13), 0.1);
            technologies && moveObject(technologies.current, technologies.current.position, new Vector3(x, y - 0.55, -13), 0.1);
            description && moveObject(description.current, description.current.position, new Vector3(x, y - 0.1, -13.1), 0.1);
        }
    })

    const onClick = () => {
        console.log('clicked a video');
        video.play();
        onActive(name);
    }

    return (
        <>
            <group
                ref={project}
                position={[x, y, -13]}
                // scale={[ax, ay, 1]}
                onClick={() => onClick()}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <mesh>
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial >
                        <videoTexture attach='map' args={[video]} />
                    </meshBasicMaterial>
                </mesh>
            </group>
            <mesh ref={technologies} position={[x, y - 0.55, -13]}>
                <planeBufferGeometry args={[1.5, 0.4]} />
                <meshStandardMaterial map={texture} transparent />
            </mesh>
            <group ref={description} position={[x, y - 0.1, -13.1]}>
                <mesh >
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshStandardMaterial color='#000' />
                </mesh>
                <group position-x={0.2}>
                    <Text
                        color='#ff0000'
                        font='fonts/Oswald.ttf'
                        fontSize={0.1}
                        maxWidth={0.5}
                        textAlign='center'
                        anchorY={-0.6}
                    >
                        {name}
                    </Text>
                    <Text
                        color='#fff'
                        font='fonts/Oswald.ttf'
                        fontSize={0.05}
                        maxWidth={1}
                        textAlign='center'
                        anchorY={-0.1}
                        lineHeight={2}
                    >
                        {desc}
                    </Text>
                </group>
            </group>
        </>
    )
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'PROJEKT STRONY GFE', videoSrc: 'videos/gfe.mp4', imageSrc: 'images/descriptions/gfe.svg', desc: 'STRONA STWORZONA NA PRAKTYKACH W TRZECIEJ KLASIE TECHNIKUM W FIRMIE BFIRST.TECH. JEJ MOTYWEM PRZEWODNIM JEST GÓRNICZE FORUM EKONOMICZNE AGH. PO RAZ PIERWSZY UŻYŁEM VUE.JS, KTÓREGO TEŻ WTEDY ZAZNAJOMIŁEM. SZATĘ GRAFICZNĄ WYKONAŁEM PRZY UŻYCIU UIKIT, A DO PRZESYŁANIA PUBLIKACJI ZASTOSOWAŁEM FIREBASE.', x: 7, y: 1, active: false },
        { id: 1, name: 'PROJEKT STRONY STALCRAFT', videoSrc: 'videos/stalcraft.mp4', imageSrc: 'images/photo.png', desc: 'PROSTA STRONA WYKONANA DLA FIRMY STALCRAFT.', x: 9, y: 1, active: false },
        { id: 2, name: 'PROJEKT SKLEPU INTERNETOWEGO', videoSrc: '', imageSrc: 'images/photo.png', desc: 'PROJEKT SKLEPU INTERNETOWEGO Z GRAMI KOMPUTEROWYMI UTWORZONY W CZWARTEJ KLASIE TECHNIKUM.', x: 11, y: 1, active: false },
        { id: 3, name: 'CORONASTATS', videoSrc: '', imageSrc: 'images/photo.png', desc: 'PROJEKT APLIKACJI MOBILNEJ PRZEDSTAWIAJĄCY ROZWÓJ SYTUACJI EPIDEMIOLOGICZNEJ ZWIĄZANEJ Z COVID-19. DANE POBIERANE SĄ Z OFICJALNEJ BAZY DANYCH WHO.', x: 13, y: 1, active: false },
        { id: 4, name: 'MARBLES', videoSrc: 'videos/marbles.mp4', imageSrc: 'images/photo.png', desc: 'PROJEKT KOŃCOWOROCZNY WYKONANY W TRZECIEJ KLASIE TECHNIKUM POLEGAJĄCY NA STWORZENIU GRY LOGICZNEJ. GRA POLEGA NA ZDOBYCIU JAK NAJWIĘKSZEJ ILOŚCI PUNKTÓW W JAK NAJKRÓTSZYM CZASIE. DODATKOWYM UTRUDNIENIEM SĄ POJAWIAJĄCE SIĘ DODATKOWE RZĘDY KULEK.', x: 7, y: -1, active: false },
        { id: 5, name: 'MP3 PLAYER', videoSrc: 'videos/mp3player.mp4', imageSrc: 'images/photo.png', desc: 'PROJEKT ODTWARZACZA MP3. UTWORY ŁADOWANE SĄ Z LOKALNYCH FOLDERÓW.', x: 9, y: -1, active: false },
        { id: 6, name: 'TASKY', videoSrc: '', imageSrc: 'images/photo.png', desc: 'PROJEKT APLIKACJI MOBILNEJ DO EFEKTYWNEGO ZARZĄDZANIA SWOIMI ZADANIAMI. APLIKACJA PRZEZNACZONA JEST DLA DZIECI, ABY TE JUŻ OD NAJMŁODSZYCH LAT UCZYŁY SIĘ LEPSZEGO ZARZĄDZANIA SWOIM CZASEM.', x: 11, y: -1, active: false },
        { id: 7, name: 'MOJE PORTFOLIO', videoSrc: '', imageSrc: 'images/photo.png', desc: 'PROJEKT MOJEGO PORTFOLIO.', x: 13, y: -1, active: false },
    ]);
    const [activeName, setActiveName] = useState<string>(null);

    useEffect(() => {
        setProjectItems(prevProjectItems =>
            prevProjectItems.map(
                (e: ProjectItem) =>
                    e.name == activeName ? { ...e, active: true } : { ...e, active: false }
            ))
    }, [activeName])

    return (
        <>
            {
                projectItems.map(
                    (e: ProjectItem, i: number) =>
                        <Project
                            key={i}
                            {...e}
                            onActive={(name: string) => setActiveName(name)}
                        />
                )
            }
        </>
    )
})

export default Projects;