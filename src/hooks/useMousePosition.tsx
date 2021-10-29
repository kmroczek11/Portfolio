import { useState, useEffect } from 'react';

const useMousePosition = (world: string) => {
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: null, y: null });

    const updateMousePosition = ev => {
        setMousePosition(
            {
                x: world === '2D' ? ev.clientX : (ev.clientX / window.innerWidth) * 2 - 1,
                y: world === '2D' ? ev.clientY : -(ev.clientY / window.innerWidth) * 2 + 1
            }
        );
    };

    useEffect(() => {
        window.addEventListener('mousemove', updateMousePosition);

        return () => window.removeEventListener('mousemove', updateMousePosition);
    });

    return mousePosition;
};

export default useMousePosition;