/**
 * 供多个模块调用
 * 专向tif或aqua发送put,get,delete,post请求的
 * @author qiang.huo
 * @date 2013-12-27
 */
var cmnCender = new Object();

/**
 * 获取老师和学生（授权课）所有课时信息
 * @param curPage 当前页
 * @param pageSize 页面大小
 * @param keyWord 搜索关键字
 */
cmnCender.getListCh = function(curPage,pageSize,keyWord,fromHls){
    var data;
    var url = my.tifAdmin.restRoot + "/coursehour/coursehours/wfes;jsessionid=" + my.tifAdmin.jsessionId;
    var searchKey = "&teacherID=";
    if (fromHls){
        if (my.aqua.tifRole && (my.aqua.tifRole == "1" || my.aqua.tifRole == "2")){
            searchKey = "&studentID=";
        }
    }
    var search = "?pageNumber="+curPage+"&pageSize="+pageSize+"&order=asc&beginTime="
        +getDate(0, 14)+"&endTime="+getDate(pls_day, 14)+ searchKey + navigate.session.userName;

    dojo.xhrGet({
        url : url + search,
        timeout : 5000,
        handleAs : "json",
        headers : {
            "Content-Type" : "application/json"
        },
        sync : true,
        load : function(response, isArg) {
            if(response && response.items){
                data = response;
            }
        },
        error : function(response, isArg) {
            reloginOption(response);
            data = null;
        }
    });
    return data;
};

/**
 * 获取学生（公开课）所有课时信息
 * @param curPage 当前页
 * @param pageSize 页面大小
 * @param keyWord 搜索关键字
 */
cmnCender.getListUnlimitedCh = function(curPage,pageSize,keyWord){
    var data;
    var url = my.tifAdmin.restRoot + "/coursehour/listunlimitedcoursehours/wfes;jsessionid=" + my.tifAdmin.jsessionId;
    var search = "?pageNumber="+curPage+"&pageSize="+pageSize+"&order=asc&beginTime="
        +getDate(0, 14)+"&endTime="+getDate(pls_day, 14)+ "&studentID=" + navigate.session.userName;

    dojo.xhrGet({
        url : url + search,
        timeout : 5000,
        handleAs : "json",
        headers : {
            "Content-Type" : "application/json"
        },
        sync : true,
        load : function(response, isArg) {
            if(response && response.items){
                data = response;
            }
        },
        error : function(response, isArg) {
            reloginOption(response);
            data = null;
        }
    });
    return data;
};

/**
 * 获取老师和学生（授权课－历史）一年前到当前时间-5分钟所有课时信息
 *
 */
cmnCender.getListChHistory = function(curPage,pageSize,keyWord){
    var data;
    var url = my.tifAdmin.restRoot + "/coursehour/coursehours/wfes;jsessionid=" + my.tifAdmin.jsessionId;
    var searchKey = "&teacherID=";
    if (my.aqua.tifRole && (my.aqua.tifRole == "1" || my.aqua.tifRole == "2")){
        searchKey = "&studentID=";
    }
    var search = "?pageNumber="+curPage+"&pageSize="+pageSize+"&order=desc&beginTime="
        +getDate(0-365, 14)+"&endTime="+ getDateM(0-5, 14)+ searchKey + navigate.session.userName+"&JSESSIONID=" + my.tifAdmin.jsessionId;
    dojo.xhrGet({
        url : url + search,
        timeout : 5000,
        handleAs : "json",
        headers : {
            "Content-Type" : "application/json"
        },
        sync : true,
        load : function(response, isArg) {
            if(response && response.items){
                data = response;
            }
        },
        error : function(response, isArg) {
            reloginOption(response);
            data = null;
        }
    });
    return data;
};


/**
 * 获取学生（公开课－历史）一年前到当前时间-5分钟所有课时信息
 *
 */
cmnCender.getListChUnlimitedHistory = function(curPage,pageSize,keyWord){
    var data;
    var url = my.tifAdmin.restRoot + "/coursehour/listunlimitedcoursehours/wfes;jsessionid=" + my.tifAdmin.jsessionId;
    var search = "?pageNumber="+curPage+"&pageSize="+pageSize+"&order=desc&beginTime="
        +getDate(0-365, 14)+"&endTime="+getDateM(0-5, 14)+ "&studentID=" + navigate.session.userName;
    dojo.xhrGet({
        url : url + search,
        timeout : 5000,
        handleAs : "json",
        headers : {
            "Content-Type" : "application/json"
        },
        sync : true,
        load : function(response, isArg) {
            if(response && response.items){
                data = response;
            }
        },
        error : function(response, isArg) {
            reloginOption(response);
            data = null;
        }
    });
    return data;
};
