
attribute vec4 textCoord;
attribute vec2 textOffset;

uniform sampler2D t_lookup;

uniform vec2 windowSize;

uniform float dpr;
uniform float textureSize;
uniform float letterWidth;

uniform float speed;


varying vec4 vLookup;
varying vec4 vTextCoord;
varying vec2 vTextOffset;
varying vec3 vPos;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 437.5453);
}

void main(){
  
  vec2 uv     = position.xy + .5/textureSize;


  vec3 target = texture2D( t_lookup , uv ).xyz;

  float y     = 0.;//speed * ( 3. + rand( uv ) ) * 5.;

  vPos        = target + vec3( 0. , y , 0. );

  vTextCoord  = textCoord;//texture2D( t_textCoord , uv );
  vTextOffset = textOffset;


  vec3 pos = vPos;
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
 
  float size = ( letterWidth * 1. * dpr);// length( mvPos );

  gl_PointSize = size * windowSize.x * .8 / length( mvPos.xyz ) ;

//vec4 mvPos = modelViewMatrix * vec4( position , 1.0 );

  gl_Position = projectionMatrix * mvPos;

}
