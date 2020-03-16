//是否显示日志层
var showLog = false;

//应用入口
//var frameEntrance = 'http://172.16.174.55:8088/11/index.html?t='
var frameEntrance = 'http://172.16.189.66:45677/CyberCloud_Dispatcher.htm?StartAppID=30003001&StartAppParam=http://172.16.150.16:8282/win8_gh_show/954/996/index.html%3fV%3d1557233098046'

//数据树路径
var paas_host = 'http://172.16.188.78:8080'
var treeRoot = paas_host + '/aquapaas/rest/navigation/trees/年华/美食课堂';
var app_key = 'NHAPP';//树结构的app_key
var paasAppSecret = '5a3d3cd2dd9d978bb5b7f0d1e2014d4d92f832c48f556c6366a348babac5';

//播放相关参数
var appKey = 'ahokshqmx1kpg21';
var appMode = 'Mixed';
var appType = 'WEB';
var appId = '30003174';//瘦终端应用ID
var portalAppId = 30003001; // 瘦终端主页的APPID
var MovieID = '1001010673';
var linuxLink = 'http://172.16.150.16:8282/win8_gh_show/954/996/index.html';
var androidLink = 'http://172.16.150.16:8282/win8_gh_show/954/996/index.html';
var thinClientLink = 'http://172.16.150.16:8282/win8_gh_show/954/996/index.html';
var DeviceType = 3; // 1: 安卓浪潮机顶盒 2:安卓九州机顶盒 3:Linux(2200)机顶盒
//Linux机顶盒VSP播放路径
// var LinuxPlayerUrl = 'http://172.16.174.55:8088/11/play/vod_play.html';
var LinuxPlayerUrl = 'http://172.16.179.51:8080/vsp_outlet/player/load/page';
//Linux机顶盒VSP播放参数
var LinuxPlayParam = {
  pid: '10003;FTIT0120190424229518',
  // caid: '1370495919',
  key: 'ajqou6u1i8bftj',
  // nodeGroup: 102,
  ip: 'http://172.16.88.50'
}
var fakePID = '10056';
var fakePAID = 'GTIT0120181122200157';

var vsphost = "http://172.16.188.87:8080";// 反查接口IP地址
var nianhuaId = '10065676';// 年华应用ID 反查接口用
var PlayParamExtApp='nianhuaapp'// 歌华android视频播放参数

// //是否审核树，发布版为false 已废弃
// var IsAuditVersion = false;
// //审核树版本 已废弃
// var AuditTreeVersion = '04'
