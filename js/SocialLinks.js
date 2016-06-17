function SocialLinks(){



  var gh ="https://github.com/cabbibo/Text/tree/gh-pages"
  var t = "http://twitter.com/share?text=Look%20Mom%20No%20HTML%21%20:%20&url=http://cabbi.bo/Text/%20(%20by%20@cabbibo%20)"
  var links = [

    [ "img/icons/twitter_2.png" , t  ],
    [ "img/icons/cabbibo_2.png" , "http://cabbi.bo"     ],
    [ "img/icons/github_2.png"  , gh ]
  ];

  var geo = new THREE.PlaneBufferGeometry( 1 , 1 );

  var body = new THREE.Object3D();

  for( var i = 0; i < links.length; i++ ){

    var l = links[i];
    var mat = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture( l[0] ),
      opacity: .5,
      transparent: true
    })

    var m = new THREE.Mesh( geo , mat );

    m.link  = l[1];
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

    m.position.y = i * 1.1;
    body.add( m );

  } 

  return body; 


}
