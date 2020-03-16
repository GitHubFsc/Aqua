(function ($, Dialog, context) {
  let chart_time, chart_status, machine_id, chart_opts = {
      series: [
        {
          name: '半径模式',
          type: 'pie',
          radius: [30, 110],
          center: ['50%', "50%"],
          roseType: 'radius',
          width: '40%', // for funnel
          max: 40, // for funnel
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: true
              }
            }
          },
          data: [
            {
              value: 10,
              name: 'rose1'
          },
            {
              value: 5,
              name: 'rose2'
          },
            {
              value: 15,
              name: 'rose3'
          },
            {
              value: 25,
              name: 'rose4'
          },
            {
              value: 20,
              name: 'rose5'
          },
            {
              value: 35,
              name: 'rose6'
          },
            {
              value: 30,
              name: 'rose7'
          },
            {
              value: 40,
              name: 'rose8'
          }
          ]
      }
  ]
    },
    data = {};
  let initPage = () => {
    chart_time = echarts.init(document.getElementById("querySupervisor_time-chart"));
    chart_status = echarts.init(document.getElementById("querySupervisor_status-chart"));

    chart_time.setOption(chart_opts);
    chart_status.setOption(chart_opts);
    $(".popupdialogclear").bind("click", function () {
      _dialog.close();
    })
  }
  var _dialog = new Dialog({
    url: "content/supervisor/live/live.html",
    width: 1071,
    height: 1355,
    context: this,
    callback: function () {
      initPage();
      loadData();
      setInterval(function () {
        if($(".liveanylise").length > 0) {
          getData();
          loadData();
        } else {
          clearInterval(this);
        }
      }, 10000)
    }
  });

  function getData() {

    let url = aquadaas_host + "/aquadaas/rest/log_analysis/hitlog/realtime/machine?docker_instance_name=" + machine_id + "&app_key=" + paasAppKey + '&timestamp=' +  new Date().toISOString();
    jQuery.ajax({
      type: "GET",
      url: url,
      async: false,
      dataType: "json",
      headers: {
        Accept: "application/json",
        'x-aqua-sign': getPaaS_x_aqua_sign('get', url)
      }
    }).done(function (resp) {
      // resp = fakeData;
      var item = resp.docker;
      data.requestcount = item.total_summary.req_total_count;
      data.avgresptime = item.total_summary.req_avg_resp_time;
      data.avgsize = item.total_summary.req_avg_resp_bytes;

      var api = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for(var i = 0; i < item.api.length; i++) {
        var item_a = item.api[i];
        if(/asset/g.test(item_a.group_value.toLowerCase())) {
          api[0][0] += item_a.req_total_count
          api[0][1] += item_a.req_avg_resp_time
          api[0][2] += item_a.req_avg_resp_bytes
        } else if(/user/g.test(item_a.group_value.toLowerCase())) {
          api[1][0] += item_a.req_total_count
          api[1][1] += item_a.req_avg_resp_time
          api[1][2] += item_a.req_avg_resp_bytes
        } else if(/transaction/g.test(item_a.group_value.toLowerCase())) {
          api[2][0] += item_a.req_total_count
          api[2][1] += item_a.req_avg_resp_time
          api[2][2] += item_a.req_avg_resp_bytes
        } else if(/common/g.test(item_a.group_value.toLowerCase())) {
          api[3][0] += item_a.req_total_count
          api[3][1] += item_a.req_avg_resp_time
          api[3][2] += item_a.req_avg_resp_bytes
        }
      }
      //time
      var time = [["&nbsp;", "", "", ""], ["&nbsp;", "", "", ""], ["&nbsp;", "", "", ""], ["&nbsp;", "", "", ""]];
      item.request_time.sort(function (a, b) {
        return a.group_value.localeCompare(b.group_value)
      });
      for(var i = 0; i < item.request_time.length; i++) {
        var item_a = item.request_time[i];
        if(time[i]) {
          time[i][0] = item_a.group_value || 0;
          time[i][1] = item_a.req_total_count || 0;
          time[i][2] = item_a.req_avg_resp_time || 0;
          time[i][3] = item_a.req_avg_resp_bytes || 0;
        } else {
          time.push([[item_a.group_value || ""], [item_a.req_total_count || 0], [item_a.req_avg_resp_time || 0], [item_a.req_avg_resp_bytes || 0]])
        }
      }
      //status
      var status = [["&nbsp;", "", "", ""], ["&nbsp;", "", "", ""], ["&nbsp;", "", "", ""], ["&nbsp;", "", "", ""]];
      item.status.sort(function (a, b) {
        return a.group_value.localeCompare(b.group_value)
      });
      for(var i = 0; i < item.status.length; i++) {
        var item_a = item.status[i];
        if(status[i]) {
          status[i][0] = item_a.group_value || 0;
          status[i][1] = item_a.req_total_count || 0;
          status[i][2] = item_a.req_avg_resp_time || 0;
          status[i][3] = item_a.req_avg_resp_bytes || 0;
        } else {
          status.push([[item_a.group_value || "&nbsp;"], [item_a.req_total_count || 0], [item_a.req_avg_resp_time || 0], [item_a.req_avg_resp_bytes || 0]])
        }
      }
      data.api = api;
      data.time = time;
      data.status = status;
    })
  }

  function loadData() {
    let $ = jQuery;
    $(".info.request .info-value").html(data.requestcount);
    $(".info.response .info-value").html(data.avgresptime);
    $(".info.size .info-value").html(data.avgsize);
    //load api table
    for(var i = 0; i < data.api.length; i++) {
      var item = data.api[i];
      for(var j = 0; j < item.length; j++) {
        var jtem = item[j];
        $(".api-table tr:eq(" + (j + 1) + ") td:eq(" + (i + 1) + ")").html(jtem);
      }
    }
    //load reponse table
    for(var i = 0; i < data.time.length; i++) {
      var item = data.time[i];
      for(var j = 0; j < item.length; j++) {
        var jtem = item[j];
        var node = $(".time-table tr:eq(" + j + ") td:eq(" + (i + 1) + ")");
        if(node.length > 0) {
          node.html(jtem)
        } else {
          $(".time-table tr:eq(" + j + ")").append("<td>" + jtem + "</td>");
        }
      }
    }
    //load response chart
    var chart_data = [];
    for(var i = 0; i < data.time.length; i++) {
      var item = data.time[i];
      chart_data.push({
        name: item[0],
        value: item[1]
      })
    }
    chart_opts.series[0].data = chart_data;
    chart_time.setOption(chart_opts);
    //load status table
    for(var i = 0; i < data.status.length; i++) {
      var item = data.status[i];
      for(var j = 0; j < item.length; j++) {
        var jtem = item[j];
        var node = $(".status-table tr:eq(" + j + ") td:eq(" + (i + 1) + ")");
        if(node.length > 0) {
          node.html(jtem)
        } else {
          $(".status-table tr:eq(" + j + ")").append("<td>" + jtem + "</td>");
        }
      }
    }
    //load response chart
    var chart_data = [];
    for(var i = 0; i < data.status.length; i++) {
      var item = data.status[i];
      chart_data.push({
        name: item[0],
        value: item[1]
      })
    }
    chart_opts.series[0].data = chart_data;
    chart_status.setOption(chart_opts);
  }
  var Layout = {
    init(machineid) {
      machine_id = machineid
      getData();
      _dialog.create();
    }
  }
  $.extend(context, {
    liveAnylise: Layout
  });
})(jQuery, PopupDialog, supervisor)
