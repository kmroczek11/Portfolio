varying vec2 vCoordinates;
uniform sampler2D photo;
uniform sampler2D mask;

void main() {
  vec2 myUV = vec2(vCoordinates.x / 3.0, vCoordinates.y / 4.0);
  vec4 image = texture2D(photo, myUV);
  vec4 maskTexture = texture2D(mask, gl_PointCoord);
  gl_FragColor = image;
  gl_FragColor.a *= maskTexture.r;
}