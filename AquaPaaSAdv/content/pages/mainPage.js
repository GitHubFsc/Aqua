( function($) {
    var dropdownAnchor = null;

    function MainPage(menu) {
        this.menu = menu || [];
        this.init();
    }


    MainPage.prototype = {
        init: function() {
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'content/pages/mainPage.html'
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
            var self = this;
            $('#main_menu_toggle_button').on('click', function(ev) {
                $('.main_page').first().toggleClass('main_expand');
                $(self).trigger('resize');
            });
        },

        buildMenu: function() {
            var mainPage = this;
            //@formatter:off
            var $menuBlock = $('.main_page_menu').first();

            var frag = document.createDocumentFragment();
            function getMenu(menu, parent){
                if(!menu || menu.hidden){
                    return;
                }
                if(menu.isGroup){
                    var folder = $('<div>').addClass('main_menu_group').addClass('main_menu_group_shrink').append(
                        $('<div>').addClass('main_menu_group_title').append(
                            $('<div>').addClass('main_menu_group_title_front').addClass('main_expandable_front')
                        ).append(
                            $('<div>').addClass('main_expandable_back').append(menu.name || '')
                        ).attr('id', menu.id || '').on('click', function(){
                            var titleClicked = this;
                            $('.main_menu_group').each(function() {
                                var group = $(this);
                                if(group.children('.main_menu_group_title')[0] !== titleClicked){
                                    group.addClass('main_menu_group_shrink');
                                } else {
                                    group.toggleClass('main_menu_group_shrink');
                                }
                            });
                        }).hover(function(){
                            addMenuTooltip(this);
                        }, function(){
                            removeMenuTooltip();
                        })
                    );
                    var subs = menu.children || [];
                    for(var i = 0, len = subs.length; i < len; i++){
                        getMenu(subs[i], folder);
                    }
                    folder.appendTo(parent);
                } else {
                    var menuItem = $('<div>').append(
                        $('<div>').addClass(menu.className || '').addClass('main_expandable_front')
                    ).append(
                        $('<div>').append(menu.name || '').addClass('main_expandable_back')
                    ).attr('id', menu.id || '').appendTo(parent);

                    if(typeof menu.action === 'function'){
                        var act = menu.action;
                        menuItem.on('click', function(){
                            $('.main_menu_focus').each(function(){
                                $(this).removeClass('main_menu_focus');
                            });
                            $(mainPage).off('resize');
                            var $self = $(this);
                            $self.addClass('main_menu_focus');
                            $('#main_page_content_title').text($self.children('.main_expandable_back').text());
                            mainPage.currentMenu = menu;
                            act();
                        });
                    }
                    menuItem.hover(function(){
                        addMenuTooltip(this);
                    }, function(){
                        removeMenuTooltip();
                    });
                }
            }

            function addMenuTooltip(obj){
                var tooltip = $(obj).children('.main_expandable_back').text();
                $('<div>').addClass('main_menu_tooltip').append(
                    $('<div>').addClass('main_menu_tooltip_arrow')
                ).append(
                    $('<div>').addClass('main_menu_tooltip_text').append(tooltip)
                ).appendTo(obj);
            }

            function removeMenuTooltip(){
                $('.main_menu_tooltip').remove();
            }

            for(var j = 0, jLen = this.menu.length; j < jLen; j++){
                var item = this.menu[j];
                getMenu(item, frag);
            }

            $menuBlock.append(frag);
            //@formatter:on
        },

        buildUser: function() {
            var self = this;
            var user_icon = 'image/index/default_user_icon.png';

            var roleText = '';
            switch(my.paas.user_type) {
            case '0':
                roleText = i18n('ADV_SYSUSER_GUANGGAOZHU');
                break;
            case '1':
                roleText = i18n('ADV_SYSUSER_YUNYINGSHANG');
                break;
            case '2':
                roleText = i18n('ADV_SYSUSER_CHUBANZHE');
                break;
            default:
                break;
            }

            $('#main_page_user_icon').css('background-image', 'url(' + user_icon + ')');
            $('#main_page_user_info_name').text(my.paas.user_name).attr('title', my.paas.user_name);
            $('#main_page_user_info_role').text(roleText).attr('title', roleText);
            $('#main_page_user_dropdown').on('click', function(){
                $(this).toggleClass('main_page_user_dropdown_down');
            });
            $('#main_page_user_logout').on('click', function(){
                $(self).trigger('logout');
            });
            $('#main_page_user_changePassword').on('click', function(){
                $(self).trigger('changePassword');
            });
            var platforms = window.PLATFORM || [];
            if(my.paas.platform_id != null && my.paas.platform_id != ''){
                var pidstr = my.paas.platform_id;
                var pids = [];
                if(pidstr.indexOf(',') > -1) {
                    pids = pidstr.split(',');
                } else {
                    pids = [pidstr];
                }
                var options = [];
                if(pidstr.indexOf('ALL') > -1){
                    for(var pi = 0, plen = platforms.length; pi < plen; pi += 1){
                        var pitem = platforms[pi];
                        options.push({
                            label: pitem.name,
                            value: pitem.platform_id
                        });
                    }
                } else {
                    for(var pj = 0, pjlen = pids.length; pj < pjlen; pj += 1){
                        var pjtem = pids[pj];
                        if(pjtem != ''){
                            for(var pk = 0, pklen = platforms.length; pk < pklen; pk += 1){
                                var pktem = platforms[pk];
                                if(pktem.platform_id == pjtem){
                                    options.push({
                                        label: pktem.name,
                                        value: pktem.platform_id
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }
                if(options.length > 1) {
                    var selector = new StyledSelector({
                        containerId: 'main_page_user_platforms',
                        styles: {
                            optionHeight: 25,
                            iconColor: 'transparent',
                            iconInnerColor: '#fff',
                            iconTop: 4
                        },
                        options: options
                    });
                    selector.create();
                    if(my.paas.platform_current_id == null || my.paas.platform_current_id == ''){
                        my.paas.platform_current_id = selector.getValue();
                    } else {
                        selector.setValue(my.paas.platform_current_id);
                    }
                    selector.onChange = function(){
                        my.paas.platform_current_id = selector.getValue();
                        var menu = self.currentMenu;
                        if(menu != null && typeof menu.action == 'function'){
                            menu.action();
                        }
                        $(self).trigger('changeplatform');
                    }
                } else if(options.length == 1){
                    my.paas.platform_current_id = options[0].value;
                }
            } else {
                my.paas.platform_id = '';
                my.paas.platform_current_id = '';
            }
        },

        handleDropdowns: function(target, delegate){
            var $dropdown = $('#main_page_user_dropdown');
            var dropdown = $dropdown[0];

            if(!dropdown || dropdown !== dropdownAnchor){
                window.dropdownHelper.removeDropdownHandler(this);
                return;
            }

            var isChild = window.dropdownHelper.checkIsChild(dropdown, target, delegate);

            if(!isChild && $dropdown.hasClass('main_page_user_dropdown_down')){
                $dropdown.removeClass('main_page_user_dropdown_down');
            }
        }
    };

    window.MainPage = MainPage;
}(jQuery));
