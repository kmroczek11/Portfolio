import React, { useContext, useRef, useState, useEffect, useMemo, Fragment } from 'react';
import '../styles/project.css';
import { AppContext } from '../context';
import { RoundedBox, Text, Html, useTexture } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { ThreeEvent } from '@react-three/fiber';
import { animate } from '../components/functions';
import gsap from 'gsap';
import { Group, Texture, VideoTexture } from 'three';
import useConditionalTextures from '../hooks/useConditionalTextures';

interface ProjectProps {
    id: number,
    name: string,
    logos: Array<string>,
    medium: string,
    github: string,
    preview: string,
    x: number,
    y: number,
    active: boolean,
    commercial: boolean,
    shouldLoad: boolean,
    focus: boolean,
    coverSrc: string,
    videoSrc: string,
    onClick: (id: number | null) => void,
}

const Project = ({ id, name, logos, medium, github, preview, x, y, active, commercial, shouldLoad, focus, coverSrc, videoSrc, onClick }: ProjectProps) => {
    const { state } = useContext(AppContext);
    const { fullScreen } = state.scene;
    const { t } = useTranslation();
    const [hovered, setHovered] = useState<boolean>(false);
    const project = useRef<Group | null>(null);
    const projectDescription = useRef<Group | null>(null);
    const exit = useRef(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const [enteredPreviewMode, setEnteredPreviewMode] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [clickable, setClickable] = useState<boolean>(false);
    const commercialStarTexture = useTexture('images/stars/commercial.png');
    const noncommercialStarTexture = useTexture('images/stars/noncommercial.png');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);

    const logoTextures = useConditionalTextures(
        logos.map(logo => `images/logos/${logo}.png`),
        shouldLoad
    );

    const [coverTexture] = useConditionalTextures(
        [coverSrc],
        shouldLoad
    );

    useEffect(() => {
        if (active || !fullScreen) document.body.style.cursor = hovered ? 'pointer' : 'auto';

        if (fullScreen) return;

        if (!project.current) return;

        hovered ?
            animate(project.current.scale, { x: 1.1, y: 1.1 }, 1, 'expo.out') :
            animate(project.current.scale, { x: 1, y: 1 }, 1, 'expo.out');
    }, [hovered])

    useEffect(() => {
        if (active) {
            if (!videoRef.current) {
                const vid = document.createElement('video');
                vid.src = videoSrc;
                vid.crossOrigin = 'anonymous';
                vid.loop = true;

                const handleLoaded = () => {
                    videoRef.current = vid;
                    setVideoTexture(new VideoTexture(vid));
                    vid.play();
                };

                vid.addEventListener('loadeddata', handleLoaded);
                vid.load();
            } else {
                videoRef.current.play();
            }
        } else {
            videoRef.current?.pause();
        }
    }, [active, videoSrc]);

    useEffect(() => {
        if (!project.current || !projectDescription.current) return;

        const mesh = projectDescription.current.children[0] as THREE.Mesh;

        timelineRef.current?.clear();

        const tl = gsap.timeline();
        timelineRef.current = tl;

        if (active) {
            const tl = gsap.timeline();
            timelineRef.current = tl;

            if (medium === 'desktop') {
                tl.to(project.current.position, { x: 16, y: 0, z: -17.5 });
                tl.to(project.current.scale, { x: 2, y: 2, z: 2, duration: 1 });
            } else {
                tl.to(project.current.position, { x: 16.5, y: 0, z: -17.5 });
                tl.to(project.current.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 1 });
            }

            tl.to(project.current.rotation, {
                y: -0.2, duration: 1,
            });

            animate(mesh.material, { opacity: 0.5 }, 3);

            setVisible(true);
        } else {
            tl.to(project.current.position, { x: x, y: y, z: -18 })
            tl.to(project.current.rotation, { y: 0, duration: 1 });
            tl.to(project.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
            gsap.to(mesh.material, { opacity: 0, duration: 3 });

            setVisible(false);
        }
    }, [active])

    useEffect(() => {
        if (!project.current) return;

        const firstMesh = project.current.children[0] as THREE.Mesh;
        const secondMesh = project.current.children[1] as THREE.Mesh;

        if (focus) {
            animate(project.current.position, { x: x, y: y - 0.1, z: -18 }, 3, 'expo.out');
            animate(secondMesh.material, { opacity: 1 }, 3, 'expo.out', () => { firstMesh.visible = true; setClickable(true) });
        } else {
            animate(project.current.position, { x: rand(x - 2, x + 2), y: rand(y - 2, y + 2), z: -18 }, 3, 'expo.out');
            animate(secondMesh.material, { opacity: 0 }, 3, 'expo.out', () => { }, () => { }, () => { firstMesh.visible = false; setClickable(false) });
        }
    }, [focus])

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const preventAnimation = () => {
        if (timelineRef.current) {
            timelineRef.current.kill();
            timelineRef.current = null;
        }
    };

    const onSelected = (e: ThreeEvent<MouseEvent>) => {
        if (fullScreen || !clickable) return;

        e.stopPropagation();
        preventAnimation();
        setHovered(false);
        onClick(id);
    }

    const onExit = () => {
        preventAnimation();
        setHovered(false);
        onClick(null);
    }

    const onEnterPreviewMode = (e: ThreeEvent<MouseEvent>) => {
        if (!active || !project.current || !projectDescription.current) return;

        const mesh = projectDescription.current.children[0] as THREE.Mesh;

        e.stopPropagation();
        preventAnimation();

        timelineRef.current = gsap.timeline();
        const tl = timelineRef.current;

        if (medium === 'desktop')
            tl.to(project.current.position, { x: 15, y: 0, z: -16.5 });
        else
            tl.to(project.current.position, { x: 15, y: 0, z: -17.1 });

        tl.to(project.current.rotation, {
            y: 0,
            duration: 1,
            onComplete: () => setEnteredPreviewMode(true)
        });

        animate(mesh.material, { opacity: 0 }, 3);

        setVisible(false);
    }

    const onExitPreviewMode = (e: MouseEvent) => {
        if (!active || !project.current || !projectDescription.current) return;

        const mesh = projectDescription.current.children[0] as THREE.Mesh;

        e.stopPropagation();
        preventAnimation();

        setEnteredPreviewMode(false);

        timelineRef.current = gsap.timeline();
        const tl = timelineRef.current;

        if (medium === 'desktop')
            tl.to(project.current.position, { x: 16, y: 0, z: -17.5 });
        else
            tl.to(project.current.position, { x: 16.5, y: 0, z: -17.5 });

        tl.to(project.current.rotation, { y: -0.2, duration: 1 });
        animate(mesh.material, { opacity: 0.5 }, 3);

        setVisible(true);
    }

    return (
        <>
            <group
                ref={project}
                onClick={fullScreen ? (e) => onEnterPreviewMode(e) : (e) => onSelected(e)}
                onPointerMissed={fullScreen ? (e) => onExitPreviewMode(e) : undefined}
                onPointerOver={enteredPreviewMode ? () => setHovered(false) : () => setHovered(true)}
                onPointerOut={enteredPreviewMode ? () => setHovered(true) : () => setHovered(false)}
            >
                <group position-z={0.08}>
                    {videoTexture && (
                        <mesh>
                            <meshBasicMaterial map={videoTexture} toneMapped={false} />
                            <planeGeometry args={medium === 'desktop' ? [1.8, 0.8] : [0.8, 1.8]} />
                        </mesh>
                    )}

                    {coverTexture && (
                        <mesh visible={!active}>
                            <meshBasicMaterial map={coverTexture} />
                            <planeGeometry args={medium == 'desktop' ? [1.8, 0.8] : [0.8, 1.8]} />
                        </mesh>
                    )}
                </group>
                <RoundedBox args={medium === 'desktop' ? [2, 1, 0.1] : [1, 2, 0.1]}>
                    <meshPhongMaterial
                        attach='material'
                        color='#000'
                        opacity={0}
                        transparent={true}
                    />
                </RoundedBox>
            </group>
            <group
                ref={projectDescription}
                position={[14.3, 0, -16]}
                visible={visible}
            >
                {commercial ?
                    <mesh
                        position={[-0.45, 0.58, 0.1]}
                        layers={1}
                    >
                        <planeGeometry args={[0.2, 0.2]} />
                        <meshStandardMaterial map={commercialStarTexture} transparent />
                    </mesh>
                    :
                    <mesh
                        position={[-0.45, 0.58, 0.1]}
                        layers={1}
                    >
                        <planeGeometry args={[0.2, 0.2]} />
                        <meshStandardMaterial map={noncommercialStarTexture} transparent />
                    </mesh>}
                <mesh>
                    <planeGeometry args={[1.5, 1.5]} />
                    <meshStandardMaterial
                        color='#000'
                        transparent
                    />
                </mesh>
                <group>
                    <Text
                        color='#e6cd7e'
                        font='fonts/Oswald.ttf'
                        fontSize={0.08}
                        maxWidth={1.5}
                        textAlign='center'
                        anchorY={-0.7}
                        layers={1}
                    >
                        {t(`projectTitles.${id}`)}
                    </Text>
                    <Text
                        color='#fff'
                        font='fonts/Oswald.ttf'
                        fontSize={0.06}
                        maxWidth={1}
                        textAlign='center'
                        anchorY={-0.5}
                        lineHeight={2}
                        layers={1}
                    >
                        {t(`projectDesc.${id}`)}
                    </Text>
                    <Html
                        center
                        position-y={-0.3}
                        style={
                            {
                                visibility: visible ? 'visible' : 'hidden',
                            }
                        }
                    >
                        <section className='links'>
                            <p>GitHub: <a href={github}>{github}</a></p>
                            <p>Live: <a href={preview}>{preview}</a></p>
                        </section>
                    </Html>
                </group>
                {logoTextures.map((logo: Texture | null, index: number) => {
                    if (!logo) return null;
                    return (
                        <mesh key={index}
                            position-x={0.5 * (index % 3) - 0.5}
                            position-y={index < 3 ? -0.5 : -0.7}
                        >
                            <planeGeometry args={[0.25, 0.1]} />
                            <meshStandardMaterial map={logo} transparent />
                        </mesh>
                    );
                })}
            </group>
            {
                fullScreen &&
                <Text
                    ref={exit}
                    position={[16.8, -1, -16.5]}
                    color='#e6cd7e'
                    font='fonts/Oswald.ttf'
                    fontSize={0.2}
                    onClick={() => onExit()}
                    layers={1}
                >
                    {t('exit')}
                </Text>
            }
        </>
    )
}

export default Project;