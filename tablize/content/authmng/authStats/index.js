var authStats = (function($){

	var datePickerStyle = {
		iconImage: 'images/authStats/calicon.png',
		dateInputStyles: {
			borderColor: '#eaeef0',
			borderWidth: '2px',
		},
		calendarStyles: {
			navTitleBgColor: '#2ea2d7',
		}
	};

	function preZero(str){
		str = str.toString();
		if(str.length < 2){
			str = '0' + str;
		}
		return str;
	}

	function fromDateToUStr(obj, fullTime, joiner){
		var y = obj.getFullYear();
		var m = obj.getMonth();
		var d = obj.getDate();
		var str = '';
		str += y;
		str += '-' + preZero(m + 1);
		str += '-' + preZero(d);
		if(fullTime){
			str += joiner || ' ';
			var h = obj.getHours();
			var min = obj.getMinutes();
			var s = obj.getSeconds();
			str += preZero(h);
			str += ':' + preZero(min);
			str += ':' + preZero(s);
		}
		return str;
	}


	function drawDegPie(num) {
		var cs = document.createElement('canvas');
		cs.width = 56;
		cs.height = 56;
		var ct = cs.getContext('2d');
		ct.lineWidth = 5;
		ct.beginPath();
		ct.arc(28, 28, 23, -0.5 * Math.PI, 1.5 * Math.PI);
		ct.strokeStyle = '#ffda90';
		ct.stroke();
		ct.beginPath();
		var rdeg = num / 100 * 2 * Math.PI;
		ct.arc(28, 28, 23, -0.5 * Math.PI, rdeg - 0.5 * Math.PI);
		ct.strokeStyle = '#fea236';
		ct.lineCap = 'round';
		ct.stroke();
		ct.font = '12px bold';
		ct.fillStyle = '#ff992c';
		ct.textBaseline = 'middle';
		ct.textAlign = 'center';
		ct.fillText(num + '%', 28, 28);

		return cs;
	}

	function parseTimeNum(str){
		var ret = {};
		switch(str){
		case '10min':
			ret.milsec = 10 * 60 * 1000;
			ret.step = 10;
			ret.unit = 'm';
			break;
		case '30min':
			ret.milsec = 30 * 60 * 1000;
			ret.step = 30;
			ret.unit = 'm';
			break;
		case '1hr':
			ret.milsec = 60 * 60 * 1000;
			ret.step = 1;
			ret.unit = 'h';
			break;
		}
		return ret;
	}

	function findAuthAPI(apis, name){
		var ret = null;
		apis = $.makeArray(apis);
		for(var i = 0, len = apis.length; i < len; i+=1){
			var api = apis[i];
			if(api.group_value == name){
				ret = api;
				break;
			}
		}
		return ret;
	}


	var stats = {
		init: function(){
			var self = this;
			self.setQueryOptions();
			self.initTrendChart();
			self.setTrendOptions();

			$('#authstats-trend-authori .authstats-op').eq(0).click();
			$('#authstats-trend-authenti .authstats-op').eq(0).click();
		},

		setQueryOptions: function(){
			var self = this;
			self.datePickerFrom = new DatePicker($.extend({
				containerId: 'authstats-date-from'
			}, datePickerStyle));
			self.datePickerTo = new DatePicker($.extend({
				containerId: 'authstats-date-to'
			}, datePickerStyle));

			var curr = new Date();
			var curde = {year: curr.getFullYear(), month: curr.getMonth(), date: curr.getDate()};
			self.datePickerFrom.setCurrDate(curde);
			self.datePickerTo.setCurrDate(curde);

			self.datePickerFrom.onChange = function(){
				$('#authstats-time-shortcuts .authstats-opactive').removeClass('authstats-opactive');
			};
			self.datePickerTo.onChange = function(){
				$('#authstats-time-shortcuts .authstats-opactive').removeClass('authstats-opactive');
			};

			$('#authstats-time-shortcuts').on('click', '.authstats-op', function(){
				var $op = $(this);
				$op.siblings().removeClass('authstats-opactive');
				if($op.hasClass('authstats-opactive')){
					$op.removeClass('authstats-opactive');
				} else {
					$op.addClass('authstats-opactive');
				}
			});

			$('#authstats-query-btn').on('click', function(){
				self.queryAuthSum();
			});
		},

		queryAuthSum: function(){
			var self = this;
			var timeFrom = '', timeTo = '';
			var $shortactive = $('#authstats-time-shortcuts .authstats-opactive');
			if($shortactive.length > 0){
				var sign = $shortactive.attr('data-sign');
				switch(sign){
				case 'lasthour':
					var curr = new Date();
					timeTo = fromDateToUStr(curr, true, 'T') + '+0800';
					var last = new Date(curr.getTime() - 60 * 60 * 1000);
					timeFrom = fromDateToUStr(last, true, 'T') + '+0800';
					break;
				case 'lastday':
					var curr = new Date();
					timeTo = fromDateToUStr(curr, true, 'T') + '+0800';
					var last = new Date(curr.getTime() - 24 * 60 * 60 * 1000);
					timeFrom = fromDateToUStr(last, true, 'T') + '+0800';
					break;
				}
			} else {
				timeFrom = self.datePickerFrom.getDateStr() + 'T00:00:00+0800';
				timeTo = self.datePickerTo.getDateStr() + 'T23:59:59+0800';
			}
			var cardId = $('#authstats-cardid-in').val();
			var appkey = $('#authstats-appkey-in').val();

			if(!cardId){
				alert('请输入智能卡号！');
				return;
			}

			self.getAuthoriSum(cardId, appkey, timeFrom, timeTo);
			self.getAuthentiSum(cardId, appkey, timeFrom, timeTo);
		},

		getAuthoriSum: function(cardId, appkey, timeFrom, timeTo){
			var self = this;
			var url = aquapaas_host + '/aquapaas/rest/multiapp/statistics/auditauthorization';
			url += '?properties=user_id';
			url += '&sum_fields=count,success_count,failure_count';
			url += '&begin_time=' + encodeURIComponent(timeFrom);
			url += '&end_time=' + encodeURIComponent(timeTo);
			url += '&percent=true';
			url += '&interval=day';
			if(cardId || appkey){
				url += '&filter=';
				if(cardId){
					url += 'user_id:' + cardId;
				}
				if(cardId && appkey){
					url += '|';
				}
				if(appkey){
					url += 'app_key:' + appkey;
				}
			}
			url += '&app_key=' + paasAppKey;
			url += '&timestamp=' + new Date().toISOString();
			$.ajax({
				url: url,
				type: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
				}
			}).done(function(data){
				try{
					var chartData = data[0].values[0];
					self.fillAuthoriChart(chartData);
				}catch(e){
					console.log(e.message);
				}
			});
		},

		getAuthentiSum: function(cardId, appkey, timeFrom, timeTo){
			var self = this;
			var url = aquapaas_host + '/aquapaas/rest/multiapp/statistics/auditauthentication';
			url += '?properties=user_id';
			url += '&sum_fields=count,success_count,failure_count';
			url += '&begin_time=' + encodeURIComponent(timeFrom);
			url += '&end_time=' + encodeURIComponent(timeTo);
			url += '&percent=true';
			url += '&interval=day';
			if(cardId || appkey){
				url += '&filter=';
				if(cardId){
					url += 'user_id:' + cardId;
				}
				if(cardId && appkey){
					url += '|';
				}
				if(appkey){
					url += 'app_key:' + appkey;
				}
			}
			url += '&app_key=' + paasAppKey;
			url += '&timestamp=' + new Date().toISOString();
			$.ajax({
				url: url,
				type: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
				}
			}).done(function(data){
				try{
					var chartData = data[0].values[0];
					self.fillAuthentiChart(chartData);
				}catch(e){
					console.log(e.message);
				}
			});
		},

		fillAuthoriChart: function(data){
			var self = this;
			if(data == null){
				$('#authstats-authori-total').text('');
				$('#authstats-authori-sper').text('');
				$('#authstats-authori-cs').text('');
				$('#authstats-authori-cf').text('');
				$('#authstats-authori-perpie').empty();
				if(self.authoriRosepie != null){
					self.authoriRosepie.dispose();
					self.authoriRosepie = null;
				}
			} else {
				var pernum = Math.round(parseFloat(data.success_rate));
				$('#authstats-authori-total').text(data.count);
				$('#authstats-authori-sper').text(pernum + '%');
				$('#authstats-authori-cs').text(data.sum.success_count);
				$('#authstats-authori-cf').text(data.sum.failure_count);
				$('#authstats-authori-perpie').empty().append(drawDegPie(pernum));
				if(self.authoriRosepie == null){
					self.authoriRosepie = echarts.init(document.getElementById('authstats-authori-rosepie'));
				}
				self.authoriRosepie.setOption({
					series: [{
						type: 'pie',
						radius: [17, 75],
						center: ['50%', '50%'],
						roseType : 'radius',
						label: {
							normal: {
								show: false
							},
							emphasis: {
								show: false
							}
						},
						lableLine: {
							normal: {
								show: false
							},
							emphasis: {
								show: false
							}
						},
						data: [
							{
								value: parseInt(data.sum.failure_count),
								name: '授权失败次数',
								itemStyle: {
									color: '#37a2da'
								}
							},
							{
								value: parseInt(data.sum.success_count),
								name: '授权成功次数',
								itemStyle: {
									color: '#ffd85c'
								}
							}
						]
					}]
				});
			}
		},

		fillAuthentiChart: function(data){
			var self = this;
			if(data == null){
				$('#authstats-authenti-total').text('');
				$('#authstats-authenti-sper').text('');
				$('#authstats-authenti-cs').text('');
				$('#authstats-authenti-cf').text('');
				$('#authstats-authenti-perpie').empty();
				if(self.authentiRosepie != null){
					self.authentiRosepie.dispose();
					self.authentiRosepie = null;
				}
			} else {
				var pernum = Math.round(parseFloat(data.success_rate));
				$('#authstats-authenti-total').text(data.count);
				$('#authstats-authenti-sper').text(pernum + '%');
				$('#authstats-authenti-cs').text(data.sum.success_count);
				$('#authstats-authenti-cf').text(data.sum.failure_count);
				$('#authstats-authenti-perpie').empty().append(drawDegPie(pernum));
				if(self.authentiRosepie == null){
					self.authentiRosepie = echarts.init(document.getElementById('authstats-authenti-rosepie'));
				}
				self.authentiRosepie.setOption({
					series: [{
						type: 'pie',
						radius: [17, 75],
						center: ['50%', '50%'],
						roseType : 'radius',
						label: {
							normal: {
								show: false
							},
							emphasis: {
								show: false
							}
						},
						lableLine: {
							normal: {
								show: false
							},
							emphasis: {
								show: false
							}
						},
						data: [
							{
								value: parseInt(data.sum.failure_count),
								name: '鉴权失败次数',
								itemStyle: {
									color: '#37a2da'
								}
							},
							{
								value: parseInt(data.sum.success_count),
								name: '鉴权成功次数',
								itemStyle: {
									color: '#ffd85c'
								}
							}
						]
					}]
				});
			}
		},

		setTrendOptions: function(){
			var self = this;

			$('#authstats-trend-authori').on('click', '.authstats-op', function(){
				var $op = $(this);
				$op.siblings().removeClass('authstats-opactive');
				$op.addClass('authstats-opactive');
				var timeNum = $op.attr('data-num');
				self.updateTrendAuthori(parseTimeNum(timeNum));
			});

			$('#authstats-trend-authenti').on('click', '.authstats-op', function(){
				var $op = $(this);
				$op.siblings().removeClass('authstats-opactive');
				$op.addClass('authstats-opactive');
				var timeNum = $op.attr('data-num');
				self.updateTrendAuthenti(parseTimeNum(timeNum));
			});
		},

		updateTrendAuthori: function(setting){
			var self = this;
			if(authStatsAuthoriInterval){
				clearInterval(authStatsAuthoriInterval);
			}
			var authStatsAuthoriInterval = setInterval(function(){
				if($('#authstats-trend-authori').length == 0){
					clearInterval(authStatsAuthoriInterval);
					authStatsAuthoriInterval = null;
				} else {
					self.getTimeTrend('authori');
				}
			}, setting.milsec);
			self.authoriSetting = setting;
			self.authoriXData = [];
			self.authoriSData = [];
			self.getTimeTrend('authori');
		},

		updateTrendAuthenti: function(setting){
			var self = this;
			if(authStatsAuthentiInterval){
				clearInterval(authStatsAuthentiInterval);
			}
			var authStatsAuthentiInterval = setInterval(function(){
				if($('#authstats-trend-authenti').length == 0){
					clearInterval(authStatsAuthentiInterval);
					authStatsAuthentiInterval = null;
				} else {
					self.getTimeTrend('authenti');
				}
			}, setting.milsec);
			self.authentiSetting = setting;
			self.authentiXData = [];
			self.authentiSData = [];
			self.getTimeTrend('authenti');
		},

		initTrendChart: function(){
			var self = this;
			var defaults = {
				color: ['#39c3ea'],
				tooltip: {trigger: 'axis'},
				legend: {show: false},
				grid: {left: 35, width: 528, borderColor: '#f3f3f3'},
				yAxis: {
					type: 'value',
					axisLabel: {color: '#9ca3ab'},
					axisLine: {lineStyle: {color: '#d2d4d3'}},
					minInterval: 1,
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					axisLabel: {color: '#9ca3ab'},
					axisLine: {lineStyle: {color: '#d2d4d3'}},
					data: []
				},
			};
			self.authoriTrend = echarts.init(document.getElementById('authstats-chart-authori'));
			self.authoriTrend.setOption($.extend({}, defaults, {
				series: {
					name: '授权信息',
					type: 'line',
					data: [],
				}
			}));
			self.authentiTrend = echarts.init(document.getElementById('authstats-chart-authenti'));
			self.authentiTrend.setOption($.extend({}, defaults, {
				series: {
					name: '鉴权信息',
					type: 'line',
					data: [],
				}
			}));
		},

		getTimeTrend: function(type){
			var self = this;
			var url = aquadaas_host + '/aquadaas/rest/log_analysis/hitlog/realtime/summary';
			url += '?docker_instance_name=varnish';
			url += '&include_detail_info=true';
			switch(type){
			case 'authori':
				url += '&api_group_values=uniauth.authorization';
				break;
			case 'authenti':
				url += '&api_group_values=uniauth.authentication';
				break;
			}
			url += '&app_key=' + paasAppKey;
			url += '&timestamp=' + new Date().toISOString();
			$.ajax({
				url: url,
				type: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
				}
			}).done(function(data){
				var dockers = $.makeArray(data.summary);
				var newval = 0;
				$.each(dockers, function(i, docker){
					var api;
					switch(type){
					case 'authori':
						api = findAuthAPI(docker.api, 'uniauth.authorization');
						break;
					case 'authenti':
						api = findAuthAPI(docker.api, 'uniauth.authentication');
						break;
					}
					if(api != null){
						newval += parseInt(api.req_total_count);
					}
				});
				self.updateTrendData(type, newval);
			}).fail(function(){
			});
		},

		updateTrendData: function(type, newval){
			var self = this;
			switch(type){
			case 'authori':
				var index = self.authoriXData.length;
				var xlabel = index * self.authoriSetting.step + self.authoriSetting.unit;
				self.authoriXData.push(xlabel);
				self.authoriSData.push(newval);
				self.authoriTrend.setOption({
					xAxis: {
						data: self.authoriXData
					},
					series: [{
						name: '授权信息',
						data: self.authoriSData
					}]
				});
				break;
			case 'authenti':
				var index = self.authentiXData.length;
				var xLabel = index * self.authentiSetting.step + self.authentiSetting.unit;
				self.authentiXData.push(xLabel);
				self.authentiSData.push(newval);
				self.authentiTrend.setOption({
					xAxis: {
						data: self.authentiXData
					},
					series: [{
						name: '鉴权信息',
						data: self.authentiSData
					}]
				});
				break;
			}
		}

	};

	stats.init();

	return stats;
})(jQuery);
