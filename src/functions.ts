import { Vector3 } from "three/src/math/Vector3";

export const moveObject = (
  obj: any,
  position: Vector3,
  targetVector: Vector3,
  speed: number
) => {
  const direction = new Vector3();
  direction.subVectors(targetVector, position);
  const vector = direction.multiplyScalar(speed);

  obj.position.x += vector.x;
  obj.position.y += vector.y;
  obj.position.z += vector.z;
};

export const rotateAroundPoint = (
  obj: any,
  point: Vector3,
  axis: Vector3,
  theta: number,
  pointIsWorld: boolean
) => {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

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
};

export const equals = (v1: Vector3, v2: Vector3, epsilon = Number.EPSILON) => {
  return (
    Math.abs(v1.x - v2.x) < epsilon &&
    Math.abs(v1.y - v2.y) < epsilon &&
    Math.abs(v1.z - v2.z) < epsilon
  );
};
