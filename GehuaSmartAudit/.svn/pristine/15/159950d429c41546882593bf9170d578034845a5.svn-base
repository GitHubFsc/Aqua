function PopupDialog(confObj) {
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
		this.isScroll = confObj.isScroll;
	}

	if (!this.perWidth)
		this.dialogWidth = parseInt(this.dialogWidth, 10);

	if (!this.perHeight)
		this.dialogHeight = parseInt(this.dialogHeight, 10);

	this.init();
};

PopupDialog.maskId = 'popup-dialog-mask';
PopupDialog.dialogId = 'popup-dialog-dialog';

PopupDialog.clear = function() {
    var mask;
    var dialog;
    while ( mask = document.getElementById(PopupDialog.maskId)) {
        jQuery(mask).remove();
    }

    while ( dialog = document.getElementById(PopupDialog.dialogId)) {
        jQuery(dialog).remove();
    }

    if (PopupDialog.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog.reLocateDialogFunc);
        PopupDialog.reLocateDialogFunc = null;
    }
};

PopupDialog.scrollIntoView = function() {
    window.scrollTo(0, 0);
};

PopupDialog.prototype.init = function() {
};

PopupDialog.prototype.locate = function(mask, dialog) {
	jQuery(mask).css({
		position : 'fixed',
		left : 0,
		top : 0,
		width : '100%',
		height : '100%',
		zIndex : 1000,
		backgroundColor : 'rgba(0,0,0,0.3)'
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
		position : 'fixed',
		left : normalDialogLeft,
		top : normalDialogTop,
		width : this.dialogWidth,
		height : this.dialogHeight,
		zIndex : 1001
	});

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

	if (PopupDialog.reLocateDialogFunc) {
        jQuery(window).unbind('resize', PopupDialog.reLocateDialogFunc);
    }
	PopupDialog.reLocateDialogFunc = reLocateDialog;
	jQuery(window).bind('resize', PopupDialog.reLocateDialogFunc);
};

PopupDialog.prototype.getLocalContent = function() {
	var localContent = this.localContent || '';
	var dialog = document.getElementById(PopupDialog.dialogId);
	if (dialog) {
		dialog.innerHTML = patchHTML(localContent);
		if (this.drawnCallback && this.callbackRef)
			this.drawnCallback.call(this.callbackRef);
	}
};

PopupDialog.prototype.getContentHtml = function() {
	if (!this.htmlUri)
		return;
	var self = this;
	if (this.ajaxOnEachCreate) {

		jQuery.get(this.htmlUri, function(data) {
			var dialog = document.getElementById(PopupDialog.dialogId);
			if (dialog) {
				dialog.innerHTML = patchHTML(data);
				if (self.drawnCallback && self.callbackRef)
					self.drawnCallback.call(self.callbackRef);
			}
		});

	} else {

		if ((this.htmlUri == this.prevHtml) && this.htmlData) {
			var dialog = document.getElementById(PopupDialog.dialogId);
			if (dialog) {
				dialog.innerHTML = patchHTML(this.htmlData);
				if (self.drawnCallback && self.callbackRef)
					self.drawnCallback.call(self.callbackRef);
			}
		} else {
			jQuery.get(this.htmlUri, function(data) {
				var dialog = document.getElementById(PopupDialog.dialogId);
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

PopupDialog.prototype.create = function() {
	var mask = document.getElementById(PopupDialog.maskId);
	var dialog = document.getElementById(PopupDialog.dialogId);
	if (mask || dialog) {
		PopupDialog.clear();
	}

	mask = document.createElement('div');
	mask.id = PopupDialog.maskId;
	document.body.appendChild(mask);
	dialog = document.createElement('div');
	dialog.id = PopupDialog.dialogId;
	document.body.appendChild(dialog);

	this.locate(mask, dialog);
	if (this.local)
		this.getLocalContent();
	else
		this.getContentHtml();
	if(!this.isScroll){
		PopupDialog.scrollIntoView();
	}
};

PopupDialog.prototype.destroy = function() {
	PopupDialog.clear();
};

PopupDialog.prototype.open = function() {
	this.create();
};

PopupDialog.prototype.close = function() {
    PopupDialog.clear();
};

PopupDialog.prototype.show = function() {
	var mask = document.getElementById(PopupDialog.maskId);
	var dialog = document.getElementById(PopupDialog.dialogId);
	if (mask && dialog) {
		mask.style.display = 'block';
		dialog.style.display = 'block';
		if(!this.isScroll){
			PopupDialog.scrollIntoView();
		}
	} else {
		this.create();
	}
};

PopupDialog.prototype.hide = function() {
	var mask = document.getElementById(PopupDialog.maskId);
	if (mask) {
		mask.style.display = 'none';
	}
	var dialog = document.getElementById(PopupDialog.dialogId);
	if (dialog) {
		dialog.style.display = 'none';
	}
};

PopupDialog.prototype.resize = function(obj, live) {
	if (obj && obj.width)
		this.dialogWidth = obj.width;
	if (obj && obj.height)
		this.dialogHeight = obj.height;
	
	if(live){
		this.locate(document.getElementById(PopupDialog.maskId), document.getElementById(PopupDialog.dialogId));
	}
};

jQuery(function(){
    jQuery(document.body).off('click', '.popup_dialog_clear').on('click', '.popup_dialog_clear', function(){
        PopupDialog.clear();
    });    
});
