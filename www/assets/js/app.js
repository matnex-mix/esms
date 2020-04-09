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
			location.href = 'login.html';
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
		location.href = 'home.html';
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

		to = $('#to').val().trim();
		key = $('#key').val();
		msg = $('#message').val().trim();

		s.html('Encrypting message...');
		msg = Encrypt( key, msg );

		var options = {
	        replaceLineBreaks: false, // true to replace \n by a new line, false by default
	        android: {
	            intent: 'INTENT'  // send SMS with the native android SMS messaging
	            //intent: '' // send SMS without opening any other app
	        }
	    };

	    var success = function () {
			s.html('Message sent successfully!');
			setTimeout(function(){
				toggleCoverScreen();
			}, 600);
	    };

	    var error = function (e) {
			toggleCoverScreen();
	    	alert('Message Failed:' + e);
	    };

	    if( window.SMS ){
			s.html('Sending...');
	    	SMS.sendSMS( to, msg, success, error );
	    }

	} catch( err ){
		alert( err );
	}

}

function homePage(){

	inbox = $('#inbox')[0];
	outbox = $('#outbox')[0];
	try {

		var filter = {
			box : 'outbox',
			indexFrom : 0,
			maxCount : 1000,
		};

		if( window.SMS ){
			SMS.listSMS( filter, function(data){
				
				if( Array.isArray(data) ){
					for(var i in data) {
						var sms = data[i];
						alert( sms );
						
						days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
						months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						d = new Date(sms.date_sent);
						time_string = days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate();

						outbox.innerHTML += '\
						<a href="outbox.html#'+sms.id+'" class="list-group-item rounded-0 text-dark"'+( sms.read!=1 ? ' style="background-color: #aaa;"' : '' )+'>\
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

			SMS.listSMS( {

				box : 'inbox',
				indexFrom : 0,
				maxCount : 1000,

			}, function(data){
				
				if( Array.isArray(data) ){
					for(var i in data) {
						var sms = data[i];
						
						days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
						months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						d = new Date(sms.date_sent);
						time_string = days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate();

						inbox.innerHTML += '\
						<a href="inbox.html#'+sms.id+'" class="list-group-item rounded-0 text-dark"'+( sms.read!=1 ? ' style="background-color: #aaa;"' : '' )+'>\
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
		}

	} catch( err ){
		alert( err );
	}

}