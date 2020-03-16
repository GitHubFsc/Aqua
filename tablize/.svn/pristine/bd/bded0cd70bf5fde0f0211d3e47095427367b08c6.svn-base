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
function Spliter(objName,container,pageSize,callBack){
	this.objName = objName;
	this.totalPage = 1;//初始总页数
	this.spliter = [1,2,3,4,5,6,7,8,9,10];
	this.curPage = 1;
	this.PAGE_SIZE = 20;//默认页大小为20条数据
	this.container = container;
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
Spliter.prototype.initSpliter = function(){
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
Spliter.prototype.drawSpliter = function(si){
	var html = [];
	html.push("<table width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">");
		html.push("<tr>");
			html.push("<td align=\"center\" valign=\"middle\">");
				html.push("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">");
				html.push("<tr><td>");
				html.push("<input type=\"button\" class=\"split_page_prev_btn\" onclick=\""+this.objName+".previousPage();\"/>");
				html.push("&nbsp;&nbsp;");
				if(this.spliter.length > 0){
					var len = this.spliter.length;
					for(var i = 0; i < len && this.spliter[i] != ""; i++){
						if(this.spliter[i] == si){
							html.push("<input type=\"button\" value=\""+this.spliter[i]+"\" class=\"split_page_btn_clicked\" onclick=\""+this.objName+".pagerClick(this);\"/>");
						}else{
							html.push("<input type=\"button\" value=\""+this.spliter[i]+"\" class=\"split_page_btn\" onclick=\""+this.objName+".pagerClick(this);\"/>");
						}
						html.push("&nbsp;&nbsp;");
						if(i == 7 && (this.spliter[8]-this.spliter[7] > 1)){
							html.push("<span style=\"color:#cccccc;\">…</span>");
							html.push("&nbsp;&nbsp;");
						}
					}
				}
				html.push("<input type=\"button\" class=\"split_page_next_btn\" onclick=\""+this.objName+".nextPage();\"/>");
				html.push("</td><td style=\"color:#626668;\">");
				//跳转到指定页
				html.push("&nbsp;&nbsp;跳转到第&nbsp;<input type=\"text\" id=\"num_to_page\" style=\"width:40px;border:1px solid #626668;\" onkeyup=\""+this.objName+".jumpTo(event)\"/>&nbsp;页");
				html.push("</td><td>");
				html.push("&nbsp;&nbsp;<img src=\"images/tp_spliter_to_num_ok.png\" style=\"width:45px;height:27px;cursor:pointer;\" onclick=\""+this.objName+".jumpTo()\"/>");
				html.push("</td></tr></table>");
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
Spliter.prototype.topage = function(ncPage,reInit){
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
Spliter.prototype.reCalSpliter = function(){
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
Spliter.prototype.pagerClick = function(obj){
	this.topage(parseInt(obj.value));
	this.cur = obj;
};

/**
 * 前一页
 */
Spliter.prototype.previousPage = function(){
	if(this.curPage > 1){
		this.curPage--;
		this.topage(this.curPage);
	}
};
/**
 * 下一页
 */
Spliter.prototype.nextPage = function(){
	if(this.curPage < this.totalPage){
		this.curPage++;
		this.topage(this.curPage);
	}
};

/**
 * 跳转到输入页
 */
Spliter.prototype.jumpTo = function(e){
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
