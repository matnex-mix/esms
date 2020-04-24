
function Decrypt( key, cipherText ){

  var dnaBases = [];
  var _cipherText = cipherText.split( '' );
  var binJoined = '';

  _cipherText.forEach(function(element) {
    binJoined = binJoined + Helper.fromDNABase( element );
  });

  binJoined = Helper.xor( binJoined, Helper.rnsKeyToBin(key) );
  var bin = Helper.partition( binJoined, 8 );
  var dec = [];
  var plaintext = '';

  bin.forEach(function(element) {
    dec.push( parseInt( element, 2 ) );
  });

  var _temp = [];
  var dec3 = [];

  for( x=0; x<dec.length; x++ ){
    _temp.push( dec[x] );
    if( _temp.length==3 || x==dec.length-1 ){
      dec3.push( _temp );
      _temp = [];

      var o = Helper.backward( dec3[dec3.length-1], [49, 43, 37] );
      plaintext = plaintext + String.fromCharCode( o );
    }
  }
  
  return plaintext;

}