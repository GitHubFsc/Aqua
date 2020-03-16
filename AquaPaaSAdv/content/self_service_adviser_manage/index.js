var self_service_adviser_manage = {
  initPara: function (type) {
    this.type = type;
    var popup_audit_height = 644;
    var popup_beans = {
      url: "content/self_service_adviser_manage/popup_beans.html",
      width: 375,
      height: 194,
      context: this,
      callback: this.popup_beans_callback
    };
    var popup_enlarge = {
      url: "content/self_service_adviser_manage/popup_enlargePic.html",
      width: 800,
      height: 533,
      context: this,
      callback: this.popup_enlarge_callback
    };
    var popup_deny_reason = {
      url: "content/self_service_adviser_manage/popup_deny_reason.html",
      width: 760,
      height: 394,
      context: this,
      callback: this.popup_deny_reason_callback
    };
    var popupObject_delete = {
      url: "content/self_service_adviser_manage/pop_up_delete_dialog.html",
      width: 478,
      height: 268,
      context: this,
      callback: this.popup_delete_callback
    };
    var popupObject_reset = {
      url: "content/self_service_adviser_manage/pop_up_reset_dialog.html",
      width: 478,
      height: 268,
      context: this,
      callback: this.popup_reset_callback
    };
    this.dialog_delete = new PopupDialog(popupObject_delete);
    this.popup_beans = new PopupDialog(popup_beans);
    this.popup_deny_reason = new PopupDialog(popup_deny_reason);
    this.popup_enlarge = new PopupDialog(popup_enlarge);
    this.dialog_reset = new PopupDialog(popupObject_reset);
    this.userListFitTagsFilterCondition_originalData_curPage = {};//满足这些标签的用户清单
    this.uses_public_originalData_curpage = [];
    this.tagDatasMatchUserDatas = {};//tag搜索请求完成后，用返回的每条请求的唯一userid去发送user信息请求。
    //最后整合数据，user信息请求返回的数据按次序对应tag搜索请求每条userid,如果user信息请求返回缺少对应userid的话。则存为noUserMetaData。
    if (this.type == "aduit") {
      this.allTagsCategory = {//所有标签分类
        "group1": [{"name": "NEW", "title": i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS1")}, {
          "name": "WAITCONFIRM",
          "title": i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS2")
        }, {"name": "CONFIRMFAIL", "title": i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS3")}],
      };
      this.allTagsCategory_name_group1 = ["NEW", "WAITCONFIRM", "CONFIRMFAIL"];
    } else {
      this.allTagsCategory = {//所有标签分类
        "group1": [
          {"name": "NORMAL", "title": i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS4")}
        ],
        "group2": [{"name": "BANNED", "title": i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_FENJIN")}],
        "group3": [{"name": "DEBT", "title": i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_QIANFEI")}],
      };
      this.allTagsCategory_name_group1 = ["NORMAL"];
    }
    this.tagType = "selfregadvuser";
    this.rowIndex = 0;
    this.filterPara = "";//当前的搜索条件
    this.readyTagName = "";
    this.readyTagTitle = "";
    this.enlargePicObj = {};
		this.searchMetadata="AquaPaaSAdv_MiniP_StoreName";//默认搜索商家名称
		this.dataRequestMethod="notSearch";//搜索的列表和默认及下拉tag刷新的数据请求，是两组请求（mail:2019.8.20）
  },
  deleteTag: function (deleteTagName, index_) {
    var self = this;
    self.rowIndex = index_;
    var jq = jQuery;
    var type = self.tagType;
    var userListFitTagsFilterCondition_originalData_curPage = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod];
    if(!userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid){
			userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid=userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].user_id||""
		}
		var userid = userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid ? userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid : "";
    if (userid != "") {
      var deleteName = deleteTagName;
      var url_delete = paasHost + paasDomain + "/usertags/" + userid + "/" + type + "/" + deleteName;
      url_delete = url_delete + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "";
      jq.ajax({
        type: 'DELETE',
        async: false,
        url: url_delete,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url_delete),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        error: function (error) {
        }
      }).done(function (data, status, xhr) {
      })
      if (deleteTagName == "BANNED") {
        self.chargingRefresh(userid)
      }
      ;
      self.drawList_update();
    }
  },
  setTagOnly: function (readyTagName, readyTagTitle, index_) {
    var self = this;
    self.rowIndex = index_;
    var jq = jQuery;
    var self = this;
    var userListFitTagsFilterCondition_originalData_curPage = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod];
    
		if(!userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid){
			userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid=userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].user_id||""
		}
		var userid = userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid ? userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid : "";
		if (userid != "") {
      var type = self.tagType;
      var body_ = {
        "enable": true,
        "title": readyTagTitle
      };
      var url_ = paasHost + paasDomain + "/usertags/" + userid + "/" + type + "/" + readyTagName;
      url_ = url_ + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "";
      var request = new XMLHttpRequest();
      request.open("PUT", url_, false);
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader("x-aqua-sign", getPaaS_x_aqua_sign("PUT", url_));
      request.send(JSON.stringify(body_));
      if (request.readyState == 4 && (request.status > 199) && (request.status < 300)) {
        if (readyTagName == "BANNED") {
          self.chargingRefresh(userid);
        }
        self.drawList_update();
      }
    }
  },
  setTagAndDeleteOtherSurplusTags: function (self, readyTagName, readyTagTitle, metadata) {
    var jq = jQuery;
    var userListFitTagsFilterCondition_originalData_curPage = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod];
    if(!userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid){
			userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid=userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].user_id||""
		}
		var userid = userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid ? userListFitTagsFilterCondition_originalData_curPage[self.rowIndex].userid : "";
    if (userid != "") {
      var type = self.tagType;
      var body_ = {
        "enable": true,
        "title": readyTagTitle
      };
      if (metadata) {
        body_.metadata = metadata
      }
      var url_ = paasHost + paasDomain + "/usertags/" + userid + "/" + type + "/" + readyTagName;
      url_ = url_ + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "";
      var request = new XMLHttpRequest();
      request.open("PUT", url_, false);
      request.setRequestHeader("Accept", "application/json");
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader("x-aqua-sign", getPaaS_x_aqua_sign("PUT", url_));
      request.send(JSON.stringify(body_));
      if (request.readyState == 4 && (request.status > 199) && (request.status < 300)) {
        var len_ = userListFitTagsFilterCondition_originalData_curPage.length;
        for (var i = 0; i < len_; i++) {
          if ((userListFitTagsFilterCondition_originalData_curPage[i].userid == userid) && (userListFitTagsFilterCondition_originalData_curPage[i].name != readyTagName)) {
						if (jq.inArray(userListFitTagsFilterCondition_originalData_curPage[i].name, self.allTagsCategory_name_group1) != -1)//注册状态tag
            {
              var deleteName = userListFitTagsFilterCondition_originalData_curPage[i].name;
              var url_delete = paasHost + paasDomain + "/usertags/" + userid + "/" + type + "/" + deleteName;
              url_delete = url_delete + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "";
              jq.ajax({
                type: 'DELETE',
                async: false,
                url: url_delete,
                headers: {
                  'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url_delete),
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                error: function (error) {
                }
              }).done(function (data, status, xhr) {

              })
            }
          }
        }
        ;
        if (readyTagName == "NORMAL" || (readyTagName == "CONFIRMFAIL")) {//审核通过或审核失败
          self.chargingRefresh(userid);
        }
        ;
        self.drawList_update();
      }
    }
    ;
  },
  chargingRefresh: function (userid, callback) {
    var self = this;
    var url_ = paasHost + "/aquapaas_adv/rest/ads/charging/refresh/user/state/" + userid + "";
    url_ = url_ + "?user_id=" + my.paas.user_id;
    url_ = url_ + "&access_token=" + my.paas.access_token;
    url_ = url_ + "&app_key=" + paasAppKey;
    url_ = url_ + "&timestamp=" + new Date().toISOString();
    jQuery.ajax({
      type: 'GET',
      async: false,
      url: url_,
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url_),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      error: function (error) {
      }
    }).done(function () {
    })
  },
  popup_audit_bindEvent: function (status) {
    var jq = jQuery;
    var self = this;
    var allTagsCategory = self.allTagsCategory;
    jq("#popupAuditClose").unbind().bind('click', function () {
      self.popup_audit.close()
    })
    if (this.popup_audit_type == "audit") {
      jq("#popupAudit_popupButton_pass").unbind().bind('click', function () {
        var readyTagName = "NORMAL";//normal;
        var readyTagTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS4");//normal;
        self.setTagAndDeleteOtherSurplusTags(self, readyTagName, readyTagTitle);
        self.popup_audit.close()
      })
      jq("#popupAudit_popupButton_deny").unbind().bind('click', function () {
        var readyTagName = "CONFIRMFAIL";//normal;
        var readyTagTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS3");//normal;
        self.readyTagName = readyTagName;
        self.readyTagTitle = readyTagTitle;
        self.popup_audit.close();
        self.openPopup_deny_reason();
      })
    }
    else {
      jq("#popupAudit_popupButton_close").unbind().bind('click', function () {
        self.popup_audit.close()
      })
    }
  },
  popup_beans_initContentsAndUI: function () {
    var self = this;
    var jq = jQuery;
    var rowIndex = this.rowIndex;
    var tagDatasMatchUserDatas = this.tagDatasMatchUserDatas[this.dataRequestMethod];
    if (tagDatasMatchUserDatas[rowIndex] && tagDatasMatchUserDatas[rowIndex].userMetaData) {
      var userid = tagDatasMatchUserDatas[rowIndex].userid ? tagDatasMatchUserDatas[rowIndex].userid : "";
      var url_ = paasHost + "/aquapaas/rest/score/" + userid + "";
      url_ = url_ + "?user_id=" + my.paas.user_id;
      url_ = url_ + "&access_token=" + my.paas.access_token;
      url_ = url_ + "&app_key=" + paasAppKey;
      url_ = url_ + "&timestamp=" + new Date().toISOString();
      jQuery.ajax({
        type: 'GET',
        async: false,
        url: url_,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url_),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        error: function (error) {
        }
      }).done(function (data, status, xhr) {
        if (typeof data.coin != "undefined") {
          document.getElementById("popupScore_text").value = data.coin
        }
      })
    }
  },
  popup_beans_bindEvent: function () {
    var jq = jQuery;
    var self = this;
    jq("#popup_beans_close_icon,#popup_beans_close_button").click(function () {
      self.popup_beans.close()
    });
  },
  popup_enlarge_bindEvent: function () {
    var jq = jQuery;
    var self = this;
    jq("#popup_enlarge_close_icon").click(function () {
      self.popup_enlarge.close();
      self.popup_audit.open();
    });
		jq("#enlarge_confirm_button").click(function () {
		  var url=jq("#popupAudit_enlargeContainer").find("img").attr("src");
			var fullScreenObj = {
				url: url,
				callback:function(){
					jq("#self_service_adviser_manage_full_screen_close").click(function () {
						self.fullScreenObj.popup_full_screen.close();
						self.enlargePicDialog();
					})
				}
			};
			self.fullScreenObj = new self_service_adviser_full_screen(fullScreenObj);
			self.fullScreenObj.init();
		});
  },
  popup_deny_reason_bindEvent: function () {
    var jq = jQuery;
    var self = this;
    jq("#popup_deny_reason_close_icon,#popup_deny_reason_close_button").click(function () {
      self.popup_deny_reason.close();
      self.popup_audit.open();
    });
    jq("#popup_deny_reason_submit_button").click(function () {
      var denyReson = {"audit_fail_reason": jq("#popup_deny_reason_textArea").val()};
      self.setTagAndDeleteOtherSurplusTags(self, self.readyTagName, self.readyTagTitle, denyReson);
      self.popup_deny_reason.close();
    });
  },
  popup_enlarge_UI: function () {
    var self = this;
    var jq = jQuery;
    var storeNamePicContainer = document.getElementById("popupAudit_enlargeContainer");
    document.getElementById("popupEnlargePic_title").innerHTML = self.enlargePicObj.title;
    var storeNamePicH = storeNamePicContainer.offsetHeight;
    var storeNamePicW = storeNamePicContainer.offsetWidth;
    if (self.enlargePicObj.src != "") {
      var img = new Image();
      img.src = self.enlargePicObj.src;
      img.style.visibility = "hidden";
      storeNamePicContainer.appendChild(img);
      img.onload = function () {
        var imghw = self.autoSize(img.height, img.width, storeNamePicH, storeNamePicW);
        img.style.height = imghw[0];
        img.style.width = imghw[1];
        img.style.marginTop = (0 - 0.5 * parseInt(imghw[0]) + "px");
        img.style.marginLeft = (0 - 0.5 * parseInt(imghw[1]) + "px");
        img.style.top = "50%";
        img.style.left = "50%";
        img.style.position = "absolute";
        img.style.visibility = "visible";
      };
    }
  },
  popup_audit_UI: function () {

    var jq = jQuery;
    var popup_audit_type = this.popup_audit_type;
    switch (popup_audit_type) {
      case "audit":
        jq("#popupAudit_popupButton_deny,#popupAudit_popupButton_pass").show();
        jq("#popupAudit_popupButton_close").hide();
        jq("#popupAudit_title").text("审核自助用户")
        break;
      case "view":
        jq("#popupAudit_popupButton_deny,#popupAudit_popupButton_pass").hide();
        jq("#popupAudit_popupButton_close").show();
        jq("#popupAudit_title").text("查看详情")
        break;
      default:
        break;
    };
    var tagDatasMatchUserDatas = this.tagDatasMatchUserDatas[this.dataRequestMethod];
    var rowIndex = this.rowIndex;
    if (tagDatasMatchUserDatas[rowIndex] && tagDatasMatchUserDatas[rowIndex].userMetaData) {
      var userid = tagDatasMatchUserDatas[rowIndex].userid ? tagDatasMatchUserDatas[rowIndex].userid : "";
      var userMetaData = tagDatasMatchUserDatas[rowIndex].userMetaData ? tagDatasMatchUserDatas[rowIndex].userMetaData : "";
      var location = tagDatasMatchUserDatas[rowIndex].userDatasFormat_userLocationUnit ? tagDatasMatchUserDatas[rowIndex].userDatasFormat_userLocationUnit : "";
      var user_name = tagDatasMatchUserDatas[rowIndex].user_name ? tagDatasMatchUserDatas[rowIndex].user_name : "";
      var createTime = tagDatasMatchUserDatas[rowIndex].createTime ? tagDatasMatchUserDatas[rowIndex].createTime : "";
      this.fill_commonPartIn_auditAndView(userMetaData, location, userid, user_name, createTime);
    }
    if (this.popup_audit_type == "audit") {
      jq('#popup_audit .row1').hide();
      jq('#popup_audit .customizeRow1').hide();
    }
    /*
    if(this.popup_audit_type == "view"){
      jQuery("#popup_audit .content").mCustomScrollbar({
        theme: "light"
      });
    }
    */
  },
  appendImgToContainer: function (imgUrlA, container, imgUrlB, imgTitle) {
    var self = this;
    var jq = jQuery;
    var storeNamePicContainer = document.getElementById(container);
    document.getElementById(container).innerHTML = "";
    var storeNamePicH = storeNamePicContainer.offsetHeight;
    var storeNamePicW = storeNamePicContainer.offsetWidth;
    var img = new Image();
    img.src = imgUrlA;
    img.style.visibility = "hidden";
    img.onload = function () {
      document.getElementById(container).innerHTML = "";
      jq("#" + container + "").append("<div class=\"popup_audit_image_title\" style=\"display:none\">" + imgTitle + "</div>").css("cursor", "pointer");
      storeNamePicContainer.appendChild(img);
      var imghw = self.autoSize(img.height, img.width, 167, 300);
      img.style.height = imghw[0];
      img.style.width = imghw[1];
      //img.style.marginTop = (0 - 0.5 * parseInt(imghw[0]) + "px");
      //img.style.marginLeft = (0 - 0.5 * parseInt(imghw[1]) + "px");
      //img.style.top = "0%";
      //img.style.left = "0%";
      //img.style.position = "absolute";
      img.style.visibility = "visible";
      img.style.display = "block";
      self.addEnlargButton(container, "success");
    };
    img.onerror = function () {
      var imgB = new Image();
      imgB.src = imgUrlB;
      imgB.style.visibility = "hidden";
      document.getElementById(container).innerHTML = "";
      jq("#" + container + "").append("<div class=\"popup_audit_image_title\" style=\"display:none\">" + imgTitle + "</div>").css("cursor", "pointer");
      storeNamePicContainer.appendChild(imgB);
      imgB.onload = function () {
        var imghw = self.autoSize(imgB.height, imgB.width, storeNamePicH, storeNamePicW);
        imgB.style.height = imghw[0];
        imgB.style.width = imghw[1];
        imgB.style.marginTop = (0 - 0.5 * parseInt(imghw[0]) + "px");
        imgB.style.marginLeft = (0 - 0.5 * parseInt(imghw[1]) + "px");
        imgB.style.top = "50%";
        imgB.style.left = "50%";
        imgB.style.position = "absolute";
        imgB.style.visibility = "visible";
        self.addEnlargButton(container, "success");
      };
      imgB.onerror = function () {
        imgB.style.display = "none";
        self.addEnlargButton(container, "error");
      }
    };
  },
  addEnlargButton: function (containerid, status) {
    var jq = jQuery;
    var html_;
    if (status == "error") {
      html_ = "<div id=\"" + containerid + "_enlarge\" onclick=\"self_service_adviser_manage.enlargePic(this,\'" + status + "\')\" style=\"position:absolute;top:0px;left:0px;width:100%;height:100%;min-width: 167px\"><div style=\"position:relative;width:100%;height:100%\"><image style=\"position:absolute;left:50%;top:50%;margin-left:-30px;margin-top:-30px\" src=\"content/self_service_adviser_manage/image/enlargeIcon.png\"/></div></div></div>";
    } else {
      html_ = "<div id=\"" + containerid + "_enlarge\" onclick=\"self_service_adviser_manage.enlargePic(this,\'" + status + "\')\" style=\"position:absolute;top:0px;left:0px;width:100%;height:100%\"><div style=\"position:relative;width:100%;height:100%\"><image style=\"position:absolute;left:50%;top:50%;margin-left:-30px;margin-top:-30px\" src=\"content/self_service_adviser_manage/image/enlargeIcon.png\"/></div></div></div>";
    }
    jq("#" + containerid + "").append(html_)
  },
  enlargePic: function (obj, status) {
	  this.enlargePicDataObj=obj;
		this.enlargePicDataStatus=status;
		this.enlargePicDialog();
  },
	enlargePicDialog:function(){
	  var obj=this.enlargePicDataObj;
		var status=this.enlargePicDataStatus;
		var jq = jQuery;
    var img_ = jq(obj).parent().children()[1];
    var src_ = (status == "error") ? "" : jq(img_).attr("src");
    this.enlargePicObj = {
      "src": src_,
      "title": jq(obj).parent().find(".popup_audit_image_title").text()
    };
    this.popup_enlarge.open();
	},
  autoSize: function (imgH, imgW, containH, containW) {
    var w = 0;
    var h = 0;
    if (imgW < containW && imgH < containH) {
      w = imgW;
      h = imgH;
    }
    else {
      if (containW / containH <= imgW / imgH) {
        w = containW;
        h = containW * (imgH / imgW);
      }
      else {
        w = containH * (imgW / imgH);
        h = containH;
      }
    }
    return [h + "px", w + "px"]
  },
  fill_commonPartIn_auditAndView: function (userMetaData, location, userid, user_name, createTime) {
    var jq = jQuery;
    jq("#popupAudit_username").val(user_name);
    try {
      jq("#popupAudit_createTime").val((new Date(createTime)).toISOString().split('T')[0]);
    } catch (e) {
      jq("#popupAudit_createTime").val("");
    }
    jq("#popupAudit_companyName").val(userMetaData.AquaPaaSAdv_MiniP_StoreName ? userMetaData.AquaPaaSAdv_MiniP_StoreName : "");
    jq("#popupAudit_industry").val(userMetaData.AquaPaaSAdv_MiniP_Industry ? userMetaData.AquaPaaSAdv_MiniP_Industry : "");
    jq("#popupAudit_Address").val(location.address ? location.address : "");
    jq("#popupAudit_contactName").val(userMetaData.AquaPaaSAdv_MiniP_ContactName ? userMetaData.AquaPaaSAdv_MiniP_ContactName : "");
    jq("#popupAudit_contactPhone").val(userMetaData.AquaPaaSAdv_MiniP_ContactPhone ? userMetaData.AquaPaaSAdv_MiniP_ContactPhone : "");
    jq("#popupAudit_promote_code").val(userMetaData.AquaPaaSAdv_MiniP_PromoCode||"");
		var picParentUrl = aquaHost + "/aqua/rest/cdmi" + my_aqua.netdiskRoot + "/" + storage_self_service_adviser_images_folder + userid + "/";
    var url_storeName1 = this.combineFlie_url(picParentUrl + "store.jpg", "GET");//考虑到手机或普通相机拍照后的照片都是JPG后缀的，所以优先使用jpg(如果没有jpg用png)。鉴于目前最常见的是jpg和png，假定用户只会上传这2种扩展名的图片，至于其它扩展名不做处理。
    var url_storeName2 = this.combineFlie_url(picParentUrl + "store.png", "GET");
    var url_id_front1 = this.combineFlie_url(picParentUrl + "id_front.jpg", "GET");
    var url_id_front2 = this.combineFlie_url(picParentUrl + "id_front.png", "GET");
    var url_id_back1 = this.combineFlie_url(picParentUrl + "id_back.jpg", "GET");
    var url_id_back2 = this.combineFlie_url(picParentUrl + "id_back.png", "GET");
    var url_id_license1 = this.combineFlie_url(picParentUrl + "license.jpg", "GET");
    var url_id_license2 = this.combineFlie_url(picParentUrl + "license.png", "GET");
    this.appendImgToContainer(url_storeName1, "popupAudit_storeNamePic", url_storeName2, i18n("SELF_SERVICE_ADVISER_MANAGE_MENLIANZHAOPIAN"));
    this.appendImgToContainer(url_id_front1, "popupAudit_id_front_Pic", url_id_front2, i18n("SELF_SERVICE_ADVISER_MANAGE_SHENFENZHENGZHAOPIAN"));
    this.appendImgToContainer(url_id_back1, "popupAudit_id_back_Pic", url_id_back2, i18n("SELF_SERVICE_ADVISER_MANAGE_SHENFENZHENGZHAOPIAN"));
    this.appendImgToContainer(url_id_license1, "popupAudit_license", url_id_license2, "营业执照照片");
  },
  combineFlie_url: function (url_, method) {
    var url = encodeURI(url_);
    var method = method;
    try {
      var arrObj = url.split("//");
      var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
      var tmp2 = arrObj[1].indexOf("?");
      var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) - tmp1);
      var nowDateTime = new Date().getTime();
      var StringToSign = "GET\n\n" + nowDateTime + "\n" + urlPath;//因为content-type是空，所以GET\n\n。
      var ret = url;
      if (tmp2 < 0) {
        ret += "?";
      } else {
        ret += "&";
      }
      ret += "aquatoken=" + encodeURIComponent(my_aqua.accessKeyId) + ":" + encodeURIComponent(my.base64Encode(str_hmac_sha1(my_aqua.secretAccessKey, StringToSign)));
      ret += "&xaquadate=" + nowDateTime;
      return ret;
    } catch (e) {
      return "";
    }
  },
  popup_audit_callback: function () {
    this.popup_audit_UI();
    this.popup_audit_bindEvent();
  },
  popup_enlarge_callback: function () {
    this.popup_enlarge_UI();
    this.popup_enlarge_bindEvent();
  },
  popup_beans_callback: function () {
    this.popup_beans_initContentsAndUI();
    this.popup_beans_bindEvent();
  },
	editUser:function(currentUserId,sendDataObj,callback){
		var url = paasHost + "/aquapaas/rest/users/other/"+currentUserId;
		url +="?user_id="+my.paas.user_id+"&access_token="+my.paas.access_token+""+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
		jQuery.ajax({
			type: 'PUT',
			async: true,
			url: url,
			data: JSON.stringify(sendDataObj),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'application/json',
				//'x-third-party': 'aqua',
				'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
			}
		}).done(function () {
			callback()
		}).always(function () {
			callback()
		})
	},
  popup_deny_reason_callback: function () {
    this.popup_deny_reason_bindEvent();
  },
  openPopup_audit: function (type) {
    this.popup_audit.open();
  },
  openPopup_beans: function (type) {
    this.popup_beans.open();
  },
  openPopup_deny_reason: function (type) {
    this.popup_deny_reason.open();
  },
  removeRepeatEleInArray: function (tagsUsedSort) {
    var tagsUsedSortIndexDistinct = [];
    for (var w = 0; w < tagsUsedSort.length; w++) {
      var count = 0;
      for (var y = 0; y < tagsUsedSortIndexDistinct.length; y++) {
        if (tagsUsedSortIndexDistinct[y] == tagsUsedSort[w]) {
          count++;
        }
      }
      if (count < 1)
        tagsUsedSortIndexDistinct.push(tagsUsedSort[w]);
    }
    return (tagsUsedSortIndexDistinct)
  },
  drawTopMenu: function () {
    var jq = jQuery;
    var self = this;
    var allTagsCategory = this.allTagsCategory;
    var onmouseout_ = "javascript:this.style.color='#737373'";
    var onmouseover_ = "javascript:this.style.color='#5ea0c0'";
    (self.type !== "aduit") && jq("#selfServiceAdviserManage_menu").append("<div onclick=\"self_service_adviser_manage.filter_and_drawList('all','所有状态')\" onmouseover=" + onmouseover_ + " onmouseout=" + onmouseout_ + " class=\"dropDownBodyRow\">所有状态</div>")
    for (var i in allTagsCategory) {
      for (var j = 0, len = allTagsCategory[i].length; j < len; j++) {
        jq("#selfServiceAdviserManage_menu").append("<div onclick=\"self_service_adviser_manage.filter_and_drawList(\'" + allTagsCategory[i][j]["name"] + "\',\'" + allTagsCategory[i][j]["title"] + "\')\" onmouseover=" + onmouseover_ + " onmouseout=" + onmouseout_ + " class=\"dropDownBodyRow\">" + allTagsCategory[i][j]["title"] + "</div>")
      }
    }
    jq("#selfServiceAdviserManage_top").unbind().bind('click', function () {
      self.toggleDisplay("selfServiceAdviserManage_menu")
    })
    //selfServiceAdviserManage_menu
  },

  toggleDisplay: function (containerid) {
    var ele = document.getElementById(containerid);
    if (ele.style.display == "none") {
      ele.style.display = "block"
    }
    else {
      ele.style.display = "none"
    }
  },
  filter_and_drawList: function (tagName, title) {
    this.dataRequestMethod="notSearch";  
    document.getElementById("selfServiceAdviserManage_menu").style.display = "none";
    document.getElementById("selfServiceAdviserManage_title").innerHTML = title;
    var filterPara = "";
    if (tagName == "all") {
      filterPara = this.filterConditionDefaultOpenPage();
    }
    else {
      filterPara = "tags_and=";
      filterPara = filterPara + encodeURIComponent(this.tagType + "/" + tagName);
    }
    this.filterPara = filterPara;
    if ((tagName == "BANNED") || (tagName == "DEBT")) {
      this.drawList_begin(filterPara, "notRegisterTag", tagName);
    } else if ((tagName == "NORMAL") || (tagName == "NEW") || (tagName == "WAITCONFIRM") || (tagName == "CONFIRMFAIL")){
      this.drawList_begin(filterPara, "registerTag", tagName);
    }else{
      this.drawList_begin(filterPara, "allTag", tagName);
    }
  },
  drawList_update: function () {//需要停留再当前页
    var currPage = this.currPage[this.dataRequestMethod];
    this.list_selfServiceUser[this.dataRequestMethod].currPage = currPage;
    this.list_selfServiceUser[this.dataRequestMethod].refreshList()
  },
  listUserTagsByUserName: function (username) {
    var returnData = [];
    var tagType = this.tagType;
    var url_ = paasHost + "/aquapaas/rest/usertags/" + tagType + "/tags?user_name=" + username + "";
    url_ = url_ + "&app_key=" + paasAppKey;
    url_ = url_ + "&timestamp=" + new Date().toISOString();
    url_ = url_ + "&user_id=" + my.paas.user_id;
    url_ = url_ + "&access_token=" + my.paas.access_token;
    var xhr_ = new XMLHttpRequest();
    var method_ = "GET";
    xhr_.open(method_, url_, false);
    xhr_.setRequestHeader("x-aqua-sign", getPaaS_x_aqua_sign('HEAD', url_));
    xhr_.send();
    if (xhr_.readyState == 4 && ( (xhr_.status > 199) && (xhr_.status < 300) ) && (xhr_.responseText)) {
      returnData = JSON.parse(xhr_.responseText)
    }
    return returnData
  },
	
  //绘制列表
  drawList_begin: function (filterCondition, drawlistTagType, surplusTagName) {
    var self = this;
    var jq = jQuery;
    var filterCondition = filterCondition;
    //var titles_array=[i18n('SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG'),i18n('SELF_SERVICE_ADVISER_MANAGE_SUOSHUHANGYE'),i18n('SELF_SERVICE_ADVISER_MANAGE_SUOZAIQUYU'),i18n('SELF_SERVICE_ADVISER_MANAGE_XIANGXIDIZHI'),i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING'),i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIFANGSHI'),i18n('SELF_SERVICE_ADVISER_MANAGE_ZHUCEZHUANGTAI'),i18n('SELF_SERVICE_ADVISER_MANAGE_QIANFEIZHUANGTAI'),i18n('SELF_SERVICE_ADVISER_MANAGE_JINYONGZHUANGTAI'),i18n('SELF_SERVICE_ADVISER_MANAGE_CAOZUO')];
    var titles_array = [
      i18n('SELF_SERVICE_ADVISER_MANAGE_YONGHUMING'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_SUOSHUHANGYE'),
      //i18n('SELF_SERVICE_ADVISER_MANAGE_XIANGXIDIZHI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIFANGSHI'),
      //i18n('SELF_SERVICE_ADVISER_MANAGE_ZHUCEZHUANGTAI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_QIANFEIZHUANGTAI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_JINYONGZHUANGTAI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_CAOZUO')
    ];
    if (this.type == "aduit") {
      titles_array = [
        i18n('SELF_SERVICE_ADVISER_MANAGE_YONGHUMING'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_SUOSHUHANGYE'),
        //i18n('SELF_SERVICE_ADVISER_MANAGE_XIANGXIDIZHI'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIFANGSHI'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_ZHUCEZHUANGTAI'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_CAOZUO')
      ];
    }
    var titles_label_array = (titles_array.map(function (item) {
      return {label: item};
    }));
    var list_row = 11;
    var list_selfServiceUser = new StyledList({
      rows: list_row,
      columns: titles_array.length,
      containerId: 'selfServiceAdviserManage_tableContainer',
      titles: titles_label_array,
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
        columnsWidth: (self.type == "aduit") ? [0.105, 0.165, 0.117, 0.110, 0.167, 0.138, 0.197] : [0.1056, 0.130, 0.1089, 0.076, 0.117, 0.117, 0.111, 0.232]
      }
    });
		this.list_selfServiceUser={};
		
    this.list_selfServiceUser[this.dataRequestMethod] = list_selfServiceUser;

    this.list_selfServiceUser[this.dataRequestMethod].getPageData = function (pageNumber) {
      var listSelf = this;
      var start = (pageNumber - 1) * list_row;
      var end = pageNumber * list_row - 1;
			self.currPage={};
      self.currPage[self.dataRequestMethod] = (pageNumber - 1);
      var listDatas = [];
      var url_ = paasHost + paasDomain + "/usertags/query";
      url_ = url_ + "?" + filterCondition;
      url_ = url_ + "&user_id=" + my.paas.user_id;
      url_ = url_ + "&access_token=" + my.paas.access_token;
      url_ = url_ + "&app_key=" + paasAppKey;
      url_ = url_ + "&timestamp=" + new Date().toISOString();
      url_ += '&start=' + start;
      url_ += '&end=' + end;
      jQuery.ajax({
        type: 'GET',
        async: false,
        url: url_,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url_),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        error: function (error) {
        }
      }).done(function (data, status, xhr) {
        if (data) {
          var totalCount = xhr.getResponseHeader('x-aqua-total-count');
          listSelf.onTotalCount(totalCount || 0);
					self.userListFitTagsFilterCondition_originalData_curPage={};				
          self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod] = data;
          self.getUserMetaDataByRequest1(data, self);
          var tagDatasMatchUserDatas = [];
          var userListFitTagsFilterCondition_originalData_curPage = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod];
          var uses_public_originalData_curpage = self.uses_public_originalData_curpage;//这个对象仅在获取列表数据时用，点击按钮时没用到。
          var userListFitTagsFilterCondition_originalData_len = userListFitTagsFilterCondition_originalData_curPage.length;
          var uses_public_originalData_len = uses_public_originalData_curpage.length;
          for (var i = 0; i < userListFitTagsFilterCondition_originalData_len; i++) {
            var matchCount = 0;
            var userDatasFormat_userMetaDataUnit = "noUserMetaData";
            var userDatasFormat_userLocationUnit = "noLocation";
            var useridInTagQuery_exist_in_publicRequest = "userNotExist";
            var isTagUserHasUserNameInUses_public_originalData = "";
            for (var j = 0; j < uses_public_originalData_len; j++) {
              if (userListFitTagsFilterCondition_originalData_curPage[i].userid == uses_public_originalData_curpage[j].user_id) {
                useridInTagQuery_exist_in_publicRequest = "userExist";
                if (uses_public_originalData_curpage[j].metadata) {
                  userDatasFormat_userMetaDataUnit = uses_public_originalData_curpage[j].metadata;
                }
                if (uses_public_originalData_curpage[j].location) {
                  userDatasFormat_userLocationUnit = uses_public_originalData_curpage[j].location;
                }
                if (uses_public_originalData_curpage[j].user_name) {
                  isTagUserHasUserNameInUses_public_originalData = uses_public_originalData_curpage[j].user_name;
                }
                if (uses_public_originalData_curpage[j].createTime) {
                  var createTime = uses_public_originalData_curpage[j].createTime;
                }
              }
            }
            tagDatasMatchUserDatas.push({
              "user_name": isTagUserHasUserNameInUses_public_originalData,
              "createTime": createTime,
              "userid": userListFitTagsFilterCondition_originalData_curPage[i].userid,
              "userMetaData": userDatasFormat_userMetaDataUnit,
              userDatasFormat_userLocationUnit
            })
            self.tagDatasMatchUserDatas[self.dataRequestMethod] = tagDatasMatchUserDatas;
            var companyName = (userDatasFormat_userMetaDataUnit == "noUserMetaData") ? "" : (userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_StoreName ? userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_StoreName : "");
            userListFitTagsFilterCondition_originalData_curPage[i].storeNickName = companyName;
            var AquaPaaSAdv_MiniP_Industry = (userDatasFormat_userMetaDataUnit == "noUserMetaData") ? "" : (userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_Industry ? userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_Industry : "");
            var AquaPaaSAdv_MiniP_ContactName = (userDatasFormat_userMetaDataUnit == "noUserMetaData") ? "" : (userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_ContactName ? userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_ContactName : "");
            var AquaPaaSAdv_MiniP_ContactPhone = (userDatasFormat_userMetaDataUnit == "noUserMetaData") ? "" : (userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_ContactPhone ? userDatasFormat_userMetaDataUnit.AquaPaaSAdv_MiniP_ContactPhone : "");
            var location_address = (userDatasFormat_userLocationUnit == "noLocation") ? "" : (userDatasFormat_userLocationUnit.address ? userDatasFormat_userLocationUnit.address : "");
            var registerStatus = "";
            var registerStatus_name = "";
            var debtStatusName = "";
            var debtStatusTitle = "";
            var bannedStatusTitle = "";//当前禁用启用状态
            var bannedStatusName = "";
            var listUserTagsByUserName = [];
            if (drawlistTagType == "registerTag") {//搜索tag为注册类标签
              registerStatus_name = userListFitTagsFilterCondition_originalData_curPage[i].name;
              var allTagsCategory = self.allTagsCategory.group1;
              for (var m = 0; m < allTagsCategory.length; m++) {
                if (allTagsCategory[m].name == registerStatus_name) {
                  registerStatus = allTagsCategory[m].title;
                  break
                }
              }
              //以下为用一条请求搜索用户的封禁和欠费标签
              listUserTagsByUserName = self.listUserTagsByUserName(isTagUserHasUserNameInUses_public_originalData);
            }
            else if (drawlistTagType == "allTag") {
              registerStatus_name = userListFitTagsFilterCondition_originalData_curPage[i].name;
              var allTagsCategory = self.allTagsCategory.group1.concat(self.allTagsCategory.group2).concat(self.allTagsCategory.group3);
              //目前只有自主用户的“所有”状态才会用到allTag，此时不需要显示registerStatus，所以registerStatus全部为空字符串
              registerStatus = "";
              //关于封禁和欠费的自主用户 如何判定是["NEW","WAITCONFIRM","CONFIRMFAIL","NORMAL"]的哪个，这个继续按照原有的代码逻辑来做。
              listUserTagsByUserName = self.listUserTagsByUserName(isTagUserHasUserNameInUses_public_originalData);
              var registerStatusArray = ["NEW","WAITCONFIRM","CONFIRMFAIL","NORMAL"]
              if((registerStatus_name == "BANNED") || (registerStatus_name == "DEBT")){
                for (var k = 0; k < listUserTagsByUserName.length; k++) {
                  if (listUserTagsByUserName[k]["name"]) {
                    if (jq.inArray(listUserTagsByUserName[k]["name"], registerStatusArray ) != -1) {
                      registerStatus_name = listUserTagsByUserName[k]["name"];
                    }
                  }
                }
              }
            } else {
              listUserTagsByUserName = self.listUserTagsByUserName(isTagUserHasUserNameInUses_public_originalData);
              var registerStatusArray = ["NEW","WAITCONFIRM","CONFIRMFAIL","NORMAL"]
              var registerStatusObjArray = [{"name":"NEW","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS1")},{"name":"WAITCONFIRM","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS2")},{"name":"CONFIRMFAIL","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS3")},{"name":"NORMAL","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS4")}];
                for (var k = 0; k < listUserTagsByUserName.length; k++) {
                if (listUserTagsByUserName[k]["name"]) {
                  if (jq.inArray(listUserTagsByUserName[k]["name"], registerStatusArray) != -1) {
                    var index_allTagsCategory = jq.inArray(listUserTagsByUserName[k]["name"], registerStatusArray);
                    registerStatus = registerStatusObjArray[index_allTagsCategory]["title"];
                    registerStatus_name = listUserTagsByUserName[k]["name"];
                  }
                }
              }
            }

            for (var k = 0; k < listUserTagsByUserName.length; k++) {
              if (listUserTagsByUserName[k]["name"]) {
                var listUserTagsByUserName_name = listUserTagsByUserName[k]["name"];
                switch (listUserTagsByUserName_name) {
                  case "BANNED":
                    bannedStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_JINYONG");
                    bannedStatusName = "BANNED";
                    break;
                  case "DEBT":
                    debtStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_QIANFEI");
                    debtStatusName = "DEBT";
                    break;
                  default:
                    break;
                }
              }
            }
            if (bannedStatusName == "") {//上面没找到标签，就是不禁用
              bannedStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_QIYONG");
              bannedStatusName = "NOTBANNED";
            }
            if (debtStatusName == "") {
              debtStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_ZHENGCHANG");
              debtStatusName = "NOTDEBT";
            }
            if (registerStatus_name != "NORMAL") {//没审核通过用户，没有禁用和欠费状态。
              bannedStatusTitle = "";
              bannedStatusName = "";
              debtStatusTitle = "";
              debtStatusName = "";
            }
            var opr_button1 = "";
            var operation_buttonA_displayName = "";
            var operation_buttonA_color = "";
            var operation_buttonA_display = "";
            if (useridInTagQuery_exist_in_publicRequest == "userNotExist") {
              operation_buttonA_display = "display:none"
            }
            switch (registerStatus_name) {
              case "NORMAL"://只有注册状态为已开通时，操作这里才会出现封禁和启动字样。
                operation_buttonA_color = "#3b95ba";
                if (bannedStatusName == "NOTBANNED") {
                  operation_buttonA_displayName = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_FENJIN");
                }
                else if (bannedStatusName == "") {
                  operation_buttonA_displayName = "";
                }
                else {
                  operation_buttonA_displayName = "启动";
                }
                break;
              case "WAITCONFIRM"://当注册状态为待审核时，不管禁用状态如何，这里只出现审核亮。
                operation_buttonA_displayName = i18n('SELF_SERVICE_ADVISER_MANAGE_SHENHE');
                operation_buttonA_color = "#3b95ba";
                break;
              default://其他状态，审核暗
                operation_buttonA_displayName = i18n('SELF_SERVICE_ADVISER_MANAGE_SHENHE');
                operation_buttonA_color = "#969696";
                break;
            }
            var button1ClickFunction = "";
            //新增name，方便统一处理
            var button1ClickFunctionName = "";
            if (registerStatus_name == "WAITCONFIRM") {
              button1ClickFunction = "onclick=\"self_service_adviser_manage.auditUser(this," + i + ",'audit')\"";
              button1ClickFunctionName = "auditUser1"
            }
            else {//启用或者禁用
              if (registerStatus_name == "NORMAL") {
                if (bannedStatusName == "NOTBANNED") {//禁用
                  var fenjin = '' + i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_FENJIN") + '';
                  button1ClickFunction = "onclick=\"self_service_adviser_manage.setTagOnly('BANNED','" + fenjin + "'," + i + ")\"";
                  button1ClickFunctionName = "setTagOnly_1"
                }
                else {
                  button1ClickFunction = "onclick=\"self_service_adviser_manage.deleteTag('BANNED'," + i + ")\"";
                  button1ClickFunctionName = "setTagOnly_2"
                }
              }
            }
            var button2ClickFunction = "onclick=\"self_service_adviser_manage.auditUser(this," + i + ",'view')\"";
            var button3ClickFunction = "onclick=\"self_service_adviser_manage.viewBeans(" + i + ")\"";
            var button4ClickFunction = "onclick=\"self_service_adviser_manage.openPopup_delete(this," + i + ")\"";
            var buttonCouponClickFunction = "onclick=\"self_service_adviser_manage.openPopupCoupon(this," + i + ")\"";
            var getSingleItemOperation = function (i) {
							if (self.type == "aduit") {
								var opr1 = "<span data-register-status='"+registerStatus_name+"' class='opr' data-type='" + button1ClickFunctionName + "'  style='color:" + operation_buttonA_color + ";" + operation_buttonA_display + "' data-id='" + i + "'>" + operation_buttonA_displayName + "</span>";
								var opr2 = "<span class='opr' data-type='auditUser2' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_CHAKAN') + "</span>";
								var opr3 = "<span class='opr' data-type='viewBeans' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_HUIDOU') + "</span>";
								var opr5 = "<span class='opr' data-type='openPopupCoupon' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_COUPON') + "</span>";
								var opr6 = "<span class='opr' data-type='reset' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD') + "</span>";
              }
							else{
								var opr2 = "<span data-register-status='"+registerStatus_name+"' class='opr' data-type='auditUser2' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_CHAKAN') + "</span>";
								var opr3 = "<span class='opr' data-type='viewBeans' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_HUIDOU') + "</span>";
								var opr5 = "<span class='opr' data-type='openPopupCoupon' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_COUPON') + "</span>";
								var opr6 = "<span class='opr' data-type='reset' style='" + operation_buttonA_display + "' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD') + "</span>";
							}
              var oprMore_detail = '<div class="opr_more_detail" >' +
                '<div class="opr">' + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + '<img src="image/more_up_arrow.png">' + '</div>' +
                '<div class="opr" data-type="device" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_DEVICE") + '</div>' +
                //'<div class="opr" data-type="" style="color:#969696" data-id="' + i + '">' + "推广代码" + '</div>' +
								'<div class="opr" data-type="promote_code" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_PROMOTE_CODE_MENU") + '</div>' +
                '<div class="opr" data-type="reset" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD") + '</div>' +
                '<div class="opr" data-type="openPopup_delete" data-id="' + i + '">' + i18n('SELF_SERVICE_ADVISER_MANAGE_SHANCHU') + '</div>' +
                '<div class="opr" data-type="' + button1ClickFunctionName + '" data-id="' + i + '">' + operation_buttonA_displayName + '</div>'
								'</div>';
              var oprMore = '<div class="opr_more" style="' + operation_buttonA_display + '">' +
                '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + '<img src="image/more_down_arrow.png">' + '</span>' + oprMore_detail;
              '</div>'
              var opr;
              if (self.type == "aduit") {
                opr = opr1 + "　　　" +  opr6
              } else {
                opr = opr2 + opr3 + opr5;
                opr = opr + oprMore;
              }
              return opr;
            };
            if (self.type == "aduit") {
              listDatas.push([{
                "label": isTagUserHasUserNameInUses_public_originalData
              }, {
                "label": companyName
              }, {
                "label": AquaPaaSAdv_MiniP_Industry
              }, /*{
               "label": location_address
               }, */{
                "label": AquaPaaSAdv_MiniP_ContactName
              }, {
                "label": AquaPaaSAdv_MiniP_ContactPhone
              }, {
               "label": registerStatus
               }, /* {
                "label": debtStatusTitle
              }, {
                "label": bannedStatusTitle
              }, */{
                "label": getSingleItemOperation(i)
              }])
            } else {
              listDatas.push([{
                "label": isTagUserHasUserNameInUses_public_originalData
              }, {
                "label": companyName
              }, {
                "label": AquaPaaSAdv_MiniP_Industry
              }, /*{
               "label": location_address
               }, */{
                "label": AquaPaaSAdv_MiniP_ContactName
              }, {
                "label": AquaPaaSAdv_MiniP_ContactPhone
              }, /*{
               "label": registerStatus
               }, */ {
                "label": debtStatusTitle
              }, {
                "label": bannedStatusTitle
              }, {
                "label": getSingleItemOperation(i)
              }])
            }
          }
        }
      });
      return listDatas


    };
    this.list_selfServiceUser[this.dataRequestMethod].create();
    //this.list_selfServiceUser.update()
  },
  openPopup_delete: function (obj, index_) {
    this.rowIndex = index_;
    this.dialog_delete.open();
  },
  openPopup_reset: function (index_) {
    this.rowIndex = index_;
    this.dialog_reset.open();
  },
	openPopup_view_promote_code: function () {
	  var jq=jQuery;
		var self=this;
		var view_promote_code={
		url: "content/self_service_adviser_manage/popup_display_promote_code.html",
		width: 373,
		height: 188,
		context: this,
		callback: function(){
			var currentUserData=self.tagDatasMatchUserDatas[self.dataRequestMethod][self.rowIndex]||{};
			if(currentUserData&&currentUserData.userMetaData&&currentUserData.userMetaData.AquaPaaSAdv_MiniP_PromoCode){
				jq("#popup_promote_dialog_promote_code_view").val(currentUserData.userMetaData.AquaPaaSAdv_MiniP_PromoCode)
			}
			jq("#popup_display_promote_dialog").find(".adv_popupDialogue_title_close,.dialog_close_button").click(function () {
				self.dialog_view_promote_code.close()
			 });
			jq("#popup_promote_dialog_promote_code_edit").click(function () {
				self.openPopup_edit_promote_code()
			 });
		 }
	 };
	 this.dialog_view_promote_code = new PopupDialog(view_promote_code);
	 this.dialog_view_promote_code.open();
  },
	openPopup_edit_promote_code: function () {
		var jq=jQuery;
		var self=this;
		var edit_promote_code={
		url: "content/self_service_adviser_manage/popup_edit_promote_code.html",
		width: 373,
		height: 188,
		context: this,
		callback: function(){
			jq("#popup_promote_dialog").find(".adv_popupDialogue_title_close,.dialog_close_button").click(function () {
				self.dialog_edit_promote_code.close();
				self.dialog_view_promote_code.open();//取消返回到前一弹框。
			 });
			 jq("#popup_promote_dialog").find(".dialog_confirm_button").click(function () {
				var combineText=jq("#popup_promote_dialog_promote_code").find("input").eq(0).val();
				var str1=combineText;
				if(jq("#popup_promote_dialog_promote_code").find("input").eq(1).val()!=""){
					combineText=combineText+"-"+jq("#popup_promote_dialog_promote_code").find("input").eq(1).val();
					var str2=jq("#popup_promote_dialog_promote_code").find("input").eq(1).val();;
				};
				self.prepareEditPromoteCode(combineText,str1,str2)//进入确认弹框
					//self.dialog_edit_promote_code.close()
			 });
		}
	 }
	 this.dialog_edit_promote_code = new PopupDialog(edit_promote_code);
	 this.dialog_edit_promote_code.open();
	},
	
	prepareEditPromoteCode: function (combineText,str1,str2) {
		var jq=jQuery;
		var self=this;
		var edit_promote_code_confirm={
		url: "content/self_service_adviser_manage/pop_up_confirm_dialog.html",
		width: 479,
		height: 267,
		context: this,
		callback: function(){
			jq("#popup_promote_code_confirm").find(".panel_dialog_close,.panel_dialog_cancel").click(function () {
				self.dialog_edit_promote_code_confirm.close();
				self.dialog_edit_promote_code.open();//取消返回到前一弹框。
				jq("#popup_promote_dialog_promote_code").find("input").eq(0).val(str1);
				jq("#popup_promote_dialog_promote_code").find("input").eq(1).val(str2);
			})
			jq("#popup_promote_code_confirm").find(".panel_dialog_submit").click(function () {
				var currentUserId=self.tagDatasMatchUserDatas[self.dataRequestMethod][self.rowIndex].userid||"";
				var sendDataObj={
				 "metadata": {
					AquaPaaSAdv_MiniP_PromoCode: combineText
				 }
				};
				self.editUser(currentUserId,sendDataObj,function(){
				 self.dialog_edit_promote_code.close();
				 self.drawList_update();
				})
			})
		 }
		};
	 this.dialog_edit_promote_code_confirm = new PopupDialog(edit_promote_code_confirm);
	 this.dialog_edit_promote_code_confirm.open();
	},
	
  openPopup_device: function (index_) {
    this.rowIndex = index_;
    var data = this.tagDatasMatchUserDatas[this.dataRequestMethod][index_];
    var name = data["user_name"];
    var userid = data["userid"];
    self_service_adviser_manage_device.init(name, userid);
  },

  openPopupCoupon: function (obj, index_) {
    var jq = jQuery;
    this.rowIndex = index_;
    var self = this;
    var userDatas = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod];
    var currentUserData = {};
    var storeNickName = "";
		if(this.dataRequestMethod=="notSearch"){
			if (userDatas && userDatas[index_] && userDatas[index_].storeNickName) {
				storeNickName = userDatas[index_].storeNickName;
				currentUserData = userDatas[index_]
			};
		}
		else{
			currentUserData = userDatas[index_]
		}
		if(!currentUserData.userid){
			currentUserData["userid"]=currentUserData.user_id||"";
		}
    var dialog = new PopupDialog({
      url: 'content/self_service_adviser_manage/user-coupon.html',
      width: 840,
      height: 476,
      context: {},
      callback: function () {
        //jq('#user-admin-coupon-title').text(storeNickName + i18n("COUPON_BELONG"));
        jq('#user-admin-coupon-title').text(i18n("SELF_SERVICE_ADVISER_MANAGE_COUPON"));//mail:2019.8.2
        self.setList();
        self.listCoupon(currentUserData);
        jq('#user-admin-coupon-add').on('click', function () {
          var id = jq('#user-admin-coupon-id').val();
          if (id != '') {
            self.addCoupon(id, currentUserData);
          }
        });
        jq('#user-admin-coupon-list').on('click', '.opr-default', function () {
          var i = jq(this).attr('data-index');
          var coupon = self.listDataCoupon[i];
          self.deleteCoupon(coupon, currentUserData);
        });
      },
    });
    dialog.open();
    self.dialogCoupon = dialog;
  },

  deleteCoupon: function (coupon, currentUserData) {
    var jq = jQuery;
    var self = this;
    var url = paasHost + '/aquapaas/rest/coupon/' + coupon.coupon_id + '/disable';
    url += '?user_id=' + my.paas.user_id;
    url += '&access_token=' + my.paas.access_token;
    url += '&app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    var method = 'POST';
    jq.ajax({
      url: url,
      type: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
      }
    }).done(function (data) {
      self.listCoupon(currentUserData);
    }).fail(function (xhr) {

    });
  },
  addCoupon: function (id, currentUserData) {
    var jq = jQuery
    var self = this;
    var url = paasHost + '/aquapaas/rest/coupon/' + id + '/assign';
    url += '?user_id=' + currentUserData.userid;
    url += '&access_token=' + my.paas.access_token;
    url += '&app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    var method = 'POST';
    jq.ajax({
      url: url,
      type: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
      }
    }).done(function (data) {
      self.listCoupon(currentUserData);
    }).fail(function (xhr) {
      self.showMsgDialog(xhr.getResponseHeader('Etag'));
    });
  },

  showMsgDialog: function (msg, callback) {
    var jq = jQuery;
    var dialog = new OverlayDialog({
      url: 'content/self_service_adviser_manage/msg-dialog.html',
      width: 470,
      height: 266,
      context: {},
      zIndex: 3000,
      id: 'user-admin-msg',
      callback: function () {
        jq('#user-admin-msg-content').text(msg);
        jq('#user-admin-msg-close').on('click', function () {
          dialog.close();
        });
        jq('#user-admin-msg-cancel').on('click', function () {
          dialog.close();
        });
        jq('#user-admin-msg-submit').on('click', function () {
          dialog.close();
          if (typeof callback == 'function') {
            callback();
          }
        });
      }
    });
    dialog.open();
  },

  setList: function () {
    var self = this;
    self.noPagiListCoupon = new NoPagiList({
      async: false,
      rows: 8,
      columns: 6,
      containerId: 'user-admin-coupon-list',
      listType: 0,
      titles: [
        {label: i18n("COUPON_ID")},
        {label: i18n("COUPON_INFO")},
        {label: i18n("COUPON_VALIDTIME")},
        {label: i18n("COUPON_EXCHANGE_TIME")},
        {label: i18n("COUPON_TICKET_ID")},
        {label: i18n("COUPON_OPER")}
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
    self.noPagiListCoupon.create();
  },

  listCoupon: function (currentUserData) {
    var self = this;
    var jq = jQuery;
    var url = paasHost + '/aquapaas/rest/coupon/list';
    url += '?user_id=' + currentUserData.userid;
    url += '&access_token=' + my.paas.access_token;
    url += '&app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    var method = 'GET';
    jq.ajax({
      url: url,
      type: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
      }
    }).done(function (data) {
      self.listDataCoupon = jq.makeArray(data);
      self.noPagiListCoupon.update(self.formListData(self.listDataCoupon));
    });
  },

  formListData: function (data) {
    var self = this;
    var listData = data.map(function (item, i) {
      return [{
        label: self.getTitledSpan(item.coupon_no)
      }, {
        label: self.getTitledSpan(item.coupon_id)
      }, {
        label: self.timestampToStr(item.expire_time).substr(0, 10) + i18n("COUPON_BEFORE")
      }, {
        label: item.exchange_time != null ? self.timestampToStr(item.exchange_time).substr(0, 10) : ''
      }, {
        label: self.getTitledSpan(item.ticket && item.ticket.ticket_id || '')
      }, {
        label: '<span class="' + (item.enable ? 'opr-default' : 'opr-disabled') + '" data-index="' + i + '">' + i18n('SELF_SERVICE_ADVISER_MANAGE_SHANCHU') + '</span>'
      }];
    });
    return listData;
  },
  getTitledSpan: function (str) {
    return jQuery('<span>').append(str).attr('title', str)[0].outerHTML;
  },
  timestampToStr: function (num) {
    var preZero = this.preZero;
    var obj = new Date(num);
    var y = obj.getFullYear();
    var m = obj.getMonth() + 1;
    var d = obj.getDate();
    var h = obj.getHours();
    var min = obj.getMinutes();
    var s = obj.getSeconds();
    return y + '-' + preZero(m) + '-' + preZero(d) + ' ' + preZero(h) + ':' + preZero(min) + ':' + preZero(s);
  },
  preZero: function (num) {
    var str = num.toString();
    if (str.length < 2) {
      str = '0' + str;
    }
    return str;
  },
  popup_delete_callback: function () {
    var jq = jQuery;
    var self = this;
    jq("#advUserManage_delete_close,#advUserManage_delete_cancel").unbind().bind('click', function () {
      self.dialog_delete.close()
    });
    jq("#advUserManage_delete_submit").unbind().bind('click', function () {
      var curUser = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod][self.rowIndex];
      if(!curUser["userid"]){
				curUser["userid"]=curUser.user_id||""
			}
			if (curUser && curUser["userid"]) {
        var url_delete_user = paasHost + "/aquapaas/rest/users/user/" + curUser["userid"] + "?access_token=" + my.paas.access_token + "" + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "" + "&user_id=" + my.paas.user_id + "";//调试接口，删除自己。
        var xhr_delete_user = new XMLHttpRequest();
        xhr_delete_user.open("DELETE", url_delete_user, false);
        xhr_delete_user.setRequestHeader("Content-Type", "application/json");
        xhr_delete_user.setRequestHeader("Accept", "application/json");
        xhr_delete_user.setRequestHeader("x-aqua-sign", getPaaS_x_aqua_sign("DELETE", url_delete_user));
        xhr_delete_user.send();
      }
      self.dialog_delete.close();
    });
  },
  popup_reset_callback: function () {
    var jq = jQuery;
    var self = this;
    jq("#advUserManage_delete_close,#advUserManage_delete_cancel").unbind().bind('click', function () {
      self.dialog_delete.close()
    });

    jq("#advUserManage_delete_submit").unbind().bind('click', function () {
      var curUser = self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod][self.rowIndex];
			if(!curUser["userid"]){
				curUser["userid"]=curUser.user_id||""
			}
      var data = self.tagDatasMatchUserDatas[self.dataRequestMethod][self.rowIndex];
      var user_name = data["user_name"];
      if (curUser && curUser["userid"]) {
        var user_name_urlParm = encodeURIComponent(user_name);
        var AquaPassData = {
          "password": user_name.slice(-6)
        };
        var url_update_user = paasHost + "/aquapaas/rest" + "/users/password/" + user_name_urlParm + "@default?user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
        jq.ajax({
          type: 'PUT',
          async: true,
          url: url_update_user,
          data: JSON.stringify(AquaPassData),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'application/json',
            'x-third-party': 'aqua',
            'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url_update_user)
          }
        }).always(function () {
          //callback()
          self.dialog_delete.close();
        });
      }
    });
  },
  viewBeans: function (index_) {
    this.rowIndex = index_;
    this.openPopup_beans()
  },
  auditUser: function (obj, index_, status) {
    this.popup_audit_type = status;
    var callback_ = this.popup_audit_callback;
    var popup_audit_height;
    switch (this.popup_audit_type) {
      case "audit":
        popup_audit_height = 707;
        callback_ = this.popup_audit_callback;//view和audit共用这方法
        break;
      case "view":
        popup_audit_height = 770;
        callback_ = this.popup_audit_callback;
        break;
      default:
        break;
    }
    var popup_audit = {
      url: "content/self_service_adviser_manage/popup_audit.html",
      width: 760,
      height: popup_audit_height,
      context: this,
      callback: callback_
    };
    this.popup_audit = new PopupDialog(popup_audit);
    var self = self_service_adviser_manage;
    self.rowIndex = index_;
    self.openPopup_audit()
  },
  getUserMetaDataByRequest1: function (request1Data, self) {
    if (request1Data.length == 0) {
      self.uses_public_originalData_curpage = [];
    }
    else {
      var self = self;
      var request1Data_len = request1Data.length;
      var user_ids_list = [];
      for (var i = 0; i < request1Data_len; i++) {
        if (request1Data[i].userid) {
          user_ids_list.push(request1Data[i].userid)
        }
      }
      ;
      var user_ids_list_distinct = self.removeRepeatEleInArray(user_ids_list);
      var user_ids_list_distinct_join = user_ids_list_distinct.join(",");
      var url_ = paasHost + "/aquapaas/rest/users/public?user_ids=" + user_ids_list_distinct_join;
      url_ = url_ + "&app_key=" + paasAppKey;
      url_ = url_ + "&timestamp=" + new Date().toISOString();
      jQuery.ajax({
        type: 'GET',
        async: false,
        url: url_,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url_),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        error: function (error) {
        }
      }).done(function (data, status, xhr) {
        self.uses_public_originalData_curpage = data;
      })
    }
  },
  filterConditionDefaultOpenPage: function () {
    var filterPara = "tags_or=";
    var allTagsCategory = this.allTagsCategory;
    var allTagsCategory_group1 = allTagsCategory["group1"].concat(allTagsCategory["group2"]).concat(allTagsCategory["group3"]);
    var tagType = this.tagType;
    var allTagsCategory_group1_type_name = (allTagsCategory_group1.map(function (item) {
      return tagType + "/" + item.name;
    })).join(",");
    filterPara = filterPara + encodeURIComponent(allTagsCategory_group1_type_name);
    return filterPara
  },
  init: function (type) {
    this.popup_audit_type = "view";//默认为查看
    my_aqua.init(storage_username, storage_password, storage_domain);
    this.initPara(type);
    if (this.type == "aduit") {
      this.filter_and_drawList('WAITCONFIRM', '注册待审核');
    } else {
      this.filter_and_drawList('NORMAL', '正常启用');
    }
    this.drawTopMenu();
    this.bindEvent();
  },
  bindEvent: function () {
    var that = this;
		var jq=jQuery;
		jq("#selfServiceAdviserManage_search_button").on("click",function(){
			  var value=jq("#selfServiceAdviserManage_search_input").val();
				if(value!=""){
					that.searchContent(value)
				}
				else{
				 if (that.type == "aduit") {
						that.filter_and_drawList('WAITCONFIRM', '注册待审核');
					} else {
						that.filter_and_drawList('NORMAL', '正常启用');
					}
				}
		  });
			jq("#selfServiceAdviserManage_search_input").on("keyup",function(event){
				var value=jq("#selfServiceAdviserManage_search_input").val();
			  if(event&&event.keyCode&&(event.keyCode==13)){
					if(value!=""){
						that.searchContent(jq(this).val())
					}
					else{
					 if (that.type == "aduit") {
							that.filter_and_drawList('WAITCONFIRM', '注册待审核');
						} else {
							that.filter_and_drawList('NORMAL', '正常启用');
						}
					}
				}
		  });
		
    jQuery('#selfServiceAdviserManage_tableContainer').on('click', '.opr', function () {
      var opr = jQuery(this);
			var buttonEnableRegisterType=[];
			if (that.type == "aduit") {
				buttonEnableRegisterType=["NEW","WAITCONFIRM","CONFIRMFAIL"]
			}
			else{
				buttonEnableRegisterType=["NORMAL"]
			}
			var dataRegisterStatus=jQuery(this).closest("td").find("span").eq(0).attr("data-register-status");
			if(jQuery.inArray(dataRegisterStatus,buttonEnableRegisterType)!=-1){
				if (opr.parents('.opr_more').length > 0) {
					var $more = opr.parents('.opr_more');
					if ($more.hasClass('open')) {
						$more.removeClass('open');
					} else {
						jQuery('.opr-more-open').removeClass('open');
						$more.addClass('open');
					}
				};
			  var type = opr.attr('data-type');
        var index = opr.attr('data-id');
				console.log(type);
				switch (type) {
					case 'auditUser1':
						that.auditUser(null, index, 'audit');
						break;
					case 'setTagOnly_1':
						var fenjin = '' + i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_FENJIN") + '';
						that.setTagOnly('BANNED', fenjin, index);
						break;
					case 'setTagOnly_2':
						that.deleteTag('BANNED', index)
						break;
					case 'auditUser2':
						that.auditUser(this, index, 'view')
						break;
					case 'viewBeans':
						that.viewBeans(index)
						break;
					case 'openPopupCoupon':
						that.openPopupCoupon(this, index)
						break;
					case 'reset':
						that.openPopup_reset(index)
						break;
					case 'promote_code':
						that.rowIndex=index;
						that.openPopup_view_promote_code()
						break;
					case 'device':
						that.openPopup_device(index)
						break;
					case 'openPopup_delete':
						that.openPopup_delete(this, index)
						break;
					default:
						break;
				};
			}
    });
		window.dropdownHelper.addDropdownHandler(that);
		that.listCnt = jQuery('#selfServiceAdviserManage_tableContainer')[0];
		var isTimingSelect_options = [{
			key: "AquaPaaSAdv_MiniP_StoreName",
			value: i18n("SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG")
		},{
			key: "AquaPaaSAdv_MiniP_ContactName",
			value: i18n("SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING")
		}, {
			key: "AquaPaaSAdv_MiniP_PromoCode",
			value: i18n("SELF_SERVICE_ADVISER_MANAGE_PROMOTE_CODE")
		}];
		var isTimingSelect = new newSelect("#selfServiceAdviserManage_select", [], {
			width: 103,
			height: 30,
			background: "#7EB7D4",
			fontSize: 14,
			liFontSize: 14,
			color: "white",
			liColor: "white",
			selectbackground: "#7EB7D4",
			headerBorder: "1px solid #6D9FBA",
			liBorderColor: "#6D9FBA",
			openIconUrl: "./uiWidget/images/open4.png",
			closeIconUrl: "./uiWidget/images/close4.png",
		},function(value){
			that.searchMetadata=value
		});
		isTimingSelect.updateSelectOptions(isTimingSelect_options);
  },
  handleDropdowns: function (target, delegate) {
    var self = this;
    if (self.listCnt != jQuery('#selfServiceAdviserManage_tableContainer')[0]) {
      window.dropdownHelper.removeDropdownHandler(self);
    } else {
      if (jQuery(target).parents('.opr_more').length > 0) {
      } else {
        jQuery('.opr_more').removeClass('open');
      }
    }
  },
	searchContent:function(value){
	  this.dataRequestMethod="search";
		var self = this;
    var jq = jQuery;
    var titles_array = [
      i18n('SELF_SERVICE_ADVISER_MANAGE_YONGHUMING'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_SUOSHUHANGYE'),
      //i18n('SELF_SERVICE_ADVISER_MANAGE_XIANGXIDIZHI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIFANGSHI'),
      //i18n('SELF_SERVICE_ADVISER_MANAGE_ZHUCEZHUANGTAI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_QIANFEIZHUANGTAI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_JINYONGZHUANGTAI'),
      i18n('SELF_SERVICE_ADVISER_MANAGE_CAOZUO')
    ];
    if (this.type == "aduit") {
      titles_array = [
        i18n('SELF_SERVICE_ADVISER_MANAGE_YONGHUMING'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_SHANGJIAMINGCHENG'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_SUOSHUHANGYE'),
        //i18n('SELF_SERVICE_ADVISER_MANAGE_XIANGXIDIZHI'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIXINGMING'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_LIANXIFANGSHI'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_ZHUCEZHUANGTAI'),
        i18n('SELF_SERVICE_ADVISER_MANAGE_CAOZUO')
      ];
    }
    var titles_label_array = (titles_array.map(function (item) {
      return {label: item};
    }));
    var list_row = 11;
    var list_selfServiceUser_by_search = new StyledList({
      rows: list_row,
      columns: titles_array.length,
      containerId: 'selfServiceAdviserManage_tableContainer',
      titles: titles_label_array,
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
				columnsWidth: (self.type == "aduit") ? [0.105, 0.165, 0.117, 0.110, 0.167, 0.138, 0.197] : [0.1056, 0.130, 0.1089, 0.076, 0.117, 0.117, 0.111, 0.232]
      }
    });
		this.list_selfServiceUser={};
		
    this.list_selfServiceUser[this.dataRequestMethod] = list_selfServiceUser_by_search;
    this.list_selfServiceUser[this.dataRequestMethod].getPageData = function (pageNumber) {
			var searchCondition={
				"user_scope_specification": [{
					"user_type":"== 0",
					"metadata":{
					 "AquaPaaSAdv_MiniP_StoreName":"*"//当时讨论的自助广告主必填字段
					}
				 }
				]
			 };
		  searchCondition["user_scope_specification"][0]["metadata"][""+self.searchMetadata+""]="contains "+value+"";
      var listSelf = this;
      var start = (pageNumber - 1) * list_row;
      var end = pageNumber * list_row - 1;
			self.currPage={};
      self.currPage[self.dataRequestMethod] = (pageNumber - 1);
      var listDatas = [];
			var url = paasHost + "/aquapaas/rest/users/cdmi_query"
			url=url+"?access_token=" + my.paas.access_token + "";
			url=url+"&start=" + start +"";
			url=url+"&end=" + end +"";
      url=url+"&app_key=" + paasAppKey +"";
			url=url+"&timestamp=" + new Date().toISOString() +"";
			url=url+"&user_id=" + my.paas.user_id +"";
      jQuery.ajax({
        type: 'PUT',
        async: false,
        url: url,
				data: JSON.stringify(searchCondition),
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        error: function (error) {
        }
      }).done(function (data, status, xhr) {
				if (data&&data.users) {
					var tagDatasMatchUserDatas = [];
				  var users=data.users;
					var totalCount = data.count||0;
          listSelf.onTotalCount(totalCount || 0);
					self.userListFitTagsFilterCondition_originalData_curPage={};
					self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod]=[];
					for (var i = 0; i < users.length; i++) {
					  var data=users[i];
						if(!data.userid){
							data.userid=data.user_id||""
						};
						data.name="";
						self.userListFitTagsFilterCondition_originalData_curPage[self.dataRequestMethod].push(data);
						var user_name=data.user_name||"";
						var user_id=data.user_id||"";
						var userDatasFormat_userLocationUnit = data.location||"";
						if(data.metadata){
							var metadata=data.metadata;
							var companyName = metadata.AquaPaaSAdv_MiniP_StoreName||"";
							var AquaPaaSAdv_MiniP_Industry = metadata.AquaPaaSAdv_MiniP_Industry||"";
							var AquaPaaSAdv_MiniP_ContactName = metadata.AquaPaaSAdv_MiniP_ContactName||"";
							var AquaPaaSAdv_MiniP_ContactPhone = metadata.AquaPaaSAdv_MiniP_ContactPhone||"";
							var location_address = metadata.address||"";
							var listUserTagsByUserName = self.listUserTagsByUserName(user_name);
							var registerStatus="";
							var registerStatusTitle="";
							var debtStatusName = "";
							var debtStatusTitle = "";
							var bannedStatusTitle = "";//当前禁用启用状态
							var bannedStatusName = "";
							var opr_button1 = "";
							var operation_buttonA_displayName = "";
							var operation_buttonA_color = "#969696";
							var operation_buttonA_display = "";
							var button1ClickFunction="";
							var button1ClickFunctionName="";
							var arrowSrc="content/self_service_adviser_manage/image/more_down_arrow_gray.png";
							for (var k = 0; k < listUserTagsByUserName.length; k++) {
								if (listUserTagsByUserName[k]["name"]) {
									var listUserTagsByUserName_name = listUserTagsByUserName[k]["name"];
									switch (listUserTagsByUserName_name) {
										case "BANNED":
											bannedStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_JINYONG");
											bannedStatusName = "BANNED";
											break;
										case "DEBT":
											debtStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_QIANFEI");
											debtStatusName = "DEBT";
											break;
										case "":
											operation_buttonA_color = "#969696"
											break;
										case "NORMAL":
											registerStatus=listUserTagsByUserName_name;//当循环到注册标签时，记录下注册状态
											if (self.type == "aduit"){
												operation_buttonA_color = "#969696";
												button1ClickFunctionName="";
												operation_buttonA_displayName = i18n('SELF_SERVICE_ADVISER_MANAGE_SHENHE');
											}
											else{
												operation_buttonA_color = "#3b95ba"
											};
                      arrowSrc="image/more_down_arrow.png";
                      var registerStatusArray = ["NEW","WAITCONFIRM","CONFIRMFAIL","NORMAL"]
											var registerStatusObjArray = [{"name":"NEW","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS1")},{"name":"WAITCONFIRM","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS2")},{"name":"CONFIRMFAIL","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS3")},{"name":"NORMAL","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS4")}];
											if(registerStatus) {
												if(jq.inArray(registerStatus, registerStatusArray)!= -1) {
													var index_allTagsCategory = jq.inArray(registerStatus, registerStatusArray);
													registerStatusTitle = registerStatusObjArray[index_allTagsCategory]["title"];
												}
											};
											data.name=listUserTagsByUserName_name;										
											break;
										default:
											data.name=listUserTagsByUserName_name;
											if (self.type == "aduit"){
												operation_buttonA_color = "#3b95ba"
											}
											else{
												operation_buttonA_color = "#969696"
											};
											registerStatus=listUserTagsByUserName_name;//当循环到注册标签时，记录下注册状态
											var registerStatusArray = ["NEW","WAITCONFIRM","CONFIRMFAIL","NORMAL"]
											var registerStatusObjArray = [{"name":"NEW","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS1")},{"name":"WAITCONFIRM","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS2")},{"name":"CONFIRMFAIL","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS3")},{"name":"NORMAL","title":i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_STATUS4")}];
											if(registerStatus) {
												if(jq.inArray(registerStatus, registerStatusArray) != -1) {
													var index_allTagsCategory = jq.inArray(registerStatus, registerStatusArray);
													registerStatusTitle = registerStatusObjArray[index_allTagsCategory]["title"];
												}
											};
											if (self.type == "aduit"){//在自助用户页面不能审核
												if (listUserTagsByUserName_name == "WAITCONFIRM") {
													button1ClickFunctionName = "auditUser1";
													operation_buttonA_displayName = i18n('SELF_SERVICE_ADVISER_MANAGE_SHENHE');
													operation_buttonA_color = "#3b95ba";
												}
												else{
													button1ClickFunctionName="";
													operation_buttonA_displayName = i18n('SELF_SERVICE_ADVISER_MANAGE_SHENHE');
													operation_buttonA_color = "#969696";
												}
											};
											break;
									}
								}
							};
							if (bannedStatusName == "") {//上面没找到标签，就是不禁用
								bannedStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_QIYONG");
								bannedStatusName = "NOTBANNED";
							}
							if (debtStatusName == "") {
								debtStatusTitle = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_ZHENGCHANG");
								debtStatusName = "NOTDEBT";
							}
							if (self.type != "aduit"){//启用、禁用不会出现在用户审核页面中。
								if (bannedStatusName == "NOTBANNED") {
									operation_buttonA_displayName = i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_FENJIN");
								}
								else {
									operation_buttonA_displayName = "启动";
								}
							}
							if(listUserTagsByUserName.length==0){
								operation_buttonA_color = "#969696";
								button1ClickFunctionName="";
								operation_buttonA_displayName = i18n('SELF_SERVICE_ADVISER_MANAGE_SHENHE');
							}
							/*
							if (registerStatus_name != "NORMAL") {//没审核通过用户，没有禁用和欠费状态。
								bannedStatusTitle = "";
								bannedStatusName = "";
								debtStatusTitle = "";
								debtStatusName = "";
							}
							*/
						};
						if(registerStatus=="NORMAL"){
							if (bannedStatusName == "NOTBANNED") {//禁用
								var fenjin = '' + i18n("SELF_SERVICE_ADVISER_MANAGE_REGISTER_FENJIN") + '';
								button1ClickFunction = "onclick=\"self_service_adviser_manage.setTagOnly('BANNED','" + fenjin + "'," + i + ")\"";
								button1ClickFunctionName = "setTagOnly_1"
							}
							else {
								button1ClickFunction = "onclick=\"self_service_adviser_manage.deleteTag('BANNED'," + i + ")\"";
								button1ClickFunctionName = "setTagOnly_2"
							}
						};
						var getSingleItemOperation = function (i) {
							if (self.type == "aduit") {
								var opr1 = "<span data-register-status='"+registerStatus+"' class='opr' data-type='" + button1ClickFunctionName + "'  style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + operation_buttonA_displayName + "</span>";
								var opr2 = "<span class='opr' data-type='auditUser2' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_CHAKAN') + "</span>";
								var opr3 = "<span class='opr' data-type='viewBeans' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_HUIDOU') + "</span>";
								var opr5 = "<span class='opr' data-type='openPopupCoupon' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_COUPON') + "</span>";
								var opr6 = "<span class='opr' data-type='reset' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD') + "</span>";
              }
							else{
								var opr2 = "<span data-register-status='"+registerStatus+"' class='opr' data-type='auditUser2' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_CHAKAN') + "</span>";
								var opr3 = "<span class='opr' data-type='viewBeans' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_HUIDOU') + "</span>";
								var opr5 = "<span class='opr' data-type='openPopupCoupon' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_COUPON') + "</span>";
								var opr6 = "<span class='opr' data-type='reset' style='color:" + operation_buttonA_color + ";' data-id='" + i + "'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD') + "</span>";
							}
							var oprMore_detail = '<div style=\'color:' + operation_buttonA_color + ';\' class="opr_more_detail" >' +
								'<div class="opr">' + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + '<img src="image/more_up_arrow.png">' + '</div>' +
								'<div class="opr" data-type="device" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_DEVICE") + '</div>' +
								//'<div class="opr" data-type="" style="color:#969696" data-id="' + i + '">' + "推广代码" + '</div>' +
								'<div class="opr" data-type="promote_code" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_PROMOTE_CODE_MENU") + '</div>' +
								'<div class="opr" data-type="reset" data-id="' + i + '">' + i18n("SELF_SERVICE_ADVISER_MANAGE_RESETPASSWORD") + '</div>' +
								'<div class="opr" data-type="openPopup_delete" data-id="' + i + '">' + i18n('SELF_SERVICE_ADVISER_MANAGE_SHANCHU') + '</div>' +
								'<div class="opr" data-type="' + button1ClickFunctionName + '" data-id="' + i + '">' + operation_buttonA_displayName + '</div>'
								'</div>';
              var oprMore = '<div class="opr_more">' +
                '<span  style=\'color:' + operation_buttonA_color + ';\' class="opr" data-type="more" data-id="' + i + '">' + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + '<img src="'+arrowSrc+'">' + '</span>' + oprMore_detail;
              '</div>'
              var opr;
              if (self.type == "aduit") {
                opr = opr1 + "　　　" +  opr6
              } else {
                opr = opr2 + opr3 + opr5;
                opr = opr + oprMore;
              }
              return opr;
            };
						tagDatasMatchUserDatas.push({
              "user_name": user_name,
              "createTime": "",
              "userid": user_id,
              "userMetaData": metadata,
              userDatasFormat_userLocationUnit
            })
            self.tagDatasMatchUserDatas[self.dataRequestMethod] = tagDatasMatchUserDatas;
						if (self.type == "aduit") {
							listDatas.push([{
                "label": user_name
              }, {
                "label": companyName
              }, {
                "label": AquaPaaSAdv_MiniP_Industry
              }, /*{
               "label": location_address
               }, */{
                "label": AquaPaaSAdv_MiniP_ContactName
              }, {
                "label": AquaPaaSAdv_MiniP_ContactPhone
              }, {
               "label": registerStatusTitle
               }, /* {
                "label": debtStatusTitle
              }, {
                "label": bannedStatusTitle
              }, */{
                "label": getSingleItemOperation(i)
              }])
						}
						else{
							listDatas.push([{
									"label": user_name
								}, {
									"label": companyName
								}, {
									"label": AquaPaaSAdv_MiniP_Industry
								}, /*{
								 "label": location_address
								 }, */{
									"label": AquaPaaSAdv_MiniP_ContactName
								}, {
									"label": AquaPaaSAdv_MiniP_ContactPhone
								}, /*{
								 "label": registerStatus
								 }, */ {
									"label": debtStatusTitle
								}, {
									"label": bannedStatusTitle
								}, {
									"label": getSingleItemOperation(i)
							}])
						}
					}
				}
			})
      return listDatas

    };
    this.list_selfServiceUser[this.dataRequestMethod].create();

		//this.getUsersBySearchUserMetadata(value)
	}
}


var self_service_adviser_manage_device = {
  init: function (name, userid) {
    var that = this;

    var teacherAquaUserId = userid
    var teacherAquaNickName = name

    jQuery('#self_service_adviser_manage_part1').hide();
    jQuery('#self_service_adviser_manage_part2').show();
    jQuery('#self_service_adviser_manage_part2').html("");
    jQuery.ajax({
      url: 'content/self_service_adviser_manage/device/equip.html'
    }).done(function (html) {
      html = patchHTML(html);
      jQuery('#self_service_adviser_manage_part2').append(html);
      var tab_header = jQuery("#stuManage_header_tab");
      var studentObj = {
        "metadata": {
          "user_ID": teacherAquaUserId
        }
      }
      that.teacherAquaNickName = teacherAquaNickName
      that.studentObj = studentObj;
      var tab_switch = new tabs_switch_component({
        container: tab_header,
        width: ["108px", "108px"],
        tab_words: ["应用设备", "微信"],
        callback: that.listEquipHistory.bind(that),
      })
      jQuery('#student_equip_of_student').text(teacherAquaNickName + "的设备");
      jQuery('#student_points_page_back').on('click', function () {
        jQuery('#student_points_page').remove();
        jQuery('#self_service_adviser_manage_part2').hide();
        jQuery('#self_service_adviser_manage_part1').show();
        jQuery('#self_service_adviser_manage_part2').html("");
      });
      that.listEquipHistory();
    });
  },
  listEquipHistory: function () {
    var jq = jQuery;
    var self = this;
    var teacher = self.studentObj;
    var userUrl = paasHost + paasDomain + '/users/info/' + self.teacherAquaNickName + '@default';
    userUrl += '?app_key=' + paasAppKey;
    userUrl += '&timestamp=' + new Date().toISOString();
    userUrl += '&fields=metadata,devices,openIDs';
    var listData = [];
    var switch_tab_a = jQuery("#stuManage_header_tab").find(".adv_tab_unit").eq(0);
    jQuery.ajax({
      url: userUrl,
      async: false,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', userUrl)
      }
    }).done(function (user) {
      if (user) {
        var tabelData = {};
        var thisText = "";
        if (switch_tab_a.attr("name") == "focused_div") {
          if (typeof user.devices != "undefined") {
            tabelData = user.devices
          }
        }
        else {
          if (typeof user.open_ids != "undefined") {
            tabelData = user.open_ids
          }
          ;
        }
        if (tabelData.length > 0) {
          listData = self.formatPointListDataB(tabelData || []);
        }
        else {
          listData = []
        }
      }
    }).fail(function () {
      listData = []
    });
    var list_equip = {};
    if (switch_tab_a.attr("name") == "focused_div") {
      list_equip = new StyledListClone({
        async: true,
        rows: 14,
        columns: 8,
        containerId: 'student_points_of_student_list',
        listType: 0,
        data: listData,
        titles: [
          {label: "id"},
          {label: "name"},
          {label: "type"},
          {label: "platform"},
          {label: "model"},
          {label: "app_key"},
          {label: "mac"},
          {label: "last_login_time"}
        ],
        styles: {
          //columnsWidth: [0.13,0.099,0.11,0.08,0.09,0.098,0.14,0.22],
          columnsWidth: [0.18, 0.099, 0.11, 0.07, 0.05, 0.098, 0.14, 0.22],
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 31,
          titleBg: 'rgb(69,209,244)',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: 'rgb(245,253,255)',
          cellColor: 'rgb(121,121,121)',
          footBg: 'white',
          footColor: 'rgb(121,121,121)',
          iconColor: 'rgb(0,153,203)',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white'
        }
      });
    }
    else {
      list_equip = new StyledListClone({
        async: true,
        rows: 14,
        columns: 3,
        containerId: 'student_points_of_student_list',
        listType: 0,
        data: listData,
        titles: [
          {label: "provider"},
          {label: "open_id"},
          {label: "nick_name"}
        ],
        styles: {
          columnsWidth: [0.297, 0.372, 0.321],
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 31,
          titleBg: 'rgb(69,209,244)',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: 'rgb(245,253,255)',
          cellColor: 'rgb(121,121,121)',
          footBg: 'white',
          footColor: 'rgb(121,121,121)',
          iconColor: 'rgb(0,153,203)',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white'
        }
      });
    }
    list_equip.create();
    this.list_equip = list_equip;
    jq("#student_points_of_student_list").find("tbody").find("td").each(function () {
      var text_ = jq(this).text();
      if (text_ != "") {
        jq(this).attr("title", text_)
      }
    })
  },
  formatPointListDataB: function (data) {
    var self = this;
    var listData = [];
    var switch_tab_a = jQuery("#stuManage_header_tab").find(".adv_tab_unit").eq(0);
    if (switch_tab_a.attr("name") == "focused_div") {
      listData = data.map(function (item, i) {
        var last_login_time_ = item.last_login_time;
        var last_login_time__ = last_login_time_ + "";
        if (last_login_time__.indexOf("-") == -1) {
          last_login_time_ = self.transferMillsecond(last_login_time_);//目前后台提供数据格式和原始需求不符，用了毫秒数
        }
        return [{label: item.id},
          {label: item.name},
          {label: item.type},
          {label: item.platform},
          {label: item.model},
          {label: item.app_key},
          {label: item.mac},
          {label: last_login_time_}
        ];
      });
    }
    else {
      listData = data.map(function (item, i) {
        return [{label: item.provider},
          {label: item.open_id},
          {label: item.nick_name}
        ];
      });
    }
    return listData;
  },
  transferMillsecond: function (data) {
    var unixTimestamp = new Date(data);
    return unixTimestamp.getFullYear() + "-" + this.addZero(unixTimestamp.getMonth() + 1) + "-" + this.addZero(unixTimestamp.getDate()) + "&nbsp;" + this.addZero(unixTimestamp.getHours()) + ":" + this.addZero(unixTimestamp.getMinutes()) + ":" + this.addZero(unixTimestamp.getSeconds());
  },
  addZero: function (num) {
    if (num < 10) {
      return ("0" + num)
    }
    else {
      return num
    }
  }
}