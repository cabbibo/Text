function PhysicsText( soulParams , bodyParams ){ 

  console.log( bodyParams );

  this.size = Math.ceil( Math.sqrt( bodyParams.string.length ) );


  this.soul = new PhysicsRenderer( 
    this.size,
    soulParams.ss,
    soulParams.renderer
  );

  this.soul.setUniforms( soulParams.uniforms );

  this.bodyUniforms = {}

  var i = new THREE.Matrix4();
  this.bodyMatrix = {  type:"m4" , value: i };


  for( var propt in bodyParams.params.uniforms ){

    this.bodyUniforms[ propt ] = bodyParams.params.uniforms[ propt ];

  }

  this.bodyUniforms.bodyMatrix = this.bodyMatrix;

  console.log('bs');
  console.log( this.bodyUniforms );
  console.log( bodyParams.params.uniforms );

  bodyParams.params.uniforms = this.bodyUniforms;

  this.body = new TextParticles(
    bodyParams.string,
    bodyParams.font,
    bodyParams.vs,
    bodyParams.fs,
    bodyParams.params
  );

  this.bodyUniforms = this.body.material.uniforms;


  this.soul.setUniform( 't_og' , { type:"t" , value: this.body.lookup } );
  this.soul.setUniform( 'bodyMatrix' , this.bodyMatrix );

  this.soul.addBoundTexture( this.bodyUniforms.t_lookup , 'output' ); 

  if( this.bodyUniforms.t_oPos ){
    this.soul.addBoundTexture( this.bodyUniforms.t_oPos , 'oOutput' ); 
  }

  if( this.bodyUniforms.t_ooPos ){
    this.soul.addBoundTexture(this.bodyUniforms.t_ooPos , 'ooOutput' ); 
  }

  this.soul.resetRand( 5 );



}

PhysicsText.prototype.update = function(){

  this.soul.update();

}

PhysicsText.prototype.updateMatrices = function(){

  this.body.updateMatrixWorld();

  this.bodyMatrix.value.getInverse( this.body.matrixWorld );




}

