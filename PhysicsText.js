function PhysicsText( particles , ss , uniforms ){

  this.active = false;


  this.sim = ss; 
  this.particles = G.text.createTextParticles( this.string );

  this.uniforms = this.particles.material.uniforms;

  this.size = this.particles.size;


  this.physics = new PhysicsRenderer( this.size , this.sim , G.renderer );

  this.physics.setUniform( 't_to' , {
    type:"t",
    value:this.uniforms.t_lookup.value
  });

  this.physics.setUniforms( uniforms );

  this.physics.addBoundTexture( this.particles , 't_lookup' , 'output' );
  

}


PhysicsText.prototype.transport = function( position , randomSize ){

  var randomSize = randomSize || 3;
  var data = new Float32Array( this.size * this.size * 4 );
  var positionsTexture = new THREE.DataTexture(
    data, 
    this.size, 
    this.size, 
    THREE.RGBAFormat, 
    THREE.FloatType 
  );

  positionsTexture.minFilter = THREE.NearestFilter;
  positionsTexture.magFilter = THREE.NearestFilter;
  positionsTexture.generateMipmaps = false;
  positionsTexture.needsUpdate = true;

  // giving some randomness, so that objects splay out properly
  for( var i = 0; i < data.length; i += 4 ){

    data[ i + 0 ] = position.x + Math.random() * randomSize;
    data[ i + 1 ] = position.y + Math.random() * randomSize;
    data[ i + 2 ] = position.z + Math.random() * randomSize;

    data[ i + 3 ] = 0;

  }

  positionsTexture.needsUpdate = true;

  this.physics.reset( positionsTexture );


}



PhysicsText.prototype.activate = function(){

  this.active = true;

}

PhysicsText.prototype.deactivate = function(){

  this.active = false;

}

PhysicsText.prototype.update = function(){

  if( this.active === true ){

    this.physics.update();

  }


}
