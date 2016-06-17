
attribute vec4 textCoord;
attribute vec2 lookup;

uniform sampler2D t_lookup;

varying vec4 vTextCoord;
varying vec2 vUv;

void main(){
  
  vUv         = uv;
  vTextCoord  = textCoord;
  
  vec3 pos = texture2D( t_lookup , lookup ).xyz + position;

  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
 
  gl_Position = projectionMatrix * mvPos;

}
