(function($, window, document, undefined) {
	// 定义类
	function paging(element, option) {
		this.element = element;
		this.option = {
			currentPage: 1,
			classStyle:option.classStyle,
			backClass:option.backClass,
			isFirst:((option.isFirst==undefined)?true:option.isFirst), // 是否显示首页和尾页
			isPre:((option.isPre==undefined)?true:option.isPre), // 是否显示下一页和上一页按钮
			isShow:((option.isShow==undefined)?true:option.isShow),//是否显示总页数和总记录数
			showRecordNum: option.showRecordNum,
			totalNum: null,
			totalPage: null,
			url:option.url,//url
			method:option.method,//请求方法
			urlParam:option.urlParam,//请求参数
			showNum: option.showNum,
			getList: option.getList
		};
		this.init();
	}
	paging.prototype = {
		init: function() {
			this.Data=[];
			this.DataList=[];
			this.option.showRecordNum = this.option.showRecordNum;
			this.getDataNum(this.option.currentPage, this.option.showRecordNum);
			this.createPage();
			this.changePage();
		},
		getDataNum : function(currentPage,showRecordNum){
			var that = this;
			let Data = [];
			let start = 0;
			let end = 19;
			if(showRecordNum>=1&&currentPage>0){
				start = (currentPage-1)*showRecordNum;
				end = (currentPage*showRecordNum)-1;
			}
			let URL=that.option.url;
			let URLParam=[...that.option.urlParam];
			URLParam.push('app_key=' + paasAppKey);//应用级授权
			URLParam.push('timestamp=' + new Date().toISOString());//应用级授权
			URLParam.push("start="+start);
			URLParam.push("end="+end);
			URL += '?' + URLParam.join('&');
			$.ajax({
				type: that.option.method,
				async: true,
				url: URL,
				headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign(that.option.method, URL),
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				data: JSON.stringify()
			}).done(function (data, status, xhr) {
				if (status=="success") {
					that.Data=[...data];
					// console.log("data",data);
					let xhrdataNum = xhr.getAllResponseHeaders().split(":");
					that.option.totalNum = parseInt(xhrdataNum[xhrdataNum.length-1]);
					that.option.totalPage =((that.option.totalNum % that.option.showRecordNum == 0) ? that.option.totalNum / that.option.showRecordNum : that.option.totalNum / that.option.showRecordNum + 1);
					if (isNaN(that.option.totalNum)) {
						$("#Pagination_total span").text("0");
					}else{
						$("#Pagination_total span").text(that.option.totalNum);
					}
					that.createPage();
					that.getDataList();
				}
			}).fail(function (jqXHR, textStatus) {
				that.option.Data=[];
				// console.log("jqXHR",jqXHR);
				// console.log("textStatus",textStatus);
			});
		},
		getDataList : function(){
			var that = this;
			let data= [];
			for (let item of that.Data){
				let data1= [],step1=[],results1=[],step2=[];
				if (item.step[1].status=="passed"){
					data1.push(item.id);
					data1.push(item.type);
					data1.push(item.create_time);
					data1.push(item.metadata.description);
					data1.push(item.metadata.source);
					data1.push(item.metadata.poster);
					step1.push(item.step[0].no);
				}else{
					data1.push(item.id);
					data1.push(item.type);
					data1.push(item.create_time);
					data1.push(item.metadata.description);
					data1.push(item.metadata.source);
					data1.push(item.metadata.poster);
					for(let i =0;i<item.step.length-1;i++){
						let antispam={},sface={},tag={};
						step1.push(item.step[i].no);
							if (!jQuery.isEmptyObject(item.step[i].reason)){
								if (item.step[i].reason.metadata_audit!=null&&item.step[i].reason.metadata_audit.audioScanResults!=undefined) {
									antispam.scene=item.step[i].reason.metadata_audit.audioScanResults.scene;
									antispam.suggestion=item.step[i].reason.metadata_audit.audioScanResults.suggestion;
									results1.push(antispam);
								}
								if (item.step[i].reason.metadata_sface) {
									sface.scene=item.step[i].reason.metadata_sface.results[0].scene;
									sface.suggestion=item.step[i].reason.metadata_sface.results[0].suggestion;
									results1.push(sface);
								}
								if (item.step[i].reason.metadata_tag) {
									tag.scene=item.step[i].reason.metadata_tag.results[0].scene;
									tag.suggestion=item.step[i].reason.metadata_tag.results[0].suggestion;
									results1.push(tag);
								}
								for (let j=0; j<item.step[i].reason.metadata_audit.results.length;j++) {
									let obj={};
									obj.scene=item.step[i].reason.metadata_audit.results[j].scene;
									obj.suggestion=item.step[i].reason.metadata_audit.results[j].suggestion;
									results1.push(obj);
								}
							}
						
						step1.push(results1);
					}
				}
				step2.push(item.step[1].no);
				step2.push(item.step[1].status);
				data1.push(step1);
				data1.push(step2);
				data.push(data1);
			}
			that.DataList=[...data];
			if(that.option.getList) {
				// console.log("that.DataList",that.DataList);
				// let arr = [];
				// for (let i = 0;i<300;i++){
				// 	arr.push(that.DataList[0]);
				// 	arr.push(that.DataList[1]);
				// 	arr.push(that.DataList[2]);
				// }
				// if (that.option.currentPage==undefined){
				// 	that.option.currentPage=1;
				// }
				// if (that.option.showRecordNum==undefined){
				// 	that.option.showRecordNum=20;
				// }
				// let data =arr.slice(((that.option.currentPage-1)*that.option.showRecordNum),(that.option.currentPage*that.option.showRecordNum));
				that.option.getList(that.DataList);
			}
		},
		createPage: function() {
			var ele = this;
			var arr = new Array();
			var str = "";
			var isFirst = ele.option.isFirst;
			var isPre = ele.option.isPre;
			var isShow=ele.option.isShow;

			var classStyle=ele.option.classStyle;
			var string1="";
			for(var ss in classStyle){
				string1+=ss+':'+classStyle[ss]+';';
			}

			var backClass=ele.option.backClass;
			var string2="";
			for(var ss in backClass){
				string2+=ss+':'+backClass[ss]+';';
			}

			var currentPage = parseInt(ele.option.currentPage);
			var totalPage = parseInt(ele.option.totalPage);
			var totalNum = parseInt(ele.option.totalNum);
			if(isNaN(currentPage) || isNaN(totalPage) || isNaN(totalNum)) {
				// alert("分页插件不能正常工作，请输入正确的数字");
			} else {
				if(isFirst) {
					if(currentPage==1){
						str='<li class="disabled"><span style="'+string1+'">首页</span></li>';
						// console.debug(str);
						arr.push(str);
					}else{
						str='<li><a href="javascript:void(0)" style="'+string1+'">首页</a></li>';
						// console.debug(str);
						arr.push(str);
					}
				}
				if(isPre) {
					if(currentPage==1){
						str = '<li class="disabled"><span style="'+string1+'">&lt</span></li>';
						arr.push(str);
					}else{
						str = '<li><a href="javascript:void(0)" style="'+string1+'">&lt</a></li>';
						arr.push(str);
					}

				}
				//判断条件,
				// 总页数小于6时:  1 2 3 4 5 6
				// 总页数大于6时(假设为10):
				// 	当前页为4时: 1 ... 4 5 6 ... 10
				// 	当前页为(总页数-4)时: 1 ... 6 7 8 9 10
				if(totalPage <= 6) {
					for(var i = 0; i < totalPage; i++) {
						if((i + 1) == currentPage) {
							str = '<li class="active"><a  href="javascript:void(0)" style="'+string1+string2+'">' + (i + 1) + '</a></li>';
							arr.push(str);
						} else {
							str = '<li><a href="javascript:void(0)" style="'+string1+'">' + (i + 1) + '</a></li>';
							arr.push(str);
						}
					}
				}else if(currentPage<4) {
					for(var i = 1; i <= 5; i++) {
						if(i == currentPage) {
							str = '<li class="active"><a  href="javascript:void(0)" style="'+string1+string2+'">' + (i) + '</a></li>';
						} else {
							str = '<li><a  href="javascript:void(0)" style="'+string1+'">' + (i) + '</a></li>';
						}
						arr.push(str);
					}
					str = '<li><span style="'+string1+'">...</span></li>';
					arr.push(str);
					str = '<li><a  href="javascript:void(0)" style="'+string1+'">' + (totalPage) + '</a></li>';
					arr.push(str);
				}else if(currentPage>=4&&currentPage<=(totalPage-4))  {
					str = '<li><a  href="javascript:void(0)" style="'+string1+'">1</a></li>';
					arr.push(str);
					str = '<li><span style="'+string1+'">...</span></li>';
					arr.push(str);
					for(var i = currentPage; i <= currentPage+2; i++) {
						if(i == currentPage) {
							str = '<li class="active"><a  href="javascript:void(0)" style="'+string1+string2+'">' + (i) + '</a></li>';
						} else {
							str = '<li><a  href="javascript:void(0)" style="'+string1+'">' + (i) + '</a></li>';
						}
						arr.push(str);
					}
					str = '<li><span style="'+string1+'">...</span></li>';
					arr.push(str);
					str = '<li><a  href="javascript:void(0)" style="'+string1+'">' + (totalPage) + '</a></li>';
					arr.push(str);
				}else if(currentPage>=(totalPage-4))  {
					// if((totalPage - 1) <= currentPage) {
						str = '<li><a  href="javascript:void(0)" style="'+string1+'">1</a></li>';
						arr.push(str);
						str = '<li><span style="'+string1+'">...</span></li>';
						arr.push(str);
						for(var i = totalPage-4; i <= totalPage; i++) {
							if(i == currentPage) {
								str = '<li class="active"><a  href="javascript:void(0)" style="'+string1+string2+'">' + (i) + '</a></li>';
							} else {
								str = '<li><a  href="javascript:void(0)" style="'+string1+'">' + (i) + '</a></li>';
							}
							arr.push(str);
						}
					// }
				}
				if(isPre) {
					if(currentPage==totalPage){
						str = '<li class="disabled"><span style="'+string1+'">&gt</span></li>';
						arr.push(str);
					}else{
						str = '<li><a href="javascript:void(0)" style="'+string1+'">&gt</a></li>';
						arr.push(str);
					}
				}
				if(isFirst) {
					if(currentPage==totalPage){
						str = '<li class="disabled"><span style="'+string1+'">尾页</span></li>';
						arr.push(str);
					}else{
						str = '<li><a href="javascript:void(0)" style="'+string1+'">尾页</a></li>';
						arr.push(str);
					}
				}
				if(isShow){
					// str='<li><span class="'+classStyle+'" style="'+string1+'">共'+totalPage+'页</span></li>';
					// arr.push(str);
					str='<li><span class="'+classStyle+'" style="'+string1+'">总共'+totalNum+'条结果</span></li>';
					arr.unshift(str);
				}
				str = arr.join("");
				ele.element.html(str);
			}
		},
		changePage: function() {
			var ele = this;
			// console.debug(ele);
			ele.element.on('click', 'a', function() {
				var currentPage = parseInt(ele.option.currentPage);
				var totalpage = parseInt(ele.option.totalPage);
				var ss = $(this).html();
				if(ss == "&lt;" && currentPage != 1) {
					ele.option.currentPage = ele.option.currentPage - 1;
				} else if(ss == "&lt;" && currentPage == 1) {
					ele.option.currentPage = ele.option.currentPage;
				}
				if(ss == '首页') {
					ele.option.currentPage = 1;
				}
				if(ss == "尾页") {
					ele.option.currentPage = totalpage;
				}
				if(ss == "&gt;" && currentPage != totalpage) {
					ele.option.currentPage = ele.option.currentPage + 1;
				} else if(ss == "&gt;" && currentPage == totalpage) {
					ele.option.currentPage = totalpage;
				}
				if(ss != "首页" && ss != "&lt;" && ss != "&gt;" && ss != "尾页") {
					ele.option.currentPage = parseInt(ss);
				}
				ele.getDataNum(ele.option.currentPage, ele.option.showRecordNum);
				ele.createPage();
				if(ele.option.showNum) {
					ele.option.showNum(ele.option.currentPage, ele.option.showRecordNum);
				}

			});
		}
	};

	$.fn.Paging = function(option) {
		return new paging(this, option);
	}
})(jQuery, window, document);
