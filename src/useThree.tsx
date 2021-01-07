import { useState, useEffect } from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const useThree = () => {
    const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
    const [camera, setCamera] = useState<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000));
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>(new THREE.WebGLRenderer({ alpha: true }));
    const [axes, setAxes] = useState<THREE.AxesHelper>(new THREE.AxesHelper(1000));

    const init = () => {
        console.log("initializing useThree");
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x141414, 1);
        const controls = new OrbitControls(camera, renderer.domElement);
        scene.add(axes);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.set(5, 0, 5);

        document.body.appendChild(renderer.domElement);

        controls.update();
        animate();
    }

    const animate = () => {
        requestAnimationFrame(animate);
        // controls.update();
        renderer.render(scene, camera);
    };

    useEffect(() => {
        init();
        window.addEventListener("resize", function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            //   camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }, [])
}

export { useThree }