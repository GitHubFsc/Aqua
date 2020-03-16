var  BasicSettings= new Object();

BasicSettings.init = function(){
	BasicSettings.windowResize();
	BasicSettings.callScroll();
	BasicSettings.ajaxGetTimeSettings();
}

BasicSettings.callScroll=function(){
            jQuery("#downMenu,#downMenuB").mCustomScrollbar(
				{
					//setHeight:280,
					theme:"purple"
				}
			);
			
			jQuery("#downMenu div,#downMenuB div").css(
				{"padding-left":"0","border-right":"0"}
			);
			jQuery(".downTab").css({"padding-left":"16px","border-left":"0"});
			jQuery(".hoverNone, #mCSB_1_container").css("border-left","0");
			jQuery("#downMenu div,#downMenuB div").addClass("hoverNone");
			jQuery(".downTab,.mCSB_dragger_bar").removeClass("hoverNone");
			jQuery(".mCSB_1_scrollbar_vertical").addClass("hoverGray");
			jQuery(".mCSB_dragger_bar").css("background-color","#1B9EBE")
			
}


BasicSettings.windowResize=function()
{	

	jQuery(window).resize(function()
	{

		BasicSettings.resizePage_container();
	});
		BasicSettings.resizePage_container();
}

BasicSettings.resizePage_container=function()
{	
	if(jQuery("#boRecord_pageBasicSettings").attr("class")!=undefined){

	var contentMarginTop=jQuery("#page_container").height()-jQuery("#pageAllBodyContainerTitle").outerHeight()-jQuery("#pageTitleContainer").outerHeight()-parseInt(jQuery("#BodyContentBelow").css("marginTop").replace(/px/g,""))-parseInt(jQuery("#pageAllBodyContainer").css("marginTop").replace(/px/g,""))-jQuery("#contentBottomContainer").outerHeight()-parseInt(jQuery("#contentBottomContainer").css("marginBottom").replace(/px/g,""));
	jQuery("#BodyContentBelow").css("height",contentMarginTop);
	//jQuery("#page_container").height(jQuery("#menu").height());
	}
}

BasicSettings.mopen = function(object,id)
{
	ddmenuitem = jQuery("#"+id);
	if(ddmenuitem.css("display")=="none")
	{
	ddmenuitem.css("display","block");}
	else
	{ddmenuitem.css("display","none");}
	if(object)
		{console.log("38"+id);
		switch (id)
			{
			case "downMenu":
				var inputText=jQuery(object).text();
				jQuery("#downTabTopA").text("");
				jQuery("#downTabTopA").text(inputText);
				break;
			case "downMenuB":
				var inputTextB=jQuery(object).text();
				jQuery("#downTabTopB").text("");
				jQuery("#downTabTopB").text(inputTextB);
				 break;
			}
		}
	//if(jQuery(object).attr("id")!="chooseDown")
	//{BasicSettings.ajaxPutTimeSettings(jQuery("#downTabTopA").text().replace(/号（每月）/g,""),jQuery("#downTabTopB").text().replace(/号（每月）/g,""));}
}

BasicSettings.ajaxGetTimeSettings=function()
{
    var type_="GET";
    var url_=aquapaas_host+'/aquapaas/rest/multiapp/viewhistory/configuration'+"?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
	jQuery.ajax({
		type:type_,
		url: url_,
		headers: {
		'accept': 'application/json',
		'content-type': 'application/json',
        'x-aqua-sign':getPaaS_x_aqua_sign(type_,url_)
		},
		async: false,
		dataType: 'json',
		success: function(data){
			jQuery("#downTabTopA").text(data.metadata["multiapp.viewhistory.timed_export_month_run_day"]+"号（每月）");
			jQuery("#downTabTopB").text(data.metadata["multiapp.viewhistory.timed_export_month_edge"]+"号（每月）")
				},
		error:function(data){
		console.log("97");
		return false;
		}
	})

}


BasicSettings.ajaxPutTimeSettings=function()
{	var inputText=jQuery("#downTabTopA").text().replace(/号（每月）/g,"");
	var inputTextB=jQuery("#downTabTopB").text().replace(/号（每月）/g,"");
    var type_="PUT";
    var url_=aquapaas_host+'/aquapaas/rest/multiapp/viewhistory/configuration'+"?app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
	jQuery.ajax({
			type:type_,
			url:url_,
			headers: {
			'accept': 'application/json',
			'content-type': 'application/json',
            'x-aqua-sign':getPaaS_x_aqua_sign(type_,url_)
			},
			async: false,
			data: JSON.stringify({
			'metadata': {
			  'multiapp.viewhistory.timed_export_month_run_day': inputText,
			  'multiapp.viewhistory.timed_export_month_edge': inputTextB
			}
			}),
		  dataType: 'json',
		  success: function(data){
				alert("保存成功")
						},
						
		error:function(){
		console.log("97");
		return false
				}
	})
}


BasicSettings.init();