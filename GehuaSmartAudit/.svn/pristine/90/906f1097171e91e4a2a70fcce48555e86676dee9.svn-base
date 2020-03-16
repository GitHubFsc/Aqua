function ImgHover(containerId, imgSrcList){
    this.containerId = containerId;
    this.imgSrcList = imgSrcList;
    this.createInstance();//实例化
}

ImgHover.prototype.createInstance = function(){
    this.initParam();
    this.draw();
    this.setData();
    this.bingEvent();
    if(this.imgSrcList.length > 0){
        this.loadImg(this.imgSrcList[0]);
    }
};

ImgHover.prototype.initParam = function(){
    this.imgNowIndex = 0;
    this.imgTotalNum = 0;
    this.imgInnerContainerId = this.containerId + "_img_inner_container";
    this.imgControlContainerId = this.containerId + "_img_control_container";
    this.imgNowIndexId = this.containerId + "_img_now_index";
    this.imgTotleIndexId = this.containerId + "img_totle_index";
};

ImgHover.prototype.draw = function(){
    var $imgInnerContainer = jQuery('<div>', {
        id: this.imgInnerContainerId
    }).addClass("img_inner_container");

    var domTemplate =
             '<div class="img_control_pre img_control_container" title="上一张"></div>'
            +'<div class="img_control_next img_control_container" title="下一张"></div>'
            +'<div class="img_page_number_container img_control_container">'
            +'  <span id="{0}">0</span>/<span id="{1}">0</span>'
            +'</div>';
    var domTemplateIds = [this.imgNowIndexId, this.imgTotleIndexId];
    var imgControlContainer = this.formatString(domTemplate, domTemplateIds);
    var $parentRef = jQuery('#' + this.containerId);
    $parentRef.css("position", "relative");
    $parentRef.append($imgInnerContainer);
    $parentRef.append(imgControlContainer);
};

ImgHover.prototype.setData = function(){
    if(this.imgSrcList.length == 0){
        this.imgNowIndex = 0;
        this.imgTotalNum = 0;
        return;
    }else{
        this.imgNowIndex = 0;
        this.imgTotalNum = this.imgSrcList.length;
        jQuery('#' + this.imgNowIndexId).text(1);
        jQuery('#' + this.imgTotleIndexId).text(this.imgTotalNum);
    }
};
ImgHover.prototype.bingEvent = function(){
    var $parentRef  = jQuery('#' + this.containerId);
    var $controlRef = jQuery('#' + this.containerId + ' .img_control_container');
    var $controlPreRef = $parentRef.find('.img_control_pre');
    var $controlNextRef = $parentRef.find('.img_control_next');
    var that = this;
    if(!$parentRef.data("bingEvent")){
        $parentRef.hover(function(){
            $controlRef.show();
            showOrHideRef();

        },function(){
            $controlRef.hide();
        });

        $controlPreRef.click(function(){
            that.preImage();
            showOrHideRef();
        });

        $controlNextRef.click(function(){
            that.nextImage();
            showOrHideRef();
        });

        function showOrHideRef(){
            that.imgNowIndex === 0 ? $controlPreRef.hide() : $controlPreRef.show();
            that.imgNowIndex === (that.imgTotalNum - 1) ? $controlNextRef.hide() : $controlNextRef.show();
        }
        $parentRef.data("bingEvent", true);
    }
};


/*跳转到上一张图片*/
ImgHover.prototype.preImage = function() {
    if(this.imgNowIndex <= 0) {
        return;
    }
    this.imgNowIndex--;
    this.loadImg(this.imgSrcList[this.imgNowIndex]);
    jQuery('#' + this.imgNowIndexId).text(this.imgNowIndex + 1);
};

/*跳转到下一张图片*/
ImgHover.prototype.nextImage = function() {
    if(this.imgNowIndex >= this.imgTotalNum -1) {
        return;
    }
    this.imgNowIndex++;
    this.loadImg(this.imgSrcList[this.imgNowIndex]);
    jQuery('#' + this.imgNowIndexId).text(this.imgNowIndex + 1);
};

ImgHover.prototype.pushImage = function(imgUrl) {
    if(imgUrl && imgUrl != "") {
        this.imgSrcList.push(imgUrl);
        this.imgTotalNum = this.imgSrcList.length;
        jQuery('#' + this.imgTotleIndexId).text(this.imgTotalNum);
    }else{
        console.log("加载图片失败");
        //this.loadImgNoData($container, imageType);
    }
};

ImgHover.prototype.pushImageList = function(imgUrlList) {
    for (var i = 0; i < imgUrlList.length; i++) {
        this.pushImage(imgUrlList[i]);
    }
};

ImgHover.prototype.resetImage = function(imgUrlList) {
    this.imgSrcList = imgUrlList;
    this.setData();
    this.bingEvent();
    if(this.imgSrcList.length > 0){
        this.loadImg(this.imgSrcList[0]);
    }
};

ImgHover.prototype.addImage = function(imgUrl) {
    this.imgSrcList.push(imgUrl);
    this.imgTotalNum = this.imgSrcList.length;
//    console.log(this.imgTotalNum);
    jQuery('#' + this.imgTotleIndexId).text(this.imgTotalNum);
};

ImgHover.prototype.showLastImg = function() {
    this.imgNowIndex = this.imgTotalNum -1;
    this.loadImg(this.imgSrcList[this.imgNowIndex]);
    jQuery('#' + this.imgNowIndexId).text(this.imgTotalNum);
};

ImgHover.prototype.loadImg = function(srcUrl){
    if(this.imgSrcList.length == 0){
        return;
    }
    var $container = jQuery('#' + this.imgInnerContainerId);
    $container.empty();
    var imgWidth = $container.innerWidth();
    var imgHeight = $container.innerHeight();
    if(srcUrl && srcUrl != ""){
        var img = new Image();
        //$containerId.addClass("loading");
        //图片加载加载后执行
        var that = this;
        jQuery(img).load(function () {
            //图片默认隐藏
            jQuery(this).hide();
            //移除小动画
            $container.empty().append(this);
            //alert($(this).attr("src"));
            that.adjustImgSize(jQuery(this), imgWidth, imgHeight);
            //使用fadeIn特效
            jQuery(this).show();
        })
        .error(function(){
            $container.empty().append(this);
            console.log("加载图片失败");
            //this.loadImgNoData($container, imageType);
        })
        //最后设置src
        .attr("src",srcUrl);
    }else{
        console.log("加载图片失败");
        //this.loadImgNoData($container, imageType);
    }
};


/**
 * 设置图片自适应
 */
ImgHover.prototype.adjustImgSize = function(img, boxWidth, boxHeight) {
    var tempImg = new Image();
    tempImg.src = img.attr('src');
    var imgWidth=tempImg.width;
    var imgHeight=tempImg.height;
    //比较imgBox的长宽比与img的长宽比大小  
    if((boxWidth/boxHeight)>=(imgWidth/imgHeight)){
        //重新设置img的width和height  
        img.width((boxHeight*imgWidth)/imgHeight);
        img.height(boxHeight);
        //让图片居中显示  
        var margin=(boxWidth-img.width())/2;
        img.css("margin-left",margin);
    }
    else{
        //重新设置img的width和height  
        img.width(boxWidth);
        img.height((boxWidth*imgHeight)/imgWidth);
        //让图片居中显示  
        var margin=(boxHeight-img.height())/2;
        img.css("margin-top",margin);
    }
};

ImgHover.prototype.loadImgNoData = function(container){
    container.empty();
    var containerWidth = container.innerWidth();
    var containerHeight = container.innerHeight();
    var defaultSrc = "";
    var img = new Image();
    var $img = jQuery(img);
    $img.attr("src",defaultSrc);
    jQuery(img).load(function () {
        //图片默认隐藏
//        imgWidth = img.width;
//        imgHeight = img.height;
//        $img.css("margin-left",((containerWidth - imgWidth)/2));
//        $img.css("margin-top",((containerHeight - imgHeight)/2));
        $img.prependTo(container);
    });

};

// string format
ImgHover.prototype.formatString = function(template, values) {
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        template = template.replace("{" + i + "}", value);
    }
    return template;
};