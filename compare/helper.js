
Helper = {
  
  dnaNucleotides: {
    '00': 'A',
    '01': 'T',
    '10': 'C',
    '11': 'G'
  },
  
  rnaNucleotides: {
    '00': 'A',
    '01': 'U',
    '10': 'C',
    '11': 'G'
  },

  pad: function( bin ){
    var i = 8 - bin.length;
    for( var x=0; x<i; x++ ){
      bin = "0" + bin;
    }
    return bin;
  },

  partition: function( text, parts ){
    var partitions = [];
    var sess = '';

    for( var x=0; x<text.length; x++ ){
      sess += text[x];

      if( sess.length==parts || x==text.length-1 ){
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

  keyToBin: function( key ){
    //key = CryptoJS.MD5(key).toString( CryptoJS.enc.base64 ).substring(0, 15);
    var x;

    var dec = [];
    var bin = [];

    for( x=0; x<key.length; x++ ){
      dec.push( key.charCodeAt(x) );
      bin.push( Helper.pad( dec[x].toString(2) ) );
    }
    var binCompact = bin.join("");

    return binCompact;
  },

  rnsKeyToBin: function( key ){
    //key = CryptoJS.MD5(key).toString( CryptoJS.enc.base64 ).substring(0, 15);
    var x;

    var dec = [];
    var bin = [];

    for( x=0; x<key.length; x++ ){
      var r = Helper.forward( key.charCodeAt(x), [49, 43, 37] );
      dec = dec.concat( r );
    }

    for( x=0; x<dec.length; x++ ){
      bin.push( Helper.pad( dec[x].toString(2) ) );
    }

    return bin.join("");
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