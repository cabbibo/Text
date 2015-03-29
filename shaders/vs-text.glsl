
attribute vec4 textCoord;
attribute vec2 textOffset;

uniform sampler2D t_lookup;

uniform vec2 windowSize;

uniform float dpr;
uniform float textureSize;
uniform float letterWidth;


varying vec4 vLookup;
varying vec4 vTextCoord;
varying vec2 vTextOffset;
varying vec3 vPos;


void main(){
  
  vec2 uv     = position.xy + .5/textureSize;

  vPos        = texture2D( t_lookup , uv ).xyz;
  vTextCoord  = textCoord;//texture2D( t_textCoord , uv );
  vTextOffset = textOffset;


  vec3 pos = vPos;
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
 
  float size = ( letterWidth * 1. * dpr);// length( mvPos );

  gl_PointSize = size * windowSize.x * .8 / length( mvPos.xyz ) ;

//vec4 mvPos = modelViewMatrix * vec4( position , 1.0 );

  gl_Position = projectionMatrix * mvPos;

}
