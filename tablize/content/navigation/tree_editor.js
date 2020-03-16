var treeEditor = (function($, Tree, Alert){
  //=======navigation tree的只读属性==========
  const readOnlyBooleanMetas = ['readonly', 'needSetNavPath', 'is_primary', 'need_release', 'is_active_release']
  const readOnlyMetas = readOnlyBooleanMetas.concat([/*tree标签*/'source', 'version', 'version_desc', 'audit_tree_version', 'audit_tree_version_desc', 'audit_tree_audit_time','audit_tree_audit_status', 'last_snapshot_version', 'audit_status', 'release_status', 'audit_time', 'release_time', 'primary_tree_id',/*node标签*/'tags', 'entryType'])
  //=========================================
  let Pane = {
    tree: null,
    curFocus: null,
    tmpAttr: null,
    init() {
      this.curFocus = null;
      var {metadata_public: {need_release}} = Model.tree_data;
      var {accessKeyId, secretAccessKey} = my.aqua;
      var haveAqua = !!(accessKeyId && secretAccessKey);
      var dom = `<div class='_frame _flex' id='navigation_tree_editor'>
      <div class='header _flex'>
      <div class='header_item logo'>${i18n('NAVIGATE_MNG')}</div>
      <div class='header_item span'></div>
      ${need_release ? `<div class="header_item btn icon" id="navigation_audit_tree">${i18n('NAVIGATE_AUDIT')}</div>`: ''}
      <div class='header_item btn icon' id='navigation_create_folder'>${i18n('NAVIGATE_EDITOR_CREATEFOLDER')}</div>
      </div>
      <div class='body'>
        <ul id='navigation_nav_tree' class='zTree'></ul>
        <div id='navigation_tree_detail'>
          <div class='tabs'>
            <div class='tab active' name='attr' style='display: none;'>${i18n('NAVIGATE_EDITOR_TREEATTR')}</div>
            ${haveAqua ? `<div class='tab' name='file_attr' style='display: none;'>${i18n('NAVIGATE_FOLDER_ATTR')}</div>`: ``}
            <div class='tab' name='bundle' style='display: none;'>${i18n('NAVIGATE_EDITOR_BUNDLEMANUAL')}</div>
            <div class='tab' name='asset_search' style='display: none;'>${i18n('NAVIGATE_EDITOR_BUNDLESEARCH')}</div>
            <div class='tab' name='folder' style='display: none;'>${i18n('NAVIGATE_EDITOR_BUNDLELIST')}</div>
            ${need_release? `<div class='tab' name='vers' style='display: none;'>${i18n('NAVIGATE_EDITOR_VERS')}</div>
            <div class='tab' name='audit_his' style='display: none;'>${i18n('NAVIGATE_EDITOR_AUDITHIS')}</div>
            <div class='tab' name='his_ver' style='display: none;'>${i18n('NAVIGATE_EDITOR_HISVER')}</div>` : ``}
          </div>
          <div class='tab-ctn'>
            <div name='attr'></div>
            <div name='file_attr' style='display: none;'></div>
            <div name='bundle' style='display: none'></div>
            <div name='asset_search' style='display: none'></div>
            <div name='folder' style='display: none'></div>
            <div name='vers' style='display: none'></div>
            <div name='audit_his' style='display: none'></div>
            <div name='his_ver' style='display: none'></div>
          </div>
        </div>
      </div>
      <div class='foot'>
        <div class='btn _cancel'>${i18n('NAVIGATION_CANCEL')}</div>
        <div class='btn _confirm'>${i18n('NAVIGATION_SAVE')}</div>
      </div>
      </div>`;
      $(dom).appendTo($('#navigation_nav_mng'));
      this.bindEvents();
      this.initWidgets();
      //初始化 aqua
      var {accessKeyId, secretAccessKey} = my.aqua;
      if (accessKeyId && secretAccessKey) {
      var aqua = new TicketAquaUtil({
          host: aqua_host,
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        domainURI: LOGIN_AQUA_DOMAIN_URI
      })
      this.aqua = aqua
      }
    },
    bindEvents() {
      $('#navigation_tree_editor')
      .on('click', '#navigation_create_folder', () => {
        var dialog = new navigation_create_folder({
          app_key: Model.tree_data.creator_app_key,
          path: Pane.curFocus.getPath().map((item)=>item.name).join('/'),
          confirmFn: ()=>{
            Pane.refreshTree();
          }
        })
      })
      .on('click', '#navigation_audit_tree', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var {id, name} = Model.tree_data
          var dialog = new NavTreeAudit({
            id: 'Tree_' + name + new Date().getTime(),
            name: name,
            callback: () => {
              Pane.refreshTree();
            }
          })
        }
      })
      .on('click', '._cancel', () => {
        this.close();
      })
      .on('click', '.foot ._confirm', () => {
        API.updateNode(() => {
          Pane.refreshTree();
        })
      })
      .on('click', '.node', ({currentTarget}) => {
        var index = $(currentTarget).data('index');
        var data = this.tree.getNode();
      })
      .on('click', '.node_del', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var node = $(currentTarget)
          var data = node.data('id');
          var dialog = new Alert({
            message: i18n('NAVIGATE_EDITOR_DELETEINFO') + i18n('NAVIGATE_EDITOR_DELHIT').replace('{{}}', data.data.name),
            confirmFn: (callback) => {
              API.delNode(data, () => {
                callback && callback();
            Pane.refreshTree();
          })
        }
      })
        }
      })
      .on('click', '.tabs .tab', ({target, currentTarget}) => {
        if (target == currentTarget) {
          var type = $(currentTarget).attr('name');
          $(currentTarget).addClass('active').siblings().removeClass('active')
          $('#navigation_nav_mng .tab-ctn > div[name=' + type + ']').show().siblings().hide();//change ctn status
          //保存缓存信息
          Pane.tmpAttr = API.deepClone(Pane.curFocus.data, Pane.tmpAttr)
          if (Pane.attrPane) {
            API.emptyMetas(Pane.tmpAttr, 'attr')
            Pane.tmpAttr = API.deepClone(Pane.tmpAttr, Pane.attrPane.getValue())
          }
          if (Pane.fileAttrPane) {
            API.emptyMetas(Pane.tmpAttr, 'file')
            Pane.tmpAttr = API.deepClone(Pane.tmpAttr, Pane.fileAttrPane.getValue())
          }
          switch (type) {
            case 'attr':
            Pane.loadAttrFrame();
            break;
            case 'vers':
              Pane.loadVersFrame();
            break;
            case 'audit_his':
              Pane.loadAuditFrame();
            break;
            case 'his_ver':
              Pane.loadHisVerFrame();
            break;
            case 'file_attr':
              Pane.loadFileAttrFrame();
            break;
            case 'bundle':
            Pane.loadBundleFrame();
            break;
            case 'folder':
            Pane.loadFolderFrame();
            break;
            case 'asset_search':
              Pane.loadAssetSearchFrame();
              break;
            default:
            }
          }
        })
    },
    close(){
      $('#navigation_tree_editor').remove();
    },
    initWidgets() {
      Tree.init($('#navigation_nav_tree'), Model.treeSetting(), Model.tree(Model.tree_data));
      Pane.tree = Tree.getZTreeObj('navigation_nav_tree');
    },
    treeClick(e, treeId, treeNode, clickFlag) {
      if ($(e.target).hasClass('node_del')) {
        return
      }
      Pane.curFocus = treeNode;
      Pane.attrPane = Pane.fileAttrPane = null;
      Pane.tmpAttr = null;
      var activePane = $('#navigation_tree_editor .tabs .tab.active').attr('name');
      let {node_class, is_manual} = Pane.curFocus.data;
      var tabs = ['attr','file_attr', 'folder']
      switch (node_class) {
        case 'folder':
          $('#navigation_tree_editor .tabs .tab[name=attr]').html(i18n('NAVIGATE_EDITOR_FOLDERATTR'))
          // $('#tree_editor .tabs .tab[name=vers]').hide()
          // $('#tree_editor .tabs .tab[name=audit_his]').hide()
          // $('#tree_editor .tabs .tab[name=his_ver]').hide()
          break;
        default:
          tabs.push('vers','audit_his','his_ver')
          $('#navigation_tree_editor .tabs .tab[name=attr]').html(i18n('NAVIGATE_EDITOR_TREEATTR'))
          // $('#tree_editor .tabs .tab[name=vers]').show()
          // $('#tree_editor .tabs .tab[name=audit_his]').show()
          // $('#tree_editor .tabs .tab[name=his_ver]').show()
      }
      switch (is_manual) {
        case true:
          // $('#tree_editor .tabs .tab[name=bundle]').show().html(i18n('NAVIGATE_EDITOR_BUNDLEMANUAL'))
          $('#navigation_tree_editor .tabs .tab[name=bundle]').html(i18n('NAVIGATE_EDITOR_BUNDLEMANUAL'))
          tabs.push('bundle')
          break;
        case undefined:
          // $('#tree_editor .tabs .tab[name=bundle]').hide();
          break;
        default:
          // tabs.push('bundle')
          // $('#tree_editor .tabs .tab[name=bundle]').show().html(i18n('NAVIGATE_EDITOR_BUNDLEAUTO'))
          $('#navigation_tree_editor .tabs .tab[name=bundle]').html(i18n('NAVIGATE_EDITOR_BUNDLEAUTO'))
      }
      tabs.push('asset_search');
      $('#navigation_tree_editor .tabs .tab').hide()
      for (var i = 0; i < tabs.length; i++) {
        $('#navigation_tree_editor .tabs .tab[name=' + tabs[i] + ']').show()
      }
      if (!tabs.includes(activePane)) {
        activePane = tabs[0]
        $('#navigation_tree_editor .tabs .tab[name=' + activePane + ']').click();
      } else {
        switch (activePane) {
          case 'attr':
            Pane.loadAttrFrame();
          break;
          case 'file_attr':
            Pane.loadFileAttrFrame();
          break;
          case 'bundle':
            Pane.loadBundleFrame();
          break;
            case 'asset_search':
              Pane.loadAssetSearchFrame();
            break;
          case 'folder':
            Pane.loadFolderFrame();
          break;
            case 'vers':
              Pane.loadVersFrame();
            break;
            case 'audit_his':
              Pane.loadAuditFrame();
            break;
            case 'his_ver':
              Pane.loadHisVerFrame();
            break;
          default:
        }
      }
    },
    loadAttrFrame() {
      var frameOpts = {
          el: '.tab-ctn div[name=attr]',
          type: Pane.curFocus.level == 0?'tree':'',
          node: Pane.curFocus,
          tree: Model.tree_data,
          confirmFn: () => {
            Pane.refreshTree();
          }
      }
      if (this.tmpAttr) {
        frameOpts.data = this.tmpAttr
      }
      var folder_list = new node_attr(frameOpts);
        this.attrPane = folder_list
    },
    loadVersFrame() {
      var frameOpts = {
        el: '.tab-ctn div[name=vers]',
        data: Pane.curFocus.data,
        confirmFn: () => {
          Pane.refreshTree();
        }
      }
      var folder_list = new node_version(frameOpts);
    },
    loadFileAttrFrame() {
      var frameOpts = {
        el: '.tab-ctn div[name=file_attr]',
        type: Pane.curFocus.level == 0?'tree':'',
          node: Pane.curFocus.data,
        path: Pane.curFocus.getPath().map(item=>item.name).join('/'),
          tree: Model.tree_data,
          confirmFn: () => {
            Pane.refreshTree();
          }
      }
      if (this.tmpAttr) {
        frameOpts.data = this.tmpAttr
      }
      var folder_list = new node_file_attr(frameOpts)
      this.fileAttrPane = folder_list
    },
    loadBundleFrame() {
      var data = Pane.curFocus.data;
      var {objects_url, objects_url_script, children = [], is_manual} = data;
      var manualType = is_manual ? 'manul': ''
      var folder_list = new node_bundle({
        el: '.tab-ctn div[name=bundle]',
        type: manualType,
        parentNode: data,
        node: Pane.curFocus,
        tree: Model.tree_data,
        confirmFn: ()=>{
          Pane.refreshTree();
        }
      });
    },
    loadFolderFrame() {
      var data = Pane.curFocus.data;
      var folder_list = new node_folder({
        el: '.tab-ctn div[name=folder]',
        parentNode: data,
        tree: Model.tree_data,
        path: Pane.curFocus.getPath().map(item => item.name).join('/'),
        confirmFn: ()=>{
          Pane.refreshTree();
        }
      });
    },
    loadAuditFrame(){
      var data = Pane.curFocus.data;
      var folder_list = new node_audit({
        el: '.tab-ctn div[name=audit_his]',
        parentNode: data,
        tree: Model.tree_data,
        path: Pane.curFocus.getPath().map(item => item.name).join('/'),
        confirmFn: ()=>{
          Pane.refreshTree();
        }
      });
    },
    loadHisVerFrame(){
      var data = Pane.curFocus.data;
      var folder_list = new node_his({
        el: '.tab-ctn div[name=his_ver]',
        parentNode: data,
        tree: Model.tree_data,
        path: Pane.curFocus.getPath().map(item => item.name).join('/'),
        confirmFn: ()=>{
          Pane.refreshTree();
        }
      });
    },
    loadAssetSearchFrame() {
      var data = Pane.curFocus.data;
      var folder_list = new node_search({
        el: '.tab-ctn div[name=asset_search]',
        parentNode: data
      })
    },
    /**
     * 刷新左侧树
     * 2019-04-25修复左侧树元节点添加目录时页面会死掉的问题
     */
    refreshTree() {
      let {tree, curFocus} = Pane,
          parentNode = curFocus.getParentNode();
      if (parentNode) {
        tree.reAsyncChildNodes(curFocus.getParentNode(), 'refresh', false, () => {
          var node = tree.getNodeByParam('id', curFocus.id)
        if (node) {
          // $('#nav_tree').find('#' + node.tId + '_span').click();
            node.needClick = true
        tree.reAsyncChildNodes(node, 'refresh', false, () => {
            delete node.needClick;
            // tree.expandNode(node, curFocus.open, false, true, true);
        });
        } else {
          node = parentNode
          // $('#nav_tree').find('#' + node.tId + '_span').click();
        }
      });
      } else {
        // 首节点获取不到ParantNode因此在获取数据请求的方法中无法获取到treeNode
        var node = tree.getNodeByParam('id', curFocus.id)
        // $('#nav_tree').find('#' + node.tId + '_span').click();
        node.needClick = true;
        tree.reAsyncChildNodes(node, 'refresh', false, () => {
          delete node.needClick;
          // tree.expandNode(node, curFocus.open, false, true, true);
        });
      }
    },
    treeDelIcon(treeId, treeNode) {
      var node = $('#' + treeNode.tId).find('a');
      var icon = $('<div class="node_del"></div>').data('id', treeNode)
      node.append(icon)
    }
  };
  let API = {
    getTree() {
      var data = Model.tree_data;
      let method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + data.name + '/by_id:'+data.id,
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('enable=true')
      urlParam.push('app_key=' + data.creator_app_key)//应用级权限
      urlParam.push('timestamp=' + new Date().toISOString())//应用级权限
      urlParam.push('tree_version=00')
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, state, xhr) => {
        if (state == 'success') {
          Pane.tree.reAsyncChildNodes(Pane.tree.getNodes()[0], 'refresh', true)
          $("#navigation_nav_tree").find('#' + Pane.tree.getNodes()[0].tId + '_span').click();
        }
      })
    },
    getURL(treeId, treeNode){
      var {name, creator_app_key} = Model.tree_data;
      var url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:'+treeNode.id,
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('app_key=' + creator_app_key)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('tree_version=00')
      return url + '?' + urlParam.join('&');
    },
    updateNode(callback) {
      let method = 'Put',
          isTree = Pane.curFocus.data.name == Model.tree_data.name,
          data = Model.getAttrData(isTree),
          {path=Model.tree_data.name} = Pane.curFocus.data,
          {creator_app_key} = Model.tree_data,
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '?app_key=' + creator_app_key;
      delete data.path;
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(data)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          // API.updateFolder(path, resp.name, callback)
          callback && callback();
        }
      })
    },
    delNode(data, callback) {
      let {name, creator_app_key} = Model.tree_data,
          {id} = data,
          path = data.getPath().map(item => item.name).join('/'),
          method = 'Delete',
          // url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:' + id + '?app_key=' + creator_app_key + '&timestamp=' + new Date().toISOString(),
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '?app_key=' + creator_app_key + '&timestamp=' + new Date().toISOString();
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          API.delFolder(path, callback)
          // callback && callback();
        }
      })
    },
    delFolder(name, callback) {
      if (Pane.aqua) {
      Pane.aqua.getContainer({
        path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT + name
      }).delObj();
      }
      callback && callback();
    },
    deepClone(desc, src) {
      var ret = null;
      if ($.isEmptyObject(desc)) {
        ret = {}
      } else {
        ret = this.deepClone({}, desc)
      }
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          switch (Object.prototype.toString.call(src[key])) {
            case '[object String]':
            case '[object Boolean]':
            case '[object Function]':
            case '[object Number]':
            case '[object Null]':
            case '[object Undefined]':
              ret[key] = src[key]
              break;
            case '[object Array]':
              ret[key] = [];
              for (var i = 0; i < src[key].length; i++) {
                var item = this.deepClone({}, {value: src[key][i]}).value
                ret[key].push(item)
              }
              break;
            default://object
              ret[key] = this.deepClone(ret[key], src[key])
          }
        }
      }
      return ret;
    },
    emptyMetas(data, type) {
      var isTree = Model.tree_data.name == Pane.curFocus.data.name
      switch (type) {
        case 'file':
          for (var key in data.metadata) {
            if (data.metadata.hasOwnProperty(key) && key.indexOf('FILE_') == 0) {
              delete data.metadata[key]
            }
          }
          if (!isTree) {
            for (var key in data.metadata_public) {
              if (data.metadata_public.hasOwnProperty(key) && key.indexOf('FILE_') == 0 && !readOnlyMetas.includes(key)) {
                delete data.metadata_public[key]
              }
            }
          }
          break;
        default:
          for (var key in data.metadata) {
            if (data.metadata.hasOwnProperty(key) && key.indexOf('FILE_') !== 0) {
              delete data.metadata[key]
            }
          }
          if (!isTree) {
            for (var key in data.metadata_public) {
              if (data.metadata_public.hasOwnProperty(key) && key.indexOf('FILE_') !== 0 && !readOnlyMetas.includes(key) && key !== 'app_key') {
                delete data.metadata_public[key]
              }
            }
          }
      }
    },
    justifyIndex(data, index, callback) {
      let method = 'Put',
      {name, creator_app_key} = Model.tree_data,
      {id} = data,
      url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:' + id,
      urlParam = [],
      putData = {
        index: parseInt(index)
      }
      urlParam.push('updatefield=index')
      urlParam.push('app_key=' + creator_app_key)
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(putData)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    }
  };
  let Model = {
    tree_data: null,
    tree(data) {
      let dataset = [{
        name: data.name,
        id: data.id,
		isParent: true,
        open: true,
        data: data,
        children: []
      }];
      let nodes = data.children||[];
      addNode(dataset[0], nodes);

      function addNode(parentNode, list) {
        for (var i = 0; i < list.length; i++) {
          let child = list[i]
          var item = JSON.parse(JSON.stringify(child))
          if(child.node_class == 'folder') {
            var node = {
              name: item.name,
              id: item.id,
              data: item,
              isParent: true,
              children: []
            }
            parentNode.children.push(node)
            if (child.children_count > 0) {
              addNode(node, child.children)
            }
          } else if(child.node_class == 'asset' || children.node_class == 'bundle'){
            var node = {
              name: item.name,
              id: item.id,
              data: item,
              isParent: true,
              children: []
            }
            parentNode.children.push(node)
          }
        }
      }
      return dataset;
    },
    treeSetting(){
      return {
        async: {
          enable: true,
          url: API.getURL,
          type: 'Get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          dataFilter: (treeId, parentNode, rsp)=>{
            var ret = []
            for (var i = 0; i < rsp.children.length; i++) {
              var item = rsp.children[i],
                  exist = !isNull(parentNode.children.find(item.id, 2, 'id'))? true: false;
              if (item.node_class == 'folder' && !exist) {
                item.path = parentNode.getPath().map(item => item.name).join('/') + '/' + item.name;
                ret.push({
                  name: item.name,
                  id: item.id,
                  isParent: true,
                  data: item
                })
              }
            };
            if (parentNode.name !== rsp.name) {
              parentNode.name = rsp.name;
              parentNode.data.path = parentNode.getPath().map(item => item.name).join('/')
              Pane.tree.updateNode(parentNode);
            }
            return ret.sort((a,b) => a.data.index - b.data.index);
          }
        },
        view: {
          dblClickExpand: (treeId, treeNode)=>{
            return treeNode.level > 0;
          },
          // addHoverDom: Pane.treeDelIcon,
          // removeHoverDom: Pane.treeDelIcon,
          addDiyDom: Pane.treeDelIcon,
        },
        callback: {
          onClick: Pane.treeClick,
          onAsyncSuccess: (event, treeId, treeNode, msg)=>{
            var data = JSON.parse(msg)
            data.path = treeNode.getPath().map(item => item.name).join('/')
            treeNode.data = data;
            if (treeNode.needClick) {
              // $('#nav_tree').find('#' + treeNode.tId + '_span').click();
              var treeObj =Tree.getZTreeObj("navigation_nav_tree");
              treeObj.selectNode(treeNode,false,false);
            }
          },
          beforeExpand: (treeId, treeNode) => {
            Pane.tree.updateNode(treeNode);
            Pane.tree.reAsyncChildNodes(treeNode, 'refresh')
          },
          beforeDrag: (treeId, treeNode) => {
            return true;
          },
          beforeDrop: (treeId, treeNodes, targetNode, moveType, isCopy) => {
            var regionPathArray = treeNodes[0].getPath()
            regionPathArray.pop();
            var regionPath = regionPathArray.map(item => item.name).join('/')
            var tarPathArray = targetNode.getPath()
            tarPathArray.pop();
            var tarPath = tarPathArray.map(item => item.name).join('/')
            if (regionPath == tarPath) {
              return true
            } else {
              return false;
            }
          },
          onDrag: (e, treeId, treeNode) => {
          },
          onDrop: (e, treeId, treeNodes, targetNode, moveType, isCopy) => {
            var index = targetNode.data.index;
            var data = treeNodes[0].data;
            switch (moveType) {
              case 'next':
                index += 1;
                break;
              default:

            }
            if (index == '') {
              index = 1;
            }
            console.log('tarindex:' + index);
            API.justifyIndex(data, index, () => {
              Pane.refreshTree();
            })
          }
        },
        edit: {
          enable: true,
          drag: {
            isCopy: false,
            isMove: true,
            prev: true,
            next: true,
            inner: false
          },
          showRemoveBtn: false,
          showRenameBtn: false
        }
      }
    },
    getAttrData(isTree){
      var originData = Pane.curFocus.data,
          attrData = null,
          fileData = null,
          ret = {}
      ret = API.deepClone(ret, originData)
      if (Pane.attrPane) {
        API.emptyMetas(ret, 'attr');
        attrData = Pane.attrPane.getValue()
        ret = API.deepClone(ret, attrData)
      }
      if (Pane.fileAttrPane) {
        API.emptyMetas(ret, 'file');
        fileData = Pane.fileAttrPane.getValue();
        ret = API.deepClone(ret, fileData)
      }
		console.log(ret);
      return ret;
    }
  };

  function editor({data}) {
    Model.tree_data = JSON.parse(JSON.stringify(data));
    Pane.init();
    API.getTree();
  }
  return editor;
})(jQuery, jQuery.fn.zTree, AlertDialog)
