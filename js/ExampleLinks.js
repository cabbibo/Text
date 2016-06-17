function ExampleLinks(){



  var links = [

    "examples/plain",
    "examples/chaos",
    "examples/mission",
    "examples/fade",
    "examples/shimmer",

  ]

  var geo = new THREE.PlaneBufferGeometry( 1 , 1 );

  var body = new THREE.Object3D();

  for( var i = 0; i < links.length; i++ ){

    var l = links[i];
    var mat = new THREE.MeshBasicMaterial({
      opacity: .5,
      transparent: true,
      color: new THREE.Color().setHSL( i / links.length , 1 , 1 )
    })
  

    mat.color = new THREE.Color().setHSL( i / links.length * .3 , 1., .5 );
    console.log( mat );
    var m = new THREE.Mesh( geo , mat );

    m.link  = l;
    m.hoverOver = function(){
  
      this.material.opacity = 1.;

    }

    m.hoverOut = function(){

      this.material.opacity = .5;

    }
    
    m.select = function(){

      window.open( this.link , "_blank" );

    }

    objectControls.add( m );

    m.position.x = i * 1.1;
    body.add( m );

  } 

  return body; 


}
