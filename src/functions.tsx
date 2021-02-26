import { Vector3, Euler } from 'three';
import TWEEN from '@tweenjs/tween.js';

// export const moveObject = (obj: any, position: Vector3, targetVector: Vector3, speed: number) => {
//     const direction = new Vector3();
//     direction.subVectors(targetVector, position);
//     const vector = direction.multiplyScalar(speed);

//     obj.position.x += vector.x;
//     obj.position.y += vector.y;
//     obj.position.z += vector.z;
// }

export const tweenObject = (obj: Vector3, target: Vector3, options: any) => {
    options = options || {};
    var to = target || new Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;
    var tweenObj = new TWEEN.Tween(obj)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .onUpdate((d) => {
            if (options.update) {
                options.update(d);
            }
        })
        .onComplete(() => {
            if (options.callback) options.callback();
        })
        .start();
    return tweenObj;
}

export const rotateAroundPoint = (obj: any, point: Vector3, axis: Vector3, theta: number, pointIsWorld: boolean) => {
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;
    if (pointIsWorld) obj.parent.localToWorld(obj.position); // compensate for world coordinate
    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset
    if (pointIsWorld) obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}