var openAdPosConnect = (function($) {
  var dmRoot = paasHost + paasDomain + '/dm';
  function openConnect(id, adPos) {
    var $parent = $(id);
    $parent.show();
    var selList = null, cnectedList = null, advSites = [], boundSites = [];
    $.get('content/guang_gao_wei/ad_connect_site.html', function(data) {
      $parent.append(patchHTML(data));
      $('#adCntBckBtn').on('click', function() {
        $parent.empty().hide();
      });
      $('#adCntTitle').append(adPos.name + i18n('ADPOS_CONNECT_SITE'));
      $('#adSiteAddBtn').on('click', function() {
        bindSites();
      });
      $('#adSiteRmvBtn').on('click', function() {
        unbindSites();
      });
      selList = new MultiFlowList({
        title: [{
          label: i18n('ADPOS_CNECT_SITE_ID')
        }, {
          label: i18n('ADPOS_CNECT_SITE_NAME')
        }, {
          label: i18n('ADPOS_CNECT_SITE_IP')
        }],
        data: [],
        minRows: 14,
        container: '#adSiteList'
      });
      selList.create();
      cnectedList = new MultiFlowList({
        title: [{
          label: i18n('ADPOS_CNECT_SITE_ID')
        }, {
          label: i18n('ADPOS_CNECT_SITE_NAME')
        }, {
          label: i18n('ADPOS_CNECT_SITE_IP')
        }, {
          label: i18n('ADPOS_CNECT_SITE_STATUS')
        }],
        data: [],
        minRows: 14,
        container: '#adSiteConnected'
      });
      cnectedList.create();
      getSiteList();
      updateBoundList();
    });
    function getSiteList() {
      $.ajax({
        async: false,
        url: dmRoot + '/site',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(data) {
        advSites = data;
        var addOptions = [];
        for (var i = 0, len = data.length; i < len; i += 1) {
          var site = data[i];
          if (site.id == window.AdvSelfSiteId) {
            continue;
          }
          addOptions.push([{
            label: site.id
          }, {
            label: site.name
          }, {
            label: site.endpoints[0].ip
          }]);
        }
        selList.update(addOptions);
      });
    }

    function updateBoundList() {
      $.ajax({
        url: dmRoot + '/object_status/adv/adv_placement/' + adPos.ext_id,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(data) {
        var states = $.makeArray(data);
        var sites = advSites.filter(function(site){
          if(states.some(function(state){
            return state.siteId == site.id;
          })){
            return true;
          }
        });
        var cnects = sites.map(function(site){
          var adv = null, dm = null;
          site.endpoints.forEach(function(endpoint){
            if(endpoint.app_type == 'adv'){
              adv = endpoint;
            } else if(endpoint.app_type == 'dm'){
              dm = endpoint;
            }
          });
          var mlabel = '';
          mlabel += '<div class="' + (adv && adv.available ? 'site-bind-state-avail' : 'site-bind-state-unavail') + '">' + i18n('SITE_ADMIN_SITE_ADV') + '</div>';
          mlabel += '<div class="' + (dm && dm.available ? 'site-bind-state-avail' : 'site-bind-state-unavail') + '">' + i18n('SITE_ADMIN_SITE_DM') + '</div>';
          return [{
            label: site.id
          }, {
            label: site.name
          }, {
            label: site.endpoints[0].ip
          }, {
            label: mlabel
          }];
        });
        cnectedList.update(cnects);
      }).fail(function() {

      });
    }

    function bindSites() {
      var checked = selList.getChecked();
      var sites = checked.map(function(item) {
        return item[0].label;
      });
      var cnects = cnectedList.getData().map(function(item){
        return item[0].label;
      });
      sites = sites.filter(function(site){
        if(!cnects.some(function(_site){
          return _site == site;
        })){
          return true;
        }
      });
      if(sites.length == 0){
        return false;
      }
      var url = dmRoot + '/object/adv/adv_placement/' + adPos.ext_id;
      url += '?site_id=' + adPos.site_id;
      $.ajax({
        type: 'PUT',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          site: sites
        })
      }).done(function() {
        updateBoundList();
      }).fail(function(xhr) {
        if (xhr.status == 204) {
          updateBoundList();
        }
      });
    }

    function unbindSites() {
      var checked = cnectedList.getChecked();
      var sites = checked.map(function(item){
        return item[0].label;
      });
      var url = dmRoot + '/object_site/adv/adv_placement/' + adPos.ext_id;
      url += '?site_id=' + sites.join(',');
      $.ajax({
        type: 'DELETE',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).done(function(data){
        updateBoundList();
      });
    }

  }

  return openConnect;
})(jQuery);
