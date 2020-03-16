var sucai = (function ($) {
  var sucai = new Object();
  //初定义
  var dmRoot = paasHost + paasDomain + '/dm';

  var adpSiteNames = {};
  var adpSites = [];
  var filterSites = [];

  sucai.initParam = function () {
    this.debug = false;
    this.token = "user_id=" + my.paas.user_id +
      "&user_type=" + my.paas.user_type +
      "&access_token=" + my.paas.access_token +
      "&app_key=" + paasAppKey +
      "&timestamp=";
    this.sucai_current_type = "img";
    this.sucai_site = "";
    this.user = {
      username: storage_username,
      password: storage_password,
      domain: storage_domain,
      img_folder: storage_images_folder,
      video_folder: storage_videos_folder,
      footprint_poster_folder: storage_footprint_poster_folder,
      //footprint_mark_folder: storage_footprint_mark_folder,
      htmltemplate_folder: storage_htmltemplate_origin_folder,
      htmltemplate_save_folder: storage_htmltemplate_save_folder,
    }
    this.aquaUtil = null;
    this.CDNtype = ((typeof CDN_SITE) == "undefined") ? false : CDN_SITE;
    this.IMG_CDNtype = ((typeof IMG_CDN_SITE) == "undefined") ? false : IMG_CDN_SITE;
    this.systemType = 0;

    this.platform_id = my.paas.platform_id;
    this.platform_current_id = my.paas.platform_current_id;

    if(window.AdvSystemType) {
      if(window.AdvSystemType == 'solo') {
        this.systemType = 0;
      } else if(window.AdvSystemType == 'central') {
        this.systemType = 1;
      } else if(window.AdvSystemType == 'local') {
        this.systemType = 2;
      } else {
        this.systemType = 0;
      }
    } else {
      this.systemType = 0;
    }
  };
  sucai.initListenEvents = function () {
    var that = this;
    if(my.paas.user_type == "1"){
      //运营商
      $("#sucai_add_class_btn").hide();
      $("#sucai_add_class_btn_user_type1").show();
    }else{
      $("#sucai_add_class_btn").show();
      $("#sucai_add_class_btn_user_type1").hide();
    }
    $('#sucai_add_class_btn').click(function () {
      that.initCreateDialog();
    });
    $('#sucai_add_class_btn_user_type1').click(function () {
      $('#sucai_add_class_btn_user_type1').toggleClass("opened");
    });
    $('#sucai_add_class_btn_user_type1').on('click', 'li', function (ev) {
      var type = $(this).data("key");
      switch (type){
        case 0://用管理员身份
          that.initCreateDialog(null, null, null, null, my.paas.user_type);
          break;
        case 1://用广告主身份
          that.showChooseUserDialog();
          break;
      }
    });

    var label = {};
    label['allstate'] = i18n('SUCAI_SUOYOUZHUANGTAI')
    label['first_audit'] = i18n('SUCAI_FIRSTAUDIT')
    if (window.SUCAI_AUDIT_LEVEL > 1) {
      label['third_audit'] = i18n('SUCAI_THIRDAUDIT')
    }
    label['deprecated'] = i18n('SUCAI_SHENHESHIBAI')
    label['enabled'] = i18n('SUCAI_YIQIYONG')
    label['disabled'] = i18n('SUCAI_JINYONG')
    label['uploading'] = i18n('SUCAI_SHANGCHUANZHONG')
    label['uploadfailed'] = i18n('SUCAI_SHANGCHUANSHIBAI')
    var header_select = new newSelect("#sucai-header-select",
      label, {
        width: 120,
        height: 36,
        background: "#f4f4f4",
        selectbackground: "#d3d3d3",
        ScrollBarHeight: "150px"
      },
      function (state) {
        switch(state) {
        case "allstate":
          state = "all";
          break;
        case "first_audit":
          state = "first_audit:prepare_audit";
          break;
        case "third_audit":
          state = "third_audit:prepare_audit";
          break;
        case "deprecated":
          state = "deprecated";
          break;
        case "enabled":
          state = "enabled";
          break;
        case "disabled":
          state = "disabled";
          break;
        case "uploading":
          state = i18n('SUCAI_SHANGCHUANZHONG');
          break;
        case "uploadfailed":
          state = i18n('SUCAI_SHANGCHUANSHIBAI');
          break;
        case "publishing":
          state = "发布中";
          break;
        case "published":
          state = "已发布";
          break;
        case "publishfailed":
          state = "发布失败";
          break;

        default:
          state = i18n('SUCAI_BUMING');
          break;
        }
        if(state != 'all' && state != i18n('SUCAI_BUMING')) {
          that.initTable(state)
        } else {
          that.initTable()
        }
      }
    );
    $("#sucai_menu_select").on('click', 'li', function (ev) {
      var type = $(this).data("type");
      $(".sucai_head_center li").removeClass('sucai_menu_selected');
      $(this).addClass('sucai_menu_selected');
      that.sucai_current_type = type;
      that.initTable();
      switch (that.sucai_current_type ){
        case "img":
          header_select.updateSelectOptions({
            allstate: i18n('SUCAI_SUOYOUZHUANGTAI'),
            first_audit: i18n('SUCAI_CHUSHEN'),
            deprecated: i18n('SUCAI_SHENHESHIBAI'),
            enabled: i18n('SUCAI_YIQIYONG'),
            disabled: i18n('SUCAI_JINYONG'),
            uploading: i18n('SUCAI_SHANGCHUANZHONG'),
            uploadfailed: i18n('SUCAI_SHANGCHUANSHIBAI')
          });
          break;
        case "video":
          header_select.updateSelectOptions({
            allstate: i18n('SUCAI_SUOYOUZHUANGTAI'),
            first_audit: i18n('SUCAI_CHUSHEN'),
            deprecated: i18n('SUCAI_SHENHESHIBAI'),
            enabled: i18n('SUCAI_YIQIYONG'),
            disabled: i18n('SUCAI_JINYONG'),
            uploading: i18n('SUCAI_SHANGCHUANZHONG'),
            uploadfailed: i18n('SUCAI_SHANGCHUANSHIBAI'),
            publishing: "发布中",
            publishfailed: "发布失败",
          });
          break;
        case "subtitle":
          header_select.updateSelectOptions({
            allstate: i18n('SUCAI_SUOYOUZHUANGTAI'),
            first_audit: i18n('SUCAI_CHUSHEN'),
            deprecated: i18n('SUCAI_SHENHESHIBAI'),
            enabled: i18n('SUCAI_YIQIYONG'),
            disabled: i18n('SUCAI_JINYONG'),
          });
          break;

      }

      if(my.paas.user_type == "1") {
        //$('#sucai_add_class_btn').unbind("click").addClass("page_button_inactive");
      }
    });

    $('#sucai_list_search').unbind("click").on('keydown', function (ev) {
      if(ev.keyCode == 13) {
        initTableAfterSearch();
      }
    });
    $('#sucai_list_search_botton').click(function () {
      initTableAfterSearch();
    });

    $('#sucai_list_search_username').unbind("click").on('keydown', function (ev) {
      if(ev.keyCode == 13) {
        initTableAfterSearchUserName();
      }
    });
    $('#sucai_list_search_username_botton').click(function () {
      initTableAfterSearchUserName();
    });

    if(my.paas.user_type == "1") {
      //$('#sucai_add_class_btn').unbind("click").addClass("page_button_inactive");
    }
    $(window).on("resize", function () {
      that.table_component.resize();
    })

    $('#sucai_content_table').on('click', '.opr', function () {
      var opr = $(this);
      if (opr.parents('.opr_more').length > 0) {
        var $more = opr.parents('.opr_more');
        if ($more.hasClass('open')) {
          $more.removeClass('open');
        } else {
          $('.opr-more-open').removeClass('open');
          $more.addClass('open');
        }
      }
      var type = opr.attr('data-type');
      var index = opr.attr('data-id');
      var item = that.table_component['_data'][index];

      switch (type) {
        case 'view':
          that.showSeeDialog(item.ad_id);
          break;
        case 'edit':
          //that.showPolicyBindingOperatingMsg({type:'aditem',mode:'update',state:item.state, value:item.ad_id }, function(){that.showReviseDialog(item.ad_id)})
          that.showReviseDialog(item.ad_id)
          break;
        case 'del':
          that.showPolicyBindingOperatingMsg({type:'aditem',mode:'delete',state:item.state,value:item.ad_id}, function(){that.showDeleteDialog(item.ad_id)})
          //that.showDeleteDialog(item.ad_id)
          break;
        case 'limit':
          that.showXianCiDialog(that.sucai_current_type, index)
          break;
        case 'more':
          break;
        case 'dist':
          that.viewDistributeSites(item.ad_id, item.name, item.site_id)
          break;
        case 'aduitHistory':
          that.viewAuditHis(item.ad_id)
          break;
        default:
          break;
      }
    });

    function initTableAfterSearch(){
      var search_text = $("#sucai_list_search").val();
      that.initTable(null, search_text, "");
    }

    function initTableAfterSearchUserName(){
      var search_text = $("#sucai_list_search_username").val();
      that.initTable(null, "", search_text);
    }
  };
  sucai.handleDropdowns = function(target, delegate){
    var container = $('#sucai_container')[0];
    if(!container || (container !== this.pickerDropAnchor)){
      window.dropdownHelper.removeDropdownHandler(this);
      return;
    } else {
      if($("#sucai_add_class_btn_user_type1").is(':hidden')){

      }else{
        if ($(target).parents('#sucai_add_class_btn_user_type1').length > 0) {
        } else {
          if( $('#sucai_add_class_btn_user_type1').hasClass("opened")){
            $('#sucai_add_class_btn_user_type1').removeClass("opened")
          }
          if (jQuery(target).parents('.opr_more').length > 0) {
          } else {
            jQuery('.opr_more').removeClass('open');
          }
        }
      }
    }
  };
  sucai.initPage = function () {
    //定义参数
    this.initParam();
    this.getSiteList();
    if(this.systemType == 1){
      this.setSiteFilter();
    }
    //定义添加最基本组件以及监听事件
    this.initListenEvents();
    //开始创建一个表格
    this.initTable();
    var pickerDropAnchor = $('#sucai_container')[0];
    this.pickerDropAnchor = pickerDropAnchor;
    if(pickerDropAnchor && window.dropdownHelper){
      window.dropdownHelper.addDropdownHandler(this);
    }
    my_aqua.init(this.user.username, this.user.password, this.user.domain);
    this.aquaUtil = new AquaUtil({
      accessKeyId: my.aqua.accessKeyId,
      secretAccessKey: my.aqua.secretAccessKey
    })
  };
  sucai.setSiteFilter = function () {
    var that = this;
    $("#sucai_site_filter").show();
    var filter = getCombiSelector({
      label: i18n('ADPOS_SITE_SELECTOR'),
      container: '#sucai_site_filter',
      channels: adpSites.map(function(site){
        return {
          label: site.name,
          site: site,
        };
      }),
      onChange: function(channels){
        filterSites = channels.map(function(channel){
          return channel.site && channel.site.id;
        });
        that.sucai_site = filterSites.join(",");
        var table = that.table_component;
        table.update();
      }
    });
    filter.create();
  };
  sucai.initTable = function (state, name, username) {
    var that = this;
    switch(that.sucai_current_type){
      case "img":
        that.createImgTable(state, name, username);
        break;
      case "video":
        that.createVideoTable(state, name, username);
        break;
      case "subtitle":
        that.createSubtitleTable(state, name, username)
        break;
    }
  };
  sucai.createImgTable = function (state, name, username) {
    var that = this;
    var title = [{
      label: i18n('SUCAI_SUCAIMINGCHEN')
    }, {
      label: i18n('SUCAI_ZHUANGTAI')
    }, {
      label: i18n('SUCAI_CHUANGJIANZHE')
    }, {
      label: i18n('SUCAI_CHICUNPX')
    }, {
      label: i18n('SUCAI_QUANZHONG')
    }, {
      label: i18n('SUCAI_YITOUFANGCISHU')
    }, {
      label: i18n('SUCAI_SHENGYUCISHU')
    }, {
      label: i18n('SUCAI_CAOZUO')
    }];
    var widths = [0.21, 0.13, 0.13, 0.09, 0.09,0.08, 0.08, 0.19];
    if(that.systemType != 0) {
      title = [{
        label: i18n('SUCAI_SITE')
      }, {
        label: i18n('SUCAI_SUCAIMINGCHEN')
      }, {
        label: i18n('SUCAI_ZHUANGTAI')
      }, {
        label: i18n('SUCAI_CHUANGJIANZHE')
      }, {
        label: i18n('SUCAI_CHICUNPX')
      }, {
        label: i18n('SUCAI_QUANZHONG')
      }, {
        label: i18n('SUCAI_YITOUFANGCISHU')
      }, {
        label: i18n('SUCAI_SHENGYUCISHU')
      }, {
        label: i18n('SUCAI_CAOZUO')
      }];
      widths = [0.07, 0.21, 0.063, 0.063, 0.083, 0.1,0.08,0.08,0.234];
    }
    that.table_component = new StyledList({
      rows: 11,
      columns: title.length,
      containerId: 'sucai_content_table',
      titles: title,
      listType: 1,
      data: [],
      styles: {
        borderColor: 'transparent',
        borderWidth: 1,
        titleHeight: 46,
        titleBg: 'rgb(93,161,192)',
        titleColor: 'white',
        cellBg: 'white',
        evenBg: 'rgb(245,245,245)',
        cellColor: 'rgb(114,114,114)',
        footBg: 'white',
        footColor: 'rgb(121,121,121)',
        iconColor: 'rgb(93,161,192)',
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: widths
      }
    });
    that.table_component.state = state;
    if(name) {
      that.table_component.name = name;
    }
    if(username) {
      that.table_component.username = username;
    }
    that.table_component.getPageData = function (page) {
      var listData__origin = that.getDataforIMGs(this.state, page, this.name, this.username);
      that.table_component.onTotalCount(listData__origin.allCount);
      this._data = listData__origin;
      var listData = that.formListDataForImg(listData__origin)
      return listData;
    };
    that.table_component.create();
  };
  sucai.createVideoTable = function (state, name, username) {
    var that = this;
    var title = [{
      label: i18n('SUCAI_SUCAIMINGCHEN')
    }, {
      label: i18n('SUCAI_ZHUANGTAI')
    }, {
      label: i18n('SUCAI_CHUANGJIANZHE')
    }, {
      label: i18n('SUCAI_CHICUNPX')
    }, {
      label: i18n('SUCAI_SHICHANGS')
    }, {
      label: i18n('SUCAI_QUANZHONG')
    }, {
      label: i18n('SUCAI_CAOZUO')
    }];
    var widths = [0.21, 0.13, 0.13, 0.13, 0.13, 0.08, 0.19];
    if(that.systemType != 0) {
      title = [{
        label: i18n('SUCAI_SITE')
      }, {
        label: i18n('SUCAI_SUCAIMINGCHEN')
      }, {
        label: i18n('SUCAI_ZHUANGTAI')
      }, {
        label: i18n('SUCAI_CHUANGJIANZHE')
      }, {
        label: i18n('SUCAI_CHICUNPX')
      }, {
        label: i18n('SUCAI_SHICHANGS')
      }, {
        label: i18n('SUCAI_QUANZHONG')
      }, {
        label: i18n('SUCAI_CAOZUO')
      }];
      widths = [0.1, 0.14, 0.11, 0.11, 0.11, 0.11, 0.08, 0.23];
    }
    that.table_component = new StyledList({
      rows: 11,
      columns: title.length,
      containerId: 'sucai_content_table',
      titles: title,
      listType: 1,
      data: [], //that.formListDataForVideo(sucai.getDataforVIDEOs()),
      styles: {
        borderColor: 'transparent',
        borderWidth: 1,
        titleHeight: 46,
        titleBg: 'rgb(93,161,192)',
        titleColor: 'white',
        cellBg: 'white',
        evenBg: 'rgb(245,245,245)',
        cellColor: 'rgb(114,114,114)',
        footBg: 'white',
        footColor: 'rgb(121,121,121)',
        iconColor: 'rgb(93,161,192)',
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: widths
      }
    });
    that.table_component.state = state;
    if(name) {
      that.table_component.name = name;
    }
    if(username) {
      that.table_component.username = username;
    }
    that.table_component.getPageData = function (page) {
      var listData__origin = that.getDataforVIDEOs(this.state, page, this.name, this.username);
      that.table_component.onTotalCount(listData__origin.allCount);
      this._data = listData__origin;
      var listData = that.formListDataForVideo(listData__origin)
      return listData;
    };
    this.table_component.create();
  };
  sucai.createSubtitleTable = function (state, name, username) {
    var that = this;
    var title = [{
      label: i18n('SUCAI_SUCAIMINGCHEN')
    }, {
      label: i18n('SUCAI_ZHUANGTAI')
    }, {
      label: i18n('SUCAI_CHUANGJIANZHE')
    }, {
      label: i18n('SUCAI_ZIMUNEIRONG')
    }, {
      label: i18n('SUCAI_CAOZUO')
    }];
    var widths = [0.21, 0.13, 0.13, 0.34, 0.19];
    if(that.systemType != 0) {
      title = [{
        label: i18n('SUCAI_SITE')
      }, {
        label: i18n('SUCAI_SUCAIMINGCHEN')
      }, {
        label: i18n('SUCAI_ZHUANGTAI')
      }, {
        label: i18n('SUCAI_CHUANGJIANZHE')
      }, {
        label: i18n('SUCAI_ZIMUNEIRONG')
      }, {
        label: i18n('SUCAI_CAOZUO')
      }];
      widths = [0.1, 0.13, 0.10, 0.10, 0.35, 0.22];
    }
    that.table_component = new StyledList({
      rows: 11,
      columns: title.length,
      containerId: 'sucai_content_table',
      titles: title,
      listType: 1,
      data: [],
      styles: {
        borderColor: 'transparent',
        borderWidth: 1,
        titleHeight: 46,
        titleBg: 'rgb(93,161,192)',
        titleColor: 'white',
        cellBg: 'white',
        evenBg: 'rgb(245,245,245)',
        cellColor: 'rgb(114,114,114)',
        footBg: 'white',
        footColor: 'rgb(121,121,121)',
        iconColor: 'rgb(93,161,192)',
        inputBorder: '1px solid rgb(203,203,203)',
        inputBg: 'white',
        columnsWidth: widths
      }
    });
    that.table_component.state = state;
    if(name) {
      that.table_component.name = name;
    }
    if(username) {
      that.table_component.username = username;
    }
    that.table_component.getPageData = function (page) {
      var listData__origin = that.getDataforSUBTITLEs(this.state, page, this.name, this.username);
      that.table_component.onTotalCount((listData__origin && listData__origin.allCount) ? listData__origin.allCount : 0);
      this._data = listData__origin;
      var listData = that.formListDataForSubtitle(listData__origin ? listData__origin : [])
      return listData;
    };
    that.table_component.create();
  };
  sucai.showChooseUserDialog = function () {
    var that = this;
    var dialog = new chooseSelfAdvUser();
    dialog.init(function(user_id, user_name){
      that.initCreateDialog(null,null,user_id,user_name, "0");
    });
  }
  sucai.initCreateDialog = function (status, ad_id, user_id, user_name, user_type) {
    var that = this;
    switch(that.sucai_current_type){
      case "img":
        that.showcreateImgDialog(status, ad_id, user_id, user_name, user_type);
        break;
      case "video":
        that.showcreateVideoDialog(status, ad_id, user_id, user_name, user_type);
        break;
      case "subtitle":
        that.showcreateSubtitleDialog(status, ad_id, user_id, user_name, user_type)
        break;
    }
  };
  //showcreateXXXDialog函数 user_id, user_name（自主广告主创建素材会用到） user_type （是否风尚素材会用到）
  sucai.showcreateImgDialog = function (status, ad_id, user_id, user_name, user_type) {
    var that = this;
    this.createImgDialog = new PopupDialog_({
      url: 'content/su_cai/create_img_dialog.html',
      width: 760,
      height: 730,
      context: that,
      callback: function () {
        that.initImgDialogTabs(status, ad_id, user_id, user_name, user_type);
        that.initImgDialogBindEvents(status, ad_id, user_id, user_name, user_type);
        //定义各个Tabs的组件 和 绑定事件
        //如果是编辑状态，则填数据
      }
    });
    that.createImgDialog.templateUrl = null;
    if(ad_id) {
      this.createImgDialog.ad_id = ad_id;
    }
    if(status) {
      this.createImgDialog.status = status;
    }
    if(user_type) {
      this.createImgDialog.user_type = user_type;
    }
    this.createImgDialog.open();
  };
  sucai.initImgDialogTabs = function(status, ad_id, user_id, user_name, user_type){
    var that = this;
    that.initImgDialogTab1(status, ad_id, user_id, user_name, user_type);
    that.initImgDialogTab2(status, ad_id, user_id, user_name, user_type);
    var label = {
      ten: "10",
      thirty: "30",
      fifty: "50",
      seventy: "70",
      hundred: "100"
    };
    var dealid_select = that.createImgDialog.dealid_select;
    var level_select = that.createImgDialog.level_select;
    //var footprintmarks_select = that.createImgDialog.footprintmarks_select;

    //编辑状态下显示数据
    if(that.createImgDialog.status == 'revise') {
      $("#sucai_dialog_title_text").text(i18n('SUCAI_BIANJISUCAI'));
      var data = that.getSucaiIMG(that.createImgDialog.ad_id);
      that.createImgDialog.upload.checkExist_Boolean = false;
      that.createImgDialog.data = data;
      if(data) {
        var folderName;
        $(".sucai_dialog_create_source input[name=upload]").prop('checked', false);
        //$(".sucai_dialog_create_source input[name=upload]").attr('disabled', "");
        that.createImgDialog.upload.setDisable();
        that.createImgDialog.uploadFileTypeSelect.setDisable();
        var file_url;
        var str_ ;
        var str__ ;
        var url;
        if(data.url) {
          url = my_aqua.getDownloadFileURL(data.url);
        } else if(data.aqua_url) {
          url = data.aqua_url;
        } else {
          url = ""
        }
        if(url){
          file_url = url;
          str_ = file_url.split("?");
          file_url = str_[0];
          var pathArray = file_url.split("/aqua/rest/cdmi");
          var path = pathArray[1];
          var nameArray = path.split("/");
          var fileName = nameArray[nameArray.length - 1];
          var folderName = nameArray[nameArray.length - 2];
          path = nameArray.slice(0, -1).join("/") + "/";
          var template = that.aquaUtil.getObject({
            path: path,
            name: 'template.json'
          });
          if(template.isExist()){
            that.createImgDialog.templateUrl = file_url;
            $(".sucai_dialog_create_source input[name=upload][data-type=getFromTemplate]").prop('checked', true);
            that.createImgDialog.upload.setDisable();
            that.createImgDialog.uploadFileTypeSelect.setDisable();
            $('#sucai_dialog_create_TemplateEdit').removeClass('disabled');
            jQuery("#sucai_dialog_create_uploadfile_click").addClass("disabled");
          }else{
            $(".sucai_dialog_create_source input[name=upload][data-type=chooseAndUpload]").prop('checked', true);
            that.createImgDialog.upload.setAvailable();
            that.createImgDialog.uploadFileTypeSelect.setAvailable();
            jQuery("#sucai_dialog_create_uploadfile_click").removeClass("disabled");
            $("#sucai_dialog_create_img_uploadfile_url").val(decodeURI(fileName));
            if((Array.prototype.slice.call(fileName, -5).join("") === '.html') || (Array.prototype.slice.call(fileName, -4).join("") === '.htm')){
              that.createImgDialog.uploadFileTypeSelect.setValue("多文件");
            }else{
              that.createImgDialog.uploadFileTypeSelect.setValue("单文件");
            }
          }
        }else{
          $(".sucai_dialog_create_source input[name=upload][data-type=chooseAndUpload]").prop('checked', true);
          $("#sucai_dialog_create_img_uploadfile_url").val('unknown file');
        }
        if(data.metadata && data.metadata.footprint_poster){
          $('#sucai_dialog_create_footprintposter_url').val(getFileName(data.metadata.footprint_poster))
        }
        if(data.metadata && data.metadata.footprint_mark){
          //footprintmarks_select.setKey(data.metadata.footprint_mark)
        }
        function getFileName(url){
          var file_url = url;
          var str_ = file_url.split("?");
          file_url = str_[0];
          var pathArray = file_url.split("/aqua/rest/cdmi");
          var path = pathArray[1];
          var nameArray = path.split("/");
          var fileName = nameArray[nameArray.length - 1];
          return decodeURI(fileName);
        }

        $("#sucai_dialog_create_input_creatUser_name_value").val(data.user_name || "");
        $("#sucai_dialog_create_input_name_value").val(data.name || "");
        $("#sucai_dialog_create_input_size_width").val(data.width || "");
        $("#sucai_dialog_create_input_size_height").val(data.height || "");
        $("#sucai_dialog_create_link").val(data.link || "");
        level_select.setValue(data.level);
        data.contract_id && dealid_select.setValue(data.contract_id);
        $("#sucai_dialog_admaster_monitor_code").val(data.metadata && data.metadata.admaster_monitor_code || "");
        $("#sucai_dialog_create_footprinttitle_input").val(data.metadata && data.metadata.footprint_title || "");
        $("#sucai_dialog_create_footprintdescr_input").val(data.metadata && data.metadata.footprint_description || "");
        //$("#sucai_dialog_create_input_dealid_value").val(data.contract_id || "");

      }
      data.forcdn && (data.forcdn == "1") && jQuery("#sucai_dialog_create_input_isCDN").toggleClass("checked");
      jQuery("#sucai_dialog_create_input_isCDN").unbind("click");
      var user_ids = [data.user_id]
      that.getUserType(user_ids, function(result){
        if(result.length > 0){
          that.createImgDialog.user_type = result[0]["user_type"];
          if(that.createImgDialog.user_type == "0"){
            $(".sucai_dialog_create_isFSsucai").hide();
          }else{
            $(".sucai_dialog_create_isFSsucai").show();
          }
        }
      })
    }else{
      if(user_id){
        $("#sucai_dialog_create_input_creatUser_name_value").val(user_name || "");
      }else{
        $("#sucai_dialog_create_input_creatUser_name_value").val(my.paas.user_name);
      }
    }
    that.resizecreateImgDialog()
  };
  sucai.initImgDialogTab1 = function(status, ad_id, user_id, user_name, user_type){
    var that = this;
    var label = {
      ten: "10",
      thirty: "30",
      fifty: "50",
      seventy: "70",
      hundred: "100"
    };
    var level_select = new newSelect(
      "#sucai_dialog_create_morenguanggaowei_select",
      label, {
        width: 335,
        height: 28,
        background: "#ffffff",
        selectbackground: "#d3d3d3"
      }
    );
    that.createImgDialog.level_select = level_select;

    var detalid_result = [
      {key:"",value:i18n("LECTURETICKET_WU")}
    ];
    var dealid_select = new newSelect(
      "#sucai_dialog_create_dealid_select",
      detalid_result, {
        width: 280,
        height: 28,
        background: "#ffffff",
        selectbackground: "#d3d3d3",
        ScrollBarHeight:"175px"
      }
    );
    var detalids_array = that.getDetalIds();
    detalid_result = detalid_result.concat(detalids_array.map(function(item){return {key:item.contract_id, value:item.contract_id}}))
    dealid_select.updateSelectOptions(detalid_result);
    that.createImgDialog.dealid_select = dealid_select;

    //初始化图文素材的CDN设置
    that.init_IMG_CDN_Model();
    that.init_IMG_Template_Model();
    that.init_FENGSHANG_checkbox(user_type);
  };
  sucai.initImgDialogTab2 = function(status, ad_id, user_id, user_name, user_type){
    var that = this;
    var upload1 = new UploadModule(my_aqua);
    upload1.init({
      selectFileBottom: "#sucai_dialog_create_footprintposter_click",
      uploadPath: that.user.footprint_poster_folder,
      checkExist_Boolean: true
    }, {
      _startfun: function (file_name, updateSize, fileSize, self) {
        var console_message = file_name + "start";
        console.log(console_message);
      },
      _progressfun: function (file_name, updateSize, fileSize, self) {
        var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
        console.log(console_message);
      },
      _errorfun: function (e) {
        console.log(e);
      },
      _endfun: function (file_name, updateSize, fileSize, file_url, self) {
        var console_message = file_name + " end. The url = " + file_url;
        console.log(console_message);
      },
    }, {
      _beforeAllStartFun: function(files){
        if(files.files.length > 1){
          alert("请选择单个文件");
          $("#sucai_dialog_create_footprintposter_url").val("");
        }else{
          var name = files.files[0].name;
          $("#sucai_dialog_create_footprintposter_url").val(name);
        }
      },
      _allStartFun: function(files){
      },
      _checkAllExistFun: function(existArray){
        var file_name = existArray.join(",");
        var console_message = file_name + "Exist";
        console.log(console_message);
        alert(i18n('SUCAI_MESSAGE3'));
        this.failedCallback("");
      },
      _afterAllEndFun: function(result){
        if(result.error){
          this.failedCallback("");
        }
        if(result.data){
          var file_url;
          file_url = result.data[0].file_url;
          this.successCallback(file_url);;
        }
      }
    });
    that.createImgDialog.upload_footprint_poster = upload1;
    return;
    /*

    var detalid_result = [
    ];
    var dealid_select = new newSelect(
      "#sucai_dialog_create_footprintmark_source",
      detalid_result, {
        width: 300,
        height: 30,
        background: "#ffffff",
        selectbackground: "#d3d3d3",
      }
    );
    var detalids_array = that.getFootprintMarks();
    detalid_result = detalid_result.concat(detalids_array.map(function(item){return {key:item.url, value:item.label}}));
    dealid_select.updateSelectOptions(detalid_result);
    that.createImgDialog.footprintmarks_select = dealid_select;

    var upload2 = new UploadModule(my_aqua);
    upload2.init({
      selectFileBottom: "#sucai_dialog_create_footprintlabel_click",
      uploadPath: that.user.footprint_mark_folder,
      checkExist_Boolean: true
    }, {
      _startfun: function (file_name, updateSize, fileSize, self) {
        var console_message = file_name + "start";
        console.log(console_message);
      },
      _progressfun: function (file_name, updateSize, fileSize, self) {
        var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
        console.log(console_message);
      },
      _errorfun: function (e) {
        console.log(e);
      },
      _endfun: function (file_name, updateSize, fileSize, file_url, self) {
        var console_message = file_name + " end. The url = " + file_url;
        console.log(console_message);
      },
    }, {
      _beforeAllStartFun: function(files){
        if(files.files.length > 1){
          alert("请选择单个文件");
          $("#sucai_dialog_create_footprintlabel_url").val("");
        }else{
          var name = files.files[0].name;
          $("#sucai_dialog_create_footprintlabel_url").val(name);
        }
      },
      _allStartFun: function(files){
      },
      _checkAllExistFun: function(existArray){
        var file_name = existArray.join(",");
        var console_message = file_name + "Exist";
        console.log(console_message);
        alert(i18n('SUCAI_MESSAGE4'));
        this.failedCallback("");
      },
      _afterAllEndFun: function(result){
        if(result.error){
          this.failedCallback("");
        }
        if(result.data){
          var file_url;
          file_url = result.data[0].file_url;
          this.successCallback(file_url);;
        }
      }
    });
    that.createImgDialog.upload_footprint_mark = upload2;
    */
  };
  sucai.initImgDialogBindEvents = function(status, ad_id, user_id, user_name, user_type){
    var that = this;
    var label = {
      ten: "10",
      thirty: "30",
      fifty: "50",
      seventy: "70",
      hundred: "100"
    };
    var dealid_select = that.createImgDialog.dealid_select;
    //var footprintmarks_select = that.createImgDialog.footprintmarks_select;
    var level_select = that.createImgDialog.level_select;

    $(".sucai_create_dialog .sucai_head_center").on('click', 'li', function (ev) {
      var type = $(this).data("type");
      $(".sucai_create_dialog .sucai_head_center li").removeClass('sucai_menu_selected');
      $(this).addClass('sucai_menu_selected');
      $(".sucai_create_dialog_content_basic_message").hide();
      $(".sucai_create_dialog_content_footprint").hide();
      switch (type ){
        case "basic_message":
          $(".sucai_create_dialog_content_basic_message").show();
          break;
        case "footprint":
          $(".sucai_create_dialog_content_footprint").show();
          break;
      }
      that.resizecreateImgDialog();
    });

    //开始绑定创建事件
    $("#sucai_dialog_create_botton_click").click(function () {
      if(!$("#sucai_dialog_create_input_name_value").val()){
        alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
        return;
      }
      var createobj = {};
      if(that.createImgDialog.status === void 0){
        // 创建 逻辑
        createobj = {
          "type": "img",
          "url": "",
          "aqua_url": "",
          "name": $("#sucai_dialog_create_input_name_value").val(),
          "user_id": user_id ? user_id : my.paas.user_id,
          "user_name": user_id ? user_name : my.paas.user_name,
          "width": $("#sucai_dialog_create_input_size_width").val() ? $("#sucai_dialog_create_input_size_width").val() : "",
          "height": $("#sucai_dialog_create_input_size_height").val()? $("#sucai_dialog_create_input_size_height").val() : "",
          "state": i18n('SUCAI_SHANGCHUANZHONG'),
          "level": label[level_select.getValue()],
          "link": $("#sucai_dialog_create_link").val(),
          "contract_id": dealid_select.getValue(),
          "forcdn": $("#sucai_dialog_create_input_isCDN").hasClass("checked") ? "1" : "0",
          "metadata": {
            "admaster_monitor_code": $("#sucai_dialog_admaster_monitor_code").val(),
            "footprint_poster": "",
            //"footprint_mark": footprintmarks_select.getValue(),
            "footprint_title": $("#sucai_dialog_create_footprinttitle_input").val(),
            "footprint_description": $("#sucai_dialog_create_footprintdescr_input").val(),
          }
        };
        if(that.createImgDialog.user_type == "0"){
        }else{
          var fengshangcheckbox = $("#sucai_dialog_create_input_isFSsucai").hasClass("checked") ? true : false;
          if(fengshangcheckbox ){
            createobj["dealid"] = createobj["contract_id"];
          }
        }
        if(that.platform_current_id){
          createobj["platform_id_list"] = [that.platform_current_id];
        }
        that.createImgDialog.createobj = createobj;
        var uploadFromTemplate = ($(".sucai_dialog_create_source input[name=upload]:checked").data("type") == 'getFromTemplate') ? true : false;
        if(uploadFromTemplate){
          //用户勾选了 从模板生成素材
          if(!that.createImgDialog.templateUrl){
            alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
            return ;
          }
          var urlArray = that.createImgDialog.templateUrl.split('/aqua/rest/cdmi/');
          createobj.url = "../aqua/rest/cdmi/" + urlArray[1];
          createobj.aqua_url = that.createImgDialog.templateUrl;
        }else{
          //选择了 单/多文件上传
          if(!$("#sucai_dialog_create_img_uploadfile_url").val()){
            alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
            return;
          }
        }
        if(!that.addSucai(createobj, function (ad_id) {
            that.createImgDialog.ad_id = ad_id;
            var Promise_upload =  new Promise(function (resolve, reject) {
              if(uploadFromTemplate){
                resolve("")
              }else{
                if(that.createImgDialog.upload.systemFile.value){
                  var uploadType = that.createImgDialog.uploadFileTypeSelect.getValue();
                  that.createImgDialog.uploadType = uploadType;
                  if(that.createImgDialog.createobj.forcdn == "1") {
                    if(that.createImgDialog.uploadType == "simple"){
                      that.createImgDialog.upload.getFileRenameResult = function(filename){
                        var name = filename;
                        var nameArray = name.split(".");
                        var suffixName = "";
                        if (nameArray.length > 1) {
                          suffixName = "." + nameArray[nameArray.length - 1];
                        } else {
                          suffixName = "";
                        }
                        return ad_id + suffixName
                      };
                    }
                  }
                  that.createImgDialog.upload.startuploadFile(function(url){
                    resolve(getURL(url))
                  },function(reason){
                    reject(reason)
                  });
                }else{
                  resolve("")
                }
              }
            });
            var Promise_footprint_post =  new Promise(function (resolve, reject) {
              if(that.createImgDialog.upload_footprint_poster.systemFile.value){
                that.createImgDialog.upload_footprint_poster.startuploadFile(function(url){
                  resolve(getURL(url))
                }, function(reason){
                  reject(reason)
                });
              }else{
                resolve("")
              }
            });
            Promise.all([Promise_upload, Promise_footprint_post]).then(function (data) {
              var file_url = data[0];
              var footprint_poster = data[1];
              var needToRevise = false;
              var newObj = {};
              if(file_url){
                //如果file_url 存在，则用户选择了单/多文件上传 因此需要用file_url来覆盖掉url和aqua_url
                var urlArray = file_url.split('/aqua/rest/cdmi/');
                newObj.url = "../aqua/rest/cdmi/" + urlArray[1];
                newObj.aqua_url = file_url;
                needToRevise = true;
              }
              if(footprint_poster){
                newObj.footprint_poster = footprint_poster;
                needToRevise = true;
              }
              if(needToRevise){
                that.getSucaiIMG(that.createImgDialog.ad_id, function (data) {
                  var reviseObj = data;
                  newObj.url && (reviseObj.url = newObj.url);
                  newObj.aqua_url && (reviseObj.aqua_url = newObj.aqua_url);
                  if(typeof reviseObj.metadata == "undefined"){reviseObj.metadata = {}}
                  newObj.footprint_poster && (reviseObj.metadata.footprint_poster = newObj.footprint_poster);
                  that.createImgDialog.createobj = reviseObj;
                  if(!that.reviseSucai(that.createImgDialog.ad_id, reviseObj, function () {
                      createCompleteCallback();
                    })) {
                    alert(i18n('SUCAI_XIUGAISHIBAI'));
                  }
                });
              }else{
                createCompleteCallback();
              }
              function createCompleteCallback(){
                var table_self = that.table_component;
                if(that.createImgDialog.createobj.forcdn == "1") {
                  var CDN_options = that.get_IMG_CDN_Option();
                  that.toCDN(CDN_options, function (err) {
                    if(err) {
                      alert(i18n("SUCAI_PUBLISHSUCAIFAILED"));
                    } else {
                      that.createImgDialog.close();
                      table_self.refreshList(table_self.getPageData(table_self.currPage));
                    }
                  });
                }else{
                  that.updateSucaiState(ad_id);
                  that.createImgDialog.close();
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                }
              }
            }, function (reason) {
              that.createImgDialog.createobj.state = i18n('SUCAI_SHANGCHUANSHIBAI');
              if(!that.reviseSucai(that.createImgDialog.ad_id, that.createImgDialog.createobj, function () {
                  var table_self = that.table_component;
                  that.createImgDialog.close();
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                })) {
                alert(i18n('SUCAI_XIUGAISHIBAI'));
              }
            });
          })) {
          alert(i18n('SUCAI_CHUANGJIANSHIBAI'));
        }
      }else if(that.createImgDialog.status === 'revise'){
        // 编辑 逻辑
        createobj = {
          "type": "img",
          "url": that.createImgDialog.data.url,
          "aqua_url": that.createImgDialog.data.aqua_url,
          "name": $("#sucai_dialog_create_input_name_value").val(),
          "user_id": that.createImgDialog.data.user_id,
          "width": $("#sucai_dialog_create_input_size_width").val()? $("#sucai_dialog_create_input_size_width").val() : "",
          "height": $("#sucai_dialog_create_input_size_height").val() ? $("#sucai_dialog_create_input_size_height").val() : "",
          "state": that.createImgDialog.data.state,
          "level": label[level_select.getValue()],
          "create_time": that.createImgDialog.data.create_time,
          "link": $("#sucai_dialog_create_link").val(),
          "contract_id": dealid_select.getValue(),
          "forcdn": that.createImgDialog.data.forcdn,
          "metadata": {
            "admaster_monitor_code": $("#sucai_dialog_admaster_monitor_code").val(),
            "footprint_poster": that.createImgDialog.data.metadata.footprint_poster,
            //"footprint_mark": footprintmarks_select.getValue(),
            "footprint_title": $("#sucai_dialog_create_footprinttitle_input").val(),
            "footprint_description": $("#sucai_dialog_create_footprintdescr_input").val(),
          }
        };
        if(that.createImgDialog.user_type == "0"){
        }else{
          var fengshangcheckbox = $("#sucai_dialog_create_input_isFSsucai").hasClass("checked") ? true : false;
          if(fengshangcheckbox ){
            createobj["dealid"] = createobj["contract_id"];
          }
        }
        if(that.createImgDialog.data.platform_id_list){
          createobj["platform_id_list"] = that.createImgDialog.data.platform_id_list;
        }
        that.createImgDialog.createobj = createobj;
        var uploadFromTemplate = ($(".sucai_dialog_create_source input[name=upload]:checked").data("type") == 'getFromTemplate') ? true : false;
        if(uploadFromTemplate){
          //用户勾选了 从模板生成素材
          if(!that.createImgDialog.templateUrl){
            alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
            return ;
          }
        }else{
          //选择了 单/多文件上传
          if(!$("#sucai_dialog_create_img_uploadfile_url").val()){
            alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
            return;
          }
        }
        var Promise_upload =  new Promise(function (resolve, reject) {
          if(uploadFromTemplate){
            if(that.createImgDialog.templateUrl){
              resolve(that.createImgDialog.templateUrl)
            }else{
              resolve("")
            }
          }else{
            if(that.createImgDialog.upload.systemFile.value){
              var uploadType = that.createImgDialog.uploadFileTypeSelect.getValue();
              that.createImgDialog.uploadType = uploadType;
              if(that.createImgDialog.createobj.forcdn == "1") {
                if(that.createImgDialog.uploadType == "simple"){
                  that.createImgDialog.upload.getFileRenameResult = function(filename){
                    var name = filename;
                    var nameArray = name.split(".");
                    var suffixName = "";
                    if (nameArray.length > 1) {
                      suffixName = "." + nameArray[nameArray.length - 1];
                    } else {
                      suffixName = "";
                    }
                    return ad_id + suffixName
                  };
                }
              }
              that.createImgDialog.upload.startuploadFile(function(url){
                resolve(getURL(url))
              },function(reason){
                reject(reason)
              });
            }else{
              resolve("")
            }
          }
        });
        var Promise_footprint_post =  new Promise(function (resolve, reject) {
          if(that.createImgDialog.upload_footprint_poster.systemFile.value){
            that.createImgDialog.upload_footprint_poster.startuploadFile(function(url){
              resolve(getURL(url))
            }, function(reason){
              reject(reason)
            });
          }else{
            resolve("")
          }
        });
        Promise.all([Promise_upload, Promise_footprint_post]).then(function (data) {
          var file_url = data[0];
          var footprint_poster = data[1];
          if(file_url){
            //如果file_url 存在，则需要用file_url来覆盖掉url和aqua_url
            var urlArray = file_url.split('/aqua/rest/cdmi/');
            createobj.url = "../aqua/rest/cdmi/" + urlArray[1];
            createobj.aqua_url = file_url;
          }
          if(footprint_poster){
            that.createImgDialog.createobj.metadata.footprint_poster = (footprint_poster);
          }
          if(!that.reviseSucai(that.createImgDialog.ad_id, that.createImgDialog.createobj, function () {
              that.createImgDialog.close();
              var table_self = that.table_component;
              table_self.refreshList(table_self.getPageData(table_self.currPage));
            }, true)) {
            alert(i18n('SUCAI_XIUGAISHIBAI'));
          }
        }, function (reason) {
          alert(i18n('SUCAI_SHANGCHUANSHIBAI'));
        });
      } else {}


      function getURL(url){
        if(url === ""){
          return "";
        }
        var result = my_aqua.getDownloadFileURL(url);
        if(result.indexOf('?aquatoken=') >= 0) {
          result = result.split("?aquatoken=")[0];
        }
        return result;
      }
    });
  };
  sucai.resizecreateImgDialog = function (status, ad_id, user_id, user_name, user_type) {
    var that = this;
    var height = $('.sucai_create_dialog_container').height();
    that.createImgDialog.resize({
      width: 760,
      height: height
    }, true);
  };
  sucai.showcreateVideoDialog = function (status, ad_id, user_id, user_name, user_type) {
    var that = this;
    this.createVideoDialog = new PopupDialog_({
      url: 'content/su_cai/create_video_dialog.html',
      width: 760,
      height: 593, //477,
      context: that,
      callback: function () {
        var label = {
          ten: "10",
          thirty: "30",
          fifty: "50",
          seventy: "70",
          hundred: "100"
        };
        var level_select = new newSelect(
          "#sucai_dialog_create_morenguanggaowei_select",
          label, {
            width: 335,
            height: 32,
            background: "#ffffff",
            selectbackground: "#d3d3d3"
          }
        );

        var detalid_result = [
          {key:"",value:i18n("LECTURETICKET_WU")}
        ];
        var dealid_select = new newSelect(
          "#sucai_dialog_create_dealid_select",
          detalid_result, {
            width: 335,
            height: 34,
            background: "#ffffff",
            selectbackground: "#d3d3d3",
            ScrollBarHeight:"175px"
          }
        );
        var detalids_array = that.getDetalIds();
        detalid_result = detalid_result.concat(detalids_array.map(function(item){return {key:item.contract_id, value:item.contract_id}}))
        dealid_select.updateSelectOptions(detalid_result);

        var upload = new UploadModule(my_aqua);
        upload.init({
          selectFileBottom: "#sucai_dialog_create_uploadfile_click",
          uploadPath: that.user.video_folder,
          checkExist_Boolean: true
        }, {
          _startfun: function (file_name, updateSize, fileSize, self) {
            var console_message = file_name + "start";
            console.log(console_message);
          },
          _progressfun: function (file_name, updateSize, fileSize, self) {
            var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
            console.log(console_message);
          },
          _errorfun: function (e) {
            console.log(e);
          },
          _endfun: function (file_name, updateSize, fileSize, file_url, self) {
            var console_message = file_name + " end. The url = " + file_url;
            console.log(console_message);
          },
        },{
          _beforeAllStartFun: function(files){
            if(files.files.length > 1){
              alert("请选择单个文件");
              $("#sucai_dialog_create_video_uploadfile_url").val("");
            }else{
              var name = files.files[0].name;
              $("#sucai_dialog_create_video_uploadfile_url").val(name);
              if(that.createVideoDialog.status === 'revise'){
                if(that.createVideoDialog.data.forcdn == "1"){
                  that.createVideoDialog.upload.checkExist_Boolean = false;
                }else{
                  if(that.createVideoDialog.preUploadedFileName === name) {
                    that.createVideoDialog.upload.checkExist_Boolean = false;
                  } else {
                    that.createVideoDialog.upload.checkExist_Boolean = true;
                  }
                }
              }
            }
          },
          _allStartFun: function(files){
          },
          _checkAllExistFun: function(existArray){
            var file_name = existArray.join(",");
            var console_message = file_name + "Exist";
            console.log(console_message);
            alert(i18n('SUCAI_YICUNZAIMINGZIXIANGTONGDEWENJIANQINGZHONGMINGMINGZAISHANGCHUAN'));
            that.getSucaiIMG(that.createVideoDialog.ad_id, function (data) {
              that.createVideoDialog.createobj = data;
              that.createVideoDialog.createobj.state = i18n('SUCAI_SHANGCHUANSHIBAI');
              if(!that.reviseSucai(that.createVideoDialog.ad_id, that.createVideoDialog.createobj, function () {
                  var table_self = that.table_component;
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                  that.createVideoDialog.close();
                })) {
                alert(i18n('SUCAI_XIUGAISHIBAI'));
              }
            });
          },
          _afterAllEndFun: function(result){
            if(result.error){
              that.createVideoDialog.createobj.state = i18n('SUCAI_SHANGCHUANSHIBAI');
              if(!that.reviseSucai(that.createVideoDialog.ad_id, that.createVideoDialog.createobj, function () {
                  var table_self = that.table_component;
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                })) {
                alert(i18n('SUCAI_XIUGAISHIBAI'));
              }
            }
            if(result.data){
              var file_url = result.data[0].file_url;
              this.successCallback(file_url)
              return;
            }
          }
        });
        that.createVideoDialog.upload = upload;
        that.init_VIDEO_CDN_Model();
        that.init_FENGSHANG_checkbox(user_type);
        if(that.createVideoDialog.status == 'revise') {
          $("#sucai_dialog_title_text").text(i18n('SUCAI_BIANJISUCAI'));
          // that.createVideoDialog.upload.checkExist_Boolean = false;
          var data = that.getSucaiIMG(that.createVideoDialog.ad_id);
          that.createVideoDialog.data = data;
          if(data) {
            if(data.url) {
              var str_ = data.url.split("?");
              var str__ = str_[0].split("/");
            } else if(data.aqua_url) {
              var str_ = data.aqua_url.split("?");
              var str__ = str_[0].split("/");
            } else {
              str__ = ["unknown file"]
            }
            $("#sucai_dialog_create_input_creatUser_name_value").val(data.user_name || "");
            var preUploadedFileName = decodeURI(str__[str__.length - 1]);
            that.createVideoDialog.preUploadedFileName = preUploadedFileName;
            $("#sucai_dialog_create_video_uploadfile_url").val(preUploadedFileName);
            $("#sucai_dialog_create_input_name_value").val( data.name || "");
            $("#sucai_dialog_create_input_size_width").val( data.width || "");
            $("#sucai_dialog_create_input_size_height").val( data.height || "");
            $("#sucai_dialog_create_input_time_value").val( data.size || "");
            $("#sucai_dialog_create_link").val( data.link || "");
            level_select.setValue(data.level);
            $("#sucai_dialog_admaster_monitor_code").val(data.metadata && data.metadata.admaster_monitor_code);
            data.contract_id && dealid_select.setValue(data.contract_id);
          }
          data.forcdn && (data.forcdn == "1") && jQuery("#sucai_dialog_create_input_isCDN").toggleClass("checked");
          // jQuery("#sucai_dialog_create_uploadfile_click").unbind("click").addClass("disabled");
          jQuery("#sucai_dialog_create_input_isCDN").unbind("click");
          var user_ids = [data.user_id]
          that.getUserType(user_ids, function(result){
            if(result.length > 0){
              that.createVideoDialog.user_type = result[0]["user_type"];
              if(that.createVideoDialog.user_type == "0"){
                $(".sucai_dialog_create_isFSsucai").hide();
              }else{
                $(".sucai_dialog_create_isFSsucai").show();
              }
            }
          })
        }else{
          if(user_id){
            $("#sucai_dialog_create_input_creatUser_name_value").val(user_name || "");
          }else{
            $("#sucai_dialog_create_input_creatUser_name_value").val(my.paas.user_name);
          }
        }
        //开始绑定创建事件
        $("#sucai_dialog_create_botton_click").click(function () {
          if(!$("#sucai_dialog_create_input_name_value").val() || !$("#sucai_dialog_create_input_time_value").val() || !$("#sucai_dialog_create_video_uploadfile_url").val()) {
            alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
            return;
          }
          var createobj = {};
          if(that.createVideoDialog.status === void 0){
            // 创建 逻辑
            createobj = {
              "type": "video",
              "url": "",
              "aqua_url": "",
              "name": $("#sucai_dialog_create_input_name_value").val(),
              "user_id": user_id?user_id:my.paas.user_id,
              "user_name": user_id ? user_name : my.paas.user_name,
              "width": $("#sucai_dialog_create_input_size_width").val() ? $("#sucai_dialog_create_input_size_width").val() : "",
              "height": $("#sucai_dialog_create_input_size_height").val() ? $("#sucai_dialog_create_input_size_height").val() : "",
              "size": $("#sucai_dialog_create_input_time_value").val(),
              "state": i18n('SUCAI_SHANGCHUANZHONG'),
              "level": label[level_select.getValue()],
              "link": $("#sucai_dialog_create_link").val(),
              "forcdn": jQuery("#sucai_dialog_create_input_isCDN").hasClass("checked") ? "1" : "0",
              "contract_id": dealid_select.getValue(),
              "metadata": {
                "admaster_monitor_code": $("#sucai_dialog_admaster_monitor_code").val()
              }
            };
            if(that.platform_current_id){
              createobj["platform_id_list"] = [that.platform_current_id];
            }
            if(that.createVideoDialog.user_type == "0"){
            }else{
              var fengshangcheckbox = $("#sucai_dialog_create_input_isFSsucai").hasClass("checked") ? true : false;
              if(fengshangcheckbox ){
                createobj["dealid"] = createobj["contract_id"];
              }
            }
            that.createVideoDialog.createobj = createobj;
            if(!that.addSucai(createobj, function (ad_id) {
                that.createVideoDialog.ad_id = ad_id;
                var Promise_upload =  new Promise(function (resolve, reject) {
                  if(that.createVideoDialog.upload.systemFile.value){
                    if(that.createVideoDialog.createobj.forcdn == "1") {
                      that.createVideoDialog.upload.getFileRenameResult = function(filename){
                        var name = filename;
                        var nameArray = name.split(".");
                        var suffixName = "";
                        if (nameArray.length > 1) {
                          suffixName = "." + nameArray[nameArray.length - 1];
                        } else {
                          suffixName = "";
                        }
                        return ad_id + suffixName
                      };
                    }
                    that.createVideoDialog.upload.startuploadFile(function(url){
                      resolve(getURL(url))
                    },function(reason){
                      reject(reason)
                    });
                  }else{
                    resolve("")
                  }
                });
                Promise.all([Promise_upload]).then(function (data) {
                  var file_url = data[0];
                  var needToRevise = false;
                  var newObj = {};
                  if(file_url){
                    //如果file_url 存在，则用户选择了件上传 因此需要用file_url来覆盖掉url和aqua_url
                    var urlArray = file_url.split('/aqua/rest/cdmi/');
                    newObj.url = "../aqua/rest/cdmi/" + urlArray[1];
                    newObj.aqua_url = file_url;
                    needToRevise = true;
                  }
                  if(needToRevise){
                    that.getSucaiIMG(that.createVideoDialog.ad_id, function (data) {
                      var reviseObj = data;
                      newObj.url && (reviseObj.url = newObj.url);
                      newObj.aqua_url && (reviseObj.aqua_url = newObj.aqua_url);
                      if(typeof reviseObj.metadata == "undefined"){reviseObj.metadata = {}}
                      that.createVideoDialog.createobj = reviseObj;
                      if(!that.reviseSucai(that.createVideoDialog.ad_id, reviseObj, function () {
                          createCompleteCallback();
                        })) {
                        alert(i18n('SUCAI_XIUGAISHIBAI'));
                      }
                    });
                  }else{
                    createCompleteCallback();
                  }
                  function createCompleteCallback(){
                    var table_self = that.table_component;
                    if(that.createVideoDialog.createobj.forcdn == "1") {
                      var CDN_options = that.get_VIDEO_CDN_Option();
                      that.toCDN(CDN_options, function (err) {
                        if(err) {
                          alert(i18n("SUCAI_PUBLISHSUCAIFAILED"));
                        } else {
                          that.createVideoDialog.close();
                          table_self.refreshList(table_self.getPageData(table_self.currPage));
                        }
                      });
                    }else{
                      that.updateSucaiState(ad_id);
                      that.createVideoDialog.close();
                      table_self.refreshList(table_self.getPageData(table_self.currPage));
                    }
                  }
                }, function (reason) {
                  that.createVideoDialog.createobj.state = i18n('SUCAI_SHANGCHUANSHIBAI');
                  if(!that.reviseSucai(that.createVideoDialog.ad_id, that.createVideoDialog.createobj, function () {
                      var table_self = that.table_component;
                      that.createVideoDialog.close();
                      table_self.refreshList(table_self.getPageData(table_self.currPage));
                    })) {
                    alert(i18n('SUCAI_XIUGAISHIBAI'));
                  }
                });
              })) {
              alert(i18n('SUCAI_CHUANGJIANSHIBAI'));
            }
          }else if(that.createVideoDialog.status === 'revise'){
            // 编辑 逻辑
            createobj = {
              "type": "video",
              "url": that.createVideoDialog.data.url,
              "aqua_url": that.createVideoDialog.data.aqua_url,
              "name": $("#sucai_dialog_create_input_name_value").val(),
              "user_id": that.createVideoDialog.data.user_id,
              "width": $("#sucai_dialog_create_input_size_width").val() ? $("#sucai_dialog_create_input_size_width").val() : "",
              "height": $("#sucai_dialog_create_input_size_height").val() ? $("#sucai_dialog_create_input_size_height").val() : "",
              "size": $("#sucai_dialog_create_input_time_value").val(),
              "state": that.createVideoDialog.data.state,
              "create_time": that.createVideoDialog.data.create_time,
              "level": label[level_select.getValue()],
              "link": $("#sucai_dialog_create_link").val(),
              "forcdn": that.createVideoDialog.data.forcdn,
              "contract_id": dealid_select.getValue(),
              "metadata": {
                "admaster_monitor_code": $("#sucai_dialog_admaster_monitor_code").val()
              }
            };
            if(that.createVideoDialog.data.platform_id_list){
              createobj["platform_id_list"] = that.createVideoDialog.data.platform_id_list;
            }
            if(that.createVideoDialog.user_type == "0"){
            }else{
              var fengshangcheckbox = $("#sucai_dialog_create_input_isFSsucai").hasClass("checked") ? true : false;
              if(fengshangcheckbox ){
                createobj["dealid"] = createobj["contract_id"];
              }
            }
            that.createVideoDialog.createobj = createobj;
            var Promise_upload =  new Promise(function (resolve, reject) {
              if(that.createVideoDialog.upload.systemFile.value){
                if(that.createVideoDialog.createobj.forcdn == "1") {
                  that.createVideoDialog.upload.getFileRenameResult = function(filename){
                    var name = filename;
                    var nameArray = name.split(".");
                    var suffixName = "";
                    if (nameArray.length > 1) {
                      suffixName = "." + nameArray[nameArray.length - 1];
                    } else {
                      suffixName = "";
                    }
                    return ad_id + suffixName
                  };
                }
                that.createVideoDialog.upload.startuploadFile(function(url){
                  resolve(getURL(url))
                },function(reason){
                  reject(reason)
                });
              }else{
                resolve("")
              }
            });
            Promise.all([Promise_upload]).then(function (data) {
              var file_url = data[0];
              if(file_url){
                //如果file_url 存在，则需要用file_url来覆盖掉url和aqua_url
                var urlArray = file_url.split('/aqua/rest/cdmi/');
                createobj.url = "../aqua/rest/cdmi/" + urlArray[1];
                createobj.aqua_url = file_url;
              }
              if(!that.reviseSucai(that.createVideoDialog.ad_id, that.createVideoDialog.createobj, function () {
                  that.createVideoDialog.close();
                  var table_self = that.table_component;
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                }, true)) {
                alert(i18n('SUCAI_XIUGAISHIBAI'));
              }
            }, function (reason) {
              alert(i18n('SUCAI_SHANGCHUANSHIBAI'));
            });
          } else {}
        });
      }
    });
    if(ad_id) {
      this.createVideoDialog.ad_id = ad_id;
    }
    if(status) {
      this.createVideoDialog.status = status;
    }
    if(user_type) {
      this.createVideoDialog.user_type = user_type;
    }
    this.createVideoDialog.open();

    function getURL(url){
      if(url === ""){
        return "";
      }
      var result = my_aqua.getDownloadFileURL(url);
      if(result.indexOf('?aquatoken=') >= 0) {
        result = result.split("?aquatoken=")[0];
      }
      return result;
    }

  };
  sucai.showcreateSubtitleDialog = function (status, ad_id, user_id, user_name, user_type) {
    var that = this;
    this.createSubtitleDialog = new PopupDialog_({
      url: 'content/su_cai/create_subtitle_dialog.html',
      width: 760,
      height: 626, //477,
      context: that,
      callback: function () {
        var detalid_result = [
          {key:"",value:i18n("LECTURETICKET_WU")}
        ];

        var dealid_select = new newSelect(
          "#sucai_dialog_create_dealid_select",
          detalid_result, {
            width: 291,
            height: 34,
            background: "#ffffff",
            selectbackground: "#d3d3d3",
            ScrollBarHeight:"175px"
          }
        );
        var detalids_array = that.getDetalIds();
        detalid_result = detalid_result.concat(detalids_array.map(function(item){return {key:item.contract_id, value:item.contract_id}}))
        dealid_select.updateSelectOptions(detalid_result);

        that.init_FENGSHANG_checkbox(user_type);
        if(that.createSubtitleDialog.status == 'revise') {
          var data = that.getSucaiIMG(that.createSubtitleDialog.ad_id);
          that.createSubtitleDialog.data = data;
          if(data) {
            $("#sucai_dialog_create_input_creatUser_name_value").val(data.user_name || "");
            $("#sucai_dialog_create_input_name_value").val(data.name);
            $("#sucai_dialog_create_subtitle_content").val(data.subtitle_content);
            $("#sucai_dialog_admaster_monitor_code").val(data.metadata && data.metadata.admaster_monitor_code);
            //$("#sucai_dialog_create_input_dealid_value").val(data.contract_id || "");
            data.contract_id && dealid_select.setValue(data.contract_id);
          }
          var user_ids = [data.user_id]
          that.getUserType(user_ids, function(result){
            if(result.length > 0){
              that.createSubtitleDialog.user_type = result[0]["user_type"];
              if(that.createSubtitleDialog.user_type == "0"){
                $(".sucai_dialog_create_isFSsucai").hide();
              }else{
                $(".sucai_dialog_create_isFSsucai").show();
              }
            }
          })
        }else{
          if(user_id){
            $("#sucai_dialog_create_input_creatUser_name_value").val(user_name || "");
          }else{
            $("#sucai_dialog_create_input_creatUser_name_value").val(my.paas.user_name);
          }
        }
        //开始绑定创建事件
        $("#sucai_dialog_create_botton_click").click(function () {
          var subtitle_name = $("#sucai_dialog_create_input_name_value").val();
          var subtitle_content = $("#sucai_dialog_create_subtitle_content").val();
          if(subtitle_name && subtitle_content) {
            var createobj = {};
            if(that.createSubtitleDialog.status == 'revise'){
              createobj = {
                "type": "subtitle",
                "name": subtitle_name,
                "subtitle_content": subtitle_content,
                "user_id": that.createSubtitleDialog.data.user_id,
                "state": that.createSubtitleDialog.data.state,
                "create_time": that.createSubtitleDialog.data.create_time,
                "contract_id": dealid_select.getValue(),
                "metadata": {
                  "admaster_monitor_code": $("#sucai_dialog_admaster_monitor_code").val()
                }
              };
              if(that.createSubtitleDialog.data.platform_id_list){
                createobj["platform_id_list"] = that.createSubtitleDialog.data.platform_id_list;
              }
            }else{
              createobj = {
                "type": "subtitle",
                "name": subtitle_name,
                "subtitle_content": subtitle_content,
                "user_id": user_id?user_id:my.paas.user_id,
                "user_name": user_id ? user_name : my.paas.user_name,
                "state": "",
                "contract_id": dealid_select.getValue(),
                "metadata": {
                  "admaster_monitor_code": $("#sucai_dialog_admaster_monitor_code").val()
                }
              };
              if(that.platform_current_id){
                createobj["platform_id_list"] = [that.platform_current_id];
              }
            }
            if(that.createSubtitleDialog.user_type == "0"){
            }else{
              var fengshangcheckbox = $("#sucai_dialog_create_input_isFSsucai").hasClass("checked") ? true : false;
              if(fengshangcheckbox ){
                createobj["dealid"] = createobj["contract_id"];
              }
            }
            that.createSubtitleDialog.createobj = createobj;
            if(that.createSubtitleDialog.status == 'revise') {
              if(!that.reviseSucai(that.createSubtitleDialog.ad_id, that.createSubtitleDialog.createobj, function () {
                  var table_self = that.table_component;
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                  that.createSubtitleDialog.close();
                }, true)) {
                alert(i18n('SUCAI_XIUGAISHIBAI'));
              }
            } else {
              if(!that.addSucai(createobj, function (ad_id) {
                  that.createSubtitleDialog.ad_id = ad_id;
                  that.updateSucaiState(that.createSubtitleDialog.ad_id)
                  var table_self = that.table_component;
                  table_self.refreshList(table_self.getPageData(table_self.currPage));
                  that.createSubtitleDialog.close();
                })) {
                alert(i18n('SUCAI_CHUANGJIANSHIBAI'));
              }
            }
          } else {
            alert(i18n('SUCAI_QINGSHURUWANZHENGSHUJU'));
          }
        });
      }
    });
    if(ad_id) {
      this.createSubtitleDialog.ad_id = ad_id;
    }
    if(status) {
      this.createSubtitleDialog.status = status;
    }
    if(user_type) {
      this.createSubtitleDialog.user_type = user_type;
    }
    this.createSubtitleDialog.open();
  };
  sucai.initCDNSelectDIV = function (array) {
    array.forEach(function (item) {
      var container = $(document.createElement("div"));
      container.addClass('sucai_dialog_create_others');
      container.appendTo($("#sucai_CDN_options"));
      item.forEach(function (item_) {
        var child = $(document.createElement("div"));
        child.addClass('sucai_dialog_twices');
        child.appendTo(container);
        if(item_.name && item_.id) {
          var title = $(document.createElement("div"));
          title.addClass('sucai_dialog_create_name_title_span');
          title.appendTo(child);
          title.text(item_.name);
          var value = $(document.createElement(item_.type));
          (item_.type == "input") && (value.addClass('sucai_dialog_create_input'));
          value.attr("id", item_.id);
          (item_.style) && value.attr("style", item_.style);
          value.appendTo(child);
        }
      });
      var end = $(document.createElement("div"));
      end.addClass('sucai_dialog_clear');
      end.appendTo(container);
    })
  };
  sucai.init_VIDEO_CDN_Model = function () {
    var that = this;
    if(that.CDNtype === false) {
      $(".sucai_dialog_create_isCDN").hide();
      $("#sucai_dialog_create_isCDN_type").hide();
    }else{
      $("#sucai_dialog_create_input_isCDN").click(function () {
        $(this).toggleClass("checked");
        if($(this).hasClass("checked")) {
          $("#sucai_dialog_create_isCDN_type").show();
        } else {
          $("#sucai_dialog_create_isCDN_type").hide();
          $("#sucai_CDN_options").hide();
          $("#sucai_dialog_create_input_isCDN_type").removeClass("checked");
          that.createVideoDialog.resize({
            width: 760,
            height: 593
          }, true);
        }
      });
      $("#sucai_dialog_create_input_isCDN_type").click(function () {
        $(this).toggleClass("checked");
        if($(this).hasClass("checked")) {
          $("#sucai_CDN_options").show();
          that.createVideoDialog.resize({
            width: 760,
            height: 872
          }, true);
        } else {
          $("#sucai_CDN_options").hide();
          that.createVideoDialog.resize({
            width: 760,
            height: 618
          }, true);
        }
      });
      switch( that.CDNtype ){
        case "":
          that.initCDNSelectDIV([
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_container_select",
              name: i18n("SUCAI_CONTAINER_TITLE")
            }
              , {
              type: "input",
              id: "sucai_dialog_create_CDN_segment_duration",
              style: "width:184px",
              name: i18n("SUCAI_SEGMENT_DURATION_TITLE")
            }],
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_snapshot_select",
              name: i18n("SUCAI_SNAPSHOT_TITLE")
            }
              , {
              type: "div",
              id: "sucai_dialog_create_CDN_video_codec_select",
              name: i18n("SUCAI_VIDEO_CODEC_TITLE")
            }],
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_audio_codec_select",
              name: i18n("SUCAI_AUDIO_CODEC_TITLE")
            }
              , {
              type: "div",
              id: "sucai_dialog_create_CDN_video_bitrate_select",
              name: i18n("SUCAI_VIDEO_BITRATE_TITLE")
            }],
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_audio_bitrate_select",
              name: i18n("SUCAI_AUDIO_BITRATE_TITLE")
            }
              , {
              type: "div",
              id: "sucai_dialog_create_CDN_video_resolution_select",
              name: i18n("SUCAI_VIDEO_RESOLUTION_TITLE")
            }]
          ]);
          var container_label = {
            HLS: "HLS",
            MP4: "MP4",
            TS: "TS",
            FLV: "FLV"
          };
          $("#sucai_dialog_create_CDN_segment_duration").val("10");
          var container_select = new newSelect(
            "#sucai_dialog_create_CDN_container_select",
            container_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function (value) {
              if(value == "HLS") {
                $("#sucai_dialog_create_CDN_segment_duration").val("10");
                $("#sucai_dialog_create_CDN_segment_duration").removeAttr("readonly");
                $("#sucai_dialog_create_CDN_segment_duration").css({
                  background: "white"
                })
              } else {
                $("#sucai_dialog_create_CDN_segment_duration").val("");
                $("#sucai_dialog_create_CDN_segment_duration").attr("readonly", "readonly");
                $("#sucai_dialog_create_CDN_segment_duration").css({
                  background: "#f0f0f0"
                })
              }
            }
          );
          that.createVideoDialog.container_select = container_select;
          var snapshot_label = [
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ];
          var snapshot_select = new newSelect(
            "#sucai_dialog_create_CDN_snapshot_select",
            snapshot_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createVideoDialog.snapshot_select = snapshot_select;

          var video_codec_label = {
            AVC: "AVC",
            HEVC: "HEVC"
          };
          var video_codec_select = new newSelect(
            "#sucai_dialog_create_CDN_video_codec_select",
            video_codec_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createVideoDialog.video_codec_select = video_codec_select;

          var audio_codec_label = {
            AAC: "AAC",
            EAC3: "EAC3",
            MP3: "MP3"
          };
          var audio_codec_select = new newSelect(
            "#sucai_dialog_create_CDN_audio_codec_select",
            audio_codec_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createVideoDialog.audio_codec_select = audio_codec_select;

          var video_bitrate_label = [
            {
              key: "15000",
              value: "15000"
            },
            {
              key: "8000",
              value: "8000"
            },
            {
              key: "4000",
              value: "4000"
            },
            {
              key: "2300",
              value: "2300"
            },
            {
              key: "1300",
              value: "1300"
            },
            {
              key: "800",
              value: "800"
            },
          ];
          video_bitrate_label.reverse()
          var video_bitrate_select = new newSelect(
            "#sucai_dialog_create_CDN_video_bitrate_select",
            video_bitrate_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function () {}, true
          );
          that.createVideoDialog.video_bitrate_select = video_bitrate_select;
          video_bitrate_select.setValue("1300");

          var audio_bitrate_label = [
            {
              key: "256",
              value: "256"
            },
            {
              key: "128",
              value: "128"
            }
          ];
          audio_bitrate_label.reverse()
          var audio_bitrate_select = new newSelect(
            "#sucai_dialog_create_CDN_audio_bitrate_select",
            audio_bitrate_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function () {}, true
          );
          that.createVideoDialog.audio_bitrate_select = audio_bitrate_select;

          var video_resolution_label = [
            {
              key: "LLarge",
              value: "3840*2160"
            },
            {
              key: "Large",
              value: "1920*1080"
            },
            {
              key: "Medium",
              value: "1280*720"
            },
            {
              key: "Small",
              value: "720*576"
            },
            {
              key: "SSmall",
              value: "640*480"
            }
          ];
          video_resolution_label.reverse()
          var video_resolution_select = new newSelect(
            "#sucai_dialog_create_CDN_video_resolution_select",
            video_resolution_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function () {}, true
          );
          that.createVideoDialog.video_resolution_select = video_resolution_select;
          video_resolution_select.setValue("1920*1080")
          break;
        case "广视":
          that.initCDNSelectDIV([
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_container_select",
              name: i18n("SUCAI_CONTAINER_TITLE")
            }
              , {
              type: "input",
              id: "sucai_dialog_create_CDN_segment_duration",
              style: "width:184px",
              name: i18n("SUCAI_SEGMENT_DURATION_TITLE")
            }],
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_video_codec_select",
              name: i18n("SUCAI_VIDEO_CODEC_TITLE")
            },{
              type: "div",
              id: "sucai_dialog_create_CDN_audio_codec_select",
              name: i18n("SUCAI_AUDIO_CODEC_TITLE")
            }],
            [
              {
                type: "div",
                id: "sucai_dialog_create_CDN_video_bitrate_select",
                name: i18n("SUCAI_VIDEO_BITRATE_TITLE")
              } , {
              type: "div",
              id: "sucai_dialog_create_CDN_audio_bitrate_select",
              name: i18n("SUCAI_AUDIO_BITRATE_TITLE")
            }
            ],
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_video_resolution_select",
              name: i18n("SUCAI_VIDEO_RESOLUTION_TITLE")
            }]
          ]);
          var container_label = {
            HLS: "HLS",
            MP4: "MP4",
            TS: "TS",
            FLV: "FLV"
          };
          $("#sucai_dialog_create_CDN_segment_duration").val("10");
          var container_select = new newSelect(
            "#sucai_dialog_create_CDN_container_select",
            container_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function (value) {
              if(value == "HLS") {
                $("#sucai_dialog_create_CDN_segment_duration").val("10");
                $("#sucai_dialog_create_CDN_segment_duration").removeAttr("readonly");
                $("#sucai_dialog_create_CDN_segment_duration").css({
                  background: "white"
                })
              } else {
                $("#sucai_dialog_create_CDN_segment_duration").val("");
                $("#sucai_dialog_create_CDN_segment_duration").attr("readonly", "readonly");
                $("#sucai_dialog_create_CDN_segment_duration").css({
                  background: "#f0f0f0"
                })
              }
            }
          );
          that.createVideoDialog.container_select = container_select;

          var video_codec_label = {
            AVC: "AVC",
            HEVC: "HEVC"
          };
          var video_codec_select = new newSelect(
            "#sucai_dialog_create_CDN_video_codec_select",
            video_codec_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createVideoDialog.video_codec_select = video_codec_select;

          var audio_codec_label = {
            AAC: "AAC",
            EAC3: "EAC3",
            MP3: "MP3"
          };
          var audio_codec_select = new newSelect(
            "#sucai_dialog_create_CDN_audio_codec_select",
            audio_codec_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createVideoDialog.audio_codec_select = audio_codec_select;

          var video_bitrate_label = [
            {
              key: "15000",
              value: "15000"
            },
            {
              key: "8000",
              value: "8000"
            },
            {
              key: "4000",
              value: "4000"
            },
            {
              key: "2300",
              value: "2300"
            },
            {
              key: "1300",
              value: "1300"
            },
            {
              key: "800",
              value: "800"
            },
          ];
          video_bitrate_label.reverse()
          var video_bitrate_select = new newSelect(
            "#sucai_dialog_create_CDN_video_bitrate_select",
            video_bitrate_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function () {}, true
          );
          that.createVideoDialog.video_bitrate_select = video_bitrate_select;
          video_bitrate_select.setValue("1300");

          var audio_bitrate_label = [
            {
              key: "256",
              value: "256"
            },
            {
              key: "128",
              value: "128"
            }
          ];
          audio_bitrate_label.reverse()
          var audio_bitrate_select = new newSelect(
            "#sucai_dialog_create_CDN_audio_bitrate_select",
            audio_bitrate_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function () {}, true
          );
          that.createVideoDialog.audio_bitrate_select = audio_bitrate_select;

          var video_resolution_label = [
            {
              key: "LLarge",
              value: "3840*2160"
            },
            {
              key: "Large",
              value: "1920*1080"
            },
            {
              key: "Medium",
              value: "1280*720"
            },
            {
              key: "Small",
              value: "720*576"
            },
            {
              key: "SSmall",
              value: "640*480"
            }
          ];
          video_resolution_label.reverse()
          var video_resolution_select = new newSelect(
            "#sucai_dialog_create_CDN_video_resolution_select",
            video_resolution_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            },
            function () {}, true
          );
          that.createVideoDialog.video_resolution_select = video_resolution_select;
          video_resolution_select.setValue("1920*1080")
          break;
        case "佳创":
          if(that.CDNtype == "佳创") {
            $("#sucai_dialog_create_input_isCDN").unbind("click").click(function () {
              $(this).toggleClass("checked");
              if($(this).hasClass("checked")) {
                $("#sucai_CDN_options").show();
                that.createVideoDialog.resize({
                  width: 760,
                  height: 653
                }, true);
              } else {
                $("#sucai_CDN_options").hide();
                that.createVideoDialog.resize({
                  width: 760,
                  height: 593
                }, true);
              }
            });
          }
          that.initCDNSelectDIV([
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_segment_select",
              name: i18n("SUCAI_SEGMENT_TITLE")
            }
              , {}]
          ]);
          var segment_label = [
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ];
          var segment_select = new newSelect(
            "#sucai_dialog_create_CDN_segment_select",
            segment_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createVideoDialog.segment_select = segment_select;
          that.createVideoDialog.segment_select.setValue("是");
          break;
      }
    }
  };
  sucai.get_VIDEO_CDN_Option = function () {
    var that = this;
    var CDN_options = {
      ad_id: that.createVideoDialog.ad_id,
      aqua_url: that.createVideoDialog.createobj.aqua_url,
      type: $("#sucai_dialog_create_input_isCDN_type").hasClass("checked") ? "1" : "0"
    };
    switch(that.CDNtype){
      case "":
        if(CDN_options.type == "1") {
          CDN_options.container = that.createVideoDialog.container_select.getKey();
          if(CDN_options.container == "HLS") {
            CDN_options.segment_duration = $("#sucai_dialog_create_CDN_segment_duration").val();
          }
          CDN_options.snapshot = that.createVideoDialog.snapshot_select.getValue();
          CDN_options.video_codec = that.createVideoDialog.video_codec_select.getKey();
          CDN_options.audio_codec = that.createVideoDialog.audio_codec_select.getKey();
          CDN_options.video_bitrate = that.createVideoDialog.video_bitrate_select.getKey();
          CDN_options.audio_bitrate = that.createVideoDialog.audio_bitrate_select.getKey();
          CDN_options.video_resolution = that.createVideoDialog.video_resolution_select.getKey();
        }
        break;
      case "广视":
        if(CDN_options.type == "1") {
          CDN_options.container = that.createVideoDialog.container_select.getKey();
          if(CDN_options.container == "HLS") {
            CDN_options.segment_duration = $("#sucai_dialog_create_CDN_segment_duration").val();
          }
          CDN_options.video_codec = that.createVideoDialog.video_codec_select.getKey();
          CDN_options.audio_codec = that.createVideoDialog.audio_codec_select.getKey();
          CDN_options.video_bitrate = that.createVideoDialog.video_bitrate_select.getKey();
          CDN_options.audio_bitrate = that.createVideoDialog.audio_bitrate_select.getKey();
          CDN_options.video_resolution = that.createVideoDialog.video_resolution_select.getKey();
        }
        break;
      case "佳创":
        CDN_options = {
          ad_id: that.createVideoDialog.ad_id,
          aqua_url: that.createVideoDialog.createobj.aqua_url,
          segment : that.createVideoDialog.segment_select.getValue()
        };
        break;
    }
    return CDN_options;
  };
  sucai.init_IMG_CDN_Model = function () {
    var that = this;
    if(that.IMG_CDNtype === false) {
      $(".sucai_dialog_create_isCDN").hide();
    }else{
      switch(that.IMG_CDNtype){
        case "":
          $(".sucai_dialog_create_isCDN").hide();
          break;
        case "国安":
          $("#sucai_dialog_create_input_isCDN").unbind("click").click(function () {
            $(this).toggleClass("checked");
            if($(this).hasClass("checked")) {
              $("#sucai_CDN_options").show();
              that.resizecreateImgDialog()
            } else {
              $("#sucai_CDN_options").hide();
              that.resizecreateImgDialog()
            }
          });
          that.initCDNSelectDIV([
            [{
              type: "div",
              id: "sucai_dialog_create_CDN_segment_select",
              name: i18n("SUCAI_SEGMENT_TITLE")
            }
              , {}]
          ]);
          var segment_label = [
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ];
          var segment_select = new newSelect(
            "#sucai_dialog_create_CDN_segment_select",
            segment_label, {
              width: 191,
              height: 32,
              background: "#ffffff",
              selectbackground: "#d3d3d3"
            }
          );
          that.createImgDialog.segment_select = segment_select;
          that.createImgDialog.segment_select.setValue("是");
          break;
      }
    }
  };
  sucai.init_FENGSHANG_checkbox = function(user_type){
    if(user_type){
      if(user_type == "0"){
        $(".sucai_dialog_create_isFSsucai").hide();
      }else{
        $(".sucai_dialog_create_isFSsucai").show();
      }
    }else{
    }
    $("#sucai_dialog_create_input_isFSsucai").unbind("click").click(function () {
      $(this).toggleClass("checked");
    });
  };
  sucai.get_IMG_CDN_Option = function () {
    var that = this;
    var CDN_options = {};

    switch(that.IMG_CDNtype){
      case "":
        break;
      case "国安":
        CDN_options = {
          ad_id: that.createImgDialog.ad_id,
          aqua_url: that.createImgDialog.createobj.aqua_url,
          segment : that.createImgDialog.segment_select.getValue()
        };
        break;
    }
    return CDN_options;
  };
  sucai.init_IMG_Template_Model = function () {
    var that = this;

    $(".sucai_dialog_create_source input[name=upload]").click(function(){
      $('#sucai_dialog_create_uploadfile_click').addClass('disabled');
      $('#sucai_dialog_create_TemplateEdit').addClass('disabled');

      var uploadFromTemplate = ($(".sucai_dialog_create_source input[name=upload]:checked").data("type") == 'getFromTemplate') ? true : false;
      if(uploadFromTemplate) {
        that.createImgDialog.upload.setDisable();
        that.createImgDialog.uploadFileTypeSelect.setDisable();
        $('#sucai_dialog_create_TemplateEdit').removeClass('disabled');
      }else{
        that.createImgDialog.upload.setAvailable();
        that.createImgDialog.uploadFileTypeSelect.setAvailable();
        $('#sucai_dialog_create_uploadfile_click').removeClass('disabled');
      }
    });

    var label = [
      {key:"simple", value:"单文件"},
      {key:"plural", value:"多文件"},
    ]
    var uploadFileTypeSelect = new newSelect(
      "#sucai_dialog_create_img_uploadFileType",
      label, {
        width: 106,
        height: 30,
        background: "#ffffff",
        selectbackground: "#d3d3d3"
      }
    );
    that.createImgDialog.uploadFileTypeSelect = uploadFileTypeSelect;
    uploadFileTypeSelect.listenLiClick = function(result){
      that.createImgDialog.upload.clear();
      $("#sucai_dialog_create_img_uploadfile_url").val("");
    };

    var upload = new UploadModule(my_aqua);
    upload.init({
      selectFileBottom: "#sucai_dialog_create_uploadfile_click",
      uploadPath: that.user.img_folder,
      checkExist_Boolean: true
    }, {
      _startfun: function (file_name, updateSize, fileSize, self) {
        var console_message = file_name + "start";
        console.log(console_message);
      },
      _progressfun: function (file_name, updateSize, fileSize, self) {
        var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
        console.log(console_message);
      },
      _errorfun: function (e) {
        console.log(e);
      },
      _endfun: function (file_name, updateSize, fileSize, file_url, self) {
        var console_message = file_name + " end. The url = " + file_url;
        console.log(console_message);
      },
    }, {
      _beforeAllStartFun: function(files){
        var uploadType = that.createImgDialog.uploadFileTypeSelect.getValue();
        if(uploadType == "simple"){
          if(files.files.length > 1){
            alert("请选择单个文件");
            $("#sucai_dialog_create_img_uploadfile_url").val("");
          }else{
            var name = files.files[0].name;
            $("#sucai_dialog_create_img_uploadfile_url").val(name);
          }
        }else{
          //循环读取文件名，记录第一个xxx.html，记录是否有index.html或者index.htm
          //如果不存在xxx.html，则上传失败
          //如果存在，则开始创建素材名文件夹，开始上传，上传成功后
          var i = 0;
          var resultName = "";
          for(i = 0; i < files.files.length; i++){
            var name = files.files[i].name;
            if(adjustSuffixName(name)){
              if((name == "index.html") || (name == "index.htm")){
                resultName = name;
                break;
              }else{
                resultName = name;
              }
            }
          }
          if(resultName){
            that.createImgDialog.uploadHtml = resultName;
            $("#sucai_dialog_create_img_uploadfile_url").val(resultName);
          }else{
            alert("多文件上传请包含index.html或者index.htm");
          }
          function adjustSuffixName(filename) {
            var that = this;
            var name = filename;
            var nameArray = name.split(".");
            var suffixName = "";
            if (nameArray.length > 1) {
              suffixName = nameArray[nameArray.length - 1];
            }
            if((suffixName == "html") || (suffixName == "htm")){
              return true;
            }
            return false;
          }
        }
      },
      _allStartFun: function(files){
        // 2019_12_31 单文件上传 无论是CDN还是非CDN 全都保持为子目录(素材ID)/文件名(素材ID).扩展名
        // 所以和多文件上传一样，都要预先创建个子目录(素材ID)
        var aquaFolder = that.aquaUtil.getContainer({
          path: my_aqua.netdiskRoot + "/" + that.user.img_folder,
          name: that.createImgDialog.ad_id
        })
        aquaFolder.create();
        that.createImgDialog.upload.uploadPath = that.user.img_folder + that.createImgDialog.ad_id;
        console.log(that.createImgDialog.upload.uploadPath);
      },
      _checkAllExistFun: function(existArray){
        var file_name = existArray.join(",");
        var console_message = file_name + "Exist";
        console.log(console_message);
        alert(i18n('SUCAI_YICUNZAIMINGZIXIANGTONGDEWENJIANQINGZHONGMINGMINGZAISHANGCHUAN'));
        this.failedCallback("");
        return;
      },
      _afterAllEndFun: function(result){
        if(result.error){
          this.failedCallback("");
        }
        if(result.data){
          var uploadType = that.createImgDialog.uploadType;
          var file_url;
          if(uploadType == "simple"){
            file_url = result.data[0].file_url;
          }else{
            for(var i = 0;i < result.data.length; i++){
              var item = result.data[i]
              if(item.name == that.createImgDialog.uploadHtml){
                file_url = item.file_url;
              }
            }
          }
          this.successCallback(file_url)
          return;
        }
      }
    });
    that.createImgDialog.upload = upload;

    $("#sucai_dialog_create_TemplateEdit").click(function(){
      if($("#sucai_dialog_create_TemplateEdit").hasClass('disabled')){
      }else{
        if(that.createImgDialog.templateUrl){
          sucai_img_template.openEditDialog(that.createImgDialog.templateUrl, function(url){
            that.createImgDialog.templateUrl = url;
          });
        }else{
          sucai_img_template.openNewDialog(function(url){
            that.createImgDialog.templateUrl = url;
          });
        }
      }
    });
  };
  sucai.showDeleteDialog = function (ad_id) {
    var that = this;
    if(!this.deleteDialog) {
      this.deleteDialog = new PopupDialog_({
        url: 'content/su_cai/delete_dialog.html',
        width: 478,
        height: 266,
        context: that,
        callback: function (ad_id) {
          $("#sucai_dialog_delete_botton_click").click(function () {
            var deletestatus = that.deleteSucai(that.deleteDialog.ad_id, function () {
              that.deleteDialog.close();
              var table_self = that.table_component;
              table_self.refreshList(table_self.getPageData(table_self.currPage));
            });
            if(!deletestatus) {
              alert(i18n('SUCAI_SHANCHUSHIBAI'));
            }
          });
        }
      });
    }
    this.deleteDialog.open();
    this.deleteDialog.ad_id = ad_id;
  };
  sucai.showReviseDialog = function (ad_id) {
    var that = this;
    switch(that.sucai_current_type){
      case "img":
        that.showReviseImgDialog(ad_id);
        break;
      case "video":
        that.showReviseVideoDialog(ad_id);
        break;
      case "subtitle":
        that.showReviseSubtitleDialog(ad_id)
        break;
    }
  };
  sucai.showReviseImgDialog = function (ad_id) {
    this.showcreateImgDialog("revise", ad_id);
  };
  sucai.showReviseVideoDialog = function (ad_id) {
    this.showcreateVideoDialog("revise", ad_id);
  };
  sucai.showReviseSubtitleDialog = function (ad_id) {
    this.showcreateSubtitleDialog("revise", ad_id);
  };
  sucai.showSeeDialog = function (ad_id) {
    var that = this;
    switch(that.sucai_current_type){
      case "img":
        that.showSeeImgDialog(ad_id);
        break;
      case "video":
        that.showSeeVideoDialog(ad_id);
        break;
      case "subtitle":
        that.showSeeSubtitleDialog(ad_id)
        break;
    }
  };
  sucai.showSeeImgDialog = function (ad_id) {
    var that = this;
    var app = new PreviewModel();
    app.previewSuCai(ad_id, {
      viewDennyMsg: true
    });
  };
  sucai.showSeeVideoDialog = function (ad_id) {
    var that = this;
    var app = new PreviewModel();
    app.previewSuCai(ad_id, {
      viewDennyMsg: true
    });
  };
  sucai.showSeeSubtitleDialog = function (ad_id) {
    var that = this;
    var app = new PreviewModel();
    app.previewSuCai(ad_id, {
      viewDennyMsg: true
    });
  };
  sucai.viewAuditHis = function(ad_id){
    var dialog = new AuditHis({
      type: 'ad_item',
      id: ad_id
    })
  }

  //表格处理请求返回响应逻辑
  sucai.formListDataForImg = function (data) {
    var list_data = [];
    for(var i = 0; i < data.length; i++) {
      var record = this.formListRowDataForImg(data[i], i);
      list_data.push(record);
    }
    return list_data;
  };
  sucai.formListRowDataForImg = function (Data, i) {
    var result = [];
    var arr0;
    var arr1 = Data.name;
    var state = Data.state;
    var arr2 = this.getSucaiStatus(state);
    var arr3 = Data.user_name ? Data.user_name : "";
    var arr4 = Data.width + " × " + Data.height;
    var arr5 = Data.level;

    var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('SUCAI_CHAKAN') + '</span>';
    var oprEdit, oprDelete;
    if((my.paas.user_type == "0") || (my.paas.user_type == "1")){
      oprEdit = '<span class="opr" data-type="edit" data-id="' + i + '">' + i18n('SUCAI_BIANJI') + '</span>';
      oprDelete = '<div class="opr" data-type="del" data-id="' + i + '">' + i18n('SUCAI_SHANCHU') + '</div>'
    } else {
      oprEdit = '<span class="opr disabled" data-type="" data-id="' + i + '">' + i18n('SUCAI_BIANJI') + '</span>';
      oprDelete = '<div class="opr disabled" data-type="" data-id="' + i + '">' + i18n('SUCAI_SHANCHU') + '</div>'
    }
    var oprLimit = '<span class="opr" data-type="limit" data-id="' + i + '">' + i18n('SUCAI_XIANCI') + '</span>';
    var oprDist =  '<div class="opr" data-type="dist" data-id="' + i + '">' + i18n('SUCAI_OPERATION_DIST') + '</div>';
    var oprAduitHistory =  '<div class="opr" data-type="aduitHistory" data-id="' + i + '">' + i18n('SUCAI_ADUITHISTORY') + '</div>';

    var arr6;
    var arr7 = (typeof (Data.placement_times) !== "undefined") ? Data.placement_times : "";;
    var arr8 = ((typeof (Data.total_quota) !== "undefined") && (typeof (Data.placement_times) !== "undefined")) ? (parseInt(Data.total_quota) - parseInt(Data.placement_times)) : "";
    if((arr8 < 0) && (typeof arr8 == "number")){
      arr8 = "";
    }
    var arr;
    if(this.systemType == 0) {
      arr6 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprAduitHistory, oprDelete]);
      arr = [{
        label: arr1
      }, {
        label: arr2
      }, {
        label: arr3
      }, {
        label: arr4
      }, {
        label: arr5
      }, {
        label: arr7
      },{
        label: arr8
      },{
        label: arr6
      }];
    } else {
      if(this.systemType == 1) {
        if(Data.site_id == window.AdvSelfSiteId) {
          arr0 = (window.AdvSelfSiteName || '') + i18n('ADPOS_SITE_SELF_SUFFIX');
          arr6 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprDist, oprAduitHistory, oprDelete]);
        } else {
          arr0 = adpSiteNames[Data.site_id] || '';
          arr6 = oprView + oprLimit;
        }
      } else if(this.systemType == 2) {
        if(Data.site_id == window.AdvSelfSiteId) {
          arr0 = (window.AdvSelfSiteName || '') + i18n('ADPOS_SITE_SELF_SUFFIX');
          arr6 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprDist, oprAduitHistory, oprDelete]);
        } else {
          arr0 = adpSiteNames[Data.site_id] || '';
          arr6 = oprView + oprLimit;
        }
      }
      arr = [{
        label: arr0
      }, {
        label: arr1
      }, {
        label: arr2
      }, {
        label: arr3
      }, {
        label: arr4
      }, {
        label: arr5
      }, {
        label: arr7
      }, {
        label: arr8
      }, {
        label: arr6
      }];
    }
    return arr;

    function getSingleItemMoreOperation(array) {
      var oprMore_detail = '<div class="opr_more_detail">' +
        '<div class="opr">' + i18n('SUCAI_MORE') + '<img src="image/sucai/more_up_arrow.png">' + '</div>' +
        array.join("") +
        '</div>';
      var oprMore = '<div class="opr_more">' +
        '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('SUCAI_MORE') + '<img src="image/sucai/more_down_arrow.png">' + '</span>' + oprMore_detail;
      '</div>'
      return oprMore
    }
  };
  sucai.formListDataForVideo = function (data) {
    var list_data = [];
    for(var i = 0; i < data.length; i++) {
      var record = this.formListRowDataForVideo(data[i], i);
      list_data.push(record);
    }
    return list_data;
  };
  sucai.formListRowDataForVideo = function (Data, i) {
    var result = [];
    var i;
    var arr1 = Data.name;
    var state = Data.state;
    var arr2 = this.getSucaiStatus(state);
    var arr3 = Data.user_name ? Data.user_name : "";
    var arr4 = Data.width + " × " + Data.height;
    var arr5 = Data.size;
    var arr6 = Data.level;

    var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('SUCAI_CHAKAN') + '</span>';
    var oprEdit, oprDelete;
    if((my.paas.user_type == "0") || (my.paas.user_type == "1")){
      oprEdit = '<span class="opr" data-type="edit" data-id="' + i + '">' + i18n('SUCAI_BIANJI') + '</span>';
      oprDelete = '<div class="opr" data-type="del" data-id="' + i + '">' + i18n('SUCAI_SHANCHU') + '</div>'
    } else {
      oprEdit = '<span class="opr disabled" data-type="" data-id="' + i + '">' + i18n('SUCAI_BIANJI') + '</span>';
      oprDelete = '<div class="opr disabled" data-type="" data-id="' + i + '">' + i18n('SUCAI_SHANCHU') + '</div>'
    }
    var oprLimit = '<span class="opr" data-type="limit" data-id="' + i + '">' + i18n('SUCAI_XIANCI') + '</span>';
    var oprDist =  '<div class="opr" data-type="dist" data-id="' + i + '">' + i18n('SUCAI_OPERATION_DIST') + '</div>';
    var oprAduitHistory =  '<div class="opr" data-type="aduitHistory" data-id="' + i + '">' + i18n('SUCAI_ADUITHISTORY') + '</div>';



    var arr0;
    var arr7;
    var arr;
    if(this.systemType == 0) {
      arr7 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprAduitHistory, oprDelete]);
      arr = [{
        label: arr1
      }, {
        label: arr2
      }, {
        label: arr3
      }, {
        label: arr4
      }, {
        label: arr5
      }, {
        label: arr6
      }, {
        label: arr7
      }];
    } else {
      if(this.systemType == 1) {
        if(Data.site_id == window.AdvSelfSiteId) {
          arr0 = (window.AdvSelfSiteName || '') + i18n('ADPOS_SITE_SELF_SUFFIX');
          arr7 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprDist, oprAduitHistory, oprDelete]);
        } else {
          arr0 = adpSiteNames[Data.site_id] || '';
          arr7 = oprView + oprLimit;
        }
      } else if(this.systemType == 2) {
        if(Data.site_id == window.AdvSelfSiteId) {
          arr0 = (window.AdvSelfSiteName || '') + i18n('ADPOS_SITE_SELF_SUFFIX');
          arr7 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprDist, oprAduitHistory, oprDelete]);
        } else {
          arr0 = adpSiteNames[Data.site_id] || '';
          arr7 = oprView + oprLimit;
        }
      }
      arr = [{
        label: arr0
      }, {
        label: arr1
      }, {
        label: arr2
      }, {
        label: arr3
      }, {
        label: arr4
      }, {
        label: arr5
      }, {
        label: arr6
      }, {
        label: arr7
      }];
    }
    return arr;

    function getSingleItemMoreOperation(array) {
      var oprMore_detail = '<div class="opr_more_detail">' +
        '<div class="opr">' + i18n('SUCAI_MORE') + '<img src="image/sucai/more_up_arrow.png">' + '</div>' +
        array.join("") +
        '</div>';
      var oprMore = '<div class="opr_more">' +
        '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('SUCAI_MORE') + '<img src="image/sucai/more_down_arrow.png">' + '</span>' + oprMore_detail;
      '</div>'
      return oprMore
    }
  };
  sucai.formListDataForSubtitle = function (data) {
    var list_data = [];
    for(var i = 0; i < data.length; i++) {
      var record = this.formListRowDataForSubtitle(data[i], i);
      list_data.push(record);
    }
    return list_data;
  };
  sucai.formListRowDataForSubtitle = function (Data, i) {
    var result = [];
    var i;
    var arr1 = Data.name;
    var state = Data.state;
    var arr2 = this.getSucaiStatus(state);
    var arr3 = Data.user_name ? Data.user_name : "";
    var arr4 = Data.subtitle_content;

    var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('SUCAI_CHAKAN') + '</span>';
    var oprEdit, oprDelete;
    if((my.paas.user_type == "0") || (my.paas.user_type == "1")){
      oprEdit = '<span class="opr" data-type="edit" data-id="' + i + '">' + i18n('SUCAI_BIANJI') + '</span>';
      oprDelete = '<div class="opr" data-type="del" data-id="' + i + '">' + i18n('SUCAI_SHANCHU') + '</div>'
    } else {
      oprEdit = '<span class="opr disabled" data-type="" data-id="' + i + '">' + i18n('SUCAI_BIANJI') + '</span>';
      oprDelete = '<div class="opr disabled" data-type="" data-id="' + i + '">' + i18n('SUCAI_SHANCHU') + '</div>'
    }
    var oprLimit = '<span class="opr" data-type="limit" data-id="' + i + '">' + i18n('SUCAI_XIANCI') + '</span>';
    var oprDist =  '<div class="opr" data-type="dist" data-id="' + i + '">' + i18n('SUCAI_OPERATION_DIST') + '</div>';
    var oprAduitHistory =  '<div class="opr" data-type="aduitHistory" data-id="' + i + '">' + i18n('SUCAI_ADUITHISTORY') + '</div>';

    var arr0;
    var arr5;
    var arr;
    if(this.systemType == 0) {
      arr5 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprAduitHistory, oprDelete]);
      arr = [{
        label: arr1
      }, {
        label: arr2
      }, {
        label: arr3
      }, {
        label: arr4
      }, {
        label: arr5
      }];
    } else {
      if(this.systemType == 1) {
        if(Data.site_id == window.AdvSelfSiteId) {
          arr0 = (window.AdvSelfSiteName || '') + i18n('ADPOS_SITE_SELF_SUFFIX');
          arr5 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprDist, oprAduitHistory, oprDelete]);
        } else {
          arr0 = adpSiteNames[Data.site_id] || '';
          arr5 = oprView + oprLimit;
        }
      } else if(this.systemType == 2) {
        if(Data.site_id == window.AdvSelfSiteId) {
          arr0 = (window.AdvSelfSiteName || '') + i18n('ADPOS_SITE_SELF_SUFFIX');
          arr5 = oprView + oprEdit + oprLimit + getSingleItemMoreOperation([oprDist, oprAduitHistory, oprDelete]);
        } else {
          arr0 = adpSiteNames[Data.site_id] || '';
          arr5 = oprView + oprLimit;
        }
      }
      arr = [{
        label: arr0
      }, {
        label: arr1
      }, {
        label: arr2
      }, {
        label: arr3
      }, {
        label: arr4
      }, {
        label: arr5
      }];
    }
    return arr;

    function getSingleItemMoreOperation(array) {
      var oprMore_detail = '<div class="opr_more_detail">' +
        '<div class="opr">' + i18n('SUCAI_MORE') + '<img src="image/sucai/more_up_arrow.png">' + '</div>' +
        array.join("") +
        '</div>';
      var oprMore = '<div class="opr_more">' +
        '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('SUCAI_MORE') + '<img src="image/sucai/more_down_arrow.png">' + '</span>' + oprMore_detail;
      '</div>'
      return oprMore
    }
  };
  sucai.getSucaiStatus = function (state) {
    var result;
    switch(state) {
    case "上传中":
      result = state;
      break;
    case "first_audit:prepare_audit":
      result = SUCAI_AUDIT_LEVEL !== 1 ? i18n('SUCAI_FIRSTAUDIT') : i18n('SUCAI_CHUSHEN');
      break;
    case "second_audit:prepare_audit":
      if(SUCAI_ENHANCE) {
        result = i18n('SUCAI_ZHONGSHEN');
      } else {
        result = i18n('SUCAI_BUMING')
      }
      break;
    case "third_audit:prepare_audit":
      if (SUCAI_ENHANCE) {
        result = i18n('SUCAI_FABU');
      } else {
      result = i18n('SUCAI_ZHONGSHEN');
      }
      break;
    case "deprecated":
      result = i18n('SUCAI_SHENHESHIBAI');
      break;
    case "enabled":
      result = i18n('SUCAI_YIQIYONG');
      break;
    case "disabled":
      result = i18n('SUCAI_JINYONG');
      break;
    case "发布中":
      result = i18n("SUCAI_PUBLISHING");
      break;
    case "发布失败":
      result = i18n("SUCAI_PUBLISHFAILED");
      break;
    case "已发布":
      result = i18n("SUCAI_PUBLISHED");
      break;
    case "上传失败":
      result = i18n("SUCAI_UPLOADFAILED");
      break;
    default:
      result = i18n('SUCAI_BUMING');
      break;
    }
    return result;
  };
  sucai.showPolicyBindingOperatingMsg = function (operation, callback) {
    if(operation.state == "deprecated") {
      callback && callback();
    } else {
      delete operation.state
      showPolicyBindingOperatingMsg(operation, callback);
    }
  };
  sucai.viewDistributeSites = function (id, name, site_id) {
    viewDistributeState('#ad-disites-layer', 'aditem', {
      id: id,
      name: name,
      site_id: site_id
    });
  };

  //网络请求处理集合
  sucai.addSucai = function (obj, callback) {
    var that = this;
    var data = obj;
    var result = false;
    var url = paasHost + paasAdvDomain + "/ads/aditem?" + that.token + new Date().toISOString()+"&user_name="+my.paas.user_name+"";
    $.ajax({
      type: "POST",
      async: false,
      url: url,
      contentType: "application/json",
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
      },
      dataType: "json",
      data: JSON.stringify(data),
    }).done(function (data) {
      if(callback) {
        callback(data.id);
      }
      result = true;
      return result;
    });
    return result;
  };
  sucai.deleteSucai = function (ad_id, callback) {
    var result = false;
    var that = this;
    var url = paasHost + paasAdvDomain + "/ads/aditem/" + ad_id + "?" + that.token + new Date().toISOString();
    $.ajax({
      type: "DELETE",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
      },
      contentType: "application/json",
      dataType: "json",
      complete: function (ajaxback) {
        if(ajaxback.status == 200 || ajaxback.statusText == "OK") {
          if(callback) {
            callback();
          }
          result = true;
        }
      }
    });
    return result;
  };
  sucai.reviseSucai = function (ad_id, obj, callback, updateSucaiState) {
    var data = obj;
    var result = false;
    var that = this;
    var url = paasHost + paasAdvDomain + "/ads/aditem/" + ad_id + "?" + that.token + new Date().toISOString()+"&user_name="+my.paas.user_name+"";
    $.ajax({
      type: "PUT",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
      },
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      complete: function (ajaxback) {
        if(ajaxback.status == 200 || ajaxback.statusText == "OK") {
          if(callback) {
            if(updateSucaiState) {
              that.updateSucaiState(ad_id);
            };
            callback();
          }
          result = true;
        } else {
          result = false;
        }
      }
    });
    return result;
  };
  sucai.getSucaiIMG = function (ad_id, callback) {
    var result = false;
    var that = this;
    var url = paasHost + paasAdvDomain + "/ads/aditem/" + ad_id + "?" + that.token + new Date().toISOString();
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data) {
      if(callback) {
        callback(data);
      }
      console.log(data);
      result = data;
    });
    return result;
  };
  sucai.toCDN = function (CDN_options, callback) {
    var result = false;
    var that = this;
    if((typeof  CDN_options.ad_id == "undefined") || (typeof  CDN_options.aqua_url == "undefined")){
      callback("toCDN error");
    }
    var url = paasHost + paasAdvDomain + "/ads/aditem/" + "publish/cdn?" + that.token + new Date().toISOString();
    var key;
    for(key in CDN_options) {
      if(key == "aqua_url") {
        url = url + "&" + key + "=" + encodeURIComponent(decodeURI(CDN_options[key]));
      } else {
        url = url + "&" + key + "=" + encodeURIComponent(CDN_options[key]);
      }
    }
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json",
      complete: function (ajaxback) {
        if(ajaxback.status == 200 || ajaxback.statusText == "OK") {
          if(callback) {
            callback(null);
          }
          result = true;
        } else {
          if(callback) {
            callback("toCDN error");
          }
          result = false;
        }
      }
    })
    return result;
  };

  sucai.getDataforIMGs = function (state, page, name, username) {
    var that = this;
    if(state) {
      var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?state=" + encodeURI(state) + "&type=img&" + that.token + new Date().toISOString();
    } else {
      var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?type=img&" + that.token + new Date().toISOString();
    }
    if(page) {
      url = url + "&start=" + (page - 1) * 11 + "&end=" + ((page) * 11 - 1);
    }
    if(name) {
      url = url + "&name=" + encodeURIComponent(name);
    }
    if(username) {
      url = url + "&user_name=" + encodeURIComponent(username);
    }
    if(that.sucai_site) {
      url = url + "&site_id=" + encodeURIComponent(that.sucai_site);
    }
    if(that.platform_current_id){
      url = url + "&platform_id_list=" + encodeURIComponent(that.platform_current_id);
    }
    var result = null;
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data, status, xhr) {
      result = data;
      var totalCount = xhr.getResponseHeader('x-aqua-total-count');
      result.allCount = totalCount;
    });
    return result;
  };
  sucai.getDataforVIDEOs = function (state, page, name, username) {
    var that = this;
    if(state) {
      var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?state=" + encodeURI(state) + "&type=video&" + that.token + new Date().toISOString();
    } else {
      var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?type=video&" + that.token + new Date().toISOString();
    }
    if(page) {
      url = url + "&start=" + (page - 1) * 11 + "&end=" + ((page) * 11 - 1);
    }
    if(name) {
      url = url + "&name=" + encodeURIComponent(name);
    }
    if(username) {
      url = url + "&user_name=" + encodeURIComponent(username);
    }
    if(that.sucai_site) {
      url = url + "&site_id=" + encodeURIComponent(that.sucai_site);
    }
    if(that.platform_current_id){
      url = url + "&platform_id_list=" + encodeURIComponent(that.platform_current_id);
    }
    var result = null;
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data, status, xhr) {
      result = data;
      var totalCount = xhr.getResponseHeader('x-aqua-total-count');
      result.allCount = totalCount;
    });
    return result;
  };
  sucai.getDataforSUBTITLEs = function (state, page, name, username) {
    var that = this;
    if(state) {
      var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?state=" + encodeURI(state) + "&type=subtitle&" + that.token + new Date().toISOString();
    } else {
      var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?type=subtitle&" + that.token + new Date().toISOString();
    }
    if(page) {
      url = url + "&start=" + (page - 1) * 11 + "&end=" + ((page) * 11 - 1);
    }
    if(name) {
      url = url + "&name=" + encodeURIComponent(name);
    }
    if(username) {
      url = url + "&user_name=" + encodeURIComponent(username);
    }
    if(that.sucai_site) {
      url = url + "&site_id=" + encodeURIComponent(that.sucai_site);
    }
    if(that.platform_current_id){
      url = url + "&platform_id_list=" + encodeURIComponent(that.platform_current_id);
    }
    var result = null;
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data, status, xhr) {
      result = data;
      var totalCount = xhr.getResponseHeader('x-aqua-total-count');
      result.allCount = totalCount;
    });
    return result;
  };

  sucai.updateSucaiState = function (ad_id, callback) {
    var result = false;
    var that = this;
    // var url = paasHost + paasDomain + "/auditflow/instance/ad_item/" + ad_id + "?" + that.token + new Date().toISOString();
    var url = `${paasHost + paasDomain}/auditflow/instance/${SUCAI_ENHANCE ? 'ad_item_2' : 'ad_item'}/${ad_id}?${that.token + new Date().toISOString()}`;
    $.ajax({
      type: "POST",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
      },
      contentType: "application/json",
      dataType: "json",
      complete: function (ajaxback) {
        if(ajaxback.status == 200 || ajaxback.statusText == "OK") {
          if(callback) {
            callback();
          }
          result = true;
        } else {
          result = false;
        }
      }
    });
    return result;
  };
  sucai.getSiteList = function () {
    if (AdvSystemType == 'solo') {
      adpSites = []
    } else {
    $.ajax({
      async: false,
      url: dmRoot + '/site',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).done(function (data) {
      adpSites = data;
      data = $.makeArray(data);
      data.forEach(function (site) {
        adpSiteNames[site.id] = site.name;
      });
    });
    }
  };
  sucai.showXianCiDialog = function (type, index) {
    var that = this;
    var data;
    data = this.table_component._data[index];
    if (AdvSystemType !== 'solo') {
      if(AdvCentralSiteId == AdvSelfSiteId) {
        var limitData = {
          ad_id: data.ad_id,
          needLimit: data.needLimit,
          total_quota: data.total_quota,
          placement_times: data.placement_times,
          site_assign_quota: data.site_assign_quota
        }
        if (data.site_id == AdvSelfSiteId) {
          if(data.needLimit == 1) {
            let callback = ()=>{
              let table = that.table_component;
              table.refreshList();
            }
            sucai.editLimit.init({
              el: "#sucai_container",
              uid: my.paas.user_id,
              title: data.name,
              edit: true,
              data: limitData,
              callback: callback
            });
          } else {
            sucai.openLimit.init({
              title: i18n("SUCAI_OPENLIMIT"),
              content: i18n("SUCAI_OPENLIMIT_HINT"),
              callback: () => {
                  let closecallback = ()=>{
                    let table = that.table_component;
                    table.refreshList();
                  }
                sucai.editLimit.init({
                  el: "#sucai_container",
                  uid: my.paas.user_id,
                  title: data.name,
                  edit: false,
                  data: limitData,
                  callback: closecallback
                });
              }
            });
          }
        } else {
          sucai.viewLimit.init({
            edit: false,
            uid: my.paas.user_id,
            data: limitData
          });
        }
      } else if(AdvCentralSiteId != AdvSelfSiteId) {
        var limitData = {
          ad_id: data.ad_id,
          needLimit: data.needLimit,
          total_quota: data.total_quota,
          teminal_quota: data.teminal_quota,
          teminal_period_quota: data.teminal_period_quota
        }
        if(data.site_id !== AdvSelfSiteId) {
          //不是自己创的，只有查看权限
          if(!data.needLimit) {
            sucai.alertDialog.init({
              title: i18n("SUCAI_LIMITNOTALLOWED"),
              text: i18n("SUCAI_LIMITNOTALLOWED_HINT")
            });
          } else {
            sucai.viewLimit.init({
              edit: false,
              data: limitData
            });
          }
        } else {
          //是自己创建的，拥有编辑权限
          if(!data.needLimit) {
            sucai.openLimit.init({
              title: i18n("SUCAI_OPENLIMIT"),
              content: i18n("SUCAI_OPENLIMIT_HINT"),
              callback: () => {
                sucai.viewLimit.init({
                  edit: true,
                  uid: my.paas.user_id,
                  data: limitData
                });
              }
            });
          } else {
            sucai.viewLimit.init({
              edit: true,
              uid: my.paas.user_id,
              data: limitData
            });
          }
      	}
      }
    } else {
      var limitData = {
        ad_id: data.ad_id,
        needLimit: data.needLimit,
        total_quota: data.total_quota,
        teminal_quota: data.teminal_quota,
        teminal_period_quota: data.teminal_period_quota
      }
      if(data.needLimit == 1) {
        let callback = ()=>{
          let table = that.table_component;
          table.refreshList();
        }
        sucai.viewLimit.init({
          el: "#sucai_container",
          edit: true,
          uid: my.paas.user_id,
          data: limitData,
          callback: callback
        });
      } else {
        sucai.openLimit.init({
          title: i18n("SUCAI_OPENLIMIT"),
          content: i18n("SUCAI_OPENLIMIT_HINT"),
          callback: () => {
              let closecallback = ()=>{
                let table = that.table_component;
                table.refreshList();
              }
            sucai.viewLimit.init({
              el: "#sucai_container",
              edit: true,
              uid: my.paas.user_id,
              data: limitData,
              callback: closecallback
            });
          }
        });
      }
    }
  };
  sucai.getUserType = function (user_ids, callback) {
    var that = this;
    if(user_ids.length == 0){
      callback && callback([]);
      return
    }
    var url = paasHost + paasDomain + "/users/public?" + that.token + new Date().toISOString();
    url = url + "&user_ids=" + user_ids.join(",");
    var result = null;
    $.ajax({
      type: "GET",
      async: true,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
      },
      contentType: "application/json",
      dataType: "json",
    }).done(function (data, status, xhr) {
      result = data || [];
      callback && callback(result);
    }).fail(function(xhr){
      result = [];
      callback && callback(result);
    });
    return result;
  };

  sucai.getDetalIds = function () {
    var that = this;
    var url = paasHost + paasAdvDomain + "/ads/contract/contracts?" + that.token + new Date().toISOString();
    if(that.platform_id){
      if(that.platform_id == "ALL"){
        url = url + "&platform_id_list=ALL," + encodeURIComponent(that.platform_current_id);
      } else {
        url = url + "&platform_id_list=" + encodeURIComponent(that.platform_current_id);
      }
    }
    var result = [];
    $.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      },
      contentType: "application/json",
      dataType: "json"
    }).done(function (data, status, xhr) {
      result = data;
    });
    return result;
  };
  sucai.getFootprintMarks = function () {
    var that = this;
    var objectType = 'application/cdmi-object';
    var url = my_aqua.netdiskRoot + "/" + that.user.footprint_mark_folder;
    var result = [];

    var callback = function (data) {
      data = data.objects || [];
      result = data.map(function(item){
        return{
          label: item.objectName,
          url: my_aqua.restRoot + url + item.objectName,
        }
      });
    };

    that.aquaUtil.query({
      objectType: objectType,
      scopeSpec: [{
        parentURI: '== ' + url,
      }],
      resultsSpec: {},
      preserve: true,
      async: false,
      callback: callback
    });
    return result;
  };


  sucai.initPage();
  return sucai;

})(jQuery);
