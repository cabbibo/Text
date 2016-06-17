
attribute vec4 textCoord;
attribute vec2 lookup;

uniform sampler2D t_lookup;
uniform float time; 

varying vec4 vTextCoord;
varying vec2 vUv;
varying vec3 vNorm;
varying vec3 vMPos;
varying float vDist;

$simplex

void main(){
  
  vUv         = uv;
  vTextCoord  = textCoord;
 
  vec3 tpos =  texture2D( t_lookup , lookup ).xyz; 
  vec3 pos = tpos + position;

  pos += vec3( 0. , 0. , .01 * snoise( pos * 2. + time * .8 ) );
  
  vMPos = ( modelMatrix * vec4( pos , 1. ) ).xyz;

  vNorm = normalize( vec3( snoise( tpos * 30.  + time ) , snoise( tpos * 27.  + time ) , 2.)); 

  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
 
  gl_Position = projectionMatrix * mvPos;

  vDist = gl_Position.z ;

}
