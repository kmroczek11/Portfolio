import React, { Suspense, useContext, useRef, useState, useEffect } from 'react';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveElement } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import { useAspect } from '@react-three/drei/core/useAspect'

interface ProjectItem {
    id: number,
    name: string,
    src: string,
    x: number,
    y: number,
    active: boolean,
    onActive?: (name: string) => void,
}

const Project = ({ id, name, src, x, y, active, onActive }: ProjectItem): JSX.Element => {
    // const [ax, ay] = useAspect("cover", 2, 3);
    const [hovered, setHovered] = useState<boolean>(false)
    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.src = src;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.play();
        return vid;
    });
    const project = useRef(null);

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    useFrame(() => {
        if (active) project && moveElement(project.current, project.current.position, new Vector3(10, 0, -11.2), 0.1)
        if (!active) project && moveElement(project.current, project.current.position, new Vector3(x, y, -13), 0.1)
    })

    return (
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
                    <videoTexture attach="map" args={[video]} />
                </meshBasicMaterial>
            </mesh>
            <mesh position-y={-0.6}>
                <planeBufferGeometry args={[1.5, 0.4]} />
                <meshBasicMaterial color={'#000'} />
            </mesh>
        </group>
    )
}

const Projects = React.memo(() => {
    console.log('projects rendered');
    const [projectItems, setProjectItems] = useState<Array<ProjectItem>>([
        { id: 0, name: 'PROJEKT STRONY GFE', src: './videos/gfe.mp4', x: 7, y: 1, active: false },
        { id: 1, name: 'PROJEKT STRONY STALCRAFT', src: '', x: 9, y: 1, active: false },
        { id: 2, name: 'PROJEKT SKLEPU INTERNETOWEGO', src: '', x: 11, y: 1, active: false },
        { id: 3, name: 'CORONASTATS', src: '', x: 13, y: 1, active: false },
        { id: 4, name: 'MARBLES', src: '', x: 7, y: -1, active: false },
        { id: 5, name: 'MP3 PLAYER', src: '', x: 9, y: -1, active: false },
        { id: 6, name: 'TESTER', src: '', x: 11, y: -1, active: false },
        { id: 7, name: 'TASKY', src: '', x: 13, y: -1, active: false },
    ]);
    const [activeName, setActiveName] = useState<string>(null);

    useEffect(() => {
        setProjectItems(prevProjectItems => prevProjectItems.map((e: ProjectItem) => e.name == activeName ? { ...e, active: true } : { ...e, active: false }))
    }, [activeName])

    return (
        <mesh>
            {
                projectItems.map((e: ProjectItem, i: number) => <Project key={i} {...e} onActive={(name: string) => setActiveName(name)} />)
            }
        </mesh>
    )
})

export default Projects;