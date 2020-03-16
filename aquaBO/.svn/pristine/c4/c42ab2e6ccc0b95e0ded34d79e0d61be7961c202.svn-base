var supervisor = {
  data: [],
  init: function () {
    this.pane = [];
    let $ = jQuery;
    this.getData();
    this.initData();
  },
  initData() {
  let ctn = jQuery("#query_supervisor_ctn"),
  group = [{
    name: "缓存层",
    englishname: "Caching layer"
  }, {
    name: "网关层",
    englishname: "Network management layer"
  }, {
    name: "应用层",
    englishname: "Application layer"
  }],
  data = this.data,
      defaultData = {
        times: "-",
        time: "-",
        size: "-"
      };
      for(let i = 0; i < group.length; i++) {
      }
    //缓存层
    if (data[0].length > 0) {
      let {
        name, englishname
      } = group[0];
      let pane = new Pane(name, englishname);
      pane.appendTo(ctn)
      this.pane.push(pane);
      for(var i = 0; i < 4; i++) {
        var item = data[0][i]
        if(item) {
          let block = new Block({
            name: item.name,
            data: item
          });
          this.pane[0].add(block.dom);
        }
      }
    }
    //网管层
    if (data[1].length > 0) {
      let {
        name, englishname
      } = group[1];
      let pane = new Pane(name, englishname);
      pane.appendTo(ctn)
      this.pane.push(pane);
      for(var i = 0; i < 4; i++) {
        var item = data[1][i]
        if(item) {
          let block = new Block({
            name: item.name,
            data: item
          });
          this.pane[1].add(block.dom);
        }
      }
    }
    //应用层

    if (data[2][0].length > 0||data[2][1].length > 0||data[2][2].length > 0||data[2][3].length > 0||data[2][4].length > 0) {
      let {
        name, englishname
      } = group[2];
      let pane = new Pane(name, englishname);
      pane.appendTo(ctn)
      this.pane.push(pane);
    }
    //asset
    if(data[2][0].length > 0) {
      let asset = new Set("Asset");
      this.pane[2].add(asset.dom);
      for(var i = 0; i < 4; i++) {
        var item = data[2][0][i]
        if(item) {
          let block = new Block({
            name: item.name,
            icon: "app",
            type: "type1",
            data: item
          });
          asset.add(block.dom);
        }
      }
    }
    //user
    if (data[2][1].length>0) {
      let user = new Set("User");
      this.pane[2].add(user.dom);
      for(var i = 0; i < 4; i++) {
        var item = data[2][1][i]
        if(item) {
          let block = new Block({
            name: item.name,
            icon: "app",
            type: "type1",
            data: item
          });
          user.add(block.dom);
        }
      }
    }
    //Transaction
    if (data[2][2].length>0) {
      let trans = new Set("Transaction");
      this.pane[2].add(trans.dom);
      for(var i = 0; i < 4; i++) {
        var item = data[2][2][i]
        if(item) {
          let block = new Block({
            name: item.name,
            icon: "app",
            type: "type1",
            data: item
          });
          trans.add(block.dom);
        }
      }
    }
    //adapter
    if (data[2][3].length>0) {
      let adapter = new Set("TVBSAdapter");
      this.pane[2].add(adapter.dom);
      for(var i = 0; i < 4; i++) {
        var item = data[2][3][i]
        if(item) {
          let block = new Block({
            name: item.name,
            icon: "app",
            type: "type1",
            data: item
          });
          adapter.add(block.dom);
        }
      }
    }
    //common
    if (data[2][4].length > 0) {
      let common = new Set("Common");
      this.pane[2].add(common.dom);
      for(var i = 0; i < 3; i++) {
        var item = data[2][4][i]
        if(item) {
          let block = new Block({
            name: item.name,
            icon: "app",
            type: "type1",
            data: item
          });
          common.add(block.dom);
        }
      }
    }
  },
  getData() {
    let $ = jQuery;
    let _this = this;
    var url = aquadaas_host + "/aquadaas/rest/log_analysis/hitlog/realtime/summary?app_key=" + paasAppKey + '&timestamp=' +  new Date().toISOString();
    $.ajax({
      url: url,
      // url: 'http://172.16.20.155:8080/aquadaas/rest/log_analysis/hitlog/realtime/summary',
      type: "GET",
      dataType: "json",
      async: false,
      headers: {
        Accept: "application/json",
        'x-aqua-sign': getPaaS_x_aqua_sign('get', url)
      }
    }).always((resp, status, xhr)=> {
      var data = resp.summary;
      var tmpData = [[], [], [[], [], [], [], []]];
      if (status == "success") {
        for(var i = 0; i < data.length; i++) {
          var item = data[i];
          var _tmpData = {
            times: item.total_summary.req_total_count,
            time: item.total_summary.req_total_resp_time,
            size: item.total_summary.req_total_resp_bytes,
            id: item.docker_instance_name,
            name: item.hostname
          }
          if(/varnish/g.test(item.docker_instance_name.toLowerCase())) {
            tmpData[0].push(_tmpData);
          } else if(/gateway/.test(item.docker_instance_name.toLowerCase())) {
            tmpData[1].push(_tmpData);
          } else if(/asset/.test(item.docker_instance_name.toLowerCase())) {
            tmpData[2][0].push(_tmpData);
          } else if(/user/.test(item.docker_instance_name.toLowerCase())) {
            tmpData[2][1].push(_tmpData);
          } else if(/transaction/.test(item.docker_instance_name.toLowerCase())) {
            tmpData[2][2].push(_tmpData);
          } else if(/tvbsadapter/.test(item.docker_instance_name.toLowerCase())) {
            tmpData[2][3].push(_tmpData);
          } else if(/common/.test(item.docker_instance_name.toLowerCase())) {
            tmpData[2][4].push(_tmpData);
          }
        }
      }
      _this.data = tmpData;
    })
  }
};
