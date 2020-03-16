//var paasHost = "http://172.16.188.78:8080";
var paasHost = "http://172.16.188.76:80";
//var paasAppKey = 'aquaBO';
var paasAppKey = 'NHAPP';
//var paasAppSecret = '5a3d3cd2dd9d978bb5b7f0d1e2014d4d92f832c48f556c6366a348babac5';
//预发AquaBO
//var paasAppSecret = '9fa9c25876d865b086efb01d66630e746ea435d51db604fd9c90c6e24ffc';
var paasAppSecret = '9c462e92a7068401e6d86fa0f06013c65521d2a418031f9b75fd2a5ddbf1';
//AquaPaaS refresh_token 间隔，单位毫秒
var paasTokenRefreshInterval = 10 * 60 * 1000;

//合唱节目录路径
var NavigationRoot = "/aquapaas/rest/navigation/trees/年华/合唱节";
//合唱节歌谱图片路径
//比方说 var GetMusicPicsUrl = "http://172.16.179.51:8080/合唱节歌谱/";
//那么合唱节歌谱会根据aquaBO的目录（目录页）和子目录（歌曲）来显示图片 http://172.16.179.51:8080/合唱节歌谱/第四篇 一城三带/30、天安门-太阳的广场/1.jpg等等
//var GetMusicPicsUrl = "http://172.16.179.51:8080/合唱节歌谱/";
var GetMusicPicsUrl = "http://172.16.188.80:8080/PICTURE/nianhua/合唱节歌谱/";

//区分视频播放方式的机顶盒类型， 1： 安卓-浪潮， 2：安卓-九州，3：Linux(2200)
var DeviceType = 3;
//机顶盒类型 3：Linux(2200) 视频播放页地址
var LinuxPlayerUrl = "http://172.16.188.87:8080/vsp_outlet/player/load/page";
//机顶盒类型 3：Linux(2200) 视频播放页参数
var LinuxPlayParam = {
  pid: '10003;FTIT0120190424229518',
  key: 'ajxpoore71pnrf',
  ip: 'http://172.16.188.76'
};
//vsp 反查相关参数
var VSP_Host = 'http://172.16.188.87:8080';
//参数 key
var VSP_AppKey = 'ajxpoore71pnrf';
//参数 栏目id, 年华栏目的id
var VSP_ProgramId = '10065676';
//测试播放视频相关参数
var PlayParamExtApp = 'nianhuaapp';
var PlayParam = {
  //是否采用思迁新 VSP 接口（8 区合一）
  // NewVSP: true,
  //VSP分配给应用的key
  AppKey: "ajxpoore71pnrf",
  //提供商标识，暨 PID
  ProviderID: "10056",
  //影片 paid ， GTIT 开头，若无 MovieID 或 EpisodeID，此项必选
  ProviderAssetID: "GTIT0120181122200157",
  //资产标识
  // AssetID: "",
  //是否显示回看标志 true 显示、 false 不显示
  ReplayFlag: false,
  //类型，未指定则不会有上下节目的提示 1 为电视剧类型、 2 为电影类型
  Type: 1,
  //是否为回看节目， 采用新 VSP 接口调用回看节目时必传。 true 是、 false 不是
  // Review: false,
  //退出时是否显示推荐列表 true 显示、 false 不显示（默认）
  // Recommend: false,
  //透传给通用播放器的字段，预留（需转码）
  // ExtParam: "",
  //表示播放类型， 1 表示点播， 3 表示回看， 4 表示时移 如果终端类型为瘦终端， 则该参数为必选参数。
  // PlayType: "1",
  PlayerURL : {
    Linux:"",
    Android:"",
    ThinClient:"",
  },
};
//调用GHWEBAPI的BackAppParam
var AppBackParam = {
  //应用模式，取值范围： Local： 本地模式应用 Stream： 流化模式应用 Mixed：混合模式应用
  AppMode: "Mixed",
  //流化应用 ID，如果返回的应用是流化模式或者混合模式的应 用，此字段必传； 如果返回的应用是本地模式的应用，此字段 不传；
  AppID: 56,
  //应用类型，取值范围：WEB： WEB 应用 APK： Android 应用,暂不支持此类应用，待扩展；
  AppType: "WEB"
};

//退出到的首页地址
var HomePageUrl = "http://172.16.189.66:45677/CyberCloud_Dispatcher.htm?StartAppID=30003001&StartAppParam=http://172.16.150.16:8282/win8_gh_show/954/996/index.html%3fV%3d";
//当Android、瘦终端未有AppBackParam时，所用的返回主页参数
var HomeStartParam =  {
  "AppMode": "Mixed",
  "AppType":"WEB",
  "AppID": 30003001,
  "AppParam": {
    "Linux": "http://172.16.150.16:8282/win8_gh_show/954/996/index.html",
    "Android": "http://172.16.150.16:8282/win8_gh_show/954/996/index.html",
    "ThinClient": "http://172.16.150.16:8282/win8_gh_show/954/996/index.html"
  }
};


//测试输出日志
var showLog = false;