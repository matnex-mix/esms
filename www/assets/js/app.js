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

}

function composePage(){

	var k = $('#contacts')[0];

	function onSuccess(contacts) {
    	window.contacts = contacts;
    	
    	contacts.forEach(function( d ){
    		k.innerHTML += '<button onclick="$(\'#to\').val( this.value );" value="'+d.id+'" class="list-group-item list-group-item-action py-1 px-3">'+d.displayName+'</button>'
    	});
	};
	 
	// find all contacts with 'Bob' in any name field
	var options = new ContactFindOptions();
	
	options.filter   = "*";
	options.multiple = true;
	options.desiredFields = [
		navigator.contacts.fieldType.id,
		navigator.contacts.fieldType.name
	];
	options.hasPhoneNumber = true;
	
	var fields = [
		navigator.contacts.fieldType.displayName,
		navigator.contacts.fieldType.name
	];
	
	navigator.contacts.find( fields, onSuccess, function(){}, options );

}