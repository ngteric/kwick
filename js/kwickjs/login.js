kwick.login = function(cb){
	$('#form-login').on('submit', function(event){
		event.preventDefault();

		var user = $('#username').val();
		var password = $('#password').val();
		login(user,password);
		
	});
	//Call login
	function login(user, password){
		kwick.callKwickAPI('login/' + user + '/' + password,function(err,data){
			if(err)
				console.log('fail');

			console.log(data);
			$('body').append(data.result.message);
			localStorage.setItem("user_token", data.result.token);
			localStorage.setItem("user_id", data.result.id);
			localStorage.setItem("user_name", user);
			cb();
		});
	}
}

kwick.login(function(){
	document.location.href="../page/messenger.html";
});