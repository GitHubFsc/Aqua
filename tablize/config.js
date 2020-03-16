//var aqua_host = "http://192.168.80.78:8008";
// var aqua_host = "http://10.5.0.169:8080";
var aqua_host = "http://192.168.7.143:8080";
var aquapaas_host = "http://192.168.7.143:8080"; //window.location.protocol + "//" + window.location.host;
var aquapaas_job_container ="/default/demo/job/";
var aquadaas_host = "http://121.199.2.85:8088";
var AquaDaaSHost = aquadaas_host;
//系统管理->任务管理 所有job相关接口走job_aquapaas_host 2019.3.11 li.fang
var job_aquapaas_host = "http://172.16.20.201:8090";

var LSMS_PATH ="http://192.168.80.88:9090/rest/dojo/tvnow/lsms/";
var loginToIndex="false";
//登录用户名、密码、域名配置项
LOGIN_AQUA_USERNAME = "administrator";
LOGIN_AQUA_PWD = "password";
LOGIN_AQUA_DOMAIN_URI = "/cdmi_domains/default/";

//轮播编排导入频道节目xml文件需要用到的上传路径
//比如navigationSlider_uploadPath设置为demo1/，那么页面会在Aqua登陆后自行拼接成完整路径
//例如：http://192.168.7.143:8080/aqua/rest/cdmi/default/netdisk/adsadmin/demo1/
var navigationSlider_uploadPath = "demo1/";

//轮播编排Navigation树路径
var NavigationSlider_Root = "/aquapaas/rest/navigation/trees/quanwangshi全视界";

//TIF应用的host
var tifAdmin_host_ip = "10.50.8.240";
var tifAdmin_host_port = "9099";
var tifAdmin_host = "http://" + tifAdmin_host_ip + ":" + tifAdmin_host_port;

// AquaPaaS channel list file
var CHANNEL_LIST_FILE = '/aqua/rest/cdmi/channle.txt';

// EPG stb_list_entry(接口：xml格式返回) Host & Path
var EPG_INTERFACE_ADDRESS = 'http://192.168.7.155:9090';
var EPG_INTERFACE_PATH = '/ne/stbservlet';
// EPG channels parent_HUID
var EPG_PARENT_HUID = 'TVEN24';
// EPG json_libs_clu_get_region_channel_group
var EPG_CHANNEL_LIST_PATH = '/stbservlet';
var EPG_REGION_ID = '001';
var EPG_CHANNEL_TYPE = 'ALL';

// 频道实时信息刷新间隔
var REALTIME_UPDATE_INTERVAL = 1000;
// 频道实时信息重新排序间隔
var REALTIME_REORDER_INTERVAL = 60 * 1000;
// 栏目历史查询显示最小点间隔(px)
var PROGRAM_HISTORY_POINT_MIN_SPAN = 2;
// 栏目历史查询显示点击后放大倍数
var PROGRAM_HISTORY_DATE_ZOOM_LEVEL = 2;

// 是否隐藏实时分析
var REALTIME_ANALYSIS_HIDDEN = false;

//默认预设组合类型
var BROADCAST_PO_DEFAULT = [
	{name:"预设值1",POTYPE:"",POIDS:"123"},
	{name:"预设值2",POTYPE:"SVOD",POIDS:"123,12,1"},
	{name:"预设值3",POTYPE:"RVOD",POIDS:"132,32,2,1"}
	];
var paasAppKey = 'aquaBO';
var paasAppSecret = '9fa9c25876d865b086efb01d66630e746ea435d51db604fd9c90c6e24ffc';

// 下载接口不能通过gateway认证，临时解决方案是直连PaaS
var PaaSDownloadHost = "http://172.16.20.155:8080";

//Flower地址的配置(Job管理里查看Task详情)
var JobManage_Flower_URL = "http://192.168.7.69:5501/task/"

//navigation tree 文件夹路径, 要以/结尾
var NAVIGATION_TREE_ROOT = 'tree/'
//navigation 海报选取路径
var NAVIGATION_PIC_HOST = 'http://172.16.222.137:8080/AquaBO/images';

//导入源路径,对象,label为显示在客户端界面上的文字,value为发送到服务端的值。
var importSourcePath={
	"label":"/xor/data1/aquapaas/asset/zgdfile",
	"value":"/xor/data1/aquapaas/asset/zgdfile"
};

//CMS配置项

//CMS存放布局json文件目录,要以/结尾。
//此目录在网盘用户下，实际地址如http://10.5.0.169:8080/aqua/rest/cdmi/default/netdisk/用户名/cms_tree/card_template_json/
var CMScardTemplatePath='cms_tree/card_template_json/'

//CMS存放布局图片文件目录,要以/结尾。
//此目录在网盘用户下，实际地址如http://10.5.0.169:8080/aqua/rest/cdmi/default/netdisk/用户名/cms_tree/card_template_image/
var CMScardTemplateImagePath='cms_tree/card_template_image/'

//生成的应用和页面json文件存放目录,要以/结尾
//此目录在网盘用户下，实际地址如http://10.5.0.169:8080/aqua/rest/cdmi/default/netdisk/用户名/cms_tree/generate_json_file/
var CMSJsonFilePath='cms_tree/generate_json_file/';

//CMS栏目列表中可选择的tree,tree_id表示树的id,tree_name表示树的名称。
var CMSColumnTreeList=[
  {"tree_id":"5d5540218ac460110ae678f8","tree_name":"cms_tree1"}
]

//CMS专题列表中可选择的tree,tree_id表示树的id,tree_name表示树的名称。
var CMSTopicTreeList=[
  {"tree_id":"5d5540218ac460110ae678f8","tree_name":"cms_tree1"}
]

//CMS产品包列表中可选择的tree,tree_id表示树的id,tree_name表示树的名称。
var CMSProductPackageTreeList=[
	{"tree_id":"5d5540218ac460110ae678f8","tree_name":"cms_tree1"}
]

//CMS生成json文件数据的函数中添加参数,格式为[["原始字符串1”,”替换字符串1”],["原始字符串2”,”替换字符串2”]]。
//函数根据这个参数，在生成json文件数据时，发现有字段值包含原始字符串就替换。
var CMSStringReplaceMapings = [[aqua_host,"http://192.168.7.143:8080"]]

//资讯管理配置项

//资讯管理的资讯列表和主题列表存放图片文件目录,要以/结尾。
//此目录在网盘用户下，实际地址如http://10.5.0.169:8080/aqua/rest/cdmi/default/netdisk/用户名/information_management_image/
var postImagePath="information_management_image/";

//每个模板的参数，其中module为模板，detailsPageUrl为这个模板的详情页URL
var modulePara=[
	{"module":1,"detailsPageUrl": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/CommunityInformationTemplate/html/1/index.html"},
	{"module":2,"detailsPageUrl": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/CommunityInformationTemplate/html/2/index.html"},
	{"module":4,"detailsPageUrl": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/CommunityInformationTemplate/html/4/index.html"}
]