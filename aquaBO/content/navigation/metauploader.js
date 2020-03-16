(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    exports.module = factory(jQuery, UploadModule, AquaUtil) :
    typeof define === 'function' && define.amd ?
    define(['jquery', 'UploadModule'], factory) : (global.MetaUploader = factory(jQuery, UploadModule, AquaUtil))
})(this, (function($, uploader, AquaUtil) {
  var dialog = function(opts) {
    var pane = $.extend(true, {}, Pane);
    var input = pane.init(opts)
    this.getValue = () => {
      return pane.filePath
    }
    this.setValue = (path) => {
      pane.setInputPath(input, path)
    }
  }
  var Pane = {
    filePath: '',
    init(opts) {
      return this.initWidget(opts)
    },
    initWidget({el, background, path}) {
      var timestamp = new Date().getTime();
      var self = this;
      var tree_path = path
      var dom = `<div class='metauploader'>
        <input class='value_input'/>
        <div class='upload_icon' id='upload_btn_${timestamp}'>
      </div>`
      var input = $(dom)
      //css
      input.css({
        display: 'flex',
        background: background||''
      })
      input.find('.value_input').css({
        flex: '1',
        lineHeight: '30px',
        paddingLeft: '10px',
        color: '#797979',
        border: 'none',
        backgroundColor: 'transparent'
      })
      input.find('.upload_icon').css({
        height: '30px',
        width: '30px',
        cursor: 'pointer',
        backgroundImage: 'url(./images/navigation/upload.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      })
      //添加到文档流中，先添加到文档流，再定义上传组建，因为上传组建依赖于是否append到文档流
      $(el).append(input)
      //上传控件
          var upload_file = new uploader(aqua_host, LOGIN_AQUA_USERNAME, LOGIN_AQUA_PWD, LOGIN_AQUA_DOMAIN_URI)
          upload_file.init({
        selectFileBottom: '#' + input.find('.upload_icon').attr('id'),
        uploadPath: NAVIGATION_TREE_ROOT + tree_path,
            checkExist_Boolean: true,
            uploadNow_Boolean: true
          }, {
            _endfun: function(file_name, updateSize, fileSize,file_url, self) {
              console.log(file_url);
            }
          }, {
            _beforeAllStartFun: function(files, next){
              var aqua = new AquaUtil({
                host: aqua_host
              })
              aqua.login({
                path: '/cdmi_users/',
                name: LOGIN_AQUA_USERNAME,
                password: LOGIN_AQUA_PWD,
                domainURI: LOGIN_AQUA_DOMAIN_URI
              })
              var fileFolder = aqua.getContainer({
            path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT + tree_path
              })
              var isFolderExist = fileFolder.isExist()
              if (!isFolderExist) {
                fileFolder.forceCreate();
              }
              next();
            },
            _checkAllExistFun:function(existArray, next) {
          var ret = confirm(i18n('NAVIGATE_UPLOAD_HINT'))
              if (ret) {
                next()
              }
              console.log('exist');
            },
            _allStartFun:function(next) {
          console.log('start:');
              next();
            },
            _afterAllEndFun:function(result) {
              if(result.data.filter(x => x.file_url).length  == result.data.length){
                console.log('upload success');
                console.log(result.data);
                self.setInputPath(input, result.data[0].file_url)
              }else{
                console.log('upload fail');
              }
            }
          })
      //bindEvents
      input.on('click', '.upload_icon', ({currentTarget, target}) => {
        if (currentTarget == target) {
        }
      })
      .on('contextmenu', '*', (e) => {
        //右键弹框
        e.preventDefault();
        var position = {x: e.clientX,y: e.clientY}
        console.log('this is menu');
        $('<div></div>')
      })
      .on('keyup', 'input', ({currentTarget, target}) => {
        if (currentTarget == target) {
          self.setInputPath(input, $(currentTarget).val())
        }
      })
      return input;
    },
    uploadFile(callback) {
      console.log('start upload');
      callback && callback();
    },
    setInputPath(widget, path) {
      this.filePath = path
      widget.find('.value_input').val(this.filePath);
    }
  }
  var API = {
  }
  var Model = {
  }
  return dialog
}))
