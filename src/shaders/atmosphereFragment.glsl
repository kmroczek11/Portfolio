varying vec3 vectorNormal; // (0, 0, 0)

void main() {
  float intensity = pow(0.75 - dot(vectorNormal, vec3(0, 0, 1.0)), 2.0);
  gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0) * intensity;
}