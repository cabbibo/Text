uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_og;

uniform mat4 bodyMatrix;

uniform float dT;
uniform float time;
uniform float speed;
uniform float selected;

uniform vec3 repelerPos;
uniform vec3 repelerVel;

uniform vec2  resolution;

varying vec2 vUv;

$simplex
$curl

void main(){

  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 oPos = vec4( texture2D( t_oPos , uv ).xyz , 1. );
  vec4 pos  = vec4( texture2D( t_pos , uv ).xyz , 1. );
  vec4 og   = vec4( texture2D( t_og , uv ).xyz , 1. );

  vec3 vel = pos.xyz - oPos.xyz;
  vec3 f = vec3( 0. );


  float mass = snoise( og.xyz * 20. + vec3( 0. , time * .01 , 0. ) ) * .3 + 3.;
  
  f += vec3( 0. , -.03 , 0. ) * speed * mass;

  f += (og.xyz - pos.xyz) * .004 * selected;

  vec3 dif = (bodyMatrix * vec4(  repelerPos - pos.xyz , 1. )).xyz;
  f -= .01 * length( repelerVel ) * normalize(dif)/ length(dif ); 

  vec3 c = curlNoise( pos.xyz * 1. );

  f += c * ( 1. - selected ) * .001;

  vel += f * 1. * mass;
  vel *= .8;

 
  ///float mass = snoise( og.xyz * 20. ) + 2.;
 
  vec3 p = pos.xyz + vel;

 
  gl_FragColor = vec4( p , 1. );


}
