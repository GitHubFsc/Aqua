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

  function getUserMetaList(user){
    var meta = user.metadata || {};
    var metalist = [];
    for(var i in meta){
      if(meta.hasOwnProperty(i)){
        metalist.push({
          key: i,
          value: meta[i]
        });
      }
    }
    var rows = Math.max(metalist.length, 4);
    var $table = $('<table>').attr('cellspacing', '1').attr('cellpadding', '0')
      .addClass('user-admin-metalist');
    $table.append(
      '<thead><tr><td>字段名</td><td>字段值</td></tr></thead>'
    );
    var $tbody = $('<tbody>').appendTo($table);
    for(var n = 0; n < rows; n+=1){
      var kv = metalist[n];
      if(kv){
        $('<tr>').append(
          $('<td>').append(kv.key)
        ).append(
          $('<td>').append(kv.value)
        ).appendTo($tbody);
      } else {
        $('<tr><td></td><td></td></tr>').appendTo($tbody);
      }
    }
    return $table;
  }

  function getUserMetaInput(index, meta){
    var $row = $('<div>').addClass('user-admin-meta-row');
    $row.append(
      $('<label>').addClass('user-admin-meta-index').append(index)
    );
    $row.append(
      $('<input>').addClass('user-admin-meta-key').attr('placeholder', '在此填写字段名')
        .val(meta && meta.key)

    );
    $row.append(
      $('<input>').addClass('user-admin-meta-value').attr('placeholder', '在此填写字段值')
        .val(meta && meta.value)
    );
    return $row;
  }

  function showMsgDialog(msg, callback){
      var dialog = new OverlayDialog({
        url: 'content/userAdmin/msg-dialog.html',
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

  var DomainIdVName = {};
  var DomainNameVId = {};
  function getDomainNameById(id){
    if(DomainIdVName[id]){
      return DomainIdVName[id];
    } else {
      var url = aquapaas_host + '/aquapaas/rest/domains/' + id;
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
        DomainIdVName[id] = data.name;
        DomainNameVId[data.name] = id;
      });
      return parseStr(DomainIdVName[id]);
    }
  }
  function getDomainIdByName(name){
    if(DomainNameVId[name]){
      return DomainNameVId[name];
    } else {
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
        DomainNameVId[name] = data.id;
        DomainIdVName[data.id] = name;
      });
      return parseStr(DomainNameVId[name]);
    }
  }

  function getTitledSpan(str){
    return $('<span>').append(str).attr('title', str)[0].outerHTML;
  }

  function getDirectToken(user){
    var access_token = '';
    var url = aquapaas_host + '/aquapaas/rest/users/access_token/direct/' + user.user_name;
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();

    $.ajax({
      async: false,
      type: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url),
        'x-third-party': getDomainNameById(user.domainId)
      }
    }).done(function(data) {
      access_token = data.access_token;
    });
    return access_token;

  }

  var userPoint = {
    init: function(user){
      var self = this;
      self.user = user;
      $.get('content/userAdmin/point.html', function(html){
        var $point = $(html).appendTo($('#userAdmin-user-admin-root')).ready(function(){
          $('#student_points_page_back').on('click', function(){
            $point.remove();
          });
          $('#student_points_of_student').text(parseStr(user.nick_name) + i18n('MNG_STU_POINTS_SUFFIX'));
          $('#student_points_of_admin_add').on('click', function(){
            self.addPoint();
          });
          self.updateBalance();
          self.listHistory();
        });
      });
    },

    addPoint: function(){
      var self = this;

      var dialog = new PopupDialog({
        url: 'content/userAdmin/user-point-add.html',
        width: 390,
        height: 200,
        context: {},
        callback: function() {
          var actions = [];
          var lsturl = aquapaas_host + '/aquapaas/rest/action/list';
          lsturl += '?app_key=' + paasAppKey;
          lsturl += '&timestamp=' + new Date().toISOString();
          lsturl += '&user_id=' + my.paas.user_id;
          lsturl += '&access_token=' + my.paas.access_token;
          $.ajax({
            type: 'GET',
            async: false,
            url: lsturl,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-aqua-sign': getPaaS_x_aqua_sign('GET', lsturl),
            }
          }).done(function(data) {
            var actionlist;
            if ($.isArray(data)) {
              actionlist = data;
            } else {
              actionlist = data && data.actions || [];
            }
            actions = actionlist.filter(function(item) {
              if (item.action_name.indexOf('ADMIN_') > -1) {
                return item;
              }
            });
          });
          var actOptions = actions.map(function(action) {
            return {
              label: action.description_templet,
              value: action.action_name
            };
          });
          var selector = new StyledSelector({
            containerId: 'student_points_of_admin_action_selector',
            styles: {
              optionHeight: 30
            },
            options: actOptions
          });
          selector.getCloseIcon = function() {
            return '<div class="stuptact-styled-selector-up-arrow"></div>';
          };
          selector.getOpenIcon = function() {
            return '<div class="stuptact-styled-selector-down-arrow"></div>';
          };
          selector.create();
          $('#student_points_of_admin_action_confirm').on('click', function() {
            var addurl = aquapaas_host + '/aquapaas/rest/action/execute';
            addurl += '?app_key=' + paasAppKey;
            addurl += '&timestamp=' + new Date().toISOString();
            addurl += '&user_id=' + my.paas.user_id;
            addurl += '&access_token=' + my.paas.access_token;
            addurl += '&target_user_name=' + self.user.user_id;
            addurl += '&action_name=' + selector.getValue();
            addurl += '&object_name=ADMIN';
            addurl += '&duration=0';
            $.ajax({
              url: addurl,
              type: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-aqua-sign': getPaaS_x_aqua_sign('GET', addurl),
              }
            }).done(function(pointData) {
              alert(i18n('MNG_STU_POINTS_ACTRET_PRE') + pointData.points_change + i18n('MNG_STU_POINTS_ACTRET_SUF'));
              self.updateBalance();
              self.list.refreshList();
              dialog.close();
            }).fail(function(){
              alert('增加积分失败！');
            });
          });
        }

      });
      dialog.open();

    },

    updateBalance: function(){
      var self = this;
      var retUrl = aquapaas_host + '/aquapaas/rest/score/' + self.user.user_id;
      retUrl += '?app_key=' + paasAppKey;
      retUrl += '&timestamp=' + new Date().toISOString();
      retUrl += '&user_id=' + my.paas.user_id;
      retUrl += '&access_token=' + my.paas.access_token;
      $.ajax({
        url: retUrl,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', retUrl)
        }
      }).done(function(score) {
        $('#student_points_of_student_balance').text(i18n('MNG_STU_POINTS_BALANCE') + score.points);
      }).fail(function(){
        $('#student_points_of_student_balance').text(i18n('MNG_STU_POINTS_BALANCE'));
      });
    },

    listHistory: function(){
      var self = this;
      var list = new StyledList({
        async: true,
        rows: 13,
        columns: 3,
        containerId: 'student_points_of_student_list',
        listType: 1,
        data: [],
        titles: [
          {label: i18n('MNG_STU_POINTS_TIMESTAMP')},
          {label: i18n('MNG_STU_POINTS_WAYS')},
          {label: i18n('MNG_STU_POINTS_CHANGES')},
        ],
        styles: {
          columnsWidth: [0.3,0.37],
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
          inputBg: 'white'
        }
      });
      list.getPageData = function(pageNumber, gotData){
        var start = (pageNumber - 1) * 13;
        var end = pageNumber * 13 - 1;
        var listUrl = aquapaas_host + '/aquapaas/rest/score/' + self.user.user_id + '/points/history';
        listUrl += '?app_key=' + paasAppKey;
        listUrl += '&timestamp=' + new Date().toISOString();
        listUrl += '&user_id=' + my.paas.user_id;
        listUrl += '&access_token=' + my.paas.access_token;
        listUrl += '&start=' + start;
        listUrl += '&end=' + end;

        $.ajax({
          url: listUrl,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-aqua-sign': getPaaS_x_aqua_sign('GET', listUrl),
          }
        }).done(function(data, status, xhr){
          var totalCount = xhr.getResponseHeader('x-aqua-total-count');
          list.onTotalCount(totalCount || 0);
          var listData = self.formPointListData(data || []);
          gotData(listData);
        }).fail(function(){
          list.onTotalCount(0);
          gotData([]);
        });
      };
      list.create();
      self.list = list;
    },

    formPointListData: function(data){
      var self = this;
      var listData = data.map(function(item, i){
        var time = uiUtil.getDateToStr(new Date(item.time));
        var number = item.number;
        var change = number;
        if(number > 0){
          change = '<span class="student_point_in_label">+' + number + '</span>';
        } else if(number < 0){
          change = '<span class="student_point_out_label">' + number + '</span>';
        }
        return [{label: time},
          {label: item.reason},
          {label: change}];
      });
      return listData;
    },

  };

  var userDevice = {
    init: function(user){
      var self = this;
      self.user = user;
      $.get('content/userAdmin/device.html', function(html){
        var $page = $(html).appendTo($('#userAdmin-user-admin-root')).ready(function(){
          $('#user_admin_device_page_back').on('click', function(){
            $page.remove();
          });
          $('#user-admin-device-title').text(parseStr(user.nick_name) + i18n('MNG_STU_EQUIP_SUFFIX'));
          $('.user-admin-option').on('click', function(){
            var $option = $(this);
            if(!$option.hasClass('user-admin-option-focus')){
              $('.user-admin-option-focus').removeClass('user-admin-option-focus');
              $option.addClass('user-admin-option-focus');
            }
            var type = $option.attr('data-type');
            switch(type){
            case 'default':
              self.setDefaultList();
              break;
            case 'thirdparty':
              self.setThirdPartyList();
              break;
            }
          }).eq(0).click();
        });
      });
    },

    setDefaultList: function(){
      var self = this;
      self.list = new StyledList({
        async: false,
        rows: 15,
        columns: 8,
        containerId: 'user-admin-user-device-list',
        listType: 0,
        titles: [
          {label: 'id'},
          {label: 'name'},
          {label: 'type'},
          {label: 'platform'},
          {label: 'model'},
          {label: 'app_key'},
          {label: 'mac'},
          {label: 'last_login_time'},
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
          columnsWidth: [0.13, 0.1, 0.11, 0.09, 0.09, 0.1, 0.14],
        },
        data: []
      });
      self.list.create();
      var url = aquapaas_host + '/aquapaas/rest/users/info/' + self.user.user_name + '@' + getDomainNameById(self.user.domainId);
      url += '?fields=devices';
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        }
      }).done(function(data){
        var devices = $.makeArray(data.devices);
        var listData = devices.map(function(item){
          return [
            {label: getTitledSpan(parseStr(item.id))},
            {label: getTitledSpan(parseStr(item.name))},
            {label: getTitledSpan(parseStr(item.type))},
            {label: getTitledSpan(parseStr(item.platform))},
            {label: getTitledSpan(parseStr(item.model))},
            {label: getTitledSpan(parseStr(item.app_key))},
            {label: getTitledSpan(parseStr(item.mac))},
            {label: new Date(item.last_login_time).toISOString().substr(0, 19) + 'Z'}
          ];
        });
        self.list.update(listData);
      });
    },

    setThirdPartyList: function(){
      var self = this;
      self.list = new StyledList({
        async: false,
        rows: 15,
        columns: 3,
        containerId: 'user-admin-user-device-list',
        listType: 0,
        titles: [
          {label: 'provider'},
          {label: 'open_id'},
          {label: 'nick_name'},
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
          columnsWidth: [0.3, 0.37],
        },
        data: []
      });
      self.list.create();
      var url = aquapaas_host + '/aquapaas/rest/users/info/' + self.user.user_name + '@' + getDomainNameById(self.user.domainId);
      url += '?fields=openIDs';
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        }
      }).done(function(data){
        var open_ids = $.makeArray(data.open_ids);
        var listData = open_ids.map(function(item){
          return [
            {label: parseStr(item.provider)},
            {label: parseStr(item.open_id)},
            {label: parseStr(item.nick_name)},
          ];
        });
        self.list.update(listData);
      });
    },

  };


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

  var userPackage = {
    init: function(user){
      var self = this;
      self.user = user;
      $.get('content/userAdmin/package.html', function(html){
        var $page = $(html).appendTo($('#userAdmin-user-admin-root')).ready(function(){
          $('#user_admin_package_page_back').on('click', function(){
            $page.remove();
          });
          $('#user-admin-package-title').text(parseStr(user.user_name) + i18n('USERPACKAGE_PACKAGE'));
          $('#user-package-admin-add').text(i18n('USERPACKAGE_ADD'));
          $('#user-package-admin-add').on('click', function(){
            self.addPackage();
          });
          self.listPackage();
        });
      });
    },
    addPackage:function(){
      var that = this;
      this.createDialog = null;
      this.createDialog = new PopupDialog({
        url: 'content/userAdmin/user-package-add.html',
        width: 800,
        height: 570,
        context:that,
        callback: function(){
          $("#exp_date_input_from").unbind("click").click(function () {
            that.showSelectCalendar("exp_date_selector");
            return false;
          });

          var hourSelect = getNormalSelector('exp_date_select_hour', getTimeSelectItems(24));
          hourSelect.create();
          var minuteSelect = getNormalSelector('exp_date_select_minute', getTimeSelectItems(60));
          minuteSelect.create();
          var secondSelect = getNormalSelector('exp_date_select_second', getTimeSelectItems(60));
          secondSelect.create();

          var selOptions = [];
          var alldata = [];
          that.getDataforSelectablePackage(function(data){
            alldata = data;
            var selOptions = [];
            if(data.length != 0){
              for(var i = 0, len = data.length; i < len; i++){
                selOptions.push({
                  value: data[i].id,
                  label: data[i].name
                });
              }
              that.leftData = selOptions;
              that.createDialog.left.update(selOptions);
            }
          });

          this.leftData = [];
          that.createDialog.left = new StyledFlowList({
            container: '#package_selectable',
            data: [],
            title: {
              label: i18n('USERPACKAGE_SELECTABLEPACKAGEIDTITLE')
            },
            minRows: 8
          });
          that.createDialog.left.create();


          //处理搜索事件
          $('#package_search_botton').click(function(){
            var selOptions = [];
            var search_name = $("#package_search_input").val();
            if(search_name){
              alldata = that.leftData.filter(function(item){
                return (item.label.indexOf(search_name) > -1)
              });
            }else{
              alldata = that.leftData;
            }
            that.createDialog.left = new StyledFlowList({
              container: '#package_selectable',
              data: alldata,
              title: {
                label: i18n('USERPACKAGE_SELECTABLEPACKAGEIDTITLE')
              },
              minRows: 8
            });
            that.createDialog.left.create();
          });

          //$('#sucai_dialog_sucaizu_selected_container').mCustomScrollbar();
          that.createDialog.right = new StyledFlowList({
            container: '#package_selected',
            data: [],
            title: {
              label: i18n('USERPACKAGE_SELECTEDPACKAGEIDTITLE')
            },
            minRows: 8
          });
          that.createDialog.right.create();
          var right_data_origin = [];
          $('#package_move_container_operation').on('click', '.operation', function(){
            var opr = $(this);
            var type = opr.attr('data-op');
            switch(type){
              case 'add':
                var sels = that.createDialog.left.getChecked();
                var retData = that.createDialog.right.getData();
                for(var i = 0,len = sels.length; i < len; i++){
                  var sels_item = sels[i];
                  if((retData.filter(function(item){return item.value == sels_item.value})).length == 0){
                    retData.push(sels_item);
                  }
                }
                that.createDialog.right.update(retData);
                break;
              case 'addall':
                var sels = that.createDialog.left.getData();
                var retData = that.createDialog.right.getData();
                for(var i = 0,len = sels.length; i < len; i++){
                  var sels_item = sels[i];
                  if((retData.filter(function(item){return item.value == sels_item.value})).length == 0){
                    retData.push(sels_item);
                  }
                }
                that.createDialog.right.update(retData);
                break;
              case 'delete':
                var dels = that.createDialog.right.getChecked();
                var data = that.createDialog.right.getData();
                var retData = [];
                for(var i = 0, len = data.length; i < len; i++){
                  var item = data[i];
                  if(dels.indexOf(item) === -1){
                    retData.push(item);
                  }
                }
                that.createDialog.right.update(retData);
                break;
              case 'deleteall':
                var retData = [];
                that.createDialog.right.update(retData);
                break;
              default:
                break;
            }
          });
          $("#package_action_confirm").click(function(){
            var expire_time =  $("#exp_date_input_from").val();
            var right_data = that.createDialog.right.getData();
            if((right_data.length == 0 ) || !expire_time){
              alert(i18n("USERPACKAGE_PLEASESETTIMESELECTPACKAGE"));
              return;
            }else{
              var resultStatus_data = []
              for(var i=0;i<right_data.length;i++){
                resultStatus_data.push(0);
              };
              $('#package_action_confirm').text(i18n('USERPACKAGE_CREATEING'));
              $('#package_action_confirm').unbind("click");
              right_data.forEach(function(item,i){
                (function(i){
                  var postData = {
                    "asset_type":"product",
                    "asset_id":item.value,
                    "user_name":that.user.user_name,
                    "order_id": "admin",
                    "expire_time":expire_time + "T" + hourSelect.getValue() + ":" + minuteSelect.getValue() + ":" + secondSelect.getValue() + "+0800"
                  };
                  that.createAuth(postData, function(){
                    resultStatus_data[i] = 1;
                    if((resultStatus_data.filter(function(item){return item == 0})).length == 0){
                      that.createDialog.close();
                      that.list.refreshList();
                    }
                  });
                })(i)
              });
            }
          });
        }
      });
      this.createDialog.open();
      function getTimeSelectItems(length){
        var length = length;
        var i = 0;
        var arr = [];
        for(i=0;i<length;i++){
          arr.push({
            label: preZero(i),
            value: preZero(i)
          });
        }
        return arr;
      }
    },
    listPackage: function(){
      var self = this;
      var list = new StyledList({
        async: true,
        rows: 15,
        columns: 5,
        containerId: 'user-admin-user-package-list',
        listType: 1,
        data: [],
        titles: [
          {label: "ticket id"},
          {label: "asset id"},
          {label: i18n('USERPACKAGE_EFF_DATE')},
          {label: i18n('USERPACKAGE_EXP_DATE')},
          {label: i18n('USERPACKAGE_USED_QUOTA')},
        ],
        styles: {
          columnsWidth: [0.1,0.1,0.3,0.3,0.2],
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 31,
          titleBg: 'rgb(69,209,244)',
          titleColor: 'white',
          cellBg: 'white',
          cellHeight: "34px",
          evenBg: 'rgb(245,253,255)',
          cellColor: 'rgb(121,121,121)',
          footBg: 'white',
          footColor: 'rgb(121,121,121)',
          iconColor: 'rgb(0,153,203)',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white'
        }
      });
      list.getPageData = function(pageNumber, gotData){
        self.getPackageList(pageNumber, function(data, count){
          list.onTotalCount(count || 0);
          var listData = self.formPackageListData(data || []);
          gotData(listData);
        })
      };
      list.create();
      self.list = list;
    },
    formPackageListData: function(data){
      var self = this;
      var listData = data.map(function(item, i){
        var time = uiUtil.getDateToStr(new Date(item.time));
        var ticketid = item["ticket_id"];
        var assetid = item["asset_id"];
        var EFF_DATE = item["effective_time"];
        var EXP_DATE = item["expire_time"];
        var USED_QUOTA = item["product_used_quota"];
        return [
          {label: ticketid},
          {label: assetid},
          {label: EFF_DATE},
          {label: EXP_DATE},
          {label: USED_QUOTA}
        ];
      });
      return listData;
    },
    getDataforSelectablePackage : function (callback){
      var that = this;
      var result = [];
      that.getSelectablePackage(function(data){
        result = data.map(function(item){
          return {
            name:item["metadata"]["ext_id"],
            id:item["metadata"]["ext_id"],
          }
        });
        callback(result);
      });
    },
    getPackageList: function(page, callback){
      var that = this;
      var result = false;
      var url = aquapaas_host + "/aquapaas/rest/ticket/tickets/product";
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      url += '&user_id=' + that.user.user_id;
      url += '&asset_type=' + "product";
      if(typeof page == 'number'){
        url = url +  "&start=" + (page - 1) * 15 + "&end=" + (page * 15 - 1);
      }
      $.ajax({
        type  : "GET",
        async :true,
        url   : url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType : "application/json",
        dataType    : "json",
        error:function(error){
          callback && callback([], 0);
        }
      }).done(function(data, status, xhr){
        result = data;
        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
        callback && callback(result, totalCount);
      });
    },
    getSelectablePackage: function(callback){
      var that = this;
      var result = false;
      var url = aquapaas_host + "/aquapaas/rest/product/products";
      url += '?enable=true'
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      $.ajax({
        type  : "GET",
        async :true,
        url   : url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType : "application/json",
        dataType    : "json",
        error:function(error){
          callback && callback([], 0);
        }
      }).done(function(data, status, xhr){
        result = data;
        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
        callback && callback(result, totalCount);
      });
    },
    createAuth: function(postData, callback){
      var that = this;
      var result = false;
      var url = aquapaas_host + "/aquapaas/rest/ticket/external";
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      $.ajax({
        type  : "POST",
        async :true,
        url   : url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType : "application/json",
        dataType    : "json",
        data: JSON.stringify(postData),
        error:function(error){
          callback && callback([]);
        }
      }).done(function(data, status, xhr){
        result = data;
        callback && callback(result);
      });
    },
    showSelectCalendar: function (calId) {
      var that = this;
      that.destroyCalendar();
      var sel_cal = new UserAdminCalendar(calId);
      sel_cal.extendOnClick = function (object) {
        var curr_date_index = -1;
        var length = sel_cal.curr_month_date_elements.length;
        for(var i = 0; i < length; i++) {
          if(sel_cal.curr_month_date_elements[i] === object) {
            curr_date_index = i;
            break;
          }
        }
        if(curr_date_index == -1) {} else {
          var year = sel_cal.helper.curr_month[0];
          var month = sel_cal.helper.curr_month[1];
          that.setDateRange(curr_date_index + 1, month, year, calId);
        }
      };
    },
    destroyCalendar: function () {
      if(jQuery("#exp_date_selector").length > 0) {
        jQuery("#exp_date_selector")[0].innerHTML = "";
      }
    },
    setDateRange: function (day, month, year, calId) {
      var that = this;
      switch(calId) {
        case "exp_date_selector":
          var from_input = document.getElementById("exp_date_input_from");
          var _month = month < 9 ? '0' + String(month + 1) : String(month + 1);
          var _day = day < 10 ? '0' + String(day) : String(day);
          var label = String(year) + "-" + _month + "-" + _day;
          from_input.value = label;
          break;
        default:
          break;
      }
      that.destroyCalendar();
    },
  }

  var userCoupon = {
    init: function(user){
      var self = this;
      self.user = user;
      self.showDialog();
    },

    showDialog: function(){
      var self = this;
      var dialog = new PopupDialog({
        url: 'content/userAdmin/user-coupon.html',
        width: 840,
        height: 476,
        context: {},
        callback: function(){
          $('#user-admin-coupon-title').text(parseStr(self.user.nick_name) + '的优惠券');
          self.setList();
          self.listCoupon();
          $('#user-admin-coupon-add').on('click', function(){
            var id = $('#user-admin-coupon-id').val();
            if(id != ''){
              self.addCoupon(id);
            }
          });
          $('#user-admin-coupon-list').on('click', '.opr-default', function(){
            var i = $(this).attr('data-index');
            var coupon = self.listData[i];
            self.deleteCoupon(coupon);
          });
        },
      });
      dialog.open();
      self.dialog = dialog;
    },

    setList: function(){
      var self = this;
      self.list = new NoPagiList({
        async: false,
        rows: 8,
        columns: 6,
        containerId: 'user-admin-coupon-list',
        listType: 0,
        titles: [
          {label: '优惠券序号'},
          {label: '优惠券信息'},
          {label: '有效期'},
          {label: '兑换时间'},
          {label: 'Ticket ID'},
          {label: '操作'},
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
          cellHeight: 33,
          footBg: 'white',
          footColor: 'rgb(121,121,121)',
          iconColor: 'rgb(0,153,203)',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          columnsWidth: [0.17, 0.21, 0.22, 0.14, 0.14],
        },
        data: []
      });
      self.list.create();
    },

    listCoupon: function(){
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/coupon/list';
      url += '?user_id=' + self.user.user_id;
      url += '&access_token=' + my.paas.access_token;
      url += '&app_key=' + paasAppKey;
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
        self.listData = $.makeArray(data);
        self.list.update(self.formListData(self.listData));
      });
    },

    formListData: function(data){
      var listData = data.map(function(item, i){
        return [{
          label: getTitledSpan(item.coupon_no)
        }, {
          label: getTitledSpan(item.coupon_id)
        }, {
          label: timestampToStr(item.expire_time).substr(0,10) + '前'
        }, {
          label: item.exchange_time != null ? timestampToStr(item.exchange_time).substr(0,10) : ''
        }, {
          label: getTitledSpan(item.ticket && item.ticket.ticket_id || '')
        }, {
          label: '<span class="'+ (item.enable ? 'opr-default' : 'opr-disabled') + '" data-index="'+ i +'">删除</span>'
        }];
      });
      return listData;
    },

    addCoupon: function(id){
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/coupon/' + id + '/assign';
      url += '?user_id=' + self.user.user_id;
      url += '&access_token=' + my.paas.access_token;
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var method = 'POST';
      $.ajax({
        url: url,
        type: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(data){
        self.listCoupon();
      }).fail(function(xhr){
        showMsgDialog(xhr.getResponseHeader('Etag'));
      });
    },

    deleteCoupon: function(coupon){
      var self = this;
      var url = aquapaas_host + '/aquapaas/rest/coupon/' + coupon.coupon_id + '/disable';
      url += '?user_id=' + my.paas.user_id;
      url += '&access_token=' + my.paas.access_token;
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var method = 'POST';
      $.ajax({
        url: url,
        type: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).done(function(data){
        self.listCoupon();
      }).fail(function(xhr){

      });
    },

  };

  var userList = {
    init: function(){
      var self = this;
      getDomainIdByName('boss');
      self.setList();
      self.handleEvents();
      window.dropdownHelper.addDropdownHandler(self);
      self.listCnt = $('#userAdmin-user-admin-index')[0];
    },

    handleEvents: function(){
      var self = this;
      $('#user-admin-user-list').on('click', '.opr-default', function(){
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
        switch(type){
        case 'point':
          userPoint.init(user);
          break;
        case 'device':
          userDevice.init(user);
          break;
          case 'package':
            userPackage.init(user);
            break;
        case 'group':
          userGroup.init(user);
          break;
        case 'user':
          userTag.init(user);
          break;
        case 'view':
          self.openUserDialog('view', user);
          break;
        case 'edit':
          self.openUserDialog('edit', user);
          break;
        case 'delete':
          self.showDelDialog(user);
          break;
        case 'coupon':
          userCoupon.init(user);
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
      $('#user-admin-user-export').on('click', function(){
        var url = aquapaas_host + '/aquapaas/rest/users/statics/report';
        url += '?domain=boss';
        window.open(url);
      });
    },

    handleDropdowns: function(target, delegate){
      var self = this;
      if(self.listCnt != $('#userAdmin-user-admin-index')[0]){
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
        containerId: 'user-admin-user-list',
        listType: 1,
        titles: [
          {label: '所属域'},
          {label: '用户名'},
          {label: 'home ID'},
          {label: '昵称'},
          {label: '更新时间'},
          {label: '手机号'},
          {label: '用户来源'},
          {label: '用户类型'},
          {label: '操作'},
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
          columnsWidth: [0.1, 0.1, 0.11, 0.09, 0.14, 0.1, 0.08, 0.08],
        },
        data: []
      });

      self.list.getPageData = function(pageNumber, gotData){
        var start = (pageNumber - 1) * 15;
        var end = pageNumber * 15 - 1;

        if(self.searchText){
          var url = aquapaas_host + '/aquapaas/rest/users/user';
          url += '?start=' + start;
          url += '&end=' + end;
          url += '&nick_name=' + self.searchText;
          url += '&sort_orders=nick_name:1';
          url += '&domain=boss';
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

        var url = aquapaas_host + '/aquapaas/rest/users/cdmi_query';
        url += '?start=' + start;
        url += '&end=' + end;
        url += '&user_id=' + my.paas.user_id;
        url += '&access_token=' + my.paas.access_token;
        url += '&app_key=' + paasAppKey;
        url += '&timestamp=' + new Date().toISOString();

        var scopeObj = {
          user_scope_specification: [{
            domainId: '== ' + getDomainIdByName('boss')
          }]
        };
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
            'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
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
        ops += '<div class="opr-default" data-opr="view">查看</div>';
        ops += '<div class="opr-default" data-opr="group">用户组</div>';
        // ops += '<div class="opr-disabled">用户标签</div>';
        ops += '<div class="opr-default" data-opr="user">用户标签</div>';
        //
        ops += '<div class="opr-more">';
        ops +=   '<div class="opr-default opr-more-default">更多<img src="images/users/more_down_arrow.png"/></div>';
        ops +=   '<div class="opr-more-detail">';
        ops +=     '<div class="opr-default opr-more-default">更多<img src="images/users/more_up_arrow.png"/></div>';
        ops +=     '<div class="opr-default" data-opr="package">用户包</div>';
        ops +=     '<div class="opr-default" data-opr="point">积分</div>';
        ops +=     '<div class="opr-default" data-opr="device">设备</div>';
        ops +=     '<div class="opr-default" data-opr="coupon">优惠券</div>';
        ops +=     '<div class="opr-default" data-opr="edit">编辑</div>';
        ops +=     '<div class="opr-default" data-opr="delete">删除</div>';
        ops +=   '</div>';
        ops += '</div>';
        //
        ops += '</div>';

        var rowData = [
        {
          label: getDomainNameById(user.domainId),
        }, {
          label: getTitledSpan(parseStr(user.user_name))
        }, {
          label: getTitledSpan(parseStr(user.homeid))
        }, {
          label: getTitledSpan(parseStr(user.nick_name))
        }, {
          label: timestampToStr(user.updateTime)
        }, {
          label: parseStr(user.mobile)
        }, {
          label: parseStr(user.metadata.source)
        }, {
          label: parseStr(user.metadata.type)
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

    openUserDialog: function(uiType, user){
      var self = this;
      var dialog = new PopupDialog({
        width: 700,
        height: 600,
        url: 'content/userAdmin/user-dialog.html',
        context: {},
        callback: function(){
          dialog.domainSelect = getNormalSelector('user-admin-user-domain-selector', [{
            label: 'boss',
            value: 'boss'
          }]);
          dialog.domainSelect.create();
          dialog.typeSelect = getNormalSelector('user-admin-user-type-selector', [{
            label: 'stb',
            value: 'stb'
          },{
            label: 'mobile',
            value: 'mobile'
          }]);
          dialog.typeSelect.create();
          dialog.metaList = getUserMetaList(user).appendTo($('#user-admin-metadata-list').empty());
          switch(uiType){
          case 'add':
            $('#user-admin-user-dialog-title').text('新增用户');
            // $('#user-admin-user-domain').val('boss');
            $('#user-admin-dialog-cancel').show();
            $('#user-admin-dialog-submit').html('新&nbsp;&nbsp;增')
              .on('click', function(){
                if(self.addUser(user, dialog)){
                  self.list.refreshList();
                  dialog.close();
                } else {
                  showMsgDialog('添加用户失败！');
                }
              });
            $('#user-admin-meta-edit').show().on('click', function(){
              self.editUserMeta(user, dialog);
            });
            break;
          case 'view':
            $('#user-admin-user-dialog-title').text('查看用户');
            dialog.domainSelect.setValue(getDomainNameById(user.domainId)).disable();
            $('#user-admin-user-name').val(user.user_name).attr('disabled', true);
            $('#user-admin-user-homeid').val(user.homeid).attr('disabled', true);
            $('#user-admin-user-nickname').val(user.nick_name).attr('disabled', true);
            $('#user-admin-user-mobile').val(user.mobile).attr('disabled', true);
            $('#user-admin-user-source').val(user.metadata.source).attr('disabled', true);
            // $('#user-admin-user-domain').val(getDomainNameById(user.domainId)).attr('disabled', true);
            $('#user-admin-user-pwd').attr('disabled', true);
            $('#user-admin-user-pwd-check').parent().children().hide();
            dialog.typeSelect.setValue(user.metadata.type).disable();
            $('#user-admin-dialog-submit').html('关&nbsp;&nbsp;闭')
              .on('click', function(){
                dialog.close();
              });
            break;
          case 'edit':
            user = JSON.parse(JSON.stringify(user));
            $('#user-admin-user-dialog-title').text('编辑用户');
            dialog.domainSelect.setValue(getDomainNameById(user.domainId)).disable();
            $('#user-admin-user-name').val(user.user_name).attr('disabled', true);
            $('#user-admin-user-homeid').val(user.homeid);
            $('#user-admin-user-nickname').val(user.nick_name);
            $('#user-admin-user-mobile').val(user.mobile);
            $('#user-admin-user-source').val(user.metadata.source);
            // $('#user-admin-user-domain').val(getDomainNameById(user.domainId)).attr('disabled', true);
            dialog.typeSelect.setValue(user.metadata.type);
            $('#user-admin-dialog-cancel').show();
            $('#user-admin-dialog-submit').html('更&nbsp;&nbsp;新')
              .on('click', function(){
                if(self.updateUser(user, dialog)){
                  self.list.refreshList();
                  dialog.close();
                } else {
                  showMsgDialog('更新用户失败！');
                }
              });
            $('#user-admin-meta-edit').show().on('click', function(){
              self.editUserMeta(user, dialog);
            });
            break;
          }
        }
      });
      dialog.open();
    },

    addUser: function(user, dialog){
      var ret = false;
      var user_name = $('#user-admin-user-name').val();

      if(!user_name){
        showMsgDialog('请输入用户名！');
        return false;
      }

      var domain = dialog.domainSelect.getValue();
      if(this.checkUser(user_name, domain)){
        showMsgDialog('该用户已存在！');
        return false;
      }

      // var pwd = $('#user-admin-user-pwd').val();
      // var pwdCheck = $('#user-admin-user-pwd-check').val();
      // if(pwd != pwdCheck){
        // showMsgDialog('您输入的密码不一致，请重新输入！');
        // return false;
      // }

      var homeid = $('#user-admin-user-homeid').val();
      var nickname = $('#user-admin-user-nickname').val();
      var mobile = $('#user-admin-user-mobile').val();
      var source = $('#user-admin-user-source').val();
      var type = dialog.typeSelect.getValue();

      user.user_name = user_name;
      user.nick_name = nickname;
      user.homeid = homeid;
      user.mobile = mobile;
      if(user.metadata == null){
        user.metadata = {};
      }
      user.metadata.source = source;
      user.metadata.type = type;

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
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url),
          'x-third-party': domain
        }
      }).done(function(){
        ret = true;
      });

      return ret;
    },

    checkUser: function(name, domain){
      var url = aquapaas_host + '/aquapaas/rest/users/user_name/' + name + '@' + domain;
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
      var ret = false;

      var homeid = $('#user-admin-user-homeid').val();
      var nickname = $('#user-admin-user-nickname').val();
      var mobile = $('#user-admin-user-mobile').val();
      var source = $('#user-admin-user-source').val();
      var type = dialog.typeSelect.getValue();

      user.nick_name = nickname;
      user.homeid = homeid;
      user.mobile = mobile;
      if(user.metadata == null){
        user.metadata = {};
      }
      user.metadata.source = source;
      user.metadata.type = type;

      var access_token = getDirectToken(user);

      if(access_token){
        var url = aquapaas_host + '/aquapaas/rest/users/user/' + user.user_id;
        url += '?app_key=' + paasAppKey;
        url += '&timestamp=' + new Date().toISOString();
        url += '&user_id=' + user.user_id;
        url += '&access_token=' + access_token;
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

      return ret;

    },

    editUserMeta: function(user, dialog){
      var overlay = new OverlayDialog({
        url: 'content/userAdmin/user-meta-edit.html',
        width: 672,
        height: 388,
        context: {},
        callback: function(){
          var metalist = [];
          var userMeta = user.metadata || {};
          for(var m in userMeta){
            if(userMeta.hasOwnProperty(m)){
              metalist.push({
                key: m,
                value: userMeta[m]
              });
            }
          }
          var rlen = Math.max(3, metalist.length);
          var frag = document.createDocumentFragment();
          for(var i = 0; i < rlen; i+=1){
            getUserMetaInput(i+1, metalist[i]).appendTo(frag);
          }
          $('<div>').addClass('user-admin-meta-add').on('click', function(){
            getUserMetaInput(i+=1).insertBefore(this);
          }).appendTo(frag);
          $('#user-admin-meta-ins').empty().append(frag);
          $('#user-admin-meta-submit').on('click', function(){
            var newMeta = {};
            $('.user-admin-meta-row').each(function(r, row){
              var $row = $(row);
              var key = $row.children('.user-admin-meta-key').val();
              if(key != ''){
                newMeta[key] = $row.children('.user-admin-meta-value').val();
              }
            });
            user.metadata = newMeta;
            dialog.metaList = getUserMetaList(user).appendTo($('#user-admin-metadata-list').empty());
            overlay.close();
          });
        }
      });
      overlay.open();
    },

    showDelDialog: function(user){
      var self = this;
      showMsgDialog('您确认要删除“' + parseStr(user.nick_name) + '”吗？', function(){
        self.deleteUser(user);
      });
    },

    deleteUser: function(user){
      var self = this;
      var access_token = getDirectToken(user);
      if(access_token){
        var url = aquapaas_host + '/aquapaas/rest/users/user/' + user.user_id;
        url += '?app_key=' + paasAppKey;
        url += '&timestamp=' + new Date().toISOString();
        url += '&user_id=' + user.user_id;
        url += '&access_token=' + access_token;
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
          showMsgDialog('删除用户失败！');
        });
      } else {
        showMsgDialog('删除用户失败！');
      }

    },

  };

  userList.init();

  return userList;
})(jQuery);
