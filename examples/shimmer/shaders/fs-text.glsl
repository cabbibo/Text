uniform vec3 color;
uniform sampler2D t_text;
uniform float opacity; 
uniform float time; 

varying vec4 vTextCoord;
varying vec2 vUv;
varying float vDist;

varying vec3 vNorm;
varying vec3 vMPos;

const float smoothing = 1. / 8.0;

void main(){


  float x = vTextCoord.x;
  float y = vTextCoord.y;
  float w = vTextCoord.z;
  float h = vTextCoord.w;

  float xF = x + vUv.x * w;
  float yF = y + (1. - vUv.y) * h;

  vec2 sCoord =  vec2( xF , yF );

  vec3 col = vNorm * .5 + .5;
  
  float distance = texture2D( t_text , sCoord ).a;

  float lum = smoothstep( 0.4 - smoothing , 0.4 + smoothing , distance );
  float alpha = lum;

  if( distance < .1 ){  alpha = 0.; }
 

  gl_FragColor = vec4(col * pow( vDist , 100. ) , alpha * opacity );


}
