//启动页面：MyPage.navToShouZhongGuanLi();
var system_user_management= new Object();
system_user_management.init = function () {
  //this.pre_register_one_user()//模拟程序：预注册一个用户，供后续程序用。
  this.draw_page_elements();
};
system_user_management.pre_register_one_user=function() {
};

system_user_management.draw_page_elements = function () {
  this.draw_page_elements_x_1()//画上部分的所有UI.
};

system_user_management.draw_page_elements_x_1 = function () {
  var tab_switch1_container=jQuery("#adv_shouzhong_manage_topContainer_tabSwitch");
  var tab_switch1=new adv_tabs_switch({
    container:tab_switch1_container,
    width:["95px","95px","95px"],
    tab_words:["用户管理","用户组管理","地域管理"],
    callback:this.tab_switch_shouzhong_manage
  })
      jQuery("#panel_container_adv_page_main").append("<div class=\"panel_page_list_container adv_full_body_huge_div\" style=\"display:none\" id=\"adv_shouzhong_manage_table_Conainer\">用户列表</div><div class=\"panel_page_list_container adv_full_body_huge_div\" id=\"adv_shouzhong_user_group_manage\" style=\"display:none\">用户组列表</div><div class=\"panel_page_list_container adv_full_body_huge_div\" id=\"adv_shouzhong_field_manage\" style=\"display:none\">地域列表</div>")
      var this_height=jQuery("#adv_shouzhong_manage_table_Conainer").height()+"px";
      jQuery("#adv_shouzhong_manage_table_Conainer").css("line-height",this_height);
      jQuery("#adv_shouzhong_user_group_manage").css("line-height",this_height);
      jQuery("#adv_shouzhong_field_manage").css("line-height",this_height);
      jQuery("#adv_shouzhong_manage_table_Conainer").css("display","block");
}

system_user_management.tab_switch_shouzhong_manage= function () {
  var this_tab_unit=jQuery("#adv_shouzhong_manage_topContainer_tabSwitch").find(".adv_tab_unit");
  jQuery("#adv_shouzhong_manage_table_Conainer").css("display","none");
  jQuery("#adv_shouzhong_user_group_manage").css("display","none");
  jQuery("#adv_shouzhong_field_manage").css("display","none");

  jQuery("#adv_shouzhong_import_user_button").css("display","none");
  jQuery("#adv_shouzhong_new_user_group_button").css("display","none");
  jQuery("#adv_shouzhong_new_field_button").css("display","none");

  if(jQuery(this_tab_unit[0]).attr("name")=="focused_div")
  {
    jQuery("#adv_shouzhong_manage_table_Conainer").css("display","block");
    jQuery("#adv_shouzhong_import_user_button").css("display","block");
  }
  else if(jQuery(this_tab_unit[1]).attr("name")=="focused_div")
  {
    jQuery("#adv_shouzhong_user_group_manage").css("display","block");
    jQuery("#adv_shouzhong_new_user_group_button").css("display","block");
  }
  else{
    jQuery("#adv_shouzhong_field_manage").css("display","block");
    jQuery("#adv_shouzhong_new_field_button").css("display","block");
  }
}







//页面初始化入口。
system_user_management.init();