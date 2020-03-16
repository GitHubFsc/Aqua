var tagManage = (function($) {
    var tagManage = new Object();

    //初定义
    tagManage.initParam             = function(){
        this.token = "user_id=" + my.paas.user_id +
            "&user_type=" + my.paas.user_type +
            "&access_token=" + my.paas.access_token +
            "&app_key=" + paasAppKey +
            "&timestamp=";
        this.token1 = "app_key=" + paasAppKey +
            "&timestamp=";
        this.datas = [];
        this.type = "channel";
        this.leftData = [];
    };
    tagManage.initListenEvents      = function(){
        var that = this;
        $(".sucai_head_center li").click(function(){
            $(".sucai_head_center li").removeClass('sucai_menu_selected');
            $(this).addClass('sucai_menu_selected');
            that.type = $(this).data("type");
            $("#tagManage_add_class_btn_content").text(i18n('BIAOQIANGUANLI_ADD' + that.type.toUpperCase()));
            that.createTable();
        });
        $('#tagManage_list_search_bottom').click(function(){
        });
        $('#tagManage_add_class_btn').click(function(){
            that.showCreateDialog();
        });
        $('#tagManage_content_table').unbind("click").on('click', '.sucai_smallWord_in_td', function(ev){
            var $op = $(this);
            var index = $op.attr('data-index');
            var name = $op.attr('name');
            if(!index){
                return;
            }
            var data = that.datas[Number(index)];
            switch(name){
                case 'view':
                    showPolicyBindingOperatingMsg({type:'tag', mode:'update', value:that.type + ":" + data.name}, function(){
                        that.showViewDialog(data);
                    });
                    break;
                case 'del':
                    showPolicyBindingOperatingMsg({type:'tag', mode:'delete', value:that.type + ":" + data.name}, function(){
                        that.showDeleteDialog(data);
                    });
                    break;
                default:
                    break;
            }
        });
    };
    tagManage.initPage              = function(){
        this.initParam();
        this.initListenEvents();
        this.createTable();
    };

    tagManage.createTable        = function(search_text){
        var that = this;
        var widths = [0.51,0.20,0.12];
        var titles = [{
            label: ""
        }, {
            label: ""
        },  {
            label: i18n('SUCAI_CAOZUO')
        }];
        titles[0].label = i18n('BIAOQIANGUANLI_' + that.type.toUpperCase() + 'NAME');
        titles[1].label = i18n('BIAOQIANGUANLI_' + that.type.toUpperCase() + 'NUMBER');
        this.list = new StyledList({
            rows: 11,
            columns: 3,
            containerId: 'tagManage_content_table',
            titles: titles,
            listType: 1,
            data: [],
            styles: {
                borderColor: 'transparent',
                borderWidth: 1,
                titleHeight: 46,
                titleBg: 'rgb(93,161,192)',
                titleColor: 'white',
                cellBg: 'white',
                evenBg: 'rgb(245,245,245)',
                cellColor: 'rgb(114,114,114)',
                footBg: 'white',
                footColor: 'rgb(121,121,121)',
                iconColor: 'rgb(93,161,192)',
                inputBorder: '1px solid rgb(203,203,203)',
                inputBg: 'white',
                columnsWidth:widths
            }
        });
        if(search_text){
            this.list.search_text = search_text;
        }
        this.list.getPageData = function(page) {
            var listData = that.listTag(page, this.search_text);
            that.datas = listData;
            that.list.onTotalCount(listData.allCount);
            var listData  = that.formListDataForTags(listData)
            return listData;
        };
        this.list.create();
    };
    tagManage.showCreateDialog   = function(status,data){
        var that = this;
        this.createDialog = null;
        if (!this.createDialog) {
            this.createDialog = new PopupDialog({
                url: 'content/biao_qian_guan_li/create_dialog.html',
                width: 800,
                height: 570,
                context:that,
                callback: function(){
                    var selOptions = [];
                    $("#sucai_dialog_title_text").text(i18n('BIAOQIANGUANLI_ADD' + that.type.toUpperCase()));
                    $(".sucai_dialog_create_name_title_span").text(i18n('BIAOQIANGUANLI_' + that.type.toUpperCase() + 'NAME'));

                    if(that.type == "area"){
                        $(".sucai_dialog_create_area").show();
                        var area_leve1_select_items = AREA_LEVE1.map(function(item){
                            return { key : item.id, value : item.name }
                        });
                        var area_leve1_select = new newSelect(
                            "#area_leve1",
                            area_leve1_select_items,
                            {width:100,height:28,background:"#ffffff",selectbackground:"#d3d3d3" },
                            function(value){
                                var data = that.getDataforArea(value);
                                var area_leve2_select_items = (data.slice(1)).map(function(item){
                                    return { key : item.id, value : item.simple_area_name }
                                });
                                that.createDialog.area_leve2_select.updateSelectOptions(area_leve2_select_items);
                                var area_leve3_select_items = [
                                    { key : "", value : i18n("BIAOQIANGUANLI_AREALEVE3")}
                                ];
                                that.createDialog.area_leve3_select.updateSelectOptions(area_leve3_select_items);
                                that.updateLeftList(data);
                            }
                        );
                        that.createDialog.area_leve1_select = area_leve1_select;

                        var area_leve2_select_items = (that.getDataforArea(area_leve1_select_items[0].key).slice(1)).map(function(item){
                            return { key : item.id, value : item.simple_area_name }
                        });;
                        var area_leve2_select = new newSelect(
                            "#area_leve2",
                            area_leve2_select_items,
                            {width:100,height:28,background:"#ffffff",selectbackground:"#d3d3d3" },
                            function(value){
                                var data = that.getDataforArea(value);
                                var area_leve3_select_items = (data.slice(1)).map(function(item){
                                    return { key : item.id, value : item.simple_area_name }
                                });
                                that.createDialog.area_leve3_select.updateSelectOptions(area_leve3_select_items);
                                that.updateLeftList(data);
                            }
                        );
                        that.createDialog.area_leve2_select = area_leve2_select;

                        var area_leve3_select_items = [
                            { key : "", value : i18n("BIAOQIANGUANLI_AREALEVE3")}
                        ];
                        var area_leve3_select = new newSelect(
                            "#area_leve3",
                            area_leve3_select_items,
                            {width:100,height:28,background:"#ffffff",selectbackground:"#d3d3d3" },
                            function(value){
                                if(value == ""){
                                    alert(i18n("BIAOQIANGUANLI_PLEASECHOOSEHIGHERLEVEL"));
                                    return;
                                }
                                var data = that.getDataforArea(value);
                                that.updateLeftList(data);
                            }
                        );
                        that.createDialog.area_leve3_select = area_leve3_select;
                    }

                    var alldata = that.getDataforType();
                    if(alldata.length != 0){
                        for(var i = 0, len = alldata.length; i < len; i++){
                            selOptions.push({
                                value: alldata[i].id,
                                label: alldata[i].name
                            });
                        }
                    }
                    //$('#sucai_dialog_sucaizu_selectable_cotainer').mCustomScrollbar();
                    this.leftData = selOptions;
                    that.createDialog.left = new StyledFlowList({
                        container: '#sucai_dialog_sucaizu_selectable',
                        data: selOptions,
                        title: {
                            label: i18n('BIAOQIANGUANLI_SELECTABLED') + i18n(that.type.toUpperCase())
                        },
                        minRows: 8
                    });
                    that.createDialog.left.create();

                    //处理搜索事件
                    $('#config_list_search_botton').click(function(){
                        var selOptions = [];
                        var search_name = $("#config_list_search").val();
                        if(search_name){
                            alldata = that.leftData.filter(function(item){
                                return (item.label.indexOf(search_name) > -1)
                            });
                        }else{
                            alldata = that.leftData;
                        }
                        that.createDialog.left = new StyledFlowList({
                            container: '#sucai_dialog_sucaizu_selectable',
                            data: alldata,
                            title: {
                                label: i18n('BIAOQIANGUANLI_SELECTABLED') + i18n(that.type.toUpperCase())
                            },
                            minRows: 8
                        });
                        that.createDialog.left.create();
                    });

                    //$('#sucai_dialog_sucaizu_selected_container').mCustomScrollbar();
                    that.createDialog.right = new StyledFlowList({
                        container: '#sucai_dialog_sucaizu_selected',
                        data: [],
                        title: {
                            label: i18n('BIAOQIANGUANLI_SELECTED') + i18n(that.type.toUpperCase())
                        },
                        minRows: 8
                    });
                    that.createDialog.right.create();
                    var right_data_origin = [];
                    if(that.createDialog.status === 'revise'){
                        $("#ChannelTag_name").val(data.title);
                        var select_datas = that.listTypeOfTag(that.type + ":" + data.name);
                        var i;
                        if(that.type == "area"){
                            if(select_datas.length > 0){
                                var area_id_array = select_datas.map(function(item){
                                    return item.obj_id;
                                });
                                area_id_array = area_id_array.join(",");
                                var array = that.getDataforMutiArea(area_id_array);
                                right_data_origin = array.map(function(item){
                                    return {
                                        label:item.simple_area_name,
                                        value:item.id
                                    }
                                });
                            }else{
                            }
                        }else{
                            for(i = 0;i<select_datas.length;i++){
                                var one = that.getResultfromSelOptions(select_datas[i].obj_id, selOptions);
                                if(one){
                                    right_data_origin.push(one);
                                }else{
                                    right_data_origin.push({
                                        label:i18n('BIAOQIANGUANLI_LOSTED'),
                                        value:select_datas[i].obj_id
                                    })
                                }
                            }
                        }
                        that.createDialog.right.update(right_data_origin);
                    }
                    $("#sucai_dialog_create_move_add").click(function(){
                        var sels = that.createDialog.left.getChecked();
                        var retData = that.createDialog.right.getData();
                        for(var i = 0,len = sels.length; i < len; i++){
                            var sels_item = sels[i];
                            if((retData.filter(function(item){return item.value == sels_item.value})).length == 0){
                                retData.push(sels_item);
                            }
                        }
                        that.createDialog.right.update(retData);
                    });
                    $("#sucai_dialog_create_move_addall").click(function(){
                        var sels = that.createDialog.left.getData();
                        var retData = that.createDialog.right.getData();
                        for(var i = 0,len = sels.length; i < len; i++){
                            var sels_item = sels[i];
                            if((retData.filter(function(item){return item.value == sels_item.value})).length == 0){
                                retData.push(sels_item);
                            }
                        }
                        that.createDialog.right.update(retData);
                    });
                    $("#sucai_dialog_create_move_delete").click(function(){
                        var dels = that.createDialog.right.getChecked();
                        var data = that.createDialog.right.getData();
                        var retData = [];
                        for(var i = 0, len = data.length; i < len; i++){
                            var item = data[i];
                            if(dels.indexOf(item) === -1){
                                retData.push(item);
                            }
                        }
                        that.createDialog.right.update(retData);
                    });
                    $("#sucai_dialog_create_move_deleteall").click(function(){
                        var retData = [];
                        that.createDialog.right.update(retData);
                    });
                    $("#sucai_dialog_create_botton_click").click(function(){
                        var name = jQuery("#ChannelTag_name").val();
                        var status = "";
                        if((that.createDialog.status === 'revise') && (name == data.name)){
                            status = "skip";
                        }
                        try{
                            that.addTag(name, status, function(){
                                if((that.createDialog.status === 'revise') && (name != data.name)){
                                    that.deleteTag(data.name);
                                }
                                $("#tagManage_toast").show();
                                $("#tagManage_toast_type1").text(i18n(that.type.toUpperCase()));
                                $("#tagManage_toast_type2").text(i18n(that.type.toUpperCase()));
                                setTimeout(function(){
                                    var right_data_origin = [];
                                    if(that.createDialog.status === 'revise'){
                                        var i;
                                        var select_datas = that.listTypeOfTag(that.type + ":" + name);
                                        for(i = 0;i<select_datas.length;i++){
                                            var one = that.getResultfromSelOptions(select_datas[i].obj_id, selOptions);
                                            if(one){
                                                right_data_origin.push(one);
                                            }else{
                                                right_data_origin.push({
                                                    label:i18n('BIAOQIANGUANLI_LOSTED'),
                                                    value:select_datas[i].obj_id
                                                })
                                            }
                                        }
                                    }
                                    var right_data = that.createDialog.right.getData();
                                    var diff_result = that.getDiffFromTwoList(right_data_origin,right_data);
                                    diff_result.add.forEach(function(item){
                                        var Channel_data = that.getTagOfType(item.value);
                                        Channel_data.tags.push(that.type + ":" + name);
                                        var tag_list = Channel_data.tags;
                                        if(that.bindTagToType(tag_list,item.value)){
                                            console.log("绑定完毕" +　item.label);
                                        }else{
                                            console.log("绑定失败" +　item.label);
                                            return ;
                                        }
                                    });
                                    diff_result.del.forEach(function(item){
                                        var Channel_data = that.getTagOfType(item.value);
                                        function remove(array, item){
                                            var index = array.indexOf(item);
                                            if (index > -1) {
                                                array.splice(index, 1);
                                                remove(array, item);
                                            }else{
                                                return;
                                            }
                                        };
                                        remove(Channel_data.tags, that.type + ":" + name);
                                        if(that.bindTagToType(Channel_data.tags,item.value)){
                                            console.log("绑定完毕" +　item.label);
                                        }else{
                                            console.log("绑定失败" +　item.label);
                                            return ;
                                        }
                                    });
                                    $("#tagManage_toast").hide();
                                    that.createDialog.close();
                                    var table_self = that.list;
                                    table_self.update(table_self.getPageData(table_self.currPage));
                                },200);
                            });
                        }catch(error){
                            $("#tagManage_toast").hide();
                        }
                    });
                }
            });
        }
        if(status){
            this.createDialog.status = status;
        }
        this.createDialog.open();
    };
    tagManage.showDeleteDialog      = function(data){
        var that = this;
        this.deleteDialog= new PopupDialog({
            url: 'content/biao_qian_guan_li/delete_dialog.html',
            width: 478,
            height: 266,
            context:that,
            callback: function(){
                $("#delete_dialog_sucai_name").text(data.name);
                $("#dialog_delete_botton_click").unbind("click").click(function(){
                    var deletestatus = that.deleteTag(data.name,function(){
                        that.deleteDialog.close();
                        var table_self = that.list;
                        table_self.update(table_self.getPageData(table_self.currPage));
                    });
                    if(!deletestatus){
                        alert(i18n('SUCAI_SHANCHUSHIBAI'));
                    }

                });
            }
        });
        this.deleteDialog.open();
    };
    tagManage.showViewDialog   = function(data){
        var that = this;
        that.showCreateDialog("revise",data);
    };
    tagManage.updateLeftList = function(data){
        var that = this;
        var selOptions = [];
        var alldata = data || [];
        if(alldata.length != 0){
            for(var i = 0, len = alldata.length; i < len; i++){
                selOptions.push({
                    value: alldata[i].id,
                    label: alldata[i].simple_area_name
                });
            }
        }
        that.leftData = selOptions;
        that.createDialog.left = new StyledFlowList({
            container: '#sucai_dialog_sucaizu_selectable',
            data: selOptions,
            title: {
                label: i18n('BIAOQIANGUANLI_SELECTABLED') + i18n(that.type.toUpperCase())
            },
            minRows: 8
        });
        that.createDialog.left.create();
    }
    //表格处理请求返回响应逻辑
    tagManage.formListDataForTags    = function(data){
        var list_data = [];
        for(var i = 0; i < data.length; i++){
            var record = this.formListRowDataForTag(data[i], i);
            list_data.push(record);
        }
        return list_data;
    };
    tagManage.formListRowDataForTag = function(Data, i){
        var that = this;
        var arr1 = Data.title ? Data.title : "";
        var arr2 = that.listTypeOfTag(that.type + ":" + Data.name);
        if(arr2){
            arr2 = arr2.length;
        }
        var operations = '';
        operations += '<span class="sucai_smallWord_in_td" style="margin-left:px" name="view" data-index="'+ i +'">' + i18n("SUCAI_CHAKAN") + '</span>';
        operations += '<span class="sucai_smallWord_in_td" style="margin-left:40px" name="del" data-index="'+ i +'">' + i18n("SUCAI_SHANCHU") + '</span>';
        var arr = [{label:arr1},{label:arr2} ,{label:operations}];
        return arr;
    };
    tagManage.getResultfromSelOptions= function(ad_id, selOptions){
        var that = this;
        var i;
        for(i=0; i<selOptions.length; i++){
            if(selOptions[i].value == ad_id){
                return selOptions[i];
            }
        }
        return false;
    }
    tagManage.getDiffFromTwoList = function(origin_list, list){
        var that = this;
        var left = origin_list.slice(0);
        var right = list.slice(0);
        var add_list = [];
        var delete_list = [];
        right.forEach(function(item){
            if(!that.getResultfromSelOptions(item.value,left)){
                add_list.push(item);
            }
        });
        left.forEach(function(item){
            if(!that.getResultfromSelOptions(item.value,right)){
                delete_list.push(item);
            }
        })
        var result = {
            add : add_list,
            del : delete_list
        };
        return result;
    };

    //网络请求处理集合
    tagManage.listTag    = function (page, searchtext){
        var that = this;
        var result = false;
        var url = paasHost +　paasDomain　+ "/tagdef/" + that.type + "/"　+ "?" + that.token + new Date().toISOString();
        if(typeof page == 'number'){
            url = url +  "&start=" + (page - 1) * 11 + "&end=" + (page * 11 - 1);
        }
        if(searchtext){
            url = url +  "&title=" + searchtext;
        }
        $.ajax({
            type  : "GET",
            async :false,
            url   : url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
            },
            contentType : "application/json",
            dataType    : "json",
            error:function(error){
                if(that.addTagNameSpace()){
                    console.log("初始化namespace成功");
                }else{
                    console.log("初始化namespace成功");
                };
            }
        }).done(function(data, status, xhr){
            result = data;
            var totalCount = xhr.getResponseHeader('x-aqua-total-count');
            result.allCount = totalCount;
        });
        return result;
    };
    tagManage.addTagNameSpace    = function (){
        var that = this;
        var result = false;
        var data = {"title" : i18n(that.type + "BIAOQIAN")};
        var url = paasHost +　paasDomain　+ "/tagdef/" + that.type + "/"　+ "?" + that.token + new Date().toISOString();
        $.ajax({
            type: "PUT",
            async:false,
            url: url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
            },
            contentType:"application/json",
            dataType: "json",
            data:JSON.stringify(data),
            done:function(ajaxback){
                result = true;
            },
            error:function(error){
                result = false;
            }
        });
        return result;
    };
    tagManage.addTag    = function (name, status, callback){
        var that = this;
        if(status == "skip"){
            if (callback){
                callback();
            }
            return;
        }
        var result = false;
        var url = paasHost +　paasDomain　+ "/tagdef/" + that.type + "/"+ name + "?" + that.token + new Date().toISOString();
        $.ajax({
            type: "PUT",
            async: false,
            url: url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
            },
            contentType: "application/json",
            data: JSON.stringify({title: name}),
        }).done(function(data, status, xhr){
            if(xhr.status == 201 ){
                if (callback){
                    callback();
                }
                result = true;
            }else if(xhr.status == 204 ){
                alert("标签已存在");
            }else{
                alert("无法创建频道标签");
            }
        });
        return result;
    };
    tagManage.bindTagToType    = function (tag_list, id){
        var that = this;
        var result = false;
        var data = {tags:tag_list};
        var url = paasHost +　paasDomain　+ "/tag/application/global/" + that.type + "/" + id + "?" + that.token + new Date().toISOString();
        $.ajax({
            type: "PUT",
            async:false,
            url: url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),
            complete: function(ajaxback){
                if(ajaxback.status == 200 ){
                    result = true;
                }else{
                    console.log(ajaxback.status + "打标签错误");
                }
            }
        })
        return result;
    };
    tagManage.listTypeOfTag = function(tag){
        var that = this;
        var result = false;
        var url = paasHost +　paasDomain　+ "/tag/application/global/" + that.type + "/";
        if(tag){
            url = url + "?tags=" + encodeURI(tag) + "&";
        }else{
            url = url + "?";
        }
        url = url + that.token1  + new Date().toISOString();
        $.ajax({
            type: "GET",
            async: false,
            url: url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
            },
            contentType:"application/json",
            dataType: "json"
        }).done(function(data){
            result = data;
        });
        return result;
    };
    tagManage.getTagOfType = function(id){
        var that = this;
        var result = false;
        var url = paasHost +　paasDomain　+ "/tag/application/global/" + that.type + "/" + id + "?" + that.token + new Date().toISOString();
        $.ajax({
            type: "GET",
            async:false,
            url: url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
            },
            contentType:"application/json",
            dataType: "json"
        }).done(function(data){
            result = data;
        });
        if(result && result.tags){}else{result = {tags:[]}}
        return result;
    };
    tagManage.deleteTag = function (name, callback){
        var result = false;
        var that = this;
        var url = paasHost +　paasDomain　+ "/tagdef/" + that.type + "/"+ name + "?" + that.token + new Date().toISOString();
        $.ajax({
            type : "DELETE",
            async: false,
            url: url,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
            },
            contentType:"application/json",
            dataType: "json",
            complete:function(ajaxback){
                if(ajaxback.status == 200 ||ajaxback.statusText ==  "OK"){
                    if (callback){
                        callback();
                    }
                    result = true;
                }
            }
        });
        return result;
    };
    tagManage.getDataforArea = function(area_id){
        var result;
        var that = this;
        var url = paasHost +　paasDomain　+ "/area/";
        if(area_id){
            url = url + area_id;
        }
        url = url + "?" + that.token + new Date().toISOString();
        var area_name;
        $.ajax({
            type : "GET",
            async: false,
            url: url ,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
            },
            contentType:"application/json",
            dataType: "json"
        }).done(function(data){
            var array = data.child || [];
            array = array.map(function(item){
                var obj = {
                    id   : item.area_id,
                    name : item.area_name,
                };
                if(item.simple_area_name){
                    obj.simple_area_name = item.simple_area_name;
                }
                return obj;
            });
            result = ([{
                id   : data.area_id,
                name : data.area_name,
                simple_area_name : data.simple_area_name,
            }]).concat(array);
        });
        return result;
    };
    tagManage.getDataforMutiArea = function(area_id){
        var result;
        var that = this;
        var url = paasHost +　paasDomain　+ "/area";
        if(area_id){
            url = url + "?id=" + area_id;
        }
        url = url + "&" + that.token + new Date().toISOString();
        var area_name;
        $.ajax({
            type : "GET",
            async: false,
            url: url ,
            headers: {
                'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
            },
            contentType:"application/json",
            dataType: "json"
        }).done(function(data){
            var array = data || [];
            array = array.map(function(item){
                var obj = {
                    id   : item.area_id,
                    name : item.area_name,
                };
                if(item.simple_area_name){
                    obj.simple_area_name = item.simple_area_name;
                }
                return obj;
            });
            result = array;
        });
        return result;
    };
    tagManage.getDataforTypeFromConfig     = function (){
        var that = this;
        var result = [];
        var list;
        var name;
        var value;
        var pre_type;
        switch (that.type){
            case "channel":
                list = channel_list;
                pre_type = that.type;
                break;
            case "area":
                list = area_list;
                pre_type = that.type;
                break;
            case "catalog":
                list = category_list;
                pre_type = "category";
                break;
        }
        name = pre_type + "_name";
        value = pre_type + "_value";
        list.forEach(function(item){
            result.push({
                name : item[name],
                id : item[value]
            });
        });
        return result;
    };
    tagManage.getDataforType = function (){
        var that = this;
        var result = [];
        var name;
        switch (that.type){
            case "channel":
                result = that.getDataforTypeFromConfig();
                break;
            case "catalog":
                result = that.getDataforTypeFromConfig();
                break;
            case "area":
                result = AREA_LEVE1;
                break;
        }
        return result;
    };

    tagManage.initPage();
    return tagManage;
})(jQuery);
