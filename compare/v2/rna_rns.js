var RNSRNA = {
	encrypt: function Encrypt( key, text ){
	  var x;

	  var dec_all = [];
	  var bin = [];
	  var binCompact = '';
	  var dnaCipher = '';

	  key = Helper.rnsKeyToBin( key, [49, 43, 37] );

	  for( x=0; x<text.length; x++ ){
	    dec = Helper.forward( text.charCodeAt(x), [49, 43, 37] );
	    dec_all = dec_all.concat( dec );

	    for( i in dec ){
	      _bin = Helper.pad( (dec[i]^key).toString(2) );
	      bin.push( _bin );
	      binCompact += _bin;

	      Helper.partition( _bin, 2, function( d ){
	        dnaCipher += Helper.toRNABase( d );
	      });
	    }
	  }

	  return dnaCipher;
	},

	decrypt: function Decrypt( key, cipherText ){
	  var _cipherText = cipherText.split( '' );
	  var binJoined = '';
	  var dec_all = [];
	  var dec = [];
	  var plaintext = '';

	  key = Helper.rnsKeyToBin( key, [49, 43, 37] );

	  _cipherText.forEach(function(element) {
	    binJoined = binJoined + Helper.fromRNABase( element );
	    if( binJoined.length==8 ){
	      var _dec = parseInt( binJoined, 2 )^key;

	      dec_all.push( _dec );
	      dec.push( _dec );

	      binJoined = '';
	    }
	      
	    if( dec.length==3 ){
	      plaintext += String.fromCharCode( Helper.backward( dec, [49, 43, 37] ) );
	      dec = [];
	    }
	  });
	  
	  return plaintext;
	}
};