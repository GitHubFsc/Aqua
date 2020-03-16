var chartDataBuffer = new Object();
chartDataBuffer.system_admin_area_classroom_Chart_1 = null;
chartDataBuffer.system_admin_area_classroom_Chart_2 = null;
chartDataBuffer.org_admin_class_class_Chart_1 = null;
chartDataBuffer.org_admin_class_student_teacher_group_Chart_1 = null;
chartDataBuffer.org_admin_class_student_teacher_Chart_1 = null;
chartDataBuffer.course_admin_course_lesson_Chart_1 = null;

function login_form_getChartData(_mode) {
	var folder = "fake_data_charts";
	if(words == EDU){
		folder = "fake_data_charts_edu";
	}
    /**
     * request对象
     *
     *  url:请求地址,
     *  mode:请求方式（xhrGet,xhrPost,xhrPut）,
     *  timeout:请求超时（单位毫秒）,
     *  retryTime:请求失败后重试次数
     *
     */
    switch(_mode) {
        case "1":
            window.system_admin_area_classroom_Chart_1 = new my.multiRequest({
                requests : [{
                    url : folder + "/system_admin_area_classroom_Chart_1.json",
                    timeout : 5000,
                    mode : "xhrGet",
                    retryTime : 3
                }],
                autoReloadData : true,                timeout : 30 * 60 * 1000, //请求更新时间。单位毫秒
                callback : function(data) {
                    changeChartData(data, "1");
                }
            })
            window.system_admin_area_classroom_Chart_1.get();
            break;


        case "2":
            window.system_admin_area_classroom_Chart_2 = new my.multiRequest({
                requests : [{
                    url : folder + "/system_admin_area_classroom_Chart_2.json",
                    timeout : 5000,
                    mode : "xhrGet",
                    retryTime : 3
                }],
                autoReloadData : true,
                timeout : 30 * 60 * 1000, //请求更新时间。单位毫秒
                callback : function(data) {
                    changeChartData(data, "2");
                }
            })
            window.system_admin_area_classroom_Chart_2.get();
            break;


        case "3":
            window.org_admin_class_class_Chart_1 = new my.multiRequest({
                requests : [{
                    url : folder + "/org_admin_class_class_Chart_1.json",
                    timeout : 5000,
                    mode : "xhrGet",
                    retryTime : 3
                }],
                autoReloadData : true,
                timeout : 30 * 60 * 1000, //请求更新时间。单位毫秒
                callback : function(data) {
                    changeChartData(data, "3");
                }
            })
            window.org_admin_class_class_Chart_1.get();
            break;
            
            
        case "4":
            window.org_admin_class_student_teacher_group_Chart_1 = new my.multiRequest({
                requests : [{
                    url : folder + "/org_admin_class_student_teacher_group_Chart_1.json",
                    timeout : 5000,
                    mode : "xhrGet",
                    retryTime : 3
                }],
                autoReloadData : true,
                timeout : 30 * 60 * 1000, //请求更新时间。单位毫秒
                callback : function(data) {
                    changeChartData(data, "4");
                }
            })
            window.org_admin_class_student_teacher_group_Chart_1.get();
            break;        
        case "5":
            window.org_admin_class_student_teacher_Chart_1 = new my.multiRequest({
                requests : [{
                    url : folder + "/org_admin_class_student_teacher_Chart_1.json",
                    timeout : 5000,
                    mode : "xhrGet",
                    retryTime : 3
                }],
                autoReloadData : true,
                timeout : 30 * 60 * 1000, //请求更新时间。单位毫秒
                callback : function(data) {
                    changeChartData(data, "5");
                }
            })
            window.org_admin_class_student_teacher_Chart_1.get();        
            break;
        case "6":
            window.course_admin_course_lesson_Chart_1 = new my.multiRequest({
                requests : [{
                    url : folder + "/course_admin_course_lesson_Chart_1.json",
                    timeout : 5000,
                    mode : "xhrGet",
                    retryTime : 3
                }],
                autoReloadData : true,
                timeout : 30 * 60 * 1000, //请求更新时间。单位毫秒
                callback : function(data) {
                    changeChartData(data, "6");
                }
            })
            window.course_admin_course_lesson_Chart_1.get();         
            break;
        //default:
        //default_statement;
    }
}