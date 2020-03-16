var mapAccurate = (function($, Dialog, Combo) {
  let dialog = function({data={}, callback, confirm}={}) {
    let pane = $.extend(true, {}, Pane),
        api = $.extend(true, {}, API),
        model = $.extend(true, {}, Model);
    $.extend(true, model.data, data)
    api.confirm = confirm
    api.close = callback
    pane.init(api, model);
    pane.loadData(model.data)
    return pane.dialog;
  },
  Pane = {
    widget: {},
    zoom: 19,
    init(api, model) {
      this.api = api;
      this.model = model;
      var dom =
      `<div class='_dialog' id='map_accurate'>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${i18n('ADPOLICYMANAGE_SOCIAL_ACCURATE')}</div>
          <div class='span'></div>
          <div class='popup_dialog_clear _dialog_close'></div>
        </div>
        <div class='_dialog_body'>
          <div class='_dialog_row'>
            <div class='_dialog_col' style='width: 537px;'>
              <label>地点</label>
              <div class='_dialog_row'>
                <input class='value' style='width: 372px;height: 30px;padding-left: 10px;outline: none;' id='map_address'>
                <div class='btn address_search' style='width: 90px;height: 30px;border: 1px solid #597f89;border-radius: 2px;margin: 0 13px;color: #fff;cursor: pointer;background-color: #5da1c0;line-height: 30px;text-align: center;'>${i18n('CONTRACTS_QUERY_SEARCH')}</div>
              </div>
            </div>
            <div class='_dialog_col'>
              <label>${i18n('ADPOLICYMANAGE_SOCIAL_ACCURATE_RADIUS')}</label>
              <div class='_dialog_row'>
                <!--input class='value' style='height: 30px;width: 100px;padding-left: 10px;outline: none;' id='map_radius'-->
                <div id='map_radius' style='height: 30px;width: 100px;outline: none;border: 1px solid #e2e2e2;'></div>
                <div style='height: 30px;margin: 0 13px;line-height: 30px;text-align: center;'>${i18n('ADPOLICYMANAGE_SOCIAL_ACCURATE_METER')}</div>
              </div>
            </div>
          </div>
          <div class='map' id='map'></div>
          <div id='map_style'></div>
        </div>
        <div class='_dialog_foot'>
          <div class='btn cancel'>${i18n('ADV_SYSUSER_QUXIAO')}</div>
          <div class='btn confirm'>${i18n('ADV_SYSUSER_QUEDING')}</div>
        </div>
      </div>`;
      var dialog = new Dialog({
        content: dom,
        width: 760,
        height: 649,
        local: true,
        context: this,
        callback: () => {
          this.initMap(model);
          this.bindEvents(this.widget.map);
        }
      })
      dialog.create();
      this.dialog = dialog;
    },
    initMap(model) {
      var bm = new BMap.Map('map'),
          _this = this;
      bm.centerAndZoom(new BMap.Point(model.x, model.y), this.zoom)
			//选取点
			bm.addEventListener('click', ({point}) => {
        //地址解析器
        var geo = new BMap.Geocoder();
				geo.getLocation(point, function({address, point}) {
					$('#map_accurate #map_address').val(address)
  				_this.addMark(point, model.data.shape_range, address)
				})
			})
      _this.widget.map = bm;
    },
    bindEvents(bm) {
      //地址解析器
      var geo = new BMap.Geocoder(),
          _this = this,
          radius = new Combo({
            el: '#map_radius',
            width: 100,
            height: 30,
            showCombo: true,
            scrollHeight: '90px',
            icon: 'url(./image/adPolicyManage/arrow.png)',
            content: Array.apply(null, {length: 6}).map((item, idx) => {
            return {
                label: (6 - idx) * 500,
              value: (6 - idx) * 500
            }
            }),
            color: '#797979',
            callback: (val) => {
              console.log(val);
            var point = new BMap.Point(_this.model.data.locationInfoDetail.x, _this.model.data.locationInfoDetail.y)
            var marker = new BMap.Marker(point)
            bm.clearOverlays();
            bm.addOverlay(marker)
              if (parseInt(mapStyle.getValue())) {
                _this.zoom = _this.api.setScaleByDistance(val)
              }
              _this.model.data.shape_range = val
            _this.addMark(point, val)
            }
          }),
          mapStyle = new Combo({
            el: '#map_style',
            width: 156,
            height: 30,
            showCombo: true,
            enable: false,
            content: [{
              label: i18n('ADPOLICYMANAGE_MAP_SHOW_CENTER'),
              value: 0
            }, {
              label: i18n('ADPOLICYMANAGE_MAP_SHOW_RADIUS'),
              value: 1
            }],
            icon: 'url(./image/adPolicyManage/arrow.png)',
            color: '#797979',
            callback: (val) => {
              _this.mapStyle = val;
              if (val) {
                _this.zoom = _this.api.setScaleByDistance(_this.widget.radius.getValue());
                _this.widget.map.setZoom(_this.zoom)
              } else {
                _this.zoom = 19;
                _this.widget.map.setZoom(_this.zoom)
              }
            }
          })
      mapStyle.setValue(0);
      _this.widget.radius = radius
      _this.widget.mapStyle = mapStyle
      $('#map_accurate')
      .on('keyup', '#map_address', ({currentTarget, target, which, keyCode}) => {
        var key = which || keyCode,
            val = $(currentTarget).val();
        if (currentTarget == target) {
          if (key == 13) {
            geo.getPoint(val, function(point) {
              if (point) {
        				var marker = new BMap.Marker(point)
                bm.clearOverlays();
                bm.addOverlay(marker)
                bm.centerAndZoom(point, _this.zoom)
                _this.addMark(point, _this.model.data.shape_range, val)
              }
            })
          }
        }
      })
      .on('click', '.address_search.btn', ({currentTarget, target}) => {
        let val = $(currentTarget).prev().val();
        if(currentTarget == target) {
          geo.getPoint(val, function(point) {
            if (point) {
              var marker = new BMap.Marker(point)
              bm.clearOverlays();
              bm.addOverlay(marker)
              bm.centerAndZoom(point, _this.zoom)
              _this.addMark(point, _this.model.data.shape_range, val)
            }
          })
        }
      })
      // .on('keyup', '#map_radius', ({currentTarget, target, keyCode, which}) => {
      //   var radius = $(currentTarget).val()||'0',
      //       key = which || keyCode;
      //   if (currentTarget == target) {
      //     if (key == 13) {
      //       var point = new BMap.Point(_this.model.data.locationInfoDetail.x, _this.model.data.locationInfoDetail.y)
      //       var marker = new BMap.Marker(point)
      //       bm.clearOverlays();
      //       bm.addOverlay(marker)
      //       bm.centerAndZoom(point, 19)
      //       _this.addMark(point, radius)
      //     }
      //   }
      // })
      .on('click', '._dialog_foot .cancel, .popup_dialog_clear', ({currentTarget, target}) => {
        if (currentTarget == target) {
          _this.api.close();
        }
      })
      .on('click', '._dialog_foot .confirm', ({currentTarget, target}) => {
        if (currentTarget == target) {
          _this.model.data.community_policy = 0;
          _this.api.confirm(_this.model.data);
        }
      })
    },
    drawCircle(bm, point, radius) {
      var oval = new BMap.Circle(point, radius, {
        strokeColor: 'rgb(5, 99, 139)',
        strokeWeight: 1,
        strokeOpacity: 0.3,
        fillColor: 'rgb(110, 211, 255)',
        fillOpacity: 0.3
      })
      this.widget.map.addOverlay(oval)
    },
    addMark(point, radius, address) {
      //创建标志物
      var marker = new BMap.Marker(point)
      this.widget.map.clearOverlays();
      this.widget.map.addOverlay(marker)
      this.drawCircle(this.widget.map, point, radius)
      this.widget.map.centerAndZoom(point, this.zoom)
      //保存点
      this.model.data.shape_range = radius;
      var localInfo = {
        x: point.lng,
        y: point.lat,
        loc_type: 'lnglat'
      };
      if (address) {
        localInfo.address = address
      }
      $.extend(true, this.model.data.locationInfoDetail, localInfo);
    },
    getPoints(center, r){
      var assemble = new Array();
      for (var i = 0; i < 60; i++) {
        var {PI, sin, cos} = Math;
        var angle = 2 * PI / 60 * i,
            dot = new BMap.Point(center.lng + r * cos(angle), center.lat + r * sin(angle))
        assemble.push(dot)
      }
      return assemble

    },
    loadData(data) {
      let {shape_range, locationInfoDetail: {address, x, y, loc_type}} = data,
          _this = this,
          point = data.locationInfoDetail.loc_type == 'lnglat' ? new BMap.Point(x, y) : new BMap.MercatorProjection().pointToLngLat(new BMap.Pixel(x, y)),
          geo = new BMap.Geocoder();//地址解析器
      this.widget.map.centerAndZoom(point, _this.zoom)

      // geo.getLocation(point, function({address, point}) {
        $('#map_accurate #map_address').val(address)
        _this.model.data.locationInfoDetail.address = address;
        _this.addMark(point, shape_range)
      // })
      // $('#map_accurate #map_radius').val(shape_range)
      _this.widget.radius.setValue(shape_range)
        $('#map_accurate #map_address').val(address)
    }
  },
  API = {
    setScaleByDistance(distance) {
      var maxRange = parseInt(distance),
          scale = 19;
      if (maxRange > 10000000) {
        scale = 1
      } else if (maxRange > 5000000) {
        scale = 2
      } else if (maxRange > 2000000) {
        scale = 3
      } else if (maxRange > 1000000) {
        scale = 4
      } else if (maxRange > 500000) {
        scale = 5
      } else if (maxRange > 200000) {
        scale = 6
      } else if (maxRange > 100000) {
        scale = 7
      } else if (maxRange > 50000) {
        scale = 8
      } else if (maxRange > 25000) {
        scale = 9
      } else if (maxRange > 20000) {
        scale = 10
      } else if (maxRange > 10000) {
        scale = 11
      } else if (maxRange > 5000) {
        scale = 12
      } else if (maxRange > 2000) {
        scale = 13
      } else if (maxRange > 1000) {
        scale = 14
      } else if (maxRange > 500) {
        scale = 15
      } else if (maxRange > 200) {
        scale = 16
      } else if (maxRange > 100) {
        scale = 17
      } else if (maxRange > 50) {
        scale = 18
      } else if (maxRange > 20) {
        scale = 19
      }
      console.log('distance:' + distance + ',scale:' + scale);
      return scale;
    }
  },
  Model = {
    data: {
      shape_range: 500,
      community_policy: 1,
      locationInfoDetail: {
        address: '',
        x: 121.401304,
        y: 31.218596,
        loc_type: 'lnglat'
      }
    }
  }
  return dialog;
})(jQuery, OverlayDialog, InputCombo)
