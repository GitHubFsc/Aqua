var MyPage = {};

MyPage.userData = null;

MyPage.init = function() {
    var search = window.location.search;
    //先判断是否有search
    //如果有，则尝试获取用户名以及密码等信息
        //如果能获取到用户名和密码
            //登录成功，则显示mainPage页面()，并判断权限
                //权限OK，则进入用户管理
                //权限ERROR，则显示错误信息
            //登录失败，则提示登录错误
        //如果不能获取,提示登录错误
    //如果没有，按照原样进行
    var result = this.checkSearch(search);
    if(result) {
      this.skipLoginPage(result.type, result.userName, result.userPassword);
    }else{
      if(sessionStorage.historyLen != window.history.length || sessionStorage.logged != '1'){
        this.showLoginPage();
      } else {
        this.userData = JSON.parse(sessionStorage.userData);
        var loginData = JSON.parse(sessionStorage.loginData || "{}");
        my.userName = loginData.userName;
        my.userPassword = loginData.userPassword;
        my.paas.user_name = this.userData.user_name;
        my.paas.user_id = this.userData.user_id;
        my.paas.user_type = this.userData.user_type;
        my.paas.userRight = this.userData.userRight;
        my.paas.access_token = this.userData.access_token;
        my.paas.refresh_token = this.userData.refresh_token;
        my.paas.platform_id = this.userData.platform_id;
        my.paas.platform_current_id = this.userData.platform_current_id;
        my.aqua.accessKeyId = this.userData.accessKeyId;
        my.aqua.secretAccessKey = this.userData.secretAccessKey;
        this.showMainPage();
      }
    }
};

MyPage.checkSearch = function(search) {
  var self = this;
  var parameters = my.base64Decode(search.replace("?","")).split(";");
  var type = parameters[0];
  if((type == "jumpToLocalUserManage") && (AdvSystemType == "local")){
    return {
      type:type,
      userName: parameters[1],
      userPassword : parameters[2],
    };
  }else{

  }
};

MyPage.showMainPage = function() {
    var self = this;
    var menu = this.getMenu();
    var mainPage = new MainPage(menu);
    jQuery(mainPage).on('complete',function(){
        var $child = jQuery('.main_page_menu').children().eq(0);
        if($child.hasClass('main_menu_group')){
            $child.children().eq(0).click();
            $child.children().eq(1).click();
        } else {
            $child.click();
        }
    }).on('logout', function(){
        self.logOut();
    }).on('changePassword', function(){
      self.changePassword();
    }).on('changeplatform', function(){
        self.setUserData('platform_current_id', my.paas.platform_current_id);
    });
    this.page = mainPage;
    if(window._paas_token_refresh_interval){
        clearInterval(window._paas_token_refresh_interval);
    }
    window._paas_token_refresh_interval = setInterval(function(){
        refreshPaaSToken(my.paas.refresh_token, function(data){
            my.paas.access_token = data.access_token;
            my.paas.refresh_token = data.refresh_token;
        });
    }, paasTokenRefreshInterval);
};

MyPage.showJumpToSinglePage = function(type) {
  var self = this;
  var menu = this.getSingleMenu(type);
  var mainPage = new MainPage(menu);
  jQuery(mainPage).on('complete',function(){
    if(menu[0] && menu[0].isGroup){
      jQuery('.main_page_menu').children().eq(0).children().eq(1).click();
    }else if(menu[0] && !menu[0].isGroup){
      jQuery('.main_page_menu').children().eq(0).click();
    }else{
      self.showJumpToSinglePageErrorDialog(type);
    }
  }).on('logout', function(){
    self.logOut();
  });
  this.page = mainPage;
  if(window._paas_token_refresh_interval){
    clearInterval(window._paas_token_refresh_interval);
  }
  window._paas_token_refresh_interval = setInterval(function(){
    refreshPaaSToken(my.paas.refresh_token, function(data){
      my.paas.access_token = data.access_token;
      my.paas.refresh_token = data.refresh_token;
    });
  }, paasTokenRefreshInterval);
};

MyPage.showJumpToSinglePageErrorDialog = function(type){
  var self = this;
  switch (type){
    case "jumpToLocalUserManage":
      var Dialog = new PopupDialog({
        url: 'content/utils/error_dialog.html',
        width: 480,
        height: 268,
        context: self,
        callback: function () {
          jQuery("#utils_dialog_info_msg").text(i18n('ADV_SYSUSER_NORIGHT'));
          jQuery('#utils_dialog_info_submit').on('click', function() {
            Dialog.close();
          });
        }
      });
      Dialog.open();
      break;
    default:
      break;
  }
}

MyPage.showLoginPage = function() {
    var self = this;
    var loginPage = new LoginPage();
    jQuery(loginPage).on('login', function(){
        self.logIn();
    });
    this.page = loginPage;
};

MyPage.skipLoginPage = function(type, userName, userPassword) {
  var self = this;
  login(userName, userPassword, function(){
    self.userData = {
      user_name: my.paas.user_name,
      user_id: my.paas.user_id,
      user_type: my.paas.user_type,
      access_token: my.paas.access_token,
      refresh_token: my.paas.refresh_token,
      accessKeyId: my.aqua.accessKeyId,
      secretAccessKey: my.aqua.secretAccessKey
    };
    sessionStorage.userData = JSON.stringify(self.userData);
    sessionStorage.logged = '1';
    sessionStorage.historyLen = window.history.length;
    self.showJumpToSinglePage(type);
  });

  function login(user_name, pwd, callback){
    var self = this;
    paasLogin(user_name, pwd, function(data) {
      my.paas.user_id = data.user_id;
      my.paas.access_token = data.access_token;
      my.paas.refresh_token = data.refresh_token;

      getPaaSUser(data.user_id, data.access_token, function(paasUser) {
        my.paas.user_name = paasUser.user_name;
        my.paas.user_type = paasUser.metadata.AquaPaaSAdv_UserRole || '';
        my.paas.userRight = (function (userRight) {
          userRight = parseInt(userRight, 10);
          if(isNaN(userRight)){
            userRight = 0;
          }
          return userRight
        })(paasUser.metadata.AquaPaaSAdv_UserRight);
        aquaLogin(storage_username, storage_password, storage_domain, function(user) {
          my.aqua.accessKeyId = user.objectID;
          my.aqua.secretAccessKey = user.secretAccessKey;
          callback && callback();
        }, function() {
          alert(i18n('LOGIN_FAIL'));
        });
      });
    }, function() {
      alert(i18n('LOGIN_FAIL'));
    });
  }
};

MyPage.logIn = function() {
    this.userData = {
        user_name: my.paas.user_name,
        user_id: my.paas.user_id,
        user_type: my.paas.user_type,
        userRight: my.paas.userRight,
        access_token: my.paas.access_token,
        refresh_token: my.paas.refresh_token,
        platform_id: my.paas.platform_id,
        platform_current_id: my.paas.platform_current_id,
        accessKeyId: my.aqua.accessKeyId,
        secretAccessKey: my.aqua.secretAccessKey
    };
    sessionStorage.userData = JSON.stringify(this.userData);
    sessionStorage.logged = '1';
    sessionStorage.historyLen = window.history.length;
    this.showMainPage();
};

MyPage.setUserData = function(key, value){
	if(this.userData == null){
		this.userData = {};
	}
	this.userData[key] = value;
	sessionStorage.userData = JSON.stringify(this.userData);
};

MyPage.logOut = function() {
    this.userData = null;
    sessionStorage.userData = '';
    sessionStorage.logged = '0';
    this.showLoginPage();
};

MyPage.changePassword = function() {
  var dialog = new PopupDialog({
    url: 'content/pages/changePassword.html',
    width: 374,
    height: 317,
    context: {},
    callback: function() {

      jQuery('#adv_changePassword_submit').click(function(){

        jQuery('#adv_changePasswordDialog .regist-star').hide();

        var old_password = jQuery('#adv_changePasswordDialog_oldpassword input').val();
        var newpassword1 = jQuery('#adv_changePasswordDialog_newpassword input').val();
        var newpassword2 = jQuery('#adv_changePasswordDialog_againpassword input').val();

        if(!old_password || !newpassword1 || !newpassword2){
          if(!old_password){
            jQuery('#adv_changePasswordDialog_oldpassword .regist-star').show();
          }
          if(!newpassword1){
            jQuery('#adv_changePasswordDialog_newpassword .regist-star').show();
          }
          if(!newpassword2){
            jQuery('#adv_changePasswordDialog_againpassword .regist-star').show();
          }
          return;
        }
        if(newpassword1 !== newpassword2){
          jQuery('#adv_changePasswordDialog_newpassword .regist-star').show();
          jQuery('#adv_changePasswordDialog_againpassword .regist-star').show();
          return;
        }


        var AquaPassData = {
          "old_password": old_password,
          "password": newpassword1,
        };
        var url_update_user = paasHost + "/aquapaas/rest/users/user/" + my.paas.user_id + "?user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
        jQuery.ajax({
          type: 'PUT',
          async: true,
          url: url_update_user,
          data: JSON.stringify(AquaPassData),
          headers: {
            'Content-Type': 'application/json',
            //'Authorization': 'application/json',
            //'x-third-party': 'aqua',
            'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url_update_user)
          },
          dataType: "text",
        }).done(function (data, status, xhr) {
          dialog.close();
        }).fail(function (jqXHR, textStatus) {
          console.log(jqXHR);
        });

      });

    }
  });
  dialog.open();
};

MyPage.getMenu = function(){

    var biaoQianGuanLi = {
        userRight: 22,
        name: i18n('MAIN_MENU_BIAOQIANGUANLI'),
        className: 'main_menu_tagManage',
        id: 'main_page_menu_biaoqianguanli',
        action: this.navToBiaoQianGuanLi
    };
    var ceLueGuanLi = {
        userRight: 5,
        name: i18n('MAIN_MENU_CELUEGUANLI'),
        className: 'main_menu_strategyManage',
        id: 'main_page_menu_celueguanli',
        action: this.navToCeLueGuanLi
    };
    // var ceLueShenHe = { // Splited into new menu.
        // userRight: null,
        // name: i18n('MAIN_MENU_CELUESHENHE'),
        // className: 'main_menu_strategyVerify',
        // id: 'main_page_menu_celueshenhe',
        // action: this.navToCeLueShenHe
    // };
    var guangGaoWei = {
        userRight: 1,
        name: i18n('MAIN_MENU_GUANGGAOWEI'),
        className: 'main_menu_adPosition',
        id: 'main_page_menu_guanggaowei',
        action: this.navToGuangGaoWei
    };
    // var shouZhongGuanLi = {
        // name: i18n('MAIN_MENU_SHOUZHONGGUANLI'),
        // className: 'main_menu_audManage',
        // id: 'main_page_menu_shouzhongguanli',
        // action: this.navToShouZhongGuanLi
    // };
    var suCai = {
        userRight: 3,
        name: i18n('MAIN_MENU_SUCAI'),
        className: 'main_menu_mtrl',
        id: 'main_page_menu_sucai',
        action: this.navToSuCai
    };
    // var suCaiShenHe = { // Splited into new menu.
        // userRight: null,
        // name: i18n('MAIN_MENU_SUCAISHENHE'),
        // className: 'main_menu_mtrlVerify',
        // id: 'main_page_menu_sucaishenhe',
        // action: this.navToSuCaiShenHe
    // };
    var suCaiFabu = {
        userRight: 9,
        name: i18n('MAIN_MENU_SUCAIFABU'),
        className: 'main_menu_sucaifabu',
        id: 'main_page_menu_sucaifabu',
        action: this.navToSuCaiFaBu
    };
    var suCaiZu = {
        userRight: 4,
        name: i18n('MAIN_MENU_SUCAIZU'),
        className: 'main_menu_mtrlGroup',
        id: 'main_page_menu_sucaizu',
        action: this.navToSuCaiZu
    };
    var touFangBaoGao = {
        userRight: 19,
        name: i18n('MAIN_MENU_TOUFANGBAOGAO'),
        className: 'main_menu_tfReport',
        id: 'main_page_menu_toufangbaogao',
        action: this.navToTouFangBaoGao
    };
    var xiTongYongHuGuanLi = {
        userRight: 24,
        name: i18n('MAIN_MENU_XITONGYONGHUGUANLI'),
        className: 'main_menu_xtyhManage',
        id: 'main_page_menu_xitongyonghuguanli',
        action: this.navToXiTongYongHuGuanLi
    };
    var selfServiceManage = {
        userRight: 25,
        name: i18n('MAIN_MENU_ZIZHUYONGHU'),
        className: 'main_menu_selfServiceManage',
        id: 'main_page_menu_selfServiceManage',
        action: this.navToSelfServiceManage
    };
    var selfServiceAuditing = {
        userRight: 26,
        name: "用户审核",
        className: 'main_menu_selfServiceAudit',
        id: 'main_page_menu_selfServiceAuditing',
        action: this.navToSelfServiceAuditing
    };
    var statCount = {
        userRight: 16,
        name: i18n('MAIN_MENU_STATCOUNT'),
        className: 'main_menu_statcount',
        id: 'main_page_menu_statcount',
        action: this.navToStatCount
    };
    var statPeople = {
        userRight: 17,
        name: i18n('MAIN_MENU_STATNUMBEROFPEPOLE'),
        className: 'main_menu_statpeople',
        id: 'main_menu_statpeople',
        action: this.navToStatPeople
    };
    var statTrend = {
        userRight: 18,
        name: i18n('MAIN_MENU_STATTREND'),
        className: 'main_menu_stattrend',
        id: 'main_page_menu_stattrend',
        action: this.navToStatTrend
    };
	var orderList = {
        userRight: 20,
        name: i18n('MAIN_MENU_ORDER_LIST'),
        className: 'main_menu_order_list',
        id: 'main_page_menu_order_list',
        action: this.navToOrderList
    };
    var adSchedule = {
        userRight: 0,
        name: i18n('MAIN_MENU_AD_SCHEDULE'),
        className: 'main_menu_adschedule',
        id: 'main_page_menu_adschedule',
        action: this.navToAdSchedule
    };
    var siteAdmin = {
        userRight: 27,
        name: i18n('MAIN_MENU_SITE_ADMIN'),
        className: 'main_menu_siteadmin',
        id: 'main_page_menu_siteadmin',
        action: this.navToSiteAdmin
    };
    var contractMng = {
        userRight: 23,
        name: i18n('MAIN_MENU_CONTRACT_MANAGEMENT'),
        className: 'main_menu_contract_management',
        id: 'main_page_menu_contract_management',
        action: this.navToContractManagement
    };
    // var ticket = {
      // userRight: null,
      // name: i18n('MAIN_MENU_TICKET'),
      // className: 'main_menu_mtrl',
      // id: 'main_page_menu_ticket',
      // action: this.navToTicket
    // };
    var suCaiChuShen = {
        userRight: 7,
        name: i18n("MAIN_MENU_ITEMAUDIT_STEP1"),
        className: 'main_menu_item_audit_s1',
        id: 'main_menu_itemaudit_step1',
        action: this.navToSuCaiChuShen
    };
    var suCaiZhongShen = {
        userRight: 8,
        name: i18n('MAIN_MENU_ITEMAUDIT_STEPL'),
        className: 'main_menu_item_audit_s2',
        id: 'main_menu_itemaudit_steplast',
        action: this.navToSuCaiZhongShen
    };
    var suCaiQiTing = {
        userRight: 10,
        name: i18n('MAIN_MENU_ITEM_ACTIVATION'),
        className: 'main_menu_item_activation',
        id: 'main_menu_item_activation',
        action: this.navToSuCaiQiTing
    };
    var ceLueChuShen = {
        userRight: 12,
        name: i18n('MAIN_MENU_POLICYAUDIT_STEP1'),
        className: 'main_menu_policy_audit_s1',
        id: 'main_menu_policyaudit_step1',
        action: this.navToCeLueChuShen
    };
    var ceLueZhongShen = {
        userRight: 13,
        name: i18n('MAIN_MENU_POLICYAUDIT_STEPL'),
        className: 'main_menu_policy_audit_s2',
        id: 'main_menu_policyaudit_steplast',
        action: this.navToCeLueZhongShen
    };
    var ceLueQiTing = {
        userRight: 14,
        name: i18n('MAIN_MENU_POLICY_ACTIVATION'),
        className: 'main_menu_policy_activation',
        id: 'main_menu_policy_activation',
        action: this.navToCeLueQiTing
    };

    //@formatter:off
    var menu = [
        adSchedule,
        guangGaoWei,
        {
            isGroup: true,
            userRight: 2,
            name: i18n("MAIN_MENU_GROUP_ITEMPOLICY"),
            id: "main_page_menu_group_itempolicy",
            children: [
                suCai,
                suCaiZu,
                ceLueGuanLi
            ]
        },
        {
            isGroup: true,
            userRight: 6,
            name: i18n("MAIN_MENU_GROUP_ITEMAUDIT"),
            children: [
                suCaiChuShen,
                suCaiZhongShen,
                suCaiFabu,
                suCaiQiTing
            ]
        },
        {
            isGroup: true,
            userRight: 11,
            name: i18n("MAIN_MENU_GROUP_POLICYAUDIT"),
            children: [
                ceLueChuShen,
                ceLueZhongShen,
                ceLueQiTing
            ]
        },
        {
            isGroup: true,
            userRight: 15,
            name: i18n('MAIN_MENU_GROUP_STATS'),
            id: 'main_page_menu_group_stats',
            children: [
                statCount,
                statPeople,
                statTrend,
				touFangBaoGao,
				orderList
            ]
        },{
            isGroup: true,
            userRight: 21,
            name: i18n('MAIN_MENU_GROUP_GUANLI'),
            id: 'main_page_menu_group_guanli',
            children: [
                biaoQianGuanLi,
                contractMng,
                xiTongYongHuGuanLi,
                selfServiceManage,
                selfServiceAuditing
            ]
        }
    ];

    if(window.AdvSystemType == 'central'){
        // menu[2].children.splice(3, 2); // 去掉素材审核、策略审�?
        menu.push(siteAdmin);
    } else if(window.AdvSystemType == 'local'){
        menu.push(siteAdmin);
    }

    switch(my.paas.user_type){
    	case '0':// 广告主
    		menu = [suCai,suCaiZu,ceLueGuanLi,touFangBaoGao];
    		break;
    	case '1':// 运营商
    		// for(var i = 0, len = menu.length; i < len; i+=1){  // Old user right check.
    			// var item = menu[i];
    			// if(item.isGroup){
    				// for(var j = 0, jlen = item.children.length; j < jlen; j+=1){
    					// var ichild = item.children[j];
    					// if((ichild.userRight & my.paas.userRight) == 0){
    						// item.children[j] = null;
    					// }
    				// }
    				// if(item.children.every(function(child){
    					// return child == null;
    				// })){
    					// menu[i] = null;
    				// }
    			// } else {
    				// if((item.userRight & my.paas.userRight) == 0){
    					// menu[i] = null;
    				// }
    			// }
    		// }
            var rightStr = my.paas.userRight;
            for(var i = 0, len = menu.length; i < len; i+=1){
                var item = menu[i];
                if(checkMenuRight(item, rightStr)){
                    checkMenuSubs(item, 'children', function(child, rightStr){
                        checkMenuRight(child, rightStr);
                    }, rightStr);
                }
            }
    		break;
    	case '2':// 出版者
    		menu = [guangGaoWei,touFangBaoGao];
    		break;
    	default:
    		menu = [];
    		break;
    }
    //@formatter:on
    function checkMenuRight(menu, rightStr){
        if(menu != null && rightStr != null){
            var index = menu.userRight;
            if(index != null){
                var bit = rightStr[index];
                if(bit != null && bit != '' && bit != 'n'){
                    return true;
                } else {
                    menu.hidden = true;
                }
            } else {
                menu.hidden = true;
            }
        } else if(menu != null){
            menu.hidden = true;
        }
        return false;
    }

    function checkMenuSubs(menu, subProp, process, param){
        if(menu != null && subProp != null && typeof process == 'function'){
            var subs = menu[subProp];
            if(subs != null){
                for(var i = 0, len = subs.length; i < len; i+=1){
                    var sub = subs[i];
                    process(sub, param);
                }
            }
        }
    }

    return menu;
};

MyPage.getSingleMenu = function(type){
  var that = this;
    var xiTongYongHuGuanLi = {
        name: i18n('MAIN_MENU_XITONGYONGHUGUANLI'),
        className: 'main_menu_xtyhManage',
        id: 'main_page_menu_xitongyonghuguanli',
        action: this.navToXiTongYongHuGuanLi,
        userRight: 256
    };

    //@formatter:off
    var menu = [
    ];

    switch(type){
      case "jumpToLocalUserManage":
        menu = [
          {
            isGroup: true,
            name: i18n('MAIN_MENU_GROUP_GUANLI'),
            id: 'main_page_menu_group_guanli',
            children: [
              xiTongYongHuGuanLi
            ],
          }
        ];
        break;
    }

  switch(my.paas.user_type + ""){
    case '0':// 广告主
      menu = [];
      break;
    case '1':// 运营商
      for (var i = 0, len = menu.length; i < len; i += 1) {
        var item = menu[i];
        if (item.isGroup) {
          for (var j = 0, jlen = item.children.length; j < jlen; j += 1) {
            var ichild = item.children[j];
            if ((ichild.userRight & my.paas.userRight) == 0) {
              item.children[j] = null;
            }
          }
          if (item.children.every(function (child) {
              return child == null
            })) {
            menu[i] = null
          }
        } else {
          if ((item.userRight & my.paas.userRight) == 0) {
            menu[i] = null;
          }
        }
      }
      break;
    case '2':// 出版者
      menu = [];
      break;
  }

    //@formatter:on
    return menu;
};

MyPage.navToBiaoQianGuanLi = function() {
    var jses = [
        {name: '../../uiWidget/popupDialog.js', removable: true},
        {name: '../../uiWidget/styledList.js', removable: true},
        {name: '../../uiWidget/styledFlowList.js', removable: true},
        {name: '../../content/su_cai/newSelect.js',removable: true},
        {name: '../su_cai_zu/jquery.mCustomScrollbar.concat.min.js', removable: true},
        {"name":"../su_cai/newSelect.js","removable":true},
        {"name":"tagManage.js","removable":true}
    ];
    includePage('content_container', 'content/biao_qian_guan_li', 'tagManage.html', jses);
};

MyPage.navToCeLueGuanLi = function() {
  var jses = [
    {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js',removable: true},
      {name: '../../js/lib/ChinesePY.js',removable: true},
    {name: '../su_cai/aquadatacenter.js',removable: true},
    {name: '../su_cai_preview/myPlayer.js',removable: true},
    {name: '../su_cai_preview/preview.js',removable: true},
    {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/newCalendar.js',removable: true},
    {name: '../../uiWidget/datePicker.js',removable: true},
    {name: '../../uiWidget/styledSwitcher.js',removable: true},
    {name: '../../uiWidget/newSelect.js',removable: true},
    {name: '../../uiWidget/popupDialog.js',removable: true},
    {name: '../../uiWidget/alertDialog.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../../uiWidget/input_combo.js',removable: true},
    {name: '../utils/compDistribute.js',removable: true},
    {name: '../../uiWidget/multiFlowList.js', removable: true},
    {name: '../../uiWidget/scrollBarList.js', removable: true},
    {name: 'adConnectSite.js',removable: true},
    {name: '../utils/combiSelector.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
    {name: '../../js/lib/popper.js', removable: true},
		{name: '../../content/chooseSelfAdvUser/newSelect.js',removable: true},
    {name: '../../content/chooseSelfAdvUser/index.js',removable: true},
    {name: '../../content/ce_lue_guan_li/map.js',removable: true},
    {name: '../../content/ce_lue_guan_li/sucaiContractHint.js',removable: true},
    {name: 'adPolicyManage.js',removable: true}
  ];
  includePage('content_container', 'content/ce_lue_guan_li','adPolicyManage.html', jses);
};

MyPage.navToCeLueShenHe = function() {
  var jses = [
      {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js',removable: true},
      {name: '../../content/su_cai/aquadatacenter.js',removable: true},
      {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
      {name: '../../content/su_cai_preview/preview.js',removable: true},
      {name: '../../uiWidget/styledList.js',removable: true},
      {name: '../../uiWidget/newCalendar.js',removable: true},
      {name: '../../uiWidget/datePicker.js',removable: true},
      {name: '../../uiWidget/newSelect.js',removable: true},
      {name: '../../uiWidget/popupDialog.js',removable: true},
      {name: '../../uiWidget/overlayDialog.js',removable: true},
      {name: '../../uiWidget/input_combo.js',removable: true},
      {name: '../../content/ce_lue_guan_li/map.js',removable: true},
      {name: '../utils/auditHis.js',removable: true},
      {name: 'adPolicyAudit.js',removable: true}
  ];
  includePage('content_container', 'content/ce_lue_shen_he','adPolicyAudit.html', jses);
};

MyPage.navToGuangGaoWei = function() {
    var jses = [{name: '../../uiWidget/styledList.js', removable: true},
        {name: '../../uiWidget/styledSelector.js', removable: true},
        {name: '../su_cai/aquadatacenter.js', removable: true},
        {name: '../su_cai/upload.js', removable: true},
        {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js',removable: true},
        {name: '../su_cai_preview/preview.js', removable: true},
        {name: '../../uiWidget/multiFlowList.js', removable: true},
        {name: 'adConnectSite.js', removable: true},
        {name: '../utils/compDistribute.js', removable: true},
        {name: '../../uiWidget/styledSwitcher.js', removable: true},
        {name: '../../js/lib/ChinesePY.js', removable: true},
        {name: '../utils/combiSelector.js', removable: true},
        {name: '../../uiWidget/overlayDialog.js', removable: true},
        {name: 'AdPosition.js', removable: true}];
    includePage('content_container', 'content/guang_gao_wei', 'AdPosition.html', jses);
};

MyPage.navToShouZhongGuanLi = function(){
  //var jses = [{"name":"shouzhong_management.js","removable":true}];
  var jses = [];
  includePage('content_container', 'content/shou_zhong_guan_li', 'shouzhong_management.html', jses);
};

MyPage.navToSuCai = function() {
    var jses = [
      {name: '../../uiWidget/aquaUtil.js',"removable":true},
      {"name": '../../uiWidget/popupDialog.js', removable: true},
        {"name": '../../uiWidget/styledList.js', removable: true},
        {"name":"UploadModule.js","removable":true},
        {"name": '../../content/su_cai/aquadatacenter.js',removable: true},
        {"name": '../../content/su_cai_preview/myPlayer.js',removable: true},
        {"name": '../../content/su_cai_preview/preview.js',removable: true},
		{name: '../../js/lib/popper.js', removable: true},
		{"name": '../../content/chooseSelfAdvUser/newSelect.js',removable: true},
        {"name": '../../content/chooseSelfAdvUser/index.js',removable: true},
        {"name": '../su_cai_zu/jquery.mCustomScrollbar.concat.min.js', removable: true},
        {"name":"newSelect.js","removable":true},
        {"name":"jquery-ui.js","removable":true},
        {"name":"PopupDialog_.js","removable":true},
        {"name": '../utils/compDistribute.js', removable: true},
        {name: '../utils/auditHis.js',removable: true},
        {name: '../../uiWidget/styledSwitcher.js', removable: true},
        {name: '../../uiWidget/scrollBarList.js', removable: true},
        {name: '../../js/lib/ChinesePY.js', removable: true},
        {name: '../utils/combiSelector.js', removable: true},
        {"name":"sucai.js","removable":true},
        {name: '../../js/lib/bluebird.min.js', removable: true},
        {"name":"./template/sucai_img_template.js", "removable":true},
        {name: '../../js/lib/cropper.js', removable: true},
        {"name": 'alertDialog.js', removable: true},
        {"name": 'openLimit.js', removable: true},
        {"name": 'editLimit.js', removable: true},
        {"name": 'viewLimit.js', removable: true}
    ];
    includePage('content_container', 'content/su_cai', 'sucai.html', jses);
};

MyPage.navToSuCaiShenHe = function() {
  var jses = [
      {name: '../../uiWidget/styledList.js',removable: true},
      {name: '../../uiWidget/popupDialog.js',removable: true},
      {name: '../../uiWidget/overlayDialog.js',removable: true},
      {name: '../../content/su_cai/aquadatacenter.js',removable: true},
      {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
      {name: '../../content/su_cai_preview/preview.js',removable: true},
      {name: '../utils/auditHis.js',removable: true},
      {name: 'user_info.js',removable: true},
      {name: 'psdAudit.js',removable: true}
  ];
  includePage('content_container', 'content/su_cai_shen_he', 'psdAudit.html', jses);
};

/**
 * 素材发布模块
 */
MyPage.navToSuCaiFaBu = function(){
	var jses = [
    {name: '../../content/su_cai_shen_he/user_info.js', removable: true},
		{name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js', removable: true},
    {name: '../utils/auditHis.js', removable: true},
    {name: 'publish.js',removable: true},
    {name: 'index.js',removable: true}
    ];
    includePage('content_container', 'content/su_cai_fa_bu','index.html', jses);
}
MyPage.navToSuCaiZu = function() {
    var jses = [
        {name: '../../uiWidget/popupDialog.js', removable: true},
        {name: '../../uiWidget/styledList.js', removable: true},
        {name: '../../uiWidget/styledFlowList.js', removable: true},
        {name: 'jquery.mCustomScrollbar.concat.min.js', removable: true},
        {"name":"../su_cai/newSelect.js","removable":true},
        {name: '../utils/compDistribute.js', removable: true},
        {name: '../../uiWidget/styledSwitcher.js', removable: true},
        {name: '../../js/lib/ChinesePY.js', removable: true},
        {name: '../utils/combiSelector.js', removable: true},
        {"name":"sucaizu.js","removable":true}
    ];
    includePage('content_container', 'content/su_cai_zu', 'sucaizu.html', jses);
};

MyPage.navToTouFangBaoGao = function(){
  var jses = [];
  var jses = [
	  {name: '../../uiWidget/overlayDialog.js',removable: true},
		{name: '../../uiWidget/input_combo.js',removable: true},
		{name: '../../uiWidget/styledSelector.js', removable: true},
		{name: '../../uiWidget/newCalendar.js', removable: true},
		{name: '../../js/lib/popper.js', removable: true},
		{name:'newSelect.js', "removable":true},
		{"name":"toufang_baogao.js","removable":true}
	];
  includePage('content_container', 'content/tou_fang_bao_gao', 'toufang_baogao.html', jses);
};

MyPage.navToXiTongYongHuGuanLi = function(){
  var jses = [{"name":"jquery.ztree.all.min.js","removable":true},  {name: '../utils/combiSelector.js', removable: true},{name: '../../uiWidget/styledSelector.js', removable: true},{"name":"aquadatacenter.js","removable":true},{"name":"system_user_management.js","removable":true},{"name":"system_user_upload.js","removable":true}];
  includePage('content_container', 'content/xi_tong_yong_hu_guan_li', 'system_user_management.html', jses);
};

MyPage.navToStatCount = function(){
    var jses = [
        {name: '../../uiWidget/popupDialog.js', removable: true},
      {name: '../../uiWidget/alertDialog.js',removable: true},
      {name: '../../uiWidget/overlayDialog.js',removable: true},
      {name: '../../uiWidget/styledList.js', removable: true},
        {name: '../../uiWidget/styledFlowList.js', removable: true},
        {name: '../../uiWidget/Chart.js', removable: true},
        {name: '../../uiWidget/Chart.PieceLabel.js', removable: true},
        {name: '../../uiWidget/chartAxes.js', removable: true},
        {name: '../../content/su_cai/newSelect.js',removable: true},
        {name: '../su_cai_zu/jquery.mCustomScrollbar.concat.min.js', removable: true},
        {name: '../../uiWidget/styledSwitcher.js', removable: true},
        {name: '../../js/lib/ChinesePY.js', removable: true},
        {name: '../utils/combiSelector.js', removable: true},
        {"name":"index.js","removable":true}
    ];
    includePage('content_container', 'content/ji_shu_bao_biao', 'index.html', jses);
};

MyPage.navToStatPeople = function(){
    var jses = [
        {name: '../../uiWidget/popupDialog.js', removable: true},
      {name: '../../uiWidget/alertDialog.js',removable: true},
      {name: '../../uiWidget/overlayDialog.js',removable: true},
      {name: '../../uiWidget/styledList.js', removable: true},
        {name: '../../uiWidget/styledFlowList.js', removable: true},
        {name: '../../uiWidget/Chart.js', removable: true},
        {name: '../../uiWidget/Chart.PieceLabel.js', removable: true},
        {name: '../../uiWidget/chartAxes.js', removable: true},
        {name: '../../content/su_cai/newSelect.js',removable: true},
        {name: '../su_cai_zu/jquery.mCustomScrollbar.concat.min.js', removable: true},
        {name: '../../uiWidget/styledSwitcher.js', removable: true},
        {name: '../../js/lib/ChinesePY.js', removable: true},
        {name: '../utils/combiSelector.js', removable: true},
        {"name":"list.js","removable":true},
        {"name":"index.js","removable":true}
    ];
    includePage('content_container', 'content/ren_shu_bao_biao', 'index.html', jses);
};

MyPage.navToStatTrend = function(){
	var jses = [
    {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js', removable: true},
    {name: '../../uiWidget/styledSelector.js', removable: true},
    {name: '../../uiWidget/alertDialog.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../../uiWidget/newCalendar.js', removable: true},
		{name: '../../uiWidget/chartAxes.js', removable: true},
		{name: '../../uiWidget/styledSwitcher.js', removable: true},
		{name: '../../js/lib/ChinesePY.js', removable: true},
		{name: '../utils/combiSelector.js', removable: true},
    {"name":"../ren_shu_bao_biao/list.js","removable":true},
		{name: 'StatTrend.js', removable: true}
	];
	includePage('content_container', 'content/stattrend', 'stattrend.html', jses);
};

MyPage.navToAdSchedule = function(){
    var jses = [
			  {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js',removable: true},
				/*
        {name: '../../content/guang_gao_pai_qi/calendar.js',removable: true},
				{name: '../../content/guang_gao_pai_qi/datePicker.js',removable: true},
				*/
				{name: '../../content/guang_gao_pai_qi/moment.js',removable: true},
				{name: '../../content/guang_gao_pai_qi/daterangepicker.js',removable: true},
        {name: '../../content/guang_gao_pai_qi/chineseToPinyin.js',removable: true},
        {name: '../../content/guang_gao_pai_qi/advSchedule.js',removable: true}
    ];
    includePage('content_container', 'content/guang_gao_pai_qi','advSchedule.html', jses);
};

MyPage.navToSelfServiceManage = function(){
	var jses = [
		{name: '../../uiWidget/aquaUtil.js',"removable":true},
		{name: '../../uiWidget/styledList.js', removable: true},
		{name: '../../uiWidget/noPagiList.js', removable: true},
		{name: '../../uiWidget/overlayDialog.js', removable: true},
		{name: './device/tabs_switch.js', removable: true},
		{name: './device/styledListClone.js', removable: true},
    {name: '../../js/lib/popper.js', removable: true},
    {name:'../ticket/newSelect.js', "removable":true},
    {"name": '../su_cai_zu/jquery.mCustomScrollbar.concat.min.js', removable: true},
    {name: '../../content/self_service_adviser_manage/aquadatacenter.js',"removable":true},
		{name: '../../content/self_service_adviser_manage/full_screen.js',"removable":true},
		{name: '../../content/self_service_adviser_manage/index.js',removable: true},
    {name: '../../content/self_service_adviser_manage/run/manage.js',removable: true}
	];
	includePage('content_container', 'content/self_service_adviser_manage','index.html', jses);
};

MyPage.navToSelfServiceAuditing = function(){
  var jses = [
    {name: '../../uiWidget/aquaUtil.js',"removable":true},
    {name: '../../uiWidget/styledList.js', removable: true},
    {name: '../../uiWidget/noPagiList.js', removable: true},
    {name: '../../uiWidget/overlayDialog.js', removable: true},
    {name: './device/tabs_switch.js', removable: true},
    {name: './device/styledListClone.js', removable: true},
    {name: '../../js/lib/popper.js', removable: true},
    {name:'../ticket/newSelect.js', "removable":true},
    {"name": '../su_cai_zu/jquery.mCustomScrollbar.concat.min.js', removable: true},
    {name: '../../content/self_service_adviser_manage/aquadatacenter.js',"removable":true},
		{name: '../../content/self_service_adviser_manage/full_screen.js',"removable":true},
    {name: '../../content/self_service_adviser_manage/index.js',removable: true},
    {name: '../../content/self_service_adviser_manage/run/aduit.js',removable: true}
  ];
  includePage('content_container', 'content/self_service_adviser_manage','index.html', jses);
};



MyPage.navToSiteAdmin = function(){
	var jses = [
		{name: '../../uiWidget/styledList.js', removable: true},
		{name: '../utils/compDistribute.js', removable: true},
		{name: 'siteAdmin.js', removable: true}
	];
	includePage('content_container', 'content/site_admin', 'site_admin.html', jses);
};
/**
 * 合同管理
 * @method
 * @return {[type]} [description]
 */
MyPage.navToContractManagement = function() {
	var jses = [
		// {name: '../../uiWidget/styledList.js', removable: true},
		// {name: '../utils/compDistribute.js', removable: true},
    {name: '../../uiWidget/newSelect.js',removable: true},
		{name: '../su_cai/aquadatacenter.js', removable: true},
		{name: '../su_cai/upload.js', removable: true},
		{name: 'contract.js', removable: true},
		{name: 'contract_delete.js', removable: true},
		{name: 'contract_viewer.js', removable: true},
		{name: 'index.js', removable: true}
	];
	includePage('content_container', 'content/contracts', 'index.html', jses);
}

MyPage.navToTicket = function() {
  var jses = [
    {name: '../../uiWidget/styledList.js', removable: true},
    {name: 'aquaUtil.js', removable: true},
    {"name":"newCalendar.js","removable":true},
    {name: '../../js/lib/popper.js', removable: true},
    {"name":"newSelect.js","removable":true},
    {"name":"aqua.js","removable":true},
    {name:'lecture_ticket.js', removable:true},
  ];
  includePage('content_container', 'content/ticket', 'lecture_ticket.html', jses);
};

MyPage.navToOrderList = function(){
	var jses = [
		{name: '../../uiWidget/newCalendar.js', removable: true},
		{name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../../content/order_report/index.js',removable: true}
  ];
  includePage('content_container', 'content/order_report','index.html', jses);
};

MyPage.navToSuCaiChuShen = function(){
  var jses = [
        {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/popupDialog.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
    {name: 'user_info.js',removable: true},
    {name: 'index.js',removable: true}
  ];
  includePage('content_container', 'content/su_cai_chu_shen','index.html', jses);
};

MyPage.navToSuCaiZhongShen = function(){
  var jses = [
        {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/popupDialog.js',removable: true},
    {name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
    {name: '../../content/su_cai_chu_shen/user_info.js',removable: true},
    {name: 'index.js',removable: true}
  ];
  includePage('content_container', 'content/su_cai_zhong_shen','index.html', jses);
};
/**
 * 素材启停
 */
MyPage.navToSuCaiQiTing = function(){
  var jses = [
        {name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
        {name: '../../content/su_cai_shen_he/user_info.js',removable: true},
    {name: 'index.js',removable: true}
  ];
  includePage('content_container', 'content/su_cai_qi_ting','index.html', jses);
};

MyPage.navToCeLueChuShen = function(){
  var jses = [
    {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js',removable: true},
    {name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/newCalendar.js',removable: true},
    {name: '../../uiWidget/datePicker.js',removable: true},
    {name: '../../uiWidget/newSelect.js',removable: true},
    {name: '../../uiWidget/popupDialog.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../../uiWidget/input_combo.js',removable: true},
    {name: '../../content/ce_lue_guan_li/map.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
    {name: 'index.js',removable: true}
  ];
  includePage('content_container', 'content/ce_lue_chu_shen','index.html', jses);
};

MyPage.navToCeLueZhongShen = function(){
  var jses = [
    // {name: '../../js/lib/jquery.mCustomScrollbar.concat.min.js',removable: true},
    {name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/newCalendar.js',removable: true},
    {name: '../../uiWidget/datePicker.js',removable: true},
    {name: '../../uiWidget/newSelect.js',removable: true},
    {name: '../../uiWidget/popupDialog.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../../uiWidget/input_combo.js',removable: true},
    {name: '../../content/ce_lue_guan_li/map.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
    {name: 'index.js',removable: true}
  ];
  includePage('content_container', 'content/ce_lue_zhong_shen','index.html', jses);
};
/**
 * 策略启停
 */
MyPage.navToCeLueQiTing = function(){
  var jses = [
    {name: '../../content/su_cai/aquadatacenter.js',removable: true},
    {name: '../../content/su_cai_preview/myPlayer.js',removable: true},
    {name: '../../content/su_cai_preview/preview.js',removable: true},
    {name: '../../uiWidget/styledList.js',removable: true},
    {name: '../../uiWidget/newCalendar.js',removable: true},
    {name: '../../uiWidget/datePicker.js',removable: true},
    {name: '../../uiWidget/newSelect.js',removable: true},
    {name: '../../uiWidget/popupDialog.js',removable: true},
    {name: '../../uiWidget/overlayDialog.js',removable: true},
    {name: '../../uiWidget/input_combo.js',removable: true},
    {name: '../../content/ce_lue_guan_li/map.js',removable: true},
    {name: '../utils/auditHis.js',removable: true},
    {name: 'index.js',removable: true}
  ];
  includePage('content_container', 'content/ce_lue_qi_ting','index.html', jses);
};

