(function ($, Dialog, context) {
  const _content = "#add_site";
  let isEdit = false,
    ad_id,
    user_id,
    openLimit = true,
    openTeminalQuota = true,
    openTeminalPeriodQuota = true,
    Data = {
      needLimit: 1,
      total_quota: -1,
      teminal_quota: -1,
      teminal_period_quota: "-1"
    };
  var afterDrawn = () => {
    if (AdvSystemType == 'solo') {
      $('#add_site .title_content').html(i18n('SUCAI_LIMITSITE_INFO_SOLO'))
    }
    bindEvents();
    loadData();
  }
  var loadData = () => {
    $(_content + " #total_quota").val(Data.total_quota || 0);
    $(_content + " #teminal_counts").val(Data.teminal_quota ? Data.teminal_quota : 0);

    if(Data.teminal_period_quota != "-1") {
      var period_array = /^(\d{0,}):(\d{0,})$/g.exec(Data.teminal_period_quota||':');
      $(_content + " #teminal_period_time").val(period_array[1] || 0);
      $(_content + " #teminal_period_count").val(period_array[2] || 0);
    }
    $(_content + " .radio1.needlimit").eq(!!Data.needLimit ? 0 : 1).addClass("focus").siblings().removeClass("focus");
    $(_content + " .radio1.teminalcountset").eq(Data.teminal_quota == -1 ? 1 : 0).addClass("focus").siblings().removeClass("focus");
    $(_content + " .radio1.teminalperiodset").eq(Data.teminal_period_quota == "-1" ? 1 : 0).addClass("focus").siblings().removeClass("focus");
    openLimit = Data.needLimit ? true : false;
    openTeminalQuota = Data.teminal_quota == -1 ? false : true;
    openTeminalPeriodQuota = Data.teminal_period_quota == "-1" ? false : true;
  };
  var bindEvents = function () {
    if(isEdit) {
      //是否限次
      $(_content + " .radio1.needlimit").bind("click", (e) => {
        let el = e.target;
        $(el).addClass("focus").siblings(".radio1").removeClass("focus");
        let index = $(el).index(_content + " .radio1.needlimit");
        openLimit = index == 0 ? true : false;
        Data.needLimit = parseInt($(el).data("value"));
      });
      //wether to enable teminalquota
      $(_content + " .radio1.teminalcountset").bind("click", (e) => {
        let el = e.target;
        $(el).addClass("focus").siblings(".radio1").removeClass("focus");
        let index = $(el).index(_content + " .radio1.teminalcountset");
        if(index == 1) {
          openTeminalQuota = false;
          Data.teminal_quota = -1
        } else {
          openTeminalQuota = true;
          Data.teminal_quota = parseInt($(_content + " #teminal_counts").val())
        }
        Data.needLimit = parseInt($(el).data("value"));
      });
      //wether to enable teminalperiodquota
      $(_content + " .radio1.teminalperiodset").bind("click", (e) => {
        let el = e.target;
        $(el).addClass("focus").siblings().removeClass("focus");
        let index = $(el).index(_content + " .radio1.teminalperiodset");
        if(index == 1) {
          openTeminalPeriodQuota = false;
          Data.teminal_period_quota = "-1"
        } else {
          openTeminalPeriodQuota = true;
          Data.teminal_period_quota = $(_content + " #tenimal_period").val() || "0" + ":" + $(_content + " #tenimal_period_times").val() || "0"
        }
      });
    } else {
      $(_content + " #total_quota").attr("disabled", "disabled");
      $(_content + " #teminal_counts").attr("disabled", "disabled");
      $(_content + " #teminal_period_time").attr("disabled", "disabled");
      $(_content + " #teminal_period_count").attr("disabled", "disabled");
    }

    $(_content + " ._dialog_foot .confirm").bind("click", (e) => {
      // let ret = confirm(i18n("SUCAI_LIMIT_AUDITAUTH"));
      // if(isEdit && ret) {
      if(isEdit) {
        updateLimit();
      }
    })
  };
  var updateLimit = function (method = "PUT") {
    var url = paasHost + paasAdvDomain + "/ads/aditem/limit/" + ad_id + "?user_id=" + user_id + "&user_type=0&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
    let data = {
      needLimit: openLimit ? 1 : 0,
      total_quota: openLimit ? parseInt($(_content + " #total_quota").val()) : -1,
      teminal_quota: openTeminalQuota ? parseInt($(_content + " #teminal_counts").val()) : -1,
      teminal_period_quota: openTeminalPeriodQuota ? $(_content + " #teminal_period_time").val() + ":" + $(_content + " #teminal_period_count").val() : "-1"
    }
    $.ajax({
      type: method,
      url: url,
      async: true,
      data: JSON.stringify(data),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
      }
    }).done(() => {
      // auditProcess("Post", () => {
      //   dialog.close();
      //   context.table_component.refreshList();
      // })
        dialog.close();
        context.table_component.refreshList();
    }).fail(() => {
      return false;
    });
  }
  let auditProcess = function (method = "Post", callback) {
    let token = "user_id=" + user_id + "&user_type=" + my.paas.user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
    let url = paasHost + paasDomain + "/auditflow/instance/ad_item/" + ad_id + "?" + token;
    jQuery.ajax({
      type: method,
      url: url,
      async: false,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-aqua-sign": getPaaS_x_aqua_sign("PUT", url)
      }
    }).always((resp, status, xhr) => {
      if(status == "success") {
        callback && callback();
      }
    })
  }
  var dialog = new Dialog({
    url: "content/su_cai/viewLimit.html",
    width: 630,
    height: 332,
    context: this,
    callback: afterDrawn
  });
  $.extend(context, {
    viewLimit: {
      init: function ({
        uid, data = Data, edit
      } = {}) {
        Data = data;
        user_id = uid;
        isEdit = edit;
        ad_id = data.ad_id;
        dialog.create();
      }
    }
  })
})(jQuery, PopupDialog, sucai)
