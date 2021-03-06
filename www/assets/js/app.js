function register(){

	username = $('#username').val();
	password = $('#password').val();
	confirmPassword = $('#confirm-password').val();
	phone = $('#phone').val();
	recoveryQuestion = $('#recovery-question').val();
	recoveryAnswer = $('#recovery-answer').val();

	if( password!=confirmPassword ){
		alert( 'passwords do not match' );
		return;
	}

	if( !username || !password || !confirmPassword
		|| !phone || !recoveryQuestion || !recoveryAnswer ){
		alert( 'please fill the form completely' );
		return;
	} else {

		localforage.setItem( 'user', {
			username: username,
			password: password,
			phone: phone,
			recoveryQuestion: recoveryQuestion,
			recoveryAnswer: recoveryAnswer,
		}).then( function( val ){
			alert( 'user registered!' );
			location.replace( 'login.html' );
		} );

		return;

	}

}

function loginPage(){

	localforage.getItem( 'user' ).then(function( val ){
		if( val ){
			$('#content').remove();
			window.user = val;
		}
	});

}

function login(){

	username = $('#username').val().toLowerCase();
	password = $('#password').val();

	if( username==user.username.toLowerCase() && password==user.password ){
		location.replace( 'home.html' );
		return;
	} else {
		alert( 'invalid username or password' );
	}

}

function recoverPasswordPage(){

	localforage.getItem( 'user' ).then(function( val ){
		if( val ){
			window.user = val;
			$('#question').text( user.recoveryQuestion );
		}
	});

}

function checkAnswer(){

	answer = $('#answer').val().toLowerCase();

	if( user.recoveryAnswer==answer.toLowerCase() ){
		alert( 'your password is: \n'+user.password+'\nwrite it somewhere you\'ll never forget' );
	} else {
		alert( 'you got the answer wrong!' );
	}

}

function toggleCoverScreen(){

	$('#cover-screen').toggleClass('d-flex');
	$('#cover-screen').toggleClass('d-none');

}

function composePage(){

	var k = $('#contacts')[0];

	/*navigator.contactsPhoneNumbers.list(function(contacts) {
      for(var i = 0; i < contacts.length; i++) {
    	k.innerHTML += '<button type="button" onclick="select( this );" value="'+contacts[i].phoneNumbers[0].number+'" class="list-group-item list-group-item-action py-1 px-3">'+contacts[i].displayName+'</button>';
      }
   });*/

}

function filterContacts( el ){

	f = el.value.toLowerCase();
	e = el.nextElementSibling;
	e.classList.remove( 'd-none' );
	e = e.children;

	for( x=0; x<e.length; x++ ){
		q = e[x];

		if( q.innerHTML.toLowerCase().indexOf( f )==-1 && q.value.toLowerCase().indexOf( f )==-1 ){
			q.classList.add('d-none');
		} else {
			q.classList.remove('d-none');
		}
	}

}

function select( el ){

	e = el.parentElement;
	e.previousElementSibling.value = el.value;
	e.classList.add( 'd-none' );

}

function sendMessage(){

	try {

		toggleCoverScreen();
		s = $('#state');

		to = String( $('#to').val() ).trim();
		key = $('#key').val();
		msg = $('#message').val().trim();

		s.html('Encrypting message...');
		msg = ALGO.encrypt( key, msg );
		alert( msg );

		var options = {
	        replaceLineBreaks: false, // true to replace \n by a new line, false by default
	        android: {
	            intent: '' // send SMS without opening any other app
	        }
	    };

	    var success = function () {
			s.html('Message sent successfully!');
			setTimeout(function(){
				toggleCoverScreen();
				location.replace('home.html');
			}, 2000);
	    };

	    var error = function (e) {
			toggleCoverScreen();
	    	alert('Message Failed:' + e);
	    };

		s.html('Sending...');
    	sms.send( to, msg, options, success, error );

	} catch( err ){
		alert( err.toString() );
	}

}

function locationHashChanged() {
	try {
		if( location.hash ){
		    el = $('[href="'+location.hash+'"]');

		    if( el.length ){
		    	el = el[0];

		    	body = el.getAttribute('body');
		    	key = prompt('Secure key?');

		    	if( key ){
		    		msg = ALGO.decrypt( key, body );
		    		$('#real-message').html( msg );
		    		$('#show-message').modal();
		    	}
		    }

		    location.hash = '';
		}
	} catch ( err ){
		alert( err.toString() )
	}
}

function homePage(){

	window.onhashchange = locationHashChanged;

	inbox = $('#inbox')[0];
	outbox = $('#outbox')[0];
	try {

		var filter = {
			box : 'sent',
			indexFrom : 0,
			maxCount : 1000,
		};

		if( window.SMS ){
			SMS.listSMS( filter, function(data){
				
				if( Array.isArray(data) ){
					for(var i in data) {
						var sms = data[i];

						if( !(new RegExp('^[ACTG]+$')).test( sms.body ) ){
							continue;
						}
						
						days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
						months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						d = new Date(sms.date);
						time_string = days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate();

						outbox.innerHTML += '\
						<a href="#outbox'+sms._id+'" class="list-group-item rounded-0 text-dark" body="'+sms.body+'" >\
							<h5>\
								<b>'+sms.address+'</b>\
							</h5>\
							<p class="mb-1">\
								<small class="float-right">'+time_string+'.</small>\
								'+sms.body.substring( 0, 50 )+'...\
							</p>\
						</a>';
					}
				}
			
			});

			window.unread = 0;

			SMS.listSMS( {

				box : 'inbox',
				indexFrom : 0,
				maxCount : 1000,

			}, function(data){
				
				if( Array.isArray(data) ){
					for(var i in data) {
						var sms = data[i];

						if( !(new RegExp('^[ACTG]+$')).test( sms.body ) ){
							continue;
						}
						
						days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
						months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						d = new Date(sms.date_sent);
						time_string = days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate();

						window.unread += (sms.read-1)*-1;

						inbox.innerHTML += '\
						<a href="#inbox-'+sms._id+'" class="list-group-item rounded-0 text-dark" body="'+sms.body+'" '+( sms.read!=1 ? ' style="background-color: #aaa;"' : '' )+'>\
							<h5>\
								<b>'+sms.address+'</b>\
							</h5>\
							<p class="mb-1">\
								<small class="float-right">'+time_string+'</small>\
								'+sms.body.substring( 0, 50 )+'...\
							</p>\
						</a>';
					}
				}
			
			});

			if( window.unread==0 ){
				$('#unread-counter').toggleClass('d-none');
			} else {	
				$('#unread-counter').html( window.unread );
			}
		}

	} catch( err ){
		alert( err );
	}

}