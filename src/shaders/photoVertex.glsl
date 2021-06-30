varying vec2 vertexUV;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;
uniform float move;
uniform float time;

void main() {
  vertexUV = uv;
  vec3 pos = position;
  pos.z = move * aSpeed * aOffset;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 20.0 * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  vCoordinates = aCoordinates.xy;
}