var myPlayer = new Object();

/**
 * 整体布局
 */
myPlayer.layout =
    '<div id="player_tool_object_container"></div>'+
    '<div class="player_tool_console">'+
    '    <div id="player_tool_btn_container">'+
    '        <div id="player_tool_play_btn" class="player_tool_btn" title="播放"></div>'+
    '        <div id="player_tool_pause_btn" class="player_tool_btn" title="暂停" style="display: none;"></div>'+
    '        <div id="player_tool_resume_btn" class="player_tool_btn" title="继续播放" style="display: none;"></div>'+
     '   <div id="player_tool_time_container">'+
     '       <div class="player_tool_time" id="player_tool_begin_time">00:00:00</div>'+
     '       <div class="player_tool_time" id="player_tool_end_time">00:00:00</div>'+
     '       <div id="player_tool_time_slider"></div>'+
     '   </div>'+
    '</div>'+

    '</div>';

/**
 * 初始化页面
 */
myPlayer.initPage = function(_containerId, _mrl, _type) {
    //初始化参数
    this.initParam(_mrl, _type);
    this.containerId = _containerId;
    //设置框体样式
    jQuery("#" + _containerId).empty().append(this.layout);
    this.setWinStyle();
    //设置播放器事件
    this.bingPlayerEvent();
};


/**
 * 初始化参数
 */
myPlayer.initParam = function(_mrl, _type) {
    //this.my = window.opener.my;
    this.mrl = _mrl;
    this.type = _type;             //用户类型 "0" => 学生 "0" => 教师
    this.myPlayerTimer = "";
};

/**
 * 复位播放器
 */
myPlayer.resetPlayer = function() {
    if(jQuery("#PlayCtrl").length > 0){
        var player = document.getElementById("PlayCtrl");
        try{
            player.Stop();
        }
        catch (err) {
            console.log(err);
        }
    }
    jQuery(document).unbind("mouseup.myPlayer");
    jQuery("#" + this.containerId).empty();
    clearInterval(myPlayer.myPlayerTimer);
};
/**
 * 设置框体样式
 */
myPlayer.setWinStyle = function(){
    if(this.type == "0"){
//        jQuery("#player_tool_play_btn").removeClass();
//        jQuery("#player_tool_pause_btn").removeClass();
//        jQuery("#player_tool_resume_btn").removeClass();
//        jQuery("#player_tool_btn_container").removeClass();
//        jQuery("#player_tool_time_slider").removeClass();
    }else if(this.type == "1"){
        jQuery("#player_tool_play_btn").addClass("tool_teacher");
        jQuery("#player_tool_pause_btn").addClass("tool_teacher");
        jQuery("#player_tool_resume_btn").addClass("tool_teacher");
        jQuery("#player_tool_btn_container").addClass("tool_teacher");
        jQuery("#player_tool_time_slider").addClass("tool_teacher");
    }else if(this.type == "2"){
        jQuery("#player_tool_play_btn").addClass("tool_schedule");
        jQuery("#player_tool_pause_btn").addClass("tool_schedule");
        jQuery("#player_tool_resume_btn").addClass("tool_schedule");
        jQuery("#player_tool_btn_container").addClass("tool_schedule");
        jQuery("#player_tool_time_slider").addClass("tool_schedule");
    }
};

/**
 * 设置播放器事件
 */
myPlayer.bingPlayerEvent = function(){
    //mrl = "E:\\tet\\a.mp4";
    //
    var mrl = this.mrl;
    var player = null;
    var vpChanging = false;
    var canSetPlayTime = true;
    var isFirstPaly = true;             //视频是否第一次加载
    var isStopPlay = false;                //是否停止播放
    var isPausePlay = false;                //是否暂停播放
    var isPauseSeek = false;                //是否暂停seek
    var totleDuration = 0;

    var currentLoop = 0;
    var endLoop = 200;
    var browserType = 0; //0=> mozilla 1=> IE


    if (!!window.ActiveXObject || "ActiveXObject" in window){
        var tempDom = '<OBJECT id="PlayCtrl" Width="100%" Height="100%" CLASSID="CLSID:92AC76E9-6DEA-4F4E-BDD7-D903BC438A3D" codebase='+ aqua_host + PCPanelFileContainer + 'WinXPlayer.cab#version=1,0,0,9"></OBJECT>';
        jQuery("#player_tool_object_container").empty().append(tempDom);
        browserType = 1;

    }else if( navigator.userAgent.indexOf('Firefox') >= 0){
        var tempDom = '<embed type="application/npFnpXPlay" width="100%" height="100%" id="PlayCtrl">';
        jQuery("#player_tool_object_container").empty().append(tempDom);
        browserType = 0;
    }

    var canPlay = true;
    try{
        player = document.getElementById("PlayCtrl");
        player.Open(mrl);
    }catch(e){
        console.log(e);
        canPlay = false;
        if(browserType === 0){
            if (confirm("是否需要下载最新的插件?安装完成后请重启浏览器。")){
                window.location = aqua_host + PCPanelFileContainer + "WinXPlayer.exe";
            }
        }

    }

    if(!canPlay){
        return;
    } 
    jQuery(window).unload( function () {
        document.getElementById("PlayCtrl").Stop();
    });

    //设置播放事件
    jQuery("#player_tool_play_btn").click(function(event) {
        console.log(mrl);
        player.Open(mrl);
        player.Play();

        isStopPlay = false;
        isPausePlay = false;
        if (isFirstPaly){
            getTotleimeLoop();

        }else{
            jQuery( "#player_tool_time_slider" ).slider( 'enable' );
            jQuery(this).hide();
            jQuery("#player_tool_pause_btn").show();
        }
        event.stopPropagation();    //  阻止事件冒泡

    });

    //设置暂停事件
    jQuery("#player_tool_pause_btn").click(function(event){
        player.Pause();
        isStopPlay = false;
        isPausePlay = true;
        jQuery(this).hide();
        jQuery("#player_tool_resume_btn").show();
        jQuery( "#player_tool_time_slider" ).slider( 'enable' );
        event.stopPropagation();    //  阻止事件冒泡

    });
    //设置继续播放事件
    jQuery("#player_tool_resume_btn").click(function(event){
        if(isPauseSeek){
            var newTime = jQuery( "#player_tool_time_slider" ).slider("value");
            console.info("seek时间为: " + newTime);
            player.SetPlayTime(newTime.toString());
        }
        isStopPlay = false;
        isPausePlay = false;
        player.Resume();
        jQuery("#player_tool_resume_btn").hide();
        jQuery("#player_tool_pause_btn").show();
        jQuery( "#player_tool_time_slider" ).slider( 'enable' );
        isPauseSeek = false;
        event.stopPropagation();    //  阻止事件冒泡
    });
    //设置停止事件
    jQuery("#player_tool_stop_btn").click(function(event){
        isStopPlay = true;
        isPausePlay = false;
        player.Stop();
        jQuery( "#player_tool_time_slider" ).slider("value",0);
        jQuery( "#player_tool_time_slider" ).slider( 'disable' );
        jQuery("#player_tool_play_btn" ).show();
        jQuery("#player_tool_resume_btn").hide();
        jQuery("#player_tool_pause_btn").hide();
        event.stopPropagation();    //  阻止事件冒泡
    });


    //自动开始播放视频
    jQuery("#player_tool_play_btn").click();

    function setPlayTime(){
        if(canSetPlayTime && !isStopPlay && !isPausePlay){
            var currentPlayTime = parseInt(player.GetPlayTime(), 10);
            console.log("当前播放时间为：" + currentPlayTime);
            console.log("总时间为：" + totleDuration);
            var formatCurrentPlayTimeStr = formatSeconds(currentPlayTime);
            var formattotleDurationStr = formatSeconds(totleDuration);
            jQuery("#player_tool_begin_time").html(formatCurrentPlayTimeStr);
            jQuery("#player_tool_end_time").html(formattotleDurationStr);
            //设置进度条位置
            jQuery( "#player_tool_time_slider" ).slider("value",currentPlayTime);
            if(currentPlayTime >= totleDuration){
                player.Stop();
                isStopPlay = true;
                isPausePlay = false;
                //设置起始时间
                //jQuery("#window_content_player_begin_time").html(formatSeconds("0"));
                jQuery("#player_tool_play_btn" ).show();
                jQuery("#player_tool_resume_btn").hide();
                jQuery("#player_tool_pause_btn").hide();
                jQuery("#player_tool_begin_time").html(formatSeconds(0));
                jQuery("#player_tool_end_time").html(formatSeconds(0));
                jQuery( "#player_tool_time_slider" ).slider("value",0);
                jQuery( "#player_tool_time_slider" ).slider( 'disable' );
            }
        }
    }

    function getPlayTimeLoop(newTime){
        if(currentLoop >= endLoop) {
            currentLoop = 0;
            vpChanging = false;
            canSetPlayTime = true;
            return;
        }
        console.log("当前时间为："  + player.GetPlayTime());
        if(player.GetPlayTime() == newTime){
            vpChanging = false;
            canSetPlayTime = true;
//            jQuery("#player_tool_playtime").html(formatSeconds(player.GetPlayTime()) + "/" + formatSeconds(totleDuration));
            console.log("设置"+ newTime + "时间后  当前时间为" + newTime);
        }else{
            currentLoop += 1;
            setTimeout(function(){getPlayTimeLoop(newTime)},10);
        }
    }

    function getTotleimeLoop(){
        if(currentLoop >= endLoop)  {
            currentLoop = 0;
            return;
        }
        console.log("第" + currentLoop + "次 获取总时长为： "  + player.GetLength());
        if(parseInt(player.GetLength(), 10) > 0){
            isFirstPaly = false;
            totleDuration = parseInt(player.GetLength(), 10);
            jQuery("#player_tool_play_btn").hide();
            jQuery("#player_tool_pause_btn").show();
            jQuery( "#player_tool_time_slider" ).slider({
                max: totleDuration
            });

            jQuery("#player_tool_time_slider").mousedown(function(){
                if(vpChanging || isStopPlay){
                    return;
                }
                canSetPlayTime = false;
                vpChanging = true;
            });
            jQuery(document).bind("mouseup.myPlayer", function(){
                if (!canSetPlayTime && !isStopPlay){
                    var newTime = jQuery( "#player_tool_time_slider" ).slider("value");
                    console.info("mouseup: " + newTime);
                    if(!isPausePlay){
                        player.SetPlayTime(newTime.toString());
                        currentLoop = 0;
                        getPlayTimeLoop(newTime);
                    }else{
                        currentLoop = 0;
                        vpChanging = false;
                        canSetPlayTime = true;
                        isPauseSeek = true;
                        jQuery("#player_tool_begin_time").html(formatSeconds(newTime));
                    }
                }
            });
            //jQuery(document).mouseup(function() {
            //    if (!canSetPlayTime && !isStopPlay){
            //        var newTime = jQuery( "#player_tool_time_slider" ).slider("value");
            //        console.info("mouseup: " + newTime);
            //        player.SetPlayTime(newTime.toString());
            //        currentLoop = 0;
            //        getPlayTimeLoop(newTime);
            //    }
            //});
            //启动自动刷新播放进度条.
            setPlayTime();
            myPlayer.myPlayerTimer = setInterval(function(){setPlayTime();},1000);
        }else{
            currentLoop += 1;
            setTimeout(function(){getTotleimeLoop()},10);
        }
    }

    /**
     * 秒转换为时分
     **/
    function formatSeconds(value) {
        var hour    =   Math.floor(parseInt(value / 60 / 60));
        var minute  =   Math.floor(value / 60 % 60);
        var second  =   Math.floor(value % 60);
        return [hour, minute, second].join(":")
            .replace(/\b(\d)\b/g, "0$1");
    }

    function getPlayerPath(){
        return "http://" + window.location.host +"/"+window.location.pathname.split("/")[1]+"/";
//        var path = "";
//        if(window.location.pathname.indexOf("/content/discussion/videoPlayer.html") > -1){
//            path = "../../";
//        }
//        return path;
    }
};

