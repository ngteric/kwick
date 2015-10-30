kwick.register = function(cb){

	// Form register submit
	$('form').on('submit', function(event){
		event.preventDefault();

		var user = $('#username').val();
		var password = $('#password').val();
		var confirm_password = $('#confirm_password').val();
		if(user === ''){
			$('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Username !</div>');
		}
		else if(password === ''){
			$('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Password !</div>');
		}
		else if(password !== confirm_password){
			$('.card-info').empty().append('<div class="card-panel red white-text"> Confirm password doesn\'t match !</div>');
		}
		else{
			signup(user,password);
		}

		
	});

	// Call API for signup
	function signup(user, password){
		kwick.callKwickAPI('signup/' + user + '/' + password,function(err,data){
			if(err)
				console.log('fail');

			if(data.result.status == 'done'){
				localStorage.setItem("user_token", data.result.token);
				localStorage.setItem("user_id", data.result.id);
				localStorage.setItem("user_name", user);
				localStorage.setItem("message", data.result.message +', you can use the messenger now !');
				cb();
			}
			else{
				$('.card-info').empty().append('<div class="card-panel red white-text">'+data.result.message+'</div>');
			}
		});
	}
}

kwick.register(function(){
	document.location.href="../page/messenger.html";
});