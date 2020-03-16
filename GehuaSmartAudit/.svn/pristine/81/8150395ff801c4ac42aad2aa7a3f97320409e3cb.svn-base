define(['jquery', 'StyleableList', 'StyledSelector', 'PopupDialog', 'Alert', 'NewSelect','mCustomScrollbar'], function($, StyleableList, StyledSelector, PopupDialog, Alert, NewSelect, mCustomScrollbar){
  var TextAudit = function(){};
  var audit_select = '', audit_type = '', review_text_index = 0;
	TextAudit.prototype = {
    // 绑定详情页的事件
    bindEventsParticular(id, callback) {
      var _this = this;
      $.ajax({   //显示页面
        type: 'GET',
        url: 'content/menuVideoAudit/text_audit/text_audit.html'
      }).done(function(data) {
        // 显示或收起详情页
        $("#menuVideoAudit").append(patchHTML(data));
        $('#text_audit .title_head .right .btn').unbind().bind('click', ({currentTarget, target }) => {
          if(target == currentTarget){
            _this.closeParticular(callback);
          }
        });
      });
      setTimeout(() => {  //先加载页面再加载数据
        _this.showParticular(id);
      },100);
    },
    // close text_audit
    closeParticular(callback) {
      var _this = this;
      var text_audit_html = document.getElementById('text_audit');
      document.querySelector('#menuVideoAudit').removeChild(text_audit_html);
      _this.audit_select = '', _this.audit_type = '', review_text_index = 0;
      callback();
    },
    // show text_audit
    showParticular(id) {
      var _this = this;
      var text_auditData = _this.getList(id);
      var audit_text_auditData = text_auditData.step || [];
      var id = text_auditData.id;
      for(var i = 0; i < audit_text_auditData.length; i++){
        // 人工审核不是待审核
        if(text_auditData && text_auditData.metadata){
          if(text_auditData.metadata.status == 'passed' || text_auditData.metadata.status == 'deprecated'){
            $('#text_audit_audit_result_btn').css({'display': 'none'});
          } else {
            if(audit_text_auditData[i].no == '2' && audit_text_auditData[i].status == 'prepare_audit'){
              $('#text_audit_audit_result_btn').css({'display': 'block'});
            }
          }
        }
      }
      for(var i = 0; i < audit_text_auditData.length; i++){
        if(audit_text_auditData[i].no == '1'){
          if(audit_text_auditData && audit_text_auditData[i].detail && audit_text_auditData[i].detail[id]){
            var data = audit_text_auditData[i].detail[id].metadata_text;
          } else {
            var data = [];
          }
        }
      }
      _this.show_mCustomScrollbar();// 绑定滚动条
      _this.bindEventsDialog(text_auditData, id);// 绑定查看原文本、通过、违规弹框
      if(text_auditData && text_auditData.metadata){
        var description = text_auditData.metadata.description
      } else {
        var description = '';
      }
      _this.showParticularTitle(description);// 预加载title
      _this.showAuditStatus(text_auditData);  //审核状态
      _this.showResultDetail(data);  //识别结果明细列表
      _this.showSelectContent(data, '');//详情类型
      _this.bindEventsSelect(data);// 绑定下拉框
      _this.bindEventsType(data, '');// 绑定切换详情按钮
    },
    // 加载详情title
    showParticularTitle(str) {
      var title_index = str.lastIndexOf('.');
      var title = str.slice(0, title_index) + i18n("PARTICULAR");
      $('#audit_text_audit_title').html(title).attr("title",title);
    },
    // 加载审核状态
    showAuditStatus(data) {
      $('#text_audit #audit_result_text').html('');
      $('#text_audit #audit_message_description').html('');
      var status;
      if(data && data.metadata){
        if(data.metadata.status == 'passed'){
          $('#audit_result_text').html(i18n("PARTICULAR_STATUS_PASS")).removeClass('block').removeClass('review').addClass('pass');
        } else if(data.metadata.status == 'deprecated'){
          $('#audit_result_text').html(i18n("PARTICULAR_STATUS_BLOCK")).removeClass('pass').removeClass('review').addClass('block');
        } else {
          if(data && data.step){
            for(var i = 0; i < data.step.length; i++){
              if(data.step[i].no == '2'){
                status = data.step[i].status;
              }
            }
          }
          if(status == 'passed'){
            $('#audit_result_text').html(i18n("PARTICULAR_STATUS_PASS")).removeClass('block').removeClass('review').addClass('pass');
          } else if(status == 'deprecated') {
            $('#audit_result_text').html(i18n("PARTICULAR_STATUS_BLOCK")).removeClass('pass').removeClass('review').addClass('block');
          } else if(status == 'prepare_audit'){
            $('#audit_result_text').html(i18n("PARTICULAR_STATUS_REVIEW")).removeClass('pass').removeClass('block').addClass('review');
          }
        }
      }
      if(data && data.step){
        for(var i = 0; i < data.step.length; i++){
          if(data.step[i].no == '2'){
            audit_reason = data.step[i].reason;
            $('#text_audit #audit_message_description').html(audit_reason);
          }
        }
      }
    },
    // 加载识别结果明细列表
    showResultDetail(text_auditData) {
      $("#detail_table").html('');
      var _this = this;
      var resultData, resultListData, rows;
      if(text_auditData && text_auditData.data){
        resultData = text_auditData.data;
        rows = Math.ceil(resultData.length / 2);
      } else {
        resultData = [];
        rows = 0;
      }
      // 将返回数组更改为适合控件的数组
      resultListData = _this.resultDetailData(resultData)
      var title = [
        {label: ''},
        {label: i18n("PARTICULAR_RESULT_DETAIL_LABEL")},
        {label: i18n("PARTICULAR_RESULT_DETAIL_RELIABILITY")},
        {label: i18n("PARTICULAR_RESULT_DETAIL_SUGGESTION")},
        {label: ''},
        {label: i18n("PARTICULAR_RESULT_DETAIL_LABEL")},
        {label: i18n("PARTICULAR_RESULT_DETAIL_RELIABILITY")},
        {label: i18n("PARTICULAR_RESULT_DETAIL_SUGGESTION")}
      ];
      var style = {
        titleColor: "#FFFFFF",
        cellBg: "white",
        evenBg: "#F5FDFF",
        cellColor: "#797979",
        columnsWidth: [0.14, 0.14, 0.14, 0.08, 0.14, 0.14, 0.14, 0.08]
      }
      var result_table = new StyleableList({
        container: $('#detail_table'),
        rows: Math.max(3, rows),
        columns: 8,
        titles: title,
        styles: style,
        listType: 0,
        async: true,
        data: resultListData
      });
      result_table.create();
    },
    // 识别结果明细返回值
    resultDetailData(data) {
      var _this = this;
      var dataList = [];
      // 文本审核
      for(var i = 0; i < Math.ceil(data.length / 2); i++){
        var row = [];
        var j = i * 2;
        if(data && data[j].results && data[j].results[0].label){
          var audit_label = _this.detailLabel(data[j].results[0].label);
          var audit_rate = data[j].results[0].rate;
          var audit_suggestion = _this.detailSuggestion(data[j].results[0].suggestion); 
        } else {
          var audit_label = '';
          var audit_rate = '';
          var audit_suggestion = '';
        }
        row.push({ label: i18n("PARTICULAR_AUDIT_TEXT_TITLE") + (j + 1) });
        row.push({ label: audit_label });
        row.push({ label: audit_rate });
        row.push({ label: audit_suggestion });
        if(j + 1 < data.length){
          if(data && data[j + 1].results && data[j + 1].results[0].label){
            var audit_label = _this.detailLabel(data[j + 1].results[0].label);
            var audit_rate = data[j + 1].results[0].rate;
            var audit_suggestion = _this.detailSuggestion(data[j + 1].results[0].suggestion); 
          } else {
            var audit_label = '';
            var audit_rate = '';
            var audit_suggestion = '';
          }
          row.push({ label: i18n("PARTICULAR_AUDIT_TEXT_TITLE") + (j + 2) });
          row.push({ label: audit_label });
          row.push({ label: audit_rate });
          row.push({ label: audit_suggestion });
        }
        dataList.push(row);
      }
      return dataList;
    },
    // 匹配label等
    detailLabel(label) {
      var audit_label;
      switch (label) {
        case 'normal':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_NORMAL")
          break;
        case 'spam':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_SPAM")
          break;
        case 'ad':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_AD")
          break;
        case 'politics':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_POLITICS")
          break;
        case 'terrorism':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_TERRORISM")
          break;
        case 'abuse':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_ABUSE")
          break;
        case 'porn':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_PORN")
          break;
        case 'flood':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_FLOOD")
          break;
        case 'contraband':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_CONTRABAND")
          break;
        case 'customized':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_CUSTOMIZED")
          break;
        case 'meaningless':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_MEANINGLESS")
          break;
        case 'customized':
          audit_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_CUSTOMIZED")
          break;
        default:
          break;
      };
      return audit_label;
    },
    // 匹配suggestion
    detailSuggestion(data) {
      var suggestion;
      if(data == 'pass'){
        suggestion = `<div class="detail_pass"></div>`
      } else if(data == 'block'){
        suggestion = `<div class="detail_block"></div>`
      } else if(data == 'review'){
        suggestion = `<div class="detail_review"></div>`
      }
      return suggestion;
    },
    // 加载识别详情下拉框
    bindEventsSelect(text_auditData) {
      $("#recognition_select").html('');
      var _this = this;
      var selectData = [];
      var data;
      if(text_auditData && text_auditData.data){
        data = text_auditData.data;
      } else {
        data = [];
      }
      for(var i = 0; i < data.length; i++){
        var select_obj = {
          name: i18n("PARTICULAR_AUDIT_TEXT_TITLE") + (i + 1),
          value: i,
        }
        selectData.push(select_obj);
      }
      var style = {
        width: 160,
        height: 30,
        headerBorderColor: "#d9d9d9",
        fontSize: 12,
        headerColor: '#999',
        headerBorderRadius: 20,
        background: '#fbfbfb',
        openIconUrl: "./uiWidget/images/select_open1.png",
        closeIconUrl: "./uiWidget/images/select_close1.png",
      };
      var select = new NewSelect('#recognition_select', selectData, style, function(value) {
        _this.showSelectContent(text_auditData, selectData[value].value);
      })
    },
    // 根据条件选择显示详情的类别
    showSelectContent(text_auditData, select) {
      $('#text_audit #text_audit_list').mCustomScrollbar('scrollTo', 0);
      $('#text_audit #text_audit_json').mCustomScrollbar('scrollTo', 0);
      var _this = this;
      _this.audit_select = select? select: 0;
      var type = _this.audit_type;
      var data;
      if(text_auditData && text_auditData.data){
        data = text_auditData.data;
      } else {
        data = [];
      }
      if(type == '' || type == undefined){
        type = 'list';
      }
      if(type == 'list'){
        _this.showList(data, _this.audit_select);
      } else if(type == 'json') {
        _this.showJSON(data, _this.audit_select);
      }
    },
    //  切换详情样式
    bindEventsType(text_auditData, select) {
      var _this = this;
      var data;
      if(text_auditData && text_auditData.data){
        data = text_auditData.data;
      } else {
        data = [];
      }
      if(select == '') {  
        _this.audit_select = 0;
      };
      // 识别详情切换text、JSON
      $('#text_audit_content_btn .list').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          _this.showList(data, _this.audit_select);      // 列表式
        }
      });
      $('#text_audit_content_btn .json').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          _this.showJSON(data, _this.audit_select);      // JSON式
        }
      });
    },
     // 加载列表式识别详情
    showList(text_auditData, select) {
      var _this = this;
      _this.audit_type = 'list', _this.review_text_index = 0;
      var data = text_auditData[select];
      $('#text_audit .container .text_audit_content .btn .json').removeClass('json_checked');
      $('#text_audit .container .text_audit_content .btn .list').addClass('list_checked');
      document.getElementById('text_audit_json').style.display = 'none';
      document.getElementById('text_audit_list').style.display = 'block';
      _this.showHint(data);
    },
    showListContent(data , total, index, btn) {
      var _this = this;
      var curIndex = index - 1, review_text_replace = '', data_content_prev = '', data_content_next = '';
      if(data && data.content){
        var data_content = _this.showJSONString(data.content.split(','));
      } else {
        var data_content = '';
      }
      if(data && data.results && data.results[0].details && data.results[0].details[0].contexts && data.results[0].details[0].contexts[curIndex].context){
        var review_text = _this.showReviewJSONString(data.results[0].details[0].contexts[curIndex].context.split(','));
        review_text_replace = '<span id="review_text_replace" style="background-color: #fe931f;color: #fefefe;">' + review_text + '</span>';
        if(btn == 'prev'){
          var text_index = data_content.slice(0, _this.review_text_index).lastIndexOf(review_text);
          _this.review_text_index = text_index == -1? _this.review_text_index: text_index + review_text.length;
        } else {
          var text_index = data_content.slice(_this.review_text_index).indexOf(review_text)
          _this.review_text_index = text_index == -1? _this.review_text_index: _this.review_text_index + text_index + review_text.length;
        }
        data_content_prev = data_content.slice(0, _this.review_text_index - review_text.length);
        data_content_next = data_content.slice(_this.review_text_index);
      } else if(data) {
        data_content_prev = data_content;
      }
      var data_content_text = data_content_prev + review_text_replace + data_content_next;
      $('#text_audit #text_audit_list .mCSB_container').html(data_content_text);
      if(document.querySelector('#text_audit_list .mCSB_container span')){
        // 根据高亮位置，调节滚动条
        var review_text_top = document.querySelector('#text_audit_list .mCSB_container span').offsetTop;
        var scroll_top = review_text_top - 200;
        scroll_top = scroll_top <= 0? 0: scroll_top;
        setTimeout("$('#text_audit #text_audit_list').mCustomScrollbar('scrollTo', " + scroll_top + ")",100);   //延时调用时为了给滚动条留出加载时间
        // $('#text_audit #text_audit_list').mCustomScrollbar('scrollTo',scroll_top)
      }
    },
    // 加载疑似提示
    showHint(data) {
      var _this = this;
      $('#text_audit #find_content').css({'display': 'flex'});
      $('#text_audit #find_btns').css({'display': 'flex'});
      if(data && data.results && data.results[0].details && data.results[0].details[0].contexts){
        var total = data.results[0].details[0].contexts.length;
        var index = 1;
        $('#text_audit #find_btns #find_prev').removeClass('find_disabled');
        $('#text_audit #find_btns #find_next').removeClass('find_disabled');
        _this.bindEventsFind(data , total, index);
      } else {
        var total = 0;
        var index = 0;
        $('#text_audit #find_btns #find_prev').addClass('find_disabled');
        $('#text_audit #find_btns #find_next').addClass('find_disabled');
      }
      _this.showListContent(data , total, index);
      $('#text_audit #find_content .total_msg').html(total);
      $('#text_audit #find_content .current_msg').html(index);
    },
    // 绑定查找疑似的事件
    bindEventsFind(data , total, index) {
      var _this = this;
      var curIndex = index;
      if(curIndex == 1){
        if(total  == 1){
          $('#text_audit #find_btns #find_next').addClass('find_disabled');
        }
        $('#text_audit #find_btns #find_prev').addClass('find_disabled');
      }
      $('#text_audit #find_btns #find_prev').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          if(curIndex > 1){
            curIndex -= 1;
            _this.showListContent(data , total, curIndex, 'prev');
          }
          if(curIndex == 1){
            $('#text_audit #find_btns #find_prev').addClass('find_disabled');
          } else {
            $('#text_audit #find_btns #find_prev').removeClass('find_disabled');
            $('#text_audit #find_btns #find_next').removeClass('find_disabled');
          }
          $('#text_audit #find_content .current_msg').html(curIndex);
        }
      });
      $('#text_audit #find_btns #find_next').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          if(curIndex < total){
            curIndex += 1;
            _this.showListContent(data , total, curIndex, 'next');
          }
          if(curIndex == total){
            $('#text_audit #find_btns #find_next').addClass('find_disabled');
          } else {
            $('#text_audit #find_btns #find_prev').removeClass('find_disabled');
            $('#text_audit #find_btns #find_next').removeClass('find_disabled');
          }
          $('#text_audit #find_content .current_msg').html(curIndex);
        }
      });
    },
    // 加载JSON式识别详情
    showJSON(text_auditData, select) {
      var _this = this;
      _this.audit_type = 'json';
      $('#text_audit #find_content').css({'display': 'none'});// 隐藏疑似提示
      $('#text_audit #find_btns').css({'display': 'none'});
      $('#text_audit .container .text_audit_content .btn .list').removeClass('list_checked');
      $('#text_audit .container .text_audit_content .btn .json').addClass('json_checked');
      document.getElementById('text_audit_list').style.display = 'none';
      document.getElementById('text_audit_json').style.display = 'block';
      _this.showJsonContent(text_auditData, select);
    },
    // 显示JSON数据，并格式化
    showJsonContent(data, select) {
      var _this = this;
      $('#text_audit #text_audit_json .mCSB_container').html('<pre class="content_json_pre" id="text_audit_json_pre"></pre>')
      var json_data = data[select] || {};  //拿到JSON字符串
      function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function(match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }
        );
      }
      $('#text_audit_json_pre').html(syntaxHighlight(json_data));
    },
    // 查看原文本、通过、违规弹框
    bindEventsDialog(text_auditData, id) {
      var _this = this;
      // 查看原文本按钮
      $('#text_audit .container .audit_result .info_message .check_text.icon').unbind().bind('click', ({currentTarget, target}) => {
        if(target == currentTarget){
          var content_url = '';
          if(text_auditData && text_auditData.metadata && text_auditData.metadata.source){
            content_url = text_auditData.metadata.source;
          }
          var cb = function() {
            $('body').css({'overflow': 'hidden'});   //遮罩后内容不可滚动
            $('#audit_text_alert_dialog .title .audit_text_dialog_clear').unbind().bind('click', ({currentTarget, target}) => {
              if(target == currentTarget){
                $('body').css({'overflow': 'auto'});   //取消遮罩后内容可以滚动
              }
            });
            $('#audit_text_alert_dialog .title .label').html(i18n("PARTICULAR_DIALOG_AUDIT_TEXT"));
            $.get(content_url, null, (resp) => {
            // $.get('http://mediascreening-beijing.oss-cn-beijing.aliyuncs.com/INPUT%2FDIR4%2Fdemo13.txt', null, (resp) => {
              $('#audit_text_alert_dialog .body .content').html(resp);
              $("#audit_text_alert_dialog .body .content").mCustomScrollbar({
                  axis: "y"
              });
            });
          };
          var alert_dialog_text = new PopupDialog({
            url: 'content/menuVideoAudit/alert_text_dialog.html',
            context: this,
            width: 1160,
            height: 680,
            callback: cb,
          });
          alert_dialog_text.create();
        }
      });
      // 通过按钮
      $('#text_audit .container .audit_result .btn .pass.icon').unbind().bind('click', ({currentTarget, target}) => {
        if(target == currentTarget){
          var cb = function() {
            $('#audit_alert_dialog .title .label').html(i18n("PARTICULAR_DIALOG_AUDIT_PASS"));
            $('#audit_alert_dialog #audit_alert_dialog_result').html(i18n("PARTICULAR_DIALOG_PASS")).removeClass('result_block').addClass('result_pass');
            $('#audit_alert_dialog .foot .btn.set').unbind().bind('click', ({currentTarget, target}) => {
              if(target == currentTarget){
                _this.setAudit(id, 'passed');
                alert_dialog_pass.close();
              }
            });
          };
          var alert_dialog_pass = new PopupDialog({
            url: 'content/menuVideoAudit/alert_dialog.html',
            context: this,
            width: 600,
            height: 300,
            callback: cb,
          });
          alert_dialog_pass.create();
        }
      });
      // 违规按钮
      $('#text_audit .container .audit_result .btn .block.icon').unbind().bind('click', ({currentTarget, target}) => {
        if(target == currentTarget){
          var cb = function() {
            $('#audit_alert_dialog .title .label').html(i18n("PARTICULAR_DIALOG_AUDIT_BLOCK"));
            $('#audit_alert_dialog #audit_alert_dialog_result').html(i18n("PARTICULAR_DIALOG_BLOCK")).removeClass('result_pass').addClass('result_block');
            $('#audit_alert_dialog .foot .btn.set').unbind().bind('click', ({currentTarget, target}) => {
              if(target == currentTarget){
                _this.setAudit(id, 'deprecated');
                alert_dialog_block.close();
              };
            });
          };
          var alert_dialog_block = new PopupDialog({
            url: 'content/menuVideoAudit/alert_dialog.html',
            context: this,
            width: 600,
            height: 300,
            callback: cb,
          });
          alert_dialog_block.create();
        }
      });
    },
    // 初始化滚动条
    show_mCustomScrollbar() {
        $("#text_audit #result_detail_content").mCustomScrollbar({
            axis: "y"
        });
        $("#text_audit #text_audit_list").mCustomScrollbar({
            axis: "y"
        });
        $("#text_audit #text_audit_json").mCustomScrollbar({
            axis: "y"
        });
    },
    // 将字符串格式化
    showJSONString(str) {
      var str_text = '';
      for(var i = 0; i < str.length; i++){
        str_text += str[i].replace('[', '').replace(']', '').replace('\\r', ' ').replace('\\n', '<br/>').replace('"', '').replace('"', '');
      }
      return str_text;
    },
    // 将敏感字符串格式化
    showReviewJSONString(str) {
      var str_text = '';
      for(var i = 0; i < str.length; i++){
        str_text += str[i].replace('[', '').replace(']', '').replace('\\r', ' ').replace('\\n', '<br/>').replace('"', '').replace('"', '').replace('\\', '').replace('r', '');
      }
      return str_text;
    },

    // 请求数据
    getList(id) {
      var getListData = [];
      let type = "mediascreening";
      let url = paasHost + '/aquapaas/rest/auditflow/instance/' + type + '/' + id;
      let method = 'Get';
      let opts = [];
      opts.push('user_type=' + '1');
      opts.push('app_key=' + 'aquaBO');
      opts.push('timestamp=' + new Date().toISOString());
      // 传入的user_id需要和创建审核记录的user_id一致，暂时不传递user_id保持接口畅通
      // opts.push('user_id=' + my.paas.user_id);
      opts.push('access_token=' + my.paas.access_token);
      url += "?" + opts.join('&');
      $.ajax({
        url: url,
        method: method,
        async: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      })
      .done((resp, status, xhr) => {
        if(status == 'success'){
          getListData = resp;
        }
      })
      .fail()
      .always();
      return getListData;
    },
    // 通过审核或设为违规
    setAudit(id, audit_status) {
      var audit_value = $('#audit_alert_dialog_textarea').val();
      if(audit_status == 'passed'){
        var audit_put_data = {
          'no': '2',
          'status': 'passed',
          'reason': audit_value
        };
      } else if(audit_status == 'deprecated'){
        var audit_put_data = {
          'no': '2',
          'status': 'deprecated',
          'reason': audit_value
        };
      }
      let type = "mediascreening";
      let url = paasHost + '/aquapaas/rest/auditflow/instance/' + type + '/' + id;
      let method = 'PUT';
      let opts = [], audit_data = JSON.stringify(audit_put_data);
      opts.push('user_type=' + '1');
      opts.push('app_key=' + 'aquaBO');
      opts.push('timestamp=' + new Date().toISOString());
      opts.push('user_id=' + my.paas.user_id);
      opts.push('access_token=' + my.paas.access_token);
      url += "?" + opts.join('&');
      $.ajax({
        url: url,
        method: method,
        async: false,
        data: audit_data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      })
      .done((resp, status, xhr) => {
        if(status == 'success'){
          if(audit_put_data.status == 'passed'){
            $('#audit_result_text').html(i18n("PARTICULAR_STATUS_PASS")).removeClass('block').removeClass('review').addClass('pass');
          } else if(audit_put_data.status == 'deprecated'){
            $('#audit_result_text').html(i18n("PARTICULAR_STATUS_BLOCK")).removeClass('pass').removeClass('review').addClass('block');
          }
          var value = $('#audit_alert_dialog_textarea').val();
          $('#audit_message_description').html(value);
          $('#text_audit_audit_result_btn').css({'display': 'none'});
        } else {
          console.log('获取数据出错！')
        }
      })
      .fail()
      .always();
    },
  };

	return TextAudit;
});
