function Link( font , title , string ){

  this.v = new THREE.Vector3();

  var vs = shaders.vertexShaders.text;
  var fs = shaders.fragmentShaders.text;
  var ss = shaders.simulationShaders.text;


  this.soulUniforms = {}

  for( var propt in soulUniforms ){

    this.soulUniforms[ propt ] = soulUniforms[ propt ];

  }

  this.selected = { type: "f" , value: 0 }

  this.soulUniforms.selected = this.selected;


  this.bodyUniforms = {}

  for( var propt in bodyUniforms ){

    this.bodyUniforms[ propt ] = bodyUniforms[ propt ];

  }

  this.opacity = { type: "f" , value: 1 }

  this.bodyUniforms.opacity   = this.opacity;
  this.bodyUniforms.selected  = this.selected;


  var l = title.length;
  this.title = new TextParticles(
    title , 
    font , 
    shaders.vs.title , 
    shaders.fs.title , 
    {
      letterWidth: .018,
      lineLength: l,
    }    
  );


  console.log( this.bodyUniforms );
  this.string = new PhysicsText(

      // Soul Params
      {

        renderer: renderer,
        ss: ss,
        uniforms: this.soulUniforms
      }, 
        
      
      // Body Params

      { 
        string: string, 
        font:font , 
        vs:vs , 
        fs:fs , 
        params:{
          letterWidth: .016,
          lineLength: 80,
          uniforms: this.bodyUniforms 

        }
      }
    
  );

  this.bg = new THREE.Mesh(
    new THREE.PlaneGeometry( 1 , 1 ),  
    new THREE.MeshPhongMaterial({
      color:0x444444,
      emissive:0x222222,
      specular: 0xffffff,
      shininess:4

    })
  );

  this.bg.hoverOver = function(){
    if( this.selected == false ){ 
      this.material.color.setHex( 0x888888 )
      this.material.emissive.setHex( 0x888888 )
    }
  }
  this.bg.hoverOut  = function(){
    if( this.selected == false ){
      this.material.color.setHex( 0x444444 ) 
      this.material.emissive.setHex( 0x444444 ) 
    }
  }

  this.bg.select = function(){

    this.select();

  }.bind( this );

  objectControls.add( this.bg );

  this.bg.scale.x = .4;
  this.bg.scale.y = this.title.totalHeight * 1.5;
  this.bg.position.z = -.002


  this.body = new THREE.Object3D();
  this.ogBodyPos = new THREE.Vector3();


}


Link.prototype.update = function(){

  if( this.selected.value == 0 ){

    this.opacity.value -= .3 * this.soulUniforms.dT.value;

    if( this.opacity.value < 0 ){ this.opacity.value = 0; }

  }else{

    this.opacity.value += 1 * this.soulUniforms.dT.value;

    if( this.opacity.value > 1 ){ this.opacity.value = 1; }


  }

  this.body.position.copy( camera.position );
  this.v.set( 0 , 0 , -1 );
  this.v.applyQuaternion( camera.quaternion );
  
  this.body.position.add( this.v );
  this.body.position.add( this.ogBodyPos );

  this.string.update();

}

Link.prototype.add = function( scene , position ){

  this.body.add( this.title );
  this.body.add( this.bg );

  this.title.position.x =  -.19//this.title.totalWidth /2;
  this.title.position.y =   this.title.totalHeight/ 1.5;

  this.ogBodyPos.copy( position );
  this.ogBodyPos.x += this.bg.scale.x / 2; //.totalWidth;
 // this.body.position.copy( position );

  scene.add( this.body );
  scene.add( this.string.body );

  this.string.body.position.x = - this.string.body.totalWidth / 2.5;

  this.string.updateMatrices();


}

Link.prototype.select = function(){

  for( var i = 0; i < links.length; i++ ){

    links[i].deselect();

  }

  this.selected.value = 1;

 // camera.position.y = 0;

  controls.minPos     = -this.string.body.totalHeight ;
  controls.maxPos     =  -.5;
  controls.multiplier =  .000003 * this.string.body.totalHeight;
  controls.dampening  = .95;

  this.bg.selected = true;
  this.bg.material.color.setHex( 0x44aa44 )
  this.bg.material.emissive.setHex( 0x44aa44 ) 
    
 

}

Link.prototype.deselect = function(){

  this.bg.selected = false;
  this.bg.material.color.setHex( 0x444444 )
  this.bg.material.emissive.setHex( 0x444444 ) 
    
  this.selected.value = 0; 

}
