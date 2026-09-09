// The scene owns these uniforms; effects are independent of React's render cycle.
export const hologramVertex = `
precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 world;
uniform mat4 worldViewProjection;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
void main() {
  vPosition = (world * vec4(position, 1.0)).xyz;
  vNormal = normalize(mat3(world) * normal);
  vHeight = position.y;
  gl_Position = worldViewProjection * vec4(position, 1.0);
}`;

export const hologramFragment = `
precision highp float;
uniform float time;
uniform float reveal;
uniform float intensity;
uniform vec3 tint;
uniform vec3 cameraPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
void main() {
  float frontier = -1.7 + reveal * 3.5;
  if (vHeight > frontier) discard;
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float rim = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), 2.0);
  float scan = pow(0.5 + 0.5 * sin(vPosition.y * 110.0 - time * 4.0), 7.0);
  float sweep = pow(max(0.0, 1.0 - abs(vPosition.y - (mod(time * 0.55, 4.0) - 2.0)) * 5.0), 3.0);
  float edge = 1.0 - smoothstep(0.0, 0.1, abs(vHeight - frontier));
  float alpha = (0.10 + rim * 0.56 + scan * 0.13 + sweep * 0.16 + edge * 0.55) * intensity;
  gl_FragColor = vec4(tint * (0.65 + rim * 0.9 + edge + sweep), alpha);
}`;

export const particlesVertex = `
precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 worldViewProjection;
uniform float time;
uniform float reveal;
varying float vLight;
void main() {
  float seed = normal.x;
  float angle = seed * 53.0 + time * (0.05 + normal.z * 0.05);
  float radius = 1.15 + normal.z * 2.0;
  vec3 center = vec3(cos(angle) * radius, mod(normal.y + time * 0.15, 4.8) - 2.1, sin(angle) * radius);
  vLight = (0.3 + 0.7 * pow(0.5 + 0.5 * sin(time + seed * 91.0), 2.0)) * reveal;
  gl_Position = worldViewProjection * vec4(position + center, 1.0);
}`;

export const particlesFragment = `
precision highp float;
varying float vLight;
void main() { gl_FragColor = vec4(0.42, 0.96, 0.81, vLight * 0.6); }
`;
