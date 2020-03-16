function adv_tabs_switch(obj){
  //console.log(obj_);
  var obj_=obj;
  if(obj_){
    this.container= obj_.container;
    this.width= obj_.width;
    this.id=obj_.id;
    this.tab_words=obj_.tab_words;
    this.callback=obj_.callback;
    this.border_radius_in_outer_container=obj.border_radius_in_outer_container?obj.border_radius_in_outer_container:""
  }
  //console.log(this.callback);
  this.draw_tabs_switch();
}

adv_tabs_switch.prototype.draw_tabs_switch=function(){
  //console.log(this.callback);
  jQuery(this.container).css("height", "36px");
  if(this.border_radius_in_outer_container=="")
  {
      if (this.width == "default") {
        //console.log(1);
        var half_tab_width = "112px";
        for (var a = 0; a < this.tab_words.length; a++) {
          jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>");
          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({"background-image": "url('image/tab_white_shadow.png')", "color": "#494b58", "border": "1px #d1d1d1 solid"});
            jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({"background-color": "#75b8d6", "color": "#ffffff", "border": "1px #4488a7 solid"})
            jQuery(this.container).children("div").eq(a).attr("name","focused_div")
          }
        }
      }
      else{
        //console.log(1);
        for (var a = 0; a < this.tab_words.length; a++) {
          jQuery(this.container).append("<div class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>");
          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({"background-image": "url('image/tab_white_shadow.png')", "color": "#494b58", "border": "1px #d1d1d1 solid"});
            jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({"background-color": "#75b8d6", "color": "#ffffff", "border": "1px #4488a7 solid"});
            jQuery(this.container).children("div").eq(a).attr("name","focused_div")
          }
        }
      }
  }
  else{
    if (this.width == "default") {
      var half_tab_width = "112px";
      for (var a = 0; a < this.tab_words.length; a++) {
        if(a==0)
        {jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"border-top-left-radius:"+this.border_radius_in_outer_container+";border-bottom-left-radius:"+this.border_radius_in_outer_container+";line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>")}
        else if(a==this.tab_words.length-1)
        {jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"border-top-right-radius:"+this.border_radius_in_outer_container+";border-bottom-right-radius:"+this.border_radius_in_outer_container+";line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>")}
        else{jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + half_tab_width + "\">" + this.tab_words[a] + "</div>")}


        if (a != 0) {
          jQuery(this.container).children("div").eq(a).css({"background-image": "url('image/tab_white_shadow.png')", "color": "#494b58", "border": "1px #d1d1d1 solid"});
          jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
        }
        else {
          jQuery(this.container).children("div").eq(a).css({"background-color": "#75b8d6", "color": "#ffffff", "border": "1px #4488a7 solid"})
          jQuery(this.container).children("div").eq(a).attr("name","focused_div")
        }
      }
    }
    else{
      //console.log(1);
      //console.log(this.width);
      for (var a = 0; a < this.tab_words.length; a++) {
        if(a==0)
        {jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"border-top-left-radius:"+this.border_radius_in_outer_container+";border-bottom-left-radius:"+this.border_radius_in_outer_container+";line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>")}
        else if(a==this.tab_words.length-1)
        {jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"border-top-right-radius:"+this.border_radius_in_outer_container+";border-bottom-right-radius:"+this.border_radius_in_outer_container+";line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>")}
        else{jQuery(this.container).append("<div id=\"switch_tab"+a+"\" class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>")}


        if (a != 0) {
          jQuery(this.container).children("div").eq(a).css({"background-image": "url('image/tab_white_shadow.png')", "color": "#494b58", "border": "1px #d1d1d1 solid"});
          jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
        }
        else {
          jQuery(this.container).children("div").eq(a).css({"background-color": "#75b8d6", "color": "#ffffff", "border": "1px #4488a7 solid"});
          jQuery(this.container).children("div").eq(a).attr("name","focused_div")
        }
      }
    }
  }

    var that=this;
    jQuery(".adv_tab_unit").each(function(){
      jQuery(this).click(function(){
        that.clickTab(this);
      });
    });


}

adv_tabs_switch.prototype.clickTab=function(this_tab_unit){
  //console.log(1);
  var original_color=this_tab_unit.style.color;
  if( (original_color!=="75b8d6")||(original_color.indexOf("rgb(255, 255, 255)")==-1) )
  {
    jQuery(this_tab_unit).css("background-image", "");
    jQuery(this_tab_unit).css({"background-color":"#75b8d6" ,"color": "#ffffff", "border": "1px #4488a7 solid"});
    jQuery(this_tab_unit).attr("name","focused_div");
    jQuery(this_tab_unit).siblings().css({"background-image": "url('image/tab_white_shadow.png')", "color": "#494b58", "border": "1px #d1d1d1 solid"});
    jQuery(this_tab_unit).siblings().attr("name","unfocused_div");
  }
  //console.log(1);
  if(this.callback)
  {this.callback.call()};
}


/*
function adv_tabs_switch(obj){
  var confObj = obj;
  if(confObj){
    this.container= confObj.container;
    this.words_on_tab1=confObj.words_on_tab1;
    this.words_on_tab2=confObj.words_on_tab2;
    this.tab1_display=confObj.tab1_display;
    this.tab2_display=confObj.tab2_display;
  }
  this.init();
}



 tabs_switch_whiteAndShadow_radius.prototype.init = function(){
   var tab1_display=this.tab1_display;
   var tab2_display=this.tab2_display;
  jQuery(this.container).css({"line-height":jQuery(this.container).height()+"px","border-radius":"5px","background-color":"#ededed","border":"1px #c2c2c2 solid"});
  jQuery(this.container).append("<span onclick=\"tabs_switch_white_click_switch_ColorAndContent(this,"+tab1_display+","+tab2_display+")\" class=\"tabs_switch_radiusBorder_Part\" style=\"background-color:#fcfcfc;border-right:1px #c2c2c2 solid;\">"+this.words_on_tab1+"</span><span onclick=\"tabs_switch_white_click_switch_ColorAndContent(this,"+tab1_display+","+tab2_display+")\" class=\"tabs_switch_radiusBorder_Part\">"+this.words_on_tab2+"</span>")
}

tabs_switch_white_click_switch_ColorAndContent=function(obj,tab1_display,tab2_display){
  jQuery(obj).siblings().css("background-color","#ededed");
  jQuery(obj).css("background-color","#fcfcfc");
  if((jQuery(obj).index())==0)
  {
    jQuery(tab2_display).css("display","none");
    jQuery(tab1_display).css("display","block");
  }
  else{
    jQuery(tab2_display).css("display","block");
    jQuery(tab1_display).css("display","none");
  }
}
*/