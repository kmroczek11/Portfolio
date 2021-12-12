varying vec2 vCoordinates;
varying float vDepth;
uniform sampler2D photo;
uniform sampler2D mask;

void main() {
  vec4 maskTexture = texture2D(mask, gl_PointCoord);
  vec2 myUV = vec2(vCoordinates.x / 3.0, vCoordinates.y / 4.0);
  vec4 image = texture2D(photo, myUV);
  gl_FragColor = image * maskTexture;
  if (vDepth > 5.0) discard;
}