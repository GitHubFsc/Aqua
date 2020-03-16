var AssetExportAll = (function ($) {
  let Pane = {
    search: {},
    init() {
      this.bindEvents();
    },
    bindEvents() {
      //输入框查询
      $(".asset_export_all .body #asset_export_all_btn").bind('click', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var url = API.output();
          if (url) {
            API.scan();
            var loading = new Loading({
              msg: i18n('ASSET_OUTPUT_LOADINGINFO'),
              timeout: 5 * 1000,
              callback: () => {
                window.open(url, "_blank", "toolbar=no, location=no,resizable=no, directories=no, width=400, height=400")
              }
            });
          } else {
            alert("you have no right to output assets of this provider_id");
          }
        }
      })
    }
  };
  let API = {
    /**
     * 导出数据前同步job_aquapaas_host
     */
    scan(callback){
        var url = aquapaas_host + '/aquapaas/rest/asset/job/state/scan',
            method = 'Post',
            urlParam = [],
            obj=[];
        var providerid = Pane.search['provider_id'] || '';
        var authoPids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',').filter(item => item != '');
        if (authoPids.length > 0) {//有限权限
          if (providerid) {
            if (authoPids.includes(providerid)) {
              urlParam.push('provider_id=' + providerid);
            }
          } else {
            urlParam.push('provider_id=' + authoPids.join(','))
          }
        } else {
          if (providerid) {
            urlParam.push('provider_id=' + providerid)
          }
        };
        urlParam.push("mode=all");
        urlParam.push("app_key=" + paasAppKey),//应用级授权
        urlParam.push("timestamp=" + new Date().toISOString());//应用级授权
        url += '?' + urlParam.join("&");
        $.ajax({
          type: method,
          url: url,
          async: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(obj)
        }).always((resp, status, xhr) => {

        })
    },
    output() {
      var ret = aquapaas_host + '/aquapaas/rest/asset/report';
      var providerid = Pane.search['provider_id'] || '';
      var authoPids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',').filter(item => item != '');
      if (authoPids.length > 0) {//有限权限
        if (providerid) {
          if (authoPids.includes(providerid)) {
            ret += '?provider_id=' + providerid;
          } else {
            ret = '';
          }
        } else {
          ret += '?provider_id=' + authoPids.join(',');
        }
      } else {
        if (providerid) {
          ret += '?provider_id=' + providerid;
        }
      }
      return ret;
    }
  };
  let Model = {
  };
  return {
    init() {
      Pane.init();
    }
  }
})(jQuery)
