var UserTag = (function($){
  var paasDomain = '/aquapaas/rest';
  function parseStr(para){
    return para != null ? para : '';
  }
  function showMsgDialog(msg, callback){
    var dialog = new OverlayDialog({
      url: 'content/userTag/msg-dialog.html',
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
  var UserTagList = {
    init: function(){
      var self = this;
      self.type = "usertag"
      self.token = "user_id=" + my.paas.user_id +
        "&user_type=" + my.paas.user_type +
        "&access_token=" + my.paas.access_token +
        "&app_key=" + paasAppKey +
        "&timestamp=";
      self.setList();
      self.handleEvents();
      window.dropdownHelper.addDropdownHandler(self);
      self.listCnt = $('#user-group-admin-index')[0];
    },
    handleEvents: function(){
      var self = this;
      $('#user-group-admin-user-list').on('click', '.opr-default', function(){
        var opr = $(this);
        var type = opr.attr('data-opr');
        var index = opr.parents('.oprs-all').attr('data-index');
        var user = self.listData[index];
        switch(type){
          case 'delete':
            self.showDelDialog(user);
            break;
          default:
            break;
        }
      });
      $('#user-group-admin-list-search').on('keydown', function(e){
        if(e.keyCode == 13){
          //self.listSearch();
        }
      }).siblings('.user-admin-search-icon').on('click', function(){
        //self.listSearch();
      });
      $('#user-group-admin-add').on('click', function(){
        self.openUserGroupDialog('add', {});
      });
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
        columns: 6,
        containerId: 'user-group-admin-user-list',
        listType: 1,
        titles: [
          {label: i18n('USERTAG_USERTAGNAME')},
          {label: i18n('USERGROUP_OPERATION')},
          {label: i18n('USERTAG_USERTAGNAME')},
          {label: i18n('USERGROUP_OPERATION')},
          {label: i18n('USERTAG_USERTAGNAME')},
          {label: i18n('USERGROUP_OPERATION')}
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
          columnsWidth: [0.27, 0.06, 0.27, 0.06, 0.27, 0.06],
        },
        data: []
      });

      self.list.getPageData = function(pageNumber, gotData){
        self.listTag(pageNumber, self.searchText, function(datas, count){
          count = parseInt(count);
          count = Math.ceil(count/3);
          self.list.onTotalCount(count);
          self.listData = datas;
          gotData(self.formListData(datas));
        });
      };

      self.list.create();
    },
    formListData: function(datas){
      var i = 0;
      var formData = [];
      for(i=0; i<datas.length; i= i+3){
        var rowData = [];
        var data1 = datas[i];
        var data2 = datas[i+1];
        var data3 = datas[i+2];


        rowData.push({
            label: getInput(parseStr(data1.title)),
          });
        rowData.push({
          label: getOptions(i),
        });
        if(data2){
          rowData.push({
            label: getInput(parseStr(data2.title)),
          });
          rowData.push({
            label: getOptions(i+1),
          });
        }
        if(data3){
          rowData.push({
            label: getInput(parseStr(data3.title)),
          });
          rowData.push({
            label: getOptions(i+2),
          });
        }
        formData.push(rowData);
      }
      function getOptions(i){
        var ops = '<div class="oprs-all" data-index="' + i + '">';
            ops +=     '<div class="opr-default" data-opr="delete">' + i18n("USERGROUP_DELETE") + '</div>';
            ops += '</div>';
            return ops;
      }
      function getInput(text){
        var InputString ='<div class="td_outString" title="' + text + '">' +
          '<input type="text" readonly value="' + text + '"/>' +
          '</div>';
        return InputString;
      }
      return formData;
    },
    openUserGroupDialog: function(uiType, user){
      var self = this;
      var dialog = new PopupDialog({
        width: 390,
        height: 200,
        url: 'content/userTag/user-tag-dialog.html',
        context: {},
        callback: function(){
          $("#user-group-admin-user-dialog-title").text(i18n("USERTAG_ADDUSERTAG"));
          $("#user-group-admin-dialog-submit").html(i18n("USERGROUP_QUEDING"));
          $("#user-group-admin-user-name").focus();
          $("#user-group-admin-dialog-submit").click(function(){
            var name = $("#user-group-admin-user-name").val();
            self.addTag(name, function(){
              self.list.refreshList();
              dialog.close();
            });
          });
        }
      });
      dialog.open();
    },
    showDelDialog: function(user){
      var self = this;
      showMsgDialog(i18n("USERGROUP_DELETE_CONTENT1") + parseStr(user.title) + i18n("USERGROUP_DELETE_CONTENT2"), function(){
        if(!self.deleteTag(user.title)){
          alert(i18n("USERGROUP_DELETEFAILED"));
        }else{
          self.list.refreshList();
        }
      });
    },
    listTag : function (page, searchtext, callback){
      var that = this;
      var result = false;
      var url = aquapaas_host +　paasDomain　+ "/tagdef/" + that.type + "/"　+ "?" + that.token + new Date().toISOString();
      if(typeof page == 'number'){
        url = url +  "&start=" + (page - 1) * 15 * 3 + "&end=" + (page * 15 * 3 - 1);
      }
      if(searchtext){
        url = url +  "&title=" + searchtext;
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
          if(that.addTagNameSpace()){
            console.log("初始化namespace成功");
          }else{
            console.log("初始化namespace成功");
          };
          callback && callback([], 0);
        }
      }).done(function(data, status, xhr){
        result = data;
        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
        callback && callback(result, totalCount);
      });
    },
    addTagNameSpace : function (){
      var that = this;
      var result = false;
      var data = {"title" : "用户标签库"};
      var url = aquapaas_host +　paasDomain　+ "/tagdef/" + that.type + "/"　+ "?" + that.token + new Date().toISOString();
      $.ajax({
        type: "PUT",
        async:false,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(data),
        done:function(ajaxback){
          result = true;
        },
        error:function(error){
          result = false;
        }
      });
      return result;
    },
    addTag : function (name, callback){
      var that = this;
      var result = false;
      var url = aquapaas_host +　paasDomain　　+ "/tagdef/" + that.type + "/"+ name + "?" + that.token + new Date().toISOString();
      $.ajax({
        type: "PUT",
        async: false,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType: "application/json",
        data: JSON.stringify({title: name}),
      }).done(function(data, status, xhr){
        if(xhr.status == 201 ){
          if (callback){
            callback();
          }
          result = true;
        }else if(xhr.status == 204 ){
          alert(i18n("USERGROUP_EXIT"));
        }else{
          alert(i18n("USERGROUP_CANNOTCREATE"));
        }
      });
      return result;
    },
    deleteTag : function (name, callback){
      var result = false;
      var that = this;
      var url = aquapaas_host +　paasDomain　+ "/tagdef/" + that.type + "/"+ name + "?" + that.token + new Date().toISOString();
      $.ajax({
        type : "DELETE",
        async: false,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
        },
        contentType:"application/json",
        dataType: "json",
        complete:function(ajaxback){
          if(ajaxback.status == 200 ||ajaxback.statusText ==  "OK"){
            if (callback){
              callback();
            }
            result = true;
          }
        }
      });
      return result;
    }
  };

  UserTagList.init();

  return UserTagList;
})(jQuery);
