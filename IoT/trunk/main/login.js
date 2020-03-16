(function($) {
	function LoginPage() {
		this.init();
	}


	LoginPage.prototype = {
		init: function() {
			var self = this;
			$.ajax({
				type: 'GET',
				url: 'main/login.html'
			}).done(function(data) {
				$(document.body).empty().append(patchHTML(data));
				self.listenEvents();
				self.rmbUser();
			});
		},

		listenEvents: function() {
			var self = this;

			$('.login_checkbox').on('click', function() {
				$(this).toggleClass('login_checkbox_checked');
			});

			$('.login_dialog_login_button').on('click', function() {
				self._login();
			});

			var $userName = $('#login_user_name');
			var $userPwd = $('#login_user_pwd');
			$userName.on('keyup', function(ev) {
				if (ev.keyCode === 13) {
					this.blur();
					self._login();
				}
			});
			$userPwd.on('keyup', function(ev) {
				if (ev.keyCode === 13) {
					this.blur();
					self._login();
				}
			});
		},

		rmbUser: function() {
			var user_name = localStorage['user_name'];
			if (user_name) {
				$('#login_user_name').val(user_name);
				$('#login_rmb_user').addClass('login_checkbox_checked');
			}

			var user_pwd = localStorage['user_pwd'];
			if (user_pwd) {
				$('#login_user_pwd').val(user_pwd);
			}
		},

		_login: function() {
			var self = this;

			var user_name = $('#login_user_name').val();
			var pwd = $('#login_user_pwd').val();

			if (user_name == '' ){
				showInputErr('#login_user_name', i18n('Login_no_UserName'));
				return;
			}
			if(pwd == ''){
				showInputErr('#login_user_pwd', i18n('Login_no_Pwd'));
				return;
			}

			if ($('#login_rmb_user').hasClass('login_checkbox_checked')) {
				localStorage['user_name'] = user_name;
				localStorage['user_pwd'] = pwd;
			} else {
				localStorage['user_name'] = '';
				localStorage['user_pwd'] = '';
			}

			// paasLogin(user_name, pwd, function(data) {
			// 	my.paas.user_id = data.user_id;
			// 	my.paas.access_token = data.access_token;
			// 	my.paas.refresh_token = data.refresh_token;
			//
			// 	getPaaSUser(data.user_id, data.access_token, function(paasUser) {
			// 		my.paas.user_name = paasUser.user_name;
					$(self).trigger('login');
			// 	}, function(){
			// 		showInputErr('#login_user_pwd', i18n('Login_fail'));
			// 	});
			// }, function() {
			// 	showInputErr('#login_user_pwd', i18n('Login_fail'));
			// });

		}

	};

	window.LoginPage = LoginPage;
}(jQuery));
