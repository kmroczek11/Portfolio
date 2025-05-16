uniform sampler2D tDiffuse;
uniform float amount;
varying vec2 vUv;

float linearToRelativeLuminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  float l = linearToRelativeLuminance(texel.rgb);
  gl_FragColor = vec4(l, l, l, texel.w) * amount;
}