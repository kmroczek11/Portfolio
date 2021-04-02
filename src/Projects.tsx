import React, { useContext, useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text, Html } from '@react-three/drei';
import { Types } from './context/reducers';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';

interface ProjectItem {
    id: number,
    name: string,
    logos: Array<string>,
    medium: string,
    github: string,
    x: number,
    y: number,
    active: boolean,
    onClick?: (id: number) => void,
}

const Project = ({ id, name, logos, medium, github, x, y, active, onClick }: ProjectItem): JSX.Element => {
    const { state } = useContext(AppContext);
    const { fullScreen } = state.scene;
    const { t, i18n } = useTranslation();
    const [hovered, setHovered] = useState<boolean>(false);
    const [video] = useState(() => {
        const vid = document.createElement('video');
        vid.src = `videos/${name}.mp4`;
        vid.onerror = () => console.log(`${name} error ${vid.error.code}; details: ${vid.error.message}`);
        vid.crossOrigin = 'Anonymous';
        vid.loop = true;
        vid.controls = true;
        vid.load();
        return vid;
    });
    const project = useRef(null);
    const description = useRef(null);
    const crystal = useLoader(TextureLoader, 'images/textures/crystal.jpg');
    const sand = useLoader(TextureLoader, 'images/textures/sand.jpg');
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
            moveObject(project.current, project.current.position, new Vector3(15, 0, -16.5), 0.1);
        }
        if (!active) {
            if (project.current.scale.x > 1) project.current.scale.x -= 0.1;
            if (project.current.scale.y > 1) project.current.scale.y -= 0.1;
            moveObject(project.current, project.current.position, new Vector3(x, y, -18), 0.1);
        }
    })

    const onSelected = () => {
        setHovered(false);
        onClick(id);
    }

    const onExit = () => {
        setHovered(false);
        onClick(null);
    }

    return (
        <>
            <mesh
                ref={project}
                position={[x, y - 0.1, -18.1]}
                onClick={fullScreen ? null : onSelected}
                onPointerOver={fullScreen ? null : () => setHovered(true)}
                onPointerOut={fullScreen ? null : () => setHovered(false)}
            >
                <planeBufferGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial>
                    <videoTexture attach='map' args={[video]} />
                </meshBasicMaterial>
            </mesh>
            <group
                ref={description}
                position={[x, y, -18]}
            >
                <mesh >
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshStandardMaterial normalMap={crystal} color='#000' />
                </mesh>
                <group>
                    <Text
                        color='#d4af37'
                        font='fonts/Oswald.ttf'
                        fontSize={0.1}
                        maxWidth={1.5}
                        textAlign='center'
                        anchorY={-0.6}
                    >
                        {t(`projectTitles.${id}`)}
                    </Text>
                    <Text
                        color='#fff'
                        font='fonts/Oswald.ttf'
                        fontSize={0.08}
                        maxWidth={1}
                        textAlign='center'
                        anchorY={-0.4}
                        lineHeight={2}
                    >
                        {t(`projectDesc.${id}`)}
                    </Text>
                    <Text
                        color='#fff'
                        font='fonts/Oswald.ttf'
                        fontSize={0.06}
                        maxWidth={1}
                        textAlign='center'
                        anchorY={0.5}
                        lineHeight={2}
                    >
                        {github}
                    </Text>
                </group>
                <mesh position-y={-0.95}>
                    <planeBufferGeometry args={[1.5, 0.5]} />
                    <meshStandardMaterial normalMap={sand} color='#d4af37' />
                </mesh>
                {logos.map((logo: string, index: number) => {
                    const texture = new TextureLoader().load(`images/logos/${logo}.png`);

                    return <mesh position-x={0.5 * (index % 3) - 0.5} position-y={index < 3 ? -0.95 : -1.2}>
                        <planeBufferGeometry args={[0.4, 0.2]} />
                        <meshStandardMaterial map={texture} transparent />
                    </mesh>
                })}
            </group>
            {
                fullScreen && <Text
                    position={[13, -1, -16.5]}
                    color='#d4af37'
                    font='fonts/Oswald.ttf'
                    fontSize={0.2}
                    onClick={onExit}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {t('exit')}
                </Text>
            }
        </>
    )
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const { state, dispatch } = useContext(AppContext);
    const { gui } = state.scene;
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'gfe', logos: ['vue', 'uikit', 'firebase'], medium: 'desktop', github: '-------------------', x: 12, y: 1, active: false },
        { id: 1, name: 'stalcraft', logos: ['angular', 'node'], medium: 'desktop', github: 'https://github.com/kmroczek11/Stalcraft', x: 14, y: 1, active: false },
        { id: 2, name: 'shop', logos: ['aspnet', 'mysql'], medium: 'desktop', github: 'https://github.com/kmroczek11/Shop', x: 16, y: 1, active: false },
        { id: 3, name: 'coronastats', logos: ['reactnative', 'redux'], medium: 'phone', github: 'https://github.com/kmroczek11/Coronastats', x: 18, y: 1, active: false },
        { id: 4, name: 'marbles', logos: ['three', 'node', 'jquery', 'ajax', 'socketio', 'mongodb'], medium: 'desktop', github: 'https://github.com/kmroczek11/Marbles', x: 12, y: -1, active: false },
        { id: 5, name: 'mp3player', logos: ['jquery', 'node', 'ajax'], medium: 'desktop', github: 'https://github.com/kmroczek11/School-projects/tree/master/MP3%20Player', x: 14, y: -1, active: false },
        { id: 6, name: 'tasky', logos: ['flutter', 'rive', 'firebase'], medium: 'phone', github: 'https://github.com/kmroczek11/Tasky', x: 16, y: -1, active: false },
        { id: 7, name: '', logos: ['react', 'sass'], medium: 'desktop', github: 'https://github.com/kmroczek11/Portfolio', x: 18, y: -1, active: false },
    ]);
    const [selected, setSelected] = useState<number>(null);
    const { t, i18n } = useTranslation();
    // const [ref1, light1] = useResource(null);
    // const [ref2, light2] = useResource(null);

    // useEffect(() => {
    //     light1.current && gui.add(light1.current.position, 'x').min(5).max(15);
    //     light1.current && gui.add(light1.current.position, 'y').min(-5).max(5);
    //     light1.current && gui.add(light1.current.position, 'z').min(-15).max(-5);
    //     light2.current && gui.add(light2.current.position, 'x').min(5).max(15);
    //     light2.current && gui.add(light2.current.position, 'y').min(-5).max(5);
    //     light2.current && gui.add(light2.current.position, 'z').min(-15).max(-5);
    // }, [])

    useEffect(() => {
        setProjectItems(prevProjectItems =>
            prevProjectItems.map(
                (e: ProjectItem) =>
                    e.id === selected ?
                        { ...e, active: true } : { ...e, active: false }
            ));
    }, [selected])

    useEffect(() => {
        projectItems.some((e: ProjectItem) => e.active) ?
            dispatch({
                type: Types.SetFullScreen,
                payload: true,
            }) : dispatch({
                type: Types.SetFullScreen,
                payload: false,
            });
    }, [projectItems])

    return (
        <>
            {/* <pointLight ref={ref1} color='#fff' position={[11, 1, -13]} intensity={1} /> */}
            {/* <pointLightHelper args={[light1, 1]} /> */}
            {/* <pointLight ref={ref2} color='#d4af37' position={[11, 1, -13]} intensity={1} /> */}
            <Suspense fallback={<Loader />}>
                {
                    projectItems.map(
                        (e: ProjectItem, i: number) =>
                            <Project
                                key={i}
                                {...e}
                                onClick={setSelected}
                            />
                    )
                }
            </Suspense>
        </>
    )
})

export default Projects;