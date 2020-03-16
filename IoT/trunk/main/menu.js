(function(){
	function addMenuTooltip(obj) {
		var tooltip = $(obj).children('.main_expandable_back').text();
		$('<div>').addClass('main_menu_tooltip').append(
			$('<div>').addClass('main_menu_tooltip_arrow')
		).append(
			$('<div>').addClass('main_menu_tooltip_text').append(tooltip)
		).appendTo(obj);
	}

	function removeMenuTooltip() {
		$('.main_menu_tooltip').remove();
	}

	function Menu(menus){
		this.menus = menus;
	}

	Menu.prototype.getMenus = function(){
		var _this = this;
		var $box = $('<div>').addClass('menu_box').addClass('main_expand');
		var $main = $('<div>').addClass('menu_shrinkable_main').appendTo($box);
		var $btn = $('<div class="main_menu_toggle_button"></div>')
			.appendTo($main)
			.on('click', function(){
				$box.toggleClass('main_expand');
				_this.onResize();
			});
		var $menu = $('<div class="menu_mains"></div>').appendTo($main);
		var $sevs = $('<div class="menu_shrinkable_servant"><div class="menu_submenu_container"></div></div>')
			.append(
				$('<div class="menu_servant_control"></div>')
				.on('click', function(){
					$box.toggleClass('servant_expand');
					_this.onResize();
				})
			).appendTo($box);
		for (var j = 0, jLen = this.menus.length; j < jLen; j++) {
			var item = this.menus[j];
			this.getMainMenu(item, $menu);
		}
		this.$box = $box;
		return $box;
	};

	Menu.prototype.getMainMenu = function(menu, parent) {
		var _this = this;
		if(menu == null || menu.hidden){
			return;
		}
		if(menu.isGroup){
			var $group = $('<div>').addClass('main_menu_group').addClass('main_menu_group_shrink')
			.append(
				$('<div>').addClass('main_menu_group_title')
				.append(
					$('<div>').addClass('main_menu_group_title_front').addClass('main_expandable_front')
				).append(
					$('<div>').addClass('main_expandable_back').append(menu.name)
				).attr('id', menu.id)
				.on('click', function() {
					var titleClicked = this;
					$('.main_menu_group').each(function() {
						var group = $(this);
						if (group.children('.main_menu_group_title')[0] !== titleClicked) {
							group.addClass('main_menu_group_shrink');
						} else {
							group.toggleClass('main_menu_group_shrink');
						}
					});
				}).hover(function() {
					addMenuTooltip(this);
				}, function() {
					removeMenuTooltip();
				})
			).appendTo(parent);
			var subs = menu.children;
			for (var i = 0, len = subs.length; i < len; i++) {
				_this.getMainMenu(subs[i], $group);
			}
		} else {
			var $menu = $('<div>').append(
				$('<div>').addClass(menu.className).addClass('main_expandable_front')
			).append(
				$('<div>').append(menu.name).addClass('main_expandable_back')
			).attr('id', menu.id)
			.on('click', function(){
				_this.onMainClick($menu, menu);
			}).hover(function() {
				addMenuTooltip(this);
			}, function() {
				removeMenuTooltip();
			}).appendTo(parent);
		}
	};

	Menu.prototype.onMainClick = function($menu, menu){
		var _this = this;
		$('.main_menu_focus').each(function() {
			$(this).removeClass('main_menu_focus');
		});
		$menu.addClass('main_menu_focus');
		if(menu.children){
			var subs = menu.children;
			var frag = document.createDocumentFragment();
			$('<div>').append(menu.name).addClass('servant_menu_title').appendTo(frag);
			for(var i = 0, len = subs.length; i < len; i+=1){
				_this.getServantMenu(subs[i], frag);
			}
			_this.$box.addClass('servant_show servant_expand');
			_this.$box.find('.menu_submenu_container').empty().append(frag);
			_this.onResize();
		} else {
			_this.$box.removeClass('servant_show servant_expand');
			_this.onResize();
			_this.callMenu(menu);
		}
	}

	Menu.prototype.getServantMenu = function(menu, parent){
		var _this = this;
		if(menu == null || menu.hidden){
			return;
		}
		if(menu.isGroup){
			var $servGroup = $('<div>').addClass('servant_menu_group').addClass('servant_menu_group_shrink').append(
				$('<div>').addClass('servant_menu_group_title')
				.append(menu.name)
				.attr('id', menu.id)
				.on('click', function(){
					$servGroup.toggleClass('servant_menu_group_shrink');
				})
			).appendTo(parent);
			var subs = menu.children;
			for(var i = 0, len = subs.length; i < len; i+=1){
				_this.getServantMenu(subs[i], $servGroup);
			}
		} else {
			var $serv = $('<div>').append(menu.name)
			.addClass('servant_menu_item')
			.attr('id', menu.id)
			.on('click', function(){
				_this.onServantClick($serv, menu);
			})
			.appendTo(parent);
		}
	};

	Menu.prototype.onServantClick = function($serv, menu) {
		$('.servant_menu_focus').each(function() {
			$(this).removeClass('servant_menu_focus');
		});
		$serv.addClass('servant_menu_focus');
		this.callMenu(menu);
	};

	Menu.prototype.clickByPath = function(path){
		if(path != null){
			for(var i = 0, len = path.length; i < len; i+=1){
				var id = path[i];
				$('#' + id).click();
			}
		}
	};

	Menu.prototype.getMenuPath = function(target){
		var path = [];
		getIdByStep(this.menus, function(item){
			return item.id == target;
		}, path);
		return path;
	};

	Menu.prototype.enterMenu = function(target){
		this.clickByPath(this.getMenuPath(target));
	};

	Menu.prototype.showFirstVisible = function(){
		var path = [];
		getIdByStep(this.menus, function(item){
			return item != null && !item.hidden && !item.children;
		}, path);
		this.clickByPath(path);
	};

	Menu.prototype.callMenu = function(menu){};
	Menu.prototype.onResize = function(){};

	function getIdByStep(items, func, ret){
		var found = false;
		if(typeof func != 'function'){
			return found;
		}
		$.each(items, function(i, item){
			found = func(item);
			if(found){
				ret.push(item.id);
			} else if(item.children){
				found = getIdByStep(item.children, func, ret);
				if(found){
					ret.unshift(item.id);
				}
			}
			if(found){
				return false;
			}
		});
		return found;
	}

	window.PanelMenu = Menu;
}(jQuery));
