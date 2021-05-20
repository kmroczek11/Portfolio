import React, { useContext, useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader, useResource, useThree } from 'react-three-fiber'
import { AppContext } from './context';
import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text, Html, useGLTF } from '@react-three/drei';
import { Types } from './context/reducers';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';
import gsap, { TimelineMax } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ProjectItem {
    id: number,
    name: string,
    logos: Array<string>,
    medium: string,
    github: string,
    x: number,
    y: number,
    active: boolean,
    focus?: boolean,
    onClick?: (id: number) => void,
}

const Project = ({ id, name, logos, medium, github, x, y, active, focus, onClick }: ProjectItem): JSX.Element => {
    const { state } = useContext(AppContext);
    const { fullScreen, gui } = state.scene;
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
    const projectVideo = useRef(null);
    const projectDescription = useRef(null);
    const exit = useRef(null);
    const normalMap1 = useLoader(TextureLoader, 'images/textures/nm1.jpg');
    const normalMap2 = useLoader(TextureLoader, 'images/textures/nm2.jpg');
    const {nodes,materials} = useGLTF('models/phone.glb');

    useEffect(()=>{console.log(nodes)},[nodes])

    // useEffect(() => {
    //     exit.current && gui.add(exit.current.position, 'x')
    //     exit.current && gui.add(exit.current.position, 'y')
    //     exit.current && gui.add(exit.current.position, 'z').min(-20).max(20)
    // }, [])

    // useEffect(() => {
    //     document.body.style.cursor = hovered ? 'pointer' : 'auto';
    //     hovered ?
    //         gsap.to(projectDescription.current.scale, { duration: 1, ease: 'expo.out', x: 1.1, y: 1.1 }) :
    //         gsap.to(projectDescription.current.scale, { duration: 1, ease: 'expo.out', x: 1, y: 1 });
    // }, [hovered])

    // useEffect(() => {
    //     if (active) {
    //         video && video.play();
    //         var maxWidth: number;
    //         var maxHeight: number = 1.5;
    //         if (medium === 'desktop')
    //             maxWidth = 3;
    //         if (medium === 'mobile')
    //             maxWidth = 1;
    //         gsap.to(projectVideo.current.scale, { duration: 2, ease: 'expo.out', x: maxWidth, y: maxHeight });
    //         gsap.to(projectVideo.current.position, { duration: 2, ease: 'expo.out', x: 15, y: 0, z: -16.5 });
    //     }
    //     if (!active) {
    //         video && video.pause();
    //         gsap.to(projectVideo.current.scale, { duration: 2, ease: 'expo.out', x: 1, y: 1 });
    //         gsap.to(projectVideo.current.position, { duration: 2, ease: 'expo.out', x: x, y: y, z: -18 });
    //     }
    // }, [active])

    // useEffect(() => {
    //     focus ?
    //         project.current && gsap.to(project.current.position, { duration: 5, ease: 'expo.out', x: 0, y: 0, z: 0 }) :
    //         project.current && gsap.to(project.current.position, { duration: 5, ease: 'expo.out', x: generateNumber(-2, 2), y: generateNumber(-2, 2), z: generateNumber(-2, 2) });
    // }, [focus])

    const generateNumber = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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
            <group
                ref={project}
                position={[x, y - 0.1, -18.1]}
                onClick={fullScreen ? null : onSelected}
                onPointerOver={fullScreen ? null : () => setHovered(true)}
                onPointerOut={fullScreen ? null : () => setHovered(false)}
            >
                <mesh geometry={nodes.Phone&&nodes.Phone.geometry} ref={projectVideo}>
                    <meshBasicMaterial>
                        <videoTexture attach='map' args={[video]} />
                    </meshBasicMaterial>
                </mesh>
                {/* <group ref={projectDescription} position={[x, y, -18]}>
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
                        <meshStandardMaterial color='#d4af37' />
                    </mesh>
                    {logos.map((logo: string, index: number) => {
                        const texture = new TextureLoader().load(`images/logos/${logo}.png`);

                        return <mesh position-x={0.5 * (index % 3) - 0.5} position-y={index < 3 ? -0.95 : -1.2}>
                            <planeBufferGeometry args={[0.4, 0.2]} />
                            <meshStandardMaterial map={texture} transparent />
                        </mesh>
                    })}
                </group> */}
            </group>
            {
                fullScreen &&
                <Text
                    ref={exit}
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
    const { currentItem, gui } = state.scene;
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'gfe', logos: ['vue', 'uikit', 'firebase'], medium: 'desktop', github: '-------------------', x: 12, y: 1, active: false },
        { id: 1, name: 'stalcraft', logos: ['angular', 'node'], medium: 'desktop', github: 'https://github.com/kmroczek11/Stalcraft', x: 14, y: 1, active: false },
        { id: 2, name: 'shop', logos: ['aspnet', 'mysql'], medium: 'desktop', github: 'https://github.com/kmroczek11/Shop', x: 16, y: 1, active: false },
        { id: 3, name: 'coronastats', logos: ['reactnative', 'redux'], medium: 'mobile', github: 'https://github.com/kmroczek11/Coronastats', x: 18, y: 1, active: false },
        { id: 4, name: 'marbles', logos: ['three', 'node', 'jquery', 'ajax', 'socketio', 'mongodb'], medium: 'desktop', github: 'https://github.com/kmroczek11/Marbles', x: 12, y: -1, active: false },
        { id: 5, name: 'mp3player', logos: ['jquery', 'node', 'ajax'], medium: 'desktop', github: 'https://github.com/kmroczek11/School-projects/tree/master/MP3%20Player', x: 14, y: -1, active: false },
        { id: 6, name: 'tasky', logos: ['flutter', 'rive', 'firebase'], medium: 'mobile', github: 'https://github.com/kmroczek11/Tasky', x: 16, y: -1, active: false },
        { id: 7, name: '', logos: ['react', 'sass'], medium: 'desktop', github: 'https://github.com/kmroczek11/Portfolio', x: 18, y: -1, active: false },
    ]);
    const [selected, setSelected] = useState<number>(null);
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem == 'projects.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])
    const light1 = useRef(null);
    const light2 = useRef(null);

    useEffect(() => {
        light1.current && gui.add(light1.current.position, 'x').min(10).max(20);
        light1.current && gui.add(light1.current.position, 'y').min(-5).max(5);
        light1.current && gui.add(light1.current.position, 'z').min(-20).max(-10);
        light2.current && gui.add(light2.current.position, 'x').min(10).max(20);
        light2.current && gui.add(light2.current.position, 'y').min(-5).max(5);
        light2.current && gui.add(light2.current.position, 'z').min(-20).max(-10);
        // const t = new TimelineMax({yoyo:true,repeat:-1});

        // light1.current && t.from(light1.current.position, {x:20, y:1, z:-16 ,ease: 'slow( 0.1, 0.7, false)', duration: 5, });
        // light2.current && t.from(light2.current.position, {x:20, y:0, z:-16 ,ease: 'slow( 0.1, 0.7, false)', duration: 5, });
    }, [])

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
            <pointLight ref={light1} color='#fff' position={[10, 0.5, -16]} intensity={5} distance={5} />
            {light1.current && <pointLightHelper args={[light1.current, 0.5]} />}
            <pointLight ref={light2} color='#d4af37' position={[10, 0, -16]} intensity={5} distance={5} />
            {light2.current && <pointLightHelper args={[light2.current, 0.5]} />}
            <Suspense fallback={<Loader />}>
                {
                    projectItems.map(
                        (e: ProjectItem, i: number) =>
                            <Project
                                key={i}
                                {...e}
                                focus={focus}
                                onClick={setSelected}
                            />
                    )
                }
            </Suspense>
        </>
    )
})

export default Projects;