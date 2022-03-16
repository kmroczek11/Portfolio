import { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import { Types } from '../context/reducers';
import { useThree } from '@react-three/fiber';
import { animate } from '../components/functions';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';

const SceneController = (): JSX.Element => {
    const { gl, camera }: { gl: WebGLRenderer, camera: PerspectiveCamera } = useThree();
    const { domElement: canvas } = gl;
    const { state, dispatch } = useContext(AppContext);
    const { currentItem } = state.scene;

    const adjustCanvasSize = () => {
        // look up the size the canvas is being displayed
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        if (width === 0) return;

        if (width < 768)
            // swap width and height on mobile
            [width, height] = [height, width];

        // adjust displayBuffer size to match
        if (canvas.width !== width || canvas.height !== height) {
            const ratio = window.devicePixelRatio;
            // you must pass false here or three.js sadly fights the browser
            gl.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            // update any render target sizes here
        }
    }

    useEffect(() => {
        if (!camera || !gl) return;

        adjustCanvasSize();
        window.addEventListener('resize', adjustCanvasSize, false);
    }, [canvas?.clientWidth, camera, gl])

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