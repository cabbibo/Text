float angleBetween( vec3 v1 , vec3 v2 ){

  float a = acos( dot(v1, v2) / (length(v1) * length(v2)) );
  return a;

}
