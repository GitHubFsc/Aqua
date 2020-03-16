var brodecaSingleSearch = new Object();

brodecaSingleSearch.init = function(){
    this.tableRowHeighT="";
	brodecaSingleSearch.resizePage_container();
	brodecaSingleSearch.windowResize();
	brodecaSingleSearch.callScroll();
	//brodecaSingleSearch.catchInput();
	this.cardIDInput="";
	this.begindateInput="";
	this.enddateInput="";
	this.noteUrl="";
    this.current_popup_height="";//当前的弹出框高度保存下来。
	//brodecaSingleSearch.ajaxSend();
	this.dateInputChosed_appear1="";//是否重复点击日期框的开关1。
	this.dateInputChosed_disappear1="";//是否重复点击日期框的开关2。
	var popupObject ={
	url:"content/brodecastRecord/brodecaSingleSearch/popupDiv-newSearch.html",
	width:452,
	height:388,
	context:this,
	callback:this.searchOriginVal
	};
	this.dialog=new PopupDialog(popupObject);
	this.everyColumnWidth=["93","69","89","109","129","36","129","129","37","70","71","95","87","92","150"];
	this.initDefaultTale();
    this.heightFromInnerToOuter={
      date_notSelfDefined_combine_preset:["314px","388px"],
      date_selfDefined_combine_preset:["408px","482px"],
      date_notSelfDefined_combine_selfDefine_shiiyihuikan:["255px","329px"],
      date_selfDefined_combine_selfDefine_shiiyihuikan:["347px","421px"],
      date_notSelfDefined_combine_selfDefine_notShiiyihuikan:["294px","396px"],
      date_selfDefined_combine_selfDefine_notShiiyihuikan:["396px","487px"]
    }
}

brodecaSingleSearch.checkSizeStyle=function(){//伸缩弹出窗体
  if(document.getElementById("broSingle_selfDefine").innerHTML=="自定义")//日期部分为非自定义
  {
    if(jQuery("#preSetContainer").css("display")!="none")//组合类型为预设组合
    {
      return "date_notSelfDefined_combine_preset"
    }
    else{
      if(jQuery("#broSingle_broType").find("#downMenuText").text()=="时移回看")
      {
        return "date_notSelfDefined_combine_selfDefine_shiiyihuikan"
      }
      else{
        return "date_notSelfDefined_combine_selfDefine_notShiiyihuikan"
      }
    }
  }
  else{ //日期部分为自定义
    if(jQuery("#preSetContainer").css("display")!="none")//组合类型为预设组合
    {
      return "date_selfDefined_combine_preset"
    }
    else{
      if(jQuery("#broSingle_broType").find("#downMenuText").text()=="时移回看")
      {
        return "date_selfDefined_combine_selfDefine_shiiyihuikan"
      }
      else{
        return "date_selfDefined_combine_selfDefine_notShiiyihuikan"
      }
    }
  }
}

brodecaSingleSearch.initDefaultTale=function(){
	var trLength=11;
	var tdLength=this.everyColumnWidth.length;
	var td_=this.everyColumnWidth;
	jQuery("#tableContent tbody").append("<tr></tr>");
	for(var a=0;a<tdLength;a++)
	{
		jQuery("#tableContent tr:eq(0)").append("<td style=\"width:"+td_[a]+"px\"></td>")
	}
	for(var b=0;b<trLength;b++)
	{
		var html_="";
		for(var a=0;a<tdLength;a++){html_=html_+"<td></td>"}
		jQuery("#tableContent").append("<tr>"+html_+"</tr>")
	}
	document.getElementById("tableContent").style.visibility="visible"
}

brodecaSingleSearch.switchRedio=function(obj){
  var curObjClassName_=jQuery(obj).find("[name='radio1']").attr('class');
  var curObjNewClassName="";
  switch(curObjClassName_)
  {
    case "radioB_selected":
      curObjNewClassName="radioB_selected";
      break;
    case "radioB_noSelected":
      curObjNewClassName="radioB_selected";
      jQuery(obj).siblings().find("[name='radio1']").attr('class','radioB_noSelected');
      break;
    default:
      break;
  }
  jQuery(obj).find("[name='radio1']").attr('class','radioB_selected');
  var text_=jQuery(obj).attr("id");
  if(text_=="radioB1"){
    document.getElementById("combineType_title").innerHTML="预设组合";
    document.getElementById("preSetContainer").style.display="block";
    document.getElementById("broSingle_broType").style.display="none";
    document.getElementById("singleSearch_displayIfTypeSelfDefined").style.display="none";
    document.getElementById("singleSearch_displayIfTypeSelfDefinedB").style.display="none";
  }
  else{
    document.getElementById("combineType_title").innerHTML="点播类型";
    jQuery("#broSingle_broType").find("#downMenuText").text("服务包(SVOD)");
    document.getElementById("preSetContainer").style.display="none";
    document.getElementById("broSingle_broType").style.display="block";
    document.getElementById("singleSearch_displayIfTypeSelfDefined").style.display="block";
    document.getElementById("singleSearch_displayIfTypeSelfDefinedB").style.display="block";
  }
  var size_=this.checkSizeStyle();
  this.resetPopupSize(size_)
}

brodecaSingleSearch.resetPopupSize=function(value_){
  var temp_=this.heightFromInnerToOuter[value_];
  jQuery("#singleSearchPopBody").height(temp_[0]);
  jQuery("#centerPopupStyle").height(temp_[1]);
  jQuery("#popup-dialog-dialog").height(temp_[1]);
  var marginTop_=0-0.5*parseInt(temp_[1])+"px";
  jQuery("#popup-dialog-dialog").css({"margin-top":marginTop_,"top":"50%"});
}

brodecaSingleSearch.userDefined=function(obj){
  var test_=jQuery(obj).text();
  switch(test_)
  {
    case "自定义":
      jQuery(obj).text("取消自定义");
      document.getElementById("downMenuText").innerHTML="自定义";
      jQuery("#broSingle_dateRegion").css("background-color","#ebebeb");
      jQuery("#broSingle_dateRegion").find(".smallArrowInDiv").attr("src","images/downArrow-dark.png");
      document.getElementById("broSingle_startEnd").style.display="block";
      jQuery("#date-input-from").empty();
      jQuery("#date-input-to").empty();
      this.dataPickerIssue();
      jQuery("#downMenu").css("display","none");
      break;
    case "取消自定义":
      jQuery(obj).text("自定义");
      document.getElementById("downMenuText").innerHTML="一个月";
      jQuery("#broSingle_dateRegion").css("background-color","#ffffff");
      jQuery("#broSingle_dateRegion").find(".smallArrowInDiv").attr("src","images/downArrow-SkyBlue.png");
      document.getElementById("broSingle_startEnd").style.display="none";
      break;
    default:
      break;
  }
  var size_=this.checkSizeStyle();
  this.resetPopupSize(size_)
}

brodecaSingleSearch.drawPreSetValue= function(){
  var temp=BROADCAST_PO_DEFAULT;
  for(var a=0;a<temp.length;a++)
  {
    var name=temp[a].name?temp[a].name:"";
    jQuery("#preSetContainer").append("<div class=\"divContainerSon_father\" onclick=\"brodecaSingleSearch.switchPreset(this)\" style=\"width:100%;height:28px;overflow:hidden;border:0;border-bottom:1px #d3d3d3 solid;\"><div style=\"margin-left:10px\" class=\"radioB_noSelected\" name=\"radio1\"></div><div class=\"divContainerSon\" style=\"float:left;width:128px;max-width:128px;padding-left:0\">"+name+"</div></div>")
  }
}

brodecaSingleSearch.switchPreset= function(obj){
  if(jQuery(obj).attr("id")=="selectedPreset"){
    return;
  }
  var ele_=document.getElementsByClassName("divContainerSon_father");
  for(var a=0;a<ele_.length;a++)
  {
    var id__=ele_[a].id;
    if(id__&&id__=="selectedPreset")
    {
      jQuery("#selectedPreset").find("div[name='radio1']").attr('class','radioB_noSelected');
      ele_[a].style.backgroundColor="#ffffff";
      ele_[a].setAttribute("id","");
      break
    }
  }
  jQuery(obj).attr('id','selectedPreset');
  jQuery(obj).css("background-color","#f5fdff");
  jQuery("#selectedPreset").find("div[name='radio1']").attr('class','radioB_selected');
};

brodecaSingleSearch.writePopContent= function(indexNum){
  document.getElementById("broad_singleSearch_combineType").style.display="none";
  var indexNum=indexNum;
  var temp=BROADCAST_PO_DEFAULT;
  var content=temp[indexNum];
  document.getElementById("broad_singleSearch_broadType").innerHTML=content.POTYPE?content.POTYPE:"";
  document.getElementById("broad_singleSearch_servicePackage").innerHTML=content.POIDS?"PO ID":"";
  jQuery("#inputText_id_field").val(content.POIDS?content.POIDS:"");
}

brodecaSingleSearch.enddateAappear= function(){
    var current_height=jQuery("#centerPopupStyle").height();
	if(jQuery("#downMenuText").text().indexOf("自定义")!=-1)
	{
		jQuery(".popupCenterDivBodyRow").eq(3).css("display","block");
        var tempHeight=0;
        if(this.dateInputChosed_appear1!="true")
          {
           // if(current_height<this.current_popup_height)
                tempHeight=current_height+jQuery(".popupCenterDivBodyRow").eq(3).outerHeight()+parseInt(jQuery(".popupCenterDivBodyRow").eq(3).css("marginTop").replace(/px/g,""));
          }
            //else{tempHeight=current_height}
         // }
        else{tempHeight=current_height}
		jQuery("#centerPopupStyle").height(tempHeight);
		jQuery("#popup-dialog-dialog").css("height",tempHeight);
	}
  this.dateInputChosed_appear1="true";
  this.dateInputChosed_disappear1="false";
}

brodecaSingleSearch.enddateDisappear= function(){
    var current_height=jQuery("#centerPopupStyle").height();
	if(jQuery("#downMenuText").text().indexOf("自定义")==-1)
		{
            var tempHeight=0;
            if(this.dateInputChosed_disappear1!="true")
              {tempHeight=current_height-jQuery(".popupCenterDivBodyRow").eq(3).outerHeight()-parseInt(jQuery(".popupCenterDivBodyRow").eq(3).css("marginTop").replace(/px/g,""))}
            else{tempHeight=current_height}
			jQuery("#centerPopupStyle").height(tempHeight);
			jQuery(".popupCenterDivBodyRow").eq(3).css("display","none");
			jQuery("#popup-dialog-dialog").css("height",tempHeight);
		}
    this.dateInputChosed_disappear1="true";
    this.dateInputChosed_appear1="false";
}
//去除数组中重复元素,成为新元素
brodecaSingleSearch.removeRepeated=function(origin_array){
  var origin_arrayDistinct=[];
  for(var w = 0; w < origin_array.length; w++)
  {var count=0;
    for (var y = 0; y < origin_arrayDistinct.length; y++)
    {if(origin_arrayDistinct[y]==origin_array[w])
    {count++;}
    }
    if (count<1)
      origin_arrayDistinct.push(origin_array[w]);
  }
  return origin_arrayDistinct;
}

//清空表格中所有数据。
brodecaSingleSearch.clearAllTableData=function(){
	
	for(i=0;i<jQuery("#tableContent tr").length;i++)
		{
		for(j=0;j<jQuery("#tableContent tr:eq("+i+") td").length;j++)
			{jQuery("#tableContent tr:eq("+i+") td:eq("+j+")").text("")}
		};
		jQuery(".spanDiv .inputShift").text("")
}

brodecaSingleSearch.exportResult= function(){
	if((jQuery("#tableContent tr:eq(0)").find("td:eq(0)").text()!="")&&(jQuery("#tableContent tr:eq(0)").find("td:eq(0)").text()!=undefined))
		{
		window.open(brodecaSingleSearch.noteUrl);
		
		}
	else{
	alert("没有数据可以导出，请重新搜索");
	}	
	
}

/*
viewCourseware.getDownCWURL = function(requestUri) {
    var downCWURL = "";
    var method = "GET";
    var contentType = "application/cdmi-object";
    //var contentType = "image/png";
    var nowDateTime = new Date().getTime();
    var urlPath = "/aqua/rest/compressed" + requestUri;
    //var urlPath = "/aqua/rest/cdmi/default/tif/coursewares/0000593700184D17075BE51E29784C4D7E963B65E053920551/0000593700184D17075BE51E29784C4D7E963B65E0539205511411707040381/";
    var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
    //生成token
    var uriprefix = urlPath;
    var expires = nowDateTime + expires_valid_date; //2014-04-01将有效期扩展到课程/课时结束+2周(14天)时间
    var StringToSign = "GET" + "\n" + expires + "\n" + uriprefix;
    var aquatoken = my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign));

    var downCWURL = urlPath + "?aquatoken="+encodeURIComponent(aquatoken)+"&expires="+expires+"&uriprefix="+uriprefix;
    return downCWURL;
};*/






brodecaSingleSearch.closeCenterDiv= function(){
    jQuery("#popup-dialog-dialog").css("display","none");
    jQuery("#popup-dialog-mask").css("display","none");
}

brodecaSingleSearch.popup_newSearch= function(){
  jQuery("#popup-dialog-dialog").remove();
  jQuery("#popup-dialog-mask").remove();
  this.dialog.open();
  jQuery("#cardIDinput").val("");
  jQuery("#date-input-from #date-input-from-datepicker-input").val("");
  jQuery("#date-input-to #date-input-to-datepicker-input").val("");
  this.dateInputChosed_appear1="true";
  this.dateInputChosed_disappear1="false";
  this.current_popup_height=jQuery("#centerPopupStyle").height();
}

brodecaSingleSearch.popup_editSearch= function(){
    //var current_height=((brodecaSingleSearch.current_popup_height)&&(brodecaSingleSearch.current_popup_height!=""))?brodecaSingleSearch.current_popup_height:jQuery("#centerPopupStyle").height();
    jQuery("#popup-dialog-dialog").css("display","block");
    jQuery("#popup-dialog-mask").css("display","block");
}

brodecaSingleSearch.searchOriginVal= function(){
	jQuery("#cardIDinput").val(brodecaSingleSearch.cardIDInput);
	jQuery("#date-input-from").val(brodecaSingleSearch.begindateInput);
	jQuery("#date-input-to").val(brodecaSingleSearch.enddateInput);
    this.drawPreSetValue()
}

brodecaSingleSearch.windowResize=function()
{
	jQuery(window).unbind("resize");
	jQuery(window).resize(function()
	{brodecaSingleSearch.resizePage_container()}
	
	)
	
}

brodecaSingleSearch.callScroll=function(){
            jQuery("#tableContentOuterr").mCustomScrollbar(
				{
					//setHeight:280,
					theme:"purple"
				});
				jQuery(".mCSB_dragger_bar").css("background-color","#1B9EBE")
}


brodecaSingleSearch.resizePage_container=function()
{	
	jQuery(window).unbind("resize");
		var bodyWidth=jQuery("#page_container").innerWidth();
		var BodyContainerHeight=jQuery("#page_container").height()-jQuery("#boRecord_pageSingleSearch").outerHeight()-jQuery("#pageAllBodyContainer").css("marginTop").replace(/px/g,"");
		jQuery(".spanDiv").outerWidth(Math.floor(jQuery(".spanDivContainer").innerWidth()/7)-Math.ceil(jQuery(".spanDiv").css("marginRight").replace(/px/g,""))-3);
		var tableRowHeight=(BodyContainerHeight-jQuery(".pageAllBodyContainerTitle").outerHeight()-jQuery(".spanDivContainer").outerHeight()-parseInt(jQuery("#resultTable").css("top").replace(/px/g,""))-jQuery("#buttonDown").outerHeight()-parseInt(jQuery("#buttonDown").css("marginTop").replace(/px/g,""))-document.getElementById("brodecastRecordTableTread").offsetHeight)/11;
        jQuery("#tableContent tr td").css("height",tableRowHeight);
		var tableContentNoTitle= tableRowHeight*11+14;
		
		brodecaSingleSearch.tableRowHeighT=tableRowHeight;
		jQuery("#tableContentOuter").css("height",tableContentNoTitle);
        var  height_=document.getElementById("tableContentOuter").offsetHeight+"px";
        jQuery("#tableContentOuterr").height(height_);
		
		//jQuery("#page_container").outerHeight(page_container);
		if(jQuery("#mCSB_1_scrollbar_vertical")&&jQuery("#mCSB_1_container"))
		{
			jQuery("#mCSB_1_scrollbar_vertical").width("4px");
			jQuery("#mCSB_1_container").css("margin-right","2px")
		}
        document.getElementById("pageAllBodyContainer").style.visibility="visible"
	}

//秒转换为小时分秒	
brodecaSingleSearch.formatSeconds=function(value) {
var theTime = parseInt(value);// 秒
var theTime1 = 0;// 分
var theTime2 = 0;// 小时
// alert(theTime);
if(theTime > 60) {
theTime1 = parseInt(theTime/60);
theTime = parseInt(theTime%60);
// alert(theTime1+"-"+theTime);
if(theTime1 > 60) {
theTime2 = parseInt(theTime1/60);
theTime1 = parseInt(theTime1%60);
}
}
var result = ""+parseInt(theTime);
result = brodecaSingleSearch.lessTenPluwZero(parseInt(theTime2))+":"+brodecaSingleSearch.lessTenPluwZero(parseInt(theTime1))+":"+brodecaSingleSearch.lessTenPluwZero(result);
return result;
} 	

brodecaSingleSearch.lessTenPluwZero = function(object){//如 把 2014-9-6 转化为 2014-09-06
if (object < 10) 
	{object="0" + object;} 
	return object;
}

brodecaSingleSearch.ifPreSet=function(str){
  var str=str;
  switch(str)
  {
    case "预设组合":
      document.getElementById("broad_singleSearch_combineType").style.display="block"
      break;
    default:
      break;
  }
}

brodecaSingleSearch.drawTable= function(data){



  //模拟数据
  //var data={"smart_card_id":"080810000","subscriber_id":"home080810000","subscriber_name":"homename","start_date":"1900-08-02","end_date":"2020-08-20","statistics":{"total_view_count":1,"total_view_length":9948,"total_purchase_success":0,"total_purchase_price":0},"details":[{"asset_name":"神雕侠侣49","product_info":"嘉禾影视信息有限公司","poid":null,"potype":null,"ticketid":null,"lastviewposition":null,"purchase_time":"2015-04-16 00:00:01.000","price":5,"provider":"","purchasefail":false,"bundle_info":"1","provider_id":"provider1","provider_asset_id":"providerasset"},{"asset_name":"assetname0","view_begin_time":"2015-04-16 12:48:24.574","view_end_time":"2015-04-16 15:34:12.289","view_length":9948,"product_info":"","poid":"po13","potype":"1","ticketid":"ticketid47","lastviewposition":"","price":0,"provider":"STVB","viewfail":false,"purchasefail":null,"bundle_info":"","provider_id":"PID17","provider_asset_id":"PAID16"}]}
if(data.details){
	var tableRowLength=11;
	jQuery("#tableContent").empty();
	var rowHeight=brodecaSingleSearch.tableRowHeighT;
	var objLength=data.details.length;
	//模拟滚动条
	/*
	var array__={"asset_name":"assetname0","view_begin_time":"2016-12-12 12:48:24.574","view_end_time":"2016-12-12 15:34:12.289","view_length":9948,"product_info":"poname0","poid":"po13","potype":"1","ticketid":"ticketid49","lastviewposition":"","price":0,"provider":"STVB","viewfail":false,"purchasefail":null,"bundle_info":"","provider_id":"PID17","provider_asset_id":"PAID16"};
	for(var a=0;a<25;a++)
	{data.details.push(array__)}
	var objLength=data.details.length;
	*/
	for(i=0;i<objLength;i++)
	{
		var view_lengthB="";
		if((data.details[i].view_length!= undefined)&&(data.details[i].view_length!= "")&&(data.details[i].view_length))
		{
		view_lengthB=brodecaSingleSearch.formatSeconds(data.details[i].view_length);
		}
		jQuery("#tableContent").append("<tr><td style=\"height:"+rowHeight+";width:93px;\">"+((!data.subscriber_id)?"":data.subscriber_id)+"</td><td style=\"width:69px;\">"+((!data.subscriber_name)?"":data.subscriber_name)+"</td><td style=\"width:89px\">"+((!data.smart_card_id)?"":data.smart_card_id)+"</td><td style=\"width:109px\">"+((!data.details[i].asset_name)?"":data.details[i].asset_name)+"</td><td style=\"width:129px\">"+((!data.details[i].purchase_time)?"":data.details[i].purchase_time)+"</td><td style=\"width:36px\">"+((!data.details[i].price)?"0元":(data.details[i].price+"元"))+"</td><td style=\"width:129px\">"+((!data.details[i].view_begin_time)?"":data.details[i].view_begin_time)+"</td><td style=\"width:129px\">"+((!data.details[i].view_end_time)?"":data.details[i].view_end_time)+"</td><td style=\"width:37px\">"+((!data.details[i].view_length)?"":view_lengthB)+"</td><td style=\"width:70px\">"+((!data.details[i].product_info)?"":data.details[i].product_info)+"</td><td style=\"width:71px\">"+((!data.details[i].bundle_info)?"":data.details[i].bundle_info)+"</td><td style=\"width:95px\">"+((!data.details[i].provider)?"":data.details[i].provider)+"</td><td>"+((!data.details[i].provider_id)?"":data.details[i].provider_id)+"</td><td>"+((!data.details[i].provider_asset_id)?"":data.details[i].provider_asset_id)+"</td><td>"+((!data.details[i].content_url)?"":data.details[i].content_url)+"</td></tr>")}
	if(objLength<11)
		{var tableLengthLeft=tableRowLength-objLength;
		for(i=0;i<tableLengthLeft;i++)
			{
				jQuery("#tableContent").append("<tr><td style=\"height:"+rowHeight+";width:93px\"></td><td style=\"width:69px\"></td><td style=\"width:89px\"></td><td style=\"width:109px\"></td><td style=\"width:129px\"></td><td style=\"width:36px\"></td><td style=\"width:129px\"></td><td style=\"width:136px\"></td><td style=\"width:129px\"></td><td style=\"width:129px\"></td><td style=\"width:37px\"></td><td style=\"width:11px\"></td><td></td><td></td><td></td></tr>")
			}	
		}
  var turnovercount = "";
  var spanBroCount = "";
  var spanBuyCount = "";
  var broTime = 0;
  if (data.statistics) {
    spanBuyCount = data.statistics.total_purchase_success;
    turnovercount = data.statistics.total_purchase_price + "元";
    broTime = brodecaSingleSearch.formatSeconds(parseInt(data.statistics.total_view_length));
    if ((data.statistics.total_view_count) && (data.statistics.total_view_count != undefined) && (data.statistics.total_view_count != "")) {
      spanBroCount = data.statistics.total_view_count
    }
    ;

  }
	jQuery("#spanAccID").text(jQuery("#tableContent tr:eq(0)").find("td:eq(0)").text());
	jQuery("#spanAccName").text(jQuery("#tableContent tr:eq(0)").find("td:eq(1)").text());
	jQuery("#spanCardNo").text(jQuery("#tableContent tr:eq(0)").find("td:eq(2)").text());
	jQuery("#spanBuyCount").text("");
	jQuery("#spanBuyCount").text(spanBuyCount);
	jQuery("#spanTurnover").text("");
	jQuery("#spanTurnover").text(turnovercount);
	jQuery("#spanBroCount").text("");
	jQuery("#spanBroCount").text(spanBroCount);
	jQuery("#spanBroTime").text(broTime);
	spanBuyCount=0;
	spanBroCount=0;
	broTime=0;
	turnovercount=0;

	jQuery("#buttonDown").css("background-color","#2ea2d7");
	}
	else{
	alert("没有记录，请重新填写搜索条件，谢谢。");
	brodecaSingleSearch.clearAllTableData();
	};
	
}

function zerolize(num, len) {
  var _returnValue = "";
  if(typeof num == "number") {
    _returnValue = num + "";
  } else if(typeof num == 'string') {
    _returnValue = num
  }
  var _o = _returnValue.length;
  for(var i = _o; i < len; i++) {
    _returnValue = "0" + _returnValue;
  }
  return _returnValue;
}

brodecaSingleSearch.singleSearch= function()
{
  var url_=aquapaas_host+"/aquapaas/rest/multiapp/viewhistory/subscriber/";
  if(jQuery("#cardIDinput").val()==""){alert("请填写卡号，谢谢。");return}
  url_=url_+jQuery("#cardIDinput").val();
  //时间项
  var start_date="";var end_date="";
  if(jQuery("#broSingle_selfDefine").text()=="自定义")//非自定义时间
  {
    var time_=jQuery("#broSingle_dateRegion").find("#downMenuText").text();
    var num__=1;
    var _cur_date = new Date();
    var _begin_d = new Date(_cur_date);
    switch(time_)
    {
      case "一个月":
        num__=1;
        break;
      case "二个月":
        num__=2;
        break;
      case "三个月":
        num__=3;
        break;
      case "六个月":
        num__=6;
        break;
      case "一年":
        num__=12;
        break;
      default:
        break;
    }
    _begin_d.setMonth(_begin_d.getMonth() - Number(num__));
    end_date=_cur_date.getFullYear() + "-" + zerolize(_cur_date.getMonth() + 1, 2) + "-" + zerolize(_cur_date.getDate(), 2);
    start_date= _begin_d.getFullYear() + "-" + zerolize(_begin_d.getMonth() + 1, 2) + "-" + zerolize(_begin_d.getDate(), 2);
  }
  else{  //自定义选择日历时间
    start_date=jQuery("#date-input-from #date-input-from-datepicker-input").val();
    end_date=jQuery("#date-input-to #date-input-to-datepicker-input").val();
    if(jQuery("#date-input-from #date-input-from-datepicker-input").val()=="")
    {alert("开始日期不能为空！谢谢。");}
    else if(jQuery("#date-input-to #date-input-to-datepicker-input").val()=="")
    {alert("结束日期不能为空！谢谢。");}
  }
  url_=url_+"?start_date=" +start_date+"&end_date=" + end_date;

  //如果预设组合，增加预设值
  if(jQuery("#preSetContainer").css("display")!="none")
  {
    if(document.getElementById("selectedPreset")==null){}
    else{
      var value_=jQuery("#selectedPreset").find(".divContainerSon").text();
      var temp_=BROADCAST_PO_DEFAULT;
      for(var a=0;a<temp_.length;a++)
      if(temp_[a].name==value_)
      {
        var POTYPE_=(temp_[a].POTYPE=="SVOD")?"2,5" : "1,3";
        url_=url_+"&potypes=" + POTYPE_ + "&poids=" + temp_[a].POIDS + "";
        break;
      }
    }
  }
  else{  //非预设组合
    if(jQuery("#broSingle_broType").find("#downMenuText").text()=="时移回看")
    {
      url_=url_+"&potypes=60010000,60010002,60010010,60010011,60010012";
    }
    else{
      var text_=jQuery("#broSingle_broType").find("#downMenuText").text();
      switch(text_)
      {
        case "按次点播(RVOD)":
          var POTYPE_="1,3";var poids=jQuery("#singleSearch_inputIDregion").val();
          url_=url_+"&potypes=" + POTYPE_;
          if(poids!=""){url_=url_+"&poids=" + poids + "";};
          break;
        case "服务包(SVOD)":
          var POTYPE_="2,5";
          var service_package_id="";
          var poid_get_by_packageID=[];
          var inputText_package_id=jQuery("#singleSearch_inputIDregion").val();
          var packageUrl = LSMS_PATH+"servicepackage/"+inputText_package_id+"";
          var return_data=[];
          jQuery.ajax({
            type: "GET",
            url: packageUrl,
            async: false,
            dataType: "json",
            headers: {
              "Accept": "application/multiapp-viewhistory"
            },
            success: function (data) {
              return_data=data;
            }
          })
          for(var a=0;a<return_data.length;a++)
          {
            var poid_get_by_packageID_unit=[];
            var po_id_list_array=return_data[a].po_id_list.split(",");
            for(var b=0;b<po_id_list_array.length;b++)
            {
              poid_get_by_packageID_unit.push(po_id_list_array[b])
            }
            poid_get_by_packageID.push(poid_get_by_packageID_unit);
          }
          var poid_get_by_packageID_all=[];
          for(var c=0;c<poid_get_by_packageID.length;c++)
            for(var d=0;d<poid_get_by_packageID[c].length;d++)
            {poid_get_by_packageID_all.push(poid_get_by_packageID[c][d])}
          var poid_get_by_packageID_all_distinct_sorted=brodecaSingleSearch.removeRepeated(poid_get_by_packageID_all);
          var poids_=poid_get_by_packageID_all_distinct_sorted.join(",");
          url_=url_+"&potypes=" + POTYPE_ + "&poids=" + poids_ + "";
          break;
        default:
          break;
      }
    }
  }

  var cardIDInput=jQuery("#cardIDinput").val()+",";
  brodecaSingleSearch.cardIDInput=jQuery("#cardIDinput").val();
  var begindateInput="("+start_date+"--";
  brodecaSingleSearch.begindateInput=jQuery("#date-input-from #date-input-from-datepicker-input").val();
  var enddateInput= end_date+")";
  brodecaSingleSearch.enddateInput=jQuery("#date-input-to #date-input-to-datepicker-input").val();
  brodecaSingleSearch.date_field= jQuery("#downMenuText").text();
  if((jQuery("#cardIDinput").val()!="")&&(jQuery("#date-input-from #date-input-from-datepicker-input").val()!="")&&(jQuery("#date-input-to #date-input-to-datepicker-input").val()!=""))
  {
    jQuery("#cardID-result").text(cardIDInput);
    jQuery("#begindate-result").text(begindateInput);
    jQuery("#enddate-result").text(enddateInput);
    if(jQuery("#newCreateButton").length==0){
      jQuery(".pageAllBodyContainerTitle").append("<div alt=\"edit\" id= \"newCreateButton\" class=\"pageTitleContainerRightButt\" onclick=\"brodecaSingleSearch.popup_editSearch();\" style=\"background-color:#4eb7f0;border-color:#0b88ca;float:left;width:70px;height:28px;line-height:28px;margin-left:3px;margin-top:4px;font-size:14px;font-family: 'Hiragino';\">编&nbsp;辑</div>")};
    brodecaSingleSearch.current_popup_height=jQuery("#centerPopupStyle").height();
    brodecaSingleSearch.closeCenterDiv();
    brodecaSingleSearch.IsDialogNewOrEdit="";
  }
  var type__= "GET";
  var url__=url_+"&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
  this.noteUrl=url_.replace(aquapaas_host,PaaSDownloadHost);
  jQuery.ajax({
    type: type__,
    url: url__,
    async: false,
    dataType: "json",
    headers: {
      "Accept": "application/multiapp-viewhistory",
        "x-aqua-sign":getPaaS_x_aqua_sign(type__,url__)
    },
    success: function (data) {
      if (data) {
        brodecaSingleSearch.drawTable(data)
      }
      else {
        alert("没有记录，请重新填写搜索条件，谢谢。");
        brodecaSingleSearch.clearAllTableData();
      }
    },
    error: function (data) {
      alert("没有记录，请重新填写搜索条件，谢谢。");
      brodecaSingleSearch.clearAllTableData();
    }
  })
}


brodecaSingleSearch.mopen = function(object,id,isFather){
  if( (id=="downMenu")&&( (document.getElementById("downMenuText")!=null)&&(document.getElementById("downMenuText").innerHTML.indexOf("自定义")!=-1 )) )
  {
    return
  }
  jQuery(".downMenu").each(function(){
    if(id!==jQuery(this).attr("id"))
    {jQuery(this).css("display","none")}
  });
	var ddmenuitem = jQuery("#"+id);
	if(ddmenuitem.css("display")=="none")
	{
	  ddmenuitem.css("display","block");
    }
	else
	{
      ddmenuitem.css("display","none");
    }
    if(!isFather){//子节点
      if(object)
      {
        var inputText=jQuery(object).text();
        var object_parent=jQuery(object).parent();
        var object_parentB=jQuery(object_parent).parent();
        jQuery(object_parentB).find("div[name='inputTitle']").text(inputText)
      }
   }
	jQuery("#mCSB_1").css("padding-left","0");
    if(id=="downMenu_bro_typeCombine")
    {
      var id_=jQuery(object).attr("id");
      var text_="";
      switch(id_)
      {
        case "typeCombin1":
          document.getElementById("singleSearch_displayIfTypeSelfDefined").style.display="block";
          document.getElementById("singleSearch_displayIfTypeSelfDefinedB").style.display="block";
          document.getElementById("singleSearch_displayIfTypeSelfDefinedB").innerHTML="请输入服务包代号(Service Package),用“,”号分隔";
          break;
        case "typeCombin2":
          document.getElementById("singleSearch_displayIfTypeSelfDefined").style.display="block";
          document.getElementById("singleSearch_displayIfTypeSelfDefinedB").style.display="block";
          document.getElementById("singleSearch_displayIfTypeSelfDefinedB").innerHTML="请输入PO ID , 用“,”号分隔";
          break;
        case "typeCombin3":
          document.getElementById("singleSearch_displayIfTypeSelfDefined").style.display="none";
          document.getElementById("singleSearch_displayIfTypeSelfDefinedB").style.display="none";
          break;
        default:
          break;
      };
      var size_=this.checkSizeStyle();
      this.resetPopupSize(size_)
    }

}

brodecaSingleSearch.change_link_broType = function(obj,dropMenu_title_ID) {
  var current_height=jQuery("#centerPopupStyle").height();
  var diverse_height=jQuery("#broad_singleSearch_servicePackage_downMenu_container").outerHeight(true)+jQuery("#inputText_id_field").outerHeight(true)+jQuery("#broad_singleSearch_id_input_noteWords").outerHeight(true)//消失或出现的这些元素的高度。
  if(jQuery(obj).text()=="RVOD")
  {
    //var new_height=(current_height-diverse_height)+"px";
    var new_height=current_height;
    if(jQuery("#broad_singleSearch_servicePackage_downMenu_container").css("display")=="block")
      {jQuery("#centerPopupStyle").height(new_height)}
    //jQuery("#broad_singleSearch_servicePackage_downMenu_container").css("display","none");
    //jQuery("#inputText_id_field").css("display","none");
    //jQuery("#broad_singleSearch_id_input_noteWords").css("display","none");
  }
  else
  {
    //var new_height=(current_height+diverse_height)+"px";
    var new_height=current_height;
    if(jQuery("#broad_singleSearch_servicePackage_downMenu_container").css("display")=="none")
    {jQuery("#centerPopupStyle").height(new_height)}
    jQuery("#broad_singleSearch_servicePackage_downMenu_container").css("display","block");
    jQuery("#inputText_id_field").css("display","block");
    jQuery("#broad_singleSearch_id_input_noteWords").css("display","block");
    jQuery("#broad_singleSearch_servicePackage").text("Service Package");
  }
}

brodecaSingleSearch.dataPickerIssue = function() {
	var calendarStyles = {
		width: 200,
		navTitleHeight: 20,
		navTitleBgColor: '#2ea1d7',
		datesViewHeight: 150,
		datesViewGridColor: '#e2e2e2',
		datesViewCellColor: '#ffffff',
		weekdaysHeight: 20,
		weekdaysColor: '#000000',
		currMonthColor: '#737373',
		nonCurrMonthColor: '#e2e2e2'
	};
	this.datePicker_startDate = new DatePicker({
		containerId: 'date-input-from',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	this.datePicker_endDate = new DatePicker({
		containerId: 'date-input-to',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	this.datePicker_startDate.onChange = function() {
		var datestr = this.getDateStr();
		jQuery("form[method=POST] input[name=start_date]").val(datestr);
	};
	this.datePicker_endDate.onChange = function() {
		var datestr = this.getDateStr();
		// var year = this.getYear();
		// var month = this.getMonth();
		// var date = this.getDate();
		jQuery("form[method=POST] input[name=end_date]").val(datestr);
	};
};	
	
brodecaSingleSearch.catchInput= function()
{
	brodecaSingleSearch.dataPickerIssue();
	//brodecaSingleSearch.showSelectCalendar("from-date-selector", brodecaSingleSearch);
}

brodecaSingleSearch.catchInputTwo= function()
{
	brodecaSingleSearch.showSelectCalendar("to-date-selector", brodecaSingleSearch);
}

brodecaSingleSearch.showSelectCalendar = function(calId, list){
	this.calId = calId;
	var sel_cal = new Calendar(calId);
	jQuery("#ctrl-title").css("background-color","#0f84a1")
	
	sel_cal.extendOnClick = function(object){
		var day = parseInt(object.innerHTML, 10);
		var year = sel_cal.helper.curr_month[0];
		var month = sel_cal.helper.curr_month[1];
		list.setDateRange(day, month, year, calId);
		
	};
};

brodecaSingleSearch.lessTenPluwZero = function(object){//如 把 2014-9-6 转化为 2014-09-06
if (object < 10) 
	{object="0" + object;} 
	return object;
	
}

brodecaSingleSearch.setDateRange = function(day, month, year, calId){
	switch(calId){
		case "from-date-selector":
			var from_input =jQuery("#date-input-from");
			var label = String(year) + "-" + String(month+1) + "-" + String(day);
			var strSplit=label.split("-");
			strSplit[1]=brodecaSingleSearch.lessTenPluwZero(strSplit[1]);
			strSplit[2]=brodecaSingleSearch.lessTenPluwZero(strSplit[2]);
			var strJoin=strSplit.join("-");
			from_input.text(""); 
			from_input.val(strJoin); 
			this.from_set = true;
 			break;
		case "to-date-selector":
			var to_input = jQuery("#date-input-to");
			var labelTwo = String(year) + "-" + String(month+1) + "-" + String(day);
			to_input.attr("value",labelTwo);
			var labelTwo = String(year) + "-" + String(month+1) + "-" + String(day);
			var strSplitTwo=labelTwo.split("-");
			strSplitTwo[1]=brodecaSingleSearch.lessTenPluwZero(strSplitTwo[1]);
			strSplitTwo[2]=brodecaSingleSearch.lessTenPluwZero(strSplitTwo[2]);
			var strJoinTwo=strSplitTwo.join("-");
			to_input.text(""); 
			to_input.val(strJoinTwo);			
			this.to_set = true;
			break;
		default:
			break;
	}
	this.destroyCalendar();
};

brodecaSingleSearch.destroyCalendar = function(){

	var from_sel_cal = jQuery(".date-selector");
	var to_sel_cal = jQuery("#to-date-selector");
	from_sel_cal.empty(); 
	to_sel_cal.empty(); 
};


brodecaSingleSearch.init();