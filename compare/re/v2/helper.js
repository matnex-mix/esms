
Helper = {
  
  dnaNucleotides: {
    '00': 'A',
    '01': 'C',
    '10': 'G',
    '11': 'T'
  },
  
  rnaNucleotides: {
    '00': 'A',
    '01': 'C',
    '10': 'G',
    '11': 'U'
  },

  pad: function( bin ){
    var i = 8 - bin.length;
    for( var x=0; x<i; x++ ){
      bin = "0" + bin;
    }
    return bin;
  },

  partition: function( text, parts, callback=null ){
    var partitions = [];
    var sess = '';

    for( var x=0; x<text.length; x++ ){
      sess += text[x];

      if( sess.length==parts || x==text.length-1 ){
        if( callback ){
          callback( sess );
        }

        partitions.push( sess );
        sess = '';
      }
    }

    return partitions;
  },

  toDNABase: function( bin ){
    return Helper.dnaNucleotides[bin];
  },

  fromDNABase: function( base ){
    for( x in Helper.dnaNucleotides ){
      if( base==Helper.dnaNucleotides[x] ){
        return x;
      }
    }
  },

  toRNABase: function( bin ){
    return Helper.rnaNucleotides[bin];
  },

  fromRNABase: function( base ){
    for( x in Helper.rnaNucleotides ){
      if( base==Helper.rnaNucleotides[x] ){
        return x;
      }
    }
  },

  forward: function( num, mods ){
    var red = [];
    for( x in mods ){
      red.push( num%mods[x] );
    }

    return red;
  },

  backward: function( var1, mods ){
    var res = 0;
    var x = 0;

    var M = 1;
    var V = 1;

    for( x=0; x<mods.length; x++ ){
      mods[x] = mods[x];
      M = M*mods[x];
    }

    for(x in var1){
      V = V*var1[x];
    }

    var Mi = [];

    for(x in mods){
      Mi.push( M/mods[x] );
    }

    var Mii = [];
    for( x=0; x<Mi.length; x++ ){
      Mii.push( Helper.lookUp( mods[x], Mi[x] ) );
    }

    for( x=0; x<mods.length; x++ ){
      res = res + ( var1[x] * Mi[x] * Mii[x] );
    }

    return parseInt(res%M);
  },

  lookUp: function( mx, mi ){
    var x = 1;
    while( true ){
      var t = ( (x*mx) + 1 )/mi;
      var ti = Math.ceil(t);
      if( ti/t==1.0 ){
        return t;
      }

      if(x > 10000){
        break;
      }

      x = x + 1;
    }
  },

  keyFunc: function ( key ){
    var x;
    var _key = 0;

    var _w = {};

    for( x=0; x<key.length; x++ ){
      char = key[x];
      if( _w[char] ){
        _w[char]++; 
      } else {
        _w[char] = 1;
      }
    }

    for( x=0; x<key.length; x++ ){
      var i = key.charCodeAt(x);
      var w = _w[key[x]];

      if( w==key.length ){
        w--;
      }

      if( x == 0 ){
        _x = 1;
      } else {
        _x = x;
      }

      _key ^= ((i*key.length/w*_x));
    }

    return _key;
  },

  keyToBin: function( key ){
    key = Helper.keyFunc( key );

    return key%256;
  },

  rnsKeyToBin: function( key, mod ){
    key = Helper.keyFunc( key );
    key = Helper.forward( key, [49, 43, 37] );

    return key[0]^key[1]^key[2];
  },

  addZeros: function( text, count ){
    for( var i=0; i<count; i++ ){
      text = "0" + text;
    }
    return text;
  },

  xor: function( var1, var2 ){
    var aLen = var1.length;
    var bLen = var2.length;

    if( aLen > bLen ){
      var2 = Helper.addZeros( var2, aLen - bLen );
    }
    else if( bLen > aLen ){ 
      var1 = Helper.addZeros( var1, bLen - aLen );
    }

    var lenn = Math.max(aLen, bLen);
    var res = '';
    for( var i=0; i<lenn; i++ ){
      if( var1[i] == var2[i] ){
        res += "0";
      }
      else{
        res += "1";
      }
    }

    return res;
  }

}