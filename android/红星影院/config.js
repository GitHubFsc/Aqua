//是否显示日志层
var showLog = true;

//应用入口
// var frameEntrance = 'http://172.16.174.55:8088/11/index.html?t='
var frameEntrance = 'http://api.xor-live.io/CyberCloud_Dispatcher.htm?StartAppID=30003001&StartAppParam=http://api.xor-live.io/win8_gh_show/954/996/index.html%3fV%3d1557233098046'

//数据来源
//var paas_host = 'http://172.16.188.78:8080'
var paas_host = 'http://api.xor-live.io'
var treeRoot = paas_host + '/aquapaas/rest/navigation/trees/年华/年华影院/';
var menuRoot = ['热播电影','经典电影','经典剧集']
//预发布
//var app_key = 'aquaBO';//树结构的app_key NHAPP
//生产环境
var app_key = 'aquaBO';//树结构的app_key NHAPP
var paasAppSecret = '5b161e40e4e31db5307d7e520814e11f7d9e600f8e8e9ee06f22faed5afb';

//播放相关参数
var appKey = 'ahokshqmx1kpg21';
var appMode = 'Mixed';
var appType = 'WEB';
var appId = '30003174';//瘦终端应用ID
var portalAppId = 30003001; // 瘦终端主页的APPID
var MovieID = '1001010673';
var linuxLink = 'http://api.xor-live.io/win8_gh_show/954/996/index.html';
var androidLink = 'http://api.xor-live.io/win8_gh_show/954/996/index.html';
var thinClientLink = 'http://api.xor-live.io/win8_gh_show/954/996/index.html';
var DeviceType = 3; // 1: 安卓浪潮机顶盒 2:安卓九州机顶盒 3:Linux(2200)机顶盒
//Linux机顶盒VSP播放路径
// var LinuxPlayerUrl = 'http://172.16.174.55:8088/11/play/vod_play.html';
//var LinuxPlayerUrl = 'http://172.16.188.79:8080/vsp_outlet/player/load/page';
var LinuxPlayerUrl = 'http://api.xor-live.io/vsp_outlet/player/load/page';
//通用播放器地址
var playerUrl = '../playVideo/index.html';
var vsphost = "http://api.xor-live.io";
var yuanxianhost = "http://api.xor-live.io"
//Linux机顶盒VSP播放参数
var LinuxPlayParam = {
//  pid: '10003;FTIT0120190424229518',
//  caid: '1370495919',
//  key: 'ahyuvzq53adjct',
   key: 'ahokshqmx1kpg21',
// nodeGroup: 102,
  ///ip: 'http://172.16.188.78:8080'
  ip: 'http://api.xor-live.io'
}
var fakePID = '10054';
var fakePAID = 'GTIT0120181203200001';
//年华应用ID 反查接口用
var nianhuaId = '10065676';
//预发布环境
//var nianhuaId = '10087863';

