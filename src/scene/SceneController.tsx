import { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import gsap from 'gsap';
import { Types } from '../context/reducers';
import { useThree } from '@react-three/fiber';

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
        if (!camera) return;

        switch (currentItem) {
            case 'home.to':
                gsap.to(camera.position, { x: 0, y: 0, z: 5, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('home.end') });
                break;
            case 'education.to':
                gsap.to(camera.position, { x: 0, y: 0, z: -15, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('education.end') });
                break;
            case 'projects.to':
                gsap.to(camera.position, { x: 15, y: 0, z: -15, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('projects.end') });
                break;
            case 'contact.to':
                gsap.to(camera.position, { x: 15, y: 0, z: 5, duration: 3, ease: 'expo.out', onComplete: () => onNavigationEnded('contact.end') });
                break;
            default:
                break;
        }
    })

    return null;
}

export default SceneController;