import { useFrame } from '@react-three/fiber'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three/src/math/Vector3';
import Model from '../components/Model';
import { AppContext } from '../context';
import { rotateAroundPoint } from '../components/functions';

// const Objects = ({ focus }: { focus: boolean }): JSX.Element => {
const Objects = (): JSX.Element => {
    const desktop = useRef(null);
    const phone = useRef(null);
    const tablet = useRef(null);
    const { state } = useContext(AppContext);
    const [angle, setAngle] = useState(0);
    const [radius] = useState(5);
    const [depth] = useState(6);

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

        setAngle(prevAngle => prevAngle + 1);
    })

    useEffect(() => {
        if (!phone.current) return;

        state.scene.gui.add(phone.current.position, 'x', -5, 5)
        state.scene.gui.add(phone.current.position, 'y', -5, 5)
        state.scene.gui.add(phone.current.position, 'z', -5, 5)
        // state.scene.gui.add(phone.current.material.metalness, 'metalness', 0, 5)
        // state.scene.gui.add(phone.current.material.roughness, 'roughness', 0, 5)
    }, [])

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