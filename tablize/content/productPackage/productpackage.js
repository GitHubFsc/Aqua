var productPackage = {
  Store: {},
  init: function () {
    this.conflict();
    //init table
    this.createTable();

    if(!(my.paas && my.paas.user_id)){
      alert('请登录用户');
      return;
    }

    //init button
    this.bindEvent();

    //clearDataBase
    this.initDataBase();

    //get data which used in dialog
    this.initSetting();
  },
  createTable: function () {
    var labels = [/*{
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_0')
        }, */{
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_1')
        }, {
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_2')
        }, {
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_3')
        }, {
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_4')
        }, {
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_5')
        }, {
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_6')
        },{
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_9'),//i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_7')
        }, {
      label: i18n('PRODUCT_PACKAGE_MNG_TABLE_TH_8')
        }];
    var style = {
      borderColor: "#E2E2E2",
      borderWidth: 1,
      titleBg: "#45D1F4",
      titleColor: "#FFFFFF",
      titleHeight: 31,
      cellBg: "white",
      evenBg: "#F5FDFF",
      cellColor: "#797979",
      cellHeight: 34,
      footBg: "#FFFFFF",
      footColor: "#494B58",
      inputBg: "#FFFFFF",
      inputBorder: "1px solid #E2E2E2",
      iconColor: "#0099CB",
      // columnsWidth: [0.1, 0.08, 0.14, 0.11, 0.14, 0.15, 0.06, 0.07, 0.16]
      columnsWidth: [0.11, 0.16, 0.12, 0.16, 0.16, 0.06, 0.13]
    };
    this.listTable = new StyledList({
      containerId: "productMngTable",
      rows: 15,
      columns: 8,//9,
      titles: labels,
      styles: style,
      async: true,
      listType: 1
    });
    this.listTable.getPageData = this.queryData;
    this.listTable.create();
    var self = this;
    //resize 窗口resize + menu resize
    this.resizeID = false;
    window.onresize = function () {
      if(productPackage.resizeID !== false) {
        clearTimeout(productPackage.resizeID);
        productPackage.resizeID = false;
      }
      productPackage.resizeID = setTimeout(function () {
        productPackage.listTable.resize();
        productPackage.resizeID = false;
      }, 100);
    };
    PanelMenu.onResize = function () {
      productPackage.listTable.resize();
    };
  },
  queryData: function (pageNumber, callback) {
    var result = [];
    if(!(my.paas && my.paas.user_id)){
      callback(result);
      return;
    }
    var _start = (pageNumber - 1) * 15;
    var _end = pageNumber * 15 - 1;
    var url = aquapaas_host + "/aquapaas/rest/product/products";
    //var url = aqua_host + "/aquapaas/rest/product/products?" + 'start=' + _start + "&end=" + _end;
    //add search type
    if(productPackage.getBindData($('productPkgPageSearch')) === true) {
      url = url + "?title=" + $('productPkgPageSearch').value + '&start=' + _start + "&end=" + _end;
    } else {
      url = url + "?start=" + _start + "&end=" + _end;
    }
    url = url + "&enable=all"
    url += '&app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    var xhr = productPackage.createXHR();
    xhr.open('GET', url, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('GET', url));
    xhr.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200) {
          var tmp = JSON.parse(this.responseText);
          productPackage.listTable.onTotalCount(this.getResponseHeader('x-aqua-total-count'));
          result = tmp;
        } else {
          productPackage.setErrorInfoMes("平台列表数据获取失败");
          result = [];
        }
      }
    }
    xhr.send();
    //formatadata
    if(result.length > 0) {
      //get product inventory
      // var product_ext_ids = [];
      // result.map(function (v) {
        // v.metadata.ext_id ? product_ext_ids.push(v.metadata.ext_id) : "";
      // });
      // productPackage.updateInventoryStore(product_ext_ids);
      result = result.map(function (v, index) {
        // var inventory = productPackage.getInventory(v.metadata.ext_id);
        var obj = [/*{
          label: v.product_id
                }, */{
          label: v.metadata.ext_id || ""
                }, {
          label: v.title
                }, {
          label: v.product_type
                }, {
          label: productPackage.formatdate(v.activatetime)
                }, {
          label: productPackage.formatdate(v.deactivatetime)
                }, {
          label: v.quota
                }, {
          label: v.property_tag_list != null ? v.property_tag_list.join(',') : ''//productPackage.getInventoryState(inventory)
                }, {
          label: "<div data-optname='" + v.title + "'  data-optid='" + v.product_id +
              "'><div class='platformopt' onclick = 'productPackage.edit(this, true)'>" + i18n("OPS_VIEW") +
              "</div><div class='platformopt' onclick = 'productPackage.edit(this)'>" + i18n("OPS_EDIT") +
              "</div><div class='platformopt' onclick = 'productPackage.del(this)'>" + i18n("OPS_DEL") + "</div></div>"
                }]
        return obj;
      });
    }
    callback(result);
  },
  getInventoryState: function (inventory) {
    //是否有库存信息
    if(typeof inventory.total == 'undefined') {
      return "未开启"
    } else {
      //return inventory.total - (inventory.current || 0);
      return inventory.current || 0;
    }
  },
  getInventoryOperation: function (inventory) {
    if(!inventory.total) {
      return "<div class='platformopt' onclick = 'productPackage.openInventory(this)'>" + i18n('PRODUCTPKG_INVENTIORY_OPT_1') + "</div>";
    } else {
      return "<div class='platformopt' onclick = 'productPackage.editInventory(this)'>" + i18n('PRODUCTPKG_INVENTIORY_OPT_2') + "</div>"
    }
  },
  getInventory: function (ext_id) {
    if(!ext_id) return {};
    var data = this.Store.inventoryList;
    for(var i = 0; i < data.length; i++) {
      if(data[i].asset_id == ext_id) {
        return data[i];
      }
    }
    return {};
  },
  updateInventoryStore: function (ids) {
    this.Store.inventoryList = [];
    var self = this;
    if(ids.length && ids.push && ids.length > 0) {
      var url = aquapaas_host + "/aquapaas/rest/inventory/inventorys?enable=all&asset_type=product&asset_id=" + ids.join(",");
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('GET', url));
      xhr.onreadystatechange = function () {
        if(this.readyState == 4) {
          if(this.status == 200) {
            self.Store.inventoryList = JSON.parse(this.responseText);
          }
        }
      }
      xhr.send();
    }
  },
  openInventory: function (e) {
    var self = this;
    var id = e.parentNode.getAttribute('data-optid');
    //getProduct
    this.getProduct(id, function (data) {
      self.openDialog('ErrorMSG', function () {
        self.bindData($('ErrorMSG'), data);
      });
    });
  },
  openInventoryXHR: function () {
    var self = this;
    var objdata = this.getBindData($('ErrorMSG')) == false ? {} : this.getBindData($('ErrorMSG'));
    if(!objdata.metadata.ext_id) {
      this.closeDialog('ErrorMSG', function () {
        self.setErrorInfoMes('本产品包缺少产品编号，无法开启库存');
      });
      return;
    }
    var data = {
      asset_id: objdata.metadata.ext_id,
      title: objdata.title || "",
      price: objdata.price || "",
      alt_price: objdata.alt_price || "",
      score_points: objdata.score_points || "",
      activatetime: objdata.activatetime,
      deactivatetime: objdata.deactivatetime,
      total: 0,
      current: 0
    }
    self.closeDialog('ErrorMSG', function () {
      self.removeBindData($("ErrorMSG"));
    });
    self.openDialog('productInventory', function () {
      self.bindData($('productInventory'), data);
      $('inventory_mes3').innerHTML = data.total;
      $('inventory_mes2').innerHTML = data.total - data.current || 0;
      $('inventory_mes1').innerHTML = data.current || 0;
    })
  },
  editInventory: function (e) {
    var self = this;
    var id = e.parentNode.getAttribute('data-optid');
    //getProduct Inventory
    this.getProduct(id, function (data) {
      self.bindData($('productInventory'), data);
      var ext_id = data.metadata.ext_id;
      if(!ext_id) {
        self.setErrorInfoMes("获取的产品信息中缺少id，无法查找库存");
        return;
      }
      self.getProInventory(ext_id, function (idata) {
        self.bindData($('productInventory'), idata);
        self.openDialog('productInventory', function () {
          $('inventory_mes3').innerHTML = idata.total;
          $('inventory_mes2').innerHTML = idata.total - idata.current || 0;
          $('inventory_mes1').innerHTML = idata.current || 0;
        });
      });
    });
  },
  getProInventory: function (id, callback) {
    var self = this;
    var xhr = new XMLHttpRequest();
    var url = aquapaas_host + "/aquapaas/rest/inventory/product/" + id;
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('GET', url));
    xhr.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200) {
          if(typeof callback == 'function') {
            callback(JSON.parse(this.responseText));
          }
        } else {
          self.setErrorInfoMes("产品库存获取失败");
        }
      }
    }
    xhr.send();
  },
  editInventoryXHR: function () {
    var self = this;
    var callback = function () {
      self.closeDialog('productInventory', function () {
        self.removeBindData($('productInventory'));
        self.$Status.setValue("0");
        $('invenorySelectorDetail').value = "";
        self.listTable.refreshList();
      });
    };
    var objdata = this.getBindData($('productInventory')) == false ? {} : this.getBindData($('productInventory'));
    //针对创建inventory
    if(objdata.total == 0 && objdata.current == 0) {
      var statusvalue = this.$Status.getValue();
      if(statusvalue == 1) {
        this.setErrorInfoMes("开启库存时请添加库存");
        return;
      }
    }
    var str_value = $('invenorySelectorDetail').value;
    if(str_value == "") {
      return;
    }
    if(!(/^[0-9]*[1-9][0-9]*$/.test(str_value))) {
      this.setErrorInfoMes("库存改变量请输入正整数");
      return;
    }
    var value = parseInt($('invenorySelectorDetail').value);
    var ttotal = this.$Status.getValue() == 0 ? (objdata.total + value) : (objdata.total - value);
    if(ttotal == 0) {
      this.setErrorInfoMes("库存总量不能为0！");
      return;
    }
    if(this.$Status.getValue() == 1 && value > objdata.current) {
      this.setErrorInfoMes("库存减少量不能大于当前库存量!");
      return;
    }
    var data = {
      total: ttotal,
      activatetime: objdata.activatetime,
      deactivatetime: objdata.deactivatetime
    }
    var httpBody = {}
    httpBody["title"] = objdata["title"] || "";
    httpBody["price"] = objdata["price"] || 0;
    httpBody["alt_price"] = objdata["alt_price"] || 0;
    httpBody["score_points"] = objdata["score_points"] || 0;
    this.PUTInventory(objdata["asset_id"], data, httpBody, callback);
  },
  PUTInventory: function (ext_id, data, httpBody, callback, ErroMES) {
    var self = this; 
    if(!ext_id) {
      self.setErrorInfoMes('本产品包缺少产品编号，无法开启库存');
    }
    if(typeof data.total != 'number') {
      self.setErrorInfoMes('库存总量错误');
    }
    var queryString = [];
    for(var key in data) {
      queryString.push(key + "=" + (data[key] + "").replace("+", "%2B"));
    }
    var url = aquapaas_host + "/aquapaas/rest/inventory/product/" + ext_id + "?" + queryString.join("&");
    url += '&app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('PUT', url));
    xhr.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200 || this.status == 204) {
          if(typeof callback == 'function') {
            callback();
          }
        } else {
          //self.setErrorInfoMes('开启库存失败，后台错误');
          if(ErroMES) {
            self.setErrorInfoMes(ErroMES);
          } else {
            self.setErrorInfoMes('操作出错');
          }
        }
      }
    }
    xhr.send(JSON.stringify(httpBody || {}));
  },
  bindEvent: function () {
    var self = this;
    jQuery('.div-form-select').on('mouseleave', function(){
      jQuery(this).hide();
    });
    jQuery('div.check-box').on('click', function(){
      if(!jQuery(this).hasClass('disabled')){
        var checkbox = this.children[0];
        checkbox.checked = !checkbox.checked;
        var priceType = jQuery(this).attr('data-tag');
        self.setPriceTypeToTags(priceType, checkbox.checked);
      }
    });
    jQuery('#productTypeSelect').on('click', 'div', function(){
      var $opt = jQuery(this);
      $opt.parent().hide();
      var val = $opt.attr('value');
      if(val == ''){
        self.openDefTypeDialog('product_type');
      } else {
        var prevType = jQuery('#productType').val();
        jQuery('#productType').val(val);
        self.setProductTypeToTags(prevType, val);
      }
    });
    jQuery('#productType').on('click', function(){
      jQuery('#productTypeSelect').show();
    });
    jQuery('#product_courseID_Select').on('click', 'div', function(){
      var $opt = jQuery(this);
      $opt.parent().hide();
      var val = $opt.attr('value');
      if(val == ''){
        self.openDefTypeDialog('property_type');
      } else {
        jQuery('#product_courseID').val(val);
      }
    });
    jQuery('#product_courseID').on('click', function(){
      jQuery('#product_courseID_Select').show();
    });
    jQuery('#product_property_list_choice').on('click', function(){
      jQuery('#product_property_list_type').show();
    });
    jQuery('#product_property_list_type').on('click', 'div', function(){
      var $opt = jQuery(this);
      $opt.parent().hide();
      var type = $opt.attr('data-type');
      var placeholder = '';
      var obj = self.pageLoading;
      switch(type){
      case 'id':
        placeholder = i18n('PRODUCT_ADD_LABEL_DES_ID_PLACEHOLDER');
        if(obj != null && obj.property_id_list != null && obj.property_id_list.join(',').length > 0){
          jQuery('#productAddAssetTags').val(obj.property_id_list.join(','));
        } else {
          jQuery('#productAddAssetTags').val('');
        }
        break;
      case 'tag':
        placeholder = i18n('PRODUCT_ADD_LABEL_DES_TAG_PLACEHOLDER');
        if(obj != null && obj.property_tag_list != null && obj.property_tag_list.join(',').length > 0){
          jQuery('#productAddAssetTags').val(obj.property_tag_list.join(','));
        } else {
          jQuery('#productAddAssetTags').val('');
        }
        break;
      case 'code':
        placeholder = i18n('PRODUCT_ADD_LABEL_DES_CODE_PLACEHOLDER');
        if(obj != null && obj.property_product_code_list != null && obj.property_product_code_list.join(',').length > 0){
          jQuery('#productAddAssetTags').val(obj.property_product_code_list.join(','));
        } else {
          jQuery('#productAddAssetTags').val('');
        }
        break;
      }
      jQuery('#productAddAssetTags').attr('placeholder', placeholder);
      jQuery('#product_property_list_choice').val($opt.text()).attr('data-type', type);
    });

    $('productPkgAddBtn').onclick = function () {
      self.loadData({});
      self.openAddPage(true);
      // self.openAddPage(true, function () {
        // self.loadData({});
      // });
    };
    $('productbackBtn').onclick = function () {
      self.openAddPage(false);
      self.listTable.resize();
    };
    $('productAdd_cancel').onclick = function () {
      self.openAddPage(false);
      self.listTable.resize();
    };
    $('productAdd_ok').onclick = function () {
      if(jQuery(this).hasClass('disabled')){
        self.openAddPage(false);
        self.listTable.resize();
      } else {
        self.saveData(function () {
          self.openAddPage(false);
          self.listTable.resize();
          self.listTable.refreshList();
        });
      }
    };
    $('productAddOrgCont_btn').onclick = function () {
      self.openDefMetadata();
      // self.openDialog('productAddorg', function () {
        // self.resetOrgnization();
      // });
    };
    // $('productAddorg_close').onclick = function () {
      // self.closeDialog('productAddorg', function () {
        // console.log('close productAddorg');
      // });
    // };
    // $('productAddorg_cancel').onclick = function () {
      // self.closeDialog('productAddorg', function () {
        // console.log('cancel productAddorg');
      // });
    // };
    // $('productAddorg_ok').onclick = function () {
      // self.createAccessItems();
      // self.closeDialog('productAddorg');
    // };
    //search for Enter
    $('productPkgPageSearch').onkeydown = function (e) {
        if(e.code == "Enter") {
          var v = this.value == '' ? false : true;
          self.bindData($('productPkgPageSearch'), v);
          self.listTable.create();
        }
      }
      //search button
    $('productsearch').onclick = function () {
        var v = $('productPkgPageSearch').value == '' ? false : true;
        self.bindData($('productPkgPageSearch'), v);
        self.listTable.create();
      }
      //delete dialog
    $('productDel_ok').onclick = function () {
      var id = self.getBindData($('productDel'));
      var url = aquapaas_host + "/aquapaas/rest/product/" + id;
      url += '?app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
      var xhr = self.createXHR();
      xhr.open("DELETE", url, true);
      xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('DELETE', url));
      xhr.onreadystatechange = function () {
        if(this.readyState == 4) {
          if(this.status == 200) {
            self.closeDialog('productDel', function () {
              self.listTable.refreshList();
            });
          } else {
            console.error("delete error");
          }
        }
      }
      xhr.send();
    }
    $('productDel_cancel').onclick = function () {
      self.closeDialog('productDel');
    }
    $('productDel_close').onclick = function () {
        self.closeDialog('productDel');
      }
      // error info dialog
    $('productError_close').onclick = function () {
      self.closeDialog('productError');
    }
    $('productError_ok').onclick = function () {
      self.closeDialog('productError');
    }
    $('productError_cancel').onclick = function () {
        self.closeDialog('productError');
      }
      //open inventory page
    $('ErrorMSG_close').onclick = function () {
      self.closeDialog('ErrorMSG', function () {
        self.removeBindData($('ErrorMSG'));
      });
    }
    $('ErrorMSG_cancel').onclick = function () {
      self.closeDialog('ErrorMSG', function () {
        self.removeBindData($('ErrorMSG'));
      });
    }
    $('ErrorMSG_ok').onclick = function () {
        self.openInventoryXHR();
      }
      //init select
    // var _total_array = [{
      // value: 0,
      // key: "增加库存"
        // }, {
      // value: 1,
      // key: "减少库存"
        // }];
    // self.getStatus = function (value) {
      // for(var i = 0; i < _total_array.length; i++) {
        // if(value == _total_array[i].value) {
          // return _total_array[i].key
        // }
      // }
    // }
    // self.$Status = new newSelect("#invenorySelector", _total_array, {
      // backgroundIMGStyle: 2,
      // width: "149px",
      // height: "34px",
      // background: "#ffffff",
      // selectbackground: "#d3d3d3"
    // });
    //edit inventory page btns
    // $('productInventory_close').onclick = function () {
      // self.closeDialog("productInventory");
    // }
    // $('productInventory_cancel').onclick = function () {
      // self.closeDialog("productInventory");
    // }
    // $('productInventory_ok').onclick = function () {
      // self.editInventoryXHR();
    // }
  },
  openAddPage: function (bools, callback) {
    if(bools === true) {
      $('productAddContainer').className = 'productShow';
      $('productMngContainer').className = 'productHidden';
    } else {
      $('productAddContainer').className = 'productHidden';
      $('productMngContainer').className = 'productShow';
      // this.loadData({});
    }
    if(typeof callback == "function") {
      callback();
    }
  },
  initSetting: function () {
    var self = this;
    this.updateDefTypes();
    this.$setRemoveEvent = function (id) {
      //bind event
      jQuery("#" + id).parent().unbind('mouseenter').mouseenter(function () {
        jQuery("#productAddContainer").unbind('click');
      });
      jQuery("#" + id).parent().unbind('mouseleave').mouseleave(function () {
        jQuery("#productAddContainer").unbind('click').click(function () {
          jQuery("#productAddContainer .date-selector").empty();
          jQuery("#productAddContainer").unbind('click');
        });
      })
    };
    // init date input
    jQuery("#productStartTime_icon").bind("click", function () {
      if(jQuery(this).hasClass('disabled')){
        return;
      }
      //delete other date selector
      jQuery("#productAddContainer .date-selector").not("#timeContStart").empty();
      //
      if(jQuery("#timeContStart").html() != "") {
        jQuery("#timeContStart").empty();
      } else {
        var _calendar = new ProductPkgCalendar('timeContStart');
        _calendar.extendOnClick = function (obj) {
          var year = jQuery("#year-box").text();
          var month = jQuery("#month-box").text();
          for(var i = 0; i < Months.length; i++) {
            if(month == Months[i]) {
              month = i + 1;
              break;
            }
          }
          var date = (obj.innerHTML ? obj.innerHTML : obj.textContent) + "";
          var dateString = date.length > 1 ? date : "0" + date
          var str_date = year + '-' + month + '-' + dateString;
          jQuery("#productStartTime").val(str_date);
          jQuery("#timeContStart").empty();
        };
        productPackage.$setRemoveEvent("timeContStart");
      };
    });
    jQuery("#productEndTime_icon").bind("click", function (event) {
      if(jQuery(this).hasClass('disabled')){
        return;
      }
      jQuery("#productAddContainer .date-selector").not("#timeContEnd").empty();
      if(jQuery("#timeContEnd").html() != "") {
        jQuery("#timeContEnd").empty();
      } else {
        var _calendar = new ProductPkgCalendar('timeContEnd');
        _calendar.extendOnClick = function (obj) {
          var year = jQuery("#year-box").text();
          var month = jQuery("#month-box").text();
          for(var i = 0; i < Months.length; i++) {
            if(month == Months[i]) {
              month = i + 1;
              break;
            }
          }
          var date = (obj.innerHTML ? obj.innerHTML : obj.textContent) + "";
          var dateString = date.length > 1 ? date : "0" + date
          var str_date = year + '-' + month + '-' + dateString;
          jQuery("#productEndTime").val(str_date);
          jQuery("#timeContEnd").empty();
        };
        productPackage.$setRemoveEvent("timeContEnd");
      };
    });
    jQuery("#productTicketEndTime_icon").bind("click", function () {
      if(jQuery(this).hasClass('disabled')){
        return;
      }
      jQuery("#productAddContainer .date-selector").not("#productTicketEnd").empty();
      if(jQuery("#productTicketEnd").html() != "") {
        jQuery("#productTicketEnd").empty();
      } else {
        var _calendar = new ProductPkgCalendar('productTicketEnd');
        _calendar.extendOnClick = function (obj) {
          var year = jQuery("#year-box").text();
          var month = jQuery("#month-box").text();
          for(var i = 0; i < Months.length; i++) {
            if(month == Months[i]) {
              month = i + 1;
              break;
            }
          }
          var date = (obj.innerHTML ? obj.innerHTML : obj.textContent) + "";
          var dateString = date.length > 1 ? date : "0" + date
          var str_date = year + '-' + month + '-' + dateString;
          jQuery("#productTicketEndTime").val(str_date);
          jQuery("#productTicketEnd").empty();
        };
        productPackage.$setRemoveEvent("productTicketEnd");
      };
    });
    jQuery('#productStartTime').bind('click', function () {
      jQuery('#productStartTime_icon').click();
    });
    jQuery('#productEndTime').bind('click', function () {
      jQuery('#productEndTime_icon').click();
    });
    jQuery('#productTicketEndTime').bind('click', function () {
      jQuery('#productTicketEndTime_icon').click();
    });
    jQuery('#productAddContainer .hour').empty().html(self.createOpt(24));
    jQuery('#productAddContainer .minute').empty().html(self.createOpt(60));
    jQuery('#productAddContainer .second').empty().html(self.createOpt(60));
    jQuery('#productAddContainer .radio_component').bind('click', function () {
      if(!jQuery(this).hasClass('disabled')){
        jQuery('#productAddContainer .radio_component').removeClass('focus').val(false);
        jQuery(this).addClass('focus').val(true);
      }
    })
    // this.listOrgnization();
  },
  getProduct: function (id, callback) {
    if(!id) return;
    var url = aquapaas_host + "/aquapaas/rest/product/" + id;
    url += '?app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    var xhr = this.createXHR();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign('GET', url));
    xhr.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200) {
          var tmp = JSON.parse(this.responseText);
          if(typeof callback == 'function') {
            callback(tmp);
          }
        } else {
          console.error('获取产品信息失败');
        }
      }
    }
    xhr.send();
  },
  edit: function (e, isDisabled) {
    var self = this;
    var id = e.parentNode.getAttribute('data-optid');
    this.getProduct(id, function (tmp) {
      // self.loadData(tmp, function () {
        //open edit page
        // self.openAddPage(true);
      // });
      self.loadData(tmp, null, isDisabled);
      self.openAddPage(true);
    });
  },
  del: function (e) {
    var id = e.parentNode.getAttribute('data-optid');
    var name = e.parentNode.getAttribute('data-optname');
    var self = this;
    this.openDialog('productDel', function () {
      self.bindData($('productDel'), id);
      $('productDelMes').innerHTML = i18n('PRODUCT_DEL_MES_PART_1') + "\"" + name + "\"" + i18n('PRODUCT_DEL_MES_PART_2');
    });
  },
  loadData: function (obj, callback, isDisabled) {
    var self = this;
    if(!obj) {
      var obj = {};
    }
    self.pageLoading = obj;
    jQuery('.div-form-select').hide();
    $('product_id').value = obj.metadata ? (obj.metadata.ext_id || "") : "";
    if(obj.product_id) {
      self.bindData($('product_id'), obj.product_id);
      $("product_id").disabled = true;
    } else {
      self.bindData($('product_id'), "__$ADD");
      $("product_id").disabled = false;
    }
    $('productName').value = obj.title || "";
    $('productType').value = obj.product_type || "";
    $('productName').disabled = !!isDisabled;
    $('productType').disabled = !!isDisabled;
    //activetime
    if(obj.activatetime) {
      var time = new Date(obj.activatetime);
      $('productStartTime').value = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
      $('productStartH').value = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      $('productStartM').value = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      $('productStartS').value = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    } else {
      $('productStartTime').value = "";
      $('productStartH').value = "00";
      $('productStartM').value = "00";
      $('productStartS').value = "00";
    }
    $('productStartTime').disabled = !!isDisabled;
    $('productStartH').disabled = !!isDisabled;
    $('productStartM').disabled = !!isDisabled;
    $('productStartS').disabled = !!isDisabled;
    //deactivatetime
    if(obj.deactivatetime) {
      var time = new Date(obj.deactivatetime);
      $('productEndTime').value = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
      $('productEndH').value = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      $('productEndM').value = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      $('productEndS').value = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    } else {
      $('productEndTime').value = "";
      $('productEndH').value = "00";
      $('productEndM').value = "00";
      $('productEndS').value = "00";
    }
    $('productEndTime').disabled = !!isDisabled;
    $('productEndH').disabled = !!isDisabled;
    $('productEndM').disabled = !!isDisabled;
    $('productEndS').disabled = !!isDisabled;

    $('productAddQuota').value = obj.quota != null ? obj.quota : "";
    $('productAddOvQuota').value = obj.overquota || "";
    $('product_courseID').value = obj.property_type || "";
    // $('product_courseID_input').value = obj.property_id_list ? obj.property_id_list.join(",") : "";
    // $('productAddAssetTags').value = obj.property_tag_list ? obj.property_tag_list.join(",") : "";
    if(obj.property_id_list != null && obj.property_id_list.join(',').length > 0){
      jQuery('#product_property_list_choice').attr('data-key', 'id')
        .val(i18n('PRODUCT_PROPERTY_LIST_TYPE_ID'));
        $('productAddAssetTags').value = obj.property_id_list.join(',');
    } else if(obj.property_tag_list != null && obj.property_tag_list.join(',').length > 0){
      jQuery('#product_property_list_choice').attr('data-key', 'tag')
        .val(i18n('PRODUCT_PROPERTY_LIST_TYPE_TAG'));
      $('productAddAssetTags').value = obj.property_tag_list.join(',');
    } else if(obj.property_product_code_list != null && obj.property_product_code_list.join(',').length > 0){
      jQuery('#product_property_list_choice').attr('data-key', 'code')
        .val(i18n('PRODUCT_PROPERTY_LIST_TYPE_CODE'));
      $('productAddAssetTags').value = obj.property_product_code_list.join(',');
    } else {
      jQuery('#product_property_list_choice').attr('data-key', '').val('');
      jQuery('#productAddAssetTags').val('').attr('placeholder', '');
    }
    $('productAddQuota').disabled = !!isDisabled;
    $('productAddOvQuota').disabled = !!isDisabled;
    $('product_courseID').disabled = !!isDisabled;
    // $('product_courseID_input').disabled = !!isDisabled;
    $('product_property_list_choice').disabled = !!isDisabled;
    $('productAddAssetTags').disabled = !!isDisabled;
    // if(obj.accessorg) {
      // if(obj.accessorg.length > 0) {
        // //self.createOrgItems(obj.accessorg);
        // var totalList = self.getBindData($('productAddorg'));
        // var list = [];
        // for(var i = 0; i < obj.accessorg.length; i++) {
          // var item = obj.accessorg[i];
          // for(var k = 0; k < totalList.length; k++) {
            // if(item == totalList[k].id) {
              // list.push(totalList[k]);
              // break;
            // }
          // }
        // }
        // self.createOrgItemsToCont(list);
      // }
    // } else {
      // $('productAddOrgCont').innerHTML = "";
    // }
    //expire_time
    $('productTicketEndTime').value = "";
    $('productTEndH').value = "00";
    $('productTEndM').value = "00";
    $('productTEndS').value = "00";
    $('productTicketValid').value = "";
    $('productTicketEndTime').disabled = !!isDisabled;
    $('productTEndH').disabled = !!isDisabled;
    $('productTEndM').disabled = !!isDisabled;
    $('productTEndS').disabled = !!isDisabled;
    $('productTicketValid').disabled = !!isDisabled;
    if(obj.expire_time) {
      var time = new Date(obj.expire_time);
      $('productTicketEndTime').value = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
      $('productTEndH').value = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      $('productTEndM').value = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      $('productTEndS').value = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
      jQuery('#productAddContainer .radio_component').removeClass('focus').val(false);
      jQuery('#by_date').addClass('focus').val(true);
    }
    if(obj.activedays != null){
      $('productTicketValid').value = typeof obj.activedays == "number" ? obj.activedays : "";
      if(obj.expire_time == null){
        jQuery('#productAddContainer .radio_component').removeClass('focus').val(false);
        jQuery('#by_days').addClass('focus').val(true);
      }
    }
    $('productBuyLimit').value = typeof obj.repeat_purchase == "number" ? obj.repeat_purchase : 1;
    $('product_Price').value = typeof obj.price == "number" ? obj.price : "";
    $('product_Price_c').value = typeof obj.alt_price == "number" ? obj.alt_price : "";
    $('product_exchange_points').value = obj.score_points || "";
    $('productDescription').value = obj.description || "";
    $('productBuyLimit').disabled = !!isDisabled;
    $('product_Price').disabled = !!isDisabled;
    $('product_Price_c').disabled = !!isDisabled;
    $('product_exchange_points').disabled = !!isDisabled;
    $('productDescription').disabled = !!isDisabled;

    $('productTags').value = '';
    $('pkgPayTypePrice').checked = false;
    $('pkgPayTypeAltPrice').checked = false;
    $('pkgPayTypePoint').checked = false;
    $('productTags').disabled = !!isDisabled;
    $('pkgPayTypePrice').disabled = !!isDisabled;
    $('pkgPayTypeAltPrice').disabled = !!isDisabled;
    $('pkgPayTypePoint').disabled = !!isDisabled;
    if(obj.tags){
        $('productTags').value = obj.tags.join(',');
        if(obj.tags.indexOf('GET_BY_PRICE') > -1){
            $('pkgPayTypePrice').checked = true;
        }
        if(obj.tags.indexOf('GET_BY_ALT_PRICE') > -1){
            $('pkgPayTypeAltPrice').checked = true;
        }
        if(obj.tags.indexOf('GET_BY_CREDIT_POINTS') > -1){
            $('pkgPayTypePoint').checked = true;
        }
    }
    $('pkgPayTypePrice').disabled = !!isDisabled;
    $('pkgPayTypeAltPrice').disabled = !!isDisabled;
    $('pkgPayTypePoint').disabled = !!isDisabled;

    jQuery('#productAddOrgCont').empty();
    if(obj.metadata){
      var metaFrag = document.createDocumentFragment();
      for(var metaKey in obj.metadata){
        if(obj.metadata.hasOwnProperty(metaKey)){
          var metaValue = obj.metadata[metaKey];
          var $meta = jQuery('<div>').addClass('platformItems')
            .append(
              metaKey + ':' + metaValue
            ).attr('data-meta-key', metaKey)
            .attr('data-meta-value', metaValue);
          if(metaKey != 'ext_id'){
            !!isDisabled || $meta.append(
              jQuery('<span>').addClass('close_icon').on('click', function(){
                jQuery(this).parent().remove();
              })
            );
          }
          $meta.appendTo(metaFrag);
        }
      }
      jQuery('#productAddOrgCont').append(metaFrag);
    }

    jQuery('#productAdd_cancel').toggle(!isDisabled);
    jQuery('#productAdd_ok').toggleClass('disabled', !!isDisabled);
    jQuery('#productAddOrgCont_btn').toggle(!isDisabled);
    jQuery('#productAddContainer div.check-box').toggleClass('disabled', !!isDisabled);
    jQuery('#productAddContainer .radio_component').toggleClass('disabled', !!isDisabled);
    jQuery('#productAddOrgCont').toggleClass('disabled', !!isDisabled);
    jQuery('#productStartTime_icon').toggleClass('disabled', !!isDisabled);
    jQuery('#productEndTime_icon').toggleClass('disabled', !!isDisabled);
    jQuery('#productTicketEndTime_icon').toggleClass('disabled', !!isDisabled);

    if(typeof callback == 'function') {
      callback();
    }
  },
  saveData: function (callback) {
    var self = this;
    var url = aquapaas_host + '/aquapaas/rest/product';
    var xhrType = "POST";
    var data = {};
    if(!self.checkData()) {
      return;
    }
    //if there is a id ,must be editting
    if(self.getBindData($('product_id')) != "__$ADD") {
      var id = data["product_id"] = self.getBindData($('product_id'));
      url = aquapaas_host + "/aquapaas/rest/product/" + id;
      xhrType = "PUT";
    }
    //ext_id
    data.metadata = {
      ext_id: $('product_id').value
    };
    jQuery('#productAddOrgCont').children().each(function(m, meta){
      var $meta = jQuery(meta);
      var key = $meta.attr('data-meta-key');
      if((key != '') && (key != 'ext_id')){
        data.metadata[key] = $meta.attr('data-meta-value');
      }
    });
      //type
    data['product_type'] = $('productType').value || '';
    //title
    data['title'] = $('productName').value;
    //description
    data['description'] = $('productDescription').value;
    //activatetime
    var dateStr = self.formDate($('productStartTime').value);
    var sh = $('productStartH').value ? $('productStartH').value : 0;
    var sm = $('productStartM').value ? $('productStartM').value : 0;
    var ss = $('productStartS').value ? $('productStartS').value : 0;
    dateStr.setHours(parseInt(sh));
    dateStr.setMinutes(parseInt(sm));
    dateStr.setSeconds(parseInt(ss));
    data['activatetime'] = dateStr;
    //deactivatetime
    var dateStrE = self.formDate($('productEndTime').value);
    var sh = $('productEndH').value ? $('productEndH').value : 0;
    var sm = $('productEndM').value ? $('productEndM').value : 0;
    var ss = $('productEndS').value ? $('productEndS').value : 0;
    dateStrE.setHours(parseInt(sh));
    dateStrE.setMinutes(parseInt(sm));
    dateStrE.setSeconds(parseInt(ss));
    data['deactivatetime'] = dateStrE;
    //quota
    data['quota'] = parseInt($('productAddQuota').value) || 0;
    //overquota
    data['overquota'] = parseInt($('productAddOvQuota').value);
    //accessorg
    data['accessorg'] = []; //self.getAccessorg();
    //repeat_purchase
    data['repeat_purchase'] = parseInt($('productBuyLimit').value);
    if($('by_date').value || jQuery('#by_date').hasClass("focus")) {
      //expire_time
      var dateStrT = self.formDate($('productTicketEndTime').value);
      var sh = $('productTEndH').value ? $('productTEndH').value : 0;
      var sm = $('productTEndM').value ? $('productTEndM').value : 0;
      var ss = $('productTEndS').value ? $('productTEndS').value : 0;
      dateStrT.setHours(parseInt(sh));
      dateStrT.setMinutes(parseInt(sm));
      dateStrT.setSeconds(parseInt(ss));
      data['expire_time'] = dateStrT;
    } else {
      //activedays
      data['activedays'] = parseInt($('productTicketValid').value);
    }
    //
    if(!isNaN(parseFloat($('product_Price').value))) {
      data['price'] = parseFloat($('product_Price').value);
    }
    if(!isNaN(parseFloat($('product_Price_c').value))) {
      data['alt_price'] = parseFloat($('product_Price_c').value);
    }
    data['score_points'] = parseInt($('product_exchange_points').value);
    //
    data["property_type"] = $('product_courseID').value;
    var listType = jQuery('#product_property_list_choice').attr('data-type');
    var listValueStr = $('productAddAssetTags').value;
    var listValues = [];
    if(listValueStr != ''){
      listValues = listValueStr.split(',');
    }
    switch(listType){
    case 'id':
      data['property_id_list'] = listValues;
      data['property_tag_list'] = [];
      data['property_product_code_list'] = [];
      break;
    case 'tag':
      data['property_id_list'] = [];
      data['property_tag_list'] = listValues;
      data['property_product_code_list'] = [];
      break;
    case 'code':
      data['property_id_list'] = [];
      data['property_tag_list'] = [];
      data['property_product_code_list'] = listValues;
      break;
    }
    // data['property_id_list'] = $('product_courseID_input').value.split(',');
    // if($('productType').value == "USER_IAP_COIN") { //comment out this section for its usage unknown, 2019/11/12
      // data['property_tag_list'] = $('productAddAssetTags').value.split(',');
      // data['property_tag_list'].remove("GET_BY_IAP");
      // if(data['property_tag_list'].length == 1 && data['property_tag_list'][0] == "") {
        // data['property_tag_list'] = ["GET_BY_IAP"]
      // } else {
        // data['property_tag_list'].push("GET_BY_IAP");
      // }
    // } else {
      // data['property_tag_list'] = $('productAddAssetTags').value.split(',');
      // data['property_tag_list'].remove("GET_BY_IAP");
    // }
    //add purchase type -->start
    var datatag = jQuery('input[name="pkgPayType"]:checked');//[];
    // if(!data['price'] && typeof data['price'] != 'number') {
//
    // } else if(data['price'] == 0) {
      // data['alt_price'] = 0;
      // datatag.push("GET_BY_ALT_PRICE");
    // } else if(data['price'] > 0) {
      // if(data['alt_price']) {
        // datatag.push("GET_BY_ALT_PRICE");
      // }
      // if(!data['alt_price']) {
        // datatag.push("GET_BY_PRICE");
      // }
    // }
    // if(data['score_points']) {
      // datatag.push("GET_BY_CREDIT_POINTS");
    // }
    if(datatag.length == 0) {
      self.setErrorInfoMes('购买方式设置错误');
      return;
    }
    data["tags"] = $('productTags').value.split(',');//datatag;
    //add purchase type -->end
    var xhr = this.createXHR();
    if(url.indexOf('?') > -1){
      url += '&app_key=' + paasAppKey;
    } else {
      url += '?app_key=' + paasAppKey;
    }
    url += '&timestamp=' + new Date().toISOString();
    xhr.open(xhrType, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign(xhrType, url));
    xhr.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200) {
          if(typeof callback == 'function') {
            callback();
          }
        } else if(this.status == 400) {
          //
          var mes = "参数为空或者参数格式不正确";
          self.setErrorInfo($('productName'), mes);
        } else if(this.status == 409) {
          var msg = this.getResponseHeader('x-aqua-error-code');
          if(msg == 'product.ext_id.exists') {
            var mes = "产品编号已存在";
            self.setErrorInfo($('product_id'), mes);
          }
          if(msg == 'product.title.exists') {
            var mes = "产品对象名称已存在";
            self.setErrorInfo($('productName'), mes);
          }
        } else if(this.status == 500) {
          //
          var mes = "内部错误";
          self.setErrorInfo($('productName'), mes);
        }
      }
    }
    xhr.send(JSON.stringify(data));
  },
  setErrorInfo: function (e, mes) {
    if(e.nodeType != 1) {
      console.error("错误提示调用失败");
      return;
    }
    e.className = 'error';
    e.onkeydown = function () {
      this.className = "";
      this.onkeydown = "";
    }
    this.openDialog('productError', function () {
      $('productErrorMes').innerHTML = "";
      if(mes) {
        $('productErrorMes').appendChild(document.createTextNode(mes));
      }
    });
  },
  setErrorInfoMes: function (mes) {
    this.openDialog('productError', function () {
      $('productErrorMes').innerHTML = "";
      if(mes) {
        $('productErrorMes').appendChild(document.createTextNode(mes));
      }
    });
  },
  getAccessorg: function () {
    var list = $('productAddOrgCont').getElementsByClassName('platformItems') || [],
      items = [];
    for(var i = 0; i < list.length; i++) {
      items.push(this.getBindData(list[i]).id);
    }
    return items;
  },
  createAccessItems: function () {
    var result = [];
    var inputs = $('productAddorg').getElementsByTagName('input') || [];
    for(var i = 0; i < inputs.length; i++) {
      if(inputs[i].checked == true) {
        result.push(inputs[i].getAttribute('data-id'));
      }
    }
    var constData = this.getBindData($('productAddorg'));
    var list = result.map(function (v) {
      for(var i = 0; i < constData.length; i++) {
        if(constData[i].id == v) {
          return constData[i];
        }
      }
    });
    var self = this;
    var plist = $('productAddOrgCont').getElementsByClassName('platformItems');
    list.map(function (v, i) {
      //修改旧的参数
      for(var i = 0; i < plist.length; i++) {
        var item = plist[i];
        if(self.getBindData(item).id === v.id) {
          return;
        }
      }
      //创建新的参数
      var text = v.name;
      var item = document.createElement('div');
      item.className = 'platformItems';
      item.innerHTML = text + '<span onclick="productPackage.removeParamsItem(this)" class="close_icon"></span>';
      $('productAddOrgCont').appendChild(item);
      self.bindData(item, v);
    });
  },
  //load  write orginization
  createOrgItemsToCont: function (list) {
    if(!list) {
      list = [];
    }
    $('productAddOrgCont').innerHTML = "";
    list.map(function (v, i) {
      //创建新的参数
      var text = v.name;
      var item = document.createElement('div');
      item.className = 'platformItems';
      item.innerHTML = text + '<span onclick="productPackage.removeParamsItem(this)" class="close_icon"></span>';
      $('productAddOrgCont').appendChild(item);
      self.bindData(item, v);
    });
  },
  listOrgnization: function () {
    var self = this;
    var url = my.aqua.restRoot + my.aqua.xgxPath,
      xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    my.aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
    xhr.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200) {
          var top_org_OID = JSON.parse(xhr.responseText).objectID;
          self.listOrgnizationCallback(top_org_OID);
        } else {
          console.error('获取组织失败-总公司');
        }
      }
    }
    xhr.send();
  },
  listOrgnizationCallback: function (top_org_OID) {
    var self = this;
    var url_getBranchCompany = my.aqua.restRoot + "/cdmi_query/",
      method = "PUT",
      xhr_getBranchCompany = new XMLHttpRequest();
    xhr_getBranchCompany.open(method, url_getBranchCompany, false);
    my.aqua.addXHRHeaderRequest(xhr_getBranchCompany, method, url_getBranchCompany, "application/cdmi-container")
    xhr_getBranchCompany.onreadystatechange = function () {
      if(this.readyState == 4) {
        if(this.status == 200) {
          var companyList = [];
          var results = JSON.parse(xhr_getBranchCompany.responseText).container;
          for(var i = 0; i < results.length; i++) {
            var item = results[i];
            companyList.push({
              name: item.metadata.company_name,
              id: item.metadata.company_tifOrgCode
            });
          }
          companyList.unshift({
            name: i18n('PRODUCTPKG_ACCESSORG_ALL'),
            id: 'ALL'
          });
          self.bindData($('productAddorg'), companyList);
          self.createOrgItems(companyList);
        } else {
          console.error('获取组织失败-分公司');
        }
      }
    }
    xhr_getBranchCompany.send(JSON.stringify({
      cdmi_scope_specification: [{
        parentURI: "== " + my.aqua.xgxPath,
        metadata: {
          company_type: "== 0",
          company_status: "== 1",
          company_parentObjectID: "== " + top_org_OID
        }
            }],
      cdmi_results_specification: {
        objectName: "*",
        metadata: {
          company_name: "*",
          company_tifOrgCode: "*"
        }
      }
    }));
  },
  resetOrgnization: function () {
    var inputs = $('productAddorg').getElementsByTagName('input') || [];
    for(var i = 0; i < inputs.length; i++) {
      inputs[i].checked = false;
    }
  },
  checkData: function () {
    var self = this;
    //旧版本没有编号属性兼容if(
    if($('product_id').disabled == false && !(/^[a-zA-Z\d]+$/).test($('product_id').value)) {
      var mes = "产品包编号不能为空且只能输入字母和数字";
      self.setErrorInfoMes(mes);
      return false;
    }
    if(!$('productName').value) {
      var mes = "产品包名称不能为空";
      self.setErrorInfoMes(mes);
      return false;
    }
    var dateStr = $('productStartTime').value;
    if(!dateStr) {
      var mes = "生效时间为空";
      self.setErrorInfoMes(mes);
      return false;
    }
    var dateStrE = $('productEndTime').value;
    if(!dateStrE) {
      var mes = "失效时间为空";
      self.setErrorInfoMes(mes);
      return false;
    }
    // var value = parseInt($('productAddQuota').value);
    // if(isNaN(value) || value < 0) {
      // var mes = "产品包配额必须为大于0的数字";
      // self.setErrorInfoMes(mes);
      // return false;
    // }
    if($('productTicketEndTime').value == '' && $('productTicketValid').value == '') {
      var mes = "Ticket失效时间不能和Ticket有效期同时为空";
      self.setErrorInfoMes(mes);
      return false;
    }
    if($('product_Price').value != '' && isNaN(parseFloat($('product_Price').value))) {
      var mes = "产品原价为大于或者等于0的数字";
      self.setErrorInfoMes(mes);
      return false;
    }
    var pcc = $('product_Price_c').value;
    if(pcc !== "" && $('product_Price').value == '') {
      var mes = "请输入原价";
      self.setErrorInfoMes(mes);
      return false;
    }
    if(pcc !== "" && isNaN(pcc)) {
      var mes = "产品现价只能为大于或者等于0的数字";
      self.setErrorInfoMes(mes);
      return false;
    }
    if($('product_exchange_points').value != '' && isNaN(parseFloat($('product_exchange_points').value))) {
      var mes = "积分不能为非数字";
      self.setErrorInfoMes(mes);
      return false;
    }
    return true;
  },
  createOrgItems: function (items) {
    var result = [];
    if(items instanceof Array) {
      result = items.map(function (v, index) {
        return '<div class="table-body-item"><div class="checkboxCont"><input type="checkbox" data-id="' + v.id + '" /></div><div class="checklabelCont">' + v.name + '</div></div>'
      });
    }
    $("productAddorgItems").innerHTML = result.join("");
  },
  createOpt: function (length) {
    var arr = "";
    for(var i = 0; i < length; i++) {
      var str = i < 10 ? "0" + i : i;
      arr = arr + "<option value='" + str + "'>" + str + "</option>"
    }
    return arr;
  },
  removeParamsItem: function (e) {
    var item = e.parentNode;
    this.removeBindData(item);
    //removetoolpop
    if($('platform_tooltip')) {
      $('platform_tooltip').parentNode.removeChild($('platform_tooltip'));
    }
    item.parentNode.removeChild(item);
  },
  openDialog: function (id, callback) {
    var _self = this;
    // if (!this.Store.dialogs) {
    //     this.Store.dialogs = [];
    // }
    // if (this.Store.dialogs.length > 0 && deep === true) {
    //     this.Store.dialogs.map(function (v) {
    //         _self.closeDialog(v);
    //     });
    //     this.Store.dialogs = [];
    // }
    $(id + 'Back').style.display = 'block';
    $(id).style.display = 'block';
    // this.Store.dialogs.push(id);
    if(typeof callback == 'function') {
      callback();
    }
  },
  closeDialog: function (id, callback) {
    $(id + 'Back').style.display = 'none';
    $(id).style.display = 'none';
    if(typeof callback == 'function') {
      callback();
    }
  },
  initDataBase: function () {
    this.$data = {
      index: 0,
      list: []
    };
  },
  bindData: function (e, v) {
    if(e.nodeType != 1) {
      console.log('element ' + e.id + ' is not a element node');
      return;
    }
    if(!this.$data) this.initDataBase();
    if(this.getBindData(e) !== false) {
      var key = e.getAttribute('data-key');
      var _key = parseInt(key);
      if(isNaN(_key)) {
        console.log('error in getBindData,key is ' + key);
        return;
      }
      this.$data.list[_key] = v;
    } else {
      var __key = this.$data.index;
      this.$data.list[__key] = v;
      e.setAttribute('data-key', __key);
      this.$data.index = this.$data.list.length;
    }
  },
  getBindData: function (e) {
    var key = e.getAttribute('data-key');
    var _key = parseInt(key);
    if(isNaN(_key)) {
      return false;
    }
    return this.$data.list[_key];
  },
  removeBindData: function (e) {
    var key = e.getAttribute('data-key');
    var _key = parseInt(key);
    if(isNaN(_key)) {} else {
      this.$data.list[_key] = "";
    }
    e.setAttribute('data-key', 'NULL');
  },
  conflict: function () {
    this._namespace = {};
    this._namespace.flag = true;
    if(window.$) {
      this._namespace.$ = window.$;
    }
    window.$ = function (id) {
      return document.getElementById(id);
    }
  },
  relieve: function () {
    if(this._namespace.flag) {
      window.$ = this._namespace.$;
    }
  },
  formatdate: function (time) {
    var createTime = new Date(time);
    var time_str = createTime.getFullYear() + "-" + (createTime.getMonth() + 1) + "-" + createTime.getDate() + " ";
    var h = createTime.getHours() < 10 ? "0" + createTime.getHours() : createTime.getHours();
    var m = createTime.getMinutes() < 10 ? "0" + createTime.getMinutes() : createTime.getMinutes();
    var s = createTime.getSeconds() < 10 ? "0" + createTime.getSeconds() : createTime.getSeconds();
    time_str = time_str + h + ":" + m + ":" + s;
    return time_str;
  },
  //true 表示无点击事件，false表示有
  setBtnDisable: function (id, bools) {
    if(bools) {
      var func = $(id).onclick;
      this.bindData($(id), func);
      $(id).onclick = '';
    } else {
      var func = this.getBindData($(id));
      if(typeof func == 'function') {
        $(id).onclick = func;
        this.removeBindData($(id));
      }
    }
  },
  formDate: function (str) {
    var arr = str.split('-');
    return new Date(parseInt(arr[0]), (parseInt(arr[1]) - 1), parseInt(arr[2]), 0, 0, 0);
  },
  createXHR: function () {
    var xhr = new XMLHttpRequest();
    return xhr;
  },
  setProductTags: function(){
    var tags = [];
    var productType = $('productType').value;
    if(productType != ''){
      tags.push(productType);
    }
    if($('pkgPayTypePrice').checked){
      tags.push('GET_BY_PRICE');
    }
    if($('pkgPayTypeAltPrice').checked){
      tags.push('GET_BY_ALT_PRICE');
    }
    if($('pkgPayTypePoint').checked){
      tags.push('GET_BY_CREDIT_POINTS');
    }
    $('productTags').value = tags.join(',');
  },
  setProductTypeToTags: function(prevType, newType){
    var tags = [];
    var prevTags = $('productTags').value;
    if(prevTags != ''){
      tags = prevTags.split(',');
    }
    if(prevType != null){
      var prevIndex = tags.indexOf(prevType);
      if(prevIndex > -1){
        tags.splice(prevIndex, 1, newType);
      } else {
        tags.push(newType);
      }
    } else {
      tags.push(newType);
    }
    $('productTags').value = tags.join(',');
  },
  setPriceTypeToTags: function(priceType, toggle){
    var tags = [];
    var prevTags = $('productTags').value;
    if(prevTags != ''){
      tags = prevTags.split(',');
    }
    var index = tags.indexOf(priceType);
    if(!toggle && index > -1){
      tags.splice(index, 1);
    } else if(toggle && index == -1){
      tags.push(priceType);
    }
    $('productTags').value = tags.join(',');
  },
  openDefTypeDialog: function(type){
      var self = this;
      var dialog = new PopupDialog({
        url: 'content/productPackage/defTypeDialog.html',
        width: 670,
        height: 390,
        context: {},
        callback: function(){
          var $ = jQuery;
          self.getMyDefTypes(function(types){
            var typelist = types[type] || [];
            var frag = document.createDocumentFragment();
            var index = 0;
            $.each(typelist, function(i, item){
              index += 1;
              $('<div>').addClass('pkg-type-def-row')
                .append(
                  $('<div>').addClass('pkg-type-def-index').append(index)
                ).append(
                  $('<input type="text">').prop('value', item).addClass('pkg-type-def-input')
                    .attr('placeholder', '在此填写参数')
                ).appendTo(frag);
            });
            $('#productPkgTypeAdd').before(frag).off().on('click', function(){
              var newindex = $('.pkg-type-def-index').length + 1;
              var newrow = $('<div>').addClass('pkg-type-def-row')
                .append(
                  $('<div>').addClass('pkg-type-def-index').append(newindex)
                ).append(
                  $('<input type="text">').addClass('pkg-type-def-input').attr('placeholder', '在此填写参数')
                );
              $(this).before(newrow);
            }).click();
            $('#pkgTypeDefSubmit').off().on('click', function(){
              var props = [];
              $('.pkg-type-def-input').each(function(i, input){
                if(input.value != ''){
                  props.push(input.value);
                }
              });
              types[type] = props;
              var url = aquapaas_host + '/aquapaas/rest/userdata/' + paasAppKey + '/personaldefines/product';
              url += '?user_id=' + my.paas.user_id;
              url += '&access_token=' + my.paas.access_token;
              url += '&app_key=' + paasAppKey;
              url += '&timestamp=' + new Date().toISOString();
              $.ajax({
                type: 'PUT',
                url: url,
                contentType: 'text/plain',
                headers: {
                  'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
                },
                data: JSON.stringify(types)
              }).done(function(){
                self.updateDefTypes();
                dialog.close();
              }).fail(function(xhr){
                alert(xhr.statusText);
              });
            });
          });
        }
      });
      dialog.open();
  },
  getMyDefTypes: function(callback){
    var types = {};
    var url = aquapaas_host + '/aquapaas/rest/userdata/' + paasAppKey + '/personaldefines/product';
    url += '?user_id=' + my.paas.user_id;
    url += '&access_token=' + my.paas.access_token;
    url += '&app_key=' + paasAppKey;
    url += '&timestamp=' + new Date().toISOString();
    jQuery.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      headers: {
        'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
      }
    }).done(function(data){
      types = data;
    }).always(function(){
      callback(types);
    });
  },
  updateDefTypes: function(){
    this.getMyDefTypes(function(types){
      var prodTypes = types.product_type || [];
      var prodOps = document.createDocumentFragment();
      prodTypes.forEach(function(prodType){
        jQuery('<div>').attr('value', prodType).text(prodType).appendTo(prodOps);
      });
      jQuery('<div>').attr('value', '').text('自定义').appendTo(prodOps);
      jQuery('#productTypeSelect').empty().append(prodOps);

      var propTypes = types.property_type || [];
      var propOps = document.createDocumentFragment();
      propTypes.forEach(function(propType){
        jQuery('<div>').attr('value', propType).text(propType).appendTo(propOps);
      });
      jQuery('<div>').attr('value', '').text('自定义').appendTo(propOps);
      jQuery('#product_courseID_Select').empty().append(propOps);
    });
  },
  openDefMetadata: function(){
    var self = this;
    var dialog = new PopupDialog({
      url: 'content/productPackage/defMetadataDialog.html',
      width: 670,
      height: 390,
      context: {},
      callback: function(){
        var $ = jQuery;
        $('#productMetaAdd').off().on('click', function(){
          var newindex = $('.pkg-type-def-index').length + 1;
          var newrow = $('<div>').addClass('pkg-type-def-row')
            .append(
              $('<div>').addClass('pkg-type-def-index').append(newindex)
            ).append(
              $('<input type="text">').addClass('pkg-meta-def-key').attr('placeholder', '在此填写Key')
            ).append(
              $('<input type="text">').addClass('pkg-meta-def-value').attr('placeholder', '在此填写Key值')
            );
            $(this).before(newrow);
        }).click();
        $('#pkgMetaDefSubmit').on('click', function(){
          var meta = {};
          $('.pkg-type-def-row').each(function(i, item){
            var $row = $(item);
            meta[$row.children('.pkg-meta-def-key').val()] = $row.children('.pkg-meta-def-value').val();
          });
          var frag = document.createDocumentFragment();
          var $parent = $('#productAddOrgCont');
          for(var prop in meta){
            if(meta.hasOwnProperty(prop) && (prop != '')){
              if(prop == 'ext_id'){
                continue;
              }
              var value = meta[prop];
              $parent.children('div[data-meta-key="'+ prop +'"]').remove();
              $('<div>').addClass('platformItems')
                .attr('data-meta-key', prop)
                .attr('data-meta-value', value)
                .append(prop + ':' + value)
                .append(
                  $('<span>').addClass('close_icon').on('click', function(){
                    $(this).parent().remove();
                  })
                ).appendTo(frag);
            }
          }
          $parent.append(frag);

          dialog.close();
        });
      }
    });
    dialog.open();
  }
};