import React, { useContext, useRef, useState, useEffect } from 'react';
import { useFrame, useLoader, useThree } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text } from '@react-three/drei';
import { Types } from './context/reducers';
import { useTranslation } from 'react-i18next';

declare global {
    interface Window {
        appHistory: any;
    }
}

interface ProjectItem {
    id: string,
    name?: string,
    videoSrc: string,
    imageSrc: string,
    desc?: string,
    medium: string,
    x: number,
    y: number,
    active: boolean,
}

const Project = ({ id, name, videoSrc, imageSrc, desc, medium, x, y, active }: ProjectItem): JSX.Element => {
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
    const image = useLoader(TextureLoader, imageSrc);
    const blackStone = useLoader(TextureLoader, 'images/textures/black_stone.jpg');
    const { viewport } = useThree();
    // console.log(viewport.width, viewport.height);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    useEffect(() => {
        video && active ? video.play() : video.pause();
    }, [video, active])

    useFrame(() => {
        if (active) {
            var maxWidth: number;
            var maxHeight: number;
            if (medium === 'desktop') {
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
            <group
                ref={description}
                position={[x, y, -13]}
            >
                <mesh >
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial map={blackStone} />
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
                    <meshStandardMaterial map={image} transparent />
                </mesh>
            </group>
        </>
    )
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const { dispatch } = useContext(AppContext);
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 'gfe', videoSrc: 'videos/gfe.mp4', imageSrc: 'images/descriptions/gfe.svg', medium: 'desktop', x: 7, y: 1, active: false },
        { id: 'stalcraft', videoSrc: 'videos/stalcraft.mp4', imageSrc: 'images/descriptions/stalcraft.svg', medium: 'desktop', x: 9, y: 1, active: false },
        { id: 'shop', videoSrc: 'videos/shop.mp4', imageSrc: 'images/descriptions/shop.svg', medium: 'desktop', x: 11, y: 1, active: false },
        { id: 'coronastats', videoSrc: 'videos/coronastats.mp4', imageSrc: 'images/descriptions/coronastats.svg', medium: 'phone', x: 13, y: 1, active: false },
        { id: 'marbles', videoSrc: 'videos/marbles.mp4', imageSrc: 'images/descriptions/marbles.svg', medium: 'desktop', x: 7, y: -1, active: false },
        { id: 'mp3player', videoSrc: 'videos/mp3player.mp4', imageSrc: 'images/descriptions/mp3player.svg', medium: 'desktop', x: 9, y: -1, active: false },
        { id: 'tasky', videoSrc: 'videos/tasky.mp4', imageSrc: 'images/descriptions/tasky.svg', medium: 'phone', x: 11, y: -1, active: false },
        { id: 'portfolio', videoSrc: '', imageSrc: 'images/descriptions/portfolio.svg', medium: 'desktop', x: 13, y: -1, active: false },
    ]);
    const { t, i18n } = useTranslation();

    const unlisten = window.appHistory.listen((location: any) => {
        setProjectItems(prevProjectItems =>
            prevProjectItems.map(
                (e: ProjectItem) =>
                    e.id === location.pathname.split('/')[2] ?
                        { ...e, active: true } : { ...e, active: false }
            ))
    })

    useEffect(() => {
        projectItems.some((e: ProjectItem) => e.active) ?
            dispatch({
                type: Types.SetFullScreen,
                payload: true,
            }) :
            dispatch({
                type: Types.SetFullScreen,
                payload: false,
            })
    }, [projectItems])

    return (
        <>
            {
                projectItems.map(
                    (e: ProjectItem, i: number) =>
                        <Project
                            key={i}
                            {...e}
                            name={t(`projectTitles.${i}`)}
                            desc={t(`projectDesc.${i}`)}
                        />
                )
            }
        </>
    )
})

export default Projects;