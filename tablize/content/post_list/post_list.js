var announcementPostList = (function($) {
    var announcementPost = {
        init: function() {
		    this.initPara();
			this.initRequest();
			this.initUI();
			this.drawListTopic();
			this.handleListEventsTopic();
			this.bindSecondPage();
            this.handleListEvents();
        },
		initPara:function(){
		    var self=this;
			this.templateType=1;//模板样式
			this.preUEready=true;//一个个加载富文本
			this.finishedInitRichTextLen=1;//一次批量加载多个富文本时，加载成功的数量。从第一个开始加载。
			this.postImagePath="";
			this.hasInitSecondPageComponent=false;
			this.hasInitSecondPageComponentForEdit=false;
			this.enterSecondPageType="";
			if(typeof postImagePath!="undefined"){
				this.postImagePath=postImagePath.substring(0,postImagePath.length-1);
			};
			this.hasBindEvents={
				"topic":false,
				"post":false,
			};
			window.dropdownHelper.addDropdownHandler(self);
			
			var bodyHeight=window.innerHeight-56-61+"px";
			$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").css({
				"height":bodyHeight,
				"max-height":bodyHeight
			});
			window.onresize = function(){
				$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").css({
					"height":bodyHeight,
					"max-height":bodyHeight
				});
			}
			
		},
		initRequest:function(){
			var aquaHost = aqua_host;
            var storage_username = LOGIN_AQUA_USERNAME;
            var storage_password = LOGIN_AQUA_PWD;
            var storage_domain = LOGIN_AQUA_DOMAIN_URI;
			this.upload = new UploadModule(aquaHost, storage_username, storage_password, storage_domain);
		},
		initUI:function(){
			if(window.innerWidth<1400){
				document.getElementById("announcement_post_list_create_time").style.width="306px"
			}
		},
		getTopicList: function(callback,key,value) {
			var self = this;
			this.rawTopicListData=[];
			this.currentTopicData=[];
			var url = aquapaas_host + '/aquapaas/rest/announcement/admin/topic';
			url += "?del_flag=0";
			url += "&user_id=" + my.paas.user_id;
			url += "&app_key=" + paasAppKey;
			url += "&timestamp=" + new Date().toISOString();
			url += "&access_token=" + my.paas.access_token;
			var method = "GET";
			$.ajax({
				type: method,
				url: url,
				async: true,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).done(function(data) { 
				var filteredData=[];
				if((typeof key!="undefined")&&(typeof value!="undefined")){
					for(var i= 0,len = data.length;i<len;i++){
						var currentData=data[i];
						if(currentData[key]&&(currentData[key].indexOf(value)!=-1)){
							filteredData.push(currentData)
						}
					};
					self.rawTopicListData=filteredData;
					var formListData = self.formListDataTopic(filteredData);
					callback(formListData)
				}
				else{
					self.rawTopicListData=data;
					var formListData = self.formListDataTopic(data);
					callback(formListData)
				}
			}).fail(function(xhr) { 
				self.rawTopicListData = [];
				callback([])
			});
			
		},
        getPostList: function(callback) {
            var self = this;
            this.rawListData = [];
			this.currentData=[];//当前的post数据
            var url = aquapaas_host + '/aquapaas/rest/announcement/admin/topic/';
            url += this.topicExtId;
			url += "?query_flag=1";
            url += "&user_id=" + my.paas.user_id;
            url += "&app_key=" + paasAppKey;
            url += "&timestamp=" + new Date().toISOString();
            url += "&access_token=" + my.paas.access_token;
            var method = "GET";
			$.ajax({
                type: method,
                url: url,
                async: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
                }
            }).done(function(data) { 
				var newData={};
				newData.notice_list=[];
				notice_list_new=[];
				if(data.notice_list){
					var notice_list=data.notice_list;
					for(var i= 0,lenUEObjA = notice_list.length;i<lenUEObjA;i++){
						if((typeof notice_list[i].del_flag != "undefined")&&(notice_list[i].del_flag==1)){//mail 2019.10.29
						}
						else{
							notice_list_new.push(notice_list[i])
						}
					};
					newData.notice_list=notice_list_new;
					self.rawListData = newData;
					var formListData = self.formListData(newData);
					callback(formListData)
					
				}
            }).fail(function(xhr) { 
                self.rawListData = [];
                callback([])
            });
			//*/
        },

        formListData: function(rawData) {
		    var self=this;
		    self.listFormatData=[];
            var formatData = [];
            if (rawData && rawData.notice_list) {
                var notice_list = rawData.notice_list;
                if (notice_list.length > 0) {
                    for (var i = 0,len = notice_list.length; i < len; i++) {
                        var postListUnit = notice_list[i];
                        var hideFlag = 0; //整形字段，默认0。
                        if ((typeof postListUnit.hide_flag == "number") || (typeof postListUnit.hide_flag == "string")) {
                            hideFlag = parseInt(postListUnit.hide_flag)
                        };
                        var currentHideFlagText = (hideFlag > 0 ? i18n("POST_LIST_DISABLE") : i18n("POST_LIST_ACTIVE"));
                        var nextStepHideFlagText = (hideFlag > 0 ? i18n("POST_LIST_ACTIVE") : i18n("POST_LIST_DISABLE")); //待设置的状态
						var publishTime="";
                        if (typeof(postListUnit.post_publish_time) !="undefined"&&(postListUnit.post_publish_time!="")){
                            publishTime = this.timestampToStr(postListUnit.post_publish_time)
                        };
                        var ops = '<div class="oprs-all" data-index="' + i + '">';
                        ops += '<div class="opr-default" data-opr="view">' + i18n("POST_LIST_VIEW") + '</div>';
                        ops += '<div class="opr-default" data-opr="edit">' + i18n("POST_LIST_EDIT") + '</div>';
                        ops += '<div class="opr-more">';
                        ops += '<div class="opr-default opr-more-default">' + i18n("POST_LIST_MORE") + '<img src="images/users/more_down_arrow.png"/></div>';
                        ops += '<div class="opr-more-detail">';
                        ops += '<div class="opr-default opr-more-default">' + i18n("POST_LIST_MORE") + '<img src="images/users/more_up_arrow.png"/></div>';
                        ops += '<div class="opr-default" data-opr="ban">' + nextStepHideFlagText + '</div>';
                        ops += '<div class="opr-default" data-opr="delete">' + i18n("POST_LIST_DELETE") + '</div>';
                        ops += '</div>';
                        ops += '</div>';
                        ops += '</div>';
                        ops += '</div>';
                        var rowData = [{
                            label: postListUnit.title || ""
                        },
                        {
                            label: publishTime
                        },
                        {
                            label: ((postListUnit.metadata && postListUnit.metadata.source) ? postListUnit.metadata.source: "") //目前没这个字段？？
                        },
                        {
                            label: ops
                        }];
                        formatData.push(rowData);
                    }
                }
				self.listFormatData=formatData;
            };
            return formatData
        },
		formListDataTopic: function(rawTopicData) {
		    var self=this;
		    this.listTopicFormatData=[];
            var formatData = [];
			for (var i = 0,len = rawTopicData.length; i < len; i++){
				var currentRawTopicData=rawTopicData[i];
				var lastPublishTime="";
				if (currentRawTopicData.last_publish_time) {
					lastPublishTime = this.timestampToStr(currentRawTopicData.last_publish_time)
				};
				var hideFlag = 0; //整形字段，默认0。
				if ((typeof currentRawTopicData.hide_flag == "number") || (typeof currentRawTopicData.hide_flag == "string")) {
					hideFlag = parseInt(currentRawTopicData.hide_flag)
				};
				var currentHideFlagText = (hideFlag > 0 ? i18n("POST_LIST_DISABLE") : i18n("POST_LIST_ACTIVE"));
                var nextStepHideFlagText = (hideFlag > 0 ? i18n("POST_LIST_ACTIVE") : i18n("POST_LIST_DISABLE")); //待设置的状态
				var tags="";
				if(typeof currentRawTopicData.tags!="undefined"){
				    var curTags=currentRawTopicData.tags;
					if(typeof JSON.stringify(curTags) != "{}"){
						var tagsStr=JSON.stringify(curTags);
						tags=tagsStr.substring(1,tagsStr.length-1);
					};
				};
				var ops = '<div class="oprs-all" data-index="' + i + '">';
				ops += '<div class="opr-default" data-opr="view">' + i18n("POST_LIST_VIEW") + '</div>';
				ops += '<div class="opr-default" data-opr="edit">' + i18n("POST_LIST_EDIT") + '</div>';
				ops += '<div class="opr-default" data-opr="post_list">' + i18n("POST_LIST_POST_LIST") + '</div>';
				ops += '<div class="opr-more">';
				ops += '<div class="opr-default opr-more-default">' + i18n("POST_LIST_MORE") + '<img src="images/users/more_down_arrow.png"/></div>';
				ops += '<div class="opr-more-detail">';
				ops += '<div class="opr-default opr-more-default">' + i18n("POST_LIST_MORE") + '<img src="images/users/more_up_arrow.png"/></div>';
				ops += '<div class="opr-default" data-opr="ban">' + nextStepHideFlagText + '</div>';
				ops += '<div class="opr-default" data-opr="delete">' + i18n("POST_LIST_DELETE") + '</div>';
				ops += '</div>';
				ops += '</div>';
				ops += '</div>';
				ops += '</div>';
				var rowData = [{
					label: currentRawTopicData.topic_ext_id||""
				},
				{
					label: currentRawTopicData.name||""
				},
				{
					label: currentRawTopicData.title||""
				},
				{
					label: tags
				},
				{
					label: lastPublishTime
				},
				{
					label: ops
				}];
				formatData.push(rowData);
			};
			self.listTopicFormatData=formatData;
            return formatData
        },
        preZero: function(num) {
            var str = num.toString();
            if (str.length < 2) {
                str = '0' + str;
            }
            return str;
        },
        timestampToStr: function(num) {
		    if(num==""){
				return ""
			};
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
		
		creatList: function(data) {
		    var self=this;
			self.listTopic = new StyledList({
				async: true,
				rows: 15,
				columns: 6,
				containerId: 'announcement_topic_list_table_container',
				listType: 0,
				titles: [{
					label: i18n("POST_LIST_TOPIC_ID")
				},
				{
					label: i18n("POST_LIST_TOPIC_NAME")
				},
				{
					label: i18n("POST_LIST_TITLE")
				},
				{
					label: i18n("POST_LIST_TAG")
				},{
					label: i18n("POST_LIST_LAST_PUBLISH_TIME")
				},{
					label: i18n("POST_LIST_OPR")
				}],
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
					columnsWidth: [0.092, 0.184, 0.191, 0.158, 0.135, 0.232]
				},
				data: data
			});
			 self.listTopic.create();
		},
		
		drawListTopic: function() {
			var self = this;
			this.getTopicList(function(tableData){
				self.creatList(tableData);
			})
		},
		
        drawList: function() {
            var self = this;
            this.getPostList(function(tableData) {
                self.list = new StyledList({
                    async: true,
                    rows: 15,
                    columns: 4,
                    containerId: 'announcement_post_list_table_container',
                    listType: 0,
                    titles: [{
                        label: i18n("POST_LIST_TITLE")
                    },
                    {
                        label: i18n("POST_LIST_PUBLISH_TIME")
                    },
                    {
                        label: i18n("POST_LIST_SOURCE")
                    },
                    {
                        label: i18n("POST_LIST_OPR")
                    }],
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
                        columnsWidth: [0.49, 0.15, 0.13, 0.2]
                    },
                    data: tableData
                });
                self.list.create();
            })
        },
		toggleElement:function(ele1Id,ele2Id){
			 $('#'+ele1Id+'').hide();
			 $('#'+ele2Id+'').show();
			 $('#'+ele2Id+'').find(".btn_confirm").parent().show();
		},
		addMetadataKeyValueRow:function(containerid,key,value){
		   var len=$("#announcement_topic_template_list_container").find(".announcement_post_list_meta_container").length;
		   var index=len+1;
		   var style="";
		   var styleInput="";
		   var attr="";
		   var addDelHTML="";
		   if(this.enterSecondPageType=="view"){
				style="background-color:#ebebeb;";
				attr="readonly=\"readonly\";";
				//styleInput="width: calc(100% - 406px);";
		   }
		   else{
				addDelHTML="<img class=\"announcement_post_list_add\" src=\"content/post_list/images/add.png\"/><img class=\"announcement_post_list_del\" src=\"content/post_list/images/del.png\"\"/></div>";
		   };
			var html="";
			html+="<div class=\"announcement_post_list_meta_container\">";
			html+="<label title=\""+index+"\" class=\"meta_index\" style=\""+style+"\">"+index+"</label>";
			var listKey=i18n("POST_LIST_KEY");
			var listValue=i18n("POST_LIST_VALUE");
			html+="<div style=\"display: inline-block\" class=\"metadata_key\" id=\"key_1572518810042\"><div class=\"combo\" style=\"width: 100%; height: 100%; color: rgb(121, 121, 121); position: relative;\">";
			html+="<input placeholder=\""+listKey+"\" "+attr+" value=\""+key+"\" style=\"height: 100%; width: 100%; border: medium none;padding-left: 10px; padding-right: 30px; outline: medium none; margin-right: 0px;"+style+"\">";
			/*
			html+="<div style=\"display: none; position: absolute; top: 28px; left: -1px; width: 100%; border: 1px solid rgb(226, 226, 226); background-color: rgb(255, 255, 255); z-index: 1;\" class=\"combo_list\">";
			html+="</div>";
			*/
			html+="</div></div>";
			html+="<input style=\""+style+""+styleInput+"\" placeholder=\""+listValue+"\" "+attr+" value=\""+value+"\" class=\"metadata_val\">";
			/*
			html+="<svg data-index=\"0\" name=\"add\" class=\"opr\" style=\"height: 18px;width: 18px;\"><polygon points=\"7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7\"/></svg>";
			html+="<svg data-index=\"0\" id=\"rule_del_1572518810042\" name=\"del\" class=\"opr\" style=\"height: 18px;width: 18px;\"><polygon points=\"0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2\"/></svg>";
			*/
			html+=addDelHTML;
			html+="</div>";
			if(this.enterSecondPageType=="edit"){
				
			};
			$("#announcement_topic_template_list_container").append(html);
		},
		backToTopicPage1:function(){
			this.toggleElement("announcement_topic_list_second_page_body","announcement_topic_list_table_container");
			$("#announcement_topic_list_edit_back").hide();
			$("#announcement_topic_list_edit_confirm").hide();
			$("#announcement_topic_list_edit_cancel").hide();
			$("#announcement_topic_list_add_topic").show();
			$('#announcement_post_list_topic_search').parent().show();
		},
		initMetadata: function() {
			var currentData=this.currentData;
			if(currentData.metadata){
				var metadata=currentData.metadata;
				for(var i in metadata){
					this.addMetadataKeyValueRow("announcement_topic_template_list_container",i,metadata[i])
				}
			};
			if(this.enterSecondPageType=="edit"){//编辑时，多加一组空的供用户填写
				this.addMetadataKeyValueRow("announcement_topic_template_list_container","","")
			}
		},
		initMcsbScroll:function(){
		    var obj= $("#announcement_topic_list_second_page_body");
			var height=$(obj).get(0).offsetHeight-56;
			$(obj).children().eq(0).css("height",""+height+"px");
			$(obj).children().eq(0).mCustomScrollbar({
				theme:"my-theme"
			});
		},
		hideFirstPageEle:function(){
			this.toggleElement("announcement_topic_list_table_container","announcement_topic_list_second_page_body");
			$('#announcement_topic_list_add_topic').hide();
			$('#announcement_post_list_topic_search').parent().hide();
		},
		handleListEventsTopic: function() {
			var self = this;
            $('#announcement_topic_list_table_container').on('click', '.opr-default',function() {
                var opr = $(this);
                if (opr.parents('.opr-more').length > 0) {
                    var $more = opr.parents('.opr-more');
                    if ($more.hasClass('opr-more-open')) {
                        $more.removeClass('opr-more-open');
                    } else {
                        $('.opr-more-open').removeClass('opr-more-open');
                        $more.addClass('opr-more-open');
                    }
                }
                var type = opr.attr('data-opr');
                var index = opr.parents('.oprs-all').attr('data-index');
                self.rowIndex = index;
				var rawTopicListData = self.rawTopicListData;
				var currentData=rawTopicListData[index];
				self.currentData=currentData;
				if(typeof currentData.tags!="undefined"){
					if(typeof JSON.stringify(currentData.tags) == "{}"){
						delete currentData.tags;
					};
				};
				var title=currentData.title||"";
				self.enterSecondPageType=type;
				var id=currentData.topic_ext_id||"";
                switch (type) {
                case 'view':
				    self.hideFirstPageEle();
					self.initMcsbScroll();
				    $("#announcement_topic_list_edit_back").show();
					$("#announcement_topic_list_edit_confirm").hide();
					$("#announcement_topic_list_create_confirm").hide();
					$("#announcement_topic_list_edit_cancel").hide();
					$("#announcement_topic_template_list_container").empty();
					self.showSecondPageTopic();
					self.bindSecondPageCommon("topic");
                    break;
                case 'edit':
				    self.hideFirstPageEle();
					self.initMcsbScroll();
					$("#announcement_topic_list_edit_back").hide();
					$("#announcement_topic_list_edit_confirm").show();
					$("#announcement_topic_list_create_confirm").hide();
					$("#announcement_topic_list_edit_cancel").show();
					$("#announcement_topic_template_list_container").empty();
					self.showSecondPageTopic();
					self.bindSecondPageCommon("topic");
					break;
				case 'ban':
				    var confirmText="";
					var hideFlag = 0; //整形字段，默认0(启用)。
                    if ((typeof currentData.hide_flag == "number") || (typeof currentData.hide_flag == "string")) {
                        hideFlag = parseInt(currentData.hide_flag)
                    };
					if(hideFlag>0){//原来是禁用，现在点击是启用
						confirmText=i18n("POST_LIST_CONFIRM3")
					}
					else{
						confirmText=i18n("POST_LIST_CONFIRM2")
					};
					self.showMsgDialog(confirmText + title + i18n("POST_LIST_MA"), function(){
						self.banOrActiveTopic();
					  });
				    break;
				case 'delete':
					self.showMsgDialog(i18n("POST_LIST_CONFIRM1") + title + i18n("POST_LIST_MA"), function(){
						self.deleteObjRequest(id,function(){
							var searchValue=$("#announcement_post_list_topic_search").val();
							if(searchValue==""){
								self.getTopicList(function(tableData) {
									self.listTopic.updateInPage(self.listTopicFormatData);
								})
							}
							else{
								self.getTopicList(function(tableData) {
									self.listTopic.updateInPage(self.listTopicFormatData);
								},"name",searchValue)
							}
						},"topic")
					  });
					break;
				case 'post_list':
					self.topicExtId=id;
					$("#announcement_post_list_post_title").text(id+"-"+i18n("POST_LIST_POST_LIST"))
					self.toggleElement("announcement_topic_list_container","announcement_post_list_container");
					self.drawList();
                default:
                    break;
                }
            });
			$('#announcement_post_list_topic_search').on('keydown', function(e){
				if(e.keyCode == 13){
					self.searchContent()
				}
			  }).siblings('.user-admin-search-icon').on('click', function(){
				  self.searchContent()
			  });
			$('#announcement_topic_list_add_topic').on('click', function(){
			      self.currentData={};
				  self.enterSecondPageType="add";
				  self.hideFirstPageEle();
				  self.initMcsbScroll();
				  $("#announcement_topic_list_edit_back").hide();
				  $("#announcement_topic_list_create_confirm").show();
				  $("#announcement_topic_list_edit_cancel").show();
				  $("#announcement_topic_template_list_container").empty();
				  self.showSecondPageTopicAdd();
				  self.bindSecondPageCommon("topic");
			 });
		},
		 searchContent:function(){
		    var self=this;
			var searchValue=$("#announcement_post_list_topic_search").val();
			if(searchValue!=""){
				this.getTopicList(function(tableData) {
					self.creatList(tableData);
				},"name",searchValue)
			}
			else{
				self.getTopicList(function(tableData) {
					self.creatList(tableData);
				})
			}
		 },
		 handleListEvents: function() {
            var self = this;
            $('#announcement_post_list_table_container').on('click', '.opr-default',function() {
                var opr = $(this);
                if (opr.parents('.opr-more').length > 0) {
                    var $more = opr.parents('.opr-more');
                    if ($more.hasClass('opr-more-open')) {
                        $more.removeClass('opr-more-open');
                    } else {
                        $('.opr-more-open').removeClass('opr-more-open');
                        $more.addClass('opr-more-open');
                    }
                }
                var type = opr.attr('data-opr');
                var index = opr.parents('.oprs-all').attr('data-index');
                self.rowIndex = index;
				var currentData={};
				var rawListData = self.rawListData;
				if (rawListData && rawListData.notice_list) {
					var notice_list = rawListData.notice_list;
					if (notice_list.length > 0) {
						currentData = notice_list[self.rowIndex];
					}
				};
				self.currentData=currentData;
				if(typeof currentData.tags!="undefined"){
					if(typeof JSON.stringify(currentData.tags) == "{}"){
						delete currentData.tags;
					};
				};
				var title=currentData.title||"";
				self.enterSecondPageType=type;
				$("#announcement_post_list_mould_content_period").parent().remove();
                switch (type) {
                case 'view':
                    self.hideFirstPage();
                    self.showSecondPage();
					self.initSecondPageComponent();
					self.bindSecondPage("view");
                    self.fillSecondPage();
					self.fillCurrentTemplate();
                    break;
                case 'edit':
                    self.hideFirstPage();
                    self.showSecondPage();
					self.initSecondPageComponent();
					self.bindSecondPage("edit");
					self.fillSecondPage();
					self.fillCurrentTemplate();
					break;
				case 'ban':
				    var confirmText="";
					var hideFlag = 0; //整形字段，默认0(启用)。
                    if ((typeof currentData.hide_flag == "number") || (typeof currentData.hide_flag == "string")) {
                        hideFlag = parseInt(currentData.hide_flag)
                    };
					if(hideFlag>0){//原来是禁用，现在点击是启用
						confirmText=i18n("POST_LIST_CONFIRM3")
					}
					else{
						confirmText=i18n("POST_LIST_CONFIRM2")
					}
					self.showMsgDialog(confirmText + title + i18n("POST_LIST_MA"), function(){
						self.banOrActive();
					  });
				    break;
				case 'delete':
					self.showMsgDialog(i18n("POST_LIST_CONFIRM1") + title + i18n("POST_LIST_MA"), function(){
						self.deletePost();
					  });
					break;
				    //self.deletePost()
                default:
                    break;
                }
            });
			$('#announcement_post_list_back_btn').on('click', function(){
				self.toggleElement("announcement_post_list_container","announcement_topic_list_container");
			});
			$('#announcement_topic_list_add_post').on('click', function(){
				$("#announcement_post_list_mould_content_period").parent().remove();
			    self.currentData={};
				self.enterSecondPageType="add";
				self.hideFirstPage();
                self.showSecondPage();
			    self.initSecondPageComponent();
				self.bindSecondPage("add");
				//self.fillSecondPage();
				self.clearSecondPage();
				self.fillSecondPageAdd();
			    self.fillCurrentTemplateAdd();
			 });
        },
		fillSecondPageAdd:function(){
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var hour = date.getHours();
			var minutes = date.getMinutes() ;
			var seconds = date.getSeconds();
			var strDate = date.getDate();
			
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			};
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			};
			if (hour >= 0 && hour <= 9) {
				hour = "0" + hour;
			};
			if (minutes >= 0 && minutes <= 9) {
				minutes = "0" + minutes;
			};
			if (seconds >= 0 && seconds <= 9) {
				seconds = "0" + seconds;
			};
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			$("#announcement_post_list_calendar").find(".datepicker-input").val(currentdate);
			$("#announcement_post_list_hour_menu").find(".select-header").text(hour);
			$("#announcement_post_list_select_minute").find(".select-header").text(minutes);
			$("#announcement_post_list_select_second").find(".select-header").text(seconds);
		},
	    showMsgDialog:function(msg, callback,openCallback){
			var dialog = new OverlayDialog({
				url: 'content/sys_user_admin/msg-dialog.html',
				width: 470,
				height: 266,
				context: {},
				zIndex: 3000,
				id: 'sysUser_user-admin-msg',
				callback: function(){
				  if(typeof openCallback == 'function'){
					openCallback();
				  };
				  $('#sysUser_user-admin-msg-content').text(msg);
				  $('#sysUser_user-admin-msg-close').on('click', function(){
					dialog.close();
				  });
				  $('#sysUser_user-admin-msg-cancel').on('click', function(){
					dialog.close();
				  });
				  $('#sysUser_user-admin-msg-submit').on('click', function(){
					dialog.close();
					if(typeof callback == 'function'){
					  callback();
					}
				  });
				}
		  });
		  dialog.open();
		},
		banOrActiveTopic:function(){
			var self=this;
			var jq=jQuery;
			var searchValue=$("#announcement_post_list_topic_search").val();
			var currentData = this.currentData;
			var id=currentData.topic_ext_id||"";
			var hideFlag = 0; //整形字段，默认0(启用)。
			if ((typeof currentData.hide_flag == "number") || (typeof currentData.hide_flag == "string")) {
				hideFlag = parseInt(currentData.hide_flag)
			};
			if(hideFlag>0){//原来是禁用，现在点击是启用
				this.hideShowObj(id,"show",function(){
					if(searchValue==""){
						self.getTopicList(function(tableData) {
							self.listTopic.updateInPage(self.listTopicFormatData);
						})
					}
					else{
						self.getTopicList(function(tableData) {
							self.creatList(tableData);
						},"name",searchValue)
					}
				},"topic")
			}
			else{
				this.hideShowObj(id,"hide",function(){
					if(searchValue==""){
						self.getTopicList(function(tableData) {
							self.listTopic.updateInPage(self.listTopicFormatData);
						})
					}
					else{
						self.getTopicList(function(tableData) {
							self.listTopic.updateInPage(self.listTopicFormatData);
						},"name",searchValue)
					}
				},"topic")
			}
		},
		banOrActive:function(){
		    var self=this;
			var jq=jQuery;
			var rawListData = this.rawListData;
			if (rawListData && rawListData.notice_list) {
				var notice_list = rawListData.notice_list;
                if (notice_list.length > 0) {
					var currentData = notice_list[this.rowIndex];
					var hideFlag = 0; //整形字段，默认0(启用)。
                    if ((typeof currentData.hide_flag == "number") || (typeof currentData.hide_flag == "string")) {
                        hideFlag = parseInt(currentData.hide_flag)
                    };
					if(hideFlag>0){//原来是禁用，现在点击是启用
						this.hideShowPost("show",function(){
							self.getPostList(function(tableData) {
								self.list.updateInPage(self.listFormatData);
							})
						})
					}
					else{
						this.hideShowPost("hide",function(){
							self.getPostList(function(tableData) {
								self.list.updateInPage(self.listFormatData);
							})
						})
					}
				}
			}
		},
		deletePost:function(){//???删掉列表不更新？
			var self=this;
			var jq=jQuery;
			var rawListData = this.rawListData;
			if (rawListData && rawListData.notice_list) {
				var notice_list = rawListData.notice_list;
                if (notice_list.length > 0) {
					var currentData = notice_list[this.rowIndex];
					if(currentData){
						var id=currentData.id||"";
						self.deletePostRequest(id,function(){
							self.getPostList(function(tableData) {
								self.list.updateInPage(self.listFormatData);
							})
						})
					}
				}
			}
		},
		deleteObjRequest: function(id,callback,type) {
			var url=aquapaas_host + "/aquapaas/rest/announcement/admin/"+type+"/";
			url += id;
			url += "?user_id=" + my.paas.user_id;
			url += "&app_key=" + paasAppKey;
			url += "&timestamp=" + new Date().toISOString();
			url += "&access_token=" + my.paas.access_token;
			var method = "DELETE";
			$.ajax({
				type: method,
				url: url,
				async: true,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).done(function(data) {
				callback()
			})
		},
		deletePostRequest: function(id,callback) {
			var url=aquapaas_host + "/aquapaas/rest/announcement/admin/post/";
			url += id;
			url += "?user_id=" + my.paas.user_id;
			url += "&app_key=" + paasAppKey;
			url += "&timestamp=" + new Date().toISOString();
			url += "&access_token=" + my.paas.access_token;
			var method = "DELETE";
			$.ajax({
				type: method,
				url: url,
				async: true,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).done(function(data) {
				callback()
			})
		},
		hideShowObj: function(id,status,callback,type) {
			var currentData = this.currentData;
			if(id!=""){
				var url=((status=="show")?(aquapaas_host + '/aquapaas/rest/announcement/admin/'+type+'/show/'):(aquapaas_host + '/aquapaas/rest/announcement/admin/'+type+'/hide/'));
			    url += id;
				url += "?user_id=" + my.paas.user_id;
				url += "&app_key=" + paasAppKey;
				url += "&timestamp=" + new Date().toISOString();
				url += "&access_token=" + my.paas.access_token;
				var method = "PUT";
				$.ajax({
					type: method,
					url: url,
					async: true,
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
					}
				}).done(function(data) {
					callback()
				})
			}
		},
		hideShowPost: function(status,callback) {
			var rawListData = this.rawListData;
			if (rawListData && rawListData.notice_list) {
				var notice_list = rawListData.notice_list;
                if (notice_list.length > 0) {
					var currentData = notice_list[this.rowIndex];
					var postId=currentData.id||"";
					if(postId!=""){
						var url=((status=="show")?(aquapaas_host + '/aquapaas/rest/announcement/admin/post/show/'):(aquapaas_host + '/aquapaas/rest/announcement/admin/post/hide/'));
						url += postId;
						url += "?user_id=" + my.paas.user_id;
						url += "&app_key=" + paasAppKey;
						url += "&timestamp=" + new Date().toISOString();
						url += "&access_token=" + my.paas.access_token;
						var method = "PUT";
						$.ajax({
							type: method,
							url: url,
							async: true,
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
								'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
							}
						}).done(function(data) {
							callback()
						})
					}
				}
			}
		},
		clearSecondPage: function() {
			var self=this;
			$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
			  $(this).val("")
			});
			$("#announcement_post_list_template_style").find(".select-header").text("1");
			self.templateType="1";
			if(typeof modulePara != "undefined"){
				for(var i= 0,len = modulePara.length;i<len;i++){
					if(typeof modulePara[i].module!= "undefined"){
						if(modulePara[i].module==self.templateType){
							var detailsPageUrl=modulePara[i].detailsPageUrl||"";
							$("#announcement_post_list_detail_url").val(detailsPageUrl);
							break
						}
					}
				}
			};
			$("#announcement_post_list_calendar").find(".datepicker-input").val("");
			$("#announcement_post_list_hour_menu").find(".select-header").text("");
			$("#announcement_post_list_select_minute").find(".select-header").text("");
			$("#announcement_post_list_select_second").find(".select-header").text("");
		},
        fillSecondPage: function() {
		    var self=this;
            var rawListData = this.rawListData;
            if (rawListData && rawListData.notice_list) {
                var notice_list = rawListData.notice_list;
                if (notice_list.length > 0) {
                    var currentData = notice_list[this.rowIndex];
                    $("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
                        if ((typeof $(this).attr("data-key") != "undefined") && (typeof currentData[$(this).attr("data-key")] != "undefined")) {
							if(typeof $(this).attr("data-time") == "undefined"){
								$(this).val(currentData[$(this).attr("data-key")])
							}
							else{
								$(this).val(self.timestampToStr(currentData[$(this).attr("data-key")]))
							}
                        } else if (typeof $(this).attr("data-metadata") != "undefined") {
                            if (currentData.metadata && currentData.metadata[$(this).attr("data-metadata")]) {
                                $(this).val(currentData.metadata[$(this).attr("data-metadata")])
                            }
                        } else if (typeof $(this).attr("data-map") != "undefined") {
							var dataMap=$(this).attr("data-map").split("-");
							if(currentData){
							  var temp=currentData;
							  var map=true;
							  for (var i = 0,len = dataMap.length; i < len; i++){//a.b.c
							    if(temp[dataMap[i]]){
									temp=temp[dataMap[i]]
								}
								else{//找不到这个对象属性
									map=false
								}
							  };
							  if(map){
								 $(this).val(temp)
							  }
							}
						}
						else{
						}
                    });
					if(currentData.metadata&&currentData.metadata.mould_type){
						if(self.enterSecondPageType=="edit"){
							$("#announcement_post_list_template_style").find(".select-header").text(currentData.metadata.mould_type);
						}
						else{
							$("#announcement_post_list_template_style_readonly").val(currentData.metadata.mould_type);
						}
						self.templateType=currentData.metadata.mould_type
						var templateType=self.templateType;
						if(typeof modulePara != "undefined"){
							for(var i= 0,len = modulePara.length;i<len;i++){
								if(typeof modulePara[i].module!= "undefined"){
									if(modulePara[i].module==templateType){
										var detailsPageUrl=modulePara[i].detailsPageUrl||"";
										if((typeof currentData.url== "undefined")||(currentData.url=="")){
											$("#announcement_post_list_detail_url").val(detailsPageUrl);
										}
										else{
											$("#announcement_post_list_detail_url").val(currentData.url);
										}
										break
									}
								}
							}
						};
					}
					if(currentData.post_publish_time){
						if(self.enterSecondPageType=="edit"){
							var publishTime=self.timestampToStr(currentData.post_publish_time);
							$("#announcement_post_list_calendar").find(".datepicker-input").val(publishTime.substring(0,10));
							$("#announcement_post_list_hour_menu").find(".select-header").text(publishTime.substring(11,13));
							$("#announcement_post_list_select_minute").find(".select-header").text(publishTime.substring(14,16));
							$("#announcement_post_list_select_second").find(".select-header").text(publishTime.substring(17,19));
						}
						else if(self.enterSecondPageType=="view"){
							var publishTime=self.timestampToStr(currentData.post_publish_time);
							$("#announcement_post_list_calendar_view").text(publishTime.substring(0,10));
							$("#announcement_post_list_hour_menu_view").text(publishTime.substring(11,13));
							$("#announcement_post_list_select_minute_view").text(publishTime.substring(14,16));
							$("#announcement_post_list_select_second_view").text(publishTime.substring(17,19));
						}
						else{
						}
					};
					if ( (typeof currentData.post_publish_time== "undefined")||(currentData.post_publish_time=="") ){//默认给当前时间
						var date = new Date();
						var seperator1 = "-";
						var year = date.getFullYear();
						var month = date.getMonth() + 1;
						var hour = date.getHours();
						var minutes = date.getMinutes() ;
						var seconds = date.getSeconds();
						var strDate = date.getDate();
						
						if (month >= 1 && month <= 9) {
							month = "0" + month;
						};
						if (strDate >= 0 && strDate <= 9) {
							strDate = "0" + strDate;
						};
						var currentdate = year + seperator1 + month + seperator1 + strDate;
						if(self.enterSecondPageType=="edit"){
							$("#announcement_post_list_calendar").find(".datepicker-input").val(currentdate);
							$("#announcement_post_list_hour_menu").find(".select-header").text(hour);
							$("#announcement_post_list_select_minute").find(".select-header").text(minutes);
							$("#announcement_post_list_select_second").find(".select-header").text(seconds);
						}
                        else if(self.enterSecondPageType=="view"){
							$("#announcement_post_list_calendar_view").text("");
							$("#announcement_post_list_hour_menu_view").text("");
							$("#announcement_post_list_select_minute_view").text("");
							$("#announcement_post_list_select_second_view").text("");
						}
                        else{}						
					}
                }
            };
			//this.initRichText()
        },
		fillCurrentTemplate:function(){
		    var self=this;
		    //每次进入编辑页面，是没有富文本对象的。
            if (typeof self.richTextContainerIdList1!= "undefined"){			
				for(var i= 0,lenUEObjA = self.richTextContainerIdList1.length;i<lenUEObjA;i++){
					 UE.delEditor(self.richTextContainerIdList1[i]);//全删除。
				};
			};
			if (typeof self.richTextContainerIdList2!= "undefined"){
				for(var i= 0,lenUEObjB = self.richTextContainerIdList2.length;i<lenUEObjB;i++){
					 UE.delEditor(self.richTextContainerIdList2[i]);//全删除。
				};
			};
			if (typeof self.richTextContainerIdList4!= "undefined"){
				for(var i= 0,lenUEObjC = self.richTextContainerIdList4.length;i<lenUEObjC;i++){
					 UE.delEditor(self.richTextContainerIdList4[i]);//全删除。
				};
			};
		    this.richTextContainerIdList1=[];//保存自进入编辑以来所有的富文本对象的id
			this.richTextContainerIdList2=[];
			this.richTextContainerIdList4=[];//目前一共3个模板c
			this.secondPageUEObj1=[];
			this.secondPageUEObj2=[];
			this.secondPageUEObj4=[];
			this.finishedInitRichTextLen=1;
			$("#announcement_post_template_list_container").empty();
            var rawListData = this.rawListData;
            if (rawListData && rawListData.notice_list) {
                var notice_list = rawListData.notice_list;
                if (notice_list.length > 0) {
                    var currentData = notice_list[this.rowIndex];
					if(currentData.metadata&&currentData.metadata.mould_type){
						var mould_type=currentData.metadata.mould_type;
						switch(mould_type)
						{
						case 1:
						case "1":
						  this.drawAndFillTemplate1(currentData)
						  break;
						case 2:
						case "2":
						  this.drawAndFillTemplate2SwitchTime();
						  this.drawTemplate1(currentData);
						  break;
						case 4:
						case "4":
						  this.drawTemplate4(currentData);
						   break;
						default:
						  break;
						};
					}
					else{//没有metadata或mould_type时，默认template type1
						this.drawAndFillTemplate1(currentData)
					}
				}
			};
		},
		fillCurrentTemplateAdd:function(){
		    var currentData=this.currentData;
		    var self=this;
		    //每次进入编辑页面，是没有富文本对象的。
            if (typeof self.richTextContainerIdList1!= "undefined"){			
				for(var i= 0,lenUEObjA = self.richTextContainerIdList1.length;i<lenUEObjA;i++){
					 UE.delEditor(self.richTextContainerIdList1[i]);//全删除。
				};
			};
			if (typeof self.richTextContainerIdList2!= "undefined"){
				for(var i= 0,lenUEObjB = self.richTextContainerIdList2.length;i<lenUEObjB;i++){
					 UE.delEditor(self.richTextContainerIdList2[i]);//全删除。
				};
			};
			if (typeof self.richTextContainerIdList4!= "undefined"){
				for(var i= 0,lenUEObjC = self.richTextContainerIdList4.length;i<lenUEObjC;i++){
					 UE.delEditor(self.richTextContainerIdList4[i]);//全删除。
				};
			};
		    this.richTextContainerIdList1=[];//保存自进入编辑以来所有的富文本对象的id
			this.richTextContainerIdList2=[];
			this.richTextContainerIdList4=[];//目前一共3个模板
			this.secondPageUEObj1=[];
			this.secondPageUEObj2=[];
			this.secondPageUEObj4=[];
			this.finishedInitRichTextLen=1;
			$("#announcement_post_template_list_container").empty();
            //没有metadata或mould_type时，默认template type1
		    this.drawAndFillTemplate1(currentData)
		},
		drawAndFillTemplate1: function(currentData) {
			this.drawTemplate1(currentData)
		},
		initAllTemplateRichText: function(templateType) {
			switch(templateType)
			{
			case 1:
			case "1":
			  this.initRichTextOneByOne(this.richTextContainerIdList1);
			  break;
			case 2:
			case "2":
			  this.initRichTextOneByOne(this.richTextContainerIdList2);
			  break;
			case 4:
			case "4":
			  this.initRichTextOneByOne(this.richTextContainerIdList4);
			  break;
			default:
              break;
			}
		},
		initRichTextOneByOne:function(richTextContainerIdList){
		  try{
		    var self=this;
			if(self.preUEready){
				self.preUEready=false;
				if(this.finishedInitRichTextLen<richTextContainerIdList.length+1){//finishedInitRichTextLen从1开始，表示第一个。
					var id=richTextContainerIdList[this.finishedInitRichTextLen-1];//从零开始;
					var editor = UE.getEditor(id, {//先画富文本外框
						toolbars: [['cleardoc', 'selectall', 'undo', 'redo']],
						elementPathEnabled: false,
						initialFrameHeight: 187,
						initialFrameWidth: "100%",
						wordCount: false,
						autoHeight: false
					});
					editor.ready(function() {
						if(self.enterSecondPageType=="view"){
							editor.setDisabled();
							try{
								containerId=((editor.container&&editor.container.id)?editor.container.id:"");
								$("#announcement_post_list_container").find("#"+containerId+"").css("background-color","#ebebeb");
							}catch(e){
								
							};
						};
						self.preUEready=true;
						switch(self.templateType)
						{
						case 1:
						case "1":
							self.secondPageUEObj1.push(editor);
							break;
						case 2:
						case "2":
							self.secondPageUEObj2.push(editor);
							break;
						case 4:
						case "4":
							self.secondPageUEObj4.push(editor);
							break;
						default:
							break;
						}
						if(self.enterSecondPageType=="add"){}
						else{
							var rawListData = self.rawListData;
							if (rawListData && rawListData.notice_list) {
								var notice_list = rawListData.notice_list;
								if (notice_list.length > 0) {
									var currentData = notice_list[self.rowIndex];//当前资讯数据
									if(currentData.metadata&&currentData.metadata.mould_content_img_text){
										var currentMouldContentImgText=currentData.metadata.mould_content_img_text;
										if(currentMouldContentImgText.length!=0){
											var currentContentImgText=currentMouldContentImgText[self.finishedInitRichTextLen-1];//从零开始
											if(currentContentImgText&&currentContentImgText.text){//一组里面有1个pic和1个text
												var text=currentContentImgText.text;
												editor.setContent(text)
											}
										}
									}
								}
							}
						};
						if(self.finishedInitRichTextLen==richTextContainerIdList.length){//最后一个富文本已加载
							$("#announcement_post_template_list_container").on("click", ".announcement_post_list_add", function(){
								if(self.templateType!=4){
									self.addRichTextOneByOne()
								}
								else{
									self.addRichTextOneByOneTemplateFour()
								}
							});
							$("#announcement_post_template_list_container").on("click", ".announcement_post_list_del", function(){
								if(self.templateType!=4){
									var delIndex = $("#announcement_post_template_list_container").find(".announcement_post_list_row_pic").index($(this).parent());
									$("#announcement_post_template_list_container").find(".announcement_post_list_row_pic").eq(delIndex).hide();
									$("#announcement_post_template_list_container").find(".announcement_post_list_row_text").eq(delIndex).hide()
								}
								else{
									var delIndex = $("#announcement_post_template_list_container").find(".announcement_post_list_row_pic").index($(this).parent());
									$("#announcement_post_template_list_container").find(".announcement_post_list_row_pic").eq(delIndex).hide();
									$(this).parent().next().hide();
									$("#announcement_post_template_list_container").find(".announcement_post_list_row_text").eq(delIndex).hide()
								}
							})
						}
						self.finishedInitRichTextLen=self.finishedInitRichTextLen+1;
						self.initRichTextOneByOne(richTextContainerIdList);
					})
				}
				else{
					self.preUEready=true;
				}
			};
		  }catch(e){
			
		  }
		},
		initRichTextOne:function(index,id){
		  try{
		    var templateType=this.templateType;
			var richTextContainerIdList=[];
			var secondPageUEObj=[];
		    var self=this;
			if(self.preUEready){
				self.preUEready=false;
				var newId= id;
				var editor = UE.getEditor(newId, {//先画富文本外框
					toolbars: [['cleardoc', 'selectall', 'undo', 'redo']],
					elementPathEnabled: false,
					initialFrameHeight: 187,
					initialFrameWidth: "100%",
					wordCount: false,
					autoHeight: false
				});
				editor.ready(function() {
					self.preUEready=true;
					switch(self.templateType)
					{
						case 1:
						case "1":
							self.richTextContainerIdList1.push(newId);
							self.secondPageUEObj1.push(editor);
							break;
						case 2:
						case "2":
							self.richTextContainerIdList2.push(newId);
							self.secondPageUEObj2.push(editor);
							break;
						case 4:
						case "4":
							self.richTextContainerIdList4.push(newId);
							self.secondPageUEObj4.push(editor);
							break;
						default:
							break;
					};
				})
			};
		  }catch(e){	
		  }
		},
		addRichTextOneByOneTemplateFour:function(){
			if(this.preUEready){
				var templateType=this.templateType;
				var len= $("#announcement_post_list_container").find(".announcement_post_list_rich_text_template"+templateType+"").length;//以富文本容器数量，判断有多少组图片文字对。
				var newId= "announcement_post_list_rich_text"+len+"template"+templateType+"";
				this.drawOnePicRow(len);
				var folder = this.postImagePath;
				this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon"+len+"template"+templateType+"", $("#announcement_post_list_template_upload_file_input"+len+"template"+templateType+""), folder);
				
				
				$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_pic_position_select announcement_post_list_row announcement_post_list_element_template"+templateType+"\" style=\"overflow:visible\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_POSITION')+"</div><div id=\"announcement_post_list_pic_position"+len+"template"+templateType+"\" class=\"announcement_post_list_down_select announcement_post_list_down_select_style_a\" style=\"width:165px\"></div></div>");
				var picPositionArray = [{
					key: i18n("POST_LIST_LEFT"),
					value: i18n("POST_LIST_LEFT")
				},
				{
					key: i18n("POST_LIST_RIGHT"),
					value: i18n("POST_LIST_RIGHT")
				},
				{
					key: i18n("POST_LIST_CENTER"),
					value: i18n("POST_LIST_CENTER")
				}];
				var picPositionSelect = new newSelect("#announcement_post_list_pic_position"+len+"template"+templateType+"", picPositionArray, {
					width: 165,
					height: 30,
					background: "#FFFFFF",
					selectbackground: "#FFFFFF",
					ScrollBarHeight: "150px"
				}, function(value){
				});
				picPositionSelect.setValue(i18n("POST_LIST_LEFT"));
				
				var id=this.drawOneTextRow(len);
				this.initRichTextOne(len,id)
			}
		},
		addRichTextOneByOne:function(){
			if(this.preUEready){
				var templateType=this.templateType;
				var len= $("#announcement_post_list_container").find(".announcement_post_list_rich_text_template"+templateType+"").length;//以富文本容器数量，判断有多少组图片文字对。
				var newId= "announcement_post_list_rich_text"+len+"template"+templateType+"";
				this.drawOnePicRow(len);
				var folder = this.postImagePath;
				this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon"+len+"template"+templateType+"", $("#announcement_post_list_template_upload_file_input"+len+"template"+templateType+""), folder);
				var id=this.drawOneTextRow(len);
				this.initRichTextOne(len,id)
			}
		},
		commonPushId:function(id){
			switch(this.templateType)
			{
				case 1:
				case "1":
					this.richTextContainerIdList1.push(id)
					break;
				case 2:
				case "2":
					this.richTextContainerIdList2.push(id)
					break;
				case 4:
				case "4":
					this.richTextContainerIdList4.push(id)
					break;
				default:
					break;
			};
		},
		drawTemplate1: function(currentData) {//各模板通用功能。
		    var self=this;
			var templateType=this.templateType;
			if(currentData.metadata){
				if(currentData.metadata.mould_content_img_text){
					var currentMouldContentImgText=currentData.metadata.mould_content_img_text;
					self.currentMouldContentImgTextFromServer=currentMouldContentImgText;
					this.currentMouldContentImgText=currentMouldContentImgText;
					if(currentMouldContentImgText.length!=0){
						for(var i= 0,len = currentMouldContentImgText.length;i<len;i++){
							this.drawOnePicRow(i);
							if(currentMouldContentImgText[i].pic){
								this.fillOnePicRow(i,currentMouldContentImgText[i].pic)
							};
							var folder = this.postImagePath;
							this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon"+i+"template"+templateType+"", $("#announcement_post_list_template_upload_file_input"+i+"template"+templateType+""), folder);
							var id=this.drawOneTextRow(i);
							this.commonPushId(id)
						};
					}
					else{//mould_content_img_text为空数组
						this.drawOnePicRow(0);
						var folder =this.postImagePath;
						this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon0template"+templateType+"", $("#announcement_post_list_template_upload_file_input0template"+templateType+""), folder);
						var id=this.drawOneTextRow(0);
						this.commonPushId(id)
					}
				}
				else{//没有mould_content_img_text字段
					this.drawOnePicRow(0);
					var folder = this.postImagePath; 
					this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon0template"+templateType+"", $("#announcement_post_list_template_upload_file_input0template"+templateType+""), folder);
					var id=this.drawOneTextRow(0);
					this.commonPushId(id)
				}
			}
			else{//没有metadata,默认template type 1
				this.drawOnePicRow(0);
				var folder = this.postImagePath;
				this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon0template"+templateType+"", $("#announcement_post_list_template_upload_file_input0template"+templateType+""), folder);
				var id=this.drawOneTextRow(0);
				this.commonPushId(id)
			}
			this.initAllTemplateRichText(templateType);
		},
		drawTemplate4: function(currentData) {//各模板通用功能。
		    var self=this;
			var templateType=this.templateType;
			if(currentData.metadata){
				if(currentData.metadata.mould_content_img_text){
					var currentMouldContentImgText=currentData.metadata.mould_content_img_text;
					self.currentMouldContentImgTextFromServer=currentMouldContentImgText;
					this.currentMouldContentImgText=currentMouldContentImgText;
					if(currentMouldContentImgText.length!=0){
						for(var i= 0,len = currentMouldContentImgText.length;i<len;i++){
							this.drawOnePicRow(i);
							if(currentMouldContentImgText[i].pic){
								this.fillOnePicRow(i,currentMouldContentImgText[i].pic)
							};
							var folder = this.postImagePath;		
							this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon"+i+"template"+templateType+"", $("#announcement_post_list_template_upload_file_input"+i+"template"+templateType+""), folder);
							var position=currentMouldContentImgText[i].position||"";
							var positionText="";
							switch(position)
							{
								case "left-top":
									positionText=i18n("POST_LIST_LEFT");
									break;
								case "right-top":
									positionText=i18n("POST_LIST_RIGHT");
									break;
								case "center-top":
									positionText=i18n("POST_LIST_CENTER");
									break;
								default:
									positionText="";
									break;
							};
							if(self.enterSecondPageType=="edit"){
								$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_pic_position_select announcement_post_list_row announcement_post_list_element_template"+templateType+"\" style=\"overflow:visible\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_POSITION')+"</div><div id=\"announcement_post_list_pic_position"+i+"template"+templateType+"\" class=\"announcement_post_list_down_select announcement_post_list_down_select_style_a\" style=\"width:165px\"></div></div>");
								var picPositionArray = [{
									key: i18n("POST_LIST_LEFT"),
									value: i18n("POST_LIST_LEFT")
								},
								{
									key: i18n("POST_LIST_RIGHT"),
									value: i18n("POST_LIST_RIGHT")
								},
								{
									key: i18n("POST_LIST_CENTER"),
									value: i18n("POST_LIST_CENTER")
								}];
								var picPositionSelect = new newSelect("#announcement_post_list_pic_position"+i+"template"+templateType+"", picPositionArray, {
									width: 165,
									height: 30,
									background: "#FFFFFF",
									selectbackground: "#FFFFFF",
									ScrollBarHeight: "150px"
								}, function(value){
								});
								picPositionSelect.setValue(positionText);
							}
							else{
								$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_pic_position_select announcement_post_list_row announcement_post_list_element_template"+templateType+"\" style=\"overflow:visible\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_POSITION')+"</div><input class=\"announcement_post_list_row_input announcement_post_list_readonly\"  value=\""+positionText+"\" style=\"width:165px\"></div>");
							}
							var id=this.drawOneTextRow(i);
							this.commonPushId(id)
						};
					}
					else{//mould_content_img_text为空数组
						this.drawOnePicRow(0);
						var folder = this.postImagePath; 
						this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon0template"+templateType+"", $("#announcement_post_list_template_upload_file_input0template"+templateType+""), folder);
						
						$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_pic_position_select announcement_post_list_row announcement_post_list_element_template"+templateType+"\" style=\"overflow:visible\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_POSITION')+"</div><div id=\"announcement_post_list_pic_position0template"+templateType+"\" class=\"announcement_post_list_down_select announcement_post_list_down_select_style_a\" style=\"width:165px\"></div></div>");
							var picPositionArray = [{
								key: i18n("POST_LIST_LEFT"),
								value: i18n("POST_LIST_LEFT")
							},
							{
								key: i18n("POST_LIST_RIGHT"),
								value: i18n("POST_LIST_RIGHT")
							},
							{
								key: i18n("POST_LIST_CENTER"),
								value: i18n("POST_LIST_CENTER")
							}];
							var picPositionSelect = new newSelect("#announcement_post_list_pic_position0template"+templateType+"", picPositionArray, {
								width: 165,
								height: 30,
								background: "#FFFFFF",
								selectbackground: "#FFFFFF",
								ScrollBarHeight: "150px"
							}, function(value){
							});
						
						var id=this.drawOneTextRow(0);
						this.commonPushId(id)
					}
				}
				else{//没有mould_content_img_text字段
					this.drawOnePicRow(0);
					var folder = this.postImagePath;
					this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon0template"+templateType+"", $("#announcement_post_list_template_upload_file_input0template"+templateType+""), folder);
					
					$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_pic_position_select announcement_post_list_row announcement_post_list_element_template"+templateType+"\" style=\"overflow:visible\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_POSITION')+"</div><div id=\"announcement_post_list_pic_position0template"+templateType+"\" class=\"announcement_post_list_down_select announcement_post_list_down_select_style_a\" style=\"width:165px\"></div></div>");
					var picPositionArray = [{
						key: i18n("POST_LIST_LEFT"),
						value: i18n("POST_LIST_LEFT")
					},
					{
						key: i18n("POST_LIST_RIGHT"),
						value: i18n("POST_LIST_RIGHT")
					},
					{
						key: i18n("POST_LIST_CENTER"),
						value: i18n("POST_LIST_CENTER")
					}];
					var picPositionSelect = new newSelect("#announcement_post_list_pic_position0template"+templateType+"", picPositionArray, {
						width: 165,
						height: 30,
						background: "#FFFFFF",
						selectbackground: "#FFFFFF",
						ScrollBarHeight: "150px"
					}, function(value){
					});
					
					var id=this.drawOneTextRow(0);
					this.commonPushId(id)
				}
			}
			else{//没有metadata,默认template type 1
				this.drawOnePicRow(0);
				var folder = this.postImagePath;
				this.bindUploadEventsPage("#announcement_post_list_template_upload_file_icon0template"+templateType+"", $("#announcement_post_list_template_upload_file_input0template"+templateType+""), folder);
				
				$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_pic_position_select announcement_post_list_row announcement_post_list_element_template"+templateType+"\" style=\"overflow:visible\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_POSITION')+"</div><div id=\"announcement_post_list_pic_position0template"+templateType+"\" class=\"announcement_post_list_down_select announcement_post_list_down_select_style_a\" style=\"width:165px\"></div></div>");
				var picPositionArray = [{
					key: i18n("POST_LIST_LEFT"),
					value: i18n("POST_LIST_LEFT")
				},
				{
					key: i18n("POST_LIST_RIGHT"),
					value: i18n("POST_LIST_RIGHT")
				},
				{
					key: i18n("POST_LIST_CENTER"),
					value: i18n("POST_LIST_CENTER")
				}];
				var picPositionSelect = new newSelect("#announcement_post_list_pic_position0template"+templateType+"", picPositionArray, {
					width: 165,
					height: 30,
					background: "#FFFFFF",
					selectbackground: "#FFFFFF",
					ScrollBarHeight: "150px"
				}, function(value){
				});
				
				var id=this.drawOneTextRow(0);
				this.commonPushId(id)
			}
			this.initAllTemplateRichText(templateType);
		},
		
		drawAndFillTemplate2SwitchTime:function(){
		    var templateType=this.templateType;	
		    var mouldContentPeriod="";
			if(this.enterSecondPageType=="add"){}
			else{
				var rawListData = this.rawListData;
				if (rawListData && rawListData.notice_list) {
					var notice_list = rawListData.notice_list;
					if (notice_list.length > 0) {
						var currentData = notice_list[this.rowIndex];
						if(currentData.metadata){
							if(currentData.metadata.mould_content_period){
								mouldContentPeriod=currentData.metadata.mould_content_period;
							}
						}
					}
				}
			};
			var html="<div class=\"announcement_post_list_row announcement_post_list_element_template"+templateType+"\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_SWITCH_TIME')+"</div><input id=\"announcement_post_list_mould_content_period\" class=\"announcement_post_list_row_input\" style=\"width:165px\"/><div style=\"width:auto;margin-left:14px\" class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_MILLSECOND')+"</div></div>";
			$("#announcement_post_template_list_container_outer").append(html);
			$("#announcement_post_list_mould_content_period").val(mouldContentPeriod);
			if(this.enterSecondPageType=="view"){
				$("#announcement_post_list_mould_content_period").attr("readonly","readonly").css("background-color","#ebebeb")
			}
			else{
				$("#announcement_post_list_mould_content_period").removeClass("announcement_post_list_readonly");
				$("#announcement_post_list_mould_content_period").removeAttr("readonly").css("background-color","#ffffff");
			}
		},
		
		drawOnePicRow:function(index){//metadata下画1行图片控件。图片控件中id有两个变量：返回数据中的index和模板样式名。
            var templateType=this.templateType;		
			var display="";
			if(this.enterSecondPageType=="view"){
				display="display:none";
			};
			$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_row announcement_post_list_row_pic announcement_post_list_element_template"+templateType+"\" style=\"width:100%\"><div class=\"announcement_post_list_row_lable\">"+i18n('POST_LIST_PIC')+"</div><div class=\"announcement_post_list_row_input\" style=\"width:calc(100% - 253px);padding-left:0;background-color:#ebebeb\"><input id=\"announcement_post_list_template_upload_file_input"+index+"template"+templateType+"\" class=\"announcement_post_list_row_input\" readonly=\"readonly\" style=\"background-color:#ebebeb;width:calc(100% - 31px);border:0;color:#3693d0\"><img id=\"announcement_post_list_template_upload_file_icon"+index+"template"+templateType+"\" class=\"announcement_post_upload_file_icon\" src=\"content/CMS/images/upload_img.png\" style=\""+display+"\"></div><img class=\"announcement_post_list_add\" src=\"content/post_list/images/add.png\" style=\""+display+"\"/><img class=\"announcement_post_list_del\" src=\"content/post_list/images/del.png\" style=\""+display+"\"/></div>");	
		},
		fillOnePicRow:function(index,pic){
			var templateType=this.templateType;	
			$("#announcement_post_list_template_upload_file_input"+index+"template"+templateType+"").val(pic)
		},
		drawOneTextRow:function(index){
		    var templateType=this.templateType;
			var bgcolor="";
			if(this.enterSecondPageType=="view"){
				bgcolor="background-color:#ebebeb";
			};
			var id="announcement_post_list_rich_text"+index+"template"+templateType+""+new Date().getTime();
			$("#announcement_post_template_list_container").append("<div class=\"announcement_post_list_row announcement_post_list_row_text announcement_post_list_element_template"+templateType+"\" style=\"height:auto\"><div class=\"announcement_post_list_row_lable\" style=\"vertical-align:top;height:32px\">"+i18n('POST_LIST_TEXT')+"</div><div id=\""+id+"\" class=\"announcement_post_list_row_input announcement_post_list_rich_text announcement_post_list_rich_text_template"+templateType+"\" style=\""+bgcolor+"\"></div></div>");
			return id
		},
		bindUploadEventsPage: function(button1, inputContainer, folder) {
			function deepCopy(o1, o2){
				// 取出第一个对象的每一个属性
				for(var key in o1){
					// 取出第一个对象当前属性对应的值
					var item = o1[key]; // dog
					// 判断当前的值是否是引用类型
					// 如果是引用类型, 我们就重新开辟一块存储空间
					if(item instanceof Object){
					   if(typeof item!="function"){
							var temp = new Object();
							/*{name: "wc",age: "3"}*/
						   deepCopy(item, temp);   //递归
							o2[key] = temp;
					    }
						else{
						   o2[key] = o1[key];
						}
					}else{
						// 基本数据类型
						o2[key] = o1[key];
					}
				}
			};
	        var self=this;
			var upload={};
			deepCopy(self.upload,upload);
            var storage_images_folder = folder + "/";
            upload.init({
                selectFileBottom: button1,
                uploadPath: storage_images_folder,
                checkExist_Boolean: true
            },
            {
                _startfun: function(file_name, updateSize, fileSize, self) {
                    //单个文件上传开始的回调函数
                    var console_message = file_name + "start";
                },
                _progressfun: function(file_name, updateSize, fileSize, self) {
                    //单个文件上传过程的回调函数
                    var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
                },
                _errorfun: function(e) {
                    //单个文件上传失败的回调函数
                },
                _endfun: function(file_name, updateSize, fileSize, file_url, self) {
                    //单个文件上传结束的回调函数
                    var console_message = file_name + " end. The url = " + file_url;
                },
            },
            {
                _beforeAllStartFun: function(files, next) {
                    //点击selectFileBottom，选择文件后，回调该函数
                    this.startuploadFile(); 
					var i = 0;
                    for (i = 0; i < files.files.length; i++) {
                        var name = files.files[i].name;
                    };
                    next();
                },
                _allStartFun: function(next) {
                    next();
                },
                _checkAllExistFun: function(existArray, next) {
                    //如果checkExist_Boolean为true，正式上传前发现有已存在的文件，则回调该函数
                    var file_name = existArray.join(",");
                    var console_message = file_name + "已存在";
                    var ret = confirm(i18n('CMS_UPLOAD_HINT')); 
					if (ret) {
                        next()
                    } else {
                        self.countImgUploadNum();
                    }
                },
                _afterAllEndFun: function(result) {
                    if (result.data) {
                        $(inputContainer).val(decodeURI(result.data[0].file_url));
                    }
                }
            });
        },
		initSecondPageComponent:function(){
			var self = this;
			var jq=jQuery;
			if(self.enterSecondPageType=="edit"||self.enterSecondPageType=="add"){//编辑的控件
				if(!this.hasInitSecondPageComponentForEdit){
					this.hasInitSecondPageComponentForEdit=true;
					var calendarStyles = {
						width: 200,
						navTitleHeight: 20,
						navTitleBgColor: '#0f84a1',
						datesViewHeight: 150,
						datesViewGridColor: '#e2e2e2',
						datesViewCellColor: '#ffffff',
						weekdaysHeight: 20,
						weekdaysColor: '#000000',
						currMonthColor: '#737373',
						nonCurrMonthColor: '#e2e2e2'
					};
					var leftPublishTimeCalendar = new DatePicker({
						containerId: "announcement_post_list_calendar",
						calendarStyles: calendarStyles,
						dateInputStyles: {
							borderColor: '#c6c5c3'
						},
						iconImage: 'images/smallCalendarIcon.png'
					});
					var hourArray = [{
						key: "00",
						value: "00"
					},
					{
						key: "01",
						value: "01"
					},
					{
						key: "02",
						value: "02"
					},
					{
						key: "03",
						value: "03"
					},
					{
						key: "04",
						value: "04"
					},
					{
						key: "05",
						value: "05"
					},
					{
						key: "06",
						value: "06"
					},
					{
						key: "07",
						value: "07"
					},
					{
						key: "08",
						value: "08"
					},
					{
						key: "09",
						value: "09"
					},
					{
						key: "10",
						value: "10"
					},
					{
						key: "11",
						value: "11"
					},
					{
						key: "12",
						value: "12"
					},
					{
						key: "13",
						value: "13"
					},
					{
						key: "14",
						value: "14"
					},
					{
						key: "15",
						value: "15"
					},
					{
						key: "16",
						value: "16"
					},
					{
						key: "17",
						value: "17"
					},
					{
						key: "18",
						value: "18"
					},
					{
						key: "19",
						value: "19"
					},
					{
						key: "20",
						value: "20"
					},
					{
						key: "21",
						value: "21"
					},
					{
						key: "22",
						value: "22"
					},
					{
						key: "23",
						value: "23"
					}];
					var validTimeHourBox = new newSelect("#announcement_post_list_hour_menu", hourArray, {
						width: 66,
						height: 30,
						background: "#FFFFFF",
						selectbackground: "#FFFFFF",
						ScrollBarHeight: "150px"
					});
					validTimeHourBox.setValue("00");
					var minuteSecondArray = [{
						key: "00",
						value: "00"
					},
					{
						key: "01",
						value: "01"
					},
					{
						key: "02",
						value: "02"
					},
					{
						key: "03",
						value: "03"
					},
					{
						key: "04",
						value: "04"
					},
					{
						key: "05",
						value: "05"
					},
					{
						key: "06",
						value: "06"
					},
					{
						key: "07",
						value: "07"
					},
					{
						key: "08",
						value: "08"
					},
					{
						key: "09",
						value: "09"
					},
					{
						key: "10",
						value: "10"
					},
					{
						key: "11",
						value: "11"
					},
					{
						key: "12",
						value: "12"
					},
					{
						key: "13",
						value: "13"
					},
					{
						key: "14",
						value: "14"
					},
					{
						key: "15",
						value: "15"
					},
					{
						key: "16",
						value: "16"
					},
					{
						key: "17",
						value: "17"
					},
					{
						key: "18",
						value: "18"
					},
					{
						key: "19",
						value: "19"
					},
					{
						key: "20",
						value: "20"
					},
					{
						key: "21",
						value: "21"
					},
					{
						key: "22",
						value: "22"
					},
					{
						key: "23",
						value: "23"
					},
					{
						key: "24",
						value: "24"
					},
					{
						key: "25",
						value: "25"
					},
					{
						key: "26",
						value: "26"
					},
					{
						key: "27",
						value: "27"
					},
					{
						key: "28",
						value: "28"
					},
					{
						key: "29",
						value: "29"
					},
					{
						key: "30",
						value: "30"
					},
					{
						key: "31",
						value: "31"
					},
					{
						key: "32",
						value: "32"
					},
					{
						key: "33",
						value: "33"
					},
					{
						key: "34",
						value: "34"
					},
					{
						key: "35",
						value: "35"
					},
					{
						key: "36",
						value: "36"
					},
					{
						key: "37",
						value: "37"
					},
					{
						key: "38",
						value: "38"
					},
					{
						key: "39",
						value: "39"
					},
					{
						key: "40",
						value: "40"
					},
					{
						key: "41",
						value: "41"
					},
					{
						key: "42",
						value: "42"
					},
					{
						key: "43",
						value: "43"
					},
					{
						key: "44",
						value: "44"
					},
					{
						key: "45",
						value: "45"
					},
					{
						key: "46",
						value: "46"
					},
					{
						key: "47",
						value: "47"
					},
					{
						key: "48",
						value: "48"
					},
					{
						key: "49",
						value: "49"
					},
					{
						key: "50",
						value: "50"
					},
					{
						key: "51",
						value: "51"
					},
					{
						key: "52",
						value: "52"
					},
					{
						key: "53",
						value: "53"
					},
					{
						key: "54",
						value: "54"
					},
					{
						key: "55",
						value: "55"
					},
					{
						key: "56",
						value: "56"
					},
					{
						key: "57",
						value: "57"
					},
					{
						key: "58",
						value: "58"
					},
					{
						key: "59",
						value: "59"
					}];
					var durationStartTimeMinuteBox = new newSelect("#announcement_post_list_select_minute", minuteSecondArray, {
						width: 66,
						height: 30,
						background: "#FFFFFF",
						selectbackground: "#FFFFFF",
						ScrollBarHeight: "150px"
					});
					durationStartTimeMinuteBox.setValue("00");
					var durationStartTimeSecondBox = new newSelect("#announcement_post_list_select_second", minuteSecondArray, {
						width: 66,
						height: 30,
						background: "#FFFFFF",
						selectbackground: "#FFFFFF",
						ScrollBarHeight: "150px"
					});
					durationStartTimeSecondBox.setValue("00");
					var templateArray = [{
						key: "1",
						value: "1"
					},
					{
						key: "2",
						value: "2"
					},
					{
						key: "4",
						value: "4"
					}];
				var templateStyle = new newSelect("#announcement_post_list_template_style", templateArray, {
					width: 165,
					height: 30,
					background: "#FFFFFF",
					selectbackground: "#FFFFFF",
					ScrollBarHeight: "150px"
				}, function(value){
				   if(self.preUEready){
					   var templateType=self.templateType;
					   if(typeof modulePara != "undefined"){
							for(var i= 0,len = modulePara.length;i<len;i++){
								if(typeof modulePara[i].module!= "undefined"){
									if(modulePara[i].module==value){
										var detailsPageUrl=modulePara[i].detailsPageUrl||"";
										$("#announcement_post_list_detail_url").val(detailsPageUrl);
										break
									}
								}
							}
						};
					   if(templateType!=value){
							//隐藏之前templatetype下的元素。
							$("#announcement_post_template_list_container_outer").find(".announcement_post_list_element_template"+templateType+"").each(function() {
								$(this).hide()
							});
							templateType=value;
							self.templateType=value;
							//判断有没有初始化过
							$("#announcement_post_list_mould_content_period").parent().remove();
							if(templateType==2){
								if(document.getElementById("announcement_post_list_mould_content_period")==null){
									self.drawAndFillTemplate2SwitchTime();
								};
							};
							$("#announcement_post_list_mould_content_period").show();
							if($("#announcement_post_template_list_container").find(".announcement_post_list_element_template"+templateType+"").length==0){
								switch(templateType)
								{
								case 1:
								case "1":
								  self.addRichTextOneByOne();
								  break;
								case 2:
								case "2":
								  self.addRichTextOneByOne()
								  break;
								case 4:
								case "4":
								  self.addRichTextOneByOneTemplateFour();
								  break;
								default:
								  break;
								};
							}
							else{
								$("#announcement_post_template_list_container_outer").find(".announcement_post_list_element_template"+templateType+"").each(function() {
									$(this).show()
								});
							}	
                         }							
					   }
					});
				templateStyle.setValue("1");
				var folder = this.postImagePath;
				self.bindUploadEventsPage("#announcement_post_list_upload_file_icon", $("#announcement_post_list_upload_file_input"), folder);
			  };
			}
			else{
			
			  if(!this.hasInitSecondPageComponent){//第2页上半部分组件没初始化过
				//self.initSecondPageComponentSwitch=true;
				this.hasInitSecondPageComponent=true;
				}
			}
		},
		handleDropdowns: function(target, delegate){
			var self = this;
			if($(target).parents('.opr-more').length > 0){

			} else {
			  $('.opr-more').removeClass('opr-more-open');
			}							
		},
        bindSecondPage:function(type){
            var self = this;
			var jq=jQuery;
			var templateType=this.templateType;
			switch(type)
			{
			case "view":
			   jq("#announcement_post_list_edit_back").unbind().bind('click', function () {
					if(self.preUEready){//没加载完前，不能离开页面。
						self.showFirstPage();
						self.hideSecondPage();
					}
			  })
			break;
			case "edit":
			case "add":
			  jq("#announcement_post_list_edit_confirm,#announcement_post_list_create_confirm").unbind().bind('click', function () {//提交更新按钮
				  var templateType=self.templateType;
				  if(self.preUEready){//没加载完前，不能离开页面。
					var secondPageUEObj=[];
					var richTextContainerIdList=[];//保存自进入编辑以来所有的富文本对象的id
					switch(self.templateType)
					{
						case 1:
						case "1":
							secondPageUEObj=self.secondPageUEObj1;
							richTextContainerIdList=self.richTextContainerIdList1;//保存自进入编辑以来所有的富文本对象的id
							break;
						case 2:
						case "2":
							secondPageUEObj=self.secondPageUEObj2;
							richTextContainerIdList=self.richTextContainerIdList2;//保存自进入编辑以来所有的富文本对象的id
							break;
						case 4:
						case "4":
							secondPageUEObj=self.secondPageUEObj4;
							richTextContainerIdList=self.richTextContainerIdList4;//保存自进入编辑以来所有的富文本对象的id
							break;
						default:
							break;
					};
					if(self.enterSecondPageType=="add"){
					    var checkResult="success";
						var text="";
						/*
					    if($("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row_unit_b").eq(0).find("input").val()==""){
							text+=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row_unit_b").eq(0).find(".announcement_post_list_row_lable").text());
							checkResult="fail";
						}
						*/
						if($("#announcement_post_information_title").val()==""){
							text+=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row").eq(1).find(".announcement_post_list_row_lable").text());
							checkResult="fail";
						}
						
						else if($("#announcement_post_list_details_title").val()==""){
							text+=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_details_title").parent().find(".announcement_post_list_row_lable").text());
							checkResult="fail";
						}
						
						else if($("#announcement_post_list_upload_file_input").val()==""){
							text+=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_upload_file_input").parent().parent().text());
							checkResult="fail";
						}
						else if($("#announcement_post_list_detail_url").val()==""){
							text+=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_detail_url").parent().text());
							checkResult="fail";
						}
						else{
						};
						if(checkResult=="fail"){
							self.showMsgDialog(text, function() {			
							},function(){
								$("#sysUser_user-admin-msg-cancel").hide();
								$("#sysUser_user-admin-msg-content").css("margin-top","10px");
							});
							return;
						};
						
						var dataBody={};
						dataBody.metadata={};
						dataBody.metadata.mould_content_img_text=[];
						dataBody.topic={};
						var currentData = self.currentData;
			            var topicExtId=$("#announcement_post_list_post_title").text().replace(("-"+i18n("POST_LIST_POST_LIST")),"");
						dataBody.topic["topic_ext_id"]=topicExtId;
						for(var i= 0,len = secondPageUEObj.length;i<len;i++){
							//隐藏的是被删除的，不要提交。
							var needSubmit=false;
							if(richTextContainerIdList[i]){
								if(document.getElementById(richTextContainerIdList[i])!=null){
									var richTextId=richTextContainerIdList[i];
									if($("#"+richTextId+"").closest(".announcement_post_list_element_template"+templateType+"").css("display")!="none"){//没隐藏代表没被删除
										needSubmit=true
									}
								}
							};
							if(needSubmit){
								var obj={
									"pic":$("#announcement_post_list_template_upload_file_input"+i+"template"+templateType+"").val(),
									"text":secondPageUEObj[i].getContent()
								};
								if(templateType==4){
									obj.position="";
									var position=jq("#announcement_post_list_pic_position"+i+"template"+templateType+"").find(".select-header").text();

									switch(position)
									{
										case i18n("POST_LIST_LEFT"):
											obj.position="left-top";
											break;
										case i18n("POST_LIST_RIGHT"):
											obj.position="right-top";
											break;
										case i18n("POST_LIST_CENTER"):
										case "4":
											obj.position="center-top";
											break;
										default:
											break;
									};
								}
								dataBody.metadata.mould_content_img_text.push(obj)
							}
						};
						$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
							if (typeof $(this).attr("data-key") != "undefined"&&($(this).attr("data-key")!="")) {
								switch($(this).attr("data-key"))
								{
								case "id":
								  break;
								case "url":
								  break;
								case "create_time":
								  break;
								default:
								  dataBody[$(this).attr("data-key")]=$(this).val();
								  break;
								}
							}
							else if (typeof $(this).attr("data-metadata") != "undefined") {
								dataBody.metadata[$(this).attr("data-metadata")]=$(this).val()
							}//请注意，data-map在存的时候，由于时间关系，没过滤。
							else{
							}
						});	
						var moduleType=jq("#announcement_post_list_template_style").find(".select-header").text();
						dataBody.metadata["mould_type"]=moduleType;
						if(templateType==2){
							dataBody.metadata["mould_content_period"]=$("#announcement_post_list_mould_content_period").val();
						};
						var imagesUrl="";
						dataBody["images_url"]={};
						dataBody["images_url"]["url"]=$("#announcement_post_list_upload_file_input").val();
						dataBody["images_url"]["size"]="";
						dataBody["images_url"]["ratio"]="";
						
						
						dataBody.metadata["thumbnail"]=$("#announcement_post_list_upload_file_input").val();
						/*
						dataBody["images_url"]["size"]="";
						dataBody["images_url"]["ratio"]="";
						*/
						//var result = year + '-' + format(month) + '-' + format(day) + "T" + format(hour) + ":" + format(minute) + ":" + format(seconds) + "+0800";
						var date=$("#announcement_post_list_calendar-datepicker-input").val();
						var result="";
						if(date!=""&&($("#announcement_post_list_hour_menu").find(".select-header").text()!="")&&($("#announcement_post_list_select_minute").find(".select-header").text()!="")&&( $("#announcement_post_list_select_second").find(".select-header").text()!="")){
							result+=(date+ "T" + $("#announcement_post_list_hour_menu").find(".select-header").text() + ":" + $("#announcement_post_list_select_minute").find(".select-header").text() + ":" + $("#announcement_post_list_select_second").find(".select-header").text() + "+0800");
						};
						
						dataBody["post_publish_time"]=result;
						var tagsFilled=self.checkTagsFilled("post");
						if(!tagsFilled){
							var text=i18n("POST_LIST_CONFRIM");
							self.showMsgDialog(text, function() {
								
							},function(){
								$("#sysUser_user-admin-msg-cancel").hide();
								$("#sysUser_user-admin-msg-content").css("margin-top","10px");
							});
								return;
						};
						var tagsFilled=self.checkTagsFilledB("post");
						if(!tagsFilled){
							var text=i18n("POST_LIST_CONFRIM2");
							self.showMsgDialog(text, function() {
								
							},function(){
								$("#sysUser_user-admin-msg-cancel").hide();
								$("#sysUser_user-admin-msg-content").css("margin-top","10px");
							});
								return;
						};
						dataBody["tags"]={};
						$("#announcement_post_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
							var tagType=$(this).val();//没有下拉菜单控件
							var tagValue=$(this).parent().find(".announcement_post_list_tag_value").val();
							var tagValueArray=tagValue.split(",");//输入没有逗号时
							if(tagValue==""){
								tagValueArray=[];//不填传空数组
							}
							if(tagValue.indexOf("，")!=-1){//中文逗号
								tagValueArray=tagValue.split("，")
							};
							if(tagValue.indexOf(",")!=-1){
								tagValueArray=tagValue.split(",")
							}
							if((tagType=="")&&(tagValue=="")){////为使用户使用方便，用户不慎多加的标签行(没有标签类型和值)，提交时自动忽略。
							}
							else{	
								dataBody["tags"][tagType]=tagValueArray
							};
						});
						dataBody.url=$("#announcement_post_list_detail_url").val();	
						self.addRequest(topicExtId,dataBody,function(){
							self.showFirstPage();
							self.hideSecondPage();
							self.getPostList(function(tableData) {
								self.list.updateInPage(self.listFormatData);
							})
						},"release","post")
					}
					else{
						var checkResult="success";
						var text="";
						$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
							if(checkResult=="success"){
								if (typeof $(this).attr("data-key") != "undefined"&&($(this).attr("data-key")!="")) {
									switch($(this).attr("data-key"))
									{
									case "id":
									  if($(this).val()==""){
										text=(i18n("POST_LIST_PLEASE_FILL")+$(this).parent().find(".announcement_post_list_row_lable").text());
										checkResult="fail";
									  };
									  break;
									case "title":
										if($(this).val()==""){
											text=(i18n("POST_LIST_PLEASE_FILL")+$(this).parent().find(".announcement_post_list_row_lable").text());
											checkResult="fail";
										};
									  break;
									default:
									  break;
									}
								}
						    }
						});
						if(checkResult=="success"){
							if($("#announcement_post_list_upload_file_input").val()==""){
								text=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_upload_file_input").parent().parent().find(".announcement_post_list_row_lable").text());
								checkResult="fail";
							}
							else if($("#announcement_post_list_detail_url").val()==""){
								text=(i18n("POST_LIST_PLEASE_FILL")+$("#announcement_post_list_detail_url").parent().find(".announcement_post_list_row_lable").text());
								checkResult="fail";
							}
							else{
							}
						};
						if(checkResult=="fail"){
							self.showMsgDialog(text, function() {			
							},function(){
								$("#sysUser_user-admin-msg-cancel").hide();
								$("#sysUser_user-admin-msg-content").css("margin-top","10px");
							});
							return;
						};
						var rawListData = self.rawListData;
						if (rawListData && rawListData.notice_list) {
							var notice_list = rawListData.notice_list;
							if (notice_list.length > 0) {
								var currentData = notice_list[self.rowIndex];
								var postId=currentData.id||"";
								if(postId!=""){
									var dataBody={};
									dataBody.id=postId;
									dataBody.edit_content={};
									dataBody.edit_content.metadata={};
									dataBody.edit_content.metadata.mould_content_img_text=[];
									for(var i= 0,len = secondPageUEObj.length;i<len;i++){
										//隐藏的是被删除的，不要提交。
										var needSubmit=false;
										if(richTextContainerIdList[i]){
											if(document.getElementById(richTextContainerIdList[i])!=null){
												var richTextId=richTextContainerIdList[i];
												if($("#"+richTextId+"").closest(".announcement_post_list_element_template"+templateType+"").css("display")!="none"){//没隐藏代表没被删除
													needSubmit=true
												}
											}
										};
										if(needSubmit){
											var obj={
												"pic":$("#announcement_post_list_template_upload_file_input"+i+"template"+templateType+"").val(),
												"text":secondPageUEObj[i].getContent()
											};
											if(templateType==4){
												obj.position="";
												var position=jq("#announcement_post_list_pic_position"+i+"template"+templateType+"").find(".select-header").text();

												switch(position)
												{
													case i18n("POST_LIST_LEFT"):
														obj.position="left-top";
														break;
													case i18n("POST_LIST_RIGHT"):
														obj.position="right-top";
														break;
													case i18n("POST_LIST_CENTER"):
													case "4":
														obj.position="center-top";
														break;
													default:
														break;
												};
											}
											dataBody.edit_content.metadata.mould_content_img_text.push(obj)
										}
									};
									$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
										if (typeof $(this).attr("data-key") != "undefined") {
											switch($(this).attr("data-key"))
											{
											case "id":
											  break;
											case "url":
											  break;
											case "create_time":
											  break;
											default:
											  dataBody.edit_content[$(this).attr("data-key")]=$(this).val()
											  break;
											}
										}
										else if (typeof $(this).attr("data-metadata") != "undefined") {
											dataBody.edit_content.metadata[$(this).attr("data-metadata")]=$(this).val()
										}//请注意，data-map在存的时候，由于时间关系，没过滤。
										else{
										}
									});	
									
									var moduleType=jq("#announcement_post_list_template_style").find(".select-header").text();
									dataBody.edit_content.metadata["mould_type"]=moduleType;
									if(templateType==2){
										dataBody.edit_content.metadata["mould_content_period"]=$("#announcement_post_list_mould_content_period").val();
									};
									var imagesUrl="";
									/*
									if(currentData.images_url&&currentData.images_url.url){}{
										imagesUrl=currentData.images_url.url
									};
									*/
									
									//因为images_url是复合属性，为防止编辑时破坏了images_url下面的其他属性，所以只有上传图片地址发生变化时，才提交
									//if(imagesUrl!=$("#announcement_post_list_upload_file_input").val()){ //mail:2019.12.9
										dataBody.edit_content.metadata["thumbnail"]=$("#announcement_post_list_upload_file_input").val();
										dataBody.edit_content["images_url"]={};
										dataBody.edit_content["images_url"]["url"]=$("#announcement_post_list_upload_file_input").val();//mail:2019.12.9
									//}
								   //var result = year + '-' + format(month) + '-' + format(day) + "T" + format(hour) + ":" + format(minute) + ":" + format(seconds) + "+0800";
									var date=$("#announcement_post_list_calendar-datepicker-input").val();
									var result="";
									if(date!=""&&($("#announcement_post_list_hour_menu").find(".select-header").text()!="")&&($("#announcement_post_list_select_minute").find(".select-header").text()!="")&&( $("#announcement_post_list_select_second").find(".select-header").text()!="")){
										result+=(date+ "T" + $("#announcement_post_list_hour_menu").find(".select-header").text() + ":" + $("#announcement_post_list_select_minute").find(".select-header").text() + ":" + $("#announcement_post_list_select_second").find(".select-header").text() + "+0800");
									};
									dataBody.edit_content["post_publish_time"]=result;
									var tagsFilled=self.checkTagsFilled("post");
									if(!tagsFilled){
									var text=i18n("POST_LIST_CONFRIM");
									self.showMsgDialog(text, function() {
										
									},function(){
										$("#sysUser_user-admin-msg-cancel").hide();
										$("#sysUser_user-admin-msg-content").css("margin-top","10px");
									});
										return;
									};
									var tagsFilled=self.checkTagsFilledB("post");
									if(!tagsFilled){
									var text=i18n("POST_LIST_CONFRIM2");
									self.showMsgDialog(text, function() {
										
									},function(){
										$("#sysUser_user-admin-msg-cancel").hide();
										$("#sysUser_user-admin-msg-content").css("margin-top","10px");
									});
										return;
									};
									dataBody.edit_content["tags"]={};
									$("#announcement_post_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
										var tagType="";
										if(typeof currentData.tags=="undefined"||(JSON.stringify(currentData.tags) == "{}")||(currentData.tags==null)){
											tagType=$(this).val();//没有下拉菜单控件
										}
										else{
											tagType=$(this).parent().find("input").val();
										}
										var tagValue=$(this).parent().find(".announcement_post_list_tag_value").val();
										var tagValueArray=tagValue.split(",");//输入没有逗号时
										if(tagValue==""){
											tagValueArray=[];//不填传空数组
										}
										if(tagValue.indexOf("，")!=-1){//中文逗号
											tagValueArray=tagValue.split("，")
										};
										if(tagValue.indexOf(",")!=-1){
											tagValueArray=tagValue.split(",")
										}
										if((tagType=="")&&(tagValue=="")){////为使用户使用方便，用户不慎多加的标签行(没有标签类型和值)，提交时自动忽略。
										}
										else{	
											dataBody.edit_content["tags"][tagType]=tagValueArray
										};
									});	
　　　　　　　　　　　　　　　　　　dataBody.edit_content["url"]=$("#announcement_post_list_detail_url").val();										
									self.editRequest(postId,dataBody,function(){
										self.showFirstPage();
										self.hideSecondPage();
										self.getPostList(function(tableData) {
											self.list.updateInPage(self.listFormatData);
										})
									},"release","post")
								}
							}
						};
					}
				}
			  });
			  jq("#announcement_post_list_edit_cancel").unbind().bind('click', function () {
					if(self.preUEready){//没加载完前，不能离开页面。
						self.showFirstPage();
						self.hideSecondPage();
					}
			  })	  
			  break;
			default:
			  break;
			}
        },
		checkInputBlank:function(containerId,inputArray){
			for(var i= 0,len = inputArray.length;i<len;i++){
			    var index=parseInt(inputArray[i]);
				var value=$("#"+containerId+"").find("input").eq(index).val();
				if(value==""){
					var label=$("#"+containerId+"").find(".announcement_post_list_row_lable").eq(index).text();
					return label
				}
			};
			return "success";
		},
		bindSecondPageCommon:function(type){
			if(!this.hasBindEvents[type]){
				this.hasBindEvents[type]=true;
				var self=this;
				this.bindTagRow(type);
				$("#announcement_"+type+"_list_edit_back").unbind().bind('click', function () {
					self.backToTopicPage1()
				});
				$("#announcement_"+type+"_list_edit_cancel").unbind().bind('click', function () {
					self.backToTopicPage1()
				});
				$("#announcement_"+type+"_list_edit_confirm,#announcement_"+type+"_list_create_confirm").unbind().bind('click', function () {
					var needCheckList=["0","1","2","3"];
					var checkResult=self.checkInputBlank("announcement_"+type+"_list_second_page_body",needCheckList);
					if(checkResult!="success"){
						var text=i18n("POST_LIST_PLEASE_FILL")+checkResult;
						self.showMsgDialog(text, function() {			
						},function(){
							$("#sysUser_user-admin-msg-cancel").hide();
							$("#sysUser_user-admin-msg-content").css("margin-top","10px");
						});
						return;
					};
					var dataBody={};
					dataBody.metadata={};
					var currentData=self.currentData;
					var topicName="";
					var blockCommit=false;
					$("#announcement_"+type+"_list_container").find("input,textarea").each(function() {
						if (typeof $(this).attr("data-key") != "undefined") {
							if($(this).attr("data-key")=="name"){
								topicName=$(this).val()
							};
							dataBody[$(this).attr("data-key")]=$(this).val();
							if($(this).attr("data-key")=="description"){
								if($(this).val()==""){
									blockCommit=true
									var text=$(this).parent().find(".announcement_post_list_row_lable").text();
									text=i18n("POST_LIST_PLEASE_FILL")+text;
									self.showMsgDialog(text, function() {			
									},function(){
										$("#sysUser_user-admin-msg-cancel").hide();
										$("#sysUser_user-admin-msg-content").css("margin-top","10px");
									});
								}
							}
						}
					});	
					if(blockCommit){
						return
					};
					var tagsFilled=self.checkTagsFilled("topic");
					if(!tagsFilled){
						var text=i18n("POST_LIST_CONFRIM");
						self.showMsgDialog(text, function() {
						},function(){
							$("#sysUser_user-admin-msg-cancel").hide();
							$("#sysUser_user-admin-msg-content").css("margin-top","10px");
						});
						return;
					};
					var tagsFilled=self.checkTagsFilledB("topic");
					if(!tagsFilled){
						var text=i18n("POST_LIST_CONFRIM2");
						self.showMsgDialog(text, function() {
						},function(){
							$("#sysUser_user-admin-msg-cancel").hide();
							$("#sysUser_user-admin-msg-content").css("margin-top","10px");
						});
						return;
					};
					dataBody["tags"]={};
					$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
						var tagType="";
						if(typeof currentData.tags=="undefined"||(JSON.stringify(currentData.tags) == "{}")||(currentData.tags==null)){
							tagType=$(this).val();//没有下拉菜单控件
						}
						else{
							tagType=$(this).parent().find("input").val();
						}
						var tagValue=$(this).parent().find(".announcement_post_list_tag_value").val();
						var tagValueArray=tagValue.split(",");//输入没有逗号时
						if(tagValue==""){
							tagValueArray=[];//不填传空数组
						}
						if(tagValue.indexOf("，")!=-1){//中文逗号
							tagValueArray=tagValue.split("，")
						};
						if(tagValue.indexOf(",")!=-1){
							tagValueArray=tagValue.split(",")
						}
						if((tagType=="")&&(tagValue=="")){////为使用户使用方便，用户不慎多加的标签行(没有标签类型和值)，提交时自动忽略。
						}
						else{	
							dataBody["tags"][tagType]=tagValueArray
						};
					});
					var metaDataLen=$("#announcement_"+type+"_template_list_container").find(".announcement_post_list_meta_container").length;
					for(var i= 0,len = metaDataLen;i<len;i++){
						var key=$("#announcement_"+type+"_template_list_container").find(".metadata_key").eq(i).find("input").val();
						var value=$("#announcement_"+type+"_template_list_container").find(".metadata_val").eq(i).val();
						if(key!=""){
							dataBody.metadata[key]=value
						}
					};
					//dataBody.subject=topicName;
					var dataBodyEdit={};
					if(type=="post"){
						dataBodyEdit.edit_content=dataBody
					}
					else{
						dataBodyEdit=dataBody
					}
					var id=currentData.topic_ext_id||"";
					if(self.enterSecondPageType=="edit"){
						self.editRequest(id,dataBodyEdit,function(){
							self.backToTopicPage1();
							self.getTopicList(function(tableData) {
								self.listTopic.updateInPage(self.listTopicFormatData);
							})
						},"release",type)
					}
					else if(self.enterSecondPageType=="add"){
					    
						self.addRequest(id,dataBodyEdit,function(){
							self.backToTopicPage1();
							self.getTopicList(function(tableData) {
								self.listTopic.updateInPage(self.listTopicFormatData);
							})
						},"release",type)
					}
					else{
					}
				});
				$("#announcement_"+type+"_template_list_container").on("click", ".announcement_post_list_add", function(){
					self.addMetadataKeyValueRow("announcement_"+type+"_template_list_container","","")
				});
				$("#announcement_"+type+"_template_list_container").on("click", ".announcement_post_list_del", function(){
					$(this).parent().remove()
				});
			}
		},
		checkTagsFilled:function(type){
		    var canCommit=true;
			if(this.enterSecondPageType=="add"){
				$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
					if($("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_value").eq(index).val()!=""){
						var value=$(this).val();//没有下拉菜单
						if(value==""){
							canCommit=false
						}
					}
				});
			}
			else{
				var currentData=this.currentData;
				//mail 2019.10.30 fang li 邮件暂时没回，所以认为(1)根据文档，tags可以填，可以不填。
				//根据zhang jian 10.30邮件，一旦填写了标签类型，可以不填标签值（传空数组）。一旦填写了标签值。就一定要有标签类型。
				$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
					if($("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_value").eq(index).val()!=""){
						var value=$(this).val();//没有下拉菜单
						if(typeof currentData.tags!="undefined"){
							value=$(this).parent().find("input").val()//有下拉菜单
						};
						if(value==""){
							canCommit=false
						}
					}
				});
			}
			return canCommit;
		},
		checkTagsFilledB:function(type){
		    var canCommit=true;
			if(this.enterSecondPageType=="add"){
				var array=[];
				$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
					var value=$(this).val();
					if(value!=""){
						array.push(value)
					}
				});
				var tagsUsedSortIndexDistinct =[];
				for (var w = 0; w < array.length; w++) {
					var count = 0;
					for (var y = 0; y < tagsUsedSortIndexDistinct.length; y++) {
						if (tagsUsedSortIndexDistinct[y] == array[w]) {
							count++;
							canCommit = false;
						}
					}
					if (count < 1) tagsUsedSortIndexDistinct.push(array[w]);
				}
			}
			else{
				var currentData=this.currentData;
				var array=[];
				//mail 2019.10.30 fang li 邮件暂时没回，所以认为(1)根据文档，tags可以填，可以不填。
				//根据zhang jian 10.30邮件，一旦填写了标签类型，可以不填标签值（传空数组）。一旦填写了标签值。就一定要有标签类型。
				$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").each(function(index,element){
					//if($("#announcement_post_list_container").find(".announcement_post_list_tag_value").eq(index).val()!=""){
						var value=$(this).parent().find("input").val();
						if(typeof currentData.tags=="undefined"||(JSON.stringify(currentData.tags) == "{}")||(currentData.tags==null)){
							value=$(this).val();
						};
						if(value!=""){
							array.push(value)
						}
					//}
				});
				var tagsUsedSortIndexDistinct =[];
				for(var w = 0; w < array.length; w++)
					{var count=0;
					for (var y = 0; y < tagsUsedSortIndexDistinct.length; y++) 
						{if(tagsUsedSortIndexDistinct[y]==array[w])
							{count++;
							 canCommit=false;
							}
						}
						if (count<1)
						tagsUsedSortIndexDistinct.push(array[w]);
					}
			};
			return canCommit
		},
		addRequest: function(id,dataBody,callback,type,dataType){
			var url = aquapaas_host +'/aquapaas/rest/announcement/admin/'+dataType+'';
			url += "?user_id=" + my.paas.user_id;
			url += "&app_key=" + paasAppKey;
			url += "&timestamp=" + new Date().toISOString();
			url += "&access_token=" + my.paas.access_token;
			if(type&&type=="release"){
				url += "&to_publish=true"
			}
			var method = "POST";
			$.ajax({
				type: method,
				url: url,
				async: true,
				data: JSON.stringify(dataBody),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).always(function() {
				callback()
			})
		},
		editRequest: function(id,dataBody,callback,type,dataType){
			var url=aquapaas_host + "/aquapaas/rest/announcement/admin/"+dataType+"/edit/";
			url += id;
			url += "?user_id=" + my.paas.user_id;
			url += "&app_key=" + paasAppKey;
			url += "&timestamp=" + new Date().toISOString();
			url += "&access_token=" + my.paas.access_token;
			if(type&&type=="release"){
				url += "&to_publish=true"
			}
			var method = "PUT";
			$.ajax({
				type: method,
				url: url,
				async: true,
				data: JSON.stringify(dataBody),
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).done(function(data) {
				callback()
			})
		},
        hideFirstPage: function() {
            $("#announcement_post_list_container").find(".header").find(".backBtn").hide();
            $("#announcement_post_list_container").find(".header").find(".headertitle").hide();
			$("#announcement_post_list_container").find(".header").find("#announcement_topic_list_add_post").hide();
            $("#announcement_post_list_table_container").hide();
        },
		showFirstPage: function() {
			$("#announcement_post_list_container").find(".header").find(".backBtn").show();
            $("#announcement_post_list_container").find(".header").find(".headertitle").show();
			$("#announcement_post_list_container").find(".header").find("#announcement_topic_list_add_post").show();
            $("#announcement_post_list_table_container").show();
		},
		addOneTagRow:function(key,value,datatype,tagBelong){
		    var self=this;
		    var addDeleteShow="";
			var inputWidth="";
			var dom1="input";
			var dom2="/";
			var dom3="";
			var typeStyle="";
			var enterSecondPageType=this.enterSecondPageType;
			if(enterSecondPageType=="edit"||(enterSecondPageType=="add")){
				addDeleteShow="display:inline-block";
				inputWidth="calc(100% - 253px)";
				if(key&&key!=""||(typeof datatype!= "undefined"&&(datatype=="default"))){//使用下拉控件
					dom1="div";
					dom2="";
					dom3="</div>";
					typeStyle="border:0;padding-left:0"
				}
			}
			else{
				addDeleteShow="display:none";
				inputWidth="calc(100% - 201px)";
			}
			var placeholder=i18n("POST_LIST_PLACEHOLDER2");
			var placeholder3=i18n("POST_LIST_PLACEHOLDER3");
			var containerStyle="";
			var len=$("#announcement_"+tagBelong+"_list_container").find(".announcement_post_list_tag_type").length;
			if(len>0){
				containerStyle="margin-top:22px"
			}
			var divHTML="<div style=\"width:100%;height:32px;"+containerStyle+"\">";
			//编辑时，生成读到的tag
			divHTML+="<"+dom1+" value=\""+key+"\" id=\"announcement_"+tagBelong+"_list_tag_type"+len+"\" class=\"announcement_post_list_row_input announcement_post_list_tag_type\" style=\"width:176px;height:32px;vertical-align:top;background-color:#ffffff;"+typeStyle+"\" placeholder=\""+placeholder+"\""+dom2+">"+dom3+"";
			//var diverse=62+176+14;
			divHTML+="<input value=\""+value+"\" class=\"announcement_post_list_row_input announcement_post_list_tag_value\" style=\"margin-left:14px;width:"+inputWidth+"\" placeholder=\""+placeholder3+"\"/>";
			divHTML+="<img class=\"announcement_post_list_add\" src=\"content/post_list/images/add.png\" style=\""+addDeleteShow+"\"/>";
			divHTML+="<img class=\"announcement_post_list_del\" src=\"content/post_list/images/del.png\" style=\""+addDeleteShow+"\"/>";
			divHTML+="</div>"
			$("#announcement_"+tagBelong+"_list_tag_container").append(divHTML);
		},
		bindTagRow:function(tagBelong){
		    var self=this;
			if(self.enterSecondPageType=="add"){
				$("#announcement_"+tagBelong+"_list_tag_container").on("click", ".announcement_post_list_add", function(){//添加template
					self.addOneTagRow("","","",tagBelong);
				});
				$("#announcement_"+tagBelong+"_list_tag_container").on("click", ".announcement_post_list_del", function(){   
					$(this).parent().remove();
					$("#announcement_"+tagBelong+"_list_tag_container").children().eq(0).css("margin-top",0)
				})
			}
			else{
				$("#announcement_"+tagBelong+"_list_tag_container").on("click", ".announcement_post_list_add", function(){
					var currentData=self.currentData;
					if(typeof currentData.tags=="undefined"||(JSON.stringify(currentData.tags) == "{}")||(currentData.tags==null)){
						self.addOneTagRow("","","",tagBelong);
					}
					else{
						self.addOneTagRow("","","default",tagBelong);//参考navigation，编辑默认会多生成个。
						var len=$("#announcement_"+tagBelong+"_list_container").find(".announcement_post_list_tag_type").length;
						self.initTagTypeSelectOne(len-1,tagBelong)
					};
				});
				$("#announcement_"+tagBelong+"_list_tag_container").on("click", ".announcement_post_list_del", function(){   
					$(this).parent().remove();
					$("#announcement_"+tagBelong+"_list_tag_container").children().eq(0).css("margin-top",0)
				})
			}
		},
		initTagTypeSelectOne:function(typeIndex,type){
			var id=$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").eq(typeIndex).attr("id");
				var option={
					"placeholder":i18n("POST_LIST_PLACEHOLDER4")
				};
				var tagTypeListKeyValue=[];
				var tagTypeList=this.tagTypeList;
				for(var i= 0,len = tagTypeList.length;i<len;i++){
					tagTypeListKeyValue.push({
						"key":tagTypeList[i],
						"value":tagTypeList[i]
					})
				};
				var templateStyle = new newInputSelect("#"+id+"", tagTypeListKeyValue, {
					width: 176,
					height: 30,
					background: "#FFFFFF",
					selectbackground: "#FFFFFF",
					ScrollBarHeight: "150px"
				}, function(value){
				},{},option);
			    templateStyle.setValue("");
		},
		initTagTypeSelect:function(type){
			var len=$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").length;
            var tagTypeList=this.tagTypeList;
			var tagTypeListKeyValue=[];
			for(var i= 0,len = tagTypeList.length;i<len;i++){
				tagTypeListKeyValue.push({
					"key":tagTypeList[i],
					"value":tagTypeList[i]
				})
			};
			/*
			tagTypeListKeyValue.push({
				"key":"",
				"value":""
			})
			*/
			var len=tagTypeList.length+1;
			for(var j= 0;j<len;j++){
				var id=$("#announcement_"+type+"_list_container").find(".announcement_post_list_tag_type").eq(j).attr("id");
				var option={
					"placeholder":i18n("POST_LIST_PLACEHOLDER4")
				};
				var templateStyle = new newInputSelect("#"+id+"", tagTypeListKeyValue, {
					width: 176,
					height: 30,
					background: "#FFFFFF",
					selectbackground: "#FFFFFF",
					ScrollBarHeight: "150px"
				}, function(value){
				},{},option);
				if(typeof tagTypeListKeyValue[j]!="undefined"&&(typeof tagTypeListKeyValue[j].key!="undefined")){
					templateStyle.setValue(tagTypeListKeyValue[j].key);
				}
				else{
					templateStyle.setValue("");
				}
			}
		},
		showSecondPageTopicAdd: function() {
			this.tagTypeList=[];
			$("#announcement_topic_list_tag_container").empty();
			$("#announcement_topic_list_container").find("input,textarea").each(function() {
				$(this).val("")
			});
			this.addOneTagRow("","","","topic");
			$("#announcement_topic_list_second_page_body").find("input,textarea").each(function() {
				$(this).removeClass("announcement_post_list_readonly");
				$(this).removeAttr("readonly").css("background-color","#ffffff");
			});
			this.addMetadataKeyValueRow("announcement_topic_template_list_container","","")
		},
		showSecondPageTopic: function() {//显示元素，并填入值。
			this.tagTypeList=[];
			$("#announcement_topic_list_tag_container").empty();
			var currentData=this.currentData;
			$("#announcement_topic_list_container").find("input,textarea").each(function() {
				if ((typeof $(this).attr("data-key") != "undefined") && (typeof currentData[$(this).attr("data-key")] != "undefined")) {
					if(typeof $(this).attr("data-time") == "undefined"){
						$(this).val(currentData[$(this).attr("data-key")])
					}
				} 
			});
			if(typeof currentData.tags=="undefined"||(JSON.stringify(currentData.tags) == "{}")||(currentData.tags==null)){//mail:2019.10.30  
				this.addOneTagRow("","","","topic");
			}
			else{//之前post已有tag
				var tags=currentData.tags;
				for(var i in tags){
					this.tagTypeList.push(i);
					this.addOneTagRow(i,tags[i],"","topic");
				};
				if(this.enterSecondPageType=="edit"||(this.enterSecondPageType=="add")){//生成下拉控件
					this.addOneTagRow("","","default","topic");//参考navigation，编辑默认会多生成个。
					this.initTagTypeSelect("topic")
				}
			}
			if(this.enterSecondPageType=="edit"){
				$("#announcement_topic_list_second_page_body").find("input,textarea").each(function() {
                    //if (typeof $(this).attr("data-key") != "undefined") {
						//if(!$(this).hasClass("announcement_post_list_readonly")){//mail:2019.11.1所有字段可编辑
						if ((typeof $(this).attr("data-key") != "undefined")&&($(this).attr("data-key")=="topic_ext_id")){//mail:2019.11.1
							$(this).css("background-color","#ebebeb")
						}
						else{
							$(this).removeClass("announcement_post_list_readonly");
							$(this).removeAttr("readonly").css("background-color","#ffffff");
						}
						//}
					//}
				});
				
			}
			else{
				$("#announcement_topic_list_second_page_body").find("input,textarea").each(function() {
                    //if (typeof $(this).attr("data-key") != "undefined") {
						$(this).attr("readonly","readonly").css("background-color","#ebebeb")
					//}
				});
			};
			this.initMetadata()
        },
        showSecondPage: function() {
			this.tagTypeList=[];
			$("#announcement_post_list_tag_container").empty();
			var obj= $("#announcement_post_list_container");
            $(obj).find(".header").find(".announcement_post_list_page_head_left").show();
            $(obj).find("[name='announcement_post_list_second_page_body']").show();
			/*
			$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").children().eq(0).css({
				"height":"calc(100% - 57px)",
				"max-height":"calc(100% - 57px)"
			});
			*/
			//var height=$(obj).find("[name='announcement_post_list_second_page_body']").get(0).offsetHeight-56;
			//$(obj).find("[name='announcement_post_list_second_page_body']").children().eq(0).css("height",""+height+"px");
			/*
			$(obj).find("[name='announcement_post_list_second_page_body']").children().eq(0).mCustomScrollbar({
				theme:"my-theme"
			});
			*/
			if(this.enterSecondPageType=="add"){
				$(obj).find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row_unit_a").eq(0).hide();
				$(obj).find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row_unit_b").eq(0).css("float","left");
				$(obj).find("[name='announcement_post_list_second_page_body']").find("#announcement_post_list_create_time").parent().hide();
				$(obj).find("[name='announcement_post_list_second_page_body']").find("#announcement_post_list_calendar").parent().css("float","left");
				$(obj).find("[name='announcement_post_list_second_page_body']").find("#announcement_post_list_calendar").parent().find(".announcement_post_list_row_lable").eq(0).css("margin-right","24px");
				$("#announcement_post_list_upload_file_input").attr("readonly","readonly").css("background-color","#ebebeb");
				$("#announcement_post_list_upload_file_input").parent().css("background-color","#ebebeb");
				$("#announcement_post_list_detail_url").attr("readonly","readonly").css("background-color","#ebebeb");
			}
			else{
				$(obj).find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row_unit_a").eq(0).hide();
				$(obj).find("[name='announcement_post_list_second_page_body']").find(".announcement_post_list_row_unit_b").eq(0).css("float","left");
				$(obj).find("[name='announcement_post_list_second_page_body']").find("#announcement_post_list_create_time").parent().hide();
				$(obj).find("[name='announcement_post_list_second_page_body']").find("#announcement_post_list_calendar").parent().css("float","left");
				$(obj).find("[name='announcement_post_list_second_page_body']").find("#announcement_post_list_calendar").parent().find(".announcement_post_list_row_lable").eq(0).css("margin-right","24px");
				$("#announcement_post_list_upload_file_input").attr("readonly","readonly").css("background-color","#ebebeb");
				$("#announcement_post_list_upload_file_input").parent().css("background-color","#ebebeb");
				$("#announcement_post_list_detail_url").attr("readonly","readonly").css("background-color","#ebebeb");
			}
			var currentData=this.currentData;
			if(typeof currentData.tags=="undefined"||(JSON.stringify(currentData.tags) == "{}")||(currentData.tags==null)){//mail:2019.10.30  
				this.addOneTagRow("","","","post");
			}
			else{//之前post已有tag
				var tags=currentData.tags;
				for(var i in tags){
					this.tagTypeList.push(i);
					this.addOneTagRow(i,tags[i],"","post");
				};
				if(this.enterSecondPageType=="edit"){//生成下拉控件
					this.addOneTagRow("","","default","post");//参考navigation，编辑默认会多生成个。
					this.initTagTypeSelect("post")
				}
			}
			if(this.enterSecondPageType=="edit"||this.enterSecondPageType=="add"){
			    var type="post";
				if(!this.hasBindEvents[type]){
					this.hasBindEvents[type]=true;
					this.bindTagRow(type);
				}
				$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
                    //if (typeof $(this).attr("data-key") != "undefined") {
						if(!$(this).hasClass("announcement_post_list_readonly")){
							$(this).removeAttr("readonly").css("background-color","");
						}
					//}
				});
				$("#announcement_post_list_template_style").show();
				$("#announcement_post_list_template_style_readonly").hide();
				$("#announcement_post_list_container").find(".announcement_post_upload_file_icon").show();
				$("#announcement_post_list_calendar,#announcement_post_list_hour_menu,#announcement_post_list_select_minute,#announcement_post_list_select_second").show()
				$("#announcement_post_list_calendar,#announcement_post_list_hour_menu,#announcement_post_list_select_minute,#announcement_post_list_select_second").next().show();
				$("#announcement_post_list_calendar_view,#announcement_post_list_hour_menu_view,#announcement_post_list_select_minute_view,#announcement_post_list_select_second_view").hide()
				$("#announcement_post_list_calendar_view,#announcement_post_list_hour_menu_view,#announcement_post_list_select_minute_view,#announcement_post_list_select_second_view").next().hide();
				$("#announcement_post_list_edit_back").hide();
				if(this.enterSecondPageType=="add"){
					$("#announcement_post_list_create_confirm").show();
					$("#announcement_post_list_edit_confirm").hide();
				}
				else{
					$("#announcement_post_list_create_confirm").hide();
					$("#announcement_post_list_edit_confirm").show();
				}
				$("#announcement_post_list_edit_cancel").show();
			}
			else{
				$("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").find("input,textarea").each(function() {
                    //if (typeof $(this).attr("data-key") != "undefined") {
						$(this).attr("readonly","readonly").css("background-color","#ebebeb")
					//}
				});
				$("#announcement_post_list_template_style").hide();
				$("#announcement_post_list_template_style_readonly").show();
				$("#announcement_post_list_container").find(".announcement_post_upload_file_icon").hide();
				$("#announcement_post_list_calendar,#announcement_post_list_hour_menu,#announcement_post_list_select_minute,#announcement_post_list_select_second").hide();
				$("#announcement_post_list_calendar,#announcement_post_list_hour_menu,#announcement_post_list_select_minute,#announcement_post_list_select_second").next().hide();
				$("#announcement_post_list_calendar_view,#announcement_post_list_hour_menu_view,#announcement_post_list_select_minute_view,#announcement_post_list_select_second_view").show()
				$("#announcement_post_list_calendar_view,#announcement_post_list_hour_menu_view,#announcement_post_list_select_minute_view,#announcement_post_list_select_second_view").next().show();
				$("#announcement_post_list_edit_back").show();
				$("#announcement_post_list_create_confirm").hide();
				$("#announcement_post_list_edit_confirm").hide();
				$("#announcement_post_list_edit_cancel").hide();
			}
        },
		hideSecondPage: function() {
            $("#announcement_post_list_container").find(".header").find(".announcement_post_list_page_head_left").hide();
            $("#announcement_post_list_container").find("[name='announcement_post_list_second_page_body']").hide();
        }
    };
    return announcementPost;
})(jQuery);