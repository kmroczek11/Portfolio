uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vertexUv;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  float width = 0.1;
  vec3 mySample = 1.0 - texture2D(map, vertexUv).rgb;
  float sigDist = median(mySample.r, mySample.g, mySample.b) - 0.5;
  float fill = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  float border = fwidth(sigDist);
  float outline = smoothstep(0.0, border, sigDist);
  // outline *= smoothstep(width - border, width, sigDist);
  gl_FragColor = vec4(color.xyz, fill * opacity);
  gl_FragColor = vec4(vec3(outline), fill);
  // if (gl_FragColor.a < 0.001) discard;
}