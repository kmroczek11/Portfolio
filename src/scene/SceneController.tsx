import { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import gsap from 'gsap';
import { Types } from '../context/reducers';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { Vector2 } from 'three/src/math/Vector2';

const SceneController = (): JSX.Element => {
    const { state, dispatch } = useContext(AppContext);
    const { camera } = useThree();
    const { currentItem } = state.scene;

    const onNavigationEnded = (name: string) => {
        dispatch({
            type: Types.SetCurrentItem,
            payload: name,
        });
    }

    useEffect(() => {
        switch (currentItem) {
            case 'home.to':
                camera && gsap.to(camera.position, { x: 0, y: 0, z: 5, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('home.end') });
                break;
            case 'education.to':
                camera && gsap.to(camera.position, { x: 0, y: 0, z: -15, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('education.end') });
                break;
            case 'projects.to':
                camera && gsap.to(camera.position, { x: 15, y: 0, z: -15, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('projects.end') });
                break;
            case 'contact.to':
                camera && gsap.to(camera.position, { x: 15, y: 0, z: 5, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('contact.end') });
                break;
            default:
                break;
        }
    }, [currentItem])

    return null;
}

export default SceneController;