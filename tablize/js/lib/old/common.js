var priviousPage = null;
/**
 * 选择器
 * @param id：元素ID
 * @returns
 */
var $ = function(id){
	return document.getElementById(id);
};

/**
 * 选择器
 * @param ide：元素ID或元素本身
 * @returns
 */
var $$ = function(ide){
	return "string" == typeof(ide)?document.getElementById(ide):ide;
};

/**
 * 移除所有的子元素
 * @param ide－元素ID或元素本身
 */
function removeChildren(ide){
	if(!isUdfine(ide)){
		var itself = $$(ide);
		if(itself){
			var children = itself.children;
			var cldLen = children.length;
			for(var i = 0; i < cldLen; i++){
				itself.removeChild(children[0]);
			}
			return true;
		}
	}
	return false;
}

/**
 *@container:被加载的容器(DIV)或容器ID
 *@folder:文件存放的目录
 *@html:html的文件名
 *@jses：js文件，参数为数组，数组中元素格式：
 *		 {name:js文件名，removable:可移除否}
 */
function includePage(container,folder,html,jses){
	if(folder && container){
		container = $$(container);
		var pageInfo = {"addToDomObject": container,"sync": false};
		if(html){
			pageInfo.htmlFile = folder + "/" + html;
		}
		var len = jses.length;
		if(jses && len > 0){
			var jsFiles = [];
			for(;len > 0; len--){
				jsFiles.push({"path":folder + "/" + jses[len-1].name,"removable":jses[len-1].removable});
			}
			pageInfo.jsFiles = jsFiles;
		}
		var pageObj = new my.includeHTMLJSFile(pageInfo);
		//加载新页面前移出前一页
		removePage();
		pageObj.load();
		priviousPage = pageObj;
	}
}

/**
 * 移除上一页
 */
function removePage(){
	if(priviousPage){
		priviousPage.remove();
	}
}

/**
 * 将HTML文件中的内容加载到指定容器
 * @param container：被加载的容器
 * @param htmlFile：需要加载的HTML文件的路径
 */
function innerFile(container,htmlFile){
	container = $$(container);
	var xmlHttp = null;
    if(window.XMLHttpRequest){
    	xmlHttp = new XMLHttpRequest();
    }else{
    	xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var strHtml = "";
    xmlHttp.open("POST",htmlFile,false);//同步加载
    xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState == 4){
			strHtml = xmlHttp.responseText;
		}
		if(strHtml && container){
			container.innerHTML = patchHTML(strHtml);
		}
	};
	xmlHttp.send();
}

/**
 * 是否自然数[Natural number]
 * @param s
 * @returns
 */
function isNn(s){
	return /^(([1-9]{1}\d*)|0)$/.test(s);
}

/**
 * 是否未定义
 * @param v
 */
function isUdfine(v){
	return (typeof(v) == "undefined");
}

/**
 * 判断是否为空(未定义也算空)
 * @param v
 */
function isNull(v){
	if(isUdfine(v) || v == null){
		return true;
	}
	return false;
}

/**
 * AJAX控件
 * @returns
 */
function XmlHttpReq(){
	this.xhr = null;
	if(window.XMLHttpRequest){
		this.xhr = new XMLHttpRequest();
	}else{
		this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	this.xhr.sendAsBinary = function(datastr){
		function byteValue(x){
			return x.charCodeAt(0) & 0xff;
		}
		var ords = Array.prototype.map.call(datastr, byteValue);
		var ui8a = new Uint8Array(ords);
		this.send(ui8a.buffer);
	};
	return this.xhr;
}

/***********************************键值对（类Map）工具*********************************/
/**
 * 键值对
 * Key value pair
 * @allowNullValue:是否允许放入空值
 */
function Kvp(allowNullValue){
	this.length = 0;
	this.top = -1;
	this.popKey=null;//最近一次出列的key值
	this.isOrdered = false;//默认是无序的
	/**
	 * 允许空值
	 */
	this.anv = allowNullValue;
}

/**
 * 判空
 * @returns
 */
Kvp.prototype.isEmpty = function(){
	return this.length <= 0;
};

/**
 * 向KVP对象中存键值对，重名的Key值会覆盖原有的Value值
 * @param key,仅仅是由Kvp在push的时候返回的key或是一个自然数
 * @param value-放入的值
 * @returns 返回boolean值，表示是否put成功
 */
Kvp.prototype.put = function(key,value){
	if(!this.anv && isNull(value)){
		return false;
	}
	if(isNn(key)){
		if(isUdfine(this[key])){
			this.length++;
			if(parseInt(key) > this.top){
				this.top = parseInt(key);
			}
		}
		this[key] = value;
		//有值put，原有序状态被打乱
		this.isOrdered = false;
		return true;
	}
	return false;
};

/**
 * 键值自增长型
 * @param value
 * @returns
 */
Kvp.prototype.push = function(value){
	if(!this.anv && isNull(value)){
		return false;
	}
	if(!isUdfine(value)){
		this.top++;
		if(this[this.top]){//键值被占用
			this.push(value);
		}else{//键值可用
			this[this.top] = value;
			this.length++;
			//有值被push，原有序状态被打乱
			this.isOrdered = false;
		}
	}
	//返回自动生成的键值
	return this.top;
};

/**
 * 通过key获取值,不存在返回null
 * @param key
 * @returns
 */
Kvp.prototype.get = function(key){
	if(!isUdfine(key)){
		return this[key];
	}
	return null;
};

/**
 * 移除
 * @returns
 */
Kvp.prototype.remove = function(key){
	if(!isUdfine(this[key])){
		delete this[key];
		this.length--;
		this.isOrdered = false;
		if(this.length <= 0){
			this.top = -1;
			return;
		}
		while(isUdfine(this[this.top])){
			this.top--;
			if(this.top < 0){
				break;
			}
		}
	}
};

/**
 * 出列
 * @returns
 */
Kvp.prototype.pop = function(){
	var res = null;
	this.popKey = null;
	if(!this.isEmpty()){
		res = this[this.top];
		delete this[this.top];
		this.popKey = this.top;
		this.top--;
		this.length--;
		this.isOrdered = false;
		while(!this[this.top] && this.length > 0 && this.top > 0){
			this.top--;
		}
	}
	return res;
};

/**
 * 追加
 * 将参数kvp中的键值对追加给它
 * 同名键值出现，不修改其值
 * @param kvp
 * @returns
 */
Kvp.prototype.append = function(kvp){
	if(kvp && !kvp.isEmpty()){
		for(var k in kvp){
			if(!this.anv && isNull(kvp[k])){
				continue;//当不允许空值的时候，出现空值，跳过
			}
			if(isUdfine(this[k]) && !isUdfine(kvp[k]) 
					&& k != "length" && k != "top" 
					&& k != "popKey" && k != "anv" && k != "isOrdered"){
				this[k] = kvp[k];
				this.length++;
				if(this.top < parseInt(k)){
					this.top = parseInt(k);
				}
			}
		}
		this.isOrdered = false;
	}
};

/**
 * 复制
 * @returns
 */
Kvp.prototype.clone = function(){
	var copy = new Object();
	for(var k in this){
		copy[k] = this[k];
	}
	return copy;
};

/**
 * 置空
 * @returns
 */
Kvp.prototype.setEmpty = function(){
	for(var k in this){
		if(typeof(this[k]) != "function"){
			delete this[k];
		}
	}
	this.top = -1;
	this.length = 0;
};

/**
 * 判断Kvp中的值的prop属性是否已存在值为value的值
 * @param value - 值
 * @param prop - 属性名
 * @returns 存在返回key,不存在返回null
 */
Kvp.prototype.contains = function(value,prop){
	if(!isUdfine(value)){
		var k = 0;
		while(k <= this.top){
			if(!isUdfine(prop)){
				if(!isNull(this[k]) && this[k][prop] == value){
					return k;
				}
			}else{
				if(this[k] == value){
					return k;
				}
			}
			k++;
		}
	}
	return null;
};

/**
 * 构造排序关键字
 * 说明：从Value中取排序关键字
 * 		value值的格式为：
 * 		{"checked":"是否选中",
 * 		 "thumbnail":"缩略图(是元素DIV)",
 * 		 "sequence":"排序关键字"
 * 		}
 * 		只对checked部分进行排序
 * 返回值：返回一个对象
 * 		  {"checked":[],"noCheck":[]}
 * 		  checked数组中的每个个元素都存放key,和排序关键字两部分
 * 		  noCheck数组中的每个元素存放的为key
 * 		  会对checked数组中的对象的sequence进行排序
 * 调用：编辑课件，设置完排序后调用
 * @returns
 */
Kvp.prototype.buildSortKey = function(){
	var i = 0;
	var res = {"checked":[],"noCheck":[]};
	res.checked.push({"key":-1});//哨兵位
	while(i <= this.top){
		if(!isUdfine(this[i])){
			if(this[i].checked){
				res.checked.push({"key":i,"sequence":this[i].sequence});
			}else{
				res.noCheck.push(i);
			}
		}
		i++;
	}
	return res;
};

/**
 * 排序
 * @param sortKey－排序关键字
 * @returns
 */
Kvp.prototype.sort = function(sortKey){
	this.sortKey = this.buildSortKey();
	var high = this.sortKey.checked.length-1;
	quickSort(this.sortKey.checked, 1, high, sortKey);
	this.isOrdered = true;
};

/**
 * 快速排序的一次划分-升序排序
 * @param arr－排序数组
 * 		 arr[0]为哨兵位
 * @param low－底位下标
 * @param high－高位下标
 * @param sortType-排序类型
 * 		  0：按第一个child的value值排序
 * 		  1：按属性sortKey的值排序
 *		  2：按值排序[适用于number类型的数组排序] 
 * @param sortKey-排序关键字
 * 		  说明：根据页面逻辑需要，
 * 		  已将排序关键字改为children的索引
 * 		  因为seqence存放在它的children中
 * 		  修改日期：2013-11-19
 */
function partition(arr,low,high,sortType,sortKey){
	/*arr[0] = arr[parseInt((low+high)/2)];
	arr[parseInt((low+high)/2)] = arr[low];
	arr[low] = arr[0];
	 #、1、2、3、4、5、6、7、8、9
	 5、5、2、3、4、1、6、7、8、9
	 5、1、2、3、4、1、6、7、8、9*/
	var pivot = arr[low];
	var pivotValue = sortType==0?parseInt(pivot.children[sortKey].value):(sortType==1?parseInt(pivot[sortKey]):parseInt(pivot));
	var cmpareValue;
	while(low < high){
		while(low < high && pivotValue < (sortType==0?parseInt(arr[high].children[sortKey].value):(sortType==1?parseInt(arr[high][sortKey]):parseInt(arr[high])))){
			high--;
		}
		if(low < high){
			arr[low] = arr[high];
		}
		while(low < high && pivotValue >= (sortType==0?parseInt(arr[low].children[sortKey].value):(sortType==1?parseInt(arr[low][sortKey]):parseInt(arr[low])))){
			low++;
		}
		if(low < high){
			arr[high] = arr[low];
		}
	}
	arr[low] = pivot;
	return low;
}

/**
 * 快速排序的一次划分-降序排序
 * @param arr－排序数组
 * @param low－底位下标
 * @param high－高位下标
 * @param sortType-排序类型
 * 		  0：按第一个child的value值排序
 * 		  1：按属性sortKey的值排序
 *		  2：按值排序[适用于number类型的数组排序] 
 * @param sortKey-排序关键字
 * 		  说明：根据页面逻辑需要，
 * 		  已将排序关键字改为children的索引
 * 		  因为seqence存放在它的children中
 * 		  修改日期：2013-11-19
 */
function partitionDesc(arr,low,high,sortType,sortKey){
	var pivot = arr[low];
	var pivotValue = sortType==0?parseInt(pivot.children[sortKey].value):(sortType==1?parseInt(pivot[sortKey]):parseInt(pivot));
	var cmpareValue;
	while(low < high){
		while(low < high && pivotValue > (sortType==0?parseInt(arr[high].children[sortKey].value):(sortType==1?parseInt(arr[high][sortKey]):parseInt(arr[high])))){
			high--;
		}
		if(low < high){
			arr[low] = arr[high];
		}
		while(low < high && pivotValue <= (sortType==0?parseInt(arr[low].children[sortKey].value):(sortType==1?parseInt(arr[low][sortKey]):parseInt(arr[low])))){
			low++;
		}
		if(low < high){
			arr[high] = arr[low];
		}
	}
	arr[low] = pivot;
	return low;
}

/**
 * 快速排序
 * @param arr
 * @param low
 * @param high
 * @param sortKey-排序项
 */
function quickSort(arr, low, high, sortKey){
	if(low < high){
		var poverKey = partition(arr, low, high, 0, sortKey);
		quickSort(arr, low, poverKey-1, 0, sortKey);
		quickSort(arr, poverKey+1, high, 0, sortKey);
	}
}

/**
 * 快速排序，支持不同排序类型
 * 		2：按值排序，1：按属性值排序，
 * 		0：按第一个children的value排序
 * @param arr 待排序数组
 * @param low
 * @param high
 * @param sortType-排序类型
 * 		  0：按第一个child的value值排序
 * 		  1：按属性sortKey的值排序
 *		  2：按值排序[适用于number类型的数组排序] 
 * @param sortKey 排序关键字（属性名）
 * @param isAsc 是否为升序排序
 */
function quickSort2(arr, low, high, sortType, sortKey, isAsc){
	if(low < high){
		var poverKey;
		if(isAsc){
			poverKey = partition(arr, low, high, sortType, sortKey);
		}else{
			poverKey = partitionDesc(arr, low, high, sortType, sortKey);
		}
		quickSort2(arr, low, poverKey-1, sortType, sortKey, isAsc);
		quickSort2(arr, poverKey+1, high, sortType, sortKey, isAsc);
	}
}

/**
 * CA部门排序思想
 * 条件：对有序表中的元素进行移位和交换操作
 * 假定有n个元素x(1)，x(2)，…，x(n)，如果用户将其中第a个元素x(a) 指定到第b个位置，则只需要区分两种情况：
 * 1）  如果a<b，也就是把前面的元素移到后面，则先将元素x(a+1)至x(b)各自往前挪1格；
 * 2）  如果a>b，也就是把后面的元素移到前面，则先将元素x(b)至x(a-1)各自往后挪1格。 
 * @param thumbnails - 待排序的数据(有序表)
 * @param seq_a - 原序列
 * @param seq_b - 新序列
 */
function caSort(thumbnails,seq_a,seq_b){
	if(isNn(seq_a) && isNn(seq_b)){
		var tmp = null;
		var i = 0;
		if(seq_a < seq_b){
			tmp = thumbnails.checked[seq_a - 1];
			for(i = seq_a - 1; i < seq_b; i++){
				thumbnails.checked[i] = thumbnails.checked[i+1];
			}
			thumbnails.checked[seq_b - 1] = tmp;
		}else{
			tmp = thumbnails.checked[seq_a - 1];
			for(i = seq_a - 1; i >= seq_b; i--){
				thumbnails.checked[i] = thumbnails.checked[i-1];
			}
			thumbnails.checked[seq_b - 1] = tmp;
		}
	}
}

/**
 * 数组中是否存在指定的值
 * 存在返回数组下标，不存在返回－1
 * @param v － 要查找的值
 * @returns
 */
Array.prototype.contains = function(v){
	for(var i = 0; i < this.length; i++){
		if(this[i] == v){
			return i;
		}
	}
	return -1;
};

/**
 * 查找
 * @param value － 要匹配的值
 * @param type － 查找类型,默认按值查找
 * 				  0＝按值查找
 * 				  1＝按value的children的值查找
 * 				  2＝按value的属性值查找
 * @param item － 查找的项，children的索引或是属性的名
 * @returns － 查找到返回value,查找不到返回null
 */
Array.prototype.find = function(value,type,item){
	switch(type){
	case 1:
		for(var i = 0; i < this.length; i++){
			if(this[i] && this[i].children[item] && this[i].children[item].value == value){
				return this[i];//查找成功
			}
		}
		break;
	case 2:
		for(var i = 0; i < this.length; i++){
			if(this[i] && this[i][item] == value){
				return this[i];//查找成功
			}
		}
		break;
	default:
		for(var i = 0; i < this.length; i++){
			if(this[i] == value){
				return this[i];//查找成功
			}
		}
		break;
	}
	return null;//查找失败
};

/**
 * 从数组中移除一个元素
 * @param index － 被移除的元素的下标
 * @returns 存在，返回被移除的元素,将被移除后的元素前移一位
 * 			否则返回null
 */
Array.prototype.removeByIndex = function(index){
	var e = null;
	if(isNn(index) && index < this.length){
		e = this[index];
		//被移除的所有元素前移
		for(var i = index; i < this.length - 1; i++){
			this[i] = this[i+1];
		}
		this.pop();//去除最后一个空位
	}
	return e;
};

/**
 * 通过value移除
 * @param e － 要移除的元素
 * @returns 存在，则移除，并返回被移除的元素，不存在返回null
 */
Array.prototype.remove = function(e){
	var index = this.contains(e);
	if(index > -1){
		return this.removeByIndex(index);
	}
	return null;
};

/**
 * 在第index号元素之后插入一个元素,不允许插入空值
 * @param index － 插入的位置（i=0,则插入的元素在第一位，i=1，则插入的元素在第二位）
 * @param e － 要插入的元素
 * @returns
 */
Array.prototype.insert = function(index,e){
	if(isNn(index) && index <= this.length && !isNull(e)){
		this.push(null);
		for(var i = this.length - 1; i >= index; i--){
			this[i] = this[i-1];
		}
		this[index] = e;
	}
};

/**
 * 如果文字过长，将省略显示
 * @param words
 * @param len ：指定len的长度后的部分，省略号替代，
 * 				len表示汉字的个数，两个字符算一个汉字
 */
function omitWords(words,len){
	if(typeof(words) == "string"){
		index = 0;
		var code = 0;
		for(var i = 0; i < words.length; i++){
			code = words.charCodeAt(i);
			if(code >= 0 && code <= 128){
				index += 0.5;
			}else{
				index += 1;
			}
			if(index == len){
				return words.substring(0,i+1)+"...";
			}else if(index > len){
				return words.substring(0,i)+"...";
			}
		}
	}
	return words;
}

/**
 * 根据文件名判断是否为图片
 * 支持图片格式为：
 * 				.jpg,.bmp,.tiff,
 * 				.gif,.pcx,.tga,
 * 				.exif,.fpx,.svg,
 * 				.psd,.cdr,.pcd,
 * 				.dxf,.ufo,.eps,
 * 				.ai,.raw,.png.jpeg
 * （严格来说这种方法是不对的，
 * 	但根据他们的需要，所以这样判断）
 * @param name
 */
function isPicture(name){
	/*.jpg,.bmp,.tiff,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.png,.jpeg*/
	if(typeof(name) == "string"){
		var sections = name.split(".");
		var regExp = /^[j|J][p|P][g|G]|[j|J][p|P][e|E][g|G]|[p|P][n|N][g|G]|[g|G][i|I][f|F]|[b|B][m|M][p|P]|[t|T][i|I][f|F][f|F]|[p|P][c|C][x|X]|[t|T][g|G][a|A]|[e|E][x|X][i|I][f|F]|[f|F][p|P][x|X]|[s|S][v|V][g|G]|[p|P][s|S][d|D]|[c|C][d|D][r|R]|[p|P][c|C][d|D]|[d|D][x|X][f|F]|[u|U][f|F][o|O]|[e|E][p|P][s|S]|[a|A][i|I]|[r|R][a|A][w|W]$/;
		return regExp.test(sections[sections.length-1]);
	}
	return false;
}

/**
 * 所选的文件是否全为图片
 * Is filepicker all picture
 * @param filePicker - 文件选择控件
 * return:
 * 		 -1:没有选择任何文件
 * 		  0:选择的文件格式不正确
 * 		  1:选择的所有文件格式正确
 */
function isFpaPic(filePicker){
	if(filePicker && filePicker.files){
		var fileNum = filePicker.files.length;
		for(var i = 0; i < fileNum; i++){
			if(!isPicture(filePicker.files[i].name)){
				return 0;//如果返回0，提示请选择文件格式不对
			}
		}
		return 1;//格式正确
	}else{
		return -1;//如果返回-1，提示请选择文件
	}
}

/**
 * 获取元素在页面中的绝对坐标
 * 
 * @param e － 要获取的元素
 * return:返回此元素的绝对坐标
 * 		  是一个数组[left,top]
 */
function getAbsPoint(e){
	var left = e.offsetLeft;
	var top = e.offsetTop;
    while(e=e.offsetParent){
       left += e.offsetLeft; 
       top += e.offsetTop;
    }
    return [left,top];
}

/**
 * 添加遮罩层
 */
function addMaskLayer(){
	if(!isMasklayerOn()){
		if(!window.masklayer){
			var maskLayer = document.createElement("DIV");
			maskLayer.className = "masklayer";
			window.masklayer = {"layer":maskLayer};
		}
		document.body.appendChild(window.masklayer["layer"]);
		window.masklayer.isOn = true;
	}
}

/**
 * 移除遮罩层
 */
function rmvMaskLayer(){
	if(window.masklayer){
		document.body.removeChild(window.masklayer["layer"]);
		window.masklayer.isOn = false;
	}
}

/**
 * 判断遮罩层是否存在
 * @returns {Boolean}
 */
function isMasklayerOn(){
	if(window.masklayer && window.masklayer.isOn){
		return true;
	}
	return false;
}

/**
 * 阻止事件冒泡
 * @param e 事件源
 */
function stopBubble(e){
	if(e && e.stopPropagation){
		//不再派发事件
		e.stopPropagation();
	}else{
		window.event.cancelBubble = true;
	}
}

/**
 * 初始化表格的高度
 * @param div (Div或DIV的ID)
 * @param obligateBottom 底部预留的高度
 */
function initDivHeight(div,obligateBottom){
	div = $$(div);
	var top = getAbsPoint(div)[1];
	//对于window.innerHeight，在IE8浏览器中无此属性，故此属性不适合在IE8及以下版本中使用
	if(window.innerHeight){
		div.style.height = (window.innerHeight - top - obligateBottom) + "px";
	}else{
		div.style.height = (window.screen.height - window.screenTop - top - obligateBottom) + "px";
	}
	if(document.all){
		div.style.height = div.offsetHeight - 70 + "px";
	}
}
var func = null;
/**
 * 删除提示对话框
 * @param msg
 * @param rmkMsg
 * @param callBack
 * 		  :回调函数，点击确定的时候，要执行的操作
 */
function delConfirm(msg, rmkMsg, callBack){
	var html = [];
	html.push("<div style=\"width:453px;height:257px;position:relative;background:url(images/del_dialog_bg.png);z-index:101;\">");
		html.push("<div onclick=\"closeDelDia();\" style=\"width:16px;height:16px;position:absolute;left:433px;top:9px;cursor:pointer;\">&nbsp;</div>");
		html.push("<div style=\"width:333px;height:124px;position:absolute;left:104px;top:70px;\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" height=\"100%\">");
			html.push("<tr style=\"color:#818181;font-size:12px;\">");
				html.push("<td align=\"left\" valign=\"middle\" style=\"line-height:23px;\">");
				html.push("<span style=\"font-size:16px;font-weight:bold;color:828282;\">"+msg+"</span>");
				if(!isUdfine(rmkMsg)){
					html.push("<br/><span style=\"color:#828282;font-size:14px;\">("+rmkMsg+")</span>");
				}
				html.push("</td>");
			html.push("</tr>");
		html.push("</table></div>");
		html.push("<a hideFocus href=\"#\" class=\"cw_edit_save\" style=\"position:absolute;left:304px;top:216px;\" onclick=\"delDiaOkay()\"></a>");
		html.push("<a hideFocus href=\"#\" class=\"cw_edit_cancel\" style=\"position:absolute;left:382px;top:216px;\" onclick=\"closeDelDia();\"></a>");
	html.push("</div>");
	if(callBack){
		func = callBack;
	}
	addMaskLayer();//添加遮罩层
	var delLayer = document.createElement("DIV");
	delLayer.id = "del_confirm_layer";
	delLayer.style.position = "absolute";
	delLayer.style.width = "453px";
	delLayer.style.height = "257px";
	delLayer.style.left = (window.screen.width - 454)/2 + "px";
	delLayer.style.top = "200px";
	delLayer.innerHTML = html.join("");
	document.body.appendChild(delLayer);
};
/**
 * 关闭删除提示对话框
 */
function closeDelDia(){
	var delLayer = $("del_confirm_layer");
	if(delLayer){
		document.body.removeChild(delLayer);
	}
	rmvMaskLayer();
}
/**
 * 删除对话框－确定按钮
 */
function delDiaOkay(){
	closeDelDia();
	if(func){
		func();
	}
}

/**
 * 字符串时间转换成date类型
 * @param s － 时间字符串
 * 		  格式：yyyy-mm-dd hh:mm:ss
 * 		  hh:mm:ss可全部或部分缺省
 * @returns
 */
function strToDate(s){
	if(!isNull(s)){
		var dt = s.split(" ");
		var d = dt[0]?dt[0].split("-"):[];
		var t = dt[1]?dt[1].split(":"):[];
		if(d.length == 3){
			var exp = /^\d+$/;
			var date = [];
			for(var i = 0; i < d.length; i++){
				if(!isNull(d[i]) && exp.test(d[i])){
					date.push(parseInt(d[i]));
				}else{
					return null;
				}
			}
			var time = [];
			for(var i = 0; i < 3; i++){
				if(!isNull(t[i]) && exp.test(t[i]) && i < t.length){
					time.push(parseInt(t[i]));
				}else{
					time.push(0);
				}
			}
			return new Date(date[0],date[1]-1,date[2],time[0],time[1],time[2]);
		}
		return null;
	}
	return null;
}

/**
 * 
 * @param intervalDay - 与当前时间间隔的天数
 * 					参数不指定，默认为当天
 * @param precision - 时间精度
 * 			       如：yyyy-mm-dd,precision=8
 * 					  yyyy-mm-dd hh:mm:ss = 14
 * 					  precision >= 8 && precision <= 17
 * 				   参数不指定，默认精度到秒，即yyyy-mm-dd hh:mm:ss ms
 * return 返回时间字符串
 * 			  返回格式：yyyy-mm-dd hh:mm:ss
 */
function getDate(intervalDay, precision){
	if(isUdfine(intervalDay)){
		intervalDay = 0;
	}
	if(isUdfine(precision)){
		precision = 15;
	}
	var date = null;
	try{
		date = new Date(new Date().getTime()+(intervalDay*24*60*60*1000));
	}catch(e){
		return "";
	}
	var yyyy = strCover(date.getFullYear(), 4, "0");
	var dd = strCover(date.getDate(), 2, "0");
	var mm = strCover(date.getMonth()+1, 2, "0");
	if(precision <= 8){
		return yyyy+"-"+mm+"-"+dd;
	}else if(precision < 12){
		return yyyy+"-"+mm+"-"+dd + " " + strCover(date.getHours(), 2, "0");
	}else if(precision < 14){
		return yyyy+"-"+mm+"-"+dd + " " 
			+ strCover(date.getHours(), 2, "0") + ":" 
			+ strCover(date.getMinutes(), 2, "0");
	}else if(precision < 17){
		return yyyy+"-"+mm+"-"+dd + " " + strCover(date.getHours(), 2, "0") 
				+ ":" + strCover(date.getMinutes(), 2, "0") + ":" 
				+ strCover(date.getSeconds(), 2, "0");
	}else{
		return yyyy+"-"+mm+"-"+dd + " " + strCover(date.getHours(), 2, "0") 
				+ ":" + strCover(date.getMinutes(), 2, "0") + ":" 
				+ strCover(date.getSeconds(), 2, "0") + " " 
				+ strCover(date.getMilliseconds(), 3, "0");
	}
}

/**
 * 
 * @param intervalMinute - 与当前时间间隔的分钟
 * 					参数不指定，默认为当天
 * @param precision - 时间精度
 * 			       如：yyyy-mm-dd,precision=8
 * 					  yyyy-mm-dd hh:mm:ss = 14
 * 					  precision >= 8 && precision <= 17
 * 				   参数不指定，默认精度到秒，即yyyy-mm-dd hh:mm:ss ms
 * return 返回时间字符串
 * 			  返回格式：yyyy-mm-dd hh:mm:ss
 */
function getDateM(intervalMinute, precision){
	if(isUdfine(intervalMinute)){
		intervalMinute = 0;
	}
	if(isUdfine(precision)){
		precision = 15;
	}
	var date = null;
	try{
		date = new Date(new Date().getTime()+(intervalMinute*60*1000));
	}catch(e){
		return "";
	}
	var yyyy = strCover(date.getFullYear(), 4, "0");
	var dd = strCover(date.getDate(), 2, "0");
	var mm = strCover(date.getMonth()+1, 2, "0");
	if(precision <= 8){
		return yyyy+"-"+mm+"-"+dd;
	}else if(precision < 12){
		return yyyy+"-"+mm+"-"+dd + " " + strCover(date.getHours(), 2, "0");
	}else if(precision < 14){
		return yyyy+"-"+mm+"-"+dd + " " 
			+ strCover(date.getHours(), 2, "0") + ":" 
			+ strCover(date.getMinutes(), 2, "0");
	}else if(precision < 17){
		return yyyy+"-"+mm+"-"+dd + " " + strCover(date.getHours(), 2, "0") 
				+ ":" + strCover(date.getMinutes(), 2, "0") + ":" 
				+ strCover(date.getSeconds(), 2, "0");
	}else{
		return yyyy+"-"+mm+"-"+dd + " " + strCover(date.getHours(), 2, "0") 
				+ ":" + strCover(date.getMinutes(), 2, "0") + ":" 
				+ strCover(date.getSeconds(), 2, "0") + " " 
				+ strCover(date.getMilliseconds(), 3, "0");
	}
}

/**
 * 字符串补位
 * @param str－要补位的字符串
 * @param len－补位后的长度
 * @param c－补位用的字符
 */
function strCover(str,len,c){
	var strlen = (str+"").length;
	if(strlen < len){
		for(;strlen<len;strlen++){
			str=c+str;
		}
	}
	return str;
}

/**
 * 判断浏览器的类型
 * @returns number
 * {0:示知，1：IE浏览器，2：firefox浏览器，3:chrome，4、opera，5、safari}
 */
function isBrowser(){
	var ret = 0;
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
     
    if(Sys.ie){//Js判断为IE浏览器
        ret = 1;
    }
    if(Sys.firefox){//Js判断为火狐(firefox)浏览器
        ret = 2;
    }
    if(Sys.chrome){//Js判断为谷歌chrome浏览器
        ret = 3;
    }
    if(Sys.opera){//Js判断为opera浏览器
        ret = 4;
    }
    if(Sys.safari){//Js判断为苹果safari浏览器
        ret = 5;
    }
    return ret;
}

