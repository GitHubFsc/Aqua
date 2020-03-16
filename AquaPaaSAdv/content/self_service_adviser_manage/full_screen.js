function self_service_adviser_full_screen(confObj) {
	if (confObj) {
		this.url = confObj.url||"";
		this.callback=confObj.callback||"";
	};
	this.init();
};
self_service_adviser_full_screen.prototype.init = function() {
  var self=this;
	var jq=jQuery;
	var popup_full_screen = {
		url: "content/self_service_adviser_manage/popup_full_screen.html",
		width: document.body.clientWidth,
		height: window.innerHeight,
		context: this,
		callback: function(){
		  if(self.url!=""){
				var img = new Image();
				img.src = self.url;
			  img.onload = function () {
					var ele=document.getElementById("self_service_adviser_manage_full_screen_pic_container");
					var pic=document.getElementById("self_service_adviser_manage_full_screen_pic");
					var ImgSizePosition=self.calcImgSizePosition(ele.offsetHeight,ele.offsetWidth,img.height,img.width);
					var imgHeight=((ImgSizePosition.calcImgHeight!="100%")?(ImgSizePosition.calcImgHeight+"px"):ImgSizePosition.calcImgHeight);
				  var imgWidth=((ImgSizePosition.calcImgWidth!="100%")?(ImgSizePosition.calcImgWidth+"px"):ImgSizePosition.calcImgWidth);
				  var imgMarginTop=(ImgSizePosition.calcImgMarginTop+"px");
				  var imgMarginLeft=(ImgSizePosition.calcImgMarginLeft+"px");
					pic.style.width=imgWidth;
					pic.style.height=imgHeight;
					pic.style.top = imgMarginTop;
					pic.style.left = imgMarginLeft;
					jq("#self_service_adviser_manage_full_screen_pic").attr("src",self.url)
					jq("#self_service_adviser_manage_full_screen_pic").show();
				};
			}
			self.callback()
		}
	};
	this.popup_full_screen = new PopupDialog(popup_full_screen);
	this.popup_full_screen.open();
};
self_service_adviser_full_screen.prototype.calcImgSizePosition = function(fatherContainerHeight,fatherContainerWidth,imgHeight,imgWidth){
	var calcImgHeight=0;
	var calcImgWidth=0;
	var calcImgMarginLeft=0;
	var calcImgMarginTop=0;
	if ((imgHeight / imgWidth) > 1) {
		var calcImgWidth = imgWidth * fatherContainerHeight / imgHeight;
		calcImgHeight = fatherContainerHeight;
		if (calcImgWidth > fatherContainerWidth) {//如果超过则缩小图。
			calcImgWidth = fatherContainerWidth;
			calcImgHeight = fatherContainerHeight * fatherContainerWidth / calcImgWidth;
		}
		calcImgMarginLeft = ((fatherContainerWidth - calcImgWidth) / 2);
	}

	else if ((imgHeight / imgWidth) < 1) {//here
		calcImgHeight = imgHeight * fatherContainerWidth / imgWidth;
		calcImgWidth = fatherContainerWidth;
		if (calcImgHeight > fatherContainerHeight) {//如果超过则缩小图。
			calcImgHeight = fatherContainerHeight;
			calcImgWidth = imgWidth * fatherContainerHeight / imgHeight;
		};
		calcImgMarginLeft = ((fatherContainerWidth - calcImgWidth) / 2);
		calcImgMarginTop = ((fatherContainerHeight - calcImgHeight) / 2);
	}
	else {
		calcImgHeight = "100%"; 
		calcImgWidth = "100%";
	};
	var calcImgObj=new Object();
	calcImgObj.calcImgHeight=calcImgHeight;
	calcImgObj.calcImgWidth=calcImgWidth;
	calcImgObj.calcImgMarginLeft=calcImgMarginLeft;
	calcImgObj.calcImgMarginTop=calcImgMarginTop;
	return calcImgObj
}