import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { Vector2 } from 'three/src/math/Vector2'
import {
    DEFAULT_LAYER_NUM,
    BLOOM_LAYER_NUM,
    FILM_LAYER_NUM,
    MULTIPASS_LAYER_NUM
} from "../postprocessing/constant";
import { createRenderPass, bloomPass, filmPass, createFinalPass } from "../postprocessing/pass";

const Effects = (): JSX.Element => {
    const { scene, gl, size, camera } = useThree()
    const [bloomComposer, setBloomComposer] = useState<EffectComposer>(null);
    const [finalComposer, setFinalComposer] = useState<EffectComposer>(null);

    useMemo(() => {
        const renderPass = createRenderPass(scene, camera);

        // setup bloom composer
        const bloomComposer = new EffectComposer(gl);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderPass);
        bloomComposer.addPass(bloomPass);

        // setup film composer
        // const filmComposer = new EffectComposer(gl);
        // filmComposer.renderToScreen = false;
        // filmComposer.addPass(renderPass);
        // filmComposer.addPass(filmPass);

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
            bloomComposer,
            // filmComposer,
            // multipassComposer
        );
        finalComposer.addPass(finalPass);

        gl.autoClear = false;

        setBloomComposer(bloomComposer);
        setFinalComposer(finalComposer);
    }, [])

    useFrame(() => {
        gl.clear();

        camera.layers.set(BLOOM_LAYER_NUM);
        bloomComposer.swapBuffers();
        bloomComposer.render();

        camera.layers.set(DEFAULT_LAYER_NUM);
        finalComposer.swapBuffers();
        finalComposer.render();
    })

    return null;
}

export default Effects;
