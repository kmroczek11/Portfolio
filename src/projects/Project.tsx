import React, { useContext, useRef, useState, useEffect, Suspense, useMemo, Fragment } from 'react';
import { AppContext } from '../context';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { RoundedBox, Text } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Mesh, PlaneGeometry, ShaderMaterial, Vector2, VideoTexture } from 'three';
import videoVertexShader from '../shaders/videoVertex.glsl';
import videoFragmentShader from '../shaders/videoFragment.glsl';
import { PointerEvent, MouseEvent } from 'react';
import { ProjectItem } from './Projects';
import { useThree } from 'react-three-fiber';
import { Interaction } from 'three.interaction'

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
        const uniforms = {
            u_tex: { value: new VideoTexture(vidPlayer) },
            u_adjust_uv: { value: new Vector2(1, 1) }
        }
        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: videoVertexShader,
            fragmentShader: videoFragmentShader,
        });

        const video = new Mesh(geometry, material);
        return [video];
    }, []);
    const project = useRef(null);
    const projectDescription = useRef(null);
    const exit = useRef(null);
    const timeline = gsap.timeline();
    const [enteredPreviewMode, setEnteredPreviewMode] = useState<boolean>(false);

    useEffect(() => {
        if (active || !fullScreen) document.body.style.cursor = hovered ? 'pointer' : 'auto';
        if (!fullScreen) {
            hovered ?
                project.current && gsap.to(project.current.scale, { duration: 1, ease: 'expo.out', x: 1.1, y: 1.1 }) :
                project.current && gsap.to(project.current.scale, { duration: 1, ease: 'expo.out', x: 1, y: 1 });
        }
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
            timeline.to(project.current.rotation, {
                y: -0.2, duration: 1,
            });
            projectDescription.current.visible = true;
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
    //     if (project.current) {
    //         if (focus) {
    //             gsap.to(project.current.position, { duration: 3, ease: 'expo.out', x: x, y: y - 0.1, z: -18 });
    //             gsap.to(project.current.children[1].material, { duration: 3, ease: 'expo.out', opacity: 1, onComplete: () => project.current.children[0].visible = true });
    //         } else {
    //             gsap.to(project.current.position, { duration: 3, ease: 'expo.out', x: rand(x - 2, x + 2), y: rand(y - 2, y + 2), z: -18 });
    //             gsap.to(project.current.children[1].material, { duration: 3, ease: 'expo.out', opacity: 0, onComplete: () => project.current.children[0].visible = false });
    //         }
    //     }
    // }, [focus])

    const rand = (a: number, b: number) => a + (b - a) * Math.random();

    const preventAnimation = () => {
        if (timeline.isActive()) timeline.clear();
    }

    const onSelected = (e: MouseEvent) => {
        e.stopPropagation();
        if (!fullScreen) {
            preventAnimation();
            setHovered(false);
            onClick(id);
        }
    }

    const onExit = () => {
        preventAnimation();
        setHovered(false);
        onClick(null);
    }

    const onEnterPreviewMode = (e: MouseEvent) => {
        e.stopPropagation();
        if (active) {
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
            gsap.to(projectDescription.current.children[0].material, { opacity: 0, duration: 3 });
            projectDescription.current.visible = false;
        }
    }

    const onExitPreviewMode = (e: MouseEvent) => {
        e.stopPropagation();
        if (active) {
            preventAnimation();
            setEnteredPreviewMode(false);
            if (medium === 'desktop')
                timeline.to(project.current.position, { x: 16, y: 0, z: -17.5 });
            else
                timeline.to(project.current.position, { x: 16.5, y: 0, z: -17.5 });
            timeline.to(project.current.rotation, { y: -0.2, duration: 1 });
            gsap.to(projectDescription.current.children[0].material, { opacity: 0.5, duration: 3 });
            projectDescription.current.visible = true;
        }
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
                <primitive
                    // visible={false}
                    object={vidObject}
                    position-z={0.08}
                />
                <RoundedBox args={medium == 'desktop' ? [2, 1, 0.1] : [1, 2, 0.1]}>
                    <meshPhongMaterial
                        attach="material"
                        color="#000"
                    // opacity={0}
                    // transparent={true}
                    />
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
                        layers={[1]}
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
                        layers={[1]}
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
                        layers={[1]}
                    >
                        {preview}
                    </Text>
                </group>
                {logos.map((logo: string, index: number) => {
                    const texture = new TextureLoader().load(`images/logos/${logo}.png`);

                    return (
                        <Fragment key={index}>
                            <mesh
                                position-x={0.5 * (index % 3) - 0.5}
                                position-y={index < 3 ? -0.5 : -0.7}
                            >
                                <planeBufferGeometry args={[0.2, 0.1]} />
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
                    layers={[1]}
                >
                    {t('exit')}
                </Text>
            }
        </>
    )
}

export default Project;