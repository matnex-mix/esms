
function Encrypt( key, text ){
  var x;

  var dec = [];
  var bin = [];

  for( x=0; x<text.length; x++ ){
    var r = Helper.forward( text.charCodeAt(x), [49, 43, 37] );
    dec = dec.concat( r );
  }

  for( x=0; x<dec.length; x++ ){
    bin.push( Helper.pad( dec[x].toString(2) ) );
  }
  var binCompact = Helper.xor( bin.join(""), Helper.rnsKeyToBin(key) );
  var dnaBases = Helper.partition( binCompact, 2 );
  var dnaCipher = '';

  dnaBases.forEach(function(element) {
    dnaCipher = dnaCipher + Helper.toRNABase( element ).toString();
  });

  return dnaCipher;

}