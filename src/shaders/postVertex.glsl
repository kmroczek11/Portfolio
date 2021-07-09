varying vec2 vertexUv;

void main() {
  vertexUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}