var UserAdmin = (function($){

  function parseStr(para){
    return para != null ? para : '';
  }

  function preZero(num){
    var str = num.toString();
    if(str.length < 2){
      str = '0' + str;
    }
    return str;
  }

  function timestampToStr(num){
    var obj = new Date(num);
    var y = obj.getFullYear();
    var m = obj.getMonth() + 1;
    var d = obj.getDate();
    var h = obj.getHours();
    var min = obj.getMinutes();
    var s = obj.getSeconds();

    return y + '-' + preZero(m) + '-' + preZero(d) + ' ' + preZero(h) + ':' + preZero(min) + ':' + preZero(s);
  }

  function getNormalSelector(containerId, options){
    var selector = new StyledSelector({
      containerId: containerId,
      styles: {
        optionHeight: 25,
        iconSize: 14,
      },
      options: options
    });
    selector.getCloseIcon = function() {
      return '<div class="stuptact-styled-selector-up-arrow"></div>';
    };
    selector.getOpenIcon = function() {
      return '<div class="stuptact-styled-selector-down-arrow"></div>';
    };
    return selector;
  }

  function showMsgDialog(msg, callback){
      var dialog = new OverlayDialog({
        url: 'content/sys_user_admin/msg-dialog.html',
        width: 470,
        height: 266,
        context: {},
        zIndex: 3000,
        id: 'user-admin-msg',
        callback: function(){
          $('#user-admin-msg-content').text(msg);
          $('#user-admin-msg-close').on('click', function(){
            dialog.close();
          });
          $('#user-admin-msg-cancel').on('click', function(){
            dialog.close();
          });
          $('#user-admin-msg-submit').on('click', function(){
            dialog.close();
            if(typeof callback == 'function'){
              callback();
            }
          });
        }
      });
      dialog.open();
  }
	
	function showMsgDialogOneButton(msg, callback){
		var dialog = new OverlayDialog({
			url: 'content/sys_user_admin/msg-dialog-one-botton.html',
			width: 470,
			height: 266,
			context: {},
			zIndex: 3000,
			id: 'user-admin-msg',
			callback: function(){
				$('#user-admin-msg-content').text(msg);
				$('#user-admin-msg-close').on('click', function(){
					dialog.close();
				});
				$('#user-admin-msg-submit').on('click', function(){
					dialog.close();
					if(typeof callback == 'function'){
						callback();
					}
				});
      }
    });
    dialog.open();
	}

  function getTitledSpan(str){
    return $('<span>').append(str).attr('title', str)[0].outerHTML;
  }

  var userTag = {
    tagType: 'usertag',
    init: function(user){
      var self = this;
      self.user = user;
      self.showDialog();
    },

    showDialog: function(){
      var self = this;
      if(!self.listDialog){

        self.listDialog = new PopupDialog({
          url: 'content/userAdmin/user-tag.html',
          width: 864,
          height: 514,
          context: {},
          callback: function() {
            $('#user-admin-group-list').on('click', '.user-admin-group-del', function() {
              var index = $(this).parent().attr('data-index');
              var group = self.groupList[index];
              showMsgDialog(i18n('USER_ADMIN_USER_GROUP_DEL_MSG') + group.name + i18n('USER_ADMIN_USER_GROUP_DEL_SUFX'), function() {
                self.delUserGroup(group);
              });
            }).on('click', '.user-admin-group-add', function() {
              self.showAddDialog();
            });
            self.listUserGroup();
          }

        });

      }
      self.listDialog.open();
    },

    showAddDialog: function(){
      var self = this;
      if(!self.addingOverlay){

        self.addingOverlay = new OverlayDialog({
          url: 'content/userAdmin/user-tag-add.html',
          width: 510,
          height: 530,
          context: {},
          callback: function() {
            $('#user-admin-group-add-submit').on('click', function() {
              //添加用户组
              let group = [];
              $('.user-admin-group .user-admin-group-body .check_box').each(function(i){
                if(this.classList.contains("focus")){
                  group.push(self.fullGroup[i])
                }
              })
              self.addUserGroup(group);
            });
            $('.user-admin-group-seabox').on('keyup', '#user-admin-group-seain',function(e) {
              let key = e.keyCode||e.which;
              if (key == 13) {
                //搜索list
                self.GroupSelectTable($(e.target).parents('.user-admin-group-seabox').find('input').val())
              }
            }).on('click', '.user-admin-group-seabtn', function(e) {
              //搜索list
              self.GroupSelectTable($(e.target).parents('.user-admin-group-seabox').find('input').val())
            });
            $('.user-admin-group').on('click', '.user-admin-group-title .check_box',function(e) {
              let el = $(e.target).parents('.check_box').length==0?$(e.target):$(e.target).parents('.check_box');
              el.toggleClass("focus")
              if (el.hasClass("focus")) {
                $('.user-admin-group .check_box').addClass('focus')
              } else {
                $('.user-admin-group .check_box').removeClass('focus')
              }
            }).on('click', '.user-admin-group-body .check_box', function(e) {
              let el = $(e.target).parents('.check_box').length==0?$(e.target):$(e.target).parents('.check_box');
              el.toggleClass("focus")
            });
            //load fullgrouplist
            self.listFullGroup();
          }

        });

     }
     self.addingOverlay.open();
   },
   listFullGroup() {
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/tagdef/' + self.tagType;
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var method = 'GET';
      $.ajax({
        url: url,
        type: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(data){
        var list = $.makeArray(data);
        self.fullGroup = list;
        self.GroupSelectTable();
      }).fail(function(){
        self.fullGroup = [];
        self.GroupSelectTable();
      });
   },
   GroupSelectTable(filter) {
       var frag = document.createDocumentFragment();
       var self = this;
       //表头
      $('<div>').addClass('user-admin-group-title').addClass('user-admin-group-table-row').append(
        $('<div>')
      ).append(
        $('<div>').append($('<div>').addClass('check_box').append($('<div>')))
      ).append(
        $('<div>').append(i18n("USER_ADMIN_USER_TAG_ADDCHOICES")).css('text-align', 'center')
      ).appendTo(frag);
      //表体
     var body = $('<div>').addClass('user-admin-group-body').appendTo(frag);
      //加载表
       let list = self.fullGroup;
       let index = 1;
       list.forEach(function(item, i) {
         if (item.name.indexOf(filter?filter:"")!==-1) {
           $('<div>').addClass('user-admin-group-table-row').css({
             'height': '41px',
             'line-height': '41px',
             'color': '#797979'
           }).append(
             $('<div>').append(index)
           ).append(
             $('<div>').append($('<div>').addClass('check_box').attr("data-index", i).append($('<div>')))
           ).append(
             $('<div>').append(item.name)
           ).appendTo(body);
           index++;
        }
       });
       $('#user-admin-group').empty().append(frag);
   },
   addUserGroup(group) {
     var self = this;
     for (var i = 0; i < group.length; i++) {
       let item = group[i];
         var url = aquapaas_host + '/aquapaas/rest/usertags/' + self.user.user_id + '/' + self.tagType + '/' + item.name;
         url += '?app_key=' + paasAppKey;
         url += '&timestamp=' + new Date().toISOString();
         var method = 'PUT';
         $.ajax({
           url: url,
           type: method,
           data: JSON.stringify({
             type: 'group',
             name: item.name
           }),
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
           }
         }).done(function(data) {
         });
     }
     self.addingOverlay.close();
     self.listUserGroup();
   }
  };

  var userGroup = {
    tagType: 'group',
    init: function(user){
      var self = this;
      self.user = user;
      self.showDialog();
    },

    showDialog: function(){
      var self = this;
      if(!self.listDialog){

        self.listDialog = new PopupDialog({
          url: 'content/userAdmin/user-group.html',
          width: 864,
          height: 514,
          context: {},
          callback: function() {
            $('#user-admin-group-list').on('click', '.user-admin-group-del', function() {
              var index = $(this).parent().attr('data-index');
              var group = self.groupList[index];
              showMsgDialog(i18n('USER_ADMIN_USER_GROUP_DEL_MSG') + group.name + i18n('USER_ADMIN_USER_GROUP_DEL_SUFX'), function() {
                self.delUserGroup(group);
              });
            }).on('click', '.user-admin-group-add', function() {
              self.showAddDialog();
            });
            self.listUserGroup();
          }

        });

      }
      self.listDialog.open();
    },

    listUserGroup: function(){
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/usertags/' + self.user.user_id + '/' + self.tagType;
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      url += '&user_id=' + my.paas.user_id;
      url += '&access_token=' + my.paas.access_token;
      var method = 'GET';
      $.ajax({
        url: url,
        type: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(data){
        var list = $.makeArray(data);
        self.groupList = list;
        self.addGroupList(list);
      }).fail(function(){
        self.groupList = [];
        self.addGroupList([]);
      });
    },

    addGroupList: function(list){
      var frag = document.createDocumentFragment();
      list.forEach(function(item, i){
        $('<div>').addClass('user-admin-group-item')
          .attr('data-index', i)
          .append(
            $('<span>').append(item.name)
          ).append(
            $('<div>').addClass('user-admin-group-del')
          ).appendTo(frag);
      });

      $('<div>').addClass('user-admin-group-add').appendTo(frag);
      $('#user-admin-group-list').empty().append(frag);
    },

    delUserGroup: function(group){
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/usertags/' + self.user.user_id + '/' + self.tagType + '/' + group.name;
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var method = 'DELETE';
      $.ajax({
        url: url,
        type: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(data){
        self.listUserGroup();
      }).fail(function(xhr){
        showMsgDialog(xhr.getResponseHeader('x-aqua-error-code'));
      });
    },

    showAddDialog: function(){
      var self = this;
      if(!self.addingOverlay){

        self.addingOverlay = new OverlayDialog({
          url: 'content/userAdmin/user-group-add.html',
          width: 510,
          height: 530,
          context: {},
          callback: function() {
            $('#user-admin-group-add-submit').on('click', function() {
              //添加用户组
              let group = [];
              $('.user-admin-group .user-admin-group-body .check_box').each(function(i){
                if(this.classList.contains("focus")){
                  group.push(self.fullGroup[i])
                }
              })
              self.addUserGroup(group);
            });
            $('.user-admin-group-seabox').on('keyup', '#user-admin-group-seain',function(e) {
              let key = e.keyCode||e.which;
              if (key == 13) {
                //搜索list
                self.GroupSelectTable($(e.target).parents('.user-admin-group-seabox').find('input').val())
              }
            }).on('click', '.user-admin-group-seabtn', function(e) {
              //搜索list
              self.GroupSelectTable($(e.target).parents('.user-admin-group-seabox').find('input').val())
            });
            $('.user-admin-group').on('click', '.user-admin-group-title .check_box',function(e) {
              let el = $(e.target).parents('.check_box').length==0?$(e.target):$(e.target).parents('.check_box');
              el.toggleClass("focus")
              if (el.hasClass("focus")) {
                $('.user-admin-group .check_box').addClass('focus')
              } else {
                $('.user-admin-group .check_box').removeClass('focus')
              }
            }).on('click', '.user-admin-group-body .check_box', function(e) {
              let el = $(e.target).parents('.check_box').length==0?$(e.target):$(e.target).parents('.check_box');
              el.toggleClass("focus")
            });
            //load fullgrouplist
            self.listFullGroup();
          }

        });

     }
     self.addingOverlay.open();
   },
   listFullGroup() {
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/tagdef/group';
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var method = 'GET';
      $.ajax({
        url: url,
        type: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(data){
        var list = $.makeArray(data);
        self.fullGroup = list;
        self.GroupSelectTable();
      }).fail(function(){
        self.fullGroup = [];
        self.GroupSelectTable();
      });
   },
   GroupSelectTable(filter) {
       var frag = document.createDocumentFragment();
       var self = this;
       //表头
      $('<div>').addClass('user-admin-group-title').addClass('user-admin-group-table-row').append(
        $('<div>')
      ).append(
        $('<div>').append($('<div>').addClass('check_box').append($('<div>')))
      ).append(
        $('<div>').append(i18n("USER_ADMIN_USER_GROUP_ADDCHOICES")).css('text-align', 'center')
      ).appendTo(frag);
      //表体
     var body = $('<div>').addClass('user-admin-group-body').appendTo(frag);
      //加载表
       let list = self.fullGroup;
       let index = 1;
       list.forEach(function(item, i) {
         if (item.name.indexOf(filter?filter:"")!==-1) {
           $('<div>').addClass('user-admin-group-table-row').css({
             'height': '41px',
             'line-height': '41px',
             'color': '#797979'
           }).append(
             $('<div>').append(index)
           ).append(
             $('<div>').append($('<div>').addClass('check_box').attr("data-index", i).append($('<div>')))
           ).append(
             $('<div>').append(item.name)
           ).appendTo(body);
           index++;
        }
       });
       $('#user-admin-group').empty().append(frag);
   },
   addUserGroup(group) {
     var self = this;
     for (var i = 0; i < group.length; i++) {
       let item = group[i];
         var url = aquapaas_host + '/aquapaas/rest/usertags/' + self.user.user_id + '/' + self.tagType + '/' + item.name;
         url += '?app_key=' + paasAppKey;
         url += '&timestamp=' + new Date().toISOString();
         var method = 'PUT';
         $.ajax({
           url: url,
           type: method,
           data: JSON.stringify({
             type: 'group',
             name: item.name
           }),
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
           }
         }).done(function(data) {
         });
     }
     self.addingOverlay.close();
     self.listUserGroup();
   }
  };
	
  var userList = {
    init: function(){
      var self = this;
			var domainName="default";
			this.hasFirstAuthPagedEntered=false;
			this.hasSecondAuthPagedEntered=false;
			this.hasThirdAuthPagedEntered=false;
			this.domainId=this.getDomainIdByName(domainName);
			this.leftContainerId={};
			this.rightContainerId={};
			this.alltreeDatasFromServer={};
			this.alltreeDatasFromServerIncludeAll={};
      self.setList();
      self.handleEvents();
      window.dropdownHelper.addDropdownHandler(self);
      self.listCnt = $('#user-admin-index')[0];
    },
		getDomainIdByName:function(name){
		    var dominid="";
				var url = aquapaas_host + '/aquapaas/rest/domains/domain/' + name;
				url += '?app_key=' + paasAppKey;
				url += '&timestamp=' + new Date().toISOString();
				$.ajax({
					type: 'GET',
					url: url,
					async: false,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
					}
				}).done(function(data){
					dominid = data.id;
				});
				return dominid
		},
		goToAuthPage:function(){
			var currentUser=this.currentUser;
			var AquaBO_menuUserRight=( (currentUser&&currentUser.metadata&&currentUser.metadata.AquaBO_menuUserRight)?currentUser.metadata.AquaBO_menuUserRight:"" );
			var AquaBO_mediaUserRight=( (currentUser&&currentUser.metadata&&currentUser.metadata.AquaBO_mediaUserRight)?currentUser.metadata.AquaBO_mediaUserRight:"" );
			var AquaBO_naviUserRight=( (currentUser&&currentUser.metadata&&currentUser.metadata.AquaBO_naviUserRight)?currentUser.metadata.AquaBO_naviUserRight:"" );
			this.commitAuthMetaDataObj={
				"AquaBO_menuUserRight":AquaBO_menuUserRight,//菜单授权
				"AquaBO_mediaUserRight":AquaBO_mediaUserRight,//节目授权
				"AquaBO_naviUserRight":AquaBO_naviUserRight//编排授权
			}
			$("#sys-user-admin-page2-bottom").show();
			this.bindAuthPageButtonEvents();
			this.initFirstPage();
		},
		bindAuthPageButtonEvents:function(){
      var self=this;
			var authType=this.authType;
		  $(".tab_switch_unit").each(function(index,element){
				$(this).unbind().bind('click', function () {
				  $(".tab_switch_unit").each(function(){
						$(this).removeClass("tab_switch_unit_focus")
					})
					$(this).addClass("tab_switch_unit_focus");
				  $("#sys-user-admin-page2-part2").children().each(function(){
						$(this).hide()
					})
					$("#sys-user-admin-page2-part2").children().eq(index).show();
					switch(index)
					{
					case 0:
						$("#sys-user-admin-page2-part2-hiddenWords").hide();
						self.authType="menuAuth";
						if(!self.hasFirstAuthPagedEntered){
							self.initFirstPage();
						}
						break;
					case 1:
						$("#sys-user-admin-page2-part2-hiddenWords").show();
						if(!self.hasSecondAuthPagedEntered){
							self.initSecondPage();
						}
						else{
							self.authType="AquaBO_mediaUserRight";
							self.dataStoredArray=self.commitAuthMetaDataObj[self.authType].split(",");//当前存储数据等于该tab上次切换前保存的数据
						}
						break;
					case 2:
						$("#sys-user-admin-page2-part2-hiddenWords").show();
						if(!self.hasThirdAuthPagedEntered){
							self.initThirdPage();
						}
						else{
							self.authType="AquaBO_naviUserRight";
							self.dataStoredArray=self.commitAuthMetaDataObj[self.authType].split(",");
						}
						break;
					default:
						break;
					}
				});
			})
		},
		
		bindBottomButtons:function(){
			var self=this;
			var authType=this.authType;
			$("#sys-user-admin-page2-btn-cancel").unbind().bind('click', function () {
        self.returnFirstPage()
      });
			$("#sys-user-admin-page2-btn-confirm").unbind().bind('click', function () {
        self.returnFirstPage();
			  self.commitAuthMetaDataObj["AquaBO_menuUserRight"]=self.currentUserMenuRight;
				self.setUserMetaData(self.commitAuthMetaDataObj);
      });
		},
		
		setUserMetaData:function(commitAuthMetaDataObj){
			var user={};
			user["metadata"]={};
		  for(var i in commitAuthMetaDataObj){
				user["metadata"][i]=commitAuthMetaDataObj[i]
			}
		  var self=this;
			var currentUser=self.currentUser;
			var url = aquapaas_host + '/aquapaas/rest/users/other/' + currentUser.user_id;
			url += '?app_key=' + paasAppKey;
			url += '&timestamp=' + new Date().toISOString();
			url += '&user_id=' + my.paas.user_id;
			url += '&access_token=' + my.paas.access_token;
			var method = 'PUT';
			$.ajax({
				async: true,
				type: method,
				url: url,
				data: JSON.stringify(user),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url),
				}
			}).done(function() {
				self.updateDataInTable(commitAuthMetaDataObj);
				self.returnFirstPage()
			}).fail(function(xhr) {
			  self.updateDataInTable(commitAuthMetaDataObj);
				self.returnFirstPage();
			});
		},
		
		updateDataInTable:function(commitAuthMetaDataObj){
			var currentUser=this.currentUser;
			if(currentUser.metadata){
			}
			else{
				currentUser.metadata={}
			};
			for(var i in commitAuthMetaDataObj){
				currentUser["metadata"][i]=commitAuthMetaDataObj[i]
			}
		},
		
		getSecondPageData:function(callback){
		   var url=aquapaas_host + '/aquapaas/rest/search/general/property_values/vod?properties=provider_id';
			 url += '&app_key=' + paasAppKey;
			 url += '&timestamp=' + new Date().toISOString();
			 var method="GET";
			 jQuery.ajax({
					type: method,
					async: false,
					headers: {
						'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
					},
					url: url,
					dataType: 'json'
				}).always((resp, status, xhr) => {
					if(status == 'success') {
						callback(resp);
					}
				})
		},
		
		initSecondPage:function(){
			this.hasSecondAuthPagedEntered=true;
			var self=this;
			this.authType="AquaBO_mediaUserRight";
			var authType=this.authType;
			this.bindBottomButtons();
			this.alltreeDatasFromServer[authType]=[];
			this.alltreeDatasFromServerIncludeAll[authType]=[];
			this.dataStored=""//存储数据，不一定是显示数据
			var currentUser=self.currentUser;
			this.dataStoredArray=[];
			this.getSecondPageData(function(resp){
				resp.forEach(function(v){  
				  if(v.values){
						for(var i= 0,len = v.values.length;i<len;i++){
							self.alltreeDatasFromServer[authType].push(v.values[i].value);
						} 
					}
				});
			})
			var alltreeDatasFromServer=this.alltreeDatasFromServer[authType];
			if(currentUser.metadata&&currentUser.metadata[authType]&&(currentUser.metadata[authType]!="")){
				this.dataStored=currentUser.metadata[authType];
				this.dataStoredArray=this.dataStored.split(",")
			}
			else{//metadata里这个权限字段不存在，或者为空字符串
			  /*
					this.dataStored=this.alltreeDatasFromServer.join(",");
					for(var i= 0,len = alltreeDatasFromServer.length;i<len;i++){
						this.dataStoredArray.push(alltreeDatasFromServer[i])//没有选择表示都授权
					}
				*/
         this.dataStored="";
				 this.dataStoredArray=[]				
			}
			//初始赋值
			this.commitAuthMetaDataObj[authType]=this.dataStored;
			this.alltreeDatasFromServerIncludeAll[authType]=[i18n("SYS_USER_ALL_CHOOSE")];
			this.alltreeDatasFromServer[authType].forEach(function(v){
				self.alltreeDatasFromServerIncludeAll[authType].push(v)
     	})
			this.leftContainerId[this.authType]="sys-user-admin-page2-part2-menu2-left-table";
			this.rightContainerId[this.authType]="sys-user-admin-page2-part2-menu2-right";
		  this.displayRightBodyLeft();
			this.displayRightBodyRight();
			this.bindRightPageLeftContainer();
			this.bindRightPageRightContainer();
		},
		initThirdPage:function(){
			this.hasThirdAuthPagedEntered=true;
		  var self=this;
			this.authType="AquaBO_naviUserRight";
			var authType=this.authType;
		  this.bindBottomButtons();
			this.alltreeDatasFromServer[authType]=[];
			this.alltreeDatasFromServerIncludeAll[authType]=[];
			this.dataStored=""//存储数据，不一定是显示数据
			var currentUser=self.currentUser;
			this.dataStoredArray=[];
		  this.getThirdPageData(function(resp){
				resp.forEach(function(v){  
					var name=(v.name||"");
					self.alltreeDatasFromServer[authType].push(name);
				});
			});
			var alltreeDatasFromServer=this.alltreeDatasFromServer[authType];
			if(currentUser.metadata&&currentUser.metadata[authType]&&(currentUser.metadata[authType]!="")){
				this.dataStored=currentUser.metadata[authType];
				this.dataStoredArray=this.dataStored.split(",")
			}
			else{//metadata里这个权限字段不存在，或者为空字符串
			 /*
				this.dataStored=this.alltreeDatasFromServer.join(",");
				for(var i= 0,len = alltreeDatasFromServer.length;i<len;i++){
					this.dataStoredArray.push(alltreeDatasFromServer[i])//没有选择表示都授权
				}
				*/
				this.dataStored="";
				this.dataStoredArray=[]
			}
			//初始赋值
			this.commitAuthMetaDataObj[authType]=this.dataStored;
			this.alltreeDatasFromServerIncludeAll[authType]=[i18n("SYS_USER_ALL_CHOOSE")];
			this.alltreeDatasFromServer[authType].forEach(function(v){
				self.alltreeDatasFromServerIncludeAll[authType].push(v)
     	})
			this.leftContainerId[this.authType]="sys-user-admin-page2-part2-menu3-left-table";
			this.rightContainerId[this.authType]="sys-user-admin-page2-part2-menu3-right";
		  this.displayRightBodyLeft();
			this.displayRightBodyRight();
			this.bindRightPageLeftContainer();
			this.bindRightPageRightContainer();
		},
		getThirdPageData:function(callback){
			var url = aquapaas_host + '/aquapaas/rest/navigation/trees?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
      url =url+"&is_primary=true";
			var navigationTree=[];
			var CMSTree=[];
			var method = 'Get';
      $.ajax({
        type: method,
        url: url,
        async: false,
        dataType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
				  if(resp){
						navigationTree=resp
					};
					//callback(resp);
        }
      });
			var urlCMS=url+"&tree_class=cms_tree";
			 $.ajax({
        type: method,
        url: urlCMS,
        async: false,
        dataType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, urlCMS)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
				  if(resp){
						CMSTree=resp
					};
					
        }
      });
			navigationTree = navigationTree.concat(CMSTree);  
			callback(navigationTree);
		},
		bindRightPageLeftContainer:function(){
			var self=this;
			var leftContainerId=this.leftContainerId[this.authType];
			$("#"+leftContainerId+"").find(".sys_user_admin_checkBox").each(function(index,element){
				$(this).unbind().bind('click', function () {
					if($(this).children().css("visibility")=="hidden"){
						if(index==0){
							self.dataStoredArray=[];
							$("#"+leftContainerId+"").find(".sys_user_admin_checkBox").each(function(index){
								$(this).children().css("visibility","visible");
								if(index!=0){
								  var storedNameTemp=$(this).parent().find(".sys_user_admin_checkBox_text").attr("storedName");
									self.dataStoredArray.push(storedNameTemp);
									//右边加上元素  
									//$("#"+rightContainerId+"").append("<div class=\"user-admin-group-item\"><span storedName=\""+storedNameTemp+"\">"+storedNameTemp+"</span><div class=\"user-admin-group-del\"></div></div>");	
								}
							})
						}
						else{
							$(this).children().css("visibility","visible");
							var storedNameTemp=$(this).parent().find(".sys_user_admin_checkBox_text").attr("storedName");
							self.dataStoredArray.push(storedNameTemp);
							if(self.alltreeDatasFromServer[self.authType].length==self.dataStoredArray.length){
								$("#"+leftContainerId+"").find(".sys_user_admin_checkBox").eq(0).children().css("visibility","visible");
							}
							//右边加上元素  
							//$("#"+rightContainerId+"").append("<div class=\"user-admin-group-item\"><span storedName=\""+storedNameTemp+"\">"+storedNameTemp+"</span><div class=\"user-admin-group-del\"></div></div>");	
						}
					}
					else{
						$(this).children().css("visibility","hidden");
						if(index==0){
							$("#"+leftContainerId+"").find(".sys_user_admin_checkBox").each(function(){
								$(this).children().css("visibility","hidden")
							});
							self.dataStoredArray=[];
						}
						else{
							$("#"+leftContainerId+"").find(".sys_user_admin_checkBox").eq(0).children().css("visibility","hidden");
							var storedNameTemp=$(this).parent().find(".sys_user_admin_checkBox_text").attr("storedName");
              if($.inArray(storedNameTemp,self.dataStoredArray)!=-1){
								var index_=$.inArray(storedNameTemp,self.dataStoredArray);
								self.dataStoredArray.splice(index_,1);
								/*
								$("#"+rightContainerId+"").find(".user-admin-group-item").each(function(){
									if($(this).find("span").attr("storedName"))
								})
								*/
							}
						}
					}
					self.displayRightBodyRight();
					var sendMetadataValue=self.dataStoredArray.join(",");
					if(self.dataStoredArray.length==0){//没有选择表示都授权
						//sendMetadataValue=self.alltreeDatasFromServer.join(",");
					}
				  self.commitAuthMetaDataObj[self.authType]=sendMetadataValue;
				})
			});
			 $("#"+leftContainerId+"").parent().find(".sucai_list_search").unbind().bind('keyup', function (e) {
				var key = e.keyCode || e.which;
				if(key == 13){
					 var seachText=$(this).val();
					 var dataStoredArray=self.dataStoredArray;
					 var alltreeDatasFromServerIncludeAll=self.alltreeDatasFromServerIncludeAll[self.authType];
					 var alltreeDatasFromServerIncludeAllAfterSearch=[i18n("SYS_USER_ALL_CHOOSE")];
					 if(seachText!=""){
						 for(var i= 0,len = alltreeDatasFromServerIncludeAll.length;i<len;i++){
								if(alltreeDatasFromServerIncludeAll[i].indexOf(seachText)!=-1){
									alltreeDatasFromServerIncludeAllAfterSearch.push(alltreeDatasFromServerIncludeAll[i]);
								}
						 }
					 }
					 else{
							alltreeDatasFromServerIncludeAllAfterSearch=alltreeDatasFromServerIncludeAll
					 }
					 self.displayRightBodyLeft(alltreeDatasFromServerIncludeAllAfterSearch)
				 }
       })
			 
			$("#"+leftContainerId+"").parent().find(".sucai_list_search_botton_div").unbind().bind('click', function () {
				 var seachText=$("#"+leftContainerId+"").parent().find(".sucai_list_search").val();
				 var dataStoredArray=self.dataStoredArray;
				 var alltreeDatasFromServerIncludeAll=self.alltreeDatasFromServerIncludeAll[self.authType];
				 var alltreeDatasFromServerIncludeAllAfterSearch=[i18n("SYS_USER_ALL_CHOOSE")];
				 if(seachText!=""){
					 for(var i= 0,len = alltreeDatasFromServerIncludeAll.length;i<len;i++){
						if(alltreeDatasFromServerIncludeAll[i].indexOf(seachText)!=-1){
							alltreeDatasFromServerIncludeAllAfterSearch.push(alltreeDatasFromServerIncludeAll[i]);
						}
					}
				}
				else{
					alltreeDatasFromServerIncludeAllAfterSearch=alltreeDatasFromServerIncludeAll
				}
				self.displayRightBodyLeft(alltreeDatasFromServerIncludeAllAfterSearch)
     }) 
		},
		displayRightBodyLeft:function(alltreeDatasFromServerIncludeAllAfterSearch){
			var leftContainerId=this.leftContainerId[this.authType];
		  $("#"+leftContainerId+"_container").empty();
		  var html="";
			//html+="<div style=\"width:100%;height:100%\">";
			html+="<div style=\"width:100%;height:100%\">";
			html+="<div id=\""+leftContainerId+"_wrap_container\" class=\"sys_user_admin_table\" style=\"width:100%;height:auto\">";
			html+="<div style=\"height:42px;width:calc(100% - 2px);background-color:#1db4da;border:1px #e2e2e2 solid\">";
			html+="<input class=\"sucai_list_search\" onkeyup=\"\" placeholder=\"\" style=\"height:30px;margin-top:6px;width:231px;background:white;margin-left:14px\"/>";
			html+="<div class=\"sucai_list_search_botton_div\" style=\"background-color:#2ea2d7;left:10px;margin-top:6px;height:30px;line-height:28px\">"+i18n("SYS_USER_SEABTN")+"</div>";
			html+="<div style=\"clear: both\"></div>";
			html+="</div>";
			html+="<div id=\""+leftContainerId+"\" class=\"sys_user_admin_table\" style=\"border-right:1px solid #e2e2e2;visibility:hidden;height:auto;width:calc(100% - 2px);background-color:#fbfbfb\">";
			html+="</div>";
			html+="</div>";
			html+="</div>";
					   // $("#"+leftContainerId+"").parent().append("<div id=\""+leftContainerId+"_wrap_container\" class=\"sys_user_admin_table\" style=\"width:100%;height:auto\"></div>");

			$("#"+leftContainerId+"_container").append(html);
			var dataStoredArray=this.dataStoredArray;
			var leftContainer=document.getElementById(leftContainerId);
			var leftContainerOuter=document.getElementById(""+leftContainerId+"_container");
		  $("#"+leftContainerId+"").empty();
			var alltreeDatasFromServerIncludeAll=this.alltreeDatasFromServerIncludeAll[this.authType];
			if(alltreeDatasFromServerIncludeAllAfterSearch){
				alltreeDatasFromServerIncludeAll=alltreeDatasFromServerIncludeAllAfterSearch
			}
			var rowNum=12;
			var rowHeight=(Math.floor((leftContainerOuter.offsetHeight-rowNum*1)/rowNum));
			var defaultTrHTML="<div style=\"height:"+rowHeight+"px\"></div>";
				
			$("#"+leftContainerId+"").parent().mCustomScrollbar({
				theme:"my-theme"
			});
			
			
			if(alltreeDatasFromServerIncludeAll.length==0){
				for(var i= 0,len = rowNum;i<len;i++){
					$("#"+leftContainerId+"").append(defaultTrHTML)
				};
			}
			else{
				for(var i= 0,len = alltreeDatasFromServerIncludeAll.length;i<len;i++){
				  var checkBoxLeft=((i==0)?18:28);
					var checkBoxTextLeft=(checkBoxLeft+10+10);
					var diverse=10;
					var textMaxWidth=leftContainer.offsetWidth-2-checkBoxTextLeft-diverse;
					var checkBoxVisibility="hidden";
					if( ($.inArray(alltreeDatasFromServerIncludeAll[i],dataStoredArray)!=-1)&&(i!=0) ){
						checkBoxVisibility="visible";
					}
					else{
						checkBoxVisibility="hidden";
					}
					var checkBoxHTML="<div class=\"sys_user_admin_checkBox\" style=\"position:absolute;left:"+checkBoxLeft+"px;top:50%;margin-top:-6px\"><div class=\"sys_user_admin_checkBox_son\" style=\"visibility:"+checkBoxVisibility+"\"></div></div>";
          var checkBoxTextHTML="<div class=\"sys_user_admin_checkBox_text sys_user_admin_surplus_ellipsis\" storedName=\""+alltreeDatasFromServerIncludeAll[i]+"\" style=\"max-width:"+textMaxWidth+"px;height:"+rowHeight+"px;line-height:"+rowHeight+"px;position:absolute;left:"+checkBoxTextLeft+"px;\">"+alltreeDatasFromServerIncludeAll[i]+"</div>";
					$("#"+leftContainerId+"").append("<div style=\"height:"+rowHeight+"px\">"+checkBoxHTML+""+checkBoxTextHTML+"</div>")
				};
				if(alltreeDatasFromServerIncludeAll.length<rowNum){
					var surplus=(rowNum-alltreeDatasFromServerIncludeAll.length);
					for(var i= 0,len = surplus;i<len;i++){
						$("#"+leftContainerId+"").append(defaultTrHTML)
					};
				}
			}
			$("#"+leftContainerId+"").css("visibility","visible");
      if(this.alltreeDatasFromServer[this.authType].length==dataStoredArray.length){
				$("#"+leftContainerId+"").find(".sys_user_admin_checkBox").eq(0).children().css("visibility","visible")
			};
			this.bindRightPageLeftContainer();
		},
		bindRightPageRightContainer:function(){
		  var self=this;
		  var rightContainerId=this.rightContainerId[this.authType];
			$("#"+rightContainerId+"").find(".user-admin-group-del").each(function(){
				$(this).unbind().bind('click', function () {
					$(this).parent().css("display","none");
					var storedNameTemp=$(this).parent().find("span").attr("storedname");
					var index_=$.inArray(storedNameTemp,self.dataStoredArray);
					self.dataStoredArray.splice(index_,1);
					self.displayRightBodyLeft();
					var sendMetadataValue=self.dataStoredArray.join(",");
				  self.commitAuthMetaDataObj[self.authType]=sendMetadataValue;
				})
			})
		},
		displayRightBodyRight:function(){
		  var rightContainerId=this.rightContainerId[this.authType];
			var alltreeDatasFromServer=this.alltreeDatasFromServer[this.authType];
			var dataStoredArray=this.dataStoredArray;
			$("#"+rightContainerId+"").empty();
			for(var i= 0,len = alltreeDatasFromServer.length;i<len;i++){
			  var display_="none";
			  if($.inArray(alltreeDatasFromServer[i],dataStoredArray)!=-1){
					display_="inline-block";
				}
				else{
					display_="none";
				}
				$("#"+rightContainerId+"").append("<div style=\"display:"+display_+"\" class=\"user-admin-group-item\"><span storedName=\""+alltreeDatasFromServer[i]+"\">"+alltreeDatasFromServer[i]+"</span><div class=\"user-admin-group-del\"></div></div>")
			};
      this.bindRightPageRightContainer();
		},
		initFirstPage:function(){//第一个权限页面 
		   var nStr="";
			 var aStr="";
			 for(var i= 0,len = 82;i<len;i++){
				nStr=nStr+"n";
			  aStr=aStr+"a";
			 };
		   this.currentUserMenuRightAllNotChoose=nStr;
			 this.currentUserMenuRightAllChoose=aStr;
		   $("#sys-user-admin-page2-part2-hiddenWords").hide();
			 this.hasFirstAuthPagedEntered=true;
			 $(".tab_switch_unit").each(function(){
					$(this).removeClass("tab_switch_unit_focus")
			 })
		  $(".tab_switch_unit").eq(0).addClass("tab_switch_unit_focus");
			$("#sys-user-admin-page2-part2").children().eq(0).show();
			$("#sys-user-admin-page2-part2").children().eq(1).hide();
			$("#sys-user-admin-page2-part2").children().eq(2).hide();
			this.authType="menuAuth";
			this.bindBottomButtons();
			document.getElementById("sys-user-admin-page2-part2-menu-tree-table").innerHTML="";
			document.getElementById("sys-user-admin-page2-part2-menu-tree").innerHTML="";
			document.getElementById("sys-user-admin-page2-part2-menu-tree-right").innerHTML="";
			var zTreeObj;
			var self=this;
			this.allChooseClickBySelf="false";
			this.treeInitFinish=false;
			var currentUser=self.currentUser;
			if(currentUser&&currentUser.metadata&&currentUser.metadata.AquaBO_menuUserRight&&(currentUser.metadata.AquaBO_menuUserRight!="")){
				this.currentUserMenuRight=currentUser.metadata.AquaBO_menuUserRight;
				//权限字符串长度是会变化的
				if(this.currentUserMenuRight.length<this.currentUserMenuRightAllNotChoose.length){
				  var currentUserMenuRight=this.currentUserMenuRight;
					var diff=(self.currentUserMenuRightAllNotChoose.length-this.currentUserMenuRight.length);
					var nValue="";
					for(var i= 0,len = diff;i<len;i++){
						nValue=nValue+"n"//缺少位补n
					}
					this.currentUserMenuRight=currentUserMenuRight+nValue
				}
			}
			else{//AquaBO_menuUserRight在metadata里不存在，或者为空字符串
				this.currentUserMenuRight=self.currentUserMenuRightAllNotChoose//默认没任何权限
			}
			var minHeight=28;
			var zNodes=[{
				name: i18n("SYS_USER_ALL_CHOOSE"),
				open: true,
				menuTreeId:"all",
				children: [{
					name: i18n("SYS_USER_CHANPINGGUANLI"),
					open: true,
					height:347,
					menuTreeId:0,
					children: [{
						name: i18n("SYS_USER_JIEMU"),
						open: true,
						height:260,
						menuTreeId:1,
						children: [{
							name: i18n("SYS_USER_JIEMUHEJIEMUBAO"),
							open: true,
							height:minHeight,
							menuTreeId:2
						},{
							name: i18n("SYS_USER_OPEN_BAN"),
							open: true,
							height:minHeight,
							menuTreeId:3
						},{
							name: i18n("SYS_ASSET_SET_TAG_BY_TAG_TITLE"),
							open: true,
							height:minHeight,
							menuTreeId:4
						},{
							name: i18n("SYS_MENU_ASSET_META"),
							open: true,
							height:minHeight,
							menuTreeId:5
						},{
							name: i18n("SYS_MENU_ASSET_TAG_LIB"),
							open: true,
							height:minHeight,
							menuTreeId:6
						},{
						name: i18n("MENU_ASSET_IMPORT"),
						open: true,
						height:minHeight,
						menuTreeId:62
					},{
						name: i18n("SYS_USER_ALL_ASSET_EXPORT"),
						open: true,
						height:minHeight,
						menuTreeId:78
					},{
						name: i18n("SYS_DELETE_ASSET"),
						open: true,
						height:minHeight,
						menuTreeId:64
					},{
						name: i18n("SYS_USER_ASSET_UPDATE"),
						open: true,
						height:minHeight,
						menuTreeId:76
					}]
					},{
						name: i18n("SYS_USER_CHANNEL"),
						open: true,
						height:57,
						menuTreeId:79,
						children: [{
							name: i18n("SYS_USER_CHANNEL"),
							open: true,
							height:minHeight,
							menuTreeId:80
						},{
							name: i18n("SYS_USER_CHANNEL_META"),
							open: true,
							height:minHeight,
							menuTreeId:81
						}]
					},{
						name: i18n("SYS_USER_CHANPINGBAO"),
						open: true,
						height:minHeight,
						menuTreeId:7
					}]
				},{
					name: i18n("SYS_USER_SALE_MANAGEMENT"),
					open: true,
					height:57,
					menuTreeId:8,
					children: [{
						name: i18n("SYS_MENU_PRODUCT_OFFERING"),
						open: true,
						height:minHeight,
						menuTreeId:9
					},{
						name: i18n("SYS_USER_COUPON"),
						open: true,
						height:minHeight,
						menuTreeId:10
					}]
				},{
					name: i18n("SYS_USER_NAVIGATE_MNG"),
					open: true,
					height:261,
					menuTreeId:11,
					children: [/*{
						name: i18n("SYS_USER_NAVIGATE"),
						open: true,
						height:minHeight,
						menuTreeId:12
					}*/{
						name: i18n("SYS_PROGRAM_NAVIGATE"),//here
						open: true,
						height:116,
						menuTreeId:65,
						children: [{
							name: i18n("SYS_USER_NAVIGATE_MNG"),
							open: true,
							height:minHeight,
							menuTreeId:12,
						},{
							name: i18n("SYS_USER_NAVIGATE_AUDIT"),
							open: true,
							height:minHeight,
							menuTreeId:13,
						},{
							name: i18n("SYS_PROGRAM_BANBENFABU"),
							open: true,
							height:minHeight,
							menuTreeId:14,
						},{
							name: i18n("SYS_PROGRAM_BANBENBIANGENG"),
							open: true,
							height:minHeight,
							menuTreeId:15,
						}]
					},{
						name: i18n("SYS_AROUSEL_NAVIGATE"),
						open: true,
						height:minHeight,
						menuTreeId:63
					},{
						name: "CMS",
						open: true,
						height:116,
						menuTreeId:66,
						children: [{
							name: i18n("SYS_USER_NAVIGATE_MNG"),
							open: true,
							height:minHeight,
							menuTreeId:67
						},{
							name: i18n("SYS_USER_NAVIGATE_AUDIT"),
							open: true,
							height:minHeight,
							menuTreeId:68
						},{
							name: i18n("SYS_PROGRAM_BANBENFABU"),
							open: true,
							height:minHeight,
							menuTreeId:69
						},{
							name: i18n("SYS_PROGRAM_BANBENBIANGENG"),
							open: true,
							height:minHeight,
							menuTreeId:70
						}]
					}/*,{
						name: i18n("SYS_USER_NAVIGATE_AUDIT"),
						open: true,
						height:minHeight,
						menuTreeId:13
					},{
						name: i18n("SYS_USER_NAVIGATE_PUBLISH"),
						open: true,
						height:minHeight,
						menuTreeId:14
					},{
						name: i18n("SYS_USER_NAVIGATE_PUBLISH_MODIFY"),
						open: true,
						height:minHeight,
						menuTreeId:15
					}*/]
				},{
					name: i18n("SYS_USER_USER_MANAGEMENT"),
					open: true,
					height:86,
					menuTreeId:16,
					children: [{
						name: i18n("SYS_USER_USER"),
						open: true,
						height:minHeight,
						menuTreeId:17
					},{
						name: i18n("SYS_USERGROUP_GROUP"),
						open: true,
						height:minHeight,
						menuTreeId:18
					},{
						name: i18n("SYS_USER_USERTAG"),
						open: true,
						height:minHeight,
						menuTreeId:19
					}]
				},{
					name: i18n("SYS_USER_AUDIT_LOG"),
					open: true,
					height:317,
					menuTreeId:20,
					children: [{
						name: i18n("SYS_USER_SHOUQUAN_YU_JIANQUAN"),
						open: true,
						height:288,
						menuTreeId:21,
						children: [{
							name: i18n("SYS_USER_AUDIT_REQUEST"),
							open: true,
							height:86,
							menuTreeId:22,
							children: [{
								name: i18n("SYS_USER_AUTH_MNG_SINGLE"),
								open: true,
								height:minHeight,
								menuTreeId:23
							},{
								name: i18n("SYS_USER_AUTH_MNG_BATCH"),
								open: true,
								height:minHeight,
								menuTreeId:24
							},{
								name: i18n("SYS_USER_AUTH_INFO_STATISTIC"),
								open: true,
								height:minHeight,
								menuTreeId:25
							}]
						},{
							name: i18n("SYS_USER_CANCEL_AUTH_REQUEST"),
							open: true,
							height:57,
							menuTreeId:26,
							children: [{
								name: i18n("SYS_USER_AUTH_MNG_SINGLE"),
								open: true,
								height:minHeight,
								menuTreeId:27,
							},{
								name: i18n("SYS_USER_AUTH_MNG_BATCH"),
								open: true,
								height:minHeight,
								menuTreeId:28,
							}]
						},{
							name: i18n("SYS_USER_AUTHENTICATION_REQUEST"),
							open: true,
							height:86,
							menuTreeId:29,
							children: [{
								name: i18n("SYS_USER_AUTH_MNG_SINGLE"),
								open: true,
								height:minHeight,
								menuTreeId:30
							},{
								name: i18n("SYS_USER_AUTH_MNG_BATCH"),
								open: true,
								height:minHeight,
								menuTreeId:31
							},{
								name: i18n("SYS_AUTH_MNG_INFO_AUTHE"),
								open: true,
								height:minHeight,
								menuTreeId:32,
							}]
						},{
							name: i18n("SYS_USER_JIANQUAN_SHOUQUAN_STATISTIC"),
							open: true,
							height:minHeight,
							menuTreeId:33
						},{
							name: i18n("SYS_USER_ABNORMAL_ORDER"),
							open: true,
							height:minHeight,
							menuTreeId:77
						}]
					},{
						name: i18n("SYS_USER_RQQUEST_MONITOR"),
						height:minHeight,
						open: true,
						menuTreeId:34
					}]
				},{
					name: i18n("SYS_USER_SYS_MANAGEMENT"),
					open: true,
					height:86,
					menuTreeId:35,
					children: [{
						name: i18n("SYS_USER_APP_MANAGEMENT"),
						open: true,
						height:minHeight,
						menuTreeId:36
					},{
						name: i18n("SYS_USER_JOBMANAGE_RENWUGUANLI"),
						open: true,
						height:minHeight,
						menuTreeId:37
					},{
						name: i18n("SYS_MENU_SYS_USER"),
						open: true,
						height:minHeight,
						menuTreeId:38
					}]
				},{
					name: i18n("SYS_USER_TONGJI_FENXI"),
					open: true,
					height:260,
					menuTreeId:39,
					children: [{
						name: i18n("SYS_USER_DIANBOCHAXUN"),
						open: true,
						height:86,
						menuTreeId:40,
						children: [{
							name: i18n("SYS_USER_DANREN"),
							open: true,
							height:minHeight,
							menuTreeId:41
						},{
							name: i18n("SYS_USER_DUORENXIANGDAN"),
							open: true,
							height:minHeight,
							menuTreeId:42
						},{
							name: i18n("SYS_USER_DUORENTONGJI"),
							open: true,
							height:minHeight,
							menuTreeId:43
						}]
					},{
						name: i18n("SYS_USER_REDUFENXI"),
						open: true,
						height:minHeight,
						menuTreeId:44
					},{
						name: i18n("SYS_USER_EXPORT_MISSION"),
						open: true,
						height:minHeight,
						menuTreeId:45
					},{
						name: i18n("SYS_USER_BAOBIAO_SHEZHI"),
						open: true,
						height:minHeight,
						menuTreeId:46
					},{
						name: i18n("SYS_USER_PINDDAO_SHEZHI"),
						open: true,
						height:86,
						menuTreeId:47,
						children: [{
							name: i18n("SYS_USER_PINDDAO_SHEZHI"),
							open: true,
							height:minHeight,
							menuTreeId:48
						},{
							name: i18n("SYS_USER_PINDDAO_SHIDUAN"),
							open: true,
							height:minHeight,
							menuTreeId:49
						},{
							name: i18n("SYS_USER_LANMUSHOUSHI"),
							open: true,
							height:minHeight,
							menuTreeId:50
						}]
					}]
				},{
					name: i18n("SYS_MENU_OPERATION_ANALYZE"),
					open: true,
					height:260,
					menuTreeId:51,
					children: [{
						name: i18n("SYS_MENU_DAY_SUM"),
						open: true,
						height:minHeight,
						menuTreeId:52
					},{
						name: i18n("SYS_USER_OA_INDEX"),
						open: true,
						height:144,
						menuTreeId:53,
						children: [{
							name: i18n("SYS_USER_OA_INDEX_SUM_DAY"),
							open: true,
							height:minHeight,
							menuTreeId:54
						},{
							name: i18n("SYS_USER_OA_INDEX_TREND_HOUR"),
							open: true,
							height:minHeight,
							menuTreeId:55
						},{
							name: i18n("SYS_USER_OA_INDEX_TREND_DAY"),
							open: true,
							height:minHeight,
							menuTreeId:56
						},{
							name: i18n("SYS_USER_OA_INDEX_TREND_WEEK"),
							open: true,
							height:minHeight,
							menuTreeId:57
						},{
							name: i18n("SYS_USER_OA_INDEX_TREND_MONTH"),
							open: true,
							height:minHeight,
							menuTreeId:58
						}]
					},{
						name: i18n("SYS_USER_TRENDANALYSIS_TITLE"),
						open: true,
						height:minHeight,
						menuTreeId:59
					},{
						name: i18n("SYS_FENBUFENXI_TITlE"),
						open: true,
						height:minHeight,
						menuTreeId:60
					},{
						name: i18n("SYS_USER_USERACTION_USERACTION"),
						open: true,
						height:minHeight,
						menuTreeId:61
					}]
				},{
					name: i18n("POST_LIST_POST_ADMIN"),
					open: true,
					height:minHeight,
					menuTreeId:71,
					children: []
				},{
					name: i18n("SYS_USER_WRONG_QUERY"),
					open: true,
					height:minHeight,
					menuTreeId:72,
					children: []
				},{
					name: i18n("SYS_USER_ERROR_QUERY"),
					open: true,
					height:minHeight,
					menuTreeId:73,
					children: []
				},{
					name: i18n("SYS_USER_KNOWLEDGEMANAGEMENT"),
					open: true,
					height:minHeight,
					menuTreeId:74,
					children: []
				},{
					name: i18n("SYS_USER_SEARCH"),
					open: true,
					height:minHeight,
					menuTreeId:75,
					children: []
				}]
			}];
			var setting = {
			/*
				view:{
					showLine: true  //设置是否显示节点与节点之间的连线
				},
			*/			
			  callback: {
					beforeCheck:function(treeId, treeNode){
						if(treeNode.menuTreeId=="all"){//主动选择了all
							self.allChooseClickBySelf="true"
						}
						else{
							self.allChooseClickBySelf="false"
						}
					},
					onCheck: function(event, treeId, treeNode){
					  var currentUserMenuRight=self.currentUserMenuRight;
						if(self.treeInitFinish){//初始化tree完成
							 if(treeNode.menuTreeId!="all"){
							    if(self.allChooseClickBySelf=="true"){//点击全选，跳过一个个刷新
									}
									else{//点击了非全选项
										var menuTreeId=treeNode.menuTreeId;
										var currentUserMenuRight=self.currentUserMenuRight;
										var index_=menuTreeId;
										var leftPart=currentUserMenuRight.substring(0,index_);
										var rightPart=currentUserMenuRight.substring(index_+1,currentUserMenuRight.length);
										var content="n";
										var zTree = $.fn.zTree.getZTreeObj("sys-user-admin-page2-part2-menu-tree");
										var node = zTree.getNodeByParam("menuTreeId","all");
										if(treeNode.checked){
											content="a";
										}
										else{
											zTree.checkNode(node, false, false);
										}
										var combine=leftPart+content+rightPart;
										self.currentUserMenuRight=combine;//每次点击树时，都设置currentUserMenuRight(提交值)
										if(treeNode.checked){
											if(self.currentUserMenuRight==self.currentUserMenuRightAllChoose){
												zTree.checkNode(node, true, false);
											}
											else{
												zTree.checkNode(node, false, false);
											}
										}
										self.drawMenuAuthRightPart(zNodes[0]["children"])
									}
							 }
							 else{
									if(self.allChooseClickBySelf=="false"){//全选不是主动点的，是被联动的
										//treeNode.checked=false
									}
									else{
										if(treeNode.checked){
											self.currentUserMenuRight=self.currentUserMenuRightAllChoose
										}
										else{
											self.currentUserMenuRight=self.currentUserMenuRightAllNotChoose
										}
										self.drawMenuAuthRightPart(zNodes[0]["children"])
									}
								}
						}
						else{
						 
						};
					},
					beforeCollapse:function(event, treeId, treeNode){
						return false
					},
					onCollapse:function(event, treeId, treeNode){
						var menuTreeId=treeNode.menuTreeId;
						if(menuTreeId=="all"){
							$("#sys-user-admin-page2-part2-menu-tree-table").children().each(function(index){
								if(index!=0){
									$(this).hide()
								}
							})
						}
						else{
							var index_=menuTreeId+1;
							var childrenNum=self.calcChangedDiv(treeNode);
							var beginRowIndex=menuTreeId+1
							$("#sys-user-admin-page2-part2-menu-tree-table").children().each(function(index){
								if((index>beginRowIndex)&&(index<(beginRowIndex+childrenNum+1))){
									$(this).hide()
								}
							})
						}
					},
					onExpand:function(event, treeId, treeNode){
						var menuTreeId=treeNode.menuTreeId;
						if(menuTreeId=="all"){
							$("#sys-user-admin-page2-part2-menu-tree-table").children().each(function(index){
								if(index!=0){
									$(this).hide()
								}
							})
						}
						else{
							var index_=menuTreeId+1;
							var childrenNum=self.calcChangedDiv(treeNode)
							var beginRowIndex=menuTreeId+1
							$("#sys-user-admin-page2-part2-menu-tree-table").children().each(function(index){
								if((index>beginRowIndex)&&(index<(beginRowIndex+childrenNum+1))){
									$(this).show()
								}
							})
						}
					}
				},
				check:{
					enable: true,
					autoCheckTrigger:true,
					chkStyle:"checkbox",
					//chkboxType:{"N": "s"},
					chkboxType: { "Y" : "", "N" : "" }//一开始节点勾选是完全和读到的数据一一对应的。不存在父子任何关联。
				},
				showLine: true,  //设置是否显示节点与节点之间的连线
			};  // zTree 的参数配置，后面详解
			zTreeObj = $.fn.zTree.init($("#sys-user-admin-page2-part2-menu-tree"), setting, zNodes); //初始化zTree，三个参数一次分别是容器(zTree 的容器 className 别忘了设置为 "ztree")、参数配置、数据源
			
			/*
			var node = zTree.getNodeByParam("id","sys-user-admin-page2-part2-menu-tree_62",null);
			zTree.selectNode(node);
			zTree.checkNode(node, true, true);
			*/
			//var heightArray=[21,21,21,38,38,38,38,38,38,21,38,38,21,38,38,38,38,21,38,38,38,21,21,21,38,38,38,21,38,38,21,38,38,38,38,38,21,38,38,38,21,21,38,38,38,38,38,38,21,38,38,38,21,38,21,38,38,38,38,38,38,38,38];
			var treeRowDistance=41;
			var treeRowDistanceRemoveBottomLine=treeRowDistance-1;
			var heightArray=[treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine,treeRowDistanceRemoveBottomLine];
			
			for(var i= 0,len = self.currentUserMenuRightAllNotChoose.length;i<len;i++){
				$("#sys-user-admin-page2-part2-menu-tree-table").append("<div style=\"height:"+treeRowDistanceRemoveBottomLine+"px;width:100%;border-bottom:1px #e2e2e2 solid\"></div>")
			};
			
			/*
			for(var i= 0,len = 63;i<len;i++){
				$("#sys-user-admin-page2-part2-menu-tree-table").append("<div style=\"height:38px;width:100%;border-bottom:1px #e2e2e2 solid\"></div>")
			};
			*/
			this.checkTreeItems();
			//页面开始时勾选好后，恢复树结构的父子联动。
			var zTree = $.fn.zTree.getZTreeObj("sys-user-admin-page2-part2-menu-tree");
			zTree.setting.check.chkboxType = {"Y": "ps","N": "s"};
			this.treeInitFinish=true;
			this.drawMenuAuthRightPart(zNodes[0]["children"])//全选不用在右边显示
		},
		
		calcChangedDiv:function(treeNode){//计算折叠或展开菜单能影响的菜单
		  var childrenNum=0;
			if(treeNode&&treeNode.children){
				var childrenL2TotalNum=treeNode.children.length;
				childrenNum=childrenL2TotalNum;
				for(var i= 0,len = treeNode.children.length;i<len;i++){
					if(treeNode.children[i].children){
						var childrenL3TotalNum=(childrenNum+treeNode.children[i].children.length);
						childrenNum=childrenL3TotalNum;
						for(var j= 0,lenL3 = treeNode.children[i].children.length;j<lenL3;j++){
							if(treeNode.children[i].children[j].children){
								var childrenL4TotalNum=(childrenNum+treeNode.children[i].children[j].children.length);
								childrenNum=childrenL4TotalNum
							}
						}
					}
				}
			};
			return childrenNum
		},
		
		checkTreeItems:function(){
		  var self=this;
			var currentUserMenuRight=this.currentUserMenuRight;
			//12，13，14，15 为编排下的三个三级菜单，单独处理这四个菜单
			var fourMenuItemsBelowPragramNavigation=this.currentUserMenuRight.substring(12,16);
			var zTree = $.fn.zTree.getZTreeObj("sys-user-admin-page2-part2-menu-tree");
			var nodeAll = zTree.getNodeByParam("menuTreeId","all");
			var currentUserMenuRightAllChoose=this.currentUserMenuRightAllChoose;
			for(var i= 0,len = currentUserMenuRightAllChoose.length;i<len;i++){
				var temp=currentUserMenuRight.substring(i,i+1);
				if(temp!=""){
					switch(temp)
					{
					case "a":
						//if((i<13)||(i>15)){//"编排审核","编排发布","发布变更"先在菜单中隐藏，因为这三个菜单尽管规划有，但是目前菜单项没有入口。
							var node = zTree.getNodeByParam("menuTreeId",i,null);//here
							zTree.checkNode(node, true, true);
						//};
						break;
					case "n":
						//if((i<13)||(i>15)){ 
							var node = zTree.getNodeByParam("menuTreeId",i,null);
							zTree.checkNode(node, false, true);
						//};
						break;
					default:
						break;
					}
				}
				else{
					var node = zTree.getNodeByParam("menuTreeId",i,null);
					zTree.checkNode(node, false, true);
				}
			};
			if(currentUserMenuRight==self.currentUserMenuRightAllChoose){
				zTree.checkNode(nodeAll, true, false);
			}
			else{
				zTree.checkNode(nodeAll, false, false);
			};
			for(var i= 12,len = 16;i<len;i++){
				var temp=fourMenuItemsBelowPragramNavigation[i-12];
				if(temp!=""){
				switch(temp)
				{
				case "a":
					//if((i<13)||(i>15)){//"编排审核","编排发布","发布变更"先在菜单中隐藏，因为这三个菜单尽管规划有，但是目前菜单项没有入口。
						var node = zTree.getNodeByParam("menuTreeId",i,null);//here
						zTree.checkNode(node, true, true);
					//};
					break;
				case "n":
					//if((i<13)||(i>15)){ 
						var node = zTree.getNodeByParam("menuTreeId",i,null);
						zTree.checkNode(node, false, true);
					//};
					break;
				default:
					break;
				}
			}
		 }
		},
		
		drawMenuAuthRightPart:function(zNodesChildren){
			var currentUserMenuRight=this.currentUserMenuRight;
			var container=document.getElementById("sys-user-admin-page2-part2-menu-tree-right");
			container.innerHTML="";
			for(var i= 0,len = zNodesChildren.length;i<len;i++) {
				var row = document.createElement("div");
				row.style.cssText="height:auto;width:auto;min-width:720px;border-bottom:2px #e2e2e2 solid";
				container.appendChild(row);
				var height=zNodesChildren[i].height;
				var menuTreeId=zNodesChildren[i].menuTreeId;
				var menuL1 = document.createElement("div");
				if(currentUserMenuRight.substring(menuTreeId,menuTreeId+1)=="a"){
					menuL1.className = "menu_right_auth_div"
				}
				else{
					menuL1.className = "menu_right_auth_div_gray"
				}
				
				menuL1.style.cssText="height:"+height+"px;line-height:"+height+"px;;vertical-align:top";
				menuL1.innerHTML=zNodesChildren[i].name;
				row.appendChild(menuL1);
				if(zNodesChildren[i].children){
					var rowL2 = document.createElement("div");
					rowL2.style.cssText="height:auto;width:auto;display:inline-block;vertical-align:top";
					row.appendChild(rowL2);
					
					for(var j= 0,lenL2 = zNodesChildren[i].children.length;j<lenL2;j++){
					  var childrenL2=zNodesChildren[i].children[j];
						var menuL2Container=document.createElement("div");
						menuL2Container.className = "menu_l2_container";
						menuL2Container.style.cssText="width:auto;height:auto";
						rowL2.appendChild(menuL2Container);
						var menuL2 = document.createElement("div");
						var menuTreeIdL2=childrenL2.menuTreeId;
						if(currentUserMenuRight.substring(menuTreeIdL2,menuTreeIdL2+1)=="a"){
							menuL2.className = "menu_right_auth_div_l2";
							menuL1.className = "menu_right_auth_div"
						}
						else{
							menuL2.className = "menu_right_auth_div_l2_gray"
						}
						var heightL2=zNodesChildren[i].children[j].height;
						var commonStyle="display:inline-block;vertical-align:top;height:"+heightL2+"px;line-height:"+heightL2+"px;";
						if(j!=lenL2-1){
							menuL2.style.cssText="border-bottom:1px #e2e2e2 solid;"+commonStyle+"";
						}
						else{
							menuL2.style.cssText=commonStyle;
						};
						menuL2.innerHTML=zNodesChildren[i].children[j].name;
						menuL2Container.appendChild(menuL2);
						
						if(zNodesChildren[i].children[j].children){
					
						  var childrenL3=zNodesChildren[i].children[j].children;
							var rowL3 = document.createElement("div");
							rowL3.style.cssText="height:auto;width:auto;display:inline-block;vertical-align:top";
							menuL2Container.appendChild(rowL3);
							
							for(var k= 0,lenL3 = childrenL3.length;k<lenL3;k++){
								var menuL3Container=document.createElement("div");
								menuL3Container.className = "menu_l3_container";
								menuL3Container.style.cssText="width:auto;height:auto";
								rowL3.appendChild(menuL3Container);
								var menuL3 = document.createElement("div");
								var menuTreeIdL3=childrenL3[k].menuTreeId;
								if(currentUserMenuRight.substring(menuTreeIdL3,menuTreeIdL3+1)=="a"){
									menuL3.className = "menu_right_auth_div_l2";
									//3级菜单一选中，就触发二级菜单变亮(因为二级菜单的a或n位置可能在三级菜单后面)
									menuL2.className = "menu_right_auth_div_l2"
								}
								else{
									menuL3.className = "menu_right_auth_div_l2_gray"
								}
								var heightL3=childrenL3[k].height;
								var commonStyle="display:inline-block;vertical-align:top;height:"+heightL3+"px;line-height:"+heightL3+"px;";
								if(k!=lenL3-1){
									menuL3.style.cssText="border-bottom:1px #e2e2e2 solid;"+commonStyle+"";
								}
								else{
									menuL3.style.cssText=commonStyle;
								};
								menuL3.innerHTML=childrenL3[k].name;
								menuL3Container.appendChild(menuL3);
								if(childrenL3[k].children){
									var childrenL4=childrenL3[k].children;
									var rowL4 = document.createElement("div");
							    rowL4.style.cssText="height:auto;width:auto;display:inline-block;vertical-align:top";
									menuL3Container.appendChild(rowL4);
									
									for(var L= 0,lenL4 = childrenL4.length;L<lenL4;L++){
										var menuL4Container=document.createElement("div");
										menuL4Container.className = "menu_l4_container";
										menuL4Container.style.cssText="width:auto;height:auto";
										rowL4.appendChild(menuL4Container);
										var menuL4 = document.createElement("div");
										var menuTreeIdL4=childrenL4[L].menuTreeId;
										if(currentUserMenuRight.substring(menuTreeIdL4,menuTreeIdL4+1)=="a"){
											menuL4.className = "menu_right_auth_div_l2";
											menuL3.className = "menu_right_auth_div_l2";
										}
										else{
											menuL4.className = "menu_right_auth_div_l2_gray"
										}
										var heightL4=childrenL4[L].height;
										var commonStyle="display:inline-block;vertical-align:top;height:"+heightL4+"px;line-height:"+heightL4+"px;";
										if(L!=lenL4-1){
											menuL4.style.cssText="border-bottom:1px #e2e2e2 solid;"+commonStyle+"";
										}
										else{
											menuL4.style.cssText=commonStyle;
										};
											
										menuL4.innerHTML=childrenL4[L].name;
										menuL4Container.appendChild(menuL4);
										
											
									}
								
							}
								
	
						}
					};
			   
					
					
				}
			}
     }
			/*
		  var zNodesChildrenArray=[];
			for(var i in zNodesChildren){
				zNodesChildrenArray.push(zNodesChildrenArray);
			}
			*/
		},

    handleEvents: function(){
      var self = this;
      $('#sys-user-admin-user-list').on('click', '.opr-default', function(){
        var opr = $(this);
        if(opr.parents('.opr-more').length > 0){
          var $more = opr.parents('.opr-more');
          if($more.hasClass('opr-more-open')){
            $more.removeClass('opr-more-open');
          } else {
            $('.opr-more-open').removeClass('opr-more-open');
            $more.addClass('opr-more-open');
          }
        }
        var type = opr.attr('data-opr');
        var index = opr.parents('.oprs-all').attr('data-index');
        var user = self.listData[index];
				self.currentUser=user;
        switch(type){
        case 'edit':
          self.openUserDialog('edit', user);
          break;
        case 'delete':
          self.showDelDialog(user);
          break;
			  case 'audit':
					$("#sys-user-admin-page1-part1,#sys-user-admin-page1-part2").hide();
					$("#sys-user-admin-page2-part1,#sys-user-admin-page2-part2").show();
					self.goToAuthPage();
					//user
          break;
				 case 'resetPassword':
				  self.openUserDialogPassord(user);
				 break;
        default:
          break;
        }
      });
      $('#user-admin-list-search').on('keydown', function(e){
        if(e.keyCode == 13){
          self.listSearch();
        }
      }).siblings('.user-admin-search-icon').on('click', function(){
        self.listSearch();
      });
      $('#user-admin-user-add').on('click', function(){
        self.openUserDialog('add', {});
      });
    },
    
		returnFirstPage:function(){
		  this.hasFirstAuthPagedEntered=false;
			this.hasSecondAuthPagedEntered=false;
			this.hasThirdAuthPagedEntered=false;
			$("#sys-user-admin-page2-bottom").hide();
			$("#sys-user-admin-page1-part1,#sys-user-admin-page1-part2").show();
			$("#sys-user-admin-page2-part1,#sys-user-admin-page2-part2").hide();
		},
		
    handleDropdowns: function(target, delegate){
      var self = this;
      if(self.listCnt != $('#user-admin-index')[0]){
        window.dropdownHelper.removeDropdownHandler(self);
      } else {
        if($(target).parents('.opr-more').length > 0){

        } else {
          $('.opr-more').removeClass('opr-more-open');
        }
      }
    },

    setList: function(){
      var self = this;
      self.list = new StyledList({
        async: true,
        rows: 15,
        columns: 9,
        containerId: 'sys-user-admin-user-list',
        listType: 1,
        titles: [
          {label: i18n("SYS_USER_USER_NAME")},
          {label: i18n("SYS_USER_NICK_NAME")},
          {label: i18n("SYS_USER_UPDATE_TIME")},
          {label: i18n("SYS_USER_TELEPHONE_NO")},
          {label: i18n("SYS_USER_OPER")}
        ],
        styles: {
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 31,
          titleBg: 'rgb(69,209,244)',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: 'rgb(245,253,255)',
          cellColor: 'rgb(121,121,121)',
          cellHeight: 34,
          footBg: 'white',
          footColor: 'rgb(121,121,121)',
          iconColor: 'rgb(0,153,203)',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          columnsWidth: [0.156, 0.154, 0.25, 0.169, 0.266],
        },
        data: []
      });

      self.list.getPageData = function(pageNumber, gotData){
			  var domainid=self.domainId;
        var start = (pageNumber - 1) * 15;
        var end = pageNumber * 15 - 1;
        var url = aquapaas_host + '/aquapaas/rest/users/cdmi_query';
        url += '?start=' + start;
        url += '&end=' + end;
        url += '&user_id=' + my.paas.user_id;
        url += '&access_token=' + my.paas.access_token;
        url += '&app_key=' + paasAppKey;
        url += '&timestamp=' + new Date().toISOString();
				
				//boss domainid:
				//domainid="stq_boss";
				//domainid="000059370018B281026CCB478A166A47A48B097602B6A1F335";//aqua域
				
        var scopeObj = {
					"user_scope_specification": [{
						"domainId": "== "+domainid+""
						}
					]
				}
				if(self.searchText){
				/*
					 var scopeObj = {
						"user_scope_specification": [{
							"domainId": "== "+domainid+"",//mail:2019.6.18 10:28 在==后加上空格
							"nick_name": "contains " + self.searchText
							}
						]
					}*/
				  
						var url = aquapaas_host + '/aquapaas/rest/users/user';
						url += '?start=' + start;
						url += '&end=' + end;
						url += '&nick_name=' + self.searchText;
						url += '&sort_orders=nick_name:1';
						var searchDomain="default";//目前系统用户管理中的用户，是default domain的。
			      url += '&domain='+searchDomain+'';
						url += '&app_key=' + paasAppKey;
						url += '&timestamp=' + new Date().toISOString();
						var method = 'GET';
						$.ajax({
							url: url,
							async: true,
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
								'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
							},
							dataType: 'json',
						}).done(function(data, text, xhr) {
							var users = data;
							self.list.onTotalCount(xhr.getResponseHeader('x-aqua-total-count'));
							self.listData = users;
							gotData(self.formListData(users));
						}).fail(function(xhr) {
							self.list.onTotalCount(0);
							self.listData = [];
							gotData([]);
						});

						return;
					
        }
				
				/*
				 var scopeObj = {
				 }
			  */
				
				 /*
					"user_scope_specification": [{
					"user_type":"== 5"
					}]
					*/
				//};
        // if(self.searchText){
          // scopeObj.user_scope_specification = [{
            // nick_name: 'contains ' + self.searchText
          // }];
        // }

        $.ajax({
          type: 'PUT',
          url: url,
          async: true,
          data: JSON.stringify(scopeObj),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url),
						'x-third-party': 'default'
          }
        }).done(function(data){
          var users = data.users;
          self.list.onTotalCount(data.count);
          self.listData = users;
          gotData(self.formListData(users));
        }).fail(function(xhr){
          self.list.onTotalCount(0);
          self.listData = [];
          gotData([]);
        });
      };

      self.list.create();
    },

    formListData: function(users){
      var formData = users.map(function(user, i){
        var ops = '<div class="oprs-all" data-index="' + i + '">';
        ops += '<div class="opr-default" data-opr="edit" style="margin:0 20px">'+i18n("SYS_USER_EDIT")+'</div>';
        ops += '<div class="opr-default" data-opr="audit" style="margin:0 20px">'+i18n("SYS_USER_AUDIT")+'</div>';
        // ops += '<div class="opr-disabled">用户标签</div>';
				ops += '<div class="opr-default" data-opr="resetPassword" style="margin:0 18px">'+i18n("SYS_USER_RESET_PASSWORD")+'</div>';
        ops += '<div class="opr-default" data-opr="delete" style="margin:0 20px">'+i18n("SYS_USER_DELETE")+'</div>';
        //
        ops += '</div>';

        var rowData = [
			{
			  label: (typeof user.user_name!="undefined"&&(user.user_name!=""))?getTitledSpan(parseStr(user.user_name)):""
			}, {
			  label: (typeof user.nick_name!="undefined"&&(user.nick_name!=""))?getTitledSpan(parseStr(user.nick_name)):""
			}, {
			  label: (typeof user.updateTime!="undefined"&&(user.updateTime!=""))?timestampToStr(user.updateTime):""
			}, {
			  label: (typeof user.mobile!="undefined"&&(user.mobile!=""))?parseStr(user.mobile):""
			}, {
			  label: ops
			}
        ];
        return rowData;
      });

      return formData;
    },

    listSearch: function(){
      this.searchText = $('#user-admin-list-search').val();
      this.list.update();
    },
		
		openUserDialogPassord: function(user){
		 var htmlUrl="content/sys_user_admin/user-dialog-reset_password.html";
      var self = this;
      var dialog = new PopupDialog({
        width: 438,
        height: 272,
        url: htmlUrl,
        context: {},
        callback: function(){
            $('#user-admin-user-dialog-title').text(i18n("SYS_USER_RESET_PASSWORD"));
            $('#user-admin-dialog-cancel').show();
            $('#user-admin-dialog-submit').html('确&nbsp;&nbsp;定')
              .on('click', function(){
                if($('#user-admin-user-pwd2').val()==""){
									showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_PASSWORD"));
								}
								else if ($('#user-admin-user-pwd-check-new').val()==""){
									showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_CONFIRM_PASSWORD"));
								}
								else if($('#user-admin-user-pwd2').val()!=$('#user-admin-user-pwd-check-new').val()){
									showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_PASSWORD_DIFF2"))
								}
								else{
									self.resetUserPassword(user.user_name,$('#user-admin-user-pwd2').val());
									dialog.close();
								}
              });
          }
      });
      dialog.open();
    },
		

    openUserDialog: function(uiType, user){
		 var htmlUrl="content/sys_user_admin/user-dialog.html";
		 var htmlHeight=332;  
		 switch(uiType){
				case 'add':
					htmlUrl="content/sys_user_admin/user-dialog.html";
					htmlHeight=332; 
					break;
				case 'edit':
					htmlUrl="content/sys_user_admin/user-dialog-edit.html";
					htmlHeight=274
				 default:
          break;
			};
      var self = this;
      var dialog = new PopupDialog({
        width: 700,
        height: htmlHeight,
        url: htmlUrl,
        context: {},
        callback: function(){
          switch(uiType){
          case 'add':
            $('#user-admin-user-dialog-title').text(i18n("SYS_USER_ADDUSER"));
            $('#user-admin-dialog-cancel').show();
            $('#user-admin-dialog-submit').html(i18n("SYS_USER_ADD"))
              .on('click', function(){
							  var selfAddUser=self.addUser(user, dialog);
                if(selfAddUser){
								  if(selfAddUser=="confirm"){
									}
								  else{
										self.list.refreshList();
										dialog.close();
									}
                } else {
                  showMsgDialogOneButton(i18n("SYS_USER_ADD_USER_FAIL"));
                }
              });
            break;
          case 'edit':
            user = JSON.parse(JSON.stringify(user));
            $('#user-admin-user-dialog-title').text(i18n("SYS_USER_EDIT_USER"));
            $('#user-admin-user-name').val(user.user_name).attr("readonly", "readonly").css("background-color","#e0e0e0");
						self.oldPasswordWhenOpenEditDialog="******";//mail:20190416 10:26
						/*
						$("#user-admin-user-pwd").val(self.oldPasswordWhenOpenEditDialog);
						$("#user-admin-user-pwd-check").val(self.oldPasswordWhenOpenEditDialog);
						*/
            $('#user-admin-user-nickname').val(user.nick_name);
            $('#user-admin-user-mobile').val(user.mobile);
						/*
						$("#user-admin-user-pwd").focus(function(){
							$(this).val(""); 
						});
						*/
						$("#user-admin-user-pwd-check").focus(function(){
							$(this).val(""); 
						});
						
            $('#user-admin-dialog-cancel').show();
            $('#user-admin-dialog-submit').html(i18n("SYS_USER_UPDATE"))
              .on('click', function(){
                if(self.updateUser(user, dialog)){
                  self.list.refreshList();
                  dialog.close();
                } else {
                  showMsgDialogOneButton(i18n("SYS_USER_UPDATE_USER_FAIL"));
                }
              });
            break;
          }
        }
      });
      dialog.open();
    },

    addUser: function(user, dialog){
		  var self=this;
      var ret = false;
      var user_name = $('#user-admin-user-name').val();
      if(user_name==""){
        showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_USERNAME"));
        return "confirm";
      }
			else if($('#user-admin-user-pwd').val()==""){
        showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_PASSWORD"));
        return "confirm";
      }
			else if($('#user-admin-user-pwd-check').val()==""){
        showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_CONFIRM_PASSWORD"));
        return "confirm";
      }
			else if($('#user-admin-user-pwd').val()!=$('#user-admin-user-pwd-check').val()){
        showMsgDialogOneButton(i18n("SYS_USER_CONFIRM_INPUT_PASSWORD_DIFF"));
        return "confirm";
      }
			else{}
      if(this.checkUser(user_name)){
        showMsgDialogOneButton(i18n("SYS_USER_USER_EXIST"));
        return false;
      }

      var pwd = $('#user-admin-user-pwd').val();
      var pwdCheck = $('#user-admin-user-pwd-check').val();
      if(pwd != pwdCheck){
        showMsgDialogOneButton(i18n("SYS_USER_PASSWORD_CONFIRM"));
        return false;
      }

      var nickname = $('#user-admin-user-nickname').val();
      var mobile = $('#user-admin-user-mobile').val();

      user.user_name = user_name;
      user.nick_name = nickname;
      user.mobile = mobile;
      if(user.metadata == null){
        user.metadata = {};
      }

      // if(pwd != ''){
        // user.password = pwd;
      // }

      var url = aquapaas_host + '/aquapaas/rest/users/user';
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var method = 'POST';
      $.ajax({
        async: false,
        type: method,
        url: url,
        data: JSON.stringify(user),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(){
        ret = true;
				//用户信息上传好了，接下去提交用户密码
				self.resetUserPassword(user_name,pwd);
      });

      return ret;
    },
		
		resetUserPassword:function(userName,inputPassword){
			var self=this;
			var user_name=encodeURIComponent(userName);
		  var AquaPassData={
				 "password" : inputPassword
		  };
			var url_update_user = aquapaas_host+ "/aquapaas/rest" + "/users/password/"+user_name+"@"+"default"+"?user_id="+my.paas.user_id+"&access_token=" + my.paas.access_token+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString();
			$.ajax({
					type: 'PUT',
					async: false,
					url: url_update_user,
					data:JSON.stringify(AquaPassData),
					headers: {
							'Content-Type': 'application/json',
							'Authorization': 'application/json',
							//'x-third-party': 'aqua',//mail:20190606 17:19
							'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url_update_user)
					}
			}).always(function(){
			});
		},

    checkUser: function(name){
      var url = aquapaas_host + '/aquapaas/rest/users/user_name/' + name + '@' + "default";
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var ret = false;
      $.ajax({
        url: url,
        type: 'GET',
        async: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        }
      }).done(function(){
        ret = true;
      });
      return ret;
    },

    updateUser: function(user, dialog){
		  var self = this;
      var ret = false;
      var nickname = $('#user-admin-user-nickname').val();
      var mobile = $('#user-admin-user-mobile').val();
      var user_name= $('#user-admin-user-name').val();  
			var pwd=$('#user-admin-user-pwd').val();  
      user.nick_name = nickname;
      user.mobile = mobile;
      if(user.metadata == null){
        user.metadata = {};
      }
      var access_token=my.paas.access_token;
      if(access_token){
        var url = aquapaas_host + '/aquapaas/rest/users/other/' + user.user_id;
        url += '?app_key=' + paasAppKey;
        url += '&timestamp=' + new Date().toISOString();
        url += '&user_id=' + my.paas.user_id;
        url += '&access_token=' + my.paas.access_token;
        var method = 'PUT';
        $.ajax({
          async: false,
          type: method,
          url: url,
          data: JSON.stringify(user),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-aqua-sign': getPaaS_x_aqua_sign(method, url),
          }
        }).done(function() {
          ret = true;
        }).fail(function(xhr) {
          if (xhr.status == 200) {
            ret = true;
          }
        });
      }
			//用户信息上传好了，接下去提交用户密码
			//self.resetUserPassword(user_name,pwd);
      return ret;

    },

    showDelDialog: function(user){
      var self = this;
      showMsgDialog('您确认要删除“' + parseStr(user.user_name) + '”吗？', function(){
        self.deleteUser(user);
      });
    },

    deleteUser: function(user){
      var self = this;
			var access_token=my.paas.access_token;
      if(access_token){
        var url = aquapaas_host + '/aquapaas/rest/users/other/' + user.user_id;
        url += '?app_key=' + paasAppKey;
        url += '&timestamp=' + new Date().toISOString();
        url += '&user_id=' + my.paas.user_id;
        url += '&access_token=' + my.paas.access_token;
        var method = 'DELETE';
        $.ajax({
          url: url,
          type: method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-aqua-sign': getPaaS_x_aqua_sign(method, url),
          }
        }).done(function() {
          self.list.refreshList();
        }).fail(function() {
          showMsgDialogOneButton(i18n("SYS_USER_DELETE_USER_FAIL"));
        });
      } else {
        showMsgDialogOneButton(i18n("SYS_USER_DELETE_USER_FAIL"));
      }

    },

  };

  userList.init();

  return userList;
})(jQuery);