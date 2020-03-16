var sucai_img_template = (function ($) {
  //var paasHost = 'http://192.168.7.69:5002'//测试文字转化成图片接口用，目前先注释掉

  var sucai_img_template = {
    openNewDialog: function (callback) {
      TemplateAqua.init();
      var dialog = Object.create(chooseTemplateDialog);
      dialog.open(callback);
    },
    openEditDialog: function (url, callback) {
      var that = this;
      that.callback = callback;
      TemplateAqua.init();
      var pathArray = url.split("/aqua/rest/cdmi");
      var path = pathArray[1];
      var nameArray = path.split("/");
      var name = nameArray[nameArray.length - 2];
      path = nameArray.slice(0, -2).join("/") + "/";
      var result = TemplateAqua.getSaveFolder(my_aqua.netdiskRoot + "/" + storage_htmltemplate_save_folder);
      TemplateAqua.copyFolder({
        path: path,
        name: name,
      }, {
        path: result.path,
        name: result.name,
      }, function () {
        var dialog = Object.create(editTemplateDialog);
        dialog.open({
          path: result.path,
          name: result.name
        }, {}, function (url) {
          that.callback(url);
        }, true);
      }, function () {
        messageDialog.openError(i18n("SUCAITEMPLATE_COPYFOLDERFAILED"));
      });
    }
  };

  var chooseTemplateDialog = {
    open: function (callback) {
      var that = this;
      that.htmltemplate_aquaPath = {
        htmltemplate_folder: storage_htmltemplate_origin_folder,
        htmltemplate_save_folder: storage_htmltemplate_save_folder,
      };
      that.checkedTemplate = {
        type: null,
        name: null,
      };
      that.callback = callback;
      var dialog = new PopupDialog_({
        url: 'content/su_cai/template/chooseTemplate.html',
        width: 1220,
        height: 626,
        context: that,
        callback: function () {
          that.initRightList();
          that.bindEvent();
        }
      });
      dialog.open();
      that.dialog = dialog;
    },
    initRightList: function () {
      var that = this;
      var label = [];
      var TemplateTypeSelect = new newSelect(
        "#sucai_template_type",
        label, {
          width: 289,
          height: 32,
          background: "#ffffff",
          selectbackground: "#d3d3d3"
        }
      );
      that.TemplateTypeSelect = TemplateTypeSelect;
      TemplateTypeSelect.listenLiClick = function (result) {
        listTemplate();
      };

      var TypeUri = my_aqua.netdiskRoot + "/" + that.htmltemplate_aquaPath.htmltemplate_folder;
      TemplateAqua.getQuery({
        objectType: 'application/cdmi-container',
        url: TypeUri,
      }, function (result) {
        var containers = result.container || [];
        var list = containers.map(function (notice, i) {
          return {
            key: notice.objectName.substr(0, (notice.objectName.length - 1)),
            value: notice.objectName.substr(0, (notice.objectName.length - 1)),
          };
        });
        that.TemplateTypeSelect.updateSelectOptions(list);
        listTemplate();
      });

      function listTemplate() {
        var template = that.TemplateTypeSelect.getValue();
        var TemplateUri = my_aqua.netdiskRoot + "/" + that.htmltemplate_aquaPath.htmltemplate_folder + template + "/";
        TemplateAqua.getQuery({
          objectType: 'application/cdmi-container',
          url: TemplateUri,
        }, function (result) {
          var containers = result.container || [];
          var list = containers.map(function (notice, i) {
            var value = notice.objectName.substr(0, (notice.objectName.length - 1));
            return {
              key: value,
              value: value,
              path: my_aqua.netdiskRoot + "/" + that.htmltemplate_aquaPath.htmltemplate_folder + template + "/",
              name: value
            };
          });
          $('#sucai_template_type_items_container').mCustomScrollbar('destroy');
          $('#sucai_template_type_items_container').empty();
          list.forEach(function (item, index) {
            $('<div class="item">' +
                '<div class="radio">' +
                  '<div class="checkbox">' +
                    '<input type="radio" name="sucaiTemplate" data-path="' + item.path + '" data-name="' + item.name + '" id="sucaiTemplate' + index + '"  ' + ((index == 0) ? 'checked' : '') + '>' +
                    '<label for="sucaiTemplate' + index + '"> </label>' +
                  '</div>' +
                  '</div>' +
                '<div class="item_label">' + item.value + '</div>' +
              '</div>').appendTo($('#sucai_template_type_items_container'));
          });
          if (list.length > 0) {
            var path = list[0].path
            var name = list[0].name
            var url = my_aqua.restRoot + path + name + "/" + 'index.html';
            that.initIframe(url);
            that.checkedTemplate = {
              type: template,
              name: name
            };
          }
          $('#sucai_template_type_items_container').mCustomScrollbar({
            theme: "dark-thick",
            axis: "y"
          });
          $('#sucai_template_type_items_container' + " .mCSB_inside > .mCSB_container").css({
            "margin-right": "0px"
          });
          $('#sucai_template_type_items_container').mCustomScrollbar("update");
        })
      }
    },
    initIframe: function (url) {
      $(".sucai_img_chooseTemplate_dialog_content .template_left .template_preview .template_preview_content").html('<iframe style="width:100%;height:100%;" frameborder="0" marginheight="0" marginwidth="0"></iframe>');
      $(".sucai_img_chooseTemplate_dialog_content .template_left .template_preview .template_preview_content")[0].children[0].src = url;
    },
    bindEvent: function () {
      var that = this;
      $('#sucai_template_type_items_container').on('click', 'input[name=sucaiTemplate]', function () {
        var item = $(this);
        var path = item.attr('data-path');
        var name = item.attr('data-name');
        var url = my_aqua.restRoot + path + name + '/' + 'index.html';
        that.checkedTemplate = {
          type: that.TemplateTypeSelect.getValue(),
          name: name
        }
        that.initIframe(url);
      });
      $('#sucai_img_chooseTemplate_dialog_confirm').click(function () {
        if (that.checkedTemplate.type && that.checkedTemplate.name) {
          var checked = $('#sucai_template_type_items_container input[name=sucaiTemplate]:checked');
          var path = checked.attr('data-path');
          var name = checked.attr('data-name');
          var url = my_aqua.netdiskRoot + "/" + that.htmltemplate_aquaPath.htmltemplate_save_folder;
          var result = TemplateAqua.getSaveFolder(url);
          TemplateAqua.copyFolder({
              path: path,
              name: name,
            }, {
              path: result.path,
              name: result.name,
            }, function () {
              var dialog = Object.create(editTemplateDialog);
              dialog.open({
                path: result.path,
                name: result.name
              }, that.checkedTemplate, function (url) {
                that.dialog.close();
                that.callback(url);
              });
            }, function () {
              messageDialog.openError(i18n("SUCAITEMPLATE_COPYFOLDERFAILED"));
            }
          );
        } else {
          messageDialog.openError(i18n("SUCAITEMPLATE_PLEASECHOOSETEMPLATE"));
        }
      });
    }
  };

  var editTemplateDialog = {
    open: function (folder, templateDetail, callback, booleanNeedCreateChooseTemplateDialog) {
      var that = this;
      that.path = folder.path;
      that.name = folder.name;
      that.url = my_aqua.restRoot + that.path + that.name + '/';
      that.templateDetail = templateDetail;
      that.callback = callback;
      var dialog = new PopupDialog_({
        url: 'content/su_cai/template/editTemplate.html',
        width: 1220,
        height: 619,
        context: that,
        callback: function () {
          if (that.templateDetail.type) {
            $('#editTemplate_type').text(that.templateDetail.type);
          }
          if (that.templateDetail.name) {
            $('#editTemplate_name').text(that.templateDetail.name);
          }
          that.initIframe();
          that.bindEvent(booleanNeedCreateChooseTemplateDialog);
          var url = that.url + 'template.json';
          API.getTemplateJson(url, function (data) {
            that.initRightList(data);
            if(data.jumpToHtmlName){
              that.Iframe.addOkHtml(data.jumpToHtmlName);
            }
          });
        }
      });
      dialog.open();
      that.dialog = dialog;
    },
    initIframe: function () {
      var that = this;
      var Iframe = Object.create(that.Iframe);
      Iframe.init(that.url);
      that.Iframe = Iframe;
    },
    initRightList: function (data) {
      var that = this;
      var RightList = Object.create(that.List);
      RightList.init(that.url, data, that);
    },
    bindEvent: function (booleanNeedCreateChooseTemplateDialog) {
      var that = this;
      $('.sucai_img_editTemplate_dialog_content .button.refresh').click(function () {
        that.initIframe();
      });
      $('#editTemplate_confirm').click(function () {
        var path = that.path;
        var oldName = that.name;
        var newName = Array.prototype.slice.call(that.name, 0, -4).join("");
        TemplateAqua.renameContainer(path, oldName, newName);
        that.dialog.close();
        var url = my_aqua.restRoot + path + newName + '/' + 'index.html';
        that.callback(url);
      });
      if (booleanNeedCreateChooseTemplateDialog) {
        $('#editTemplate_close').click(function () {
          messageDialog.openError(i18n("SUCAITEMPLATE_DIALOG1"), function () {
            that.dialog.close();
          });
        });
        $('#editTemplate_chooseTemplate').click(function () {
          messageDialog.openError(i18n("SUCAITEMPLATE_DIALOG2"), function () {
            that.dialog.close();
            var dialog = Object.create(chooseTemplateDialog);
            dialog.open(that.callback);
          });
        });
      } else {
        $('.sucai_create_dialog.editTemplate .popup_dialog_clear_close').unbind('click').click(function () {
          messageDialog.openError(i18n("SUCAITEMPLATE_DIALOG2"), function () {
            that.dialog.close();
          });
        });
      }
    },
    List: {
      init: function (url, data, dialog) {
        var that = this;
        that.url = url;
        that.dialog = dialog;
        that.data = data.items || [];
        that.list = [];
        that.initList();
        that.bindEvent();
      },
      initList: function () {
        var that = this;

        var items = that.data;
        that.list = items.map(function (item, index) {
          var subContainer = $('<div class="item"></div>');
          subContainer.appendTo($('.sucai_create_dialog .sucai_img_editTemplate_dialog_content .template_items'));
          return that.initTemplateItem(item, subContainer, index);
        });
        $('.sucai_create_dialog .sucai_img_editTemplate_dialog_content .template_items').mCustomScrollbar({
          theme: "dark-thick",
          axis: "y"
        });
        $('.sucai_create_dialog .sucai_img_editTemplate_dialog_content .template_items' + " .mCSB_inside > .mCSB_container").css({
          "margin-right": "0px"
        });
        $('.sucai_create_dialog .sucai_img_editTemplate_dialog_content .template_items').mCustomScrollbar("update");
      },
      bindEvent: function () {
        var that = this;
        $('.sucai_create_dialog .sucai_img_editTemplate_dialog_content .template_items').on('click', '.button[data-type=replace]', function () {
          var item = $(this);
          var index = item.attr('data-index');
          var item = that.data[parseInt(index)];
          switch (item.type) {
            case "image":
              var Dialog = Object.create(replaceImgDialog);
              Dialog.open(that.url, item, function () {
                that.list[index].updateImage();
                that.dialog.Iframe.update(0);
              });
              break;
            case "text":
              var Dialog = Object.create(editTextDialog);
              Dialog.open(that.url, item, function () {
                that.list[index].updateImage();
                that.dialog.Iframe.update(0);
              });
              break;
          }
        });
      },
      initTemplateItem: function (item, container, index) {
        var that = this;
        var imgContainer = $('<div class="imgContainer"></div>');
        var src = that.url + API.getPropertyValueFromTemplateJson('fileName', item) + "?time=" + (new Date()).getTime();
        var img = $('<img src="' + src + '"/>')
        imgContainer.append(img);
        imgContainer.appendTo(container);

        var detailContainer = $('<div class="detailContainer"></div>');
        detailContainer.appendTo(container);

        var details = item.parms.filter(function (parm) {
          return parm.visible
        });

        details.forEach(function (detail) {
          that.addDetail({
            detailContainer: detailContainer,
            title: detail.desc + ": ",
            content: detail.value,
          });
        });
        switch (item.type) {
          case "image":
            $('<div class="button" data-type="replace" data-index="' + index + '">' + i18n('SUCAITEMPLATE_REPLACE') + '</div>').appendTo(detailContainer);
            break;
          case "text":
            $('<div class="button" data-type="replace" data-index="' + index + '">' + i18n('SUCAITEMPLATE_EDIT') + '</div>').appendTo(detailContainer);
            break;
        }

        return {
          updateImage: function () {
            img.attr('src', that.url + API.getPropertyValueFromTemplateJson('fileName', item) + "?time=" + (new Date()).getTime())
          }
        }
      },
      addDetail: function (options) {
        var detail = $('<div class="detail_item"></div>').appendTo(options.detailContainer);
        var detail_title = $('<div class="title"></div>').appendTo(detail).text(options.title);
        var detail_content = $('<div class="content"></div>').appendTo(detail).text(options.content);
      }
    },
    Iframe: {
      init: function (url) {
        var that = this;
        that.url = url;
        that.index = 0;
        that.addIframe();
        that.bindEvent();
      },
      addOkHtml:function(okHtml){
        var that = this;
        if(okHtml){
          that.okHtml = okHtml;
          $(".sucai_img_editTemplate_dialog_content .template_left .template_preview").addClass('okHtml');
        }
      },
      addIframe: function () {
        var that = this;
        var $iframe = $('<iframe style="width:100%;height:100%;" frameborder="0" marginheight="0" marginwidth="0"></iframe>');
        $(".sucai_img_editTemplate_dialog_content .template_left .template_preview .template_preview_content").append($iframe);
        $iframe.attr('src', that.url + "index.html");
        that.$iframe = $iframe;
      },
      update: function(index) {
        var that = this;
        if(typeof index !== 'undefined'){
          that.index = index;
        }
        switch (that.index){
          case 0:
            that.$iframe.attr('src', that.url + "index.html");
            break;
          case 1:
            that.$iframe.attr('src', that.url + that.okHtml);
            break;
        }
      },
      bindEvent: function () {
        var that = this;
        $(".sucai_img_editTemplate_dialog_content").on('click','.leftArrow', function(){
          if(that.okHtml){
            if(that.index == 1){
              that.index = 0;
              that.$iframe.attr('src', that.url + "index.html");
            }
          }
        });
        $(".sucai_img_editTemplate_dialog_content").on('click','.rightArrow', function(){
          if(that.okHtml){
            if(that.index == 0){
              that.index = 1;
              that.$iframe.attr('src', that.url + that.okHtml);
            }
          }
        });
      }
    },
  };

  var replaceImgDialog = {
    open: function (url, data, callback) {
      var that = this;
      that.url = url;
      that.data = data;
      that.uploadedImageType = null;
      that.uploadedImageName = null;
      that.uploadedImageURL = null;
      that.dialog = null;
      that.callback = callback;
      var dialog = new PopupDialog_({
        url: 'content/su_cai/template/replaceImgDialog.html',
        width: 1220,
        height: 679,
        context: that,
        callback: function () {
          var $img = $('<img>');
          var img = new Image();
          img.onload = function () {
            $img.appendTo($(".sucai_img_template_replaceImgDialog .template_left .template_preview .template_preview_content"));
            $img.attr('src', that.uploadedImageURL);
            that.initCropper();
            that.initRightList();
            that.bindEvent();
          };
          that.uploadedImageURL = that.url + API.getPropertyValueFromTemplateJson('fileName', that.data) + "?time=" + (new Date()).getTime();
          img.src = that.uploadedImageURL;

        }
      });
      dialog.open();
      that.dialog = dialog;
    },
    initCropper: function () {
      var that = this;
      var $image = $(".sucai_img_template_replaceImgDialog .template_left .template_preview .template_preview_content img")
      var width = API.getPropertyValueFromTemplateJson('width', that.data);
      var height = API.getPropertyValueFromTemplateJson('height', that.data);

      var cropper = $image.cropper({
        aspectRatio: width / height,
        ready: function () {
          that.cropper.setData({
            "x": 0,
            "y": 0,
            "width": width,
            "height": height,
            "rotate": 0,
            "scaleX": 1,
            "scaleY": 1
          })
        },
        crop: function (e) {
          var data = e.detail;
          var cropperX = $('#replaceImgDialog_cropperX')[0];
          var cropperY = $('#replaceImgDialog_cropperY')[0];
          cropperX.value = Math.round(data.x);
          cropperY.value = Math.round(data.y);
        },
      });
      that.cropper = $image.data('cropper');
    },
    initRightList: function () {
      var that = this;
      var item = that.data;

      var detailContainer = $('.sucai_img_template_replaceImgDialog .template_items');

      var details = item.parms.filter(function (parm) {
        return parm.visible
      });

      addDetail({
        detailContainer: detailContainer,
        title: "X : ",
        content: "",
        otherText: "px",
        editable: true,
        id: "replaceImgDialog_cropperX"
      });

      addDetail({
        detailContainer: detailContainer,
        title: "Y : ",
        content: "",
        otherText: "px",
        editable: true,
        id: "replaceImgDialog_cropperY"
      });

      details.forEach(function (detail) {
        addDetail({
          detailContainer: detailContainer,
          title: detail.desc + ": ",
          content: detail.value,
          editable: detail.editable,
        });
      });

      $('.sucai_create_dialog .sucai_img_template_replaceImgDialog .template_items').mCustomScrollbar({
        theme: "dark-thick",
        axis: "y"
      });
      $('.sucai_create_dialog .sucai_img_template_replaceImgDialog .template_items' + " .mCSB_inside > .mCSB_container").css({
        "margin-right": "0px"
      });
      $('.sucai_create_dialog .sucai_img_template_replaceImgDialog .template_items').mCustomScrollbar("update");
      function addDetail(options) {
        var detail = $('<div class="detail_item"></div>').appendTo(options.detailContainer);
        var detail_title = $('<div class="title"></div>').appendTo(detail).text(options.title);
        var detail_content = $('<div class="content"><input readonly></div>').appendTo(detail);
        detail_content.find('input').val(options.content);
        (typeof options.id !== 'undefined') && detail_content.find('input').attr("id", options.id);
        (typeof options.otherText !== 'undefined') && detail_content.append($('<span></span>').text(options.otherText));
        var input = detail_content.find('input');
        options.editable && input.removeAttr('readonly');
      }
    },
    bindEvent: function () {
      var that = this;
      $('.sucai_img_template_replaceImgDialog').on('click', '.cbutton.operate', function () {
        var item = $(this);
        var type = item.attr('data-type');
        switch (type) {
          case "zoomout":
            that.cropper.zoom(0.1);
            break;
          case "zoomin":
            that.cropper.zoom(-0.1);
            break;
          case "anticlockwise":
            that.cropper.rotate(-45);
            break;
          case "clockwise":
            that.cropper.rotate(45);
            break;
        }

      });

      var inputImage = document.getElementById('replaceImgDialog_inputImage');
      inputImage.onchange = function () {
        var URL = window.URL || window.webkitURL;
        var files = this.files;
        var file;
        if (files && files.length) {
          file = files[0];
          if (/^image\/\w+/.test(file.type)) {
            that.uploadedImageType = file.type;
            that.uploadedImageName = file.name;
            if (that.uploadedImageURL) {
              URL.revokeObjectURL(that.uploadedImageURL);
            }
            that.uploadedImageURL = URL.createObjectURL(file);
            var $image = $(".sucai_img_template_replaceImgDialog .template_left .template_preview .template_preview_content img");
            var img = new Image();
            img.onload = function () {
              that.initCropper();
              inputImage.value = null;
            };
            img.src = that.uploadedImageURL;
            $image.cropper('destroy').attr('src', that.uploadedImageURL);
          } else {
            window.alert('Please choose an image file.');
          }
        }
      };

      $('#replaceImgDialog_confirm').click(function () {
        var width = API.getPropertyValueFromTemplateJson('width', that.data);
        var height = API.getPropertyValueFromTemplateJson('height', that.data);
        var url = that.cropper.getCroppedCanvas({
          width: Number(width),
          height: Number(height),
        }).toDataURL(that.uploadedImageType);

        var b64 = url.slice(url.indexOf(',') + 1);
        var str = atob(b64);
        var arr = str.split('').map(function (e) {
          return e.charCodeAt(0);
        });
        var u8arr = new Uint8ClampedArray(arr);

        var fileName = API.getPropertyValueFromTemplateJson('fileName', that.data);
        var mime = TemplateAqua.getContentType(API.getPropertyValueFromTemplateJson('fileType', that.data)) || that.uploadedImageType;
        var file = new File([u8arr], fileName, {
          type: mime
        });

        var pathArray = that.url.split("/aqua/rest/cdmi");
        var path = pathArray[1];

        var p = new Promise(function (resolve, reject) {
          TemplateAqua.uploadImg(file, path, fileName, mime, function () {
            resolve()
          }, function () {
            reject("uploadImg failed")
          });
        });
        p.then(function () {
          that.cropper.destroy();
          that.dialog.close();
          that.callback();
        }, function () {
          messageDialog.openError("上传" + fileName + "失败");
        });
      });
      $('#replaceImgDialog_close').click(function(){
        that.cropper.destroy();
      });
    },
  };

  var editTextDialog = {
    open: function (url, data, callback) {
      var that = this;
      that.url = url;
      that.data = data;
      that.dialog = null;
      that.requestArray = [];
      that.callback = callback;
      var dialog = new PopupDialog_({
        url: 'content/su_cai/template/editTextDialog.html',
        width: 760,
        height: 258,
        context: that,
        callback: function () {
          that.initInputs();
          that.bindEvent();
        }
      });
      dialog.open();
      that.dialog = dialog;
    },
    initInputs: function () {
      var that = this;
      var container = $('.sucai_img_template_editTextDialog');

      var item = that.data;
      var details = item.parms;

      var requestArray = [];

      var maxlength = API.getPropertyValueFromTemplateJson('bodyMaxLength', item);
      details.forEach(function (detail) {
        var obj = {}
        if (detail.visible) {
          var option = {
            container: container,
            title: detail.desc,
            value: detail.value,
            editable: detail.editable,
            ptype: detail.ptype,
            pname: detail.pname
          };
          if ((detail.pname == 'body') && (typeof maxlength !== 'undefined')) {
            option.maxlength = maxlength;
          }
          if (detail.pname == 'bodyMaxLength') {
            option.containerStyle = {width: 300};
          }
          obj = addDetail(option);
        } else {
          obj = {
            parm: detail.pname,
            get: function () {
              return detail.value;
            }
          }
        }
        if (detail.request) {
          requestArray.push(obj);
        }
      });
      that.requestArray = requestArray;

      var height = container.height() + 51 + 60 + 18;
      that.dialog.resize({
        height: height
      }, true);

      function addDetail(options) {
        var detail = $('<div class="item"></div>').appendTo(options.container);
        var detail_title = $('<div class="title"></div>').appendTo(detail).text(options.title);
        var detail_content = $('<div class="content"><input></div>').appendTo(detail);
        options.containerStyle && detail_content.css(options.containerStyle);
        var input = detail_content.find('input');
        (typeof options.maxlength !== 'undefined') && input.attr('maxlength', maxlength);
        switch (options.ptype) {
          case "string":
            input.val(options.value).attr('readonly', '');
            break;
          case "list":
            input.val(JSON.stringify(options.value)).attr('readonly', '');
            input.attr('placeholder', i18n('SUCAITEMPLATE_PLACEHOLDER_LIST'));
            break;
          case "boolean":
            input.val(JSON.stringify(options.value)).attr('readonly', '');
            input.attr('placeholder', i18n('SUCAITEMPLATE_PLACEHOLDER_BOOLEAN'));
            break;
          default:
            input.val(options.value).attr('readonly', '');
            break;
        }
        options.editable && input.removeAttr('readonly');

        return {
          parm: options.pname,
          get: function () {
            if (options.editable) {
              var value = detail_content.find('input').val();
              return getValue(value, options.ptype && options.ptype.toLowerCase());
            } else {
              return options.value;
            }
          }
        }
      }

      function getValue(value, ptype) {
        var result = value;
        switch (ptype) {
          case "string":
            result = value + '';
            break;
          case "list":
            try{
              result = JSON.parse(value);
            }catch(e){
              result = value + '';
            }
            break;
          case "int":
            result = parseInt(value);
            break;
          case "boolean":
            if (value.toLowerCase() == "true") {
              result = true;
            }
            if (value.toLowerCase() == "false") {
              result = false;
            }
            break;
        }
        return result;
      }
    },
    bindEvent: function () {
      var that = this;
      $('#replaceImgDialog_confirm').click(function () {
        var url = that.url + API.getPropertyValueFromTemplateJson('fileName', that.data);
        var options = {};
        for(var item of that.requestArray){
          options[item.parm] = item.get();
        }
        var pathArray = url.split("/aqua/rest/cdmi");
        var path = pathArray[1];
        options['netdisk'] = {
          'relative_path': path
        };
        API.textToImage(options, function () {
          that.dialog.close();
          that.callback();
        }, function () {
          messageDialog.openError(i18n("SUCAITEMPLATE_EDITTEXTTOIMAGEFAILED"));
        })
      });
    }
  };

  var messageDialog = {
    openWarn: function (msg, callback) {
      var dialog = new PopupDialog_({
        url: 'content/su_cai/template/warn_dialog.html',
        width: 477,
        height: 255,
        context: {},
        callback: function () {
          $('#utils_dialog_info_msg').text(msg);
          $('#utils_dialog_info_submit').on('click', function () {
            dialog.close();
            if (typeof callback == 'function') {
              callback();
            }
          });
        }
      });
      dialog.open();
    },
    openError: function (msg, callback) {
      var dialog = new PopupDialog_({
        url: 'content/su_cai/template/error_dialog.html',
        width: 477,
        height: 255,
        context: {},
        callback: function () {
          $('#utils_dialog_info_msg').text(msg);
          $('#utils_dialog_info_submit').on('click', function () {
            dialog.close();
            if (typeof callback == 'function') {
              callback();
            }
          });
        }
      });
      dialog.open();
    },
  };

  var API = {
    getTemplateJson: function (url, callback) {
      $.ajax({
        type: 'GET',
        async: true,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        dataType: 'json',
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        var data = {};
        callback && callback(data);
      });
    },
    getPropertyValueFromTemplateJson: function (key, data) {
      var array = data.parms || [];
      var obj = array.filter(function (item) {
        return item.pname == key
      });
      if (obj.length > 0) {
        return obj[0].value;
      }
    },
    textToImage: function (data, successCallback, errorCallback) {
      var that = this;
      var taken = "user_id=" + my.paas.user_id +
        "&user_type=" + my.paas.user_type +
        "&access_token=" + my.paas.access_token +
        "&app_key=" + paasAppKey +
        "&timestamp=";
      var url = paasHost + paasDomain + "/textgraphics/picture_creator/single_layer_text?" + taken + new Date().toISOString();
      $.ajax({
        type: "POST",
        async: true,
        url: url,
        contentType: "application/json",
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
        },
        data: JSON.stringify(data),
      }).done(function (data) {
        successCallback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback();
      });
    }
  };

  var TemplateAqua = {
    init: function () {
      var that = this;
      that.aquaUtil = new AquaUtil({
        accessKeyId: my_aqua.accessKeyId,
        secretAccessKey: my_aqua.secretAccessKey
      });
    },
    getQuery: function (options, callback) {
      var that = this;
      var objectType = options.objectType;
      var url = options.url;
      that.aquaUtil.query({
        objectType: objectType,
        scopeSpec: [{
          parentURI: '== ' + url,
        }],
        resultsSpec: {},
        preserve: true,
        async: true,
        callback: callback
      });
    },
    getSaveFolder: function (url) {
      var that = this;
      var time_date = new Date();
      var time = time_date.getTime() + "";
      var random = Math.floor(Math.random(time_date.getTime()) * 1000000);
      var mainFolderName = time + random + ".tmp";//time.substring(time.length - 4);
      var mainFolder = that.aquaUtil.getContainer({
        path: url,
        name: mainFolderName
      });
      if (!mainFolder.isExist()) {
        mainFolder.create(false);
        return {
          path: url,
          name: mainFolderName,
        }
      } else {
        return that.getSaveFolder(url);
      }
    },
    copyFolder: function (from, to, successCallback, errorCallback) {
      var that = this;
      that.getQuery({
        objectType: 'application/cdmi-object',
        url: from.path + from.name + "/",
      }, function (result) {
        var objects = result.objects || [];
        var list = objects.map(function (notice, i) {
          var objectName = notice.objectName;
          var obj = that.aquaUtil.getObject({
            path: to.path + to.name + "/",
            name: objectName
          });
          var p = new Promise(function (resolve, reject) {
            //这里要求同步
            obj.copyFrom(false, from.path + from.name + "/" + objectName, function () {
              resolve()
            }, function () {
              reject(from.path + from.name + "/" + objectName + " copy failed")
            });
          });
          return p;
        });
        Promise.all(list).then(function () {
          successCallback();
        }, function (reason) {
          errorCallback(reason)
        });
      })
    },
    uploadImg: function (file, path, name, mime, successCallback, errorCallback) {
      var that = this;
      var aquaUtil = that.aquaUtil;
      var ofile = aquaUtil.getObject({
        path: path,
        name: name,
      });
      ofile.create(false, {
        mimetype: mime,
        metadata: {}
      });
      var req = new XMLHttpRequest();
      req.open('PUT', ofile.url, true);
      var rauth = aquaUtil.getAjaxRequestHeaders('PUT', ofile.url, mime);
      for (var header in rauth) {
        if (rauth.hasOwnProperty(header)) {
          req.setRequestHeader(header, rauth[header])
        }
      }
      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          if (req.status == 200 || req.status == 204) {
            successCallback();
          } else {
            errorCallback();
          }
        }
      };
      req.send(file);
    },
    getContentType: function (type) {
      var contentTypeMap = {
        "001": "application/x-001",
        "301": "application/x-301",
        "323": "text/h323",
        "906": "application/x-906",
        "907": "drawing/907",
        "a11": "application/x-a11",
        "acp": "audio/x-mei-aac",
        "ai": "application/postscript",
        "aif": "audio/aiff",
        "aifc": "audio/aiff",
        "aiff": "audio/aiff",
        "anv": "application/x-anv",
        "asa": "text/asa",
        "asf": "video/x-ms-asf",
        "asp": "text/asp",
        "asx": "video/x-ms-asf",
        "au": "audio/basic",
        "avi": "video/avi",
        "awf": "application/vnd.adobe.workflow",
        "biz": "text/xml",
        "bmp": "application/x-bmp",
        "bot": "application/x-bot",
        "c4t": "application/x-c4t",
        "c90": "application/x-c90",
        "cal": "application/x-cals",
        "cat": "application/vnd.ms-pki.seccat",
        "cdf": "application/x-netcdf",
        "cdr": "application/x-cdr",
        "cel": "application/x-cel",
        "cer": "application/x-x509-ca-cert",
        "cg4": "application/x-g4",
        "cgm": "application/x-cgm",
        "cit": "application/x-cit",
        "class": "java/*",
        "cml": "text/xml",
        "cmp": "application/x-cmp",
        "cmx": "application/x-cmx",
        "cot": "application/x-cot",
        "crl": "application/pkix-crl",
        "crt": "application/x-x509-ca-cert",
        "csi": "application/x-csi",
        "css": "text/css",
        "cut": "application/x-cut",
        "dbf": "application/x-dbf",
        "dbm": "application/x-dbm",
        "dbx": "application/x-dbx",
        "dcd": "text/xml",
        "dcx": "application/x-dcx",
        "der": "application/x-x509-ca-cert",
        "dgn": "application/x-dgn",
        "dib": "application/x-dib",
        "dll": "application/x-msdownload",
        "doc": "application/msword",
        "dot": "application/msword",
        "drw": "application/x-drw",
        "dtd": "text/xml",
        "dwf": "Model/vnd.dwf",
        "dwf": "application/x-dwf",
        "dwg": "application/x-dwg",
        "dxb": "application/x-dxb",
        "dxf": "application/x-dxf",
        "edn": "application/vnd.adobe.edn",
        "emf": "application/x-emf",
        "eml": "message/rfc822",
        "ent": "text/xml",
        "epi": "application/x-epi",
        "eps": "application/x-ps",
        "eps": "application/postscript",
        "etd": "application/x-ebx",
        "exe": "application/x-msdownload",
        "fax": "image/fax",
        "fdf": "application/vnd.fdf",
        "fif": "application/fractals",
        "fo": "text/xml",
        "frm": "application/x-frm",
        "g4": "application/x-g4",
        "gbr": "application/x-gbr",
        "gcd": "application/x-gcd",
        "gif": "image/gif",
        "gl2": "application/x-gl2",
        "gp4": "application/x-gp4",
        "hgl": "application/x-hgl",
        "hmr": "application/x-hmr",
        "hpg": "application/x-hpgl",
        "hpl": "application/x-hpl",
        "hqx": "application/mac-binhex40",
        "hrf": "application/x-hrf",
        "hta": "application/hta",
        "htc": "text/x-component",
        "htm": "text/html",
        "html": "text/html",
        "htt": "text/webviewhtml",
        "htx": "text/html",
        "icb": "application/x-icb",
        "ico": "image/x-icon,application/x-ico",
        "iff": "application/x-iff",
        "ig4": "application/x-g4",
        "igs": "application/x-igs",
        "iii": "application/x-iphone",
        "img": "application/x-img",
        "ins": "application/x-internet-signup",
        "isp": "application/x-internet-signup",
        "IVF": "video/x-ivf",
        "java": "java/*",
        "jfif": "image/jpeg",
        "jpe": "image/jpeg,application/x-jpe",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg,application/x-jpg",
        "js": "application/x-javascript",
        "jsp": "text/html",
        "la1": "audio/x-liquid-file",
        "lar": "application/x-laplayer-reg",
        "latex": "application/x-latex",
        "lavs": "audio/x-liquid-secure",
        "lbm": "application/x-lbm",
        "lmsff": "audio/x-la-lms",
        "ls": "application/x-javascript",
        "ltr": "application/x-ltr",
        "m1v": "video/x-mpeg",
        "m2v": "video/x-mpeg",
        "m3u": "audio/mpegurl",
        "m4e": "video/mpeg4",
        "mac": "application/x-mac",
        "man": "application/x-troff-man",
        "math": "text/xml",
        "mdb": "application/msaccess,application/x-mdb",
        "mfp": "application/x-shockwave-flash",
        "mht": "message/rfc822",
        "mhtml": "message/rfc822",
        "mi": "application/x-mi",
        "mid": "audio/mid",
        "midi": "audio/mid",
        "mil": "application/x-mil",
        "mml": "text/xml",
        "mnd": "audio/x-musicnet-download",
        "mns": "audio/x-musicnet-stream",
        "mocha": "application/x-javascript",
        "movie": "video/x-sgi-movie",
        "mp1": "audio/mp1",
        "mp2": "audio/mp2",
        "mp2v": "video/mpeg",
        "mp3": "audio/mp3",
        "mp4": "video/mpeg4",
        "mpa": "video/x-mpg",
        "mpd": "application/vnd.ms-project",
        "mpe": "video/x-mpeg",
        "mpeg": "video/mpg",
        "mpg": "video/mpg",
        "mpga": "audio/rn-mpeg",
        "mpp": "application/vnd.ms-project",
        "mps": "video/x-mpeg",
        "mpt": "application/vnd.ms-project",
        "mpv": "video/mpg",
        "mpv2": "video/mpeg",
        "mpw": "application/vnd.ms-project",
        "mpx": "application/vnd.ms-project",
        "mtx": "text/xml",
        "mxp": "application/x-mmxp",
        "net": "image/pnetvue",
        "nrf": "application/x-nrf",
        "nws": "message/rfc822",
        "odc": "text/x-ms-odc",
        "out": "application/x-out",
        "p10": "application/pkcs10",
        "p12": "application/x-pkcs12",
        "p7b": "application/x-pkcs7-certificates",
        "p7c": "application/pkcs7-mime",
        "p7m": "application/pkcs7-mime",
        "p7r": "application/x-pkcs7-certreqresp",
        "p7s": "application/pkcs7-signature",
        "pc5": "application/x-pc5",
        "pci": "application/x-pci",
        "pcl": "application/x-pcl",
        "pcx": "application/x-pcx",
        "pdf": "application/pdf",
        "pdx": "application/vnd.adobe.pdx",
        "pfx": "application/x-pkcs12",
        "pgl": "application/x-pgl",
        "pic": "application/x-pic",
        "pko": "application/vnd.ms-pki.pko",
        "pl": "application/x-perl",
        "plg": "text/html",
        "pls": "audio/scpls",
        "plt": "application/x-plt",
        "png": "image/png,application/x-png",
        "pot": "application/vnd.ms-powerpoint",
        "ppa": "application/vnd.ms-powerpoint",
        "ppm": "application/x-ppm",
        "pps": "application/vnd.ms-powerpoint",
        "ppt": "application/vnd.ms-powerpoint,application/x-ppt",
        "pr": "application/x-pr",
        "prf": "application/pics-rules",
        "prn": "application/x-prn",
        "prt": "application/x-prt",
        "ps": "application/x-ps",
        "ps": "application/postscript",
        "ptn": "application/x-ptn",
        "pwz": "application/vnd.ms-powerpoint",
        "r3t": "text/vnd.rn-realtext3d",
        "ra": "audio/vnd.rn-realaudio",
        "ram": "audio/x-pn-realaudio",
        "ras": "application/x-ras",
        "rat": "application/rat-file",
        "rdf": "text/xml",
        "rec": "application/vnd.rn-recording",
        "red": "application/x-red",
        "rgb": "application/x-rgb",
        "rjs": "application/vnd.rn-realsystem-rjs",
        "rjt": "application/vnd.rn-realsystem-rjt",
        "rlc": "application/x-rlc",
        "rle": "application/x-rle",
        "rm": "application/vnd.rn-realmedia",
        "rmf": "application/vnd.adobe.rmf",
        "rmi": "audio/mid",
        "rmj": "application/vnd.rn-realsystem-rmj",
        "rmm": "audio/x-pn-realaudio",
        "rmp": "application/vnd.rn-rn_music_package",
        "rms": "application/vnd.rn-realmedia-secure",
        "rmvb": "application/vnd.rn-realmedia-vbr",
        "rmx": "application/vnd.rn-realsystem-rmx",
        "rnx": "application/vnd.rn-realplayer",
        "rp": "image/vnd.rn-realpix",
        "rpm": "audio/x-pn-realaudio-plugin",
        "rsml": "application/vnd.rn-rsml",
        "rt": "text/vnd.rn-realtext",
        "rtf": "application/msword,application/x-rtf",
        "rv": "video/vnd.rn-realvideo",
        "sam": "application/x-sam",
        "sat": "application/x-sat",
        "sdp": "application/sdp",
        "sdw": "application/x-sdw",
        "sit": "application/x-stuffit",
        "slb": "application/x-slb",
        "sld": "application/x-sld",
        "slk": "drawing/x-slk",
        "smi": "application/smil",
        "smil": "application/smil",
        "smk": "application/x-smk",
        "snd": "audio/basic",
        "sol": "text/plain",
        "sor": "text/plain",
        "spc": "application/x-pkcs7-certificates",
        "spl": "application/futuresplash",
        "spp": "text/xml",
        "ssm": "application/streamingmedia",
        "sst": "application/vnd.ms-pki.certstore",
        "stl": "application/vnd.ms-pki.stl",
        "stm": "text/html",
        "sty": "application/x-sty",
        "svg": "text/xml",
        "swf": "application/x-shockwave-flash",
        "tdf": "application/x-tdf",
        "tg4": "application/x-tg4",
        "tga": "application/x-tga",
        "tif": "image/tiff,application/x-tif",
        "tiff": "image/tiff",
        "tld": "text/xml",
        "top": "drawing/x-top",
        "torrent": "application/x-bittorrent",
        "tsd": "text/xml",
        "txt": "text/plain",
        "uin": "application/x-icq",
        "uls": "text/iuls",
        "vcf": "text/x-vcard",
        "vda": "application/x-vda",
        "vdx": "application/vnd.visio",
        "vml": "text/xml",
        "vpg": "application/x-vpeg005",
        "vsd": "application/vnd.visio,application/x-vsd",
        "vss": "application/vnd.visio",
        "vst": "application/vnd.visio",
        "vst": "application/x-vst",
        "vsw": "application/vnd.visio",
        "vsx": "application/vnd.visio",
        "vtx": "application/vnd.visio",
        "vxml": "text/xml",
        "wav": "audio/wav",
        "wax": "audio/x-ms-wax",
        "wb1": "application/x-wb1",
        "wb2": "application/x-wb2",
        "wb3": "application/x-wb3",
        "wbmp": "image/vnd.wap.wbmp",
        "wiz": "application/msword",
        "wk3": "application/x-wk3",
        "wk4": "application/x-wk4",
        "wkq": "application/x-wkq",
        "wks": "application/x-wks",
        "wm": "video/x-ms-wm",
        "wma": "audio/x-ms-wma",
        "wmd": "application/x-ms-wmd",
        "wmf": "application/x-wmf",
        "wml": "text/vnd.wap.wml",
        "wmv": "video/x-ms-wmv",
        "wmx": "video/x-ms-wmx",
        "wmz": "application/x-ms-wmz",
        "wp6": "application/x-wp6",
        "wpd": "application/x-wpd",
        "wpg": "application/x-wpg",
        "wpl": "application/vnd.ms-wpl",
        "wq1": "application/x-wq1",
        "wr1": "application/x-wr1",
        "wri": "application/x-wri",
        "wrk": "application/x-wrk",
        "ws": "application/x-ws",
        "ws2": "application/x-ws",
        "wsc": "text/scriptlet",
        "wsdl": "text/xml",
        "wvx": "video/x-ms-wvx",
        "xdp": "application/vnd.adobe.xdp",
        "xdr": "text/xml",
        "xfd": "application/vnd.adobe.xfd",
        "xfdf": "application/vnd.adobe.xfdf",
        "xhtml": "text/html",
        "xls": "application/vnd.ms-excel,application/x-xls",
        "xlw": "application/x-xlw",
        "xml": "text/xml",
        "xpl": "audio/scpls",
        "xq": "text/xml",
        "xql": "text/xml",
        "xquery": "text/xml",
        "xsd": "text/xml",
        "xsl": "text/xml",
        "xslt": "text/xml",
        "xwd": "application/x-xwd",
        "x_b": "application/x-x_b",
        "x_t": "application/x-x_t"
      };
      var ret = false;
      if (contentTypeMap[type.toLowerCase()]) {
        ret = contentTypeMap[type.toLowerCase()];
      }
      return ret;
    },
    renameContainer: function (path, oldName, newName) {
      var Folder = this.aquaUtil.getContainer({
        path: path,
        name: newName
      });
      Folder._setter({
        'move': path + oldName + '/'
      }, false);
    }
  };

  return sucai_img_template;
})(jQuery);
