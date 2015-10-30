kwick.messenger = function(cb){

	// Recupere le token et l'id stocké en local.
	var user_token = localStorage.getItem("user_token");
	var user_id = localStorage.getItem("user_id");
	var user_name = localStorage.getItem("user_name");
	var message = localStorage.getItem("message");

	//If not logged redirection to home...
	if(user_token === null && user_id === null){
		document.location.href="../page/redirection.html";
	}
	// Welcome message
	 Materialize.toast( message, 7000,'center');

	// Preload sound
	var canPlayAudio = false;
	$('#audio').jWebAudio('addSoundSource', {
	    'url': '../sound/message.mp3'
	});
    $('#audio').jWebAudio('load', function() {
        canPlayAudio = true;
    });

	// function call API for user list connected
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
						soundNotification();
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
						soundNotification();
					}
				}
			}

			kwick.userTab = [];
			$('.userlist').empty();
			for (var i = 0; i < data.result.user.length; i++) {
				kwick.userTab.push(data.result.user[i]);
				$('.userlist').append('<p class="chip lime white-text">' + kwick.userTab[i]  + '</p>');
			}
			
			kwick.firstTimeRefresh = false;
		});
	}
	userListConnected(user_token,0);


	// function call API for disconnect button
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

	// Action for disconnect button
	$('#logout').on('click', function(){
		logout(user_token,user_id);
	});

	// function call API to send a message 
	function sendMessage(user_token, user_id, message){
		kwick.callKwickAPI('say/' + user_token + '/' + user_id +'/' + message,function(err,data){
			if(err)
				console.log('fail');
		});
	}

	$('#form-message').on('submit', function(event){
		event.preventDefault();
		var message = $('#msg').val();

		if(message.length < 140 && message !== ''){
			var messageEncode = encodeURIComponent(message);
			sendMessage(user_token, user_id, messageEncode);
			$('#msg').val('');
			ShowMessage(user_token,kwick.msgTab.length);
		}	
	});	

	// function call API to show message list
	function ShowMessage(user_token, index){
		kwick.callKwickAPI('talk/list/' + user_token + '/' + 0,function(err,data){
			if(err)
				console.log('fail');

			var compteur = 0;
			kwick.msgTab = [];
			for (var i = data.result.talk.length - index; i < data.result.talk.length; i++) {
				// Convert timestamp
				var date = new Date(data.result.talk[i].timestamp* 1000).toLocaleTimeString();
				kwick.msgTab.push(messageForm(data.result.talk[i].user_name,data.result.talk[i].content,date));
			}
			$('#msg-box').empty().append(kwick.msgTab);
			
			if(kwick.msgPushIndex < data.result.talk.length){
				compteur = data.result.talk.length - kwick.msgPushIndex;
				$('#msg-box').scrollTop(10000000000);
				if(kwick.msgPushIndex !== 0 && data.result.talk[data.result.talk.length - 1].user_name !== user_name){
					Materialize.toast( compteur +' new message', 4000);
					soundNotification();
				}
			}
			kwick.msgPushIndex = data.result.talk.length;
		});
	}
	ShowMessage(user_token,15);

	// Message Format
	function messageForm(name,message,date){
		if(name == user_name){
			return '<div class="messageForm clearfix"><p class="userbubble z-depth-1 orange accent-2 white-text">' +message +'</p><i class="dateForm right">'+date+'</i></div>';
		}
		return '<div class="messageForm clearfix"><span class="chip msg-chip lime white-text left">' + name +'</span>'+'<p class="bubble clearfix z-depth-1">'+  message +'</p><i class="dateForm left">'+date+'</i></div>';
	}

	// Refresh interval message & user connected
	function refresh(){
		setInterval(function(){ 
			ShowMessage(user_token,kwick.msgTab.length);
			userListConnected(user_token);
		}, 7000);
	}
	refresh();

	// load 15 previous message ...
	function lazyload(){
		$('#msg-box').on('scroll',function(){
			if($('#msg-box').scrollTop() == 0){
				$('#previous').show();
			}
			else{
				$('#previous').hide();
			}
		});
		$('#previous').on('click',function(){
			$('#msg-box').append('<div id="preloader" class="progress"><div class="indeterminate"></div></div>');
			ShowMessage(user_token,kwick.msgTab.length + 15);
		});
	}
	lazyload();

	// Sound notification
	function soundNotification(){
		if (canPlayAudio)
			$('#audio').jWebAudio('play');		    
	}
	
}

kwick.messenger(function(){
	document.location.href="../index.html";
});