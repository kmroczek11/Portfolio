import React, { useContext, useRef, useState, useEffect, useMemo, Fragment } from 'react';
import '../styles/project.css';
import { AppContext } from '../context';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { RoundedBox, Text, Html, useTexture } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { ProjectItem } from './Projects';
import { ThreeEvent, useLoader } from '@react-three/fiber';
import { animate } from '../components/functions';
import gsap from 'gsap';

const Project = ({ id, name, logos, medium, github, preview, x, y, active, commercial, focus, onClick }: ProjectItem) => {
    const { state } = useContext(AppContext);
    const { fullScreen } = state.scene;
    const { t } = useTranslation();
    const [hovered, setHovered] = useState<boolean>(false);
    const project = useRef(null);
    const projectDescription = useRef(null);
    const coverTexture = useTexture(`images/covers/${name}.png`);
    const exit = useRef(null);
    const timeline = gsap.timeline();
    const [enteredPreviewMode, setEnteredPreviewMode] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [clickable, setClickable] = useState<boolean>(false);
    const commercialStarTexture = useTexture('images/stars/commercial.png');
    const noncommercialStarTexture = useTexture('images/stars/noncommercial.png');

    const [video] = useState(() => {
        const vid = document.createElement("video");

        vid.src = `videos/${name}.mp4`;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;

        return vid;
    });

    useEffect(() => {
        if (active || !fullScreen) document.body.style.cursor = hovered ? 'pointer' : 'auto';

        if (fullScreen) return;

        if (!project.current) return;

        hovered ?
            animate(project.current.scale, { x: 1.1, y: 1.1 }, 1, 'expo.out') :
            animate(project.current.scale, { x: 1, y: 1 }, 1, 'expo.out');
    }, [hovered])

    useEffect(() => {
        if (!project.current) return;

        if (!projectDescription.current) return;

        if (!video) return;

        if (active) {
            video.play();

            if (medium === 'desktop') {
                timeline.to(project.current.position, { x: 16, y: 0, z: -17.5 });
                timeline.to(project.current.scale, { x: 2, y: 2, z: 2, duration: 1 });
            } else {
                timeline.to(project.current.position, { x: 16.5, y: 0, z: -17.5 });
                timeline.to(project.current.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 1 });
            }

            timeline.to(project.current.rotation, {
                y: -0.2, duration: 1,
            });

            animate(projectDescription.current.children[0].material, { opacity: 0.5 }, 3);

            setVisible(true);
        } else {
            video.pause();

            timeline.to(project.current.position, { x: x, y: y, z: -18 })
            timeline.to(project.current.rotation, { y: 0, duration: 1 });
            timeline.to(project.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
            gsap.to(projectDescription.current.children[0].material, { opacity: 0, duration: 3 });

            setVisible(false);
        }
    }, [active])

    useEffect(() => {
        if (!project.current) return;

        if (focus) {
            animate(project.current.position, { x: x, y: y - 0.1, z: -18 }, 3, 'expo.out');
            animate(project.current.children[1].material, { opacity: 1 }, 3, 'expo.out', () => { project.current.children[0].visible = true; setClickable(true) });
        } else {
            animate(project.current.position, { x: rand(x - 2, x + 2), y: rand(y - 2, y + 2), z: -18 }, 3, 'expo.out');
            animate(project.current.children[1].material, { opacity: 0 }, 3, 'expo.out', null, null, () => { project.current.children[0].visible = false; setClickable(false) });
        }
    }, [focus])

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const preventAnimation = () => {
        if (timeline.isActive()) timeline.clear();
    }

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
        if (!active) return;

        e.stopPropagation();
        preventAnimation();

        if (medium === 'desktop')
            timeline.to(project.current.position, { x: 15, y: 0, z: -16.5 });
        else
            timeline.to(project.current.position, { x: 15, y: 0, z: -17.1 });

        timeline.to(project.current.rotation, {
            y: 0,
            duration: 1,
            onComplete: () => setEnteredPreviewMode(true)
        });

        animate(projectDescription.current.children[0].material, { opacity: 0 }, 3);

        setVisible(false);
    }

    const onExitPreviewMode = (e: ThreeEvent<MouseEvent>) => {
        if (!active) return;

        e.stopPropagation();
        preventAnimation();

        setEnteredPreviewMode(false);

        if (medium === 'desktop')
            timeline.to(project.current.position, { x: 16, y: 0, z: -17.5 });
        else
            timeline.to(project.current.position, { x: 16.5, y: 0, z: -17.5 });

        timeline.to(project.current.rotation, { y: -0.2, duration: 1 });
        animate(projectDescription.current.children[0].material, { opacity: 0.5 }, 3);

        setVisible(true);
    }

    return (
        <>
            <group
                ref={project}
                onClick={fullScreen ? (e) => onEnterPreviewMode(e) : (e) => onSelected(e)}
                onPointerMissed={fullScreen ? (e) => onExitPreviewMode(e) : null}
                onPointerOver={enteredPreviewMode ? () => setHovered(false) : () => setHovered(true)}
                onPointerOut={enteredPreviewMode ? () => setHovered(true) : () => setHovered(false)}
            >
                <group position-z={0.08}>
                    <mesh>
                        <meshBasicMaterial>
                            <videoTexture attach="map" args={[video]} />
                        </meshBasicMaterial>
                        <planeGeometry args={medium == 'desktop' ? [1.8, 0.8] : [0.8, 1.8]} />
                    </mesh>
                    <mesh visible={!active}>
                        <meshBasicMaterial map={coverTexture} />
                        <planeGeometry args={medium == 'desktop' ? [1.8, 0.8] : [0.8, 1.8]} />
                    </mesh>
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
                        <planeBufferGeometry args={[0.2, 0.2]} />
                        <meshStandardMaterial map={commercialStarTexture} transparent />
                    </mesh>
                    :
                    <mesh
                        position={[-0.45, 0.58, 0.1]}
                        layers={1}
                    >
                        <planeBufferGeometry args={[0.2, 0.2]} />
                        <meshStandardMaterial map={noncommercialStarTexture} transparent />
                    </mesh>}
                <mesh>
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshStandardMaterial
                        color='#000'
                        transparent
                    />
                </mesh>
                <group>
                    <Text
                        color='#d4af37'
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
                {logos.map((logo: string, index: number) => {
                    const texture = new TextureLoader().load(`images/logos/${logo}.png`);

                    return (
                        <Fragment key={index}>
                            <mesh
                                position-x={0.5 * (index % 3) - 0.5}
                                position-y={index < 3 ? -0.5 : -0.7}
                            >
                                <planeBufferGeometry args={[0.25, 0.1]} />
                                <meshStandardMaterial map={texture} transparent />
                            </mesh>
                        </Fragment>
                    )
                })}
            </group>
            {
                fullScreen &&
                <Text
                    ref={exit}
                    position={[16.8, -1, -16.5]}
                    color='#d4af37'
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