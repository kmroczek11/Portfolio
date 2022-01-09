import { useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react';
import Model from '../components/Model';

const radius = 5;
const depth = 6;

// const Objects = ({ focus }: { focus: boolean }): JSX.Element => {
const Objects = (): JSX.Element => {
    const desktop = useRef(null);
    const phone = useRef(null);
    const tablet = useRef(null);
    const [angle, setAngle] = useState(0);

    useFrame(() => {
        if (!desktop.current || !phone.current || !tablet.current) return;

        const d = desktop.current;
        const p = phone.current;
        const t = tablet.current;

        d.position.x = Math.cos(angle * Math.PI / 180) * radius;
        d.position.z = Math.sin(angle * Math.PI / 180) * radius - depth;

        p.position.x = Math.cos((angle + 110) * Math.PI / 180) * radius;
        p.position.z = Math.sin((angle + 110) * Math.PI / 180) * radius - depth;

        t.position.x = Math.cos((angle + 200) * Math.PI / 180) * radius;
        t.position.z = Math.sin((angle + 200) * Math.PI / 180) * radius - depth;

        d.rotation.x -= 0.05;
        d.rotation.z -= 0.05;

        p.rotation.x -= 0.05;
        p.rotation.z -= 0.05;

        t.rotation.x -= 0.05;
        t.rotation.z -= 0.05;

        setAngle(angle + 1);
    })

    return (
        <>
            <Model
                ref={desktop}
                path='desktop.glb'
                position-y={3}
            />
            <Model
                ref={phone}
                path='phone.glb'
                position-y={0}
            />
            <Model
                ref={tablet}
                path='tablet.glb'
                position-y={-3}
            />
        </>
    )
}

export default Objects;