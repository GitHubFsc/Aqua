(function (w) {
  /* //mail 2019.9.6 去除站点
  if( (typeof AdvSystemType !="undefined")&&(AdvSystemType=="local") ){}
  else{document.getElementById("schedule_site_downMenu").style.display="block"};
	*/
  document.getElementById("schedule_advId_downMenu").style.display="block";
  var adv__schedule_={};
  var $ = function (id) {return document.getElementById(id)};
  var $$ = function (name) {return document.getElementsByClassName(name)};
  var jQ_=jQuery;
	var hasClickedAdv=false;
  var token_ = "user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=";
  var allSite=null;
  var pickerCalendar = null;
  var advID="";
  var siteID="";
  var advID_old="";
  var siteID_old="";
  var lastSiteid="";
  var lastChooseCalendarID="";
  var siteChange="";
  var el_id="panel_time_picker_calendar-curr-month-date-"+new Date().getDate()+"";
  var sTime=[];//初始值
  var eTime=[];
  var get_adPolicy_serverData=[];
  var dateChooseType="chooseOneTimeRange";
  var firstPeriodObj={
  };
  var secondPeriodObj={
  };
  var array_colorder_min="";
  var array_colorder_max="";
  var advName="";
	var allAdvData=[];
  var calendarStyle = {
		width: 278,
		navTitleHeight: 25,
		navTitleBgColor: '#64a5c2',
		datesViewHeight: 160,
		datesViewGridColor: '#e2e2e2',
		datesViewCellColor: '#fefefe',
		weekdaysHeight: 22,
		weekdaysColor: '#5da1c0',
		currMonthColor: '#797979',
		nonCurrMonthColor: 'rgb(200,200,200)'
	};
  var clickLastEle={};
  var data_get_ADPolicy=[];
	var beginSearchAdvSchedule=false;//是否用户操作过搜索(搜索广告位或搜索日期)。
	var hasBindAdPositionEvent=false;
  var initUI=function(){
    initCalendar();
		initPara();
		getAllAdvFromServer();
		getServerData();
		if(jQ_("#schedule_tableB_thread").find("tr").eq(2).find("td").eq(0).text()==""){
			drawTabel3("blank");
		}
		else{
			adv__schedule_.chooseTd(jQ_("#schedule_tableB_thread").find(".sche_table_td_colored_choosed"))
		}
    //initSite();
  };
	
	var initPara=function(){
		sTime.push(document.getElementById("sche__start-datepicker-input").value);//初始值
    eTime.push(document.getElementById("sche__end-datepicker-input").value);
	};
	
  function format_date(date_){
		var y = lessTenPluwZero(date_.getFullYear());
    var m = lessTenPluwZero(date_.getMonth()+1);//获取当前月份的日期
    var d = lessTenPluwZero(date_.getDate());
    return y+"-"+m+"-"+d;
	};
	
	function lessTenPluwZero(object){//如 把 2014-9-6 转化为 2014-09-06
		if (object < 10){ 
			object="0" + object;
		} 
		return object;
	}
	
  var initCalendar=function(){
	  var jq=jQuery;
	  var today=new Date();
		var year=today.getFullYear();
	  var month=today.getMonth()+1;
    var beginDate =new Date();
		var endDate = new Date(year,month,0);
		jq("#sche_panel_calendar_selectors").daterangepicker({
			startDate:beginDate,
			endDate:endDate,
			calendarShowCallback:function(){
				jq("#sche__start").css("border","0");
	    	jq("#sche__end").css("border","0");
			},
			containerid:"sche_title_container",
			updateCallback:function(startDate,endDate){
				jq("#sche__start-datepicker-input").val(startDate);
				jq("#sche__end-datepicker-input").val(endDate);
			}
    });
		/*
			var calendarStyles = {
			width: 198,
			navTitleHeight: 20,
			navTitleBgColor: '#5da1c0',
			datesViewHeight: 150,
			datesViewGridColor: '#e2e2e2',
			datesViewCellColor: '#ffffff',
			weekdaysHeight: 20,
			weekdaysColor: '#000000',
			currMonthColor: '#737373',
			nonCurrMonthColor: '#e2e2e2'
			};
			this.adv_datePicker_startDate = new DateSchedulePicker({
			containerId: 'sche__start',
			calendarStyles: calendarStyles,
			dateInputStyles: {
				borderColor: '#e2e2e2'
			},
			iconImage: 'image/adv_calendar_icon.png'
			});

			this.adv_datePicker_endDate = new DateSchedulePicker({
			containerId: 'sche__end',
			calendarStyles: calendarStyles,
			dateInputStyles: {
				borderColor: '#eaeaea'
			},
			iconImage: 'image/adv_calendar_icon.png'
			});

		 this.adv_datePicker_startDate.onChange=function(){
			adv__schedule.removeDateError()
		 };
		this.adv_datePicker_endDate.onChange=function(){
			adv__schedule.removeDateError()
		 }
		 var today= new Date();
		 var year=today.getFullYear();
		 var month=today.getMonth()+1;
		 beginDate =format_date(today);//当月的第一天。
		 endDate = format_date(new Date(year,month,0));//当月的最后一天。
		 jq("#sche__start-datepicker-input").val(beginDate);
		 jq("#sche__end-datepicker-input").val(endDate);
		*/
	 
	};
	
	adv__schedule_.removeDateError=function(){
	  var jq=jQuery;
		if(jq("#sche__start-datepicker-input").val()==""){

		}
		else if(jq("#sche__end-datepicker-input").val()==""){

		}
		else{
		  if(new Date(jq("#sche__start-datepicker-input").val()).getTime()>new Date(jq("#sche__end-datepicker-input").val()).getTime())
		  {
		  }
		  else{
			 jq("#sche__start").css("border",0);
			 jq("#sche__end").css("border",0);
			 jq(".input_restrict_err").each(function(){
				jq(this).removeClass("input_restrict_err")
			 })
		  }
		}
	};
		
	var checkTime=function(){
			var ret = null;
			var fromdate = jQuery('input[name=date-from]').val();
			var fromtime = jQuery('input[name=time-from]').val();
			var todate = jQuery('input[name=date-to]').val();
			var totime = jQuery('input[name=time-to]').val();

			if(fromdate == '' || todate == ''){
				ret = 0;
				return ret;
			}
			var timezone = getTimezone();
			var fromfullstr = fromdate + 'T' + fromtime + timezone;
			var tofullstr = todate + 'T' + totime + timezone;
			if(fromfullstr > tofullstr){
				ret = 1;
				return ret;
			}
			ret = {
				fromdate: fromdate,
				todate: todate,
				fromtime: fromtime,
				totime: totime,
				fromfullstr: fromfullstr,
				tofullstr: tofullstr
			};
			return ret;
		}
		
	var formatToDateString=function(year, month, date){
		var str = '';
		str += year;
		str += '-';
		str += preZero(month+1,2);
		str += '-';
		str += preZero(date,2);
		return str;
	}
	var preZero=function(num, len){
		var str = num.toString();
		while(str.length < len){
			str = '0' + str;
		}
		return str;
	}
	
	var removeZero=function(str_){
	    if(str_.substring(0,1)=="0")
        {
			return str_.substring(1,2)
		}
		else{return str_}
	}
  
  var drawTitle=function(id_){
    var htmlA="";
    var htmlB="";
    for(var i=0;i<26;i++){
      var alpha_=String.fromCharCode(65+i);
	  if(id_=="schedule_siteBodyTitle")
      {
	  htmlA="<div onclick=\"adv__schedule.getData_byLetter(adv__schedule.allSite,'all','schedule_siteContainer',this)\" class=\"selected_letter\" style=\"background-color:#417897;cursor:pointer\">全部</div>";
	  htmlB=htmlB+"<div onclick=\"adv__schedule.getData_byLetter(adv__schedule.allSite,\'"+alpha_+"\','schedule_siteContainer',this)\" style=\"cursor:pointer\">"+alpha_+"</div>";
	  }//输出A-Z  26个大写字母
	  else {
	  htmlA="<div onclick=\"adv__schedule.getData_byLetter(adv__schedule.allAdvData,'all','schedule_advIdContainer',this)\" class=\"selected_letter\" style=\"background-color:#417897;cursor:pointer\">全部</div>";
	  htmlB=htmlB+"<div onclick=\"adv__schedule.getData_byLetter(adv__schedule.allAdvData,\'"+alpha_+"\','schedule_advIdContainer',this)\" style=\"cursor:pointer\">"+alpha_+"</div>";}//输出A-Z  26个大写字母
    }
    $(id_).innerHTML=(htmlA+htmlB);
  }
  var drawTableA=function(array_,id_,drawBottom,defaultSelected,isFirstDraw){
		 var jq=jQuery;
		 if(id_=="schedule_advIdContainer"){
			jq("#schedule_advIdContainer_container").empty();
			jq("#schedule_advIdContainer_container").append("<div id=\"schedule_advIdContainer\" style=\"height:155px;\"></div>");
		 };
		 jQuery("#"+id_+"").empty();
		 var checkboxName="";
		 var bottomContainerId="";
		 if(id_=="schedule_siteContainer"){
			checkboxName="site"
		 }
		 else{
			checkboxName="adv";
			bottomContainerId="schedule_choosedRegion_adv";
			//jq("#"+bottomContainerId+"").append("<div style=\"float:left\">"+i18n("SCHEDULE_YIXUANGUANGGAOWEI")+"：</div>");
		 };
    if(array_.length!=0)
    {
      var len=array_.length;
      var rowLen= Math.ceil(len/4);
      var html_="";
			
      for(var i=0;i<len;i++)
      {
			  var obj_=array_[i];
				name__=obj_.name;
			  if(checkboxName=="site"){id__=obj_.id}
        else{id__=obj_.ext_id};
				var width=(((i+1)%4==0)?"calc(100% - 515px)":"166px");
				var checkboxStyle=(defaultSelected?"block":"none")
        html_=html_+"<div class=\"tdInLineS_ sche_inline_block\" style=\"width:"+width+"\"><div class=\"schedula_site_checkbox sche_inline_block_checkbox\" name=\""+checkboxName+"\"><div style=\"display:"+checkboxStyle+"\"></div></div><div dataId=\""+id__+"\" class=\"sche_inline_block_text\">"+name__+"</div></div>"
      };
      $(id_).innerHTML=("<div class=\"schedule_flex_wrap_container\" style=\"margin-top:-2px;width:calc(100% - 11px);margin-left:11px\" border=\"0\">"+html_+"</div>");
			
			jq("#schedule_advIdContainer").mCustomScrollbar({
				theme:"my-theme"
			});
		};
		if(checkboxName=="adv"){
			if(drawBottom){//只有首次打开广告弹框时，才加载底部，切换字幕时，不加载。
				jq("#"+bottomContainerId+"").empty();
				for(var i= 1,len = array_.length;i<len;i++){//第一个全选不需要
					var id=array_[i].ext_id||"";
					var name=array_[i].name||"";
					var width=(((i+1)%4==0)?"166px":"166px"); 
					jq("#schedule_choosedRegion_adv").append("<div class=\"tdInLineS_ sche_inline_block_b\" style=\"width:"+width+"\" name=\"adv\"><div class=\"schedula_site_checkbox sche_inline_block_checkbox_b\"><div></div></div><div class=\"sche_inline_block_text_b\" dataid=\""+id+"\">"+name+"</div></div>")
				};
				jq("#schedule_choosedRegion_adv_container").mCustomScrollbar({
					theme:"my-theme"
				});
			}
		};
  }
  
  var drawTableA_site = function(array_, id_) {
		var jq=jQuery;
    var checkboxName = "";
		jq("#schedule_siteContainer_container").empty();
		jq("#schedule_siteContainer_container").append("<div id=\"schedule_siteContainer\" class=\"schedule_siteContainer\" style=\"height:155px;\"></div>");
    if (id_ == "schedule_siteContainer") {
      checkboxName = "site"
    } else {
      checkboxName = "adv"
    };
		var colNumInOneRow=5;
    if (array_.length != 0) {
			var len = array_.length;
			var html = "";
			for(var i=0;i<len;i++){
				var obj=array_[i];
				var name=obj.name||"";
				var id=obj.id||"";
				var width=(((i+1)%colNumInOneRow==0)?"calc(100% - 500px)":"125px");
				html=html+"<div onclick=\"adv__schedule.chooseTdB(this)\" dataId=\""+id+"\" style=\"text-align:center;cursor:pointer;margin-top:11px;min-height:24px;line-height:24px;width:"+width+"\">"+name+"</div>"
			};
			$("schedule_siteContainer").innerHTML=("<div class=\"schedule_flex_wrap_container\" style=\"margin-top:-2px;width:100%;margin-left:0px\" border=\"0\">"+html+"</div>");
			jq("#schedule_siteContainer").mCustomScrollbar({
				theme:"my-theme"
			});
    }
  }
  var getAllSite=function(){
		try {
			if(typeof(dmRootUri)=="undefined"){return};
			var url_= dmRootUri+"/site";
			jQuery.ajax({
      type: "GET",
      async: false,
      url: url_,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
				}
			}).done(function (resp) {
				allSite=resp;
				adv__schedule_.allSite=allSite;
				if(allSite&&allSite.length>0)
				{
					var len_=allSite.length;
					drawTableA_site(allSite,"schedule_siteContainer");
				}
			})
		}
		catch(err){}
  }
  
  
adv__schedule_.getData_byLetter=function(data,letter,id_,obj){
	var jq=jQuery;
	var title_colored=jq("#"+id_+"").parent().parent().children().eq(0).find(".selected_letter").eq(0);
	jq(title_colored).css("background","none").removeClass("selected_letter");
	jq(obj).css("background","#417897").addClass("selected_letter");
	var array_=[];
	var letter_=letter.toLowerCase();
	if(letter!="all")
	{
		for(var i = 0; i < data.length; i++) {
			if( (data[i].name.substring(0,1).toLowerCase()==letter_)||( ConvertPinyin_(data[i].name).toLowerCase().substring(0,1)==letter_)  )
			{
				array_.push(data[i])
			}
		};
	}
	else{
		array_=data
	}
	if(id_=="schedule_siteContainer"){
		var dataId=siteID||"";
		drawTableA_site(array_,id_);
	  jq("#schedule_siteContainer").find("div[dataid=\""+dataId+"\"]").css({"background-color":"#5ca1c0","color":"#ebffff"});
	  jq("#schedule_siteContainer").find("div[dataid=\""+dataId+"\"]").attr("id","sche_choosedTdInTableB");
	}
	else{
		var newArrayTransfer=[{
			ext_id:"all",
			id:"all",
			name:i18n("SCHEDULE_CHOOSE_ALL_ADV")
		}];
		for(var i= 0,len = array_.length;i<len;i++){
			newArrayTransfer.push(array_[i])
		}
		drawTableA(newArrayTransfer,id_,false,false,false);
		var totalLen=jq("#schedule_advIdContainer").find(".sche_inline_block_text").length-1;
		var selectedCheckboxLen=0;
		jq("#schedule_advIdContainer").find(".sche_inline_block_text").each(function(index){
			var dataId=jq(this).attr("dataid");
			if(jq("#schedule_choosedRegion_adv").find("div[dataid=\""+dataId+"\"]").parent().css("display")!="none"){
				jq(this).parent().find(".schedula_site_checkbox").children().show();
				if(index!=0){
					selectedCheckboxLen+=1
				}
			}
		});
		if(selectedCheckboxLen==totalLen){
			jq("#schedule_advIdContainer").find(".schedula_site_checkbox").eq(0).children().show();
		}
		else{
			jq("#schedule_advIdContainer").find(".schedula_site_checkbox").eq(0).children().hide();
		}
	};
	if(id_=="schedule_siteContainer"){
		bindEvent();
	}
};
  var initSite=function(){
    siteID_old=siteID;
    drawTitle("schedule_siteBodyTitle");
      getAllSite();
      /*
	try {
　　 getAllSite();
　　} catch(error) {
　　} finally {
　　}
  */
   
  };

  var initAdv=function(){
    advID_old=advID;
    drawTitle("schedule_advIdBodyTitle");
    getAllAdv()
  };
	
	var getAllAdvFromServer=function(){
		var url_ = paasHost + paasAdvDomain;
		var siteID_="";
		if(typeof(siteID)!="undefined"){
		siteID_=siteID;
		if(siteChange=="change")//重新选择了站点
		{
			jQuery("#tdInLineS_adv").remove();
			siteChange=""
		}
		};
		var str_siteid=""
		if( (typeof AdvSystemType !="undefined")&&(AdvSystemType=="central") ){
			if(siteID_==""){
			if(typeof AdvSelfSiteId !="undefined"){
			siteID_=AdvSelfSiteId;
			}
		}
		str_siteid=("&site_id="+siteID_)
		}
		var urlA=url_+"/ads/imgadp/imgadps?"+token_ + new Date().toISOString()+str_siteid;
		var urlB=url_+"/ads/videoadp/videoadps?"+token_ + new Date().toISOString()+str_siteid;
		var urlC=url_+"/ads/subtitleadp/subtitleadps?"+token_ + new Date().toISOString()+str_siteid;
		var pic_=getAdvName(urlA);
		var video_=getAdvName(urlB);
		var subtitle_=getAdvName(urlC);
		var newArray=pic_.concat(video_,subtitle_);
		var temp=[];
		for(var i= 0,len = newArray.length;i<len;i++){
			temp.push(newArray[i].ext_id)
		};
		advID=temp.join(",");//默认所有广告
		adv__schedule_.allAdvData=newArray;
	};
	
  var getAllAdv=function(){
		var newArrayTransfer=[{
			ext_id:"all",
	    id:"all",
			name:i18n("SCHEDULE_CHOOSE_ALL_ADV")
		}];
		var allAdvData=adv__schedule_.allAdvData;
		for(var i= 0,len = allAdvData.length;i<len;i++){
			newArrayTransfer.push(allAdvData[i])
		};
		drawTableA(newArrayTransfer,"schedule_advIdContainer",true,true,true);
		if(!hasBindAdPositionEvent){
			hasBindAdPositionEvent=true;
			bindEventAdv();
		}
  };
  
  
  var bindEventAdv=function(){
		var jq=jQuery;
		var self=this;
		//上半部分事件
		jq("#schedule_adv_butB").click(function(){ 
			jq("#schedule_advIdContainer").find(".sche_inline_block_checkbox").each(function(){
				jq(this).children().hide()
			})
			jq("#schedule_choosedRegion_adv").find(".sche_inline_block_b").each(function(){
				jq(this).hide()
			})
		});
		jq("#schedule_advIdContainer_container").on('click', '.sche_inline_block_checkbox', function (event,index) {
			var totalLen=jq("#schedule_advIdContainer").find(".sche_inline_block_text").length-1;
			hasClickedAdv=true;
			var dataId=jq(this).parent().find(".sche_inline_block_text").attr("dataid");
			if(dataId!="all"){ 
				if(jq(this).children().css("display")=="block"){
					jq(this).children().css("display","none");
					jq("#schedule_choosedRegion_adv").find("div[dataid=\""+dataId+"\"]").parent().hide();
				}
				else{
					jq(this).children().css("display","block");
					jq("#schedule_choosedRegion_adv").find("div[dataid=\""+dataId+"\"]").parent().show();
				};
				var selectedCheckboxLen=0;
				jq("#schedule_advIdContainer").find(".schedula_site_checkbox").children().each(function(index){
					if(index!=0){
						if(jq(this).css("display")=="block"){
							selectedCheckboxLen+=1
						}
					}
				});
				if(selectedCheckboxLen==totalLen){
					jq("#schedule_advIdContainer").find(".schedula_site_checkbox").eq(0).children().show();
				}
				else{
					jq("#schedule_advIdContainer").find(".schedula_site_checkbox").eq(0).children().hide();
				}
			}
			else{//全选
				//在全部里勾选选择全部广告位
				if(jq("#schedule_advIdBodyTitle").find(".selected_letter").eq(0).text()==i18n("SCHEDULE_CHOOSE_ALL")){
					if(jq(this).children().css("display")=="block"){
						jq("#schedule_advIdContainer").find(".sche_inline_block_checkbox").each(function(){
							jq(this).children().hide()
						})
						jq("#schedule_choosedRegion_adv").find(".sche_inline_block_b").each(function(){
							jq(this).hide()
						})
					}
					else{
						jq("#schedule_advIdContainer").find(".sche_inline_block_checkbox").each(function(){
							jq(this).children().show()
						})
						jq("#schedule_choosedRegion_adv").find(".sche_inline_block_b").each(function(){
							jq(this).show()
						})
					}
				}
				else{//在分字母里勾选选择全部广告位
					if(jq(this).children().css("display")=="block"){
						jq("#schedule_advIdContainer").find(".sche_inline_block_checkbox").each(function(){
							jq(this).children().hide()
						})
						jq("#schedule_advIdContainer").find(".sche_inline_block_text").each(function(dataIndex){
							if(dataIndex>0){//第一个是选择全部广告位
								var dataId=jq(this).attr("dataid");
								jq("#schedule_choosedRegion_adv").find("div[dataid=\""+dataId+"\"]").parent().hide();
							}
						})
					}
					else{
						jq("#schedule_advIdContainer").find(".sche_inline_block_checkbox").each(function(){
							jq(this).children().show()
						})
						jq("#schedule_advIdContainer").find(".sche_inline_block_text").each(function(dataIndex){
							if(dataIndex>0){//第一个是选择全部广告位
								var dataId=jq(this).attr("dataid");
								jq("#schedule_choosedRegion_adv").find("div[dataid=\""+dataId+"\"]").parent().show();
							}
						})
					}
				}
			}
		})
		//下半部分事件
		jq("#schedule_choosedRegion_adv").on('click', '.sche_inline_block_checkbox_b', function (event,index) {
			hasClickedAdv=true;
			var dataId=jq(this).parent().find(".sche_inline_block_text_b").attr("dataid");
			if(jq(this).children().css("display")=="block"){
				jq(this).children().css("display","none");
				jq("#schedule_advIdContainer").find("div[dataid=\""+dataId+"\"]").parent().find(".sche_inline_block_checkbox").children().hide();
			}
			else{
				jq(this).children().css("display","block");
				jq("#schedule_advIdContainer").find("div[dataid=\""+dataId+"\"]").parent().find(".sche_inline_block_checkbox").children().show();
			}
		})
	}
	
  adv__schedule_.switchCheckBox=function(obj_){
	 var jq=jQuery;
	 var temp=jq(obj_).children("div");
	 if(jq(temp).css("display")=="block")
	 {
		jq(temp).css("display","none");
		advID=""
	 }
	 else{
		jq(temp).css("display","block");
	 }
  }
  
  var getAdvName=function(url_){
	if(typeof my.paas.platform_current_id!="undefined"){
		url_+= "&platform_id="+ my.paas.platform_current_id;
	};
    var array_=[];
    jQuery.ajax({
      type: "GET",
      async: false,
      url: url_,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-aqua-sign": getPaaS_x_aqua_sign("GET", url_)
      }
    }).done(function (resp) {
          for(var i = 0; i < resp.length; i++) {
            array_.push(resp[i])
          };
        })
    return array_
  }
  var closeOthers=function(id_){
    var divIdArray=["schedule_siteBody","schedule_advIdBody"];
    for(var a=0;a<divIdArray.length;a++)
    {
      if(divIdArray[a]!=id_){$(divIdArray[a]).style.display="none"}
    }
  }
  var bindEvent=function(){
    var  t=$$('schedula_site_checkbox')
    var len = $$('schedula_site_checkbox').length;
		var jq=jQuery;
	  jQ_("#Title_aboveTable__").bind('click', function () {
			var src_=jQ_(this).find(".shrink_img").attr("src");
			if(src_.indexOf("shrinkDown")!=-1)
			{
				jQ_(this).find(".shrink_img").attr("src","image/shrinkUp.png");
				jQ_("#schedule_tableC_container").hide();
				jQ_("#sche_regionA").css("height","calc(100% - 42px)");
				jQ_("#sche_regionA__").css("height","0px");
			}
			else{
				jQ_(this).find(".shrink_img").attr("src","image/shrinkDown.png");
				jQ_("#schedule_tableC_container").show();
				jQ_("#sche_regionA").height("46%");
				jQ_("#sche_regionA__").css("height","53%");
			}
		});
    for (var a = 0; a < len; a++) {t[a].onclick = function (){
			var checkBoxName=this.getAttribute("name");
			if(this.children[0].style.display=="none"){
				this.children[0].style.display="block";
				if(clickLastEle!=this){
					if(clickLastEle&&clickLastEle.children&&clickLastEle.children[0]){
						clickLastEle.children[0].style.display="none";
					}
				}
				var name__=this.nextSibling.innerHTML;
				var id__=this.nextSibling.getAttribute("dataid");
				if(checkBoxName=="site")
				{siteID=id__;}
				else{
				advID=id__;
				}
				jQ_("#schedule_choosedRegion_"+checkBoxName+"").find(".tdInLineS_").each(function(){
					jQ_(this).remove();
				}); 
				
				jQuery("#schedule_choosedRegion_"+checkBoxName+"").append("<div class=\"tdInLineS_\" name=\""+checkBoxName+"\" style=\"width:auto;height:auto;margin-left:20px\"><div class=\"schedula_site_checkbox\" style=\"display:block;margin-left:11px;height:13px;width:13px\"><div></div></div><div class=\"note_text_\" dataid=\""+id__+"\" style=\"height:24px;line-height:24px;margin-left:6px\">"+name__+"</div></div>")
				
				var str__="#tdInLineS_"+checkBoxName+"";
				jQuery(str__).bind('click', function () {
				switch(jQ_(str__).find(".schedula_site_checkbox").children("div").css("display"))
				{
					case "none":
					jQ_(str__).find(".schedula_site_checkbox").children("div").css("display","block");
					break;
					case "block":
					jQ_(str__).find(".schedula_site_checkbox").children("div").css("display","none");
					break;
					default:
					 break;
				}
				});
				clickLastEle=this;
			}
			else{
			this.children[0].style.display="none";
			var id__=this.nextSibling.getAttribute("dataid");
			jQuery("#schedule_choosedRegion_site").find(".note_text_").each(function(){
				if(jQuery(this).attr("dataid")==id__){jQuery(this).closest(".tdInLineS_").remove();}
			});
			}
    }}
    $('schedule_site_downMenu').onclick = function (){switchDisplay("schedule_siteBody")}
    $('schedule_advId_downMenu').onclick = function (){switchDisplay("schedule_advIdBody")}
	  $('sche_searchByConditions').onclick = function (){
	     var jq=jQuery;
			 sTime=[];
			 eTime=[];
			 sTime.push(jq("#sche__start-datepicker-input").val());
			 eTime.push(jq("#sche__end-datepicker-input").val());
			 get_adPolicy_by_schedule();
      }
    $('schedule_siteBody_butA').onclick = function (){
      switchDisplay("schedule_siteBody");
    }
    $('schedule_siteBody_butB').onclick = function (){switchDisplay("schedule_siteBody","cancel")}
	  $('schedule_adv_butA').onclick = function (){
		  var temp=[];
		  jq("#schedule_choosedRegion_adv").find(".sche_inline_block_text_b").each(function(){
				if(jq(this).parent().css("display")!="none"){
					temp.push(jq(this).attr("dataid"));
				}
			});
			advID=temp.join(",");
			switchDisplay("schedule_advIdBody");
			get_adPolicy_by_schedule();
    }
  }
  adv__schedule_.chooseTd=function (obj) {
	  var jq=jQuery;
    if(jQuery(obj).attr("click_")=="true"){
		//jQ_("#sche_choosedTdInTable").css("background-color","#9bd8f4");
		jQ_("#sche_choosedTdInTable").removeClass("sche_table_td_colored_choosed");
		jQ_("#sche_choosedTdInTable").attr("id","");
		jQ_(obj).addClass("sche_table_td_colored_choosed");
		jQuery(obj).attr("id","sche_choosedTdInTable");
		var str_t=encodeURIComponent("+")+"0800";
		sTime=milSeceondToYYMMDDT(parseInt(jQuery(obj).attr("milbegin")))+"T00:00:00"+str_t;
		eTime=milSeceondToYYMMDDT(parseInt(jQuery(obj).attr("milend")))+"T23:59:59"+str_t;
		var currentAdvId=jq(obj).closest("tr").find("td").eq(0).attr("dataid");
		var currentAdvName=jq(obj).closest("tr").find("td").eq(0).text();
		get_adPolicy_by_schedule_choosed(currentAdvId,currentAdvName);
		}
	 }
  adv__schedule_.chooseTdB=function (obj) {
    jQ_("#sche_choosedTdInTableB").css({"background-color":"#ffffff","color":"#7d7d7d"});
	  jQ_("#sche_choosedTdInTableB").attr("id","");
	  jQ_(obj).css({"background-color":"#5ca1c0","color":"#ebffff"});
	  jQuery(obj).attr("id","sche_choosedTdInTableB");
	  siteID=jQuery(obj).attr("dataid");
  }
  
  var milSeceondToYYMMDDT=function(milSecond){
		var date = new Date(milSecond);
		Y = date.getFullYear() + '-';
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		D=date.getDate()+1 < 10 ? ('0'+(date.getDate())) : date.getDate();
		return(Y+M+D);
  }
   
  var get_adPolicy_by_schedule_choosed=function(currentAdvId,currentAdvName){
	  var jq=jQuery;
		if( (typeof AdvSystemType !="undefined")&&(AdvSystemType=="local") ){
			if(typeof AdvSystemType !="undefined"){siteID=AdvSelfSiteId}
		}
		if( (typeof AdvSystemType !="undefined")&&(AdvSystemType=="central") ){
			if(siteID==""){
				if(typeof AdvSelfSiteId !="undefined"){
					siteID=AdvSelfSiteId;
				}
			}
		};
		var choosedDate=sTime.substring(0,10).split("-");
		jq("#sche_shot_detail_adv_name").text("("+currentAdvName);
		jq("#sche_shot_detail_current_date").text(removeZero(choosedDate[0])+i18n("SCHEDULE_CALENDAR_YEAR")+removeZero(choosedDate[1])+i18n("SCHEDULE_CALENDAR_MONTH")+removeZero(choosedDate[2])+i18n("SCHEDULE_CALENDAR_DAY")+")")
    //var url_= paasHost + paasAdvDomain+"/ads/adpolicy/adpolicys/schedule?adp_ext_id="+advID+"&start_time="+sTime+"&end_time="+eTime+"&site_id="+siteID+"";
		var url_= paasHost + paasAdvDomain;
		url_+="/ads/adpolicy/adpolicys/schedule?adp_ext_id="+encodeURIComponent(currentAdvId)+"";
		url_+="&start_time="+sTime+"&end_time="+eTime+"";
    url_=url_+"&"+token_ + new Date().toISOString();
	  var xhr_= new XMLHttpRequest();
    var method="GET";
    xhr_.open(method, url_, false);
    xhr_.setRequestHeader("Content-Type", "application/json");
    xhr_.setRequestHeader("Accept", "application/json");
    xhr_.send();
    jQuery("#schedule_tableC tbody").empty();
    if( (xhr_.readyState == 4)&&(xhr_.status == 200)&&(xhr_.responseText)){
			var json_=JSON.parse(xhr_.responseText);
			get_adPolicy_serverData=json_;
			drawTabel3();
    }
		else{
			drawTabel3("blank");
		}
  }
  
  var drawFirstTable = function(sTime_a,eTime_a,sTime_b,eTime_b){
		var tableHtml="<table id=\"schedule_tableB\" cellspacing=\"0\" style=\"border-color:#dee9ed;width:100%;table-layout: fixed;\"><thead id=\"schedule_tableB_thread\" style=\"color:#e2f8ff;background-color:#82b2c8;\"></thead></table>";
		$("schedule_tableB_container").innerHTML=tableHtml;//画table
		drawTable1Row1(sTime_a,eTime_a,sTime_b,eTime_b);
		drawTable1Row2(sTime_a,eTime_a,sTime_b,eTime_b);
  }
  
  var drawTable1Row1 = function(sTime_a,eTime_a,sTime_b,eTime_b){
    jQuery("#schedule_tableB thead").empty();
	var td_r1c1="<td style=\"width:197px;text-align: center;overflow: hidden; font-weight: bold; word-break: keep-all; white-space: nowrap; text-overflow: ellipsis;height:20px;border-right:1px #f4edf4 solid;border-top:1px #f4edf4 solid;\" rowspan=\"2\">"+i18n('SCHEDULE_GUANGGAOWEIMINGCHENG')+"</td>";
	var sTime_a_split=sTime_a.split("-");
	var sTime_a_new=sTime_a_split[0]+"年"+removeZero(sTime_a_split[1])+"月"; 
	var eTime_a_split=eTime_a.split("-");
	var eTime_a_new=eTime_a_split[0]+"年"+removeZero(eTime_a_split[1])+"月"; 
	var sTime_b_split=sTime_b.split("-");
	var sTime_b_new=sTime_b_split[0]+"年"+removeZero(sTime_b_split[1])+"月"; 
	var eTime_b_split=eTime_b.split("-");
	var eTime_b_new=eTime_b_split[0]+"年"+removeZero(eTime_b_split[1])+"月"; 
	
	var calendar1MonthDaysCount=days__(sTime_a_split[0],sTime_a_split[1]);
	var calendar2MonthDaysCount=days__(sTime_b_split[0],sTime_b_split[1]);
	var calendar1MonthDaysCount_width=20*calendar1MonthDaysCount+"px";
	var calendar2MonthDaysCount_width=20*calendar2MonthDaysCount+"px";
	if( (sTime_a.substring(0,10)==eTime_a.substring(0,10))&&(sTime_b.substring(0,10)==eTime_b.substring(0,10)) ){ //选择一段时间
		dateChooseType="chooseOneTimeRange_differentMonth";
		if(  (sTime_a_split[0]==sTime_b_split[0])&&(removeZero(sTime_a_split[1])==removeZero(sTime_b_split[1])) ){
			dateChooseType="chooseOneTimeRange_oneYearoneMonth";
		}
		else if(  (sTime_a_split[0]==sTime_b_split[0])&&(removeZero(sTime_a_split[1])!=removeZero(sTime_b_split[1])) ){
			dateChooseType="chooseOneTimeRange_oneYeardifferentMonth";
		}
				else if(sTime_a_split[0]!=sTime_b_split[0]){
			dateChooseType="differentYear";
		}
	}
	else{
		if(sTime_a_new!=sTime_b_new){
			dateChooseType="chooseTwoTimeRange_twoDifferentMonth";//选择两段日期，两段日期不在同一月
		}
		else{
			dateChooseType="chooseTwoTimeRange_twoSameMonth";
		}
    }		
	var commonStyle="text-align: center;overflow: hidden; font-weight: bold; word-break: keep-all; white-space: nowrap; text-overflow: ellipsis;height:20px;border-right:1px #f4edf4 solid;border-top:1px #f4edf4 solid;";
	var tr1td1="<td colspan="+calendar1MonthDaysCount+" style=\"width:"+calendar1MonthDaysCount_width+";"+commonStyle+"\">"+sTime_a_new+"</td>";
    var tr1td2="<td colspan="+calendar2MonthDaysCount+" style=\"width:"+calendar2MonthDaysCount_width+";"+commonStyle+"\">"+sTime_b_new+"</td>";
	switch(dateChooseType)
	{
	  case "chooseTwoTimeRange_twoDifferentMonth":
		  jQuery("#schedule_tableB thead").append("<tr>"+td_r1c1+""+tr1td1+""+tr1td2+"</tr>")
	  break;
	  	case "chooseTwoTimeRange_twoSameMonth":
		  jQuery("#schedule_tableB thead").append("<tr>"+td_r1c1+""+tr1td1+"</tr>")
	  break;
	  	case "chooseOneTimeRange_oneYearoneMonth":
		  jQuery("#schedule_tableB thead").append("<tr>"+td_r1c1+""+tr1td1+"</tr>")
	  break;
	  case "chooseOneTimeRange_oneYeardifferentMonth":
	      var beginMonth=parseInt(removeZero(sTime_a_split[1]));
		  var endMonth=parseInt(eTime_b_split[1]);
		  var tr1td1="";
		  for(var a=beginMonth;a<endMonth+1;a++)
		  {
		  	var colspan=days__(sTime_a_split[0],a);
	        var width_=20*colspan+"px";
			tr1td1=tr1td1+"<td colspan="+colspan+" style=\"width:"+width_+";"+commonStyle+"\">"+(sTime_a_split[0]+"年"+a+"月")+"</td>"
		  }
		  jQuery("#schedule_tableB thead").append("<tr>"+td_r1c1+""+tr1td1+"</tr>")
	  break;
	  case "differentYear":
		var maxMonth=12;
		var beginRange="";
		var endRange="";
		var middleRange="";
		var firstYearBeginMonth=parseInt(removeZero(sTime_a_split[1]));
		var firstYearEndMonth=maxMonth;
		for(var a=firstYearBeginMonth;a<firstYearEndMonth+1;a++)
		  {
		  	var colspan=days__(sTime_a_split[0],a);
	        var width_=20*colspan+"px";
			beginRange=beginRange+"<td colspan="+colspan+" style=\"width:"+width_+";"+commonStyle+"\">"+(sTime_a_split[0]+"年"+a+"月")+"</td>"
		  }
		 if( (eTime_b_split[0]-sTime_a_split[0])>1 ){//跨年
            var middel_=(eTime_b_split[0]-sTime_a_split[0]);
			for(var a=sTime_a_split[0];a<eTime_b_split[0]+1;a++)
			{
			  var months=12;
	          for(var b=1;b<months+1;b++)
			  {
			    var colspan=days__(a,b);
	            var width_=20*colspan+"px";
				middleRange=middleRange+"<td colspan="+colspan+" style=\"width:"+width_+";"+commonStyle+"\">"+(a+"年"+b+"月")+"</td>"
			  };
			}

		 
			var lastYearBeginMonth=1;
			var lastYearEndMonth=parseInt(removeZero(eTime_b_split[1]));
			for(var a=lastYearBeginMonth;a<lastYearEndMonth+1;a++)
			{
			  var colspan=days__(eTime_b_split[0],a);
	          var width_=20*colspan+"px";
			  endRange=endRange+"<td colspan="+colspan+" style=\"width:"+width_+";"+commonStyle+"\">"+(eTime_b_split[0]+"年"+a+"月")+"</td>"
			}
			var tr1td1=beginRange+middleRange+endRange;
		 jQuery("#schedule_tableB thead").append("<tr>"+td_r1c1+""+tr1td1+"</tr>")
		 }
		 else{
			var lastYearBeginMonth=1;
			var lastYearEndMonth=parseInt(removeZero(eTime_b_split[1]));
			for(var a=lastYearBeginMonth;a<lastYearEndMonth+1;a++)
			{
			  var colspan=days__(eTime_b_split[0],a);
	          var width_=20*colspan+"px";
			  endRange=endRange+"<td colspan="+colspan+" style=\"width:"+width_+";"+commonStyle+"\">"+(eTime_b_split[0]+"年"+a+"月")+"</td>"
			}
					 var tr1td1=beginRange+endRange;
		 jQuery("#schedule_tableB thead").append("<tr>"+td_r1c1+""+tr1td1+"</tr>")
		 }
	default:
	   break;
	}
	return;
  }
   
var drawTable1Row2 = function(sTime_a, eTime_a, sTime_b, eTime_b) {
	var theadElement = jQuery("#schedule_tableB thead").find("td");
	var colspanArray = [];
	for (var a = 0; a < theadElement.length; a++) {
			if (a == 0) {
					continue
			};
			colspanArray.push(jQ_("#schedule_tableB thead").find("td").eq(a).attr("colspan"))
	}

	var html_ = "<tr>";
	for (var a = 0; a < colspanArray.length; a++) {
			var html_tdUnit = "";
			var tmp = parseInt(colspanArray[a]);
			for (var b = 1; b < tmp + 1; b++) { //每个月的天数
					html_tdUnit = html_tdUnit + "<td monthValue=\"" + a + "\"style=\"border-right:1px #f4edf4 solid;border-top:1px #f4edf4 solid;width:20px;height:20px;line-height:20px;text-align:center\">" + b + "</td>";
			} //monthValue 表示属于第一行的哪个区间下
			html_ = html_ + html_tdUnit
	}
	html_ = html_ + "</tr>";
	jQuery("#schedule_tableB thead").append(html_); // 第二行，画天数。
	drawTable1Row3(colspanArray, sTime_a, eTime_a, sTime_b, eTime_b);
}

var drawTable1Row3 = function(colspanArray, sTime_a, eTime_a, sTime_b, eTime_b) {
    var jq=jQuery;
    var sTime_a_Y = sTime_a.substring(0, 4);
    var sTime_a_M = parseInt(sTime_a.substring(5, 7)) - 1;
    var sTime_a_D = sTime_a.substring(8, 10);
    var calendar1begin = new Date(sTime_a_Y, sTime_a_M, sTime_a_D, 00, 00, 00).getTime();
    var eTime_a_Y = eTime_a.substring(0, 4);
    var eTime_a_M = parseInt(eTime_a.substring(5, 7)) - 1;
    var eTime_a_D = eTime_a.substring(8, 10);
    var calendar1end = new Date(eTime_a_Y, eTime_a_M, eTime_a_D, 23, 59, 59).getTime();
    var sTime_b_Y = sTime_b.substring(0, 4);
    var sTime_b_M = parseInt(sTime_b.substring(5, 7)) - 1;
    var sTime_b_D = sTime_b.substring(8, 10);
    var calendar2begin = new Date(sTime_b_Y, sTime_b_M, sTime_b_D, 00, 00, 00).getTime();
    var eTime_b_Y = eTime_b.substring(0, 4);
    var eTime_b_M = parseInt(eTime_b.substring(5, 7)) - 1;
    var eTime_b_D = eTime_b.substring(8, 10);
    var calendar2end = new Date(eTime_b_Y, eTime_b_M, eTime_b_D, 23, 59, 59).getTime();
    var get_adPolicy_serverData_ =[];
		for(var i= 0,len = get_adPolicy_serverData.length;i<len;i++){
			if(get_adPolicy_serverData[i].adp_list&&get_adPolicy_serverData[i].adp_list.length>1){
				for(var j= 0,lenB = get_adPolicy_serverData[i].adp_list.length;j<lenB;j++){
				  var tempPolicyData={};
					for(var k in get_adPolicy_serverData[i]){
						tempPolicyData[k]=get_adPolicy_serverData[i][k]
					}
					tempPolicyData.adp_list=[];
					tempPolicyData.adp_list.push(get_adPolicy_serverData[i].adp_list[j]);
					get_adPolicy_serverData_.push(tempPolicyData);
				}
			}
			else{
				get_adPolicy_serverData_.push(get_adPolicy_serverData[i])
			}
		};
		var map = {},
		dest = [];
		var today=new Date();
		var todayYear = today.getFullYear();
		var todayMonth = today.getMonth();
		var todayDay = today.getDate();
		var todayStr=new Date(todayYear,todayMonth,todayDay).getTime();
		
		//数组group
		
		for(var i = 0; i < get_adPolicy_serverData_.length; i++){
			var ai = get_adPolicy_serverData_[i];   		
			if(!map[ai.adp_list[0]]){
				dest.push({
	        id: ai.adp_list[0],
	        data: [ai]
	      });
				map[ai.adp_list[0]] = ai;
			}else{
				for(var j = 0; j < dest.length; j++){
						var dj = dest[j];
						if(dj.id == ai.adp_list[0]){
							dj.data.push(ai);
							break;
						}
				}
			}
		};
		get_adPolicy_serverData_total=dest;
		var allAdvData=adv__schedule_.allAdvData;
		for(var i= 0,len = get_adPolicy_serverData_total.length;i<len;i++){
			var advName="";
			var advId="";
			var get_adPolicy_serverData_=get_adPolicy_serverData_total[i].data||[];
		  var adPolicy_beginEndArray = [];
			for (var j = 0; j < get_adPolicy_serverData_.length; j++) {
				var adPolicy = get_adPolicy_serverData_[j];
				advId=(adPolicy.adp_list&&adPolicy.adp_list[0]||"");
				for(var k= 0,lenAdv = allAdvData.length;k<lenAdv;k++){
					if(allAdvData[k].ext_id==advId){
						advName=allAdvData[k].name;
						break;
					}
				};
				var activatetime_ = get_adPolicy_serverData_[j].activatetime;
				var tmpA = activatetime_.substring(0, 10) + " " + activatetime_.substring(11, 19);
				var tmpB = tmpA.replace(new RegExp("-", "gm"), "/");
				var adPolicyBegin_milSecond = new Date(tmpB).getTime();
				var expiretime_ = get_adPolicy_serverData_[j].expiretime;
				var tmpA_b = expiretime_.substring(0, 10) + " " + expiretime_.substring(11, 19);
				var tmpB_b = tmpA_b.replace(new RegExp("-", "gm"), "/");
				var adPolicyEnd_milSecond = new Date(tmpB_b).getTime();
				adPolicy_beginEndArray.push({
						"begin": adPolicyBegin_milSecond,
						"end": adPolicyEnd_milSecond
				})
			}
			var jq = jQuery;
			//画空表
			var colspanArray = [];
			var tr1 = jQuery("#schedule_tableB thead").find("tr").eq(0).find("td");
			for (var a = 0; a < tr1.length; a++) {
					if (a == 0) {
							continue
					};
					colspanArray.push(jQuery(tr1).eq(a).attr("colspan"))
			}
			var row3_td1 = "<td dataid=\""+advId+"\" style=\"width:197px;text-align:center;overflow: hidden;font-weight:bold;word-break: keep-all; white-space: nowrap;text-overflow:ellipsis;height:20px;border-right:1px #f4edf4 solid;border-top:1px #f4edf4 solid;height:27px;line-height:27px;color:#9d9d9d;background-color:#ffffff;border-right:1px #e3e3e3 solid;border-top:1px #e3e3e3 solid;font-weight:normal\">" + advName + "</td>";
			var row3_td2 = "";
			for (var a = 0; a < colspanArray.length; a++) {
					var eachMonthDateCount = colspanArray[a];
					var text = jQuery(tr1).eq(a + 1).text();
					var year = text.substring(0, 4);
					var month = text.split("年")[1].replace("月", "");
					for (var b = 0; b < eachMonthDateCount; b++) //表格中每个td
					{
							var day = b + 1;
							var milsecondBegin = (new Date("" + year + "/" + month + "/" + day + " 00:00:00")).getTime();
							var milsecondEnd = (new Date("" + year + "/" + month + "/" + day + " 23:59:59")).getTime();
							var bgColor = "";
							var count_ = 0;
							var isColored = false;
							var click_ = "";
							var coloredStyle="sche_table_td_white";
							for (var c = 0; c < adPolicy_beginEndArray.length; c++) //命中的每个策略对应的激活和到期时间。
							{
									if ((adPolicy_beginEndArray[c].end < milsecondBegin) || (adPolicy_beginEndArray[c].begin > milsecondEnd)){
											if (isColored == false) {
												click_ = "";
												isColored = false;
												coloredStyle="sche_table_td_white"
											}
									} else {
											if (milsecondEnd < calendar1begin) {
													if (isColored == false) {
															click_ = "false";
															isColored = false;
															//coloredStyle="sche_table_td_white_border_none";
															coloredStyle="sche_table_td_white"
													}
											} else if (milsecondBegin > calendar2end) {
													if (isColored == false) {
															click_ = "false";
															isColored = false;
															//coloredStyle="sche_table_td_white_border_none";
															coloredStyle="sche_table_td_white"
													}
											} else if ((milsecondBegin > calendar1end) && (milsecondEnd < calendar2begin)) {
													if ((dateChooseType == "chooseTwoTimeRange_twoDifferentMonth") || (dateChooseType == "chooseTwoTimeRange_twoSameMonth")) {
															if (isColored == false) {
																	click_ = "false";
																	isColored = false;
																	coloredStyle="sche_table_td_white"
															}
													} else {
															coloredStyle="sche_table_td_colored";
															count_ = count_ + 1;
															click_ = "true";
															isColored = true; //表格中这个td有颜色，且可以点击。	
													}
											} else {
													coloredStyle="sche_table_td_colored";
													count_ = count_ + 1;
													click_ = "true";
													isColored = true;
											}
									}
							}
							var milsecond_ = (new Date("" + year + "/" + month + "/" + day)).getTime();
							if((!beginSearchAdvSchedule)&&i==0&&(todayStr==milsecond_)){//一开始打开页面时，默认选中今天
								//bgColor="background-color:#5da1c0"
								coloredStyle="sche_table_td_colored sche_table_td_colored_choosed";
							}
							row3_td2 += "<td class=\"sche_table_td_style "+coloredStyle+"\" click_=\"" + click_ + "\" onclick=\"adv__schedule.chooseTd(this)\" milBegin=" + milsecondBegin + " milEnd=" + milsecondEnd + ">" + count_ + "</td>"
					}
			}
			var row3_ = "<tr>" + row3_td1 + "" + row3_td2 + "</tr>";
			jQuery("#schedule_tableB thead").append(row3_);
			if(!beginSearchAdvSchedule&&(i==0)){
				jq("#sche_shot_detail_adv_name").text("("+advName);
				jq("#sche_shot_detail_current_date").text(todayYear+i18n("SCHEDULE_CALENDAR_YEAR")+(parseInt(todayMonth)+1)+i18n("SCHEDULE_CALENDAR_MONTH")+todayDay+i18n("SCHEDULE_CALENDAR_DAY")+")")
			}
    };
		var tableAHeight=document.getElementById("schedule_tableB_container").offsetHeight-21*2;
		var tdHeight= 29;
		var maxRowNum=Math.floor(tableAHeight/tdHeight);
		var currentTrLen=jq("#schedule_tableB").find("tr").length-2;
		//if(currentTrLen!=0){
		if(maxRowNum>currentTrLen){
			var diverse=(maxRowNum-currentTrLen);
			for(var i= 0,len = diverse;i<len;i++){
				var tdLen=jq("#schedule_tableB").find("tr").eq(1).children().length;
				tdHtml=""
				var tdStyle=((i==len-1)?"border-bottom:1px #e3e3e3 solid":"")
				for(var j= 0,lenB = tdLen+1;j<lenB;j++){
					tdHtml+="<td class=\"sche_table_td_style sche_table_td_white\" style=\""+tdStyle+"\"></td>"
				};
			
				jq("#schedule_tableB").find("thead").append("<tr>"+tdHtml+"</tr>");
			}
		}
		//};
		
		beginSearchAdvSchedule=true;
}
   
   
  var getServerData=function(){
    var jq=jQuery;
	  var str_t=encodeURIComponent("+")+"0800";
    var timeA_begin=sTime[0]+"T00:00:00"+str_t; //第一段时间开始时间
	  var timeA_end=sTime[(sTime.length-1)]+"T23:59:59"+str_t;
	  var timeb_begin=eTime[0]+"T00:00:00"+str_t; //第一段时间开始时间
	  var timeb_end=eTime[(eTime.length-1)]+"T23:59:59"+str_t;
		if(sTime[0]==""){
			var t="#sche__start";
			jQuery(t).css("border","1px red solid");
			showInputErr(t, i18n('SCHEDULE_WARNING_BLANKBEGINDATE'));
			return
		}
		else if(eTime[0]==""){
			var t="#sche__end";
			jQuery(t).css("border","1px red solid");
			showInputErr(t, i18n('SCHEDULE_WARNING_BLANKENDDATE'));
			return
		}
		else{
			if(new Date(sTime[0]).getTime()>new Date(eTime[0]).getTime())
			{
				var t="#sche__start";
				jQuery(t).css("border","1px red solid");
				showInputErr(t, i18n('SCHEDULE_WARNING_BEGINDATE_BIGGERTHAN_ENDDATE'));
				return
			}
		}
		if( (typeof AdvSystemType !="undefined")&&(AdvSystemType=="local") ){
			if(typeof AdvSystemType !="undefined"){siteID=AdvSelfSiteId}
		}
		if( (typeof AdvSystemType !="undefined")&&(AdvSystemType=="central") ){
				if(siteID==""){
				if(typeof AdvSelfSiteId !="undefined"){
				siteID=AdvSelfSiteId;
				}
			}
		}
	switch(dateChooseType)
	{
	/*
	case "chooseTwoTimeRange":
	  var firstPeriodData=[];
		var secondPeriodData=[];
	  	jq("#sche__start").find(".panel_calendar_input").val(sTime[0]);
	    jq("#sche__end").find(".panel_calendar_input").val(eTime[(eTime.length-1)]);
		var url_= paasHost + paasAdvDomain+"/ads/adpolicy/adpolicys/schedule?adp_ext_id="+advID+"&start_time="+timeA_begin+"&end_time="+timeA_end+"&site_id="+siteID+"";
		url_=url_+"&"+token_ + new Date().toISOString();
		var xhr_= new XMLHttpRequest();
		var method="GET";
		xhr_.open(method, url_, false);
		xhr_.setRequestHeader("Content-Type", "application/json");
		xhr_.setRequestHeader("Accept", "application/json");
		xhr_.send();
		if( (xhr_.readyState == 4)&&(xhr_.status == 200)&&(xhr_.responseText)){
			firstPeriodData=JSON.parse(xhr_.responseText);
		}
		var url_= paasHost + paasAdvDomain+"/ads/adpolicy/adpolicys/schedule?adp_ext_id="+advID+"&start_time="+timeb_begin+"&end_time="+timeb_end+"&site_id="+siteID+"";
		url_=url_+"&"+token_ + new Date().toISOString();
		var xhr_= new XMLHttpRequest();
		var method="GET";
		xhr_.open(method, url_, false);
		xhr_.setRequestHeader("Content-Type", "application/json");
		xhr_.setRequestHeader("Accept", "application/json");
		xhr_.send();
		if( (xhr_.readyState == 4)&&(xhr_.status == 200)&&(xhr_.responseText)){
			secondPeriodData=JSON.parse(xhr_.responseText);
			get_adPolicy_serverData=secondPeriodData;
			for(var a=0;a<secondPeriodData.length;a++){
			    var repeat_="false"
				for(var b=0;b<firstPeriodData.length;b++)
				{
					if(firstPeriodData[b].adpolicy_id==secondPeriodData[a].adpolicy_id);
					repeat_="true";
					break;
				}
				if(repeat_=="false"){
					get_adPolicy_serverData.push(json_[a])
				}
			}
		}
	  break;
		*/
	  case "chooseOneTimeRange":
			var firstPeriodData=[];
			var secondPeriodData=[];
			jq("#sche__start").find(".panel_calendar_input").val(sTime[0]);
			jq("#sche__end").find(".panel_calendar_input").val(eTime[(eTime.length-1)]);
			var url_= paasHost + paasAdvDomain+"/ads/adpolicy/adpolicys/schedule?";
			url_+="adp_ext_id="+encodeURIComponent(advID)+"";
			//url_+="&site_id="+siteID+"";
			url_+="&start_time="+timeA_begin+"&end_time="+timeb_end+"";
			url_=url_+"&"+token_ + new Date().toISOString();
			var xhr_= new XMLHttpRequest();
			var method="GET";
			xhr_.open(method, url_, false);
			xhr_.setRequestHeader("Content-Type", "application/json");
			xhr_.setRequestHeader("Accept", "application/json");
			xhr_.send();
			if( (xhr_.readyState == 4)&&((xhr_.status > 199)&&(xhr_.status < 300))&&(xhr_.responseText)){
				get_adPolicy_serverData=JSON.parse(xhr_.responseText);
				if(!beginSearchAdvSchedule){
					drawTabel3("blank");
				}
				else{
					drawTabel3();
				}
			}
			else{
				get_adPolicy_serverData=[];
				drawTabel3("blank");
			}
	default:
	   break;
	}
	drawFirstTable(timeA_begin,timeA_end,timeb_begin,timeb_end);
  } 
   
  var get_adPolicy_by_schedule=function(){
	  var jq=jQuery;
		sTime=[];
		eTime=[];
		sTime.push(jq("#sche__start-datepicker-input").val());
		eTime.push(jq("#sche__end-datepicker-input").val());
		if( (sTime[0]==sTime[(sTime.length-1)])&&(eTime[0]==eTime[(eTime.length-1)]) )
		{
			dateChooseType="chooseOneTimeRange";
		}
		else{
			dateChooseType="chooseTwoTimeRange";
		}
		getServerData();
  };
	
  var drawTabel3=function(blank){
	  var jq=jQuery;
    jQuery("#schedule_tableC_container").empty();
	  var tableStyle="width:100%;color:#9d9d9d;background-color: rgb(226, 226, 226); table-layout: fixed;";
    var tdStyle_="text-align: center;overflow: hidden; font-weight: bold; word-break: keep-all; white-space: nowrap; text-overflow: ellipsis;height: 34px;";
    var array_=["",i18n('SCHEDULE_CELUEMINCHENG'),i18n('SCHEDULE_TOUFANGSHIJIAN'),i18n('SCHEDULE_BIAOQIAN'),i18n('SCHEDULE_SOCIAL_ACCURATE'),i18n('SCHEDULE_QUANZHONG'),i18n('SCHEDULE_YOUXIANJI'),i18n('SCHEDULE_BAINGDINGSUCAIZU'),i18n('SCHEDULE_TIEPIANWEI')];
    var len=array_.length;
    var html__="";
		var tdWidhtArray=["2.8%","27.8%","14.6%","10.64%","8.08%","5.19%","6.51%","12.7%","10.89%"];
    for(var i=0;i<len;i++){
      html__=html__+"<td style=\""+tdStyle_+";width:"+tdWidhtArray[i]+";background-color:#ffffff\">"+array_[i]+"</td>";
    }
    var tableHtml="<table id=\"schedule_tableC\" cellspacing=\"1\" style=\""+tableStyle+"\"><thead>"+html__+"</thead>";
    $("schedule_tableC_container").innerHTML=tableHtml;
	  var json_=get_adPolicy_serverData;
		var adPolicySucaiList=[];
		var adPolicySucaiGroupList=[];
    if(!blank){
			for(var a=0;a<json_.length;a++){
				var json_tr=json_[a];
				var community_policy="";
				if(typeof json_tr.community_policy!="undefined"){
					if(parseInt(json_tr.community_policy)>0){
						community_policy=i18n("SCHEDULE_FALSE")
					}
					else{
						community_policy=i18n("SCHEDULE_TRUE")
					}
				};
				var bg="#ffffff";
				if(a%2==0){bg="#f5f5f5";}
				var htmlTd="";
				var name_=json_tr.name?json_tr.name:"";
				var tags_=json_tr.tags?json_tr.tags.join(","):"";
				var placementTime_="";
				if(json_tr.play_begintime){
					placementTime_+=json_tr.play_begintime.substring(0,8);
					if(json_tr.play_endtime){
						placementTime_+=" - "+json_tr.play_endtime.substring(0,8)
					}
				}
				var weight_="";
				var priority_="";
				if(json_tr.weight==0){weight_="0"}
				else{weight_=json_tr.weight}
				if(json_tr.priority==0){
				priority_="0"
				}
				else{priority_=json_tr.priority}
				var ad_id_="";
				var patch_location_=json_tr.patch_location&&(json_tr.patch_location!=null)?json_tr.patch_location:"";
				if( (typeof(json_tr.adgroup_id)=="undefined")||(json_tr.adgroup_id==null)||(json_tr.adgroup_id=="") )//素材组不存在
				{
					if( (typeof(json_tr.ad_single_id)!="undefined")&&(json_tr.ad_single_id!=null)&&(json_tr.ad_single_id!="") )//素材
					{
						//ad_id_=getMaterial(1,json_tr.ad_single_id)
						ad_id_="";
						adPolicySucaiList.push({
							"rowIndex":a,
							"ad_single_id":json_tr.ad_single_id,
							"ad_single_name":""
						})
					}
				}
				else{
					ad_id_="";
				  adPolicySucaiGroupList.push({
						"rowIndex":a,
						"ad_single_id":json_tr.adgroup_id,
						"ad_single_name":""
					})
				};
				var array_=[a+1,name_,placementTime_,tags_,community_policy,weight_,priority_,ad_id_,patch_location_]
				for(var b=0;b<array_.length;b++)
				{
				htmlTd=htmlTd+"<td style=\"text-align:center;height:34px\">"+array_[b]+"</td>"
				};
				jQuery("#schedule_tableC").append("<tr style=\"background-color:"+bg+"\">"+htmlTd+"</tr>")
			};
			if(adPolicySucaiList.length>0){
				getMultiMaterial(adPolicySucaiList,function(data){
					for(var i= 0,len = data.length;i<len;i++){
						for(var j= 0,lenB = adPolicySucaiList.length;j<lenB;j++){
						  var name=data[i].name||"";
						  if(adPolicySucaiList[j].ad_single_id==data[i].ad_id){
								adPolicySucaiList[j].ad_single_name=name
							}
						}
					};
					for(var i= 0,len = adPolicySucaiList.length;i<len;i++){
						var rowIndex=adPolicySucaiList[i].rowIndex;
						jq("#schedule_tableC").find("tr").eq(rowIndex+1).find("td").eq(7).text(adPolicySucaiList[i].ad_single_name)
					}
				},"sucai")
			};
			if(adPolicySucaiGroupList.length>0){
				getMultiMaterial(adPolicySucaiGroupList,function(data){
					for(var i= 0,len = data.length;i<len;i++){
						for(var j= 0,lenB = adPolicySucaiGroupList.length;j<lenB;j++){
						  var title=data[i].title||"";
						  if(adPolicySucaiGroupList[j].ad_single_id==data[i].ad_group_id){
								adPolicySucaiGroupList[j].ad_single_name=title
							}
						}
					};
					for(var i= 0,len = adPolicySucaiGroupList.length;i<len;i++){
						var rowIndex=adPolicySucaiGroupList[i].rowIndex;
						jq("#schedule_tableC").find("tr").eq(rowIndex+1).find("td").eq(7).text(adPolicySucaiGroupList[i].ad_single_name)
					}
				},"sucaiGroup")
			};
		};
	  var tdHeight= jq("#schedule_tableC_container").find("td").eq(0).outerHeight();
	  var tableAHeight=document.getElementById("schedule_tableC_container").offsetHeight-tdHeight
		var maxRowNum=Math.floor(tableAHeight/tdHeight);
		var currentTrLen=jq("#schedule_tableC_container").find("tr").length-1;
		//if(currentTrLen!=0){
		var bgList=((currentTrLen%2==0)?["#f5f5f5","#ffffff"]:["white","#f5f5f5"]);
		if(maxRowNum>currentTrLen){
			var diverse=(maxRowNum-currentTrLen);
			for(var i= 0,len = diverse;i<len;i++){
			  var bg=((i%2==0)?bgList[0]:bgList[1])
				var tdLen=jq("#schedule_tableC_container").find("tr").eq(0).children().length;
				tdHtml=""
				for(var j= 0,lenB = tdLen;j<lenB;j++){
					tdHtml+="<td style=\"text-align:center;height:34px;background-color:"+bg+"\"></td>"
				};
				jq("#schedule_tableC").append("<tr>"+tdHtml+"</tr>");
			}
		}
  }
  
  var days__=function(year,month){
        var dayCount;
        now = new Date(year,month, 0);
        dayCount = now.getDate();
        return dayCount;
	}
   
   var bindValueForRow3=function()//绑定当天的微秒区间。
   {
		var tr2Element=jQuery("#schedule_tableB").find("tr").eq(2).find("td");
		for(var a=1;a<tr2Element.length;a++){
			//if(a==0){continue};
            var monthValue=jQuery("#schedule_tableB").find("tr").eq(1).find("td").eq(a).attr("monthValue");
			var r1Content=jQuery("#schedule_tableB").find("tr").eq(0).find("td").eq(parseInt(monthValue)+1).text();//属于哪个月下。
			var period=jQuery(tr2Element[a]).attr("period");
			var obj_=firstPeriodObj;
			 if(jQ_(tr2Element[a]).attr("period")=="periodB"){
						obj_=secondPeriodObj;
						d=a-obj_.count_dayInMonth;
			}
			else{
			d=(a);
			}
			var year_=obj_.begin_y;
			var month_=obj_.begin_m;
			var milsecondBegin=(new Date(""+year_+"/"+month_+"/"+d+" 00:00:00")).getTime(); 
		    var milsecondEnd=(new Date(""+year_+"/"+month_+"/"+d+" 23:59:59")).getTime();   
			jQuery(tr2Element[a]).attr("milBegin",milsecondBegin);
			jQuery(tr2Element[a]).attr("milEnd",milsecondEnd);
			jQuery(tr2Element[a]).attr("index_",a);
			jQuery(tr2Element[a]).attr("year_",year_);
			jQuery(tr2Element[a]).attr("month_",month_);
		}
   } 
  
	var getMultiMaterial=function(adPolicySucaiList,callback,type){
		var adPolicySucaiList=adPolicySucaiList;
		var adPolicySucaiIdList=[];
		for(var i= 0,len = adPolicySucaiList.length;i<len;i++){
			adPolicySucaiIdList.push(adPolicySucaiList[i].ad_single_id)
		};
		var adPolicySucaiIdListStr=encodeURIComponent(adPolicySucaiIdList.join(","));
		var url ="";
		if(type=="sucai"){
			url = paasHost + paasAdvDomain + "/ads/aditem/searchaditems?ad_ids="+adPolicySucaiIdListStr+"";
		}
		else{
			url = paasHost + paasAdvDomain + "/ads/adgroup/searchaditemgroups?ad_group_ids="+adPolicySucaiIdListStr+"";
		}
		url+="&user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type + "";
		url+="&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=";
		url+=new Date().toISOString();
    jQuery.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
      },
      success: function (data) {
        callback(data)
      }
		});
	};
	
  var getMaterial = function (type, id) {//素材或素材组
    var result = "";
    var url = "";
    if(type === 0) {
      url = paasHost + paasAdvDomain + "/ads/adgroup/" + id + "?"
    } else {
      url = paasHost + paasAdvDomain + "/ads/aditem/" + id + "?"
    }
	var token_ = "user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=";
    url += token_ + new Date().toISOString();
    jQuery.ajax({
      type: "GET",
      async: false,
      url: url,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
      },
      success: function (data) {
        result = data.name || data.title;
      }
    });
    return result;
  }
  
  
  var drawTableDefaultTableC=function(){
    var tableStyle="width:100%;color:#9d9d9d;background-color:white; table-layout: fixed;";
    var tdStyle_="width:14%;text-align: center;overflow: hidden; font-weight: bold; word-break: keep-all; white-space: nowrap; text-overflow: ellipsis;height: 34px;";
    var array_=[i18n('SCHEDULE_CELUEMINCHENG'),i18n('SCHEDULE_TOUFANGSHIJIAN'),i18n('SCHEDULE_BIAOQIAN'),i18n('SCHEDULE_QUANZHONG'),i18n('SCHEDULE_YOUXIANJI'),i18n('SCHEDULE_BAINGDINGSUCAIZU'),i18n('SCHEDULE_TIEPIANWEI')];
    var len=array_.length;
    var html__="";
    for(var i=0;i<len;i++){
      html__=html__+"<td style=\""+tdStyle_+"\">"+array_[i]+"</td>";
    }
    var tableHtml="<table id=\"schedule_tableC\" cellspacing=\"1\" style=\""+tableStyle+"\"><thead>"+html__+"</thead>";
    $("schedule_tableC_container").innerHTML=tableHtml;
	 jQuery("#schedule_tableC").append("<tbody></tbody>");
    var htmlTr="";
    for(var a=0;a<7;a++){
      var bg="white";
      if(a%2==0){bg="#f5f5f5";}
      var htmlTd="";
      for(var b=0;b<7;b++){htmlTd=htmlTd+"<td style=\"height:34px\"></td>"};
      jQuery("#schedule_tableC tbody").append("<tr style=\"background-color:"+bg+"\">"+htmlTd+"</tr>")
    }
  }
  var switchDisplay=function(id,para){
	  var jq=jQuery;
	  var switchButtonId=((id=="schedule_siteBody")?"schedule_site_downMenu":"schedule_advId_downMenu");
    if($(id).style.display=="none"){
	    if(id=="schedule_advIdBody"){
			  if(hasClickedAdv){
				}
				else{
					initAdv()
				}
			};
      closeOthers(id);
      $(id).style.display="block";
			jq("#schedule_site_downMenu").removeClass("sche_transform_y");
			jq("#schedule_advId_downMenu").removeClass("sche_transform_y");
			jq("#"+switchButtonId+"").addClass("sche_transform_y");
    }
    else{
	  if(lastSiteid!=siteID){siteChange="change"}
	  else{siteChange=""}
	  lastSiteid=siteID;
      $(id).style.display="none";
			jq("#"+switchButtonId+"").removeClass("sche_transform_y");
    }
	if(typeof para !="undefined")
	{
	  if(para=="cancel")//取消按钮
	  {
	    siteID=siteID_old;
      advID=advID_old;
	    if(id=="schedule_advIdBody"){
			jQuery("#tdInLineS_adv").remove()
		}
		else{
			jQ_("#sche_choosedTdInTableB").css({"background-color":"#ffffff","color":"#7d7d7d"});
			jQ_("#sche_choosedTdInTableB").attr("id","");
		}
	  }
	}
  }
  initUI();
  bindEvent();
  w.adv__schedule = adv__schedule_;
})(window)