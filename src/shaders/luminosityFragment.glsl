#include <common>

uniform sampler2D tDiffuse;
uniform float amount;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  float l = linearToRelativeLuminance(texel.rgb);
  gl_FragColor = vec4(l, l, l, texel.w) * amount;
}