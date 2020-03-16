var localeLanguage = 'zh_CN.json';

var paasHostIP = '192.168.7.143';
var paasHostPort = '8080';
var paasHost = 'http://' + paasHostIP + ':' + paasHostPort;

var paasAppKey = 'IOT';
var paasAppSecret = 'b27fbdd2d67783398f94c4bb7e80ab83e51c38dc393f90587d31974723b2';
var paasTokenRefreshInterval = 10 * 60 * 1000;

//热泵和DTU的thingDefID和namespace。
var rebengThingDefID="ReBeng";
var rebengNamespace="mgd.gehua";
var DTUThingDefID="DTU";
var DTUNamespace="mgd.gehua";

//DTU地图分布的中心点坐标和缩放(坐标为百度墨卡托坐标,longitude为经度,latitude为纬度。scale为百度地图的缩放参数，值越大表示地图越放大）
var DTUCenterPointCoordinate={
	longitude:116.77031,
	latitude:39.81185,
	scale:17
}
