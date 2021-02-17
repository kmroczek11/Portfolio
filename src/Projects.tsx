import React, { Suspense, useContext, useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from 'react-three-fiber'
import { AppContext } from './context';
import { moveElement } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

interface ProjectItem {
    id: number,
    name: string,
    videoSrc: string,
    imageSrc: string,
    x: number,
    y: number,
    active: boolean,
    onActive?: (name: string) => void,
}

const Project = ({ id, name, videoSrc, imageSrc, x, y, active, onActive }: ProjectItem): JSX.Element => {
    // const [ax, ay] = useAspect("cover", 2, 3);
    const [hovered, setHovered] = useState<boolean>(false);
    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.src = videoSrc;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.play();
        return vid;
    });
    const project = useRef(null);
    const description = useRef(null);
    const texture = useLoader(TextureLoader, imageSrc);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    useFrame(() => {
        if (active) {
            project && moveElement(project.current, project.current.position, new Vector3(10, 0.2, -11.5), 0.1);
            description && moveElement(description.current, description.current.position, new Vector3(11, 0.2, -11.5), 0.1);
        }
        if (!active) {
            project && moveElement(project.current, project.current.position, new Vector3(x, y, -13), 0.1);
            description && moveElement(description.current, description.current.position, new Vector3(x, y, -13), 0.1);
        }
    })

    return (
        <>
            <group
                ref={project}
                position={[x, y, -13]}
                // scale={[ax, ay, 1]}
                onClick={() => onActive(name)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <mesh>
                    <planeBufferGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial >
                        <videoTexture args={[video]} />
                    </meshBasicMaterial>
                </mesh>
                <mesh position-y={-0.55}>
                    <planeBufferGeometry args={[1.5, 0.4]} />
                    <meshStandardMaterial transparent map={texture} />
                </mesh>
            </group>
            <mesh ref={description} position={[x, y, -13]}>
                <planeBufferGeometry args={[1.5,1.5]} />
                <meshStandardMaterial />
            </mesh>
        </>
    )
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'PROJEKT STRONY GFE', videoSrc: './videos/gfe.mp4', imageSrc: 'images/descriptions/gfe.svg', x: 7, y: 1, active: false },
        { id: 1, name: 'PROJEKT STRONY STALCRAFT', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 9, y: 1, active: false },
        { id: 2, name: 'PROJEKT SKLEPU INTERNETOWEGO', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 11, y: 1, active: false },
        { id: 3, name: 'CORONASTATS', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 13, y: 1, active: false },
        { id: 4, name: 'MARBLES', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 7, y: -1, active: false },
        { id: 5, name: 'MP3 PLAYER', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 9, y: -1, active: false },
        { id: 6, name: 'TESTER', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 11, y: -1, active: false },
        { id: 7, name: 'TASKY', videoSrc: './videos/gfe.mp4', imageSrc: 'images/photo.png', x: 13, y: -1, active: false },
    ]);
    const [activeName, setActiveName] = useState<string>(null);

    useEffect(() => {
        setProjectItems(prevProjectItems => prevProjectItems.map((e: ProjectItem) => e.name == activeName ? { ...e, active: true } : { ...e, active: false }))
    }, [activeName])

    return (
        <>
            {
                projectItems.map((e: ProjectItem, i: number) => <Project key={i} {...e} onActive={(name: string) => setActiveName(name)} />)
            }
        </>
    )
})

export default Projects;