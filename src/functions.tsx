import { Vector3 } from 'three/src/math/Vector3';

export const moveElement = (element: any, position: Vector3, targetVector: Vector3) => {
    const direction = new Vector3();
    const speed = 0.01;
    direction.subVectors(targetVector, position);
    const vector = direction.multiplyScalar(speed);

    element.position.x += vector.x;
    element.position.y += vector.y;
    element.position.z += vector.z;
}

export const rotateAroundPoint = (obj, point, axis, theta, pointIsWorld) => {
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}