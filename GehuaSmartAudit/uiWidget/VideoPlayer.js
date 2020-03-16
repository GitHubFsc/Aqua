/*
 * container $('')（必须项）
 * src 视频路径
 * styles{
	width 宽度
	height 高度
	top  顶部距离
	left  左边距离
 }
 */
function VideoPlayer(obj){
	var confObj = obj;
	if(confObj){
		this.container = confObj.container;
		this.src = confObj.src;
		this.styles = confObj.styles;
		this.body_width = document.body.clientWidth;
		this.body_height = document.body.clientHeight;
	}
	if(!this.container)
		return null;
	else
		this.init();
};
VideoPlayer.prototype.init = function(){
	var frameId = 'video-player' + new Date().getTime();
	var container = this.container;
	var src = this.src;
	var width = this.styles.width;
	var height = this.styles.height;
	var top = this.styles.top;
	var left = this.styles.left;
	// 定义操作按钮的样式
	var mask_height = this.styles.mask_height || 34;
	var mask_background_color = this.styles.mask_background_color || '#38414d';
	var btn_width = this.styles.btn_width || 34;
	var time_width = this.styles.time_width || 30;
	var time_height = this.styles.time_height || 20;
	var time_margin_top = this.styles.time_margin_top || (mask_height - time_height) / 2;
	var time_margin_left = this.styles.time_margin_left || 5;
	var time_color = this.styles.time_color || '#fff';
	var time_font_size = this.styles.time_font_size || 11;
	var slide_height = this.styles.slide_height || 4;
	var slide_border_radius = this.styles.slide_border_radius || 5;
	var slide_background_color = this.styles.slide_background_color || '#6a717a';
	var slide_left_margin_left = this.styles.slide_left_margin_left || btn_width + time_width + time_margin_left;
	var slide_left_top = this.styles.slide_left_top || height - mask_height + (mask_height - slide_height) / 2;
	var slide_left_background_color = this.styles.slide_left_background_color || '#1ec3ec';
	var point_width = this.styles.point_width || 8;
	var point_top = this.styles.point_top || -point_width / 4;
	var point_left = this.styles.point_left || -point_width / 2;
	var point_background_color = this.styles.point_background_color || '#fff';
	// max
	var mask_full_height = this.styles.mask_full_height || 60;
	var btn_full_width = this.styles.btn_full_width || 60;
	var go_to_height = this.styles.go_to_height || 30;
	var go_to_radius = this.styles.go_to_radius || 25;
	var go_input_width = this.styles.go_input_width || 30;
	var go_input_font_size = this.styles.go_input_font_size|| 20;
	var go_input_background_color = this.styles.go_input_background_color || '#778495';
	var go_input_color = this.styles.go_input_color || '#fff';
	var time_full_width = this.styles.time_full_width || 40;
	var time_full_height = this.styles.time_full_height || 20;
	var time_full_margin_top = this.styles.time_full_margin_top || (mask_full_height - time_full_height) / 2;
	var time_full_margin_left = this.styles.time_full_margin_left || 10;
	var time_full_font_size = this.styles.time_full_font_size || 14;
	var slide_full_height = this.styles.slide_full_height || 8;
	var slide_left_full_margin_left = this.styles.slide_left_full_margin_left || btn_full_width + go_input_width * 3 + 4 + btn_full_width + time_full_width + time_full_margin_left;
	var slide_left_full_top = this.styles.slide_left_full_top || -(mask_full_height / 2 + slide_full_height);
	var point_full_width = this.styles.point_full_width || 16;
	var point_full_top = this.styles.point_full_top || -point_full_width / 4;
	var point_full_left = this.styles.point_full_left || -point_full_width / 2;
	// 拿到之后的备用值
	this.min_slide_leftWidth = slide_left_margin_left * 2 ; 
	this.max_slide_leftWidth = slide_left_full_margin_left + time_full_width + time_full_margin_left + btn_full_width; 
	this.min_point_width = point_width;
	this.max_point_width = point_full_width;

	var dom = `<div id='`+ frameId +`'>
			<style>
				#`+ frameId +` {position: absolute;left: `+ left +`px; top: `+ top +`px;width: `+ width +`px;height: `+ height +`px;}
				#`+ frameId +` video {height: 100%;width: 100%;z-index: 9999;}
				#`+ frameId +` .mask{position: absolute;bottom: 0;height: `+ mask_height + `px;left: 0;right: 0;background-color: `+ mask_background_color +`;display:none;}
				#`+ frameId +` .play, #`+ frameId +` .full {width: `+ btn_width +`px;height: `+ btn_width +`px;margin: auto;cursor: pointer;background-repeat: no-repeat;background-position: center;}
				#`+ frameId +` .time {width: `+ time_width +`px;line-height: `+ time_height +`px;color: `+ time_color +`;text-align: center;cursor: default;font-size: `+ time_font_size +`px;}
				#`+ frameId +` .start_time {margin: `+ time_margin_top +`px `+ time_margin_left +`px `+ time_margin_top +`px 0;}
				#`+ frameId +` .end_time {margin: `+ time_margin_top +`px 0 `+ time_margin_top +`px `+ time_margin_left +`px;}
				#`+ frameId +` .slide {flex: 1;height: `+ slide_height +`px;margin: auto 0;border-radius: `+ slide_border_radius +`px;background-color: `+ slide_background_color +`;position: relative;}
				#`+ frameId +` .slide_left {width: 0;height: `+ slide_height +`px;margin-left: `+ slide_left_margin_left +`px;position: absolute;top: `+ slide_left_top +`px;border-radius: `+ slide_border_radius +`px;background-color: `+ slide_left_background_color +`;}
				#`+ frameId +` .slide:hover, #`+ frameId +` .slide_left:hover {cursor: pointer;}
				#`+ frameId +` .played {background-image: url('./uiWidget/images/video_play.png');}
				#`+ frameId +` .paused {background-image: url('./uiWidget/images/video_paused.png');}
				#`+ frameId +` .full {background-image: url('./uiWidget/images/video_max.png');}
				#`+ frameId +` .point {width: `+ point_width +`px;height: `+ point_width +`px;position: absolute;top: `+ point_top +`px;left: `+ point_left +`px;background-color: `+ point_background_color +`;border-radius: 50%;cursor: pointer;z-index: 2;}

				#`+ frameId +`.max {position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;z-index: 9999;background-color: rgba(0, 0, 0, 0.7)}
				#`+ frameId +` .mask_full {height: `+ mask_full_height +`px;}
				#`+ frameId +` .play_full, #`+ frameId +` .full_full, #`+ frameId +` .video_go_btn {width: `+ btn_full_width +`px;height: `+ btn_full_width +`px;}
				#`+ frameId +` .video_go_to {height: `+ go_to_height +`px;margin: auto 0;border-radius: `+ go_to_radius +`px;overflow: hidden;background-color: `+ go_input_background_color +`;color: `+ go_input_color +`;font-size: `+ go_input_font_size +`px;display: none;}
				#`+ frameId +` .video_go_to .video_go_input {width: `+ go_input_width +`px;height: `+ go_to_height +`px;line-height: `+ go_to_height +`px;margin: auto;border: 0;background-color: `+ go_input_background_color +`;color: `+ go_input_color +`;font-size: `+ go_input_font_size +`px;text-align: center;outline: none;}
				#`+ frameId +` .video_go_btn {background-image: url('./uiWidget/images/video_go_to.png');cursor: pointer;display: none;}
				#`+ frameId +` .time_full {width: `+ time_full_width +`px;line-height: `+ time_full_height +`px;font-size: `+ time_full_font_size +`px;}
				#`+ frameId +` .start_time_full {margin: `+ time_full_margin_top +`px `+ time_full_margin_left +`px `+ time_full_margin_top +`px 0;}
				#`+ frameId +` .end_time_full {margin: `+ time_full_margin_top +`px 0 `+ time_full_margin_top +`px `+ time_full_margin_left +`px;}
				#`+ frameId +` .slide_full {height: `+ slide_full_height +`px;}
				#`+ frameId +` .slide_left_full {height: `+ slide_full_height +`px;margin-left: `+ slide_left_full_margin_left +`px;position: relative;top: `+ slide_left_full_top +`px;}
				#`+ frameId +` .played_full {background-image: url('./uiWidget/images/video_play_full.png');}
				#`+ frameId +` .paused_full {background-image: url('./uiWidget/images/video_paused_full.png');}
				#`+ frameId +` .full_min {background-image: url('./uiWidget/images/video_min_full.png');}
				#`+ frameId +` .point_full {width: `+ point_full_width +`px;height: `+ point_full_width +`px;top: `+ point_full_top +`px;left: `+ point_full_left +`px;}
			</style>
				<video id='video_div' src='`+ src +`'/>
				<div class='mask'>
					<div class='play played'></div>
					<div class='video_go_to'>
						<input class='video_go_input hh' type="text" maxlength='1' onfocus="this.value=''" onkeyup="VideoPlayer.prototype.goInputOnkeyup(this.value, 'hh')" onchange="VideoPlayer.prototype.goInputChange(this.value, 'hh')"/><span style="width: 2px;">:</span><input class='video_go_input mm' type="text" maxlength='2' onfocus="this.value=''" onkeyup="VideoPlayer.prototype.goInputOnkeyup(this.value, 'mm');" onchange="VideoPlayer.prototype.goInputChange(this.value, 'mm')"/><span style="width: 2px;">:</span><input class='video_go_input ss' type="text" maxlength='2' onfocus="this.value=''" onkeyup="VideoPlayer.prototype.goInputOnkeyup(this.value, 'ss');" onchange="VideoPlayer.prototype.goInputChange(this.value, 'ss')"/>
					</div>
					<div class='video_go_btn'></div>
					<div class='time start_time'></div>
					<div class='slide'>
						<div class='point'></div>
					</div>
					<div class='time end_time'></div>
					<div class='full'></div>
				</div>
				<div class='slide_left'></div>
			</div>`
	$(dom).appendTo(container)
	this.bindEvents(frameId);
};
VideoPlayer.prototype.bindEvents = function(id){
	var _this = this, video_current_time, video_duration_time, video_time_multiple;
	var video_body_width = this.body_width - this.max_slide_leftWidth; // 全屏时进度条长度
	var video_current_width = this.styles.width - this.min_slide_leftWidth; // 缩小时进度条长度
	var video_min_point_width = this.min_point_width; // 全屏时
	var video_max_point_width = this.max_point_width; // 缩小时
	// 拿到视频总时长
	$('#'+id).find('video')[0].addEventListener('canplay',function() {
		var player = $('#'+id).find('video')[0];
		if(player){
			video_duration_time = player.duration;
			$('#'+id + ' .end_time').html(_this.timeOffset(video_duration_time));
			$('#'+id + ' .mask').css({'display': 'flex'});
		}
	});
	$('#' + id)
	.on('click', '.play', ({currentTarget, target}) => {
		if (currentTarget == target) {
			window.player = $('#' + id).find('video')[0]
			if($('#' + id).is('.max')){
				if (player.paused) {
					$('.play').removeClass('played').removeClass('played_full').addClass('paused').addClass('paused_full');
					player.play()
				} else {
					$('.play').removeClass('paused').removeClass('paused_full').addClass('played').addClass('played_full');
					player.pause();
				}
			} else {
				if (player.paused) {
					$('.play').removeClass('played').addClass('paused');
					player.play()
				} else {
					$('.play').removeClass('paused').addClass('played');
					player.pause();
				}
			}
		}
	})
	.on('click', '.full', ({currentTarget, target}) => {
		video_time_multiple = video_current_time / video_duration_time; // 时间比例
		if($('#' + id).is('.max')){
			$('#' + id).removeClass('max');
			$('#' + id + ' .mask').removeClass('mask_full');
			$('#' + id + ' .play').removeClass('play_full');
			$('#' + id + ' .played').removeClass('played_full');
			$('#' + id + ' .paused').removeClass('paused_full');
			$('#' + id + ' .video_go_to').css({'display': 'none'});
			$('#' + id + ' .video_go_btn').css({'display': 'none'});
			$('#' + id + ' .time').removeClass('time_full');
			$('#' + id + ' .start_time').removeClass('start_time_full');
			$('#' + id + ' .slide').removeClass('slide_full');
			$('#' + id + ' .point').removeClass('point_full');
			$('#' + id + ' .end_time').removeClass('end_time_full');
			$('#' + id + ' .full').removeClass('full_full').removeClass('full_min');
			$('#' + id + ' .slide_left').removeClass('slide_left_full');
			$('#' + id + ' .point').css({
				left: (video_time_multiple * video_current_width) - video_min_point_width / 2,
			})
			$('#' + id + ' .slide_left').css({
				'width': (video_time_multiple * video_current_width) + 'px',
			})
		} else {
			$('#' + id).addClass('max');
			$('#' + id + ' .mask').addClass('mask_full');
			$('#' + id + ' .play').addClass('play_full');
			$('#' + id + ' .played').addClass('played_full');
			$('#' + id + ' .paused').addClass('paused_full');
			$('#' + id + ' .video_go_to').css({'display': 'block'});
			$('#' + id + ' .video_go_btn').css({'display': 'block'});
			$('#' + id + ' .time').addClass('time_full');
			$('#' + id + ' .start_time').addClass('start_time_full');
			$('#' + id + ' .slide').addClass('slide_full');
			$('#' + id + ' .point').addClass('point_full');
			$('#' + id + ' .end_time').addClass('end_time_full');
			$('#' + id + ' .full').addClass('full_full').addClass('full_min');
			$('#' + id + ' .slide_left').addClass('slide_left_full');
			$('#' + id + ' .video_go_to .video_go_input').val('00');
			$('#' + id + ' .video_go_to .video_go_input.hh').val('0');
			$('#' + id + ' .point').css({
				left: (video_time_multiple * video_body_width) - video_max_point_width / 2,
			});
			$('#' + id + ' .slide_left').css({
				'width': (video_time_multiple * video_body_width) + 'px',
			});
		}
	})
	.on('mousedown', '.point', ({currentTarget, target, pageX}) => {
		if (currentTarget == target) {
			var left = parseInt($(currentTarget).css('left'));
			$(document.body).bind('mouseup', () => {
				$(document.body).unbind('mousemove').unbind('mouseup')
			}).bind('mousemove', (e) => {
				var offset = e.pageX - pageX;
				var move = left + offset;
				if (move < $(currentTarget).width() / 2) {
					move = 0;
				};
				if (move > $(currentTarget).parent().width()) {
					move = $(currentTarget).parent().width();
				};
				if($('#' + id).is('.max')){
					move = move + video_max_point_width / 2;
				} else {
					move = move + video_min_point_width / 2;
				};
				$(currentTarget).css({
					left: move,
				});
				$('#' + id + ' .slide_left').css({
					'width': move + 'px',
				});
				var video_len = $(currentTarget).parent().width();
				var position = $(currentTarget).offset().left - $(currentTarget).parent().offset().left
				var percentage = position / video_len;
				var player = $('#' + id).find('video')[0];
				player.currentTime = player.duration * percentage;
				// 通过当前播放事件更新全屏进度条
				video_current_time = player.currentTime;
				$('#'+id + ' .start_time').html(_this.timeOffset(video_current_time));
			})
		}
	})
	.on('mousedown', '.slide', ({currentTarget, target, offsetX}) => {
		if (currentTarget == target) {
			var player = $('#' + id).find('video')[0];
			$('#' + id + ' .point').css({
				left: offsetX + 'px',
			});
			if($('#' + id).is('.max')){
				$('#' + id + ' .slide_left').css({
					'width': (offsetX + video_max_point_width / 2) + 'px',
				});
				video_current_time = (offsetX / video_body_width) * video_duration_time;
			} else {
				$('#' + id + ' .slide_left').css({
					'width': (offsetX + video_min_point_width / 2) + 'px',
				});
				video_current_time = (offsetX / video_current_width) * video_duration_time;
			}
			player.currentTime = video_current_time;
			$('#'+id + ' .start_time').html(_this.timeOffset(video_current_time));
		}
	})
	.on('mousedown', '.slide_left', ({currentTarget, target, offsetX}) => {
		if (currentTarget == target) {
			var player = $('#' + id).find('video')[0];
			$('#' + id + ' .point').css({
				left: offsetX + 'px',
			});
			if($('#' + id).is('.max')){
				$('#' + id + ' .slide_left').css({
					'width': (offsetX + video_max_point_width / 2) + 'px',
				});
				video_current_time = (offsetX / video_body_width) * video_duration_time;
			} else {
				$('#' + id + ' .slide_left').css({
					'width': (offsetX + video_min_point_width / 2) + 'px',
				});
				video_current_time = (offsetX / video_current_width) * video_duration_time;
			}
			player.currentTime = video_current_time;
			$('#'+id + ' .start_time').html(_this.timeOffset(video_current_time));
		}
	})
	// 全屏输入时间跳转
	.on('click', '.video_go_btn', ({currentTarget, target}) => {
		var value_hh = $('#'+id + ' .video_go_to .video_go_input.hh').val();
		var value_mm = $('#'+id + ' .video_go_to .video_go_input.mm').val();
		var value_ss = $('#'+id + ' .video_go_to .video_go_input.ss').val();
		var video_go_time = Number(value_hh * 60 * 60) + Number(value_mm  * 60) + Number(value_ss);
		// 最长跳转时长不超过视频时长
		if(video_duration_time <= video_go_time){
			video_go_time = video_duration_time;
			var video_go_input_time = _this.timeOffsetAll(video_go_time).split(':');
			$('#'+id + ' .video_go_to .video_go_input.hh').val(video_go_input_time[0]);
			$('#'+id + ' .video_go_to .video_go_input.mm').val(video_go_input_time[1]);
			$('#'+id + ' .video_go_to .video_go_input.ss').val(video_go_input_time[2]);
		}
		video_time_multiple = video_go_time / video_duration_time;
		if (currentTarget == target) {
			$('#' + id + ' .point').css({
				left: (video_time_multiple * video_body_width) - this.max_point_width / 2,
			});
			$('#' + id + ' .slide_left').css({
				'width': (video_time_multiple * video_body_width) + 'px',
			});
			var player = $('#' + id).find('video')[0];
			player.currentTime = video_go_time;
			if(video_go_time == video_duration_time){
				$('#' + id + ' .play').removeClass('paused_full').addClass('played_full');
				player.pause();
			} else {
				$('#' + id + ' .play').removeClass('played_full').addClass('paused_full');
				player.play();
			}
		}
	});
	// 视频播放
	$('#'+id).find('video')[0].addEventListener('timeupdate',function() {
		var player = $('#'+id).find('video')[0];
		if(player.duration <= player.currentTime){
			if($('#' + id).is('.max')){
				$('.play').removeClass('paused').removeClass('paused_full').addClass('played').addClass('played_full');
			} else {
				$('.play').removeClass('paused').addClass('played');
			}
			player.pause();
		}
		if($('#' + id).is('.max')){
			var left = player.currentTime / player.duration * video_body_width;
			$('#' + id).find('.point').css({
				left: left - video_max_point_width / 2,
			});
		} else {
			var left = player.currentTime / player.duration * video_current_width;
			$('#' + id).find('.point').css({
				left: left - video_min_point_width / 2,
			});
		}
		$('#' + id + ' .slide_left').css({
			'width': left + 'px',
		})

		// 更新播放时间
		video_current_time = player.currentTime;
		$('#'+id + ' .start_time').html(_this.timeOffset(video_current_time));
		video_duration_time = player.duration;
		$('#'+id + ' .end_time').html(_this.timeOffset(video_duration_time));
	});
	$('#'+id + ' .start_time').html('00:00');  //加载初始播放时间
};
VideoPlayer.prototype.timeOffset = function(offset) {
	var time_offset, m = '00' , s = '00';
    if(offset < 60){
    	s = timeAddZero(Math.floor(offset));
	} else if(offset >= 60){
    	m = timeAddZero(Math.floor(offset / 60));
    	s = timeAddZero(Math.floor(offset - m * 60));
	}
	time_offset = m + ':' + s;
	function timeAddZero(num) {
        if(num < 10 && num > 0){
    		num = '0' + num;
        } else if(num == 0 ){
			num = '00';
		}
        return num;
	}
  	return time_offset;
};
VideoPlayer.prototype.timeOffsetAll = function(offset) {
  	var time_offset, h = '0' , m = '00' , s = '00';
    h = Math.floor(offset / (60 * 60));
    m = timeAddZero(Math.floor((offset - h * 60) / 60));
    s = timeAddZero(Math.floor(offset - h * 60 - m *60));
  	time_offset = h + ':' + m + ':' + s;
  	function timeAddZero(num) {
    	if(num < 10 && num > 0){
    		num = '0' + num;
        } else if(num == 0 ){
			num = '00';
		}
    	return num;
  	}
  	return time_offset;
};
// 对输入跳转的时间进行判断
VideoPlayer.prototype.goInputChange = function(val, type) {
	var value = Number(val);
	if(type == 'hh'){
		if(value >= 9){
			$('.video_go_to .video_go_input.hh').val('9');
		}
	} else if(type == 'mm'){
		if(value >= 59){
			$('.video_go_to .video_go_input.mm').val('59');
		} else if(value > 0 && value < 10){
			$('.video_go_to .video_go_input.mm').val('0' + value);
		} else if(value == 0){
			$('.video_go_to .video_go_input.mm').val('00');
		}
	} else if(type == 'ss'){
		if(value >= 59){
			$('.video_go_to .video_go_input.ss').val('59');
		} else if(value > 0 && value < 10){
			$('.video_go_to .video_go_input.ss').val('0' + value);
		} else if(value == 0){
			$('.video_go_to .video_go_input.ss').val('00');
		}
	}
};
VideoPlayer.prototype.goInputOnkeyup = function(value, type) {
	value = value.replace(/\D/g,'')
	if(type == 'hh'){
		$('.video_go_to .video_go_input.hh').val(value);
		if(value.length >= 1){
			$('.video_go_to .video_go_input.mm').focus();
		}
	} else if(type == 'mm'){
		$('.video_go_to .video_go_input.mm').val(value);
		if(value.length >= 2){
			$('.video_go_to .video_go_input.ss').focus();
		}
	} else if(type == 'ss'){
		$('.video_go_to .video_go_input.ss').val(value);
	}
};