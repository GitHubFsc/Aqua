var login = new Object();

login.tifAdmin = {};
login.tifAdmin.host = tifAdmin_host;
login.tifAdmin.restRoot = login.tifAdmin.host + "/rest/dojo/liveevent";

login.aqua = {};
login.aqua.host = aqua_host;
login.aqua.restRoot = login.aqua.host + "/aqua/rest/dojo";
login.aqua.tifPath = "/default/tif";
login.aqua.tifDomainURI = "/cdmi_domains" + login.aqua.tifPath;
login.aqua.tifRole = null; //0:老师; 1:老师+学生; 2:学生

login.aqua.userName = null;
login.aqua.accessKeyId = null;
login.aqua.secretAccessKey = null;
login.aqua.proDomainURI = null; // "/cdmi_domains/default/xinguoxian";
login.aqua.proPath = null; // "/default/xinguoxian/";
login.aqua.userParentURI = null; // login.aqua.proPath + "总公司/users";

login.aqua.loginUsingValue = null; // "/default/xinguoxian/";

login.aqua.tifName = "";
login.aqua.tifPassword = "";
login.aqua.tifAdminUserId = "";
login.aqua.tifAdminDomain = "";


login.user = {};
login.user.cookies = "";


login.go = function() {
	login.addCookie();
	var loginAquaUserName = jQuery("#un").val();
	var loginAquaPassword = jQuery("#pwd").val();
	jQuery("#user_name").text(loginAquaUserName);
	login.user.user_name = loginAquaUserName;
    paasLogin(loginAquaUserName, loginAquaPassword, function(data) {
    my.paas.user_id = data.user_id;
    my.paas.access_token = data.access_token;
    my.paas.refresh_token = data.refresh_token;
    getPaaSUser(data.user_id, data.access_token, function(paasUser) {
      my.paas.user = paasUser;
      my.paas.user_name = paasUser.user_name;
      my.paas.user_type = paasUser.metadata.AquaPaaSAdv_UserRole || '';
      jQuery("#part1").css("display","none");
      jQuery("#part2").css("display","block");
      navigate.initIndex();
      window.onloa();
    }, function() {
      alert("登录失败");
    });
  }, function() {
    alert("登录失败");
  });
	}
		//alert("75");
	window.onloa = function() {
	if(loginToIndex=="true")
	//window.location.href = "login.html?";
    //navigate.initIndex();
	/*if(loginToIndex=="true")
	{jQuery("#part1").css("display","none");
	jQuery("#part2").css("display","block")}
	else
	{jQuery("#part1").css("display","block");
	{jQuery("#part1").css("display","block");
	jQuery("#part2").css("display","none")};
	loginToIndex="false";*/
	{
	
		var xhr = new XMLHttpRequest();
		xhr.open('GET', aqua_host + "/rest/dojo/organization/usersession/");
		xhr.withCredentials = true;
		xhr.onload = function(){
			
			var responseJsonA=JSON.parse(xhr.responseText);
			for(i=0;i<responseJsonA.items.length;i++)
			{
				if(responseJsonA.items[i].listOfRole.allID)
				{	//console.log("174");
					var jsonArray=new Array();
					if((responseJsonA.items[i].listOfRole.allID).indexOf(";")>0)
					{	jsonArray=responseJsonA.items[i].listOfRole.allID.split(";");
						//console.log("178");
						//console.log(jsonArray);
						//console.log(jsonArray.length);
						var countA=0;
						for(j=0;j<jsonArray.length;j++)
						{//console.log(jsonArray[j]);
							if(jsonArray[j]=="RO990002")
							{//console.log("181");
							window.menuAppear();
							countA++;
							break;
							}
							else{continue};
						}
						if(countA==0)
						{var Height=jQuery("#page_head_container").height();
						jQuery("#logo").css("height",Height);
						alert("该用户没有权限查看此网页，请使用其他帐号登录")}
					}
					else{
						if(responseJsonA.items[i].listOfRole.allID=="RO990002")
						{//console.log("189");
						window.menuAppear();
						}
						else{
						//console.log("202");
						var Height=jQuery("#page_head_container").height();
						jQuery("#logo").css("height",Height);
						alert("该用户没有权限查看此网页，请使用其他帐号登录")}
					};
				};
			};
		};
		xhr.send();
	}
	loginToIndex="false"
}

window.menuAppear = function() {
	var xhrB = new XMLHttpRequest();
	//xhr.open('GET', aqua_host + "/rest/dojo/organization/roles/BasicAuthorities");
	xhrB.open('GET', aqua_host + "/rest/dojo/organization/roles/RO990002");
	xhrB.withCredentials = true;
	xhrB.onload = function(){
		//console.info(xhr.responseText);
		var responseJsonB=JSON.parse(xhrB.responseText); 
		//console.info("responseJson");
		//console.info(responseJsonB);
		for(i=0;i<responseJsonB.items.length;i++)
		{if(responseJsonB.items[i].listOfInclusion)
				{
				for(j=0;j<responseJsonB.items[i].listOfInclusion.length;j++)
					{
						//console.log("61");
						if(responseJsonB.items[i].listOfInclusion[j].$!="BA990001")
						{
						
						var Height=jQuery("#page_head_container").height();
						jQuery("#logo").css("height",Height);
						
						//navigate.initIndex();
						//jQuery("#menu_top").css("display","block");
						//jQuery("#menu_top").children(":visible").first().click();
						alert("该用户没有权限查看此网页，请使用其他帐号登录");
						}
						else{
							navigate.initIndex();
						}
						//else
						//{navigate.initIndex()}
					}
				
				};
		};
	};
	xhrB.send();
};


login.rmbUserName = function(userName) {
    var rmbPwdSrc = document.getElementById("rmb_pwd").src;
    if (rmbPwdSrc.indexOf("checked") != -1) {
        var user = "tp_user_name=" + userName + ",tp_ck_out_of_date=" + (new Date().getTime() + 14 * 24 * 3600000) + ",rmb_chk=1";
        document.cookie = user + ";";
    } else {
        document.cookie = "tp_user_name=" + userName + ",tp_ck_out_of_date=" + (new Date().getTime()) + ",rmb_chk=0";
    }
};

/**
 * 切换记住用户名标志
 */
login.changeRmbFlag = function() {
    var flagPicker = document.getElementById("rmb_pwd");
    if (flagPicker.src.indexOf("checked") != -1) {
        flagPicker.src = "images/login/lgin_rmb_pwd_nocheck.png";
    } else {
        flagPicker.src = "images/login/lgin_rmb_pwd_checked.png";
    }
    this.rmbUser = flagPicker.src;
};

/**
 * 登陆页面加载
 */
window.onload = function() {
    //加载logo
    /*if(wsp_flag == FOR_VDU){
        document.getElementById("logo").className = "logo_vdu";
    }*/
    if (this.rmbUser) {
        document.getElementById("rmb_pwd").src = this.rmbUser;
    }
    //记住密码时，回填密码
    //var rmbPwdSrc = document.getElementById("rmb_pwd").src;
    //if(rmbPwdSrc.indexOf("checked") != -1){
    var userInfos = document.cookie.split(";");
    for (var i = 0; i < userInfos.length; i++) {
        var tmp = userInfos[i].split(",");
        if (tmp.length == 3 && tmp[1].indexOf("tp_ck_out_of_date") != -1) {
            if (parseInt(tmp[1].replace("tp_ck_out_of_date=", "")) > new Date().getTime() && document.getElementById("un").value == "" && userInfos[i].indexOf("tp_user_name") != -1) {
                document.getElementById("un").value = tmp[0].replace("tp_user_name=", "").replace(/[ ]/g, "");
            }
            if (tmp[2].replace("rmb_chk=", "") == "1") {
                document.getElementById("rmb_pwd").src = "images/login/lgin_rmb_pwd_checked.png";
            } else {
                document.getElementById("rmb_pwd").src = "images/login/lgin_rmb_pwd_nocheck.png";
            }
            break;
        }
    }
    //}
};

login.addCookie= function() {
	var userName= jQuery("#un").val();
	var userPass= jQuery("#pwd").val();
	var path="/";
	if((jQuery("#rmb_pwd").attr("src").indexOf("_checked")!=-1))
	{
		var name = encodeURIComponent(userName);  
		localStorage['login_user_name'] = name;
	}
};

login.getCookieValue=function(){
	jQuery("#rmb_pwd").attr("src","images/login/lgin_rmb_pwd_checked.png");
	var allcookies="";
	if(localStorage&&localStorage["login_user_name"])
	{
		var userName=decodeURIComponent(localStorage["login_user_name"]);
		jQuery("#un").val(userName);
	}
}

jQuery(document).ready(function(){
	jQuery("#part2").css("display","none");
	login.getCookieValue();
	
});

