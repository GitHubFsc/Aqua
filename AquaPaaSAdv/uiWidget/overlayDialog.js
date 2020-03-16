function OverlayDialog(confObj) {
	if (confObj) {
		this.local = confObj.local;
		this.localContent = confObj.content;

		this.htmlUri = confObj.url;
		this.dialogWidth = confObj.width;
		this.dialogHeight = confObj.height;
		this.perWidth = confObj.perWidth;
		this.perHeight = confObj.perHeight;
		this.ajaxOnEachCreate = confObj.ajaxOnEachCreate;

		this.callbackRef = confObj.context;
		this.drawnCallback = confObj.callback;
		this.calSupport = confObj.calSupport;

		this.specId = confObj.id || '';
		this.zIndex = confObj.zIndex || 2000;
	}

	if (!this.perWidth)
		this.dialogWidth = parseInt(this.dialogWidth, 10);

	if (!this.perHeight)
		this.dialogHeight = parseInt(this.dialogHeight, 10);

	this.init();
};

OverlayDialog.clear = function(){
	jQuery('.overlay-dialog-mask').remove();
	jQuery('.overlay-dialog-dialog').remove();
};

OverlayDialog.scrollIntoView = function() {
    window.scrollTo(0, 0);
};

OverlayDialog.prototype.init = function() {
    this.maskId = 'overlay-dialog-mask' + this.specId;
    this.dialogId = 'overlay-dialog-dialog' + this.specId;
};

OverlayDialog.prototype.clear = function(){
	var mask;
	var dialog;
	while ( mask = document.getElementById(this.maskId)) {
		jQuery(mask).remove();
	}

	while ( dialog = document.getElementById(this.dialogId)) {
		jQuery(dialog).remove();
	}
};

OverlayDialog.prototype.locate = function(mask, dialog) {
	jQuery(mask).css({
		position : 'fixed',
		left : 0,
		top : 0,
		width : '100%',
		height : '100%',
		zIndex : this.zIndex,
		backgroundColor : 'rgba(0,0,0,0.5)'
	});

	var jqDialog = jQuery(dialog);
	var normalDialogLeft, normalDialogTop;

	if (this.perWidth) {
		var widthPer = parseInt(this.dialogWidth, 10);
		normalDialogLeft = '' + Math.floor(50 - widthPer / 2) + '%';
	} else {
		if(this.calSupport){
			normalDialogLeft = Math.floor((window.innerWidth - this.dialogWidth)/2);
		}else{
			var dialogOffsetHorizontal = Math.floor(this.dialogWidth / 2);
			normalDialogLeft = 'calc( 50% - ' + dialogOffsetHorizontal + 'px )';
		}
	}

	if (this.perHeight) {
		var heightPer = parseInt(this.dialogHeight, 10);
		normalDialogHeight = '' + Math.floor(50 - heightPer / 2) + '%';
	} else {
		if(this.calSupport){
			normalDialogTop = Math.floor((window.innerHeight - this.dialogHeight)/2);
		}else{
			var dialogOffsetVertical = Math.floor(this.dialogHeight / 2);
			normalDialogTop = 'calc( 50% - ' + dialogOffsetVertical + 'px )';
		}
	}

	jqDialog.css({
		position : 'absolute',
		left : normalDialogLeft,
		top : normalDialogTop,
		width : this.dialogWidth,
		height : this.dialogHeight,
		zIndex : this.zIndex + 1
	});

	if(!this.calSupport){
		jqDialog.css({
			left: '-webkit-' + normalDialogLeft,
			top: '-webkit-' + normalDialogTop
		});
	}

	function reLocateDialog() {
		var dialogLeft = dialog.offsetLeft;
		var dialogTop = dialog.offsetTop;

		if (dialogLeft < 0) {
			dialogLeft = 0;
		} else {
			dialogLeft = normalDialogLeft;
		}

		if (dialogTop < 0) {
			dialogTop = 0;
		} else {
			dialogTop = normalDialogTop;
		}

		jqDialog.css({
			left : dialogLeft,
			top : dialogTop
		});

		dialogLeft = dialog.offsetLeft;
		dialogTop = dialog.offsetTop;

		if (dialogLeft <= 0) {
			dialogLeft = 0;
		} else {
			dialogLeft = normalDialogLeft;
		}

		if (dialogTop <= 0) {
			dialogTop = 0;
		} else {
			dialogTop = normalDialogTop;
		}

		jqDialog.css({
			left : dialogLeft,
			top : dialogTop
		});
	}

	reLocateDialog();

	// if (OverlayDialog.reLocateDialogFunc) {
        // jQuery(window).unbind('resize', OverlayDialog.reLocateDialogFunc);
    // }
	// OverlayDialog.reLocateDialogFunc = reLocateDialog;
	// jQuery(window).bind('resize', OverlayDialog.reLocateDialogFunc);
};

OverlayDialog.prototype.getLocalContent = function() {
	var localContent = this.localContent || '';
	var dialog = document.getElementById(this.dialogId);
	if (dialog) {
		dialog.innerHTML = patchHTML(localContent);
		if (this.drawnCallback && this.callbackRef)
			this.drawnCallback.call(this.callbackRef);
	}
};

OverlayDialog.prototype.getContentHtml = function() {
	if (!this.htmlUri)
		return;
	var self = this;
	if (this.ajaxOnEachCreate) {

		jQuery.get(this.htmlUri, function(data) {
			var dialog = document.getElementById(self.dialogId);
			if (dialog) {
				dialog.innerHTML = patchHTML(data);
				if (self.drawnCallback && self.callbackRef)
					self.drawnCallback.call(self.callbackRef);
			}
		});

	} else {

		if ((this.htmlUri == this.prevHtml) && this.htmlData) {
			var dialog = document.getElementById(self.dialogId);
			if (dialog) {
				dialog.innerHTML = patchHTML(this.htmlData);
				if (self.drawnCallback && self.callbackRef)
					self.drawnCallback.call(self.callbackRef);
			}
		} else {
			jQuery.get(this.htmlUri, function(data) {
				var dialog = document.getElementById(self.dialogId);
				if (dialog) {
					dialog.innerHTML = patchHTML(data);
					self.htmlData = data;
					if (self.drawnCallback && self.callbackRef)
						self.drawnCallback.call(self.callbackRef);
				}
			});
			this.prevHtml = this.htmlUri;
		}

	}
};

OverlayDialog.prototype.create = function() {
	var mask = document.getElementById(this.maskId);
	var dialog = document.getElementById(this.dialogId);
	if (mask || dialog) {
		this.clear();
	}

	mask = document.createElement('div');
	mask.id = this.maskId;
	mask.className = 'overlay-dialog-mask';
	document.body.appendChild(mask);
	dialog = document.createElement('div');
	dialog.id = this.dialogId;
	dialog.className = 'overlay-dialog-dialog';
	document.body.appendChild(dialog);

	this.locate(mask, dialog);
	if (this.local)
		this.getLocalContent();
	else
		this.getContentHtml();
	OverlayDialog.scrollIntoView();
};

OverlayDialog.prototype.destroy = function() {
	this.clear();
};

OverlayDialog.prototype.open = function() {
	this.create();
};

OverlayDialog.prototype.close = function() {
	this.clear();
};

OverlayDialog.prototype.show = function() {
	var mask = document.getElementById(this.maskId);
	var dialog = document.getElementById(this.dialogId);
	if (mask && dialog) {
		mask.style.display = 'block';
		dialog.style.display = 'block';
		OverlayDialog.scrollIntoView();
	} else {
		this.create();
	}
};

OverlayDialog.prototype.hide = function() {
	var mask = document.getElementById(this.maskId);
	if (mask) {
		mask.style.display = 'none';
	}
	var dialog = document.getElementById(this.dialogId);
	if (dialog) {
		dialog.style.display = 'none';
	}
};

OverlayDialog.prototype.resize = function(obj, live) {
	if (obj && obj.width)
		this.dialogWidth = obj.width;
	if (obj && obj.height)
		this.dialogHeight = obj.height;

	if(live){
		this.locate(document.getElementById(this.maskId), document.getElementById(this.dialogId));
	}
};

jQuery(function(){
    jQuery(document.body).off('click', '.overlay_dialog_clear').on('click', '.overlay_dialog_clear', function(){
        OverlayDialog.clear();
    });
});
