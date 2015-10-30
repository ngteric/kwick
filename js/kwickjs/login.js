kwick.login = function(cb){

	// Form login submit
	$('#form-login').on('submit', function(event){
		event.preventDefault();

		var user = $('#username').val();
		var password = $('#password').val();
		if(user === ''){
			$('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Username !</div>');
		}
		else if(password === ''){
			$('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Password !</div>');
		}
		else{
			login(user,password);
		}
	});
	// Call the API for login
	function login(user, password){
		kwick.callKwickAPI('login/' + user + '/' + password,function(err,data){
			if(err)
				console.log('The server doesn\'t respond');

			if(data.result.status == 'done'){
				localStorage.setItem("user_token", data.result.token);
				localStorage.setItem("user_id", data.result.id);
				localStorage.setItem("user_name", user);
				localStorage.setItem("message", data.result.message);
				$('.card-info').empty();
				cb();	
			}
			else{
				$('.card-info').empty().append('<div class="card-panel red white-text">'+data.result.message+'</div>');
			}
		});
	}
}

kwick.login(function(){
	document.location.href="../page/messenger.html";
});