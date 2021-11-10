import { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import { Types } from '../context/reducers';
import { useThree } from '@react-three/fiber';
import { animate } from '../components/functions';

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
                animate(camera.position, { x: 0, y: 0, z: 5 }, 3, 'expo.out', () => onNavigationEnded('home.end'));
                break;
            case 'education.to':
                animate(camera.position, { x: 0, y: 0, z: -15 }, 3, 'expo.out', () => onNavigationEnded('education.end'));
                break;
            case 'projects.to':
                animate(camera.position, { x: 15, y: 0, z: -15 }, 3, 'expo.out', () => onNavigationEnded('projects.end'));
                break;
            case 'contact.to':
                animate(camera.position, { x: 15, y: 0, z: 5 }, 3, 'expo.out', () => onNavigationEnded('contact.end'));
                break;
            default:
                break;
        }
    })

    return null;
}

export default SceneController;