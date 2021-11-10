import gsap from "gsap";
import { Shape } from "three/src/extras/core/Shape";
import { ShapeBufferGeometry } from "three/src/geometries/ShapeGeometry";
import { Vector3 } from "three/src/math/Vector3";

export const animate = (
  target: gsap.TweenTarget,
  values: any,
  duration: number,
  ease?: string,
  onComplete?: () => void,
  onUpdate?: () => void
) => {
  gsap.to(target, {
    ...values,
    duration: duration,
    ease: ease,
    onUpdate: onUpdate,
    onComplete: onComplete,
  });
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

export const RoundedRectangleGeometry = (
  width: number,
  height: number,
  radius: number
) => {
  let shape = new Shape();
  let x = 1;
  let y = 1;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);

  let geometry = new ShapeBufferGeometry(shape);
  geometry.center();

  return geometry;
};
