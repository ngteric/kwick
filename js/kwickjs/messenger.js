kwick.messenger = function(cb){

	// Recupere le token et l'id stocké en local.
	var user_token = localStorage.getItem("user_token");
	var user_id = localStorage.getItem("user_id");
	var user_name = localStorage.getItem("user_name");
	
	// Call user list connected...
	function userListConnected(user_token){
		kwick.callKwickAPI('user/logged/'+ user_token ,function(err,data){
			if(err)
				console.log('fail');
			
			// User connect toast
			var userConnected;
			if(kwick.firstTimeRefresh == false && kwick.userTab.length < data.result.user.length){
				for (var u = 0; u < data.result.user.length; u++) {
					userConnected = true;
					for (var j = 0; j < kwick.userTab.length; j++) {
						if(kwick.userTab[j].indexOf(data.result.user[u]) >= 0){
							userConnected = false;
							break;
						}
					}
					if(userConnected == true){
						Materialize.toast( data.result.user[u] + '  is connected', 4000);
					}
				}
			}
			// User disconnect toast
			if(kwick.firstTimeRefresh == false && kwick.userTab.length > data.result.user.length){
				for (var u = 0; u < kwick.userTab.length; u++) {
					userDisconnected = true;
					for (var j = 0; j < data.result.user.length; j++) {
						if(kwick.userTab[u].indexOf(data.result.user[j]) >= 0){
							userDisconnected = false;
							break;
						}
					}
					if(userDisconnected == true){
						Materialize.toast( kwick.userTab[u] + '  is disconnected', 4000);
					}
				}
			}

			kwick.userTab = [];
			for (var i = 0; i < data.result.user.length; i++) {
				kwick.userTab.push('<p class="chip lime white-text">' + data.result.user[i] + '</p>');
			}
			$('.card-title').empty().append(kwick.userTab);
			kwick.firstTimeRefresh = false;
		});
	}
	userListConnected(user_token,0);
	// Call deconnection button
	function logout(user_token,user_id){
		kwick.callKwickAPI('logout/'+ user_token + '/' + user_id,function(err,data){
			if(err)
				console.log('fail');

			localStorage.removeItem("user_name");
			localStorage.removeItem("user_id");
			localStorage.removeItem("user_token");
			cb();
		});
	}

	$('#logout').on('click', function(){
		logout(user_token,user_id);
	});

	// Call Send message 
	function sendMessage(user_token, user_id, message){
		kwick.callKwickAPI('say/' + user_token + '/' + user_id +'/' + message,function(err,data){
			if(err)
				console.log('fail');
		});
	}

	$('#form-message').on('submit', function(event){
		event.preventDefault();
		var message = $('#msg').val();
		if(message.length < 140){
			var messageEncode = encodeURIComponent(message);
			sendMessage(user_token, user_id, messageEncode);
			$('#msg').val('');
			ShowMessage(user_token,kwick.msgPushIndex);
		}
		
	});	

	// Call show message
	function ShowMessage(user_token, index){
		kwick.callKwickAPI('talk/list/' + user_token + '/' + 0,function(err,data){
			if(err)
				console.log('fail');

			var compteur = 0;

			for (var i = index; i < data.result.talk.length; i++) {
				var date = new Date(data.result.talk[i].timestamp* 1000).toLocaleTimeString();
				kwick.msgTab.push('<div class="collection-item avatar"><i class="material-icons circle">assignment_ind</i><span class="title">'+ data.result.talk[i].user_name +'</span><p>' + data.result.talk[i].content+'</br><span class="time">'+ date +'</span></p></div>');
			}

			if(kwick.msgPushIndex < data.result.talk.length){
				compteur = data.result.talk.length - kwick.msgPushIndex;
				$('#msg-box').empty().append(kwick.msgTab);
				$('#msg-box').scrollTop(10000000000);
				if(kwick.msgPushIndex !== 0 && data.result.talk[data.result.talk.length - 1].user_name !== user_name){
					Materialize.toast( compteur +' new message', 4000);
				}
			}
			kwick.msgPushIndex = data.result.talk.length;
		});
	}
	ShowMessage(user_token,0);
	// Refresh interval message & user connected
	function refresh(){
		setInterval(function(){ 
			ShowMessage(user_token,kwick.msgPushIndex);
			userListConnected(user_token);
		}, 5000);

	}
	refresh();
}

kwick.messenger(function(){
	document.location.href="../index.html";
});