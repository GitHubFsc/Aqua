var paasHost = "http://192.168.7.143:8080";
// var paasHost = "http://api.xor-live.io";
var paasAppKey = 'aquaBO';
var paasAppSecret = '9fa9c25876d865b086efb01d66630e746ea435d51db604fd9c90c6e24ffc';
//AquaPaaS refresh_token 间隔，单位毫秒
var paasTokenRefreshInterval = 10 * 60 * 1000;
// daas config
var daasHost = 'http://172.16.20.62:8118'

//homed订购网关
var SPHost = 'http://selfservice.homed.me';
//homed订购网关端口
var SPPort = '12990';
//产品的productid
var ProductId = '123';

//是否打印测试日志
var printLog = true;
//是否使用测试卡号
var useDebugCard = true;
//测试卡号
var debugCardNumber = "0390813931";

//首页树名称
var naviTreeName = 'quanwangshi首页'
//二级页面树名称
var secondTreeName = 'quanwangshi'
var onlineOrder = false;

//机顶盒类型 3：Linux(2200) 视频播放页地址
var LinuxPlayerUrl = "http://webclient.homed.me/application/newPlay/vodPlay.htm";
//机顶盒类型 3：Linux(2200) 视频播放页参数
var LinuxPlayParam = {
	type : "vod",	//点播类型，SP点播写死”vod“
	vodObj:{	//主要传递影片的一些信息，目前传入name，id
		videoId: "",//影片id
		videoName: "",//影片名称 [encodeURIComponent编码后传过来]
	},
	backUrl: location.href,	//返回/退出地址，影片播放完成后返回的地址, 为空则返回首页  ,必选字段
	labelId: "",	//所属栏目labelid，主要是用户贴片广告的使用预留，可选字段。具体值iPanel在线下提供。
	fromSP: "ZGD",	//SP的名称 ,媒资adi文件中的供应商代码， SP进入必选字段
	freeVideoFlag: false,	 // true表示试看，false表示正片 , 必选字段
	seektime: "0"		//断点续播的时间点，单位秒。如不需要可不传
};
