/**
 * 分页面控制类
 * @author qiang.huo
 * @date 2013-12-27
 * @param objName 实例名
 * @param container 分页控制DIV
 * @param pageSize 页大小
 * @param callBack 回调函数
 * 		回调函数描述：
 * 			回高函数-parameters
 *				@param1 pagenumber,当前页号
 *				@param2 pagesize ,页大小
 * 			回调函数－return 
 * 				返回总页面数，如果不返回，则总页数据以先前的总页数不变
 * @returns {Spliter}
*/
function SpliterTwo(objName,container,pageSize,callBack,theme){
	this.objName = objName;
	this.totalPage = 1;//初始总页数
	this.spliter = [1,2,3,4,5,6,7,8,9,10];
	this.curPage = 1;
	this.PAGE_SIZE = 20;//默认页大小为20条数据
	this.container = container;
	this.theme=theme;//初始化皮肤
	if(pageSize){
		this.PAGE_SIZE = pageSize;
	}
	this.page = callBack;
	//调用回调函数，获取信息
	var t = this.page(this.curPage,this.PAGE_SIZE);
	if(t)this.totalPage = t;
	this.initSpliter();//初始分页按钮号
	this.drawSpliter(1);//绘制分页按钮
}

/**
 * 初始化分页信息
 */
SpliterTwo.prototype.initSpliter = function(){
	if(this.totalPage <= 10){
		for(var i = 0; i < 10; i++){
			if(i < this.totalPage)
				this.spliter[i] = (i + 1);
			else
				this.spliter[i] = "";
		}
	}else{
		for(var i = 0; i < 8; i++){
			this.spliter[i] = (i+1);
		}
		this.spliter[8] = this.totalPage-1;
		this.spliter[9] = this.totalPage;
	}
};

/**
 * 动态画分页栏
 * @si:当前点击的页，置蓝色背景
 */
SpliterTwo.prototype.drawSpliter = function(si){
	var html = [];
	html.push("<table width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">");
		html.push("<tr>");
			html.push("<td align=\"center\" valign=\"middle\">");
				html.push("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"float:right;margin-right:25px;font-size: 14px;\">");
				html.push("<tr><td style=\"color:#626668;\">");
				//跳转到指定页
				html.push("&nbsp;&nbsp;跳转到第&nbsp;<input type=\"text\" id=\"num_to_page\" style=\"width:56px;height:25px;border:1px solid #cbcbcb;\" onkeyup=\""+this.objName+".jumpTo(event)\"/>&nbsp;页");
				html.push("</td>");
				html.push("<td style=\"color:#626668;\">&nbsp;&nbsp;&nbsp;&nbsp;当前第<a id=\"curpage\" style=\"width:40px;\">"+this.curPage+"</a>页，共<a id=\"totalpage\">"+this.totalPage+"</a>页</td>");
				html.push("<td valign=\"middle\">");
				//上一页
				html.push("<input type=\"button\" class=\"split_page_prev_btn"+(this.theme!=null?"_"+this.theme:"")+"\" onclick=\""+this.objName+".previousPage();\"/>");
				//下一页
				html.push("<input type=\"button\" class=\"split_page_next_btn"+(this.theme!=null?"_"+this.theme:"")+"\" onclick=\""+this.objName+".nextPage();\"/>");
				html.push("</td>");
				html.push("</tr></table>");
			html.push("</td>");
		html.push("</tr>");
	html.push("</table>");
	$(this.container).innerHTML = html.join("");
};


/**
 * 转到指定页
 * @param ncPage 跳转到的页码
 * @param reInit 是否需要重新初始化分页信息
 */
SpliterTwo.prototype.topage = function(ncPage,reInit){
	if(!/^[0-9]+$/.test(ncPage+"")){
		alert("请输入正整数");
		return;
	}
	if((ncPage > 0 && ncPage <= this.totalPage)){
		this.curPage = ncPage;
		this.startIndex = (this.curPage - 1) * this.PAGE_SIZE + 1;
		this.endIndex = this.curPage * this.PAGE_SIZE;
		/**重绘数据*/
		var total = this.page(this.curPage,this.PAGE_SIZE);
		if(isNn(total)){
			this.totalPage = total;
		}
		/**重绘分页信息*/
		if(reInit){
			this.initSpliter();
		}else{
			this.reCalSpliter();
		}
		this.drawSpliter(this.curPage);
	}else{
		alert("请输入页码范围在【1~"+this.totalPage+"】之间！");
		$("num_to_page").select();
	}
};

/**
 *在原有基础上重算分页面信息
 *页号动态增减
 */
SpliterTwo.prototype.reCalSpliter = function(){
	if(this.totalPage > 10){
		var interval = this.curPage - this.spliter[5];
		var si = 0;
		if(interval > 0){
			if(this.spliter[7] + interval >= this.spliter[8]){
				interval = this.spliter[8] - this.spliter[7]-1;
			}
		}else{
			if(this.spliter[0] + interval < 1){
				interval = 1 - this.spliter[0];
			}
		}
		for(var i = 0; i < 8; i++){
			this.spliter[i] += interval;
		}
	}
};

/**
 * 响应分页按钮
 */
SpliterTwo.prototype.pagerClick = function(obj){
	this.topage(parseInt(obj.value));
	this.cur = obj;
};

/**
 * 前一页
 */
SpliterTwo.prototype.previousPage = function(){
	if(this.curPage > 1){
		this.curPage--;
		this.topage(this.curPage);
	}
};
/**
 * 下一页
 */
SpliterTwo.prototype.nextPage = function(){
	if(this.curPage < this.totalPage){
		this.curPage++;
		this.topage(this.curPage);
	}
};

/**
 * 跳转到输入页
 */
SpliterTwo.prototype.jumpTo = function(e){
	var t = $("num_to_page").value;
	if(t != ""){
		var page = parseInt(t);
		if(e){
			if(e.keyCode == 13){
				this.topage(page);
			}
		}else{
			this.topage(page);
		}
		$("num_to_page").value = t;
	}
};
