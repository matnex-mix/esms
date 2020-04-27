var DNA = {
	encrypt: function( key, text ){
	  var x;

	  var dec = [];
	  var bin = [];
	  var binCompact = '';
	  var dnaCipher = '';

	  key = Helper.keyToBin( key );

	  for( x=0; x<text.length; x++ ){
	    dec.push( text.charCodeAt(x) );

	    bin.push( Helper.pad( (dec[x]^key).toString(2) ) );
	    binCompact += bin[x];

	    Helper.partition( bin[x], 2, function( d ){
	      dnaCipher += Helper.toDNABase( d );
	    });
	  }


	  return dnaCipher;

	},
	decrypt: function( key, cipherText ){
	  var _cipherText = cipherText.split( '' );
	  var binJoined = '';
	  var dec = [];
	  var plaintext = '';

	  key = Helper.keyToBin( key );

	  _cipherText.forEach(function(element) {
	    binJoined = binJoined + Helper.fromDNABase( element );
	    if( binJoined.length==8 ){
	      var _dec = parseInt( binJoined, 2 )^key;
	      dec.push( _dec );
	      plaintext += String.fromCharCode( _dec );

	      binJoined = '';
	    }
	  });
	  
	  return plaintext;

	}
};