import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vector3 } from 'three/src/math/Vector3';
import { rotateAroundPoint } from '../components/functions';

// const Objects = ({ focus }: { focus: boolean }): JSX.Element => {
const Objects = (): JSX.Element => {
    const monitor = useLoader(GLTFLoader, 'models/monitor.glb');
    const phone = useLoader(GLTFLoader, 'models/phone.glb');
    const tablet = useLoader(GLTFLoader, 'models/tablet.glb');

    useFrame(() => {
        monitor.scene && rotateAroundPoint(monitor.scene, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        phone.scene && rotateAroundPoint(phone.scene, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
        tablet.scene && rotateAroundPoint(tablet.scene, new Vector3(0, 0, -3), new Vector3(0, 1, 0), 1 * Math.PI / 180, true);
    })

    return (
        <>
            <mesh position={[-4, 1, 0]}>
                <primitive object={monitor.scene} />
            </mesh>
            <mesh position={[-4, -0.5, 0]}>
                <primitive object={phone.scene} />
            </mesh>
            <mesh position={[4, 1, 0]}>
                <primitive object={tablet.scene} />
            </mesh>
        </>
    )
}

export default Objects;