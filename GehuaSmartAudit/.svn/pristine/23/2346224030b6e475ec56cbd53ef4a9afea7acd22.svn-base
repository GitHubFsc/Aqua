define(['my', 'js/defined/tifAqua', 'jquery'], function(my, tifAqua, jQuery){
function fileUpload(obj) {
	this.parentUri = obj && obj.parentUri;
	this.forceCreate = obj && obj.forceCreate;
	this.uriCheckDepth = obj && obj.uriCheckDepth;
	this.fileName = obj && obj.fileName;
	this.metadata = obj && obj.metadata;
	this.fileType = obj && obj.fileType;
	this.fileData = obj && obj.fileData;
	this.dataNotInBlob = obj && obj.dataNotInBlob;
	this.contentCharset = obj && obj.charset;
	this.noDelOnEmpty = obj && obj.noDelOnEmpty;
	this.delayUri = obj && obj.delayUri;

	this.setAqua();
};

fileUpload.prototype = {
	setAqua: function(){
		tifAqua.setUp({
			accessKeyId: my.aqua.accessKeyId,
			secretAccessKey: my.aqua.secretAccessKey,
			host: my.aqua.host,
			restRoot: my.aqua.restRoot
		});
	},

	open : function() {
		if ( typeof FileReader != 'undefined') {
			var fileInputId = 'webcast-ui-sysfile-input';
			while(document.getElementById(fileInputId))
				jQuery('#' + fileInputId).remove();

			var sysFile = document.createElement("input");
			sysFile.id = fileInputId;
			var jqSysFile = jQuery(sysFile);
			jqSysFile.attr('type', 'file').attr('multiple', true).attr('accept', '*');
			var self = this;
			jqSysFile.change(function(){
				var gotFiles = self.got(this);
				if(gotFiles){
					self.parseFile(this);
					if(!self.delayUri){
						self.prepareUpload();
					}
					self.displayFile();
					if(!self.delayUri){
						self.onReadyUpload();
					}
				}
				self.onUploadClose();
				self.close();
			});
			jqSysFile.hide();
			jQuery(document.body).append(sysFile);
			this.fileInput = jqSysFile;

			jqSysFile.click();
		}
	},

	got : function(_file) {
		var isTypeOfPic = false;

		if (_file && _file.files && _file.files.length > 0) {
			for (var i = 0; i < _file.files.length; i++) {
				console.log("Your are going to upload file: " + _file.files[i].name);
				// var splits = _file.files[i].name.split(".");
				// if (splits.length > 1) {
					// //.jpg,.jpeg,.bmp,.tiff,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.png
					// var reg = /^[j|J][p|P][g|G]|[j|J][p|P][e|E][g|G]|[p|P][n|N][g|G]|[g|G][i|I][f|F]|[b|B][m|M][p|P]|[t|T][i|I][f|F][f|F]|[p|P][c|C][x|X]|[t|T][g|G][a|A]|[e|E][x|X][i|I][f|F]|[f|F][p|P][x|X]|[s|S][v|V][g|G]|[p|P][s|S][d|D]|[c|C][d|D][r|R]|[p|P][c|C][d|D]|[d|D][x|X][f|F]|[u|U][f|F][o|O]|[e|E][p|P][s|S]|[a|A][i|I]|[r|R][a|A][w|W]$/;
					// isTypeOfPic = reg.test(splits[splits.length - 1]);
				// }
				// if (!isTypeOfPic) {
					// alert("只支持上传图片，请重新选择!");
					// return false;
				// } else {
					// //Only one pic is to upload
					// return true;
				// }
			}
			return true;
		}
		return false;
	},

	close: function(){
		if(this.fileInput !== undefined)
			this.fileInput.remove();
	},

	uploadBlobFile: function(file){
		/*
		 * file = {
		 * 	fileType: '',
		 * 	blob
		 * }
		 */
		if(!this.checkUri()){
			console.log('File container uri is not available...');
			return false;
		}

		var fileType = file.fileType || 'png';
		var fileBlob = file.blob || '';
		var fileMIME = my.getContentType(fileType);
		var fileUrl = tifAqua.restRoot + tifAqua.encodePath(this.parentUri) + encodeURIComponent(this.fileName);
		var xhr = new tifAqua.xhr();
		xhr.open('PUT', fileUrl, false);
		tifAqua.addXHRHeaderRequest(xhr, 'PUT', fileUrl, 'application/cdmi-object');
		var obj = {
			mimetype: fileMIME,
			metadata: {}
		};
		xhr.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 201 || this.status == 204){
					var upXhr = new tifAqua.xhr();
					upXhr.open('PUT', fileUrl, false);
					tifAqua.addXHRHeaderRequest(upXhr, 'PUT', fileUrl, fileMIME);
					upXhr.sendAsBinary(fileBlob);
				}
			}
		};
		xhr.send(JSON.stringify(obj));
		return true;
	},

	upload: function(files){
		if(!this.checkUri()){
			console.log('File container uri is not available...');
			return false;
		}

		var _files = files || this.uploadFiles;

		if((_files === undefined || _files.length === 0) && !this.dataNotInBlob && !this.noDelOnEmpty){

			var delFile = {
				path: this.parentUri,
				name: this.fileName
			};

			this.deleteFile(delFile);

			return true;
		}

		if(this.dataNotInBlob){
			var meta = {};
			if(this.metadata)
				for(var item in this.metadata)
					meta[item] = this.metadata[item];

			var newFile = {
				path: this.parentUri,
				name: this.fileName,
				metadata: meta
			};

			this.updateFile(newFile);
		}else{
			while(_files && _files.length > 0){
				var file = _files.shift();

				if(this.metadata)
					for(var item in this.metadata)
						file.metadata[item] = this.metadata[item];

				var newFile = {
					path: file.path,
					name: file.name,
					inputFile: file.file,
					metadata: file.metadata
				};

				this.updateFile(newFile);
				break;
			}
		}
		return true;
	},

	setMetadata: function(meta){
		this.metadata = meta;
	},

	setFileData: function(fileData){
		this.fileData = fileData;
	},

	parseFile: function(_file){
		if(_file && _file.files && _file.files.length > 0){
			var len = _file.files.length;
			this.files = [];
			for(var i = 0; i < len; i++){
				this.files.push(_file.files[i]);
			}
		}
	},

	prepareUpload: function(){
		if(this.parentUri === undefined || this.fileName === undefined)
			return false;

		this.parentUri = this.standardizeUri(this.parentUri);

		var uploadFiles = [];
		var tmp = null;
		while(this.files && this.files.length > 0){
			tmp = this.files.shift();
			var meta = {};

			if(this.metadata)
				for(var item in this.metadata)
					meta[item] = this.metadata[item];

			var uploadFile = {
				file: tmp,
				metadata: meta,
				path: this.parentUri,
				name: this.fileName
			};
			uploadFiles.push(uploadFile);
		}

		this.uploadFiles = uploadFiles;
	},

	setUri: function(uri){
		this.parentUri = uri;
		this.prepareUpload();
		this.onReadyUpload();
	},

	checkUri: function(){
		this.parentUri = this.standardizeUri(this.parentUri);
		if(!this.parentUri)
			return false;

		var uriParts = this.parentUri.split('/');
		uriParts.shift();
		uriParts.pop();
		if(this.uriCheckDepth === undefined)
			this.uriCheckDepth = uriParts.length - 1;

		var uri = '/';
		for(var i = 0; i < this.uriCheckDepth; i++){
			uri += uriParts.shift();
			uri += '/';
		}

		var len = uriParts.length;
		for(var j = 0; j < len; j++){
			uri += uriParts.shift();
			uri += '/';
			if(this.checkFolder(uri)){
				continue;
			}else{
				return false;
			}
		}
		return true;
	},

	checkFolder: function(uri){
		var uri = this.standardizeUri(uri);
		if(!uri)
			return false;

		var uriParts = uri.split('/');
		uriParts.pop();
		var containerName = uriParts.pop();
		uriParts.push('');
		var containerPath = uriParts.join('/');

		var folder = new tifAqua.folder({
			path: containerPath,
			name: containerName
		});

		if(folder.checkExist()){
			return true;
		}else if(this.forceCreate){
			if(folder.create())
				return true;
			return false;
		}
		return false;
	},

	getFile: function(){
		if(this.uploadFiles && this.uploadFiles.length > 0){
			var file = this.uploadFiles[0] && this.uploadFiles[0].file;
			return file;
		}
	},

	getInputFile: function(){
		if(this.files && this.files.length > 0){
			var file = this.files[0];
			return file;
		}
	},

	displayFile: function(){

	},

	onReadyUpload: function(){

	},

	onUploadClose: function(){

	},

	standardizeUri: function(uri){
		if(!uri || typeof uri !== 'string')
			return false;
		if(uri.charAt(0) !== '/')
			uri = '/' + uri;
		if(uri.charAt(uri.length - 1) !== '/')
			uri += '/';

		return uri;
	},

	rename: function(){

	},

	updateFileInContentType: function(file){
		if(this.dataNotInBlob && this.fileType){
			if(!this.fileData)
				this.fileData = '          ';

			var fileMIME = my.getContentType(this.fileType);
			var fileUrl = tifAqua.restRoot + tifAqua.encodePath(file.path) + encodeURIComponent(file.name);

			var upXhr = new tifAqua.xhr();
			upXhr.open('PUT', fileUrl, false);
			tifAqua.addXHRHeaderRequest(upXhr, 'PUT', fileUrl, fileMIME);
			upXhr.send(this.fileData);
			return;
		}

		var fileReader = new FileReader();
		fileReader.onloadend = function(e){
			var blobData = this.result;

			var fileMIME = my.getContentType(file.inputFile.name);
			var url = tifAqua.restRoot + tifAqua.encodePath(file.path) + encodeURIComponent(file.name);
			var fileXhr = new tifAqua.xhr();
			fileXhr.open('PUT', url, false);
			tifAqua.addXHRHeaderRequest(fileXhr, 'PUT', url, fileMIME);
			fileXhr.send(blobData);
		};
		var blob = file.inputFile;
		fileReader.readAsArrayBuffer(blob);
	},

	updateFile: function(file){
		/*
		 file = {
		 	path:
		 	name:
		 	inputFile
		 	metadata:
		 }
		 */
		var fileType = this.fileType || (file && file.inputFile && file.inputFile.name);

		if(fileType == null)
			return;

		var fileMIME = my.getContentType(fileType);
		var url = tifAqua.restRoot + tifAqua.encodePath(file.path) + encodeURIComponent(file.name);
		var xhr = new tifAqua.xhr();
		xhr.open('PUT', url, false);
		tifAqua.addXHRHeaderRequest(xhr, 'PUT', url, 'application/cdmi-object');
		var obj = {
			mimetype: fileMIME,
			metadata: file.metadata
		};
		var self = this;
		xhr.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 201 || this.status == 204){
					self.updateFileInContentType(file);
				}
			}
		};
		xhr.send(JSON.stringify(obj));
	},

	deleteFile: function(file){
		var aquaFile = new tifAqua.file({
			path: file.path,
			name: file.name
		});
		if(aquaFile.deleteObj())
			return true;
		return false;
	},

	clear: function(){
		this.uploadFiles = [];
	}
};

return fileUpload;
});