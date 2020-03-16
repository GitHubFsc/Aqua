function PagedView(data, pageSize){
	if(data != null && typeof data.length != 'undefined'){
		this.data = data;
	} else {
		this.data = [];
	}
	this.pageSize = pageSize > 0 ? pageSize: 1;
	this.init();
}

PagedView.prototype = {
	init: function(){
		this.currPage = 0;
		this.length = this.data.length;
		var pageNum = Math.ceil(this.length/this.pageSize);
		this.pageLmt = pageNum - 1;
		this.pageNum = pageNum;
	},

	previous: function(){
		if(this.currPage > 0){
			this.currPage -=  1;
			return true;
		} else {
			return false;
		}
	},

	next: function(){
		if(this.currPage < this.pageLmt){
			this.currPage += 1;
			return true;
		} else {
			return false;
		}
	},

	getData: function(callback, flag, currPage){
		if(currPage != null){
			this.currPage = currPage;
		} else {
			if(flag > 0){
				if(!this.next()){
					return false;
				}
			} else if(flag < 0) {
				if(!this.previous()){
					return false;
				}
			}
		}
		var start = this.currPage * this.pageSize;
		var end = start + this.pageSize;
		start = Math.min(start, this.length - 1);
		end = Math.min(end, this.length);
		var arr = [];
		if(this.length > 0){
			for(var i = start; i < end; i += 1){
				arr.push(this.data[i]);
			}
		}
		if(typeof callback == 'function'){
			callback(arr);
		}
	}
};

function GridNav(obj){
	this.colNum = obj.cols != null ? obj.cols : 1;
	this.num = obj.num != null ? obj.num : 0;
	this.init();
}

GridNav.prototype = {
	init: function(){
		this.focus = {
			col: 0,
			row: 0,
			lmt: {
				row: 0,
				col: 0,
			}
		};
		this.rowNum = Math.ceil(this.num/this.colNum);
		this.focus.lmt.row = this.rowNum - 1;
		var lastRowNum = this.num - (this.rowNum - 1) * this.colNum;
		this.focus.lmt.col = lastRowNum - 1;
	},

	up: function(){
		if(this.focus.row > 0){
			this.focus.row -= 1;
			return true;
		}
		return false;
	},

	down: function(){
		if(this.focus.row < this.focus.lmt.row){
			this.focus.row += 1;
			if(this.focus.row == this.focus.lmt.row){
				if(this.focus.col > this.focus.lmt.col){
					this.focus.col = this.focus.lmt.col;
				}
			}
			return true;
		}
		return false;
	},

	left: function(){
		if(this.focus.col > 0){
			this.focus.col -= 1;
			return true;
		}
		return false;
	},

	right: function(){
		if(this.focus.row < this.focus.lmt.row){
			if(this.focus.col < this.colNum - 1){
				this.focus.col += 1;
				return true;
			}
		} else if(this.focus.row == this.focus.lmt.row){
			if(this.focus.col < this.focus.lmt.col){
				this.focus.col += 1;
				return true;
			}
		}
		return false;
	}
};

function CaroNav(obj){
	this.num = obj.num != null ? obj.num : 0;
	this.isLoop = !!obj.loop;
	this.init();
}

CaroNav.prototype = {
	init: function(){
		this.focus = {
			index: 0,
			lmt: 0
		};
		this.focus.lmt = this.num - 1;
	},

	next: function(){
		if(this.focus.index < this.focus.lmt){
			this.focus.index += 1;
			return true;
		} else if(this.isLoop){
			this.focus.index = 0;
			return true;
		} else {
			return false;
		}
	},

	previous: function(){
		if(this.focus.index > 0){
			this.focus.index -= 1;
			return true;
		} else if(this.isLoop){
			this.focus.index = this.focus.lmt;
			return true;
		} else {
			return false;
		}
	}
};

function ColumnNode(parentNode, name, bit){
	this.bit = bit;
	this.name = name;
	this.parent = parentNode;
}

ColumnNode.prototype = {
	getNodeId: function(){
		if(this.nodeId != null){
			return this.nodeId;
		}
		var id = '';
		if(this.parent != null){
			id += this.parent.getNodeId();
		}
		id += this.bit;
		this.nodeId = id;
		return id;
	},

	getNodePath: function(){
		if(this.nodePath != null){
			return this.nodePath;
		}
		var path = '';
		if(this.parent != null){
			path += this.parent.getNodePath();
		}
		path += '/' + this.name;
		this.nodePath = path;
		return path;
	},
}

function AppRepoint(){}

AppRepoint.prototype = {

	pageID: '',
	columnID: '',
	columnName: '',
	pageNum: 0,
	serviceNum: 0,
	serviceEntrance: '0',
	PaymentMethod: 0,
	Codeerror: '0',
	Payerror: '0',

	collect: function(){
		if(typeof reportData == 'function'){
			reportData({
				pageID: this.pageID,
				columnID: this.columnID,
				columnName: this.columnName,
				pageNum: this.pageNum,
				serviceNum: this.serviceNum,
				serviceEntrance: this.serviceEntrance,
				PaymentMethod: this.PaymentMethod,
				Codeerror: this.Codeerror,
				Payerror: this.Payerror,
			});
		}
	}
};