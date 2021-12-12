import React, { forwardRef, useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RoughnessMipmapper } from 'three-stdlib';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { MeshProps, useThree } from '@react-three/fiber';

interface ModelItem extends MeshProps {
    path: string;
}

const Model = forwardRef((props: ModelItem, ref): JSX.Element => {
    const [gltf, set] = useState<Group>(null);
    const { gl } = useThree();

    useEffect(() => {
        // use of RoughnessMipmapper is optional
        const roughnessMipmapper = new RoughnessMipmapper(gl);

        const loader = new GLTFLoader().setPath('models/');

        loader.load(props.path, (gltf) => {
            gltf.scene.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    (child as Mesh).material = new MeshStandardMaterial({
                        color: '#000',
                        metalness: 5,
                        roughness: 0
                    })

                    // @ts-ignore: Unreachable code error
                    if (child.material.map) child.material.map.anisotropy = 16;
                    roughnessMipmapper.generateMipmaps((child as Mesh).material as MeshStandardMaterial);
                }
            });
            roughnessMipmapper.dispose();
            set(gltf.scene)
        })
    }, [props.path])

    return gltf &&
        <primitive
            {...props}
            ref={ref}
            object={gltf}
            dispose={null}
        />
})

export default Model;