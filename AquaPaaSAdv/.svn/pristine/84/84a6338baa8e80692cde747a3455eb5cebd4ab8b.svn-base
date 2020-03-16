function tabs_switch_component(obj){
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

tabs_switch_component.prototype.draw_tabs_switch=function(){
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
            jQuery(this.container).children("div").eq(a).css({ "color": "#797979", "border": "1px #d1d1d1 solid"});
            jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({"background-color": "#aae7fb", "color": "#ffffff", "border": "1px #83e0ff solid"})
            jQuery(this.container).children("div").eq(a).attr("name","focused_div")
          }
        }
      }
      else{
        //console.log(1);
        for (var a = 0; a < this.tab_words.length; a++) {
          jQuery(this.container).append("<div class=\"adv_tab_unit\" style=\"line-height:33px;font-weight:bold;font-size:16px;width:" + this.width[a] + "\">" + this.tab_words[a] + "</div>");
          if (a != 0) {
            jQuery(this.container).children("div").eq(a).css({ "color": "#797979", "border": "1px #d1d1d1 solid"});
            jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
          }
          else {
            jQuery(this.container).children("div").eq(a).css({"background-color": "#aae7fb", "color": "#ffffff", "border": "1px #83e0ff solid"});
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
          jQuery(this.container).children("div").eq(a).css({ "color": "#797979", "border": "1px #d1d1d1 solid"});
          jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
        }
        else {
          jQuery(this.container).children("div").eq(a).css({"background-color": "#aae7fb", "color": "#ffffff", "border": "1px #83e0ff solid"})
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
          jQuery(this.container).children("div").eq(a).css({ "color": "#797979", "border": "1px #d1d1d1 solid"});
          jQuery(this.container).children("div").eq(a).attr("name","unfocused_div")
        }
        else {
          jQuery(this.container).children("div").eq(a).css({"background-color": "#aae7fb", "color": "#ffffff", "border": "1px #83e0ff solid"});
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

tabs_switch_component.prototype.clickTab=function(this_tab_unit){
  //console.log(1);
  var original_color=this_tab_unit.style.color;
  if( (original_color!=="#aae7fb")||(original_color.indexOf("rgb(170, 231, 251)")==-1) )
  {
    jQuery(this_tab_unit).css({"background-color":"#aae7fb" ,"color": "#ffffff", "border": "1px #83e0ff solid"});
    jQuery(this_tab_unit).attr("name","focused_div");
    jQuery(this_tab_unit).siblings().css({ "color": "#797979", "border": "1px #d1d1d1 solid","background-color":""});
    jQuery(this_tab_unit).siblings().attr("name","unfocused_div");
  }
  //console.log(1);
  if(this.callback)
  {this.callback.call()};
}

