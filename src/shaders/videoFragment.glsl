varying vec2 vertexUv;

uniform sampler2D u_tex;
uniform vec2 u_adjust_uv;

void main() {
  vec2 uv = vec2(0.5) + vertexUv * u_adjust_uv - u_adjust_uv * 0.5;
  vec3 color = vec3(0.3);
  if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x < 1.0 && uv.y < 1.0)
    color = texture2D(u_tex, uv).rgb;
  gl_FragColor = vec4(color, 1.0);
}