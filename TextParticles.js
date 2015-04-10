

  
  
  function TextParticles( string , font , vs , fs , params ){ 
   
    var params = params || {};

    this.font           = font;
    this.vertexShader   = vs; 
    this.fragmentShader = fs; 
    
    this.texture = this.font.texture; 
    
    this.letterWidth    = params.letterWidth    || 2.;
    this.lineLength     = params.lineLength     || 50;
    
    this.lineHeight = this.letterWidth * 2.4;

    
    this.width = this.letterWidth * this.lineLength ; 

    var particles = this.createTextParticles( string , params );

    return particles; 

  }

 
  TextParticles.prototype.createTextParticles = function( string, params ){

    var particles = this.createParticles( string );
    var lookup    = this.createLookupTexture( particles );
    var geometry  = this.createGeometry( particles , true );
  
    var material  = this.createMaterial(  lookup , params );

    var particleSystem = new THREE.Mesh( geometry , material );

    particleSystem.frustumCulled = false; 
    this.lookupTexture = lookup;

    particleSystem.size = lookup.size;
    particleSystem.lookup = lookup;
  
    var lines =  Math.ceil( particles.length / this.lineLength );
  
    console.log( particles ); 
    console.log( particles.numberOfLines ); 
    particleSystem.totalWidth  = this.width;
    particleSystem.totalHeight = particles.numberOfLines * this.lineHeight;

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

    particles.numberOfLines = counter[1];

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

   
    for( var i = 0; i < size * size; i++ ){

      if( particles[i] ){
     
        data[ i * 4 + 0 ] =   particles[i][1] * this.letterWidth;
        data[ i * 4 + 1 ] =  -particles[i][2] * this.lineHeight;

        data[ i * 4 + 2 ] = 0;
        data[ i * 4 + 3 ] = 0;

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


  TextParticles.prototype.createGeometry = function( particles ){

    var geometry = new THREE.BufferGeometry();
 
    var positions   = new Float32Array( particles.length * 3 * 2 * 3 );
    var uvs         = new Float32Array( particles.length * 3 * 2 * 2 );
    var ids         = new Float32Array( particles.length * 3 * 2 * 1 );
  	var textCoords  = new Float32Array( particles.length * 3 * 2 * 4 );
  	var lookups     = new Float32Array( particles.length * 3 * 2 * 2 );


    var uvA     = new THREE.BufferAttribute( uvs         , 2 );
    var idA     = new THREE.BufferAttribute( ids         , 1 );
    var posA    = new THREE.BufferAttribute( positions   , 3 );
    var coordA  = new THREE.BufferAttribute( textCoords  , 4 );
    var lookupA = new THREE.BufferAttribute( lookups     , 2 );
    
    geometry.addAttribute( 'id'         , idA     ); 
    geometry.addAttribute( 'uv'         , uvA     ); 
    geometry.addAttribute( 'lookup'     , lookupA ); 
    geometry.addAttribute( 'position'   , posA    ); 
    geometry.addAttribute( 'textCoord'  , coordA  ); 
    
    var lookupWidth = Math.ceil( Math.sqrt( particles.length ) ); 


    for( var i = 0; i < particles.length; i++ ){
       
      var index = i * 3 * 2;

   
      var tc = this.getTextCoordinates( particles[i][0] );

      // Left is offset
      var l = tc[4];

      // Right is offset + width
      var r = tc[4] + tc[2];

      // bottom is y offset
      var b = tc[5] - tc[3];

      // top is y offset + height
      var t =  tc[5] ;

      ids[ index + 0 ] = i;
      ids[ index + 1 ] = i;
      ids[ index + 2 ] = i;
      ids[ index + 3 ] = i;
      ids[ index + 4 ] = i;
      ids[ index + 5 ] = i;

      //console.log( x + " , " + y );
      positions[ index * 3 + 0  ] = l * this.letterWidth * 10;
      positions[ index * 3 + 1  ] = t * this.letterWidth * 10; 
      positions[ index * 3 + 2  ] = 0 * this.letterWidth * 10; 
      
      positions[ index * 3 + 3  ] = l * this.letterWidth * 10;
      positions[ index * 3 + 4  ] = b * this.letterWidth * 10; 
      positions[ index * 3 + 5  ] = 0 * this.letterWidth * 10; 
     
      positions[ index * 3 + 6  ] = r * this.letterWidth * 10;
      positions[ index * 3 + 7  ] = t * this.letterWidth * 10; 
      positions[ index * 3 + 8  ] = 0 * this.letterWidth * 10; 
      
      positions[ index * 3 + 9  ] = r * this.letterWidth * 10;
      positions[ index * 3 + 10 ] = b * this.letterWidth * 10; 
      positions[ index * 3 + 11 ] = 0 * this.letterWidth * 10; 
      
      positions[ index * 3 + 12 ] = r * this.letterWidth * 10;
      positions[ index * 3 + 13 ] = t * this.letterWidth * 10; 
      positions[ index * 3 + 14 ] = 0 * this.letterWidth * 10; 
       
      positions[ index * 3 + 15 ] = l * this.letterWidth * 10;
      positions[ index * 3 + 16 ] = b * this.letterWidth * 10; 
      positions[ index * 3 + 17 ] = 0 * this.letterWidth * 10; 


      uvs[ index * 2 + 0  ] = 0;
      uvs[ index * 2 + 1  ] = 1; 

      uvs[ index * 2 + 2  ] = 0;
      uvs[ index * 2 + 3  ] = 0; 
     
      uvs[ index * 2 + 4  ] = 1;
      uvs[ index * 2 + 5  ] = 1; 
      
      uvs[ index * 2 + 6  ] = 1;
      uvs[ index * 2 + 7  ] = 0; 
      
      uvs[ index * 2 + 8  ] = 1;
      uvs[ index * 2 + 9  ] = 1; 
      
      uvs[ index * 2 + 10 ] = 0;
      uvs[ index * 2 + 11 ] = 0; 



      // Gets the center of the particle
      var x =             i % lookupWidth   ;
      var y = Math.floor( i / lookupWidth ) ;

      x += .5;
      y += .5;

      lookups[ index * 2 + 0  ] = x / lookupWidth;
      lookups[ index * 2 + 1  ] = y / lookupWidth;

      lookups[ index * 2 + 2  ] = x / lookupWidth;
      lookups[ index * 2 + 3  ] = y / lookupWidth; 

      lookups[ index * 2 + 4  ] = x / lookupWidth;
      lookups[ index * 2 + 5  ] = y / lookupWidth;

      lookups[ index * 2 + 6  ] = x / lookupWidth;
      lookups[ index * 2 + 7  ] = y / lookupWidth;

      lookups[ index * 2 + 8  ] = x / lookupWidth;
      lookups[ index * 2 + 9  ] = y / lookupWidth;  

      lookups[ index * 2 + 10 ] = x / lookupWidth;
      lookups[ index * 2 + 11 ] = y / lookupWidth; 



      textCoords[  index * 4 + 0  ] = tc[0];
      textCoords[  index * 4 + 1  ] = tc[1];
      textCoords[  index * 4 + 2  ] = tc[2];
      textCoords[  index * 4 + 3  ] = tc[3];
      
      textCoords[  index * 4 + 4  ] = tc[0];
      textCoords[  index * 4 + 5  ] = tc[1];
      textCoords[  index * 4 + 6  ] = tc[2];
      textCoords[  index * 4 + 7  ] = tc[3];
      
      textCoords[  index * 4 + 8  ] = tc[0];
      textCoords[  index * 4 + 9  ] = tc[1];
      textCoords[  index * 4 + 10 ] = tc[2];
      textCoords[  index * 4 + 11 ] = tc[3];
      
      textCoords[  index * 4 + 12 ] = tc[0];
      textCoords[  index * 4 + 13 ] = tc[1];
      textCoords[  index * 4 + 14 ] = tc[2];
      textCoords[  index * 4 + 15 ] = tc[3];
      
      textCoords[  index * 4 + 16 ] = tc[0];
      textCoords[  index * 4 + 17 ] = tc[1];
      textCoords[  index * 4 + 18 ] = tc[2];
      textCoords[  index * 4 + 19 ] = tc[3];
      
      textCoords[  index * 4 + 20 ] = tc[0];
      textCoords[  index * 4 + 21 ] = tc[1];
      textCoords[  index * 4 + 22 ] = tc[2];
      textCoords[  index * 4 + 23 ] = tc[3];

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

    var params      = params || {};

    var texture     = params.texture      || this.texture;
    var lookup      = params.lookup       || lookup;
    var color       = params.color        || this.color;
    var opacity     = params.opacity      || 1;

    var attributes = {

      id:        { type:"f"  , value: null },
      lookup:    { type:"v2" , value: null },
      textCoord: { type:"v4" , value: null },

    }

   
    var c = new THREE.Color( color );


    var uniforms = {
      
      color:        { type:"c"  , value: c            },

      t_lookup:     { type:"t"  , value: lookup       },
      t_text:       { type:"t"  , value: texture      },
      opacity:      { type:"f"  , value: opacity      },
 
      //time: { type:"f" ,value : 1} 

    }
   
   
    if( params.uniforms ){
      for( var propt in params.uniforms ){
        console.log( params.uniforms );
        uniforms[ propt ] = params.uniforms[ propt ];
      }
    }

    console.log( uniforms );

    var attr  = attributes;

    var vert  = this.vertexShader;
    var frag  = this.fragmentShader;

    var blend = params.blending       || THREE.AdditiveBlending;
    var depth = params.depthWrite     || false;
    var trans = params.transparent    || true;
    var side  = params.side           || THREE.DoubleSide;

    var material = new THREE.ShaderMaterial({
      
      attributes:         attr,

      uniforms:           uniforms,
      
      vertexShader:       vert,
      fragmentShader:     frag,

      transparent:        trans,
      depthWrite:         depth,
      blending:           blend,

    });


    return material;


  }



