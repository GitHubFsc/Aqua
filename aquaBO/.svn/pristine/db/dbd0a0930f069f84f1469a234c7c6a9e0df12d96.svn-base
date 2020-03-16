var AbnormalOrders = (function ($, Table){
    let Pane = {
        table: null,
        search: {   //保存查询条件
            user_name: ''
        },
        init() {
            this.bindEvents();
            this.initTable();
        },
        bindEvents() {
            // 输入框回车查询
            $(".abnormalOrders .search_bar .search_input").unbind().bind("keyup", (e) => {
                let key = e.keyCode||e.which;
                if (key == 13) {
                    let value = $(e.target).val();
                    Pane.search.user_name = value;
                    Pane.initTable()
                }
            });
            // 查询按钮查询
            $(".abnormalOrders .search_bar .search_btn").unbind().bind("click", (e) => {
                let value = $(".abnormalOrders .search_bar .search_input").val();
                Pane.search.user_name = value;
                Pane.initTable()
            });
            // 列表操作
            $(".abnormalOrders #abnormal_orders_list_table")
            .on("click", 'a[name=view]' , (e) => {   //查看订单
                let index = $(e.target).data("index");
                let user_name = API.user_name_list[index];
                $.ajax({
                    type: 'GET',
                    url: 'content/authmng/abnormalOrders/abnormal_order.html'
                })
                .done(function (data){
                    $(".abnormalOrders").append(patchHTML(data));
                    // 详单页面没有操作，返回不用刷新数据
                    $(".abnormalOrders .abnormalOrder .header .btn.back").unbind().bind('click', (e) => {
                        document.querySelector('.abnormalOrders').removeChild(document.querySelector('.abnormalOrder'));
                    });
                    $(".abnormalOrders .abnormalOrder .header_item.logo").html(i18n("ABNORMAL_ORDERS_CHECK") + user_name + i18n("ABNORMAL_ORDERS_ABNORMAL_ORDER"));
                });
                Pane.initOrderTable(user_name);
            })
            .on("click", 'a[name=resend]' , (e) => {   //重发
                let index = $(e.target).data("index");
                let user_name = API.user_name_list[index];
                let message = i18n("ABNORMAL_ORDER_ALERT_MESSAGE");
                let alert_dialog  = new AlertDialog({
                    message: message,
                    confirmFn: (callback) =>{
                        API.resendOrders(user_name, () => {
                            callback&&callback();
                            Pane.initTable();   //补发成功之后刷新页面
                        })
                    }
                });
            });
        },
        initTable() {  //异常订单首页列表
            var title = [
                {label: i18n("ABNORMAL_ORDERS_USER_NAME")},
                {label: i18n("ABNORMAL_ORDERS_NUM")},
                {label: i18n("ABNORMAL_ORDERS_CREATE_TIME")},
                {label: i18n("ABNORMAL_ORDERS_ORDER_ID")},
                {label: i18n("ABNORMAL_ORDERS_FAIL_REASON")},
                {label: i18n("ABNORMAL_ORDERS_OPR")}
            ];
            var style = {
                borderColor: "#E2E2E2",
                borderWidth: 1,
                titleBg: "#45d1f4",
                titleColor: "#FFFFFF",
                titleHeight: 31,
                cellBg: "white",
                evenBg: "#F5FDFF",
                cellColor: "#797979",
                cellHeight: 34,
                footBg: "#FFFFFF",
                footColor: "#797979",
                inputBg: "#FFFFFF",
                inputBorder: "1px solid #CBCBCB",
                iconColor: "#0099CB",
                columnsWidth: [0.1, 0.1, 0.15, 0.1, 0.35, 0.2]
            };
            Pane.table = new Table({
                containerId: "abnormal_orders_list_table",
                rows: 14,
                columns: 6,
                titles: title,
                styles: style,
                listType: 1,
                async: true
            });
            Pane.table.getPageData = API.getList;
            Pane.table.create();
        },
        initOrderTable(user_name) {  //异常订单详单列表
            var title = [
                {label: i18n("ABNORMAL_ORDER_CREATE_TIME")},
                {label: i18n("ABNORMAL_ORDER_ID")},
                {label: i18n("ABNORMAL_ORDER_USER_NAME")},
                {label: i18n("ABNORMAL_ORDER_REASON")},
                {label: i18n("ABNORMAL_ORDER_STATUS")}
            ];
            var style = {
                borderColor: "#E2E2E2",
                borderWidth: 1,
                titleBg: "#45d1f4",
                titleColor: "#FFFFFF",
                titleHeight: 31,
                cellBg: "white",
                evenBg: "#F5FDFF",
                cellColor: "#797979",
                cellHeight: 34,
                footBg: "#FFFFFF",
                footColor: "#797979",
                inputBg: "#FFFFFF",
                inputBorder: "1px solid #CBCBCB",
                iconColor: "#0099CB",
                columnsWidth: [0.16, 0.12, 0.12, 0.5, 0.1]
            };
            API.getListOrder(user_name, (data) => {
                var order_table = new Table({
                    containerId: "abnormal_order_list_table",
                    rows: 14,
                    columns: 5,
                    titles: title,
                    styles: style,
                    listType: 0,
                    data: data
                });
                order_table.create();
            })
        },
    };
    let API = {
        data: {},
        user_name_list: [],
        getList(pageNum, callback) {  //查询异常订单
            try {
                let url = aquapaas_host + '/aquapaas/rest/ticket/external/failorders';
                // let url = 'http://172.16.20.62:8010/aquapaas/rest/ticket/external/failorders';
                let method = 'GET';
                let urlParam = [];
                    urlParam.push("start=" + (pageNum - 1) * this.rowsLmt);
                    urlParam.push("end=" + (pageNum* this.rowsLmt - 1));
                    urlParam.push("user_name=" + Pane.search.user_name);
                    urlParam.push("app_key=" + paasAppKey);
                    urlParam.push("timestamp=" + new Date().toISOString());
                    urlParam.push("user_id=" + my.paas.user_id);
                    urlParam.push("access_token=" + my.paas.access_token);
                    url += '?' + urlParam.join('&');
                $.ajax({
                    type: method,
                    url: url,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
                    }
                })
                .always((resp, status, xhr)=>{
                    if(status == "success") {
                        API.data = resp;
                        API.user_name_list = [];  //翻页时清空记录
                        for(var item in resp){
                            API.user_name_list.push(item);
                        }
                        Pane.table.onTotalCount(parseInt(xhr.getResponseHeader("x-aqua-total-count")));
                        callback&&callback(Model.table(resp));
                    } else {
                        callback&&callback([])
                    }
                });
            } catch (error) {
                console.err("error.message=" + error.message)
            }
        },
        getListOrder(user_name, callback) {  //根据用户名查询异常订单
            try {
                let url = aquapaas_host + '/aquapaas/rest/ticket/external/failorders';
                // let url = 'http://172.16.20.62:8010/aquapaas/rest/ticket/external/failorders';
                let method = 'GET';
                let urlParam = [];
                    urlParam.push("user_name=" + user_name);
                    urlParam.push("app_key=" + paasAppKey);
                    urlParam.push("timestamp=" + new Date().toISOString());
                    urlParam.push("user_id=" + my.paas.user_id);
                    urlParam.push("access_token=" + my.paas.access_token);
                    url += '?' + urlParam.join('&');
                $.ajax({
                    type: method,
                    url: url,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
                    }
                })
                .always((resp, status, xhr) => {
                    if(status == "success") {
                        var user_name = '';
                        for(var item in resp){
                            user_name = item;
                        }
                        callback&&callback(Model.table_oreder(resp[user_name]));
                    } else {
                        callback&&callback([])
                    }
                });
            } catch (error) {
                console.err("error.message=" + error.message)
            }
        },
        resendOrders(user_name, callback) {
            try {
                let url = aquapaas_host + '/aquapaas/rest/ticket/external/resendorder';
                // let url = 'http://172.16.20.62:8010/aquapaas/rest/ticket/external/resendorder';
                let method = 'POST';
                let urlParam = [];
                    urlParam.push("user_name=" + user_name);
                    urlParam.push("app_key=" + paasAppKey);
                    urlParam.push("timestamp=" + new Date().toISOString());
                    url += '?' + urlParam.join('&');
                $.ajax({
                    type: method,
                    url: url,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
                    }
                })
                .always((resp, status, xhr) => {
                    if(status == "success") {
                        callback&&callback();
                    } else if(resp.status == '400') {
                        alert('补发失败，请重试！');
                    } else if(resp.status == '409') {
                        alert('补发冲突，请重试！');
                    }
                });
            } catch (error) {
                console.err("error.message=" + error.message)
            }
        }
    };
    let Model = {
        table(data) {  //异常订单首页列表数据处理
            let table_list = [];
            try {
                var user_name_list = [];
                for(var item in data){
                    user_name_list.push(item);
                }
                for(var i = 0; i < user_name_list.length; i++){
                    let user_name = user_name_list[i];
                    let item = data[user_name];
                    let row = [];
                        row.push({ label: user_name });
                    if(item.length > 0){
                        row.push({ label: item.length });
                        if(!item[0].create_time){item[0].create_time = ''}
                        row.push({ label: convertTimeString(item[0].create_time) });
                        if(!item[0].order_id){item[0].order_id = ''}
                        row.push({ label: item[0].order_id });
                        if(!item[0].fail_reason){item[0].fail_reason = ''}
                        row.push({ label: '<div style="padding: 0 10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: left;">' + item[0].fail_reason + '</div>' });
                    } else {  //当前用户没有异常订单
                        row.push({ label: '' });
                        row.push({ label: '' });
                        row.push({ label: '' });
                        row.push({ label: '' });
                    }
                        let view_order = '<a name="view" data-index="' + i + '">' + i18n("ABNORMAL_ORDERS_VIEW") + '</a>';
                        let resend_order = '<a name="resend" data-index="' + i + '">' + i18n("ABNORMAL_ORDERS_RESEND") + '</a>';
                        row.push( {label: '<span style="padding: 0 20px;">' + [view_order, resend_order].join('') + '</span>'});
                    table_list.push(row);
                }
            } catch (error) {
                console.error("http://www.baidu.com/s?wd=" + error.message);
            } finally {
                return table_list;
            }
        },
        table_oreder(data) {  //异常订单详单页列表数据处理
            let table_oreder_list = [];
            try {
                if(data.length > 0){
                    for(var i = 0; i < data.length; i++){
                        let row = [];
                            if(!data[i].create_time){data[i].create_time = ''}
                            row.push({ label: convertTimeString(data[i].create_time) });
                            if(!data[i].order_id){data[i].order_id = ''}
                            row.push({ label: data[i].order_id });
                            if(!data[i].partner_user_id){data[i].partner_user_id = ''}
                            row.push({ label: data[i].partner_user_id });
                            if(!data[i].fail_reason){data[i].fail_reason = ''}
                            row.push({ label: '<div style="padding: 0 10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: left;">' + data[i].fail_reason + '</div>'  });
                            if(data[i].status == 'pending'){
                                var oreder_status = i18n("ABNORMAL_ORDER_STATUS_PENDING");
                            } else if(data[i].status == 'fail'){
                                var oreder_status = i18n("ABNORMAL_ORDER_STATUS_FAIL");
                            } else {
                                var oreder_status = data[i].status;
                            }
                            row.push({ label: oreder_status });
                        table_oreder_list.push(row);
                    }
                }
            } catch (error) {
                console.error("http://www.baidu.com/s?wd=" + error.message);
            } finally {
                return table_oreder_list;
            }
        }
    };
    return {
        init() {
            Pane.init();
        }
    }
})(jQuery, StyledList)