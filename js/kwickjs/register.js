kwick.register = function(cb){
	$('form').on('submit', function(event){
		event.preventDefault();

		var user = $('#username').val();
		var password = $('#password').val();
		var confirm_password = $('#confirm_password').val();
		if(password === confirm_password){
			signup(user,password);
		}
		
	});
	// Call signup
	function signup(user, password){
		kwick.callKwickAPI('signup/' + user + '/' + password,function(err,data){
			if(err)
				console.log('fail');

			$('body').append(data.result.message);
			localStorage.setItem("user_token", data.result.token);
			localStorage.setItem("user_id", data.result.id);
			localStorage.setItem("user_name", data.result.name);
			cb();
		});
	}
}

kwick.register(function(){
	document.location.href="../page/messenger.html";
});