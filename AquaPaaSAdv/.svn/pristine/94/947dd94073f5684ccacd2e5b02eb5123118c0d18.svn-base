var localeLanguage = 'zh_CN.json';

var paasHostIP = '192.168.7.143';
var paasHostPort = '8080';
var paasHost = 'http://' + paasHostIP + ':' + paasHostPort;

var paasAppKey = 'aquapaasadv';
var paasAppSecret = 'b27fbdd2d67783398f94c4bb7e80ab83e51c38dc393f90587d31974723b2';
var paasDomain = '/aquapaas/rest';
var paasAdvDomain = '/aquapaas_adv/rest';

var storage_username = "adsadmin";
var storage_password = "111111";
var storage_domain   = "/cdmi_domains/default/";
var storage_images_folder        = "images/";
var storage_videos_folder        = "videos/";
//素材 足迹相关 上传存放足迹海报的目录地址配置
var storage_footprint_poster_folder        = "footprintposter/";
//广告系统 素材H5模板的aqua网盘地址
//storage_htmltemplate_origin_folder 对应初始模板地址，仅供用户选择模板并预览
//   有两级目录
//   第一级目录对应模板分类。
//   第二级目录对应模板名称，里面存放index.html，template.json等文件
//storage_htmltemplate_save_folder 对应正在编辑中或者已编辑完成的模板存放地址，供用户编辑模板。
//   默认存放到图片素材路径下，也可以如下额外设置
//   var storage_htmltemplate_save_folder = "htmltemplate_save/";
var storage_htmltemplate_origin_folder = "htmltemplate/";
var storage_htmltemplate_save_folder = storage_images_folder;
var storage_qualification_folder = "qualification_file/";
//自助广告主管理页面上传门脸照片和身份证等照片的路径。
var storage_self_service_adviser_images_folder ="users/";

var aquaHostIP = '192.168.7.143';
var aquaHostPort = '8080';
var aquaHost = 'http://' + aquaHostIP + ':' + aquaHostPort;

var paasTokenRefreshInterval = 10 * 60 * 1000;

var channel_list = [{
    channel_name:"上海频道",
    channel_value:"1"
},{
    channel_name:"杭州频道",
    channel_value:"2"
},{
    channel_name:"广东频道",
    channel_value:"3"
},{
    channel_name:"蒙古频道",
    channel_value:"4"
},{
    channel_name:"北京频道",
    channel_value:"5"
},{
    channel_name:"香港频道",
    channel_value:"6"
}]

var category_list = [{
    category_name:"category1",
    category_value:"1"
},{
    category_name:"category2",
    category_value:"2"
},{
    category_name:"category3",
    category_value:"3"
},{
    category_name:"category4",
    category_value:"4"
},{
    category_name:"category5",
    category_value:"5"
},{
    category_name:"category6",
    category_value:"6"
}];

/*
 CDN_SITE 视频类型素材发送到CDN的配置
 如果直接删去CDN_SITE配置这一行,则视频类型素材不显示CDN选项
 如果CDN_SITE="",则是默认设置(通用风格)
 如果CDN_SITE="广视",则是广视cdn发布(采用通用风格，但去掉了“首帧图片”选项)
 如果CDN_SITE="佳创",则是佳创cdn发布(只有“是否需要切片”选项)
* */
var CDN_SITE = "佳创";

/*
 IMG_CDN_SITE 图文类型素材发送到CDN的配置
 如果直接删去IMG_CDN_SITE配置这一行 或者 IMG_CDN_SITE="",则图文类型素材不显示CDN选项
 如果IMG_CDN_SITE="国安",则是中信国安广视云南电信CDN发布(只有“是否需要切片”选项)
 * */
var IMG_CDN_SITE = "国安";

/*
区域标签管理
 区域第一级的配置
 * */
var AREA_LEVE1 = [
    {id:"10001", name:"中国"}
];

//分级广告系统类型： 中央 central, 地方local, 独立solo
var AdvSystemType = 'solo';

//当前站点的site id
var AdvSelfSiteId = '01';
//当前站点名称
var AdvSelfSiteName = '黄埔';
//中央站点Id
var AdvCentralSiteId = '01';

//dm模块的主uri
var dmRootUri="http://172.16.20.157:8080/aquapaas/rest/dm";

var JumpSiteUrlPrefix = [
  {siteId:"02", url:"http://172.16.20.157:8080/paasadv_local/index.html"},
  {siteId:"03", url:"http://172.16.20.157:8080/paasadv_local/"},
  {siteId:"003", url:"http://172.16.20.157:8080/paasadv_local/"},
  {siteId:"16", url:"http://172.16.20.157:8080/paasadv_local/"},
];
//中央站点的广告系统管理界面上，由于中央站点不在DM的Site表中，所以需要在站点管理的页面上找一个入口是给中央站点自己的监控入口的。
//点击此入口跳转至中央站点的监控Zabbix页面，此入口的地址由管理页面配置，不从服务器获取。
var AdvCentralSiteMonitorAddress = 'http://172.16.20.155:8080/zabbix/';

//素材页面审核 1:启用一次审核 2:二次审核。目前只能支持到2次审核。
var SUCAI_AUDIT_LEVEL = 2;
//计费说明链接地址
var ChargeTypeLink = 'http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/adsadmin/charge.html';

//是否素材增强 true-启用 false-禁用.默认为false
var SUCAI_ENHANCE = false
// 本地素材库地址
var LocalImageServer = 'http://172.16.20.229:8080/ca/imageserver/';

//平台数据
var PLATFORM = [{name: "长宁", platform_id: "changning"},
	{name: "淄博", platform_id: "zibo"},
	{name: "北京", platform_id: "beijing"},
	{name: "合肥", platform_id: "hefei"},
	{name: "张家港", platform_id: "zhangjiagang"}];

