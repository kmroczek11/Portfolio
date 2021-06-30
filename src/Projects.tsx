import React, { useContext, useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useLoader } from 'react-three-fiber'
import { AppContext } from './context';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { RoundedBox, Text } from '@react-three/drei';
import { Types } from './context/reducers';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';
import gsap from 'gsap';
import { Color, DoubleSide, FrontSide, Mesh, PlaneGeometry, ShaderMaterial, Vector2, VideoTexture } from 'three';
import videoVertexShader from './shaders/videoVertex.glsl';
import videoFragmentShader from './shaders/videoFragment.glsl';

interface ProjectItem {
    id: number,
    name: string,
    logos: Array<string>,
    medium: string,
    preview: string,
    x: number,
    y: number,
    active: boolean,
    focus?: boolean,
    onClick?: (id: number) => void,
}

const Project = ({ id, name, logos, medium, preview, x, y, active, focus, onClick }: ProjectItem): JSX.Element => {
    const { state } = useContext(AppContext);
    const { fullScreen, gui } = state.scene;
    const { t } = useTranslation();
    const [hovered, setHovered] = useState<boolean>(false);
    const [vidPlayer] = useState(() => {
        const vid = document.createElement('video');
        vid.crossOrigin = 'Anonymous';
        vid.loop = true;
        vid.controls = true;
        return vid;
    });
    const [vidObject] = useMemo(() => {
        const geometry = medium === 'desktop' ? new PlaneGeometry(1.8, 0.8) : new PlaneGeometry(0.8, 1.8);
        geometry.center();
        const uniforms = {
            u_tex: { value: new VideoTexture(vidPlayer) },
            u_adjust_uv: { value: new Vector2(1, 1) }
        }
        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: videoVertexShader,
            fragmentShader: videoFragmentShader
        });

        const video = new Mesh(geometry, material);
        return [video];
    }, []);
    const project = useRef(null);
    const projectDescription = useRef(null);
    const exit = useRef(null);
    const normalMap1 = useLoader(TextureLoader, 'images/textures/nm1.jpg');
    // const normalMap2 = useLoader(TextureLoader, 'images/textures/nm2.jpg');
    const timeline = gsap.timeline();

    // useEffect(() => {
    //     project.current && gui.add(project.current.rotation, 'x').min(0).max(360)
    //     project.current && gui.add(project.current.rotation, 'y').min(0).max(360)
    //     project.current && gui.add(project.current.rotation, 'z').min(0).max(360)
    // }, [])

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
        hovered ?
            project.current && gsap.to(project.current.scale, { duration: 1, ease: 'expo.out', x: 1.1, y: 1.1 }) :
            project.current && gsap.to(project.current.scale, { duration: 1, ease: 'expo.out', x: 1, y: 1 });
    }, [hovered])

    useEffect(() => {
        if (active) {
            if (vidPlayer) {
                if (vidPlayer.readyState < 3) {
                    vidPlayer.src = `videos/${name}.mp4`;
                    vidPlayer.load();
                    vidPlayer.onerror = () => console.log(`${name} error ${vidPlayer.error.code}; details: ${vidPlayer.error.message}`);
                }
                vidPlayer.play();
            }
            if (medium === 'desktop') {
                timeline.to(project.current.position, { x: 16, y: 0, z: -17.5 });
                timeline.to(project.current.scale, { x: 2, y: 2, z: 2, duration: 1 });
            } else {
                timeline.to(project.current.position, { x: 16.5, y: 0, z: -17.5 });
                timeline.to(project.current.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 1 });
            }
            timeline.to(project.current.rotation, { y: -0.2, duration: 1 });
            projectDescription.current.visible = true;
            console.log('current', projectDescription.current)
            gsap.to(projectDescription.current.children[0].material, { opacity: 0.5, duration: 3 });
        }
        if (!active) {
            if (vidPlayer) vidPlayer.pause();
            timeline.to(project.current.position, { x: x, y: y, z: -18 })
            timeline.to(project.current.rotation, { y: 0, duration: 1 });
            timeline.to(project.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
            projectDescription.current.visible = false;
            gsap.to(projectDescription.current.children[0].material, { opacity: 0, duration: 3 });
        }
    }, [active])

    // useEffect(() => {
    //     focus ?
    //         project.current && gsap.to(project.current.position, { duration: 5, ease: 'expo.out', x: 0, y: 0, z: 0 }) :
    //         project.current && gsap.to(project.current.position, { duration: 5, ease: 'expo.out', x: generateNumber(-2, 2), y: generateNumber(-2, 2), z: generateNumber(-2, 2) });
    // }, [focus])

    // const generateNumber = (min: number, max: number) => {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

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
                position={[x, y - 0.1, -18]}
                onClick={fullScreen ? null : onSelected}
                onPointerOver={fullScreen ? null : () => setHovered(true)}
                onPointerOut={fullScreen ? null : () => setHovered(false)}
            >
                <primitive object={vidObject} position-z={0.08} />
                <RoundedBox args={medium == 'desktop' ? [2, 1, 0.1] : [1, 2, 0.1]}>
                    <meshPhongMaterial attach="material" color="#000" />
                </RoundedBox>
            </group>
            <group
                ref={projectDescription}
                position={[14.3, 0, -16]}
                visible={false}
            >
                <mesh>
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshStandardMaterial
                        map={normalMap1}
                        color='#000'
                        transparent
                    />
                </mesh>
                <group>
                    <Text
                        color='#d4af37'
                        font='fonts/Oswald.ttf'
                        fontSize={0.1}
                        maxWidth={1.5}
                        textAlign='center'
                        anchorY={-0.7}
                    >
                        {t(`projectTitles.${id}`)}
                    </Text>
                    <Text
                        color='#fff'
                        font='fonts/Oswald.ttf'
                        fontSize={0.08}
                        maxWidth={1}
                        textAlign='center'
                        anchorY={-0.5}
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
                        anchorY={0.3}
                        lineHeight={2}
                    >
                        {preview}
                    </Text>
                </group>
                {logos.map((logo: string, index: number) => {
                    const texture = new TextureLoader().load(`images/logos/${logo}.png`);

                    return <mesh position-x={0.5 * (index % 3) - 0.5} position-y={index < 3 ? -0.5 : -0.7}>
                        <planeBufferGeometry args={[0.2, 0.1]} />
                        <meshStandardMaterial map={texture} transparent />
                    </mesh>
                })}
            </group>
            {
                fullScreen &&
                <Text
                    ref={exit}
                    position={[17, -1, -16.5]}
                    color='#d4af37'
                    font='fonts/Oswald.ttf'
                    fontSize={0.2}
                    onClick={onExit}
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
    const { currentItem } = state.scene;
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'gfe', logos: ['vue', 'uikit', 'firebase'], medium: 'desktop', preview: 'http://www.gfe.agh.edu.pl', x: 12, y: 1, active: false },
        { id: 1, name: 'stalcraft', logos: ['angular', 'node'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Stalcraft', x: 14.5, y: 1, active: false },
        { id: 2, name: 'shop', logos: ['aspnet', 'mysql'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Shop', x: 17, y: 1, active: false },
        { id: 3, name: 'coronastats', logos: ['reactnative', 'redux'], medium: 'mobile', preview: 'https://github.com/kmroczek11/Coronastats', x: 19, y: 1, active: false },
        { id: 4, name: 'marbles', logos: ['three', 'node', 'jquery', 'ajax', 'socketio', 'mongodb'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Marbles', x: 12, y: -1, active: false },
        { id: 5, name: 'mp3player', logos: ['jquery', 'node', 'ajax'], medium: 'desktop', preview: 'https://github.com/kmroczek11/School-projects/tree/master/MP3%20Player', x: 14.5, y: -1, active: false },
        { id: 6, name: 'tasky', logos: ['flutter', 'rive', 'firebase'], medium: 'mobile', preview: 'https://github.com/kmroczek11/Tasky', x: 16.5, y: -1, active: false },
        // { id: 7, name: '', logos: ['react', 'sass'], medium: 'desktop', preview: 'https://github.com/kmroczek11/Portfolio', x: 19.5, y: -1, active: false },
    ]);
    const [selected, setSelected] = useState<number>(null);
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => {
        currentItem === 'projects.end' ? setFocus(true) : setFocus(false);
    }, [currentItem])
    // const light1 = useRef(null);
    // const light2 = useRef(null);

    useEffect(() => {
        // light1.current && gui.add(light1.current.position, 'x').min(10).max(20);
        // light1.current && gui.add(light1.current.position, 'y').min(-5).max(5);
        // light1.current && gui.add(light1.current.position, 'z').min(-20).max(-10);
        // light2.current && gui.add(light2.current.position, 'x').min(10).max(20);
        // light2.current && gui.add(light2.current.position, 'y').min(-5).max(5);
        // light2.current && gui.add(light2.current.position, 'z').min(-20).max(-10);
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
            {/* <pointLight ref={light1} color='#fff' position={[10, 0.5, -16]} intensity={5} distance={5} />
            {light1.current && <pointLightHelper args={[light1.current, 0.5]} />}
            <pointLight ref={light2} color='#d4af37' position={[10, 0, -16]} intensity={5} distance={5} />
            {light2.current && <pointLightHelper args={[light2.current, 0.5]} />} */}
            {
                projectItems.map(
                    (e: ProjectItem, i: number) =>
                        <Suspense fallback={<Loader />}>
                            <Project
                                key={i}
                                {...e}
                                focus={focus}
                                onClick={setSelected}
                            />
                        </Suspense>
                )
            }
        </>
    )
})

export default Projects;