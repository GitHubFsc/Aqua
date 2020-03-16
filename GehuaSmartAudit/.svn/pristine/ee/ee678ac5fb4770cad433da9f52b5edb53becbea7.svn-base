(function($) {
	var dropdownAnchor = null;

	var tabId = -1;

	function MainPage(menus) {
		this.menus = menus || [];
		this.init();
	}


	MainPage.prototype = {
		init: function() {
			var self = this;
			$.ajax({
				type: 'GET',
				url: 'main/mainPage.html'
			}).done(function(data) {
				$(document.body).empty().append(patchHTML(data));
				self.listenEvents();
				self.buildUser();
				self.buildMenu();
				window.dropdownHelper && window.dropdownHelper.addDropdownHandler(self);
				dropdownAnchor = $('#main_page_user_dropdown')[0];
				$(self).trigger('complete');
			});
		},

		listenEvents: function() {
			var _this = this;
			$('.main_page_right').on('click', '.tab_close_btn', function(){
				var $header = $(this).parent();
				_this.removeTab($header);
			}).on('click', '.tab_header_name', function(){
				var tabId = $(this).parent().attr('data-tabid');
				_this.showTab(tabId);
			});
		},

		buildMenu: function() {
			var mainPage = this;
			this.menu = new PanelMenu(this.menus);
			var $menu = this.menu.getMenus();
			$('.main_page_left').empty().append($menu);
			this.menu.callMenu = function(menu){
				mainPage.showMenu(menu);
			};
			this.menu.showFirstVisible();
		},

		showMenu: function(menu){
			var _this = this;
			var menuId = menu.id;
			var thClass = menuId + '_tab';
			var existTab = $('.' + thClass);
			if(existTab.length > 0){
				var tabId = existTab.attr('data-tabid');
				_this.showTab(tabId);
			} else {
				_this.addTab(menuId, menu.name, function(contId){
					var act = menu.action;
					if(typeof act == 'function'){
						act(contId);
					}
				});
			}
		},

		newMenu: function(menu, param){
			var _this = this;
			var menuId = menu.id;
			var thClass = menuId + '_tab';
			var existTab = $('.' + thClass);
			if(existTab.length > 0){
				existTab.each(function(){
					var $header = $(this);
					var tabId = $header.attr('data-tabid');
					$header.remove();
					$('#tab_content_' + tabId).remove();
				});
			}
			_this.addTab(menuId, menu.name, function(contId){
				var act = menu.action;
				if(typeof act == 'function'){
					act(contId, param);
				}
			});
		},

		addMenuInstance: function(menu, param){
			var _this = this;
			var menuId = menu.id;
			_this.addTab(menuId, menu.name, function(contId){
				var act = menu.action;
				if(typeof act == 'function'){
					act(contId, param);
				}
			});
		},

		addTab: function(id, name, callback){
			var _this = this;
			var tabId = this.getTabId();
			var thClass = id + '_tab';
			var $header = $('<div>').addClass('tab_header').addClass(thClass)
				.append(
					$('<div>').addClass('tab_header_name').append(name)
				).append(
					$('<div>').addClass('tab_close_btn')
				).attr('data-tabid', tabId)
				.appendTo($('#tabs_header'));
			var contId = 'tab_content_' + tabId;
			var $cont = $('<div>').addClass('tab_content')
				.attr('id', contId)
				.appendTo($('#tabs_content'));

			_this.showTab(tabId);
			if(typeof callback == 'function'){
				callback(contId);
			}
		},

		removeTab: function($header){
			var tabId = $header.attr('data-tabid');
			if($header.hasClass('tab_header_active')){
				var showId = null;
				var $next = $header.next('.tab_header');
				if($next.length > 0){
					showId = $next.attr('data-tabid');
				} else {
					var $prev = $header.prev('.tab_header');
					if($prev.length > 0){
						showId = $prev.attr('data-tabid');
					}
				}
				if(showId != null){
					this.showTab(showId);
				}
			}
			$header.remove();
			$('#tab_content_' + tabId).remove();
		},

		showTab: function(tabId){
			var $active = $('.tab_header_active');
			if($active.attr('data-tabid') == tabId){
				return;
			}
			$active.removeClass('tab_header_active');
			$('.tab_content_active').removeClass('tab_content_active');
			$('.tab_header[data-tabid='+ tabId +']').addClass('tab_header_active');
			$('#tab_content_' + tabId).addClass('tab_content_active');
		},

		getTabId: function(){
			tabId += 1;
			return tabId;
		},

		buildUser: function() {
			var self = this;
			var user_icon = 'image/index/default_user_icon.png';

			var roleText = '';
			switch(my.paas.user_type) {
			default:
				break;
			}

			$('#main_page_user_icon').css('background-image', 'url(' + user_icon + ')');
			$('#main_page_user_info_name').text(my.paas.user_name).attr('title', my.paas.user_name);
			$('#main_page_user_info_role').text(roleText).attr('title', roleText);
			$('#main_page_user_dropdown').on('click', function() {
				$(this).toggleClass('main_page_user_dropdown_down');
			});
			$('#main_page_user_logout').on('click', function() {
				$(self).trigger('logout');
			});
		},

		handleDropdowns: function(target, delegate) {
			var $dropdown = $('#main_page_user_dropdown');
			var dropdown = $dropdown[0];

			if (!dropdown || dropdown !== dropdownAnchor) {
				window.dropdownHelper.removeDropdownHandler(this);
				return;
			}

			var isChild = window.dropdownHelper.checkIsChild(dropdown, target, delegate);

			if (!isChild && $dropdown.hasClass('main_page_user_dropdown_down')) {
				$dropdown.removeClass('main_page_user_dropdown_down');
			}
		}

	};

	window.MainPage = MainPage;
}(jQuery));
