(function(global, factory){
  global.SuCaiPublish = factory(jQuery, OverlayDialog, my_aqua)
}(this, (function($, Dialog, Aqua) {
  /**
   * 测试数据
   * 图片素材id:ea0633027962471b88161261ef0015d2
   * 单网页素材id:3321e3c3be8e476792be6823b30a78e1
   * 多网页素材id:72f93491dfda46ab92fc5ae8265c2f5b
   */
  var Pane = {
    step: 0,//0-查看素材内容 1-下载到本地 2-下载后的ZIP文件放入本地发布路径 3-查看本地素材 4-完成发布
    init(id) {
      this.api.getAdItem(id, (adItem) => {
        this.model.adItem = adItem
        this.model.data = this.api.getSuCaiList(adItem)
        this.showStep();
      })
    },
    stepDialogTemplate({step = 0, title = '', content = '', foot = '', width = 646, height = 465}, callback) {
      var dialogId = `su_cai_fa_bu_publish_step${step}_${new Date().getTime()}`,
          dom = `<div id='${dialogId}' class='_dialog'>
            <style>
              #${dialogId} ._dialog_body {position: relative;}
              #${dialogId} ._dialog_body > iframe {position: absolute;top: 0;left: 0;width: 1280px;height: 720px;transform: scale(0.484, 0.494) translate(-658px, -349px);-webkit-transform: scale(0.484, 0.494) translate(-658px, -349px);-moz-transform: scale(0.484, 0.494) translate(-658px, -349px);-o-transform: scale(0.484, 0.494) translate(-658px, -349px);-ms-transform: scale(0.484, 0.494) translate(-658px, -349px);background-color: #fff;background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);background-size: 30px 30px;background-position: 0 0, 15px 15px;}
              #${dialogId} ._dialog_body > img {max-width: 625px;max-height: 356px;position: absolute; top: 10px;left: 12px;}
              #${dialogId} ._dialog_body .leftArrow {position: absolute;width: 46px;height: 55px;left: 15px;top: 160px;background: url("./image/sucai/template/leftArrow.png");background-repeat: no-repeat;display: none;cursor: pointer;}
              #${dialogId} ._dialog_body .rightArrow {position: absolute;width: 46px;height: 55px;right: 15px;top: 160px;background: yellow;background: url("./image/sucai/template/rightArrow.png");background-repeat: no-repeat;display: none;cursor: pointer;}
              #${dialogId} ._dialog_foot {height: 65px;margin: 0;align-items: center;}
              #${dialogId} ._dialog_foot .btn {height: 30px;line-height: 30px;width: auto;padding: 0 28px;margin: 0 11px 0 7px;}
              #${dialogId} ._dialog_foot .btn.confirm {padding-left: 38px;padding-right: 38px;}
              #${dialogId} ._dialog_foot .btn.download {background-image: url(./image/sucaifabu/download.png);background-repeat: no-repeat;background-position: 10px center;padding-right: 9px;}
            </style>
            <div class='_dialog_title'>
              <div class='_dialog_title_label'>${title}</div>
              <div class='_dialog_close'></div>
            </div>
            <div class='_dialog_body'>
              ${content}
            </div>
            <div class='_dialog_foot'>${foot}</div>
          </div>`;
      var dialog = new Dialog({
        id: dialogId,
        content: dom,
        width,
        height,
        local: true,
        context: this,
        callback: () => {
          $('#' + dialogId).on('click', '._dialog_close', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close();
            }
          })
          callback && callback(dialogId);
        }
      })
      return dialog;
    },
    showStep() {
      var step = this.steps['step' + this.step](this)
      step.create();
    },
    steps: {
      step0: (self) => {
        var data = self.model.data,
            url = data[0],
            prefix = /\.([a-z|A-Z]+)$/.exec(url),
            extension = prefix ? prefix[1].toLowerCase() : '',
            content, foot = `<div class='btn cancel' name='cancel'>${i18n('DIALOG_CANCEL')}</div><div class='btn confirm' name='confirm'>${i18n('SUCAIFABU_PUBLISH_NEXTSTEP')}</div>`
        switch (extension) {
          case 'htm':
          case 'html':
            content = `<iframe id='target'></iframe>${
              data.length > 1 ?
              `<div class='leftArrow'></div><div class='rightArrow'></div>`:
              ``
            }`
            break;
          default:
            content = `<img id='target'>`
        }
        var dialog = self.stepDialogTemplate({
          index: 0,
          title: i18n('SUCAIFABU_PUBLISH_P1_TITLE'),
          content: content,
          foot
        }, (ctn) => {
          var index = 0;
          var loadsrc = (index) => {
            $('#' + ctn).find('#target').load(({currentTarget, target}) => {
              if (currentTarget == target) {
                var imgContent = $(currentTarget),
                    type = imgContent[0].nodeName
                if (type == 'IMG') {
                  var width = parseInt(imgContent.css('width'))
                  var height = parseInt(imgContent.css('height'))
                  console.log(`width:${width},height:${height}`);
                  imgContent.css({
                    top: `calc(50% - ${(height / 2)}px)`,
                    left: `calc(50% - ${(width / 2)}px)`
                  })
                }
              }
            }).attr('src', data[index])
            if (index > 0) {
              $('#' + ctn).find('.leftArrow').css('display', 'block')
            } else {
              $('#' + ctn).find('.leftArrow').css('display', '')
            }
            if (index < data.length - 1) {
              $('#' + ctn).find('.rightArrow').css('display', 'block')
            } else {
              $('#' + ctn).find('.rightArrow').css('display', '')
            }
          }
          loadsrc(index)
          $('#' + ctn)
          .on('click', '.leftArrow', ({currentTarget, target}) => {
            if (index > 0) {
              index --
              loadsrc(index);
            }
          })
          .on('click', '.rightArrow', ({currentTarget, target}) => {
            if (index < data.length - 1) {
              index ++
              loadsrc(index);
            }
          })
          .on('click', '._dialog_foot [name=cancel]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close()
            }
          })
          .on('click', '._dialog_foot [name=confirm]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close();
              self.step ++
              self.showStep()
            }
          })
        })
        return dialog;
      },
      step1: (self) => {
        var foot = `<div class='btn cancel' name='cancel'>${i18n('DIALOG_CANCEL')}</div><div class='btn confirm download' name='confirm'>${i18n('SUCAIFABU_PUBLISH_P2_BTN_DOWNLOAD')}</div>`
        var dialog = self.stepDialogTemplate({
          index: 1,
          title: i18n('SUCAIFABU_PUBLISH_P2_TITLE'),
          content: `<img src='./image/sucaifabu/p2.png'>`,
          foot
        }, (ctn) => {
          $('#' + ctn)
          .on('click', '._dialog_foot [name=cancel]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close()
            }
          })
          .on('click', '._dialog_foot [name=confirm]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close();
              window.open(self.api.getZipUrl(self.model.adItem))
              self.step ++
              self.showStep()
            }
          })
        })
        return dialog;
      },
      step2: (self) => {
        var foot = `<div class='btn cancel' name='cancel'>${i18n('DIALOG_CANCEL')}</div><div class='btn confirm' name='confirm'>${i18n('SUCAIFABU_PUBLISH_NEXTSTEP')}</div>`
        var dialog = self.stepDialogTemplate({
          index: 2,
          title: i18n('SUCAIFABU_PUBLISH_P3_TITLE'),
          content: `<img src='./image/sucaifabu/p3.png'>`,
          foot
        }, (ctn) => {
          $('#' + ctn)
          .on('click', '._dialog_foot [name=cancel]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close()
            }
          })
          .on('click', '._dialog_foot [name=confirm]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close();
              self.step ++
              self.showStep()
            }
          })
        })
        return dialog;
      },
      step3: (self) => {
        var data = self.model.data, index = 0
        var loadFrame = (index, done) => {
          var title = `${i18n('SUCAIFABU_PUBLISH_P4_TITLE')}（${(index + 1)}）`,
              width = 646, height = 523,
              content,
              foot = `<div class='btn cancel' name='cancel'>${i18n('DIALOG_CANCEL')}</div>${
                index == data.length - 1 ?
                `<div class='btn confirm' name='confirm'>${i18n('SUCAIFABU_PUBLISH_NEXTSTEP')}</div>`:
                `<div class='btn confirm' name='confirm'>${i18n('SUCAIFABU_PUBLISH_NEXTPAGE')}</div>`
              }`,
              url = data[index].replace(my_aqua.restRoot + my_aqua.netdiskRoot + '/' + storage_images_folder, LocalImageServer),
              prefix = /\.([a-z|A-Z]+)$/.exec(url),
              extension = prefix ? prefix[1].toLowerCase() : ''
          switch (extension) {
            case 'htm':
            case 'html':
              content = `<input class='address' readonly><iframe id='target'></iframe>`
              break;
            default:
              content = `<input class='address' readonly><img id='target'>`
          }
          var dialog = self.stepDialogTemplate({
            index: 3,
            title,
            content,
            foot,
            width,
            height
          }, (ctn) => {
            //事件绑定
            $('#' + ctn)
            .on('click', '._dialog_foot [name=cancel]', ({currentTarget, target}) => {
              if (currentTarget == target) {
                dialog.close()
              }
            })
            .on('click', '._dialog_foot [name=confirm]', ({currentTarget, target}) => {
              if (currentTarget == target) {
                if (index == data.length - 1) {
                  //to next page
                  dialog.close()
                  done();
                } else {
                  dialog.close()
                  index++
                  loadFrame(index, done).create();
                }
              }
            })
            //加载数据
            $('#' + ctn).find('#target').load(({currentTarget, target}) => {
              if (currentTarget == target) {
                var imgContent = $(currentTarget),
                    type = imgContent[0].nodeName
                if (type == 'IMG') {
                  var width = parseInt(imgContent.css('width'))
                  var height = parseInt(imgContent.css('height'))
                  console.log(`width:${width},height:${height}`);
                  imgContent.css({
                    top: `calc(181px + 51px - ${(height / 2)}px)`,
                    left: `calc(50% - ${(width / 2)}px)`
                  })
                } else {
                  imgContent.css({
                    top: '41px'
                  })
                }
              }
            }).attr('src', url);
            $('#' + ctn).find('.address').val(url)
            //渲染
            $('#' + ctn).find('input.address').css({
              width: 'calc(100% - 34px)',
              height: '30px',
              lineHeight: '30px',
              fontSize: '14px',
              paddingLeft: '10px',
              margin: '12px 12px 0',
              color: '#727272',
              outline: 'none'
            })
          })
          return dialog;
        }
        var dialog = loadFrame(index, () => {
          dialog.close();
          self.step ++;
          self.showStep();
        })
        return dialog;
      },
      step4: (self) => {
        var foot = `<div class='btn cancel' name='cancel'>${i18n('DIALOG_CANCEL')}</div><div class='btn confirm icon' name='confirm'>${i18n('SUCAIFABU_PUBLISH_P5_TITLE')}</div>`
        var dialog = self.stepDialogTemplate({
          index: 4,
          title: i18n('SUCAIFABU_PUBLISH_P5_TITLE'),
          content: `<img src='./image/sucaifabu/p5.png'>`,
          foot
        }, (ctn) => {
          $('#' + ctn)
          .on('click', '._dialog_foot [name=cancel]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              dialog.close()
            }
          })
          .on('click', '._dialog_foot [name=confirm]', ({currentTarget, target}) => {
            if (currentTarget == target) {
              var adItem = self.model.adItem;
              var url = self.getChangedHeaderUrl(adItem.aqua_url, LocalImageServer)
              adItem.aqua_url = url
              var link = adItem.link
              if (link) {
                adItem.link = self.getChangedHeaderUrl(link, LocalImageServer)
              }
              self.api.updateSuCai(adItem, () => {
                self.api.passAudit(adItem, () => {
                dialog.close();
                self.api.closeFn();
              })
              })
            }
          })
        })
        return dialog;
      }
    },
    getChangedHeaderUrl(link, header) {
      var finder = my_aqua.netdiskRoot + '/' + storage_images_folder,
          index = link.lastIndexOf(finder),
          exist = link.slice(index).replace(finder, '')
      return header + exist;
    }
  }
  var API = {
    initAqua() {
      Aqua.init(storage_username, storage_password, storage_domain)
    },
    getAdItem(id, callback) {
      var url = paasHost + paasAdvDomain + '/ads/aditem/' + id,
          urlParam = [],
          method = 'Get',
          {user_id, user_type, access_token, platform_current_id=''} = my.paas;
      urlParam.push('user_id=' + user_id)
      urlParam.push('user_type=' + user_type)
      urlParam.push('access_token=' + access_token)
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      if (platform_current_id) {
        urlParam.push('platform_id_list=' + platform_current_id)
      }
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        async: true,
        url: url,
        headers: {
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        contentType: "application/json",
        dataType: "json"
      }).always((data, status, xhr) => {
        if (status == 'success') {
          callback && callback(data)
        } else {
          callback && callback({})
        }
      });
    },
    getZipUrl(adItem) {
      var {ad_id} = adItem
      if (!Aqua.userName) {
        this.initAqua();
      }
      var folder = new Aqua.folder({
        path: storage_images_folder,
        name: ad_id
      })
      folder.checkExist()
      return aquaHost + folder.download(false, true);
    },
    getTemplateJson(url, callback) {
      var method = 'Get'
      $.ajax({
        type: method,
        async: false,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        dataType: 'json'
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          var html = resp.jumpToHtmlName
          callback && callback(url.replace('template.json', html))
        } else {
          callback && callback()
        }
      })
    },
    getSuCaiList(adItem) {
      var ret = []
      var url = adItem.aqua_url || Aqua.getDownloadFileURL(adItem.url),
          prefix = /\.([a-z|A-Z]+)$/.exec(url),
          extension = prefix ? prefix[1].toLowerCase() : ''
      if (['htm', 'html'].includes(extension)) {
        ret.push(url)
        var parentUrlArray = url.split('/').slice(0, -1)
        parentUrlArray.push('template.json')
        this.getTemplateJson(parentUrlArray.join('/'), (url2) => {
          if (url2) {
            ret.push(url2)
          }
        })
      } else {
        ret.push(url)
      }
      return ret;
    },
    passAudit(adItem, callback) {
      var method = 'Put',
          {ad_id} = adItem,
          url = `${paasHost + paasDomain}/auditflow/instance/${SUCAI_ENHANCE ? 'ad_item_2' : 'ad_item'}/${ad_id}`,
          urlParam = [],
          {user_id, user_type, access_token} = my.paas,
          putData = {
            'no': '3',
            'status': 'passed'
          };
      urlParam.push('user_id=' + user_id)
      urlParam.push('user_type=' + user_type)
      urlParam.push('access_token=' + access_token)
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(putData),
        success: () => {
          callback && callback();
        }
      })
    },
    updateSuCai(adItem, callback) {
      var method = 'Put',
          url = `${paasHost + paasAdvDomain}/ads/aditem/${adItem.ad_id}`,
          {user_id, user_type, user_name, access_token, platform_current_id} = my.paas,
          urlParam = [];
      urlParam.push('user_id=' + user_id)
      urlParam.push('user_type=' + user_type)
      urlParam.push('access_token=' + access_token)
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('user_name=' + user_name)
      if (platform_current_id) {
        urlParam.push('platform_id_list=' + platform_current_id)
      }
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(adItem)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    }
  }
  var Model = {}
  var dialog = function({id, done}) {
    var api = $.extend(true, {closeFn: done}, API)
    var model = $.extend(true, {}, Model)
    var pane = $.extend(true, {api, model}, Pane)
    pane.init(id)
  }
  return dialog
})))
