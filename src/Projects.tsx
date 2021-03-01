import React, { Suspense, useContext, useRef, useState, useEffect } from 'react';
import { useFrame, useLoader, useThree } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text } from '@react-three/drei';

interface ProjectItem {
    id: string,
    name: string,
    videoSrc: string,
    imageSrc: string,
    desc: string,
    medium: string,
    x: number,
    y: number,
    active: boolean,
}

const Project = ({ id, name, videoSrc, imageSrc, desc, medium, x, y, active }: ProjectItem): JSX.Element => {
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
    const description = useRef(null);
    const texture = useLoader(TextureLoader, imageSrc);
    const { viewport } = useThree();
    // console.log(viewport.width, viewport.height);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    useEffect(() => {
        active ? video.play() : video.pause();
    }, [active])

    useFrame(() => {
        if (active) {
            var maxWidth: number;
            var maxHeight: number;
            if (medium == 'desktop') {
                maxWidth = viewport.width / 5;
                maxHeight = viewport.height / 5;
            }
            else {
                maxWidth = viewport.width / 15;
                maxHeight = viewport.height / 5;
            }
            if (project.current.scale.x < maxWidth) project.current.scale.x += 0.1;
            if (project.current.scale.y < maxHeight) project.current.scale.y += 0.1;
            project && moveObject(project.current, project.current.position, new Vector3(10, 0, -11.5), 0.1);
        }
        if (!active) {
            if (project.current.scale.x > 1) project.current.scale.x -= 0.1;
            if (project.current.scale.y > 1) project.current.scale.y -= 0.1;
            project && moveObject(project.current, project.current.position, new Vector3(x, y, -13), 0.1);
        }
    })

    const onClick = () => {
        // if (project.current) {
        //     project.current.renderOrder = 999;
        //     project.current.material.depthOffset = false;
        //     project.current.material.depthWrite = false;
        //     project.current.onBeforeRender = (renderer) => renderer.clearDepth();
        // }
        window.appHistory.push(`/projects/${id}`);
    }

    return (
        <>
            <mesh
                ref={project}
                position={[x, y - 0.1, -13.1]}
                onClick={() => onClick()}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <planeBufferGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial>
                    <videoTexture attach='map' args={[video]} />
                </meshBasicMaterial>
            </mesh>
            {/* <Link to={'/projects'} /> */}
            <group
                ref={description}
                position={[x, y, -13]}
            >
                <mesh >
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshStandardMaterial color='#000' />
                </mesh>
                <group>
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
                        fontSize={0.08}
                        maxWidth={1}
                        textAlign='center'
                        anchorY={-0.1}
                        lineHeight={2}
                    >
                        {desc}
                    </Text>
                </group>
                <mesh position-y={-0.95}>
                    <planeBufferGeometry args={[1.5, 0.4]} />
                    <meshStandardMaterial map={texture} />
                </mesh>
            </group>
        </>
    )
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 'gfe', name: 'PROJEKT STRONY GFE', videoSrc: 'videos/gfe.mp4', imageSrc: 'images/descriptions/gfe.svg', desc: 'STRONA STWORZONA NA PRAKTYKACH W TRZECIEJ KLASIE TECHNIKUM W FIRMIE BFIRST.TECH.', medium: 'desktop', x: 7, y: 1, active: false },
        { id: 'stalcraft', name: 'PROJEKT STRONY STALCRAFT', videoSrc: 'videos/stalcraft.mp4', imageSrc: 'images/descriptions/stalcraft.svg', desc: 'PROSTA STRONA WYKONANA DLA FIRMY STALCRAFT.', medium: 'desktop', x: 9, y: 1, active: false },
        { id: 'shop', name: 'PROJEKT SKLEPU INTERNETOWEGO', videoSrc: '', imageSrc: 'images/descriptions/shop.svg', desc: 'PROJEKT SKLEPU INTERNETOWEGO Z GRAMI KOMPUTEROWYMI UTWORZONY W CZWARTEJ KLASIE TECHNIKUM.', medium: 'desktop', x: 11, y: 1, active: false },
        { id: 'coronastats', name: 'CORONASTATS', videoSrc: 'videos/coronastats.mp4', imageSrc: 'images/descriptions/coronastats.svg', desc: 'PROJEKT APLIKACJI MOBILNEJ PRZEDSTAWIAJĄCEJ ROZWÓJ COVID-19. DANE POBIERANE SĄ Z OFICJALNEJ BAZY DANYCH WHO.', medium: 'phone', x: 13, y: 1, active: false },
        { id: 'marbles', name: 'MARBLES', videoSrc: 'videos/marbles.mp4', imageSrc: 'images/descriptions/marbles.svg', desc: 'PROJEKT KOŃCOWOROCZNY WYKONANY W TRZECIEJ KLASIE TECHNIKUM POLEGAJĄCY NA STWORZENIU GRY LOGICZNEJ. GRA POLEGA NA ZBIJANIU KULEK.', medium: 'desktop', x: 7, y: -1, active: false },
        { id: 'mp3player', name: 'MP3 PLAYER', videoSrc: 'videos/mp3player.mp4', imageSrc: 'images/descriptions/mp3player.svg', desc: 'PROJEKT ODTWARZACZA MP3. UTWORY ŁADOWANE SĄ Z LOKALNYCH FOLDERÓW.', medium: 'desktop', x: 9, y: -1, active: false },
        { id: 'tasky', name: 'TASKY', videoSrc: 'videos/tasky.mp4', imageSrc: 'images/descriptions/tasky.svg', desc: 'PROJEKT APLIKACJI MOBILNEJ DO EFEKTYWNEGO ZARZĄDZANIA SWOIMI ZADANIAMI. APLIKACJA SŁUŻY DO LEPSZEGO ZARZĄDZANIA SWOIM CZASEM.', medium: 'phone', x: 11, y: -1, active: false },
        { id: 'portfolio', name: 'MOJE PORTFOLIO', videoSrc: '', imageSrc: 'images/descriptions/portfolio.svg', desc: 'PROJEKT MOJEGO PORTFOLIO.', medium: 'desktop', x: 13, y: -1, active: false },
    ]);

    const unlisten = window.appHistory.listen((location: any) => {
        setProjectItems(prevProjectItems =>
            prevProjectItems.map(
                (e: ProjectItem) =>
                    e.id == location.pathname.split('/')[2] ?
                        { ...e, active: true } : { ...e, active: false }
            ))
    })

    return (
        <>
            {
                projectItems.map(
                    (e: ProjectItem, i: number) =>
                        <Project
                            key={i}
                            // id={id}
                            {...e}
                        />
                )
            }
        </>
    )
})

export default Projects;