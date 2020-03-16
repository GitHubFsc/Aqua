define(['jquery', 'StyleableList', 'StyledSelector', 'PopupDialog', 'Alert', 'DatePicker', 'VideoPlayer', 'NewSelect','mCustomScrollbar'], function($, StyleableList, StyledSelector, PopupDialog, Alert, DatePicker, VideoPlayer, NewSelect, mCustomScrollbar){
  var PosterAudit = function(){};
  var audit_select = '', audit_type = '';
	PosterAudit.prototype = {
    // 绑定详情页的事件
    bindEventsParticular(id, callback) {
      var _this = this;
      $.ajax({   //显示页面
        type: 'GET',
        url: 'content/menuVideoAudit/poster_audit/poster_audit.html'
      }).done(function(data) {
        // 显示或收起详情页
        $("#menuVideoAudit").append(patchHTML(data));
        $('#poster_audit .title_head .right .btn').unbind().bind('click', ({currentTarget, target }) => {
          if(target == currentTarget){
            _this.closeParticular(callback);
          }
        });
        _this.showResultDetail([]);  //识别结果明细列表
      });
      setTimeout(() => {  //先加载页面再加载数据
        _this.showParticular(id);
      },500);
    },
    // close poster_audit
    closeParticular(callback) {
      var _this = this;
      var poster_audit_html = document.getElementById('poster_audit');
      document.querySelector('#menuVideoAudit').removeChild(poster_audit_html);
      _this.audit_select = '', _this.audit_type = '';
      callback();
    },
    // show poster_audit
    showParticular(id) {
      var _this = this;
      var poster_auditData = _this.getList(id);
      var audit_poster_auditData = poster_auditData.step || [];
      for(var i = 0; i < audit_poster_auditData.length; i++){
        if(poster_auditData && poster_auditData.metadata){
          if(poster_auditData.metadata.status == 'passed' || poster_auditData.metadata.status == 'deprecated'){// 最终审核状态
            $('#poster_audit_audit_result_btn').css({'display': 'none'});
          } else {
            if(audit_poster_auditData[i].no == '2' && audit_poster_auditData[i].status == 'prepare_audit'){
              $('#poster_audit_audit_result_btn').css({'display': 'block'});
            }
          }
        }
      }  
      _this.show_mCustomScrollbar();// 绑定滚动条
      _this.bindEventsDialog(poster_auditData, id);// 绑定通过、违规弹框
      if(poster_auditData && poster_auditData.metadata && poster_auditData.metadata.description){
        var description = poster_auditData.metadata.description
      } else {
        var description = '';
      }
      _this.showParticularTitle(description);// 预加载title
      _this.showVideoPlay(poster_auditData.metadata);  //视频
      _this.showAuditStatus(poster_auditData);  //审核状态
      _this.showResultDetail(poster_auditData.step);  //识别结果明细列表
      _this.showSelectContent(poster_auditData, '');//详情类型
      _this.bindEventsSelect(poster_auditData);// 绑定下拉框
      _this.bindEventsType(poster_auditData, '');// 绑定切换详情按钮
    },
    // 加载详情title
    showParticularTitle(str) {
      var title_index = str.lastIndexOf('.');
      var title = str.slice(0, title_index) + i18n("PARTICULAR");
      $('#audit_poster_audit_title').html(title).attr("title",title);
    },
    // 加载视频
    showVideoPlay(videoData) {
      $("#video_player").html('');
      var src = videoData.source;
      var styles = {
        left: 20,
        top: 0,
        width: 210,
        height: 184
      };
      var video_play = new VideoPlayer({
        container: '#video_player',
        src: src,
        styles: styles,
      });
    },
    // 加载审核状态
    showAuditStatus(data) {
      $('#poster_audit #audit_result_text').html('');
      $('#poster_audit #audit_message_description').html('');
      var status;
      if(data && data.metadata){
        if(data.metadata.status == 'passed'){
          $('#audit_result_text').html(i18n("PARTICULAR_STATUS_PASS")).removeClass('block').removeClass('review').addClass('pass');
        } else if(data.metadata.status == 'deprecated'){
          $('#audit_result_text').html(i18n("PARTICULAR_STATUS_BLOCK")).removeClass('pass').removeClass('review').addClass('block');
        } else {
          for(var i = 0; i < data.step.length; i++){
            if(data.step[i].no == '2'){
              status = data.step[i].status;
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
            $('#poster_audit #audit_message_description').html(audit_reason);
          }
        }
      }
    },
    // 加载识别结果明细列表
    showResultDetail(data) {
      $("#result_detail_content").mCustomScrollbar({
        axis: "y"
      });
      $("#detail_table").html('');
      var _this = this;
      var resultData,resultListData;
      for(var i = 0; i < data.length; i++){
        if(data[i].no == '1'){
          resultData = data[i].reason;
        }
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
        rows: 4,
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
      // 语音识别及智能鉴黄
      var row1 = [{ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_AUDIO") }];
      if(data && data.metadata_audit && data.metadata_audit.audioScanResults){
        var audio_label = _this.detailDataData(data.metadata_audit.audioScanResults.label, 'audio');
        var audio_rate = data.metadata_audit.audioScanResults.rate;
        var audio_suggestion = _this.detailSuggestion(data.metadata_audit.audioScanResults.suggestion); 
      } else {
        var audio_label = '';
        var audio_rate = '';
        var audio_suggestion = '';
      }
      row1.push({ label: audio_label });
      row1.push({ label: audio_rate });
      row1.push({ label: audio_suggestion });
      row1.push({ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_PRON") });
      if(data && data.metadata_audit && data.metadata_audit.results){
        var porn_data = _this.detailDataData(data.metadata_audit.results, 'porn');
        var terrorism_data = _this.detailDataData(data.metadata_audit.results, 'terrorism');
        var live_data = _this.detailDataData(data.metadata_audit.results, 'live');
        var logo_data = _this.detailDataData(data.metadata_audit.results, 'logo');
        var ad_data = _this.detailDataData(data.metadata_audit.results, 'ad');
      } else {
        var porn_data = [];
        var terrorism_data = [];
        var live_data = [];
        var logo_data = [];
        var ad_data = [];
      }
      row1.push({ label: porn_data[0] });
      row1.push({ label: porn_data[1] });
      var porn_suggestion = _this.detailSuggestion(porn_data[2]);
      row1.push({ label: porn_suggestion });
      // 暴恐涉政及不良场景
      var row2 = [{ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_TERRORISM") }];
      row2.push({ label: terrorism_data[0] });
      row2.push({ label: terrorism_data[1] });
      var terrorism_suggestion = _this.detailSuggestion(terrorism_data[2]);
      row2.push({ label: terrorism_suggestion });
      row2.push({ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_LIVE") });
      row2.push({ label: live_data[0] });
      row2.push({ label: live_data[1] });
      var live_suggestion = _this.detailSuggestion(live_data[2]);
      row2.push({ label: live_suggestion });
      // logo识别及广告识别
      var row3 = [{ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_LOGO") }];
      row3.push({ label: logo_data[0] });
      row3.push({ label: logo_data[1] });
      var logo_suggestion = _this.detailSuggestion(logo_data[2]);
      row3.push({ label: logo_suggestion });
      row3.push({ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_AD") });
      row3.push({ label: ad_data[0] });
      row3.push({ label: ad_data[1] });
      var ad_suggestion = _this.detailSuggestion(ad_data[2]);
      row3.push({ label: ad_suggestion });
      // 视频敏感人脸及视频标签识别
      var row4 = [{ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_FACE") }];
      if(data && data.metadata_sface && data.metadata_sface.results){
        var sface_label = _this.detailDataData(data.metadata_sface.results[0].label, 'sface');
        var sface_rate = data.metadata_sface.results[0].rate;
        var sface_suggestion = _this.detailSuggestion(data.metadata_sface.results[0].suggestion);
      } else {
        var sface_label = '';
        var sface_rate = '';
        var sface_suggestion = '';
      }
      row4.push({ label: sface_label });
      row4.push({ label: sface_rate });
      row4.push({ label: sface_suggestion });
      row4.push({ label: i18n("PARTICULAR_RESULT_DETAIL_LABEL_TAG") });
      if(data && data.metadata_tag && data.metadata_tag.results){
        var tag_label = _this.detailDataData(data.metadata_tag.results[0].label, 'tag');
        var tag_rate = data.metadata_tag.results[0].rate;
        var tag_suggestion = _this.detailSuggestion(data.metadata_tag.results[0].suggestion);
      } else {
        var tag_label = '';
        var tag_rate = '';
        var tag_suggestion = '';
      }
      row4.push({ label: tag_label });
      row4.push({ label: tag_rate });
      row4.push({ label: tag_suggestion });
      dataList.push(row1);
      dataList.push(row2);
      dataList.push(row3);
      dataList.push(row4);
      return dataList;
    },
    // 匹配识别明细列表的label
    detailDataData(data, select) {
      var data_list, audit_label, video_data = [], label_type, video_label, video_rate, video_suggestion, sface_label, tag_label;
      if(select == 'audio'){
        switch (data) {
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
          default:
            break;
        };
        data_list = audit_label;
      } else if(select == 'porn' || select == 'terrorism' || select == 'live' || select == 'logo' || select == 'ad'){
        for(var i = 0 ;i < data.length; i++){
          if(data[i].scene == select){
            label_type = data[i].label;
            video_rate = data[i].rate;
            video_suggestion = data[i].suggestion;
          }
        }
        switch (label_type) {
          case 'normal':
            video_label = i18n("PARTICULAR_TYPE_TAG_NORMAL")
            break;
          case 'porn':
            video_label = i18n("PARTICULAR_TYPE_TAG_PORN")
            break;
          case 'terrorism':
            video_label = i18n("PARTICULAR_TYPE_TAG_TERRORISM")
            break;
          case 'live':
            video_label = i18n("PARTICULAR_TYPE_TAG_LIVE")
            break;
          case 'logo':
            video_label = i18n("PARTICULAR_TYPE_TAG_LOGO")
            break;
          case 'ad':
            video_label = i18n("PARTICULAR_TYPE_TAG_AD")
            break;
          default:
            break;
        };
        video_data.push(video_label);
        video_data.push(video_rate);
        video_data.push(video_suggestion);
        data_list = video_data;
      } else if(select == 'sface'){
        switch (data) {
          case 'normal':
            sface_label = i18n("PARTICULAR_TYPE_SFACE_LABEL_NORMAL")
            break;
          case 'sface':
            sface_label = i18n("PARTICULAR_TYPE_SFACE_LABEL_SFACE")
            break;
          default:
            break;
        };
        data_list = sface_label;
      } else if(select == 'tag'){
        switch (data) {
          case 'normal':
            tag_label = i18n("PARTICULAR_TYPE_TAG_LABEL_NORMA")
            break;
          case 'tag':
            tag_label = i18n("PARTICULAR_TYPE_TAG_LABEL_TAG")
            break;
          default:
            break;
        };
        data_list = tag_label;
      }
      return data_list;
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
    bindEventsSelect(poster_auditData) {
      $("#recognition_select").html('');
      var _this = this;
      var selectData = [{
        name: i18n("PARTICULAR_TYPE_LOGO"),
        value: 0,
      }, {
        name: i18n("PARTICULAR_TYPE_AUDIO"),
        value: 1,
      }, {
        name: i18n("PARTICULAR_TYPE_PRON"),
        value: 2,
      }, {
        name: i18n("PARTICULAR_TYPE_TERRORISM"),
        value: 3,
      }, {
        name: i18n("PARTICULAR_TYPE_LIVE"),
        value: 4,
      }, {
        name: i18n("PARTICULAR_TYPE_FACE"),
        value: 5,
      }, {
        name: i18n("PARTICULAR_TYPE_TAG"),
        value: 6,
      }, {
        name: i18n("PARTICULAR_TYPE_AD"),
        value: 7,
      }];
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
        switch (selectData[value].value) {
          // logo识别详情
          case 0:
            _this.audit_select = 'logo';
            _this.showSelectContent(poster_auditData, 'logo');
            break;
          // 语音检测
          case 1:
            _this.audit_select = 'audio';
            _this.showSelectContent(poster_auditData, 'audio');
            break;
          // 智能鉴黄
          case 2:
            _this.audit_select = 'porn';
            _this.showSelectContent(poster_auditData, 'porn');
            break;
          // 暴恐涉政
          case 3:
            _this.audit_select = 'terrorism';
            _this.showSelectContent(poster_auditData, 'terrorism');
            break;
          // 不良场景
          case 4:
            _this.audit_select = 'live';
            _this.showSelectContent(poster_auditData, 'live');
            break;
          // 视频敏感人脸
          case 5:
            _this.audit_select = 'sface';
            _this.showSelectContent(poster_auditData, 'sface');
            break;
          // 视频标签识别
          case 6:
            _this.audit_select = 'tag';
            _this.showSelectContent(poster_auditData, 'tag');
            break;
          // 广告识别
          case 7:
            _this.audit_select = 'ad';
            _this.showSelectContent(poster_auditData, 'ad');
            break;
          default:
            break;
        };
      })
    },
    // 根据条件选择显示详情的类别
    showSelectContent(poster_auditData, select) {
      var _this = this;
      var type = _this.audit_type;
      var data, dataList = poster_auditData.step;
      var id = poster_auditData.id;
      for(var i = 0; i < dataList.length; i++){
        if(dataList[i].no == '1'){
          if(dataList && dataList[i].detail && dataList[i].detail[id]){
            data = dataList[i].detail[id];
          } else {
            data = [];
          }
        }
      }
      if (select) { 
        _this.audit_select = select;
      } else {
        _this.audit_select = 'logo';
      }
      if(_this.audit_select == 'logo' || _this.audit_select == 'porn' || _this.audit_select == 'terrorism' || _this.audit_select == 'live' || _this.audit_select == 'sface'){
        $('#poster_audit .container .poster_audit_content .btn .list').removeClass('list_margin');
        $('#poster_audit .container .poster_audit_content .btn .list').removeClass('list_checked');
        document.getElementById('poster_audit_content_poster').style.display = 'block';
        if(type == '' || type == undefined){
          type = 'poster';
        }
        if(type == 'poster'){
          _this.showPoster(data, _this.audit_select);
        } else if(type == 'list') {
          _this.showList(data, _this.audit_select);
        } else if(type == 'json') {
          _this.showJSON(data, _this.audit_select);
        }
      } else if(_this.audit_select == 'audio' || _this.audit_select == 'tag' || _this.audit_select == 'ad') {
        $('#poster_audit .container .poster_audit_content .btn .list').addClass('list_margin');
        $('#poster_audit .container .poster_audit_content .btn .list').addClass('list_checked');
        document.getElementById('poster_audit_content_poster').style.display = 'none';
        if(type == '' || type == undefined){
          type = 'list';
        }
        if(type == 'poster' || type == 'list'){
          _this.showList(data, _this.audit_select);
        } else if(type == 'json') {
          _this.showJSON(data, _this.audit_select);
        }
      }
    },
    //  切换详情样式
    bindEventsType(poster_auditData, select) {
      var _this = this;
      var data, dataList = poster_auditData.step;
      var id = poster_auditData.id;
      for(var i = 0; i < dataList.length; i++){
        if(dataList[i].no == '1'){
          if(dataList && dataList[i].detail && dataList[i].detail[id]){
            data = dataList[i].detail[id];
          } else {
            data = [];
          }
        }
      }
      if(select == '') {  
        _this.audit_select = 'logo';
      };
      // 识别详情切换海报、列表、JSON
      $('#poster_audit_content_btn .poster').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          _this.showPoster(data, _this.audit_select);    // 海报式
        }
      });
      $('#poster_audit_content_btn .list').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          _this.showList(data, _this.audit_select);      // 列表式
        }
      });
      $('#poster_audit_content_btn .json').unbind().bind('click', ({currentTarget, target }) => {
        if (target == currentTarget){
          _this.showJSON(data, _this.audit_select);      // JSON式
        }
      });
    },
    // 加载海报式识别详情
    showPoster(data, select) {
      $('#poster_audit #poster_audit_poster_content').mCustomScrollbar('scrollTo', 0);
      $('#poster_audit #poster_audit_poster_content_list').mCustomScrollbar('scrollTo', 0);
      var _this = this;
      _this.audit_type = 'poster';
      $('#poster_audit .container .poster_audit_content .btn .list').removeClass('list_checked');
      $('#poster_audit .container .poster_audit_content .btn .json').removeClass('json_checked');
      $('#poster_audit .container .poster_audit_content .btn .poster').addClass('poster_checked');
      _this.showPosterImg(data, select);  //左侧视频帧图片
      document.getElementById('poster_audit_list').style.display = 'none';
      document.getElementById('poster_audit_json').style.display = 'none';
      document.getElementById('poster_audit_poster').style.display = 'flex';
    },
    // 加载列表式识别详情
    showList(data, select) {
      $('#poster_audit #poster_audit_list').mCustomScrollbar('scrollTo', 0);
      var _this = this;
      _this.audit_type = 'list';
      $('#poster_audit .container .poster_audit_content .btn .poster').removeClass('poster_checked');
      $('#poster_audit .container .poster_audit_content .btn .json').removeClass('json_checked');
      $('#poster_audit .container .poster_audit_content .btn .list').addClass('list_checked');
      _this.showListTable(data, select);
      document.getElementById('poster_audit_poster').style.display = 'none';
      document.getElementById('poster_audit_json').style.display = 'none';
      document.getElementById('poster_audit_list').style.display = 'block';
    },
    // 加载JSON式识别详情
    showJSON(data, select) {
      $('#poster_audit #poster_audit_json').mCustomScrollbar('scrollTo', 0);
      var _this = this;
      _this.audit_type = 'json';
      $('#poster_audit .container .poster_audit_content .btn .poster').removeClass('poster_checked');
      $('#poster_audit .container .poster_audit_content .btn .list').removeClass('list_checked');
      $('#poster_audit .container .poster_audit_content .btn .json').addClass('json_checked');
      _this.showJsonContent(data, select);
      document.getElementById('poster_audit_poster').style.display = 'none';
      document.getElementById('poster_audit_list').style.display = 'none';
      document.getElementById('poster_audit_json').style.display = 'block';
    },
    // 加载海报式识别详情图片
    showPosterImg(poster_auditData, select) {
      $('#poster_audit_poster_content .mCSB_container').html('')
      var _this = this;
      var data, data_list;
      if(select == 'logo' || select == 'porn'|| select == 'terrorism'|| select == 'live'){
        if(poster_auditData.metadata_audit && poster_auditData.metadata_audit.data && poster_auditData.metadata_audit.data[0].results){
          data = poster_auditData.metadata_audit.data[0].results;
        } else {
          data =[];
        }
      } else if(select == 'sface' ){
        if(poster_auditData.metadata_sface && poster_auditData.metadata_sface.data && poster_auditData.metadata_sface.data[0].results){
          data = poster_auditData.metadata_sface.data[0].results;
        } else {
          data =[];
        }
      };
      for(var i = 0; i < data.length; i++){
        if(data[i].label == select){
          if(data[i].suggestion == 'review' || data[i].suggestion == 'block'){
            data_list = data[i].frames;
            for(var j = 0; j < (data_list.length / 2); j++) {
              var poster_img_content;
              var left_content = `
                <div class="col left col_poster_img" id="poster_audit_poster_`+ (j * 2) +`">
                    <div class="background_img" id="poster_audit_poster_img_left_`+ (j * 2) +`"></div>
                    <div class="background_time">
                        <div class="creat_time" id="poster_audit_poster_time_left_`+ (j * 2) +`"></div>
                    </div>
                </div>`
              var right_content = `
                <div class="col right col_poster_img" id="poster_audit_poster_`+ ((j * 2) + 1) +`">
                    <div class="background_img" id="poster_audit_poster_img_right_`+ ((j * 2) + 1) +`"></div>
                    <div class="background_time">
                        <div class="creat_time" id="poster_audit_poster_time_right_`+ ((j * 2) + 1) +`"></div>
                    </div>
                </div>`
                poster_img_content = left_content + right_content;
              // 绘制div
              $('#poster_audit_poster_content .mCSB_container').append(
                `<div class="row">`+ poster_img_content +`</div>`
              );
              // 加载背景图片及视频帧时间
              var left_img_url = data_list[(j * 2)].url;
              var left_offset = _this.timeOffset(data_list[(j * 2)].offset);
              if((j * 2) + 1 < data_list.length){
                var right_img_url = data_list[((j * 2) + 1)].url;
                var right_offset = _this.timeOffset(data_list[((j * 2) + 1)].offset);
              } else {
                var right_img_url = '';
                var right_offset = '';
                $('#poster_audit_poster_' + ((j * 2) + 1)).css({
                  'visibility': 'hidden'
                })
              }
              $('#poster_audit_poster_img_left_' + (j * 2)).css({
                'background-image': 'url("'+ left_img_url +'")'
              });
              $('#poster_audit_poster_time_left_' + (j * 2)).html(left_offset);
              $('#poster_audit_poster_img_right_' + ((j * 2) + 1)).css({
                'background-image': 'url("'+ right_img_url +'")'
              });
              $('#poster_audit_poster_time_right_' + ((j * 2) + 1)).html(right_offset);
            };
          } else {
            data_list = [];
          }
        }
      };
      // 绑定左侧视频帧点击事件
      _this.bindEventsPosterImage(data_list, select);
    },
    // 绑定左侧视频帧点击事件
    bindEventsPosterImage(data, select) {
      var _this = this;
      var poster_audit_poster_content_img_1, list_data, logo_data;
      // 默认第一个小图加border并显示
      if(data){
        list_data = data[0];
        poster_audit_poster_content_img_1 = list_data.url;
        if(select == 'logo'){
          logo_data = list_data.logoData;
        } else if(select == 'sface'){
          logo_data = list_data.sfaceData;
        } else if(select == 'terrorism'){
          logo_data = list_data.sfaceData;
        }
      } else {
        list_data = [];
        poster_audit_poster_content_img_1 = '';
      }
      
      $('#poster_audit_poster_content #poster_audit_poster_0').addClass('col_checked');
      $('#poster_audit_poster #poster_audit_poster_content_img').css({
        'background-image': 'url("'+ poster_audit_poster_content_img_1 +'")',
      });
      _this.showPosterChecked(logo_data, poster_audit_poster_content_img_1);
      _this.showPosterList(list_data, select);
      $('.col_poster_img').each(function (e) {
        $(this).click(function () {
          $('#poster_audit_poster_content .col_poster_img').removeClass('col_checked');
          $('#poster_audit_poster_content #poster_audit_poster_' + e).addClass('col_checked');
          $('#poster_audit_poster #poster_audit_poster_content_img').css({
            'background-image': 'url("'+ data[e].url +'")',
          });
          list_data = data[e];
          if(select == 'logo'){
            logo_data = data[e].logoData;
          } else if(select == 'sface'){
            logo_data = data[e].sfaceData;
          } else if(select == 'terrorism'){
            logo_data = data[e].sfaceData;
          }
          _this.showPosterChecked(logo_data, data[e].url);
          _this.showPosterList(list_data, select);
        });
      });
    },
    // 加载logo选中框
    showPosterChecked(logoData, url) {
      $('#poster_audit_poster_content_img').html('');
      // 计算图片原始宽高
      var img = new Image();
      img.src = url;
      img.onload = function() {
        var img_width = img.width;
        var img_height = img.height;
        var poster_content_img_height = $('#poster_audit_poster_content_img').height();
        var poster_content_img_width = $('#poster_audit_poster_content_img').width();
        var multiple_width = img_height / poster_content_img_height;
        var multiple_height = img_width / poster_content_img_width;
        var multiple = multiple_width < multiple_height? multiple_height: multiple_width;
        // var img_left = (782 - img_width / multiple) / 2;
        var img_left = (poster_content_img_width - img_width / multiple) / 2;  //通过flex布局显示poster图片区域宽度，并计算logo位置
        var img_top = (poster_content_img_height - img_height / multiple) / 2;  //通过flex布局显示poster图片区域高度，并计算logo位置
        if(logoData == undefined || logoData == ''){
            logoData = [];
        }
        for(var i = 0; i < logoData.length; i++){
          var dom = `
            <div class="checked_border" style="width:`+ logoData[i].w / multiple +`px;height:`+ logoData[i].h / multiple +`px;position: absolute;top:`+ ((logoData[i].y / multiple) + img_top) +`px;left:`+ ((logoData[i].x / multiple) + img_left) +`px;border: 2px solid #f91919"></div>
          `
          $('#poster_audit_poster_content_img').append(dom);
        };
      };
    },
    // 加载海报式识别详情列表
    showPosterList(data, select) {
      $('#poster_audit_poster_content_list .mCSB_container').html('');
      var _this = this;
      var title, columnsWidth, columns, rows, list_table_data;
      // logo识别详情
      var logo_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_NAME")},
        {label: i18n("PARTICULAR_LIST_TYPE")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var logo_columnsWidth = [0.1, 0.6, 0.15, 0.15];
      var logo_columns = 4;
      // 智能鉴黄 porn
      var porn_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var porn_columnsWidth = [0.4, 0.6];
      var porn_columns = 2;
      // 暴恐涉政 terrorism
      var terrorism_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var terrorism_columnsWidth = [0.4, 0.6];
      var terrorism_columns = 2;
      // 不良场景 live
      var live_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var live_columnsWidth = [0.4, 0.6];
      var live_columns = 2;
      // 视频敏感人脸 face
      var sface_title = [
        {label: i18n("PARTICULAR_LIST_NAME")},
        {label: i18n("PARTICULAR_LIST_ID")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var sface_columnsWidth = [0.6, 0.2, 0.2];
      var sface_columns = 3;
      if(data){
        switch (select) {
          // logo识别详情
          case 'logo':
            title = logo_title;
            columnsWidth = logo_columnsWidth
            columns = logo_columns;
            list_table_data = _this.posterListTableLogo(data, select);
            rows = list_table_data.length;
            break;
          // 智能鉴黄
          case 'porn':
            title = porn_title;
            columnsWidth = porn_columnsWidth
            columns = porn_columns;
            list_table_data = _this.posterListTablePorn(data, select);
            rows = list_table_data.length;
            break;
          // 暴恐涉政
          case 'terrorism':
            title = terrorism_title;
            columnsWidth = terrorism_columnsWidth
            columns = terrorism_columns;
            list_table_data = _this.posterListTableTerrorism(data, select);
            rows = list_table_data.length;
            break;
          // 不良场景
          case 'live':
            title = live_title;
            columnsWidth = live_columnsWidth
            columns = live_columns;
            list_table_data = _this.posterListTableLive(data, select);
            rows = list_table_data.length;
            break;
          // 视频敏感人脸
          case 'sface':
            title = sface_title;
            columnsWidth = sface_columnsWidth
            columns = sface_columns;
            list_table_data = _this.posterListTableFace(data, select);
            rows = list_table_data.length;
            break;
          default:
            break;
        };
      } else {
        list_table_data = [];
      }
      var style = {
        titleColor: "#FFFFFF",
        cellBg: "white",
        evenBg: "#F5FDFF",
        cellColor: "#797979",
        columnsWidth: columnsWidth,
      };
      // 列表最少行撑满表格
      if(rows < 3){ 
        rows = 3; 
      }
      var list_table = new StyleableList({
        container: $('#poster_audit_poster_content_list .mCSB_container'),
        rows: rows,
        columns: columns,
        titles: title,
        styles: style,
        listType: 0,
        async: true,
        data: list_table_data,
      });
      list_table.create();
    },
    // logo_poser列表
    posterListTableLogo(data, select) {
      var _this = this;
      var data_list = [];
      var logo_label = data.label;
      var logo_rate = data.rate;
      if(data && data.logoData){
        var logo_data = data.logoData;
      } else {
        var logo_data = [];
      }
      for(var j = 0; j < logo_data.length; j++){
        var row = [];
        row.push({ label: logo_label });
        row.push({ label: `<div style="padding-left:10px;text-align:left;">` + logo_data[j].name + `</div>` });
        row.push({ label: logo_data[j].type });
        row.push({ label: logo_rate });
        if(logo_label || logo_data[j].name || logo_data[j].type || logo_rate){
          data_list.push(row)
        }
      }
      return data_list;
    },
    // porn_poser列表
    posterListTablePorn(data, select) {
      var _this = this;
      var data_list = [];
      var porn_label = _this.listLabel(data.label, select);
      var row = [];
      row.push({ label: porn_label});
      row.push({ label: data.rate});
      if(porn_label || data.rate){
        data_list.push(row);
      }
      return data_list;
    },
    // terrorism_poser列表
    posterListTableTerrorism(data, select) {
      var _this = this;
      var data_list = [];
      var terrorism_label = _this.listLabel(data.label, select);
      var row = [];
      row.push({ label: terrorism_label});
      row.push({ label: data.rate});
      if(terrorism_label || data.rate){
        data_list.push(row);
      }
      return data_list;
    },
    // live_poser列表
    posterListTableLive(data, select) {
      var _this = this;
      var data_list = [];
      var live_label = _this.listLabel(data.label, select);
      var row = [];
      row.push({ label: live_label});
      row.push({ label: data.rate});
      if(live_label || data.rate){
        data_list.push(row);
      }
      return data_list;
    },
    // face_poser列表
    posterListTableFace(data, select) {
      var _this = this;
      var data_list = [];
      if(data && data.sfaceData){
        var sface_data = data.sfaceData;
      } else {
        var sface_data = [];
      }
      for(var j = 0; j < sface_data.length; j++){
        var sface_name, sface_id, sface_name, sface_rate;
        if(sface_data[j].faces){
          sface_name = sface_data[j].faces[0].name;
          sface_id = sface_data[j].faces[0].id;
          sface_rate = sface_data[j].faces[0].rate;
        } else {
          sface_name = '';
          sface_id = '';
          sface_rate = '';
        }
        var row = [];
        row.push({ label: `<div style="padding-left:10px;text-align:left;">` + sface_name + `</div>` })
        row.push({ label: sface_id });
        row.push({ label: sface_rate });
        if(sface_name || sface_id || sface_rate){
          data_list.push(row)
        }
      }
      return data_list;
    },
    // 加载列表式识别详情
    showListTable(data, select) {
      $("#content_list_table").html('');
      var _this = this;
      var title, columnsWidth, columns, rows, list_table_data;
      // logo识别详情
      var logo_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_NAME")},
        {label: i18n("PARTICULAR_LIST_TYPE")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_LOCATION")},
      ];
      var logo_columnsWidth = [0.1, 0.5, 0.1, 0.1, 0.1, 0.1];
      var logo_columns = 6;
      // 语音检测 audio
      var audio_title = [
        {label: i18n("PARTICULAR_LIST_START_TIME")},
        {label: i18n("PARTICULAR_LIST_END_TIME")},
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_TEXT")},
      ];
      var audio_columnsWidth = [0.15, 0.15, 0.15, 0.55];
      var audio_columns = 4;
      // 智能鉴黄 porn
      var porn_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var porn_columnsWidth = [0.16, 0.17, 0.17, 0.16, 0.17, 0.17];
      var porn_columns = 6;
      // 暴恐涉政 terrorism
      var terrorism_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var terrorism_columnsWidth = [0.16, 0.17, 0.17, 0.16, 0.17, 0.17];
      var terrorism_columns = 6;
      // 不良场景 live
      var live_title = [
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
      ];
      var live_columnsWidth = [0.16, 0.17, 0.17, 0.16, 0.17, 0.17];
      var live_columns = 6;
      // 视频敏感人脸 face
      var sface_title = [
        {label: i18n("PARTICULAR_LIST_NAME")},
        {label: i18n("PARTICULAR_LIST_ID")},
        {label: i18n("PARTICULAR_LIST_RELIABILITY")},
        {label: i18n("PARTICULAR_LIST_VIDEO_FRAME")},
        {label: i18n("PARTICULAR_LIST_LOCATION")},
      ];
      var sface_columnsWidth = [0.52, 0.12, 0.12, 0.12, 0.12];
      var sface_columns = 5;
      // 视频标签识别 tag
      var tag_title = [];
      var tag_columnsWidth = [0.12, 0.12, 0.12, 0.12, 0.12, 0.2, 0.2];
      var tag_columns = 7;
      // 广告识别 ad
      var ad_title = [
        {label: i18n("PARTICULAR_LIST_START_TIME")},
        {label: i18n("PARTICULAR_LIST_END_TIME")},
        {label: i18n("PARTICULAR_LIST_LABEL")},
        {label: i18n("PARTICULAR_LIST_TEXT")},
      ];
      var ad_columnsWidth = [0.15, 0.15, 0.15, 0.55];
      var ad_columns = 4;

      switch (select) {
        // logo识别详情
        case 'logo':
          title = logo_title;
          columnsWidth = logo_columnsWidth
          columns = logo_columns;
          if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
            list_table_data = _this.listTableLogo(_this.listTableData(data.metadata_audit.data[0].results, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        // 语音检测
        case 'audio':
          title = audio_title;
          columnsWidth = audio_columnsWidth
          columns = audio_columns;
          if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].audioScanResults && data.metadata_audit.data[0].audioScanResults[0].details){
            list_table_data = _this.listTableAudio(_this.listTableData(data.metadata_audit.data[0].audioScanResults[0].details, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        // 智能鉴黄
        case 'porn':
          title = porn_title;
          columnsWidth = porn_columnsWidth
          columns = porn_columns;
          if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
            list_table_data = _this.listTablePorn(_this.listTableData(data.metadata_audit.data[0].results, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        // 暴恐涉政
        case 'terrorism':
          title = terrorism_title;
          columnsWidth = terrorism_columnsWidth
          columns = terrorism_columns;
          if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
            list_table_data = _this.listTableTerrorism(_this.listTableData(data.metadata_audit.data[0].results, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        // 不良场景
        case 'live':
          title = live_title;
          columnsWidth = live_columnsWidth
          columns = live_columns;
          if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
            list_table_data = _this.listTableLive(_this.listTableData(data.metadata_audit.data[0].results, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        // 视频敏感人脸
        case 'sface':
          title = sface_title;
          columnsWidth = sface_columnsWidth
          columns = sface_columns;
          if(data.metadata_sface && data.metadata_sface.data && data.metadata_sface.data[0].results && data.metadata_sface.data[0].results[0].frames){
            list_table_data = _this.listTableFace(_this.listTableData(data.metadata_sface.data[0].results[0].frames, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        // 视频标签识别
        case 'tag':
          if(data.metadata_tag && data.metadata_tag.data && data.metadata_tag.data[0].results && data.metadata_tag.data[0].results[0].tagData && data.metadata_tag.data[0].results[0].tagData.details){
            list_table_data = _this.listTableTag(_this.listTableData(data.metadata_tag.data[0].results[0].tagData.details, select), select);
          } else {
            list_table_data = [];
          }
          title = list_table_data[0];
          columnsWidth = tag_columnsWidth
          columns = tag_columns;
          rows = list_table_data.length - 1;
          list_table_data.shift();
          document.getElementById('content_list_table_tag').style.display = 'block';
          break;
        // 广告识别
        case 'ad':
          title = ad_title;
          columnsWidth = ad_columnsWidth
          columns = ad_columns;
          if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
            list_table_data = _this.listTableAd(_this.listTableData(data.metadata_audit.data[0].results, select), select);
          } else {
            list_table_data = [];
          }
          rows = list_table_data.length;
          break;
        default:
          break;
      };
      var style = {
        titleColor: "#FFFFFF",
        cellBg: "white",
        evenBg: "#F5FDFF",
        cellColor: "#797979",
        columnsWidth: columnsWidth,
      };
      // 列表最少行撑满表格
      if(select == 'tag'){
         document.getElementById('content_list_table_tag').style.display = 'block';
        if(rows < 13){ 
          rows = 13; 
        }
      } else {
        document.getElementById('content_list_table_tag').style.display = 'none'; 
        if(rows < 15){ 
          rows = 15; 
        }
      }
      var list_table = new StyleableList({
        container: $('#content_list_table'),
				rows: rows,
				columns: columns,
				titles: title,
				styles: style,
				listType: 0,
        async: true,
        data: list_table_data,
      });
      list_table.create();
      if(select == 'tag'){
        $('#content_list_table .styleable_list_title .styleable_list_col').addClass('styleable_list_col_tag');
      };
      // alert广告图片
      if(select == 'ad'){
        if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
          _this.alertListTableAdUrl(_this.listTableData(data.metadata_audit.data[0].results, select));
        }
      };
    },
    //  列表数据
    listTableData(data, select) {
      var data_list = [];
      if(select == 'logo' || select == 'porn' || select == 'terrorism' || select == 'live' || select == 'ad'){
        for(var i = 0; i < data.length; i++){
          if(data[i].label == select){
            if(data[i].suggestion == 'review' || data[i].suggestion == 'block'){
              data_list = data[i].frames
            } else {
              data_list = [];
            }
          }
        }
      } else if(select == 'audio' || select == 'sface'|| select == 'tag'){
        data_list = data;
      };
      return data_list;
    },
    // logo列表
    listTableLogo(data, select) {
      var _this = this;
      var data_list = [];
      for(var i = 0; i < data.length; i++){
        var logo_label = _this.listLabel(data[i].label, select);
        var logo_offset = _this.timeOffset(data[i].offset);
        var logo_rate = data[i].rate;
        var logo_data = data[i].logoData;
        for(var j = 0; j < logo_data.length; j++){
          var logo_location = logo_data[j].h + ' , ' + logo_data[j].w + ' , ' + logo_data[j].x + ' , ' + logo_data[j].y;
          var row = [];
          row.push({ label: logo_label });
          row.push({ label: `<div style="padding-left:10px;text-align:left;">` + logo_data[j].name + `</div>` });
          row.push({ label: logo_data[j].type });
          row.push({ label: logo_rate });
          row.push({ label: logo_offset });
          row.push({ label: logo_location });
          if(logo_label || logo_data[j].name || logo_data[j].type || logo_rate || logo_offset || logo_location){
            data_list.push(row)
          }
        }
      }
      return data_list;
    },
    // audio列表
    listTableAudio(data, select) {
      var _this = this;
      var data_list = [];
      for(var i = 0; i < data.length; i++){
        var audio_start_time = _this.timeOffset(data[i].startTime);
        var audio_end_time = _this.timeOffset(data[i].endTime);
        var audio_label = _this.listLabel(data[i].label, select);
        var row = [];
        row.push({ label: audio_start_time});
        row.push({ label: audio_end_time});
        row.push({ label: audio_label});
        row.push({ label: `<div style="padding-left:10px;text-align:left;">` + data[i].text + `</div>` });
        if(audio_start_time || audio_end_time || audio_label || data[i].text){
          data_list.push(row);
        }
      }
      return data_list;
    },
    // porn列表
    listTablePorn(data, select) {
      var _this = this;
      var data_list = [], porn_length = Math.ceil(data.length / 2);
      for(var i = 0; i < porn_length; i++){
        var porn_label_left = _this.listLabel(data[i * 2].label, select);
        var porn_offset_left = _this.timeOffset(data[i * 2].offset);
        var row = [];
        row.push({ label: porn_label_left});
        row.push({ label: porn_offset_left});
        row.push({ label: data[i * 2].rate});
        if((i * 2) + 1 < data.length){
          var porn_label_right = _this.listLabel(data[(i * 2) + 1].label, select);
          var porn_offset_right = _this.timeOffset(data[(i * 2) + 1].offset);
          row.push({ label: porn_label_right});
          row.push({ label: porn_offset_right});
          row.push({ label: data[(i * 2) + 1].rate});
        }
        if(porn_label_left || porn_offset_left || data[i * 2].rate || porn_label_right || porn_offset_right || data[(i * 2) + 1].rate){
          data_list.push(row);
        }
      }
      return data_list;
    },
    // terrorism列表
    listTableTerrorism(data, select) {
      var _this = this;
      var data_list = [], terrorism_length = Math.ceil(data.length / 2);
      for(var i = 0; i < terrorism_length; i++){
        var terrorism_label_left = _this.listLabel(data[i * 2].label, select);
        var terrorism_offset_left = _this.timeOffset(data[i * 2].offset);
        var row = [];
        row.push({ label: terrorism_label_left});
        row.push({ label: terrorism_offset_left});
        row.push({ label: data[i * 2].rate});
        if((i * 2) + 1 < data.length){
          var terrorism_label_right = _this.listLabel(data[(i * 2) + 1].label, select);
          var terrorism_offset_right = _this.timeOffset(data[(i * 2) + 1].offset);
          row.push({ label: terrorism_label_right});
          row.push({ label: terrorism_offset_right});
          row.push({ label: data[(i * 2) + 1].rate});
        }
        if(terrorism_label_left || terrorism_offset_left || data[i * 2].rate || terrorism_label_right || terrorism_offset_right || data[(i * 2) + 1].rate){
          data_list.push(row);
        }
      }
      return data_list;
    },
    // live列表
    listTableLive(data, select) {
      var _this = this;
      var data_list = [], live_length = Math.ceil(data.length / 2);
      for(var i = 0; i < live_length; i++){
        var live_label_left = _this.listLabel(data[i * 2].label, select);
        var live_offset_left = _this.timeOffset(data[i * 2].offset);
        var row = [];
        row.push({ label: live_label_left});
        row.push({ label: live_offset_left});
        row.push({ label: data[i * 2].rate});
        if((i * 2) + 1 < data.length){
          var live_label_right = _this.listLabel(data[(i * 2) + 1].label, select);
          var live_offset_right = _this.timeOffset(data[(i * 2) + 1].offset);
          row.push({ label: live_label_right});
          row.push({ label: live_offset_right});
          row.push({ label: data[(i * 2) + 1].rate});
        }
        if(live_label_left || live_offset_left || data[i * 2].rate || live_label_right || live_offset_right || data[(i * 2) + 1].rate){
          data_list.push(row);
        }
      }
      return data_list;
    },
    // face列表
    listTableFace(data, select) {
      var _this = this;
      var data_list = [];
      for(var i = 0; i < data.length; i++){
        var sface_offset = _this.timeOffset(data[i].offset);
        var sface_data = data[i].sfaceData;
        for(var j = 0; j < sface_data.length; j++){
          var sface_name, sface_id, sface_name, sface_rate;
          if(sface_data[j].faces){
            sface_name = sface_data[j].faces[0].name;
            sface_id = sface_data[j].faces[0].id;
            sface_rate = sface_data[j].faces[0].rate;
          } else {
            sface_name = '';
            sface_id = '';
            sface_rate = '';
          }
          var row = [];
          row.push({ label: `<div style="padding-left:10px;text-align:left;">` + sface_name + `</div>` })
          row.push({ label: sface_id });
          row.push({ label: sface_rate });
          row.push({ label: sface_offset });
          var sface_location = sface_data[j].h + ' , ' + sface_data[j].w + ' , ' + sface_data[j].x + ' , ' + sface_data[j].y
          row.push({ label: sface_location });
          if(sface_name || sface_id || sface_rate || sface_offset || sface_location){
            data_list.push(row)
          }
        }
      }
      return data_list;
    },
    // tag列表
    listTableTag(data, select) {
      var _this = this;
      var data_list = [];
      for(var i = 0; i < data.length; i++){
        var tag_cnCategory = data[i].cnCategory
        var tag_enCategory = data[i].enCategory
        var tag_tagCnName = data[i].tagCnName
        var tag_tagEnName = data[i].tagEnName
        var tag_data = data[i].tagSegment;
        for(var j = 0; j < tag_data.length; j++){
          var tag_start_time = _this.timeOffset(tag_data[j].offset);
          var tag_end_time = _this.timeOffset(tag_data[j].offset + tag_data[j].duration);
          var row = [];
          row.push({ label: tag_start_time });
          row.push({ label: tag_end_time });
          row.push({ label: tag_cnCategory });
          row.push({ label: tag_enCategory });
          row.push({ label: tag_data[j].rate });
          row.push({ label: tag_tagCnName });
          row.push({ label: tag_tagEnName });
          if(tag_start_time || tag_end_time || tag_cnCategory || tag_enCategory || tag_data[j].rate || tag_tagCnName || tag_tagEnName){
            data_list.push(row);
          }
        }
      }
      return data_list;
    },
    // ad列表
    listTableAd(data, select) {
      var _this = this;
      var _this = this;
      var data_list = [];
      for(var i = 0; i < data.length; i++){
        var ad_start_time = _this.timeOffset(data[i].offset);
        var ad_end_time = _this.timeOffset(data[i].offset);
        var ad_label = _this.listLabel(data[i].label, select);
        var row = [];
        row.push({ label: ad_start_time});
        row.push({ label: ad_end_time});
        row.push({ label: ad_label});
        row.push({ label: `<div class="poster_audit_list_table_ad_url" title="`+ data[i].url +`" style="height:36px;line-height:36px;padding-left:10px;text-align:left;cursor: pointer;overflow:hidden;white-space: nowrap;;text-overflow: ellipsis;">` + data[i].url + `</div>` });
        if(ad_start_time || ad_end_time || ad_label || data[i].url){
          data_list.push(row);
        }
      }
      return data_list;
    },
    // 匹配点击广告内的url框，弹出alert_image
    alertListTableAdUrl(data) {
      $('.poster_audit_list_table_ad_url').each(function (e) {
        $(this).click(function () {
          var cb = function() {
            $('#alert_image .poster_audit_alert_image').css({
              'background-image': 'url("'+ data[e].url +'")',
            });
          };
          var alert_dialog = new PopupDialog({
            url: 'content/menuVideoAudit/alert_image.html',
            context: this,
            width: 600,
            height: 480,
            isScroll: true,
            callback: cb,
          });
          alert_dialog.create();
        });
      });
    },
    // 匹配list列表的label
    listLabel(label) {
      var list_label;
      switch (label) {
        case 'normal':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_NORMAL");
          break;
        case 'spam':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_SPAM");
          break;
        case 'ad':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_AD");
          break;
        case 'politics':
        case 'terrorism':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_POLITICS");
          break;
        case 'terrorism':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_TERRORISM");
          break;
        case 'abuse':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_ABUSE");
          break;
        case 'porn':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_PORN");
          break;
        case 'flood':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_FLOOD");
          break;
        case 'contraband':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_CONTRABAND");
          break;
        case 'customized':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_CUSTOMIZED");
          break;
        case 'live':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_LIVE");
          break;
        case 'logo':
          list_label = i18n("PARTICULAR_TYPE_AUDIO_LABEL_LOGO");
          break;
        default:
          list_label = label;
          break;
      };
      return list_label;
    },
    // 显示JSON数据，并格式化
    showJsonContent(data, select) {
      var _this = this;
      $('#poster_audit_json .mCSB_container').html('<pre class="content_json_pre" id="poster_audit_json_pre"></pre>')
      var json_data = [], data_list = [];  //拿到JSON字符串
      if(select == 'logo' || select == 'porn' || select == 'terrorism' || select == 'live' || select == 'ad'){
        if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].results){
          data_list = data.metadata_audit.data[0].results;
          for(var i = 0; i < data_list.length; i++){
            if(data_list[i].label == select){
              if(data_list[i].suggestion == 'review' || data_list[i].suggestion == 'block'){
                json_data = data_list[i].frames
              } else {
                json_data = [];
              }
            }
          }
        } else {
          json_data = [];
        }
      } else if(select == 'audio'){
        if(data && data.metadata_audit && data.metadata_audit.data && data.metadata_audit.data[0].audioScanResults && data.metadata_audit.data[0].audioScanResults[0].details){
          json_data = data.metadata_audit.data[0].audioScanResults[0].details;
        } else {
          json_data = [];
        }
      } else if(select == 'sface'){
        if(data && data.metadata_sface && data.metadata_sface.data && data.metadata_sface.data[0].results && data.metadata_sface.data[0].results[0].frames){
          json_data = data.metadata_sface.data[0].results[0].frames;
        } else {
          json_data = [];
        }
      } else if(select == 'tag'){
        if(data && data.metadata_tag && data.metadata_tag.data && data.metadata_tag.data[0].results){
          json_data = data.metadata_tag.data[0].results;
        } else {
          json_data = [];
        }
      };
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
      $('#poster_audit_json_pre').html(syntaxHighlight(json_data));
    },
    // 通过、违规弹框
    bindEventsDialog(poster_auditData, id) {
      var _this = this;
      $('#poster_audit .container .audit_result .btn .pass.icon').unbind().bind('click', ({currentTarget, target}) => {
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
      $('#poster_audit .container .audit_result .btn .block.icon').unbind().bind('click', ({currentTarget, target}) => {
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
    // 将秒改为时间帧
    timeOffset(offset) {
      var time_offset, m = '00' , s = '00';
      if(offset < 60){
        s = timeAddZero(offset);
      } else if(offset >= 60){
        m = timeAddZero(Math.floor(offset / 60));
        s = timeAddZero(offset - m * 60);
      }
      time_offset = m + ':' + s;
      function timeAddZero(num) {
        if(num < 10){
          num = '0' + num;
        }
        return num;
      }
      return time_offset;
    },
    // 初始化滚动条
    show_mCustomScrollbar() {
        // $("#result_detail_content").mCustomScrollbar({
        //     axis: "y"
        // });
        $("#poster_audit_poster_content_list").mCustomScrollbar({
            axis: "y"
        });
        $("#poster_audit_poster_content").mCustomScrollbar({
            axis: "y"
        });
        $("#poster_audit_list").mCustomScrollbar({
            axis: "y"
        });
        $("#poster_audit_json").mCustomScrollbar({
            axis: "y"
        });
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
        } else {
          console.log('获取数据出错！')
        }
      })
      .fail()
      .always();
      return getListData;
    },
    // 通过审核或设为违规
    setAudit(id, audit_status) {
      var audit_value = $('#audit_alert_dialog_textarea').val();
      var audit_put_data = {
        'no': '2',
        'reason': audit_value
      };
      audit_put_data.status = audit_status;
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
          $('#poster_audit_audit_result_btn').css({'display': 'none'});
        }
      })
      .fail()
      .always();
    },
  };

	return PosterAudit;
});
