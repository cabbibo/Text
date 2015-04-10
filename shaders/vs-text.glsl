
attribute vec4 textCoord;
attribute vec2 lookup;

uniform sampler2D t_lookup;

uniform vec3 repelerPos;
uniform mat4 bodyMatrix;

uniform float time;

varying vec4 vTextCoord;
varying vec2 vUv;
varying vec3 vMPos;

const float bumpSize = 10.;
const float bumpHeight = 1.;

void main(){
  
  vUv         = uv;
  vTextCoord  = textCoord;
  
  vec3 pos = texture2D( t_lookup , lookup ).xyz;
 

  vec2 offset = vec2( 0. , time );

  
  pos = pos + position;


  vMPos =( modelMatrix * vec4( pos , 1. )).xyz;




  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
 
  gl_Position = projectionMatrix * mvPos;

}
