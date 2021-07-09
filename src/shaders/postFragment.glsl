uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
uniform sampler2D filmTexture;
uniform sampler2D multipassTexture;

varying vec2 vertexUv;

void main() {
  vec4 base = texture2D(baseTexture, vertexUv);
  vec4 bloom = texture2D(bloomTexture, vertexUv);
  vec4 film = texture2D(filmTexture, vertexUv);
  vec4 multipass = texture2D(multipassTexture, vertexUv);

  gl_FragColor = bloom + film + multipass + base;
}