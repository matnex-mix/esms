
function Decrypt( key, cipherText ){

  var dnaBases = [];
  var _cipherText = cipherText.split( '' );
  var binJoined = '';

  _cipherText.forEach(function(element) {
    binJoined = binJoined + Helper.fromRNABase( element );
  });
  binJoined = Helper.xor( binJoined, Helper.keyToBin(key) );

  var bin = Helper.partition( binJoined, 8 );

  var dec = [];
  var plaintext = '';

  bin.forEach(function(element) {
    dec.push( parseInt( element, 2 ) );
  });

  for( x=0; x<dec.length; x++ ){
    plaintext = plaintext + String.fromCharCode( dec[x] );
  }
  
  return plaintext;

}