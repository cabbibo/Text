

  
  
  function TextParticles( string , font , vs , fs , params ){ 
   
    var params = params || {};

    this.font           = font;
    this.vertexShader   = vs; 
    this.fragmentShader = fs; 
    
    this.texture = this.font.texture; 
    
    this.letterWidth    = params.letterWidth    || 30;
    this.lineHeight     = params.lineHeight     || 40;
    this.lineLength     = params.lineLength     || 20;
    
    this.width = this.letterWidth * this.lineLength; 

    var particles = this.createTextParticles( string , params );

    return particles; 

  }

 
  TextParticles.prototype.createTextParticles = function( string, params ){

    var particles = this.createParticles( string );
    var lookup    = this.createLookupTexture( particles );
   // var textCoord = this.createTextCoordTexture( particles );
    var geometry  = this.createGeometry( particles , true );
  
    var material  = this.createMaterial(  lookup , params );

    var particleSystem = new THREE.PointCloud( geometry , material );

    particleSystem.frustumCulled = false; 
    this.lookupTexture = lookup;

    particleSystem.size = lookup.size;

    return particleSystem;

  }




  /*
  
     Create Particles
     
     Goes through the string, and places particles
     where they should be in the paragraph.

     Uses the lineLength to make sure that each line
     is only as long as we define it to be, and only
     splits line when word is done.

  */

  TextParticles.prototype.createParticles = function( string ){

    var particles = [];

    var lineArray = string.split("\n");
    var counter = [0,0]; // keeps track of where we are

    for( var i = 0; i < lineArray.length; i++ ){

      counter[0] = 0;
      counter[1] ++;

      var wordArray = lineArray[i].split(" ");

      for( var j = 0; j < wordArray.length; j++ ){

        var word = wordArray[j];
        var letters = word.split("");
        var l = letters.length;

        // Makes sure we don't go over line width
        var newL = counter[0] + l;
        if( newL > this.lineLength ){
          counter[0] = 0;
          counter[1] ++;
        }

        // Push a new particle for each place
        for( var k = 0; k < letters.length; k ++ ){
          particles.push( [letters[k] , counter[0] , counter[1]] );
          counter[0] ++;
        }

        counter[0] ++;
      }
    }

    return particles;

  }


  /*
   
     Create Lookup Texture

     Uses the particle information from the 'create particle'
     function to create a lookup texture that will be used
     in the vertex shader to place the glyphs
  
  */

  TextParticles.prototype.createLookupTexture = function( particles ){

    var size = Math.ceil( Math.sqrt( particles.length ) );

    var maxWidth  = 0;
    var maxHeight = 0;

    var data = new Float32Array( size * size * 4 );

    console.log( this.letterWidth );
    for( var i = 0; i < size*size; i++ ){

      if( particles[i] ){
      
        data[ i * 4 + 0 ] = particles[i][1] * this.letterWidth * .8;
        data[ i * 4 + 1 ] = -particles[i][2] * this.lineHeight;
        data[ i * 4 + 2 ] = 0; // packing in textCoord 
        data[ i * 4 + 3 ] = 0; // just cuz!

      }

    }

    var f = THREE.RGBAFormat;
    var t = THREE.FloatType;
    
    var texture = new THREE.DataTexture( data , size, size, THREE.RGBAFormat , THREE.FloatType );
   
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    texture.size = size;
    texture.flipY = false;

    return texture;
  
  }


  TextParticles.prototype.createGeometry = function( particles , lookup ){

    var geometry = new THREE.BufferGeometry();
 
    var positions   = new Float32Array( particles.length * 3 );
  	var textCoords  = new Float32Array( particles.length * 4 );
  	var textOffsets = new Float32Array( particles.length * 2 );


    var posA    = new THREE.BufferAttribute( positions   , 3 );
    var coordA  = new THREE.BufferAttribute( textCoords  , 4 );
    var offsetA = new THREE.BufferAttribute( textOffsets , 2 );
    
    geometry.addAttribute( 'position'   , posA    ); 
    geometry.addAttribute( 'textCoord'  , coordA  ); 
    geometry.addAttribute( 'textOffset' , offsetA );
    
    var lookupWidth = Math.ceil( Math.sqrt( particles.length ) ); 


    for( var i = 0; i < particles.length; i++ ){
      
      if( lookup ){

        var x =             i % lookupWidth   ;
        var y = Math.floor( i / lookupWidth ) ;

        //console.log( x + " , " + y );
        positions[ i * 3 + 0 ] = x / lookupWidth;
        positions[ i * 3 + 1 ] = y / lookupWidth; 
        positions[ i * 3 + 2 ] = 0; 

      }else{

        positions[ i * 3 + 0 ] =  particles[i][1] * this.letterWidth;
        positions[ i * 3 + 1 ] = -particles[i][2] * this.lineHeight; 
        positions[ i * 3 + 2 ] = 0; 

      }
        

      tc = this.getTextCoordinates( particles[i][0] );

      textCoords[  i * 4 + 0 ] = tc[0];
      textCoords[  i * 4 + 1 ] = tc[1];
      textCoords[  i * 4 + 2 ] = tc[2];
      textCoords[  i * 4 + 3 ] = tc[3];

      textOffsets[ i * 2 + 0 ] = tc[4];
      textOffsets[ i * 2 + 1 ] = tc[5];

    }

    return geometry;

  }

  //TODO: Make with and height of letter, for later use
  TextParticles.prototype.getTextCoordinates = function( letter ){
    
    var index;

    var charCode = letter.charCodeAt(0);

    var charString = "" + charCode;


    // Some weird CHAR CODES
    if( charCode == 8216 ){
      charCode = 39;
    }

    if( charCode == 8217 ){
      charCode = 39;
    }

    if( charCode == 8212 ){
      charCode = 45;
    }

    for( var l in this.font ){
      if( l == charCode ){
        index = this.font[l];  
      }
    }

    if( !index ){
     
      console.log('NO LETTER' );
      index = [0,0];

    }

    
    var left    = index[0] / 1024;
    var top     = index[1] / 1024;

    var width   = index[2] / 1024;
    var height  = index[3] / 1024;

    var xoffset = index[4] / 1024;
    var yoffset = index[5] / 1024;

    var array = [ left , top , width , height , xoffset , yoffset ];
    return array

  }

 
  /*
  
     Now that everything is made, 
     create our material


  */
  TextParticles.prototype.createMaterial = function( lookup , params ){

    var params = params || {};
    var dpr       = window.devicePixelRatio || 1;

    var texture     = params.texture      || this.texture;
    var lookup      = params.lookup       || lookup;
    var color       = params.color        || this.color;
    var letterWidth = params.letterWidth  || this.letterWidth ;
    var opacity     = params.opacity      || 1;

    var attributes = {
      textCoord: { type:"v4" , value: null },
      textOffset: { type:"v2" , value: null },
    }

   
    var c = new THREE.Color( color );

    var windowSize = new THREE.Vector2( window.innerWidth , window.innerHeight );

    var glyphWidth  = this.font.glyphWidth  / 1024;
    var glyphHeight = this.font.glyphHeight / 1024;
    var glyphBelow  = this.font.glyphBelow  / 1024;

    var uniforms = {

      dpr:          { type:"f"  , value: dpr          },
      t_lookup:     { type:"t"  , value: lookup       },
      t_text:       { type:"t"  , value: texture      },
      color:        { type:"c"  , value: c            },
      textureSize:  { type:"f"  , value: lookup.size  },
      windowSize:   { type:"v2" , value: windowSize   },
      letterWidth:  { type:"f"  , value: letterWidth  },
      opacity:      { type:"f"  , value: opacity      },
      glyphWidth:   { type:"f"  , value: glyphWidth   }, 
      glyphHeight:  { type:"f"  , value: glyphHeight  }, 
      glyphBelow:   { type:"f"  , value: glyphBelow   },
  
    }

    var vert  = this.vertexShader;
    var frag  = this.fragmentShader;
    var attr  = attributes;

    var blend = params.blending       || THREE.AdditiveBlending;
    var depth = params.depthWrite     || false;
    var trans = params.transparent    || true;

    material = new THREE.ShaderMaterial({

      uniforms:           uniforms,
      attributes:         attr,
      vertexShader:       vert,
      fragmentShader:     frag,

      transparent:        trans,
      depthWrite:         depth,
      blending:           blend,

    });


    return material;


  }



