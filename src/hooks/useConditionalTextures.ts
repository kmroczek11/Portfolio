import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

const useConditionalTextures = (
    urls: string[],
    enabled: boolean
) => {
    const textures = useLoader(TextureLoader, urls);

    // Only return actual textures if enabled
    return useMemo(() => {
        return enabled ? textures : new Array(urls.length).fill(null);
    }, [enabled, textures, urls.length]);
}

export default useConditionalTextures
