uniform vec3 color;
uniform sampler2D t_text;
uniform float opacity; 

varying vec4 vTextCoord;
varying vec2 vTextOffset;
varying vec4 vLookup;
varying vec3 vPos;

uniform float textureSize;
uniform float glyphWidth;
uniform float glyphHeight;
uniform float glyphBelow;

uniform float speed;

const vec2 textSize = vec2( 16. / 512. , 16./256.);
const float smoothing = 1. / 2.0;


void main(){

  float totalSize = glyphHeight;

  float widthOffset = (glyphHeight - glyphWidth)/2.;
  float wOPercent = widthOffset / totalSize;


  float belowP = glyphBelow / totalSize;

  float wO = (glyphHeight - glyphWidth)/2.;
  float wh = glyphWidth / glyphHeight;


  float blah = vPos.x;


  float x = vTextCoord.x;
  float y = vTextCoord.y;
  float w = vTextCoord.z;
  float h = vTextCoord.w;

  float xO = vTextOffset.x;
  float yO = vTextOffset.y;

  float xP = xO / totalSize; 
  float yP = yO / totalSize;

  float wP = w / totalSize;
  float hP = h / totalSize;

  float xGL = gl_PointCoord.x;
  float yGL = gl_PointCoord.y;

  float xOG = xGL - xP;
  float yOG = yGL - yP;

  float xF = x - xO - widthOffset + gl_PointCoord.x *totalSize; //(wP + xP)*w; //* w * .1;
  float yF = y + yO + glyphBelow - (1.-gl_PointCoord.y)* totalSize; 



  vec2 sCoord =  vec2( xF , yF );

  float distance = texture2D(t_text , sCoord ).a;

  float lum = smoothstep( 0.4 - smoothing , 0.4 + smoothing , distance );
  float alpha = lum; //1. - lum;

  vec3 col = vec3( 1. );
  if( distance < .6 ){

    col = vec3( 0. , 0. , 0. );
    alpha = 0.;
   // discard;
  }


  if( gl_PointCoord.x < xP + wOPercent ){
    alpha = 0.; //discard;
    discard;

  }


  if( gl_PointCoord.x > xP + wP + wOPercent){
    alpha = 0.; //discard;
    discard;

  }

  if( (1.-gl_PointCoord.y) > yP + belowP  ){
    alpha = 0.; //discard;
    discard;

  }

  float lowerBound = (yO - h + glyphBelow)/totalSize;
  
  if( (1.-gl_PointCoord.y) < lowerBound  ){
    alpha = 0.; //discard;
    discard;

  }



  gl_FragColor = vec4(col, alpha * opacity );



}
