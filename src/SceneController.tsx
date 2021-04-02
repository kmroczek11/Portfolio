import React, { useContext, useEffect } from 'react';
import { useFrame } from 'react-three-fiber'
import { AppContext } from './context';
import { moveObject } from './functions';
import { Vector3 } from 'three/src/math/Vector3';
import gsap from 'gsap';
import { Types } from './context/reducers';

const SceneController = (): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);
    const { camera, currentItem } = state.scene;

    const onNavigationEnded = (name: string) => {
        dispatch({
            type: Types.SetCurrentItem,
            payload: name,
        });
    }

    useEffect(() => {
        switch (currentItem) {
            case 'home.to':
                camera && gsap.to(camera.position, { onComplete: () => onNavigationEnded('home.end'), duration: 5, ease: 'expo.out', x: 0, y: 0, z: 5 });
                break;
            case 'education.to':
                camera && gsap.to(camera.position, { onComplete: () => onNavigationEnded('education.end'), duration: 5, ease: 'expo.out', x: 0, y: 0, z: -15 });
                break;
            case 'projects.to':
                camera && gsap.to(camera.position, { onComplete: () => onNavigationEnded('projects.end'), duration: 5, ease: 'expo.out', x: 15, y: 0, z: -15 });
                break;
            case 'contact.to':
                camera && gsap.to(camera.position, { onComplete: () => onNavigationEnded('contact.end'), duration: 5, ease: 'expo.out', x: 15, y: 0, z: 5 });
                break;
            default:
                break;
        }
    }, [currentItem])

    return null;
}

export default SceneController;