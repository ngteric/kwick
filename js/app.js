(function(window, $){
	'use strict';

	const API_ROOT_URL = "http://greenvelvet.alwaysdata.net/kwick/api/";

	var kwick = {
		msgPushIndex : 0,
		msgTab : [],
		userTab : [],
		FirstTimeRefresh : true,

		callKwickAPI : function(url, callback){
			var request = $.ajax({
				type : 'GET',
				url : API_ROOT_URL + url,
				dataType : 'jsonp'
			});
			// for the preloader
			request.always(function() {
				$('#preloader').show();
			});

			// if fail
			request.fail(function(jqXHR, textStatus, errorThrown){
				callback(textStatus, null);
			});

			// if done
			request.done(function(data){
				$('#preloader').hide();
				callback(null, data);
			});

		},
	}

window.kwick = kwick;

})(window,jQuery)