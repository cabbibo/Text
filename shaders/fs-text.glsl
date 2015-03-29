uniform vec3 color;
uniform sampler2D t_text;
uniform float opacity; 

varying vec4 vTextCoord;
varying vec2 vTextOffset;
varying vec4 vLookup;
varying vec3 vPos;
varying vec2 vUv;
varying float vID;

uniform float textureSize;
uniform float glyphWidth;
uniform float glyphHeight;
uniform float glyphBelow;


const float smoothing = 1. / 2.0;


void main(){


  float totalSize = glyphHeight;

  float widthOffset = (glyphHeight - glyphWidth)/2.;
  float wOPercent = widthOffset / totalSize;


  float belowP = glyphBelow / totalSize;

  float wO = (glyphHeight - glyphWidth)/2.;
  float wh = glyphWidth / glyphHeight;

  float x = vTextCoord.x;
  float y = vTextCoord.y;
  float w = vTextCoord.z;
  float h = vTextCoord.w;

  float xO = vTextOffset.x;
  float yO = vTextOffset.y;

  float xF = x - xO - widthOffset + vUv.x *w; //(wP + xP)*w; //* w * .1;
  float yF = y + yO + glyphBelow - (1.-vUv.y)* h; 

  xF = x + vUv.x * w;
  yF = y + (1. - vUv.y) * h;
  ///vec2 sCoord =  vec2( x + vUv.x * w , y + (1.- vUv.y) * h);
  vec2 sCoord =  vec2( xF , yF );
  
  vec3 col = vec3( 1. , 0. , 0. );

  vec4 glyph = texture2D( t_text , sCoord );

  if( vUv.x < .1 || vUv.x > .9 || vUv.y < .1 || vUv.y > .9 ){
    col = vec3( 1. );
  } 

  
  gl_FragColor =   glyph * vec4( vec3( 1. , 0. , mod( vID , 5. )/ 4. ), 1. );


}
