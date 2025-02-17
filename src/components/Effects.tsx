import { useMemo, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import {
    DEFAULT_LAYER_NUM,
    BLOOM_LAYER_NUM,
    GRAYSCALE_LAYER_NUM,
    // MULTIPASS_LAYER_NUM
} from '../postprocessing/constant';
import { createRenderPass, bloomPass, createFinalPass, grayscalePass } from "../postprocessing/pass";

const Effects = (): JSX.Element => {
    const { scene, gl, camera } = useThree()
    const [bloomComposer, setBloomComposer] = useState<EffectComposer>(null);
    const [grayscaleComposer, setGrayscaleComposer] = useState<EffectComposer>(null);
    const [finalComposer, setFinalComposer] = useState<EffectComposer>(null);

    useMemo(() => {
        const renderPass = createRenderPass(scene, camera);

        // setup bloom composer
        const bloomComposer = new EffectComposer(gl);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderPass);
        bloomComposer.addPass(bloomPass);

        // setup grayscale composer
        const grayscaleComposer = new EffectComposer(gl);
        grayscaleComposer.renderToScreen = false;
        grayscaleComposer.addPass(renderPass);
        grayscaleComposer.addPass(grayscalePass);

        // setup composer with multiple passes
        // const multipassComposer = new EffectComposer(gl);
        // multipassComposer.renderToScreen = false;
        // multipassComposer.addPass(renderPass);
        // multipassComposer.addPass(bloomPass);
        // multipassComposer.addPass(filmPass);

        // setup final composer
        const finalComposer = new EffectComposer(gl);
        finalComposer.addPass(renderPass);
        const finalPass = createFinalPass(
            gl.getPixelRatio(),
            bloomComposer,
            grayscaleComposer
            // filmComposer,
            // multipassComposer
        );
        finalComposer.addPass(finalPass);

        gl.autoClear = false;

        setBloomComposer(bloomComposer);
        setGrayscaleComposer(grayscaleComposer);
        setFinalComposer(finalComposer);
    }, [camera, gl, scene])

    useFrame(() => {
        gl.clear();

        camera.layers.set(BLOOM_LAYER_NUM);
        bloomComposer.swapBuffers();
        bloomComposer.render();

        camera.layers.set(GRAYSCALE_LAYER_NUM);
        grayscaleComposer.swapBuffers();
        grayscaleComposer.render();

        camera.layers.set(DEFAULT_LAYER_NUM);
        finalComposer.swapBuffers();
        finalComposer.render();
    })

    return null;
}

export default Effects;
