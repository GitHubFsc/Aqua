define(function(){
  var getTime = function (date) {
    var result;
    date = parseInt(date) * 1000;
    date = new Date(date);
    var format = function (number) {
      if(number < 10) {
        return "0" + number;
      }
      return "" + number;
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds = date.getSeconds();
    var result = year + '/' + format(month) + '/' + format(day) + " " + format(hour) + ":" + format(minute) + ":" + format(seconds);
    return result;
  };

  var config = {};
  config.query = {
    DTU:{
      parms : [
        {
          value:"DTUID",
          enable:true
        },
        {
          value:"DevEUI",
          enable:true
        },
        {
          value:"DevID",
          enable:false
        },
      ]
    },
    ReBeng:{
      parms : [
        {
          value: "DTUID",
          enable: true
        },
        {
          value: "DevEUI",
          enable: true
        },
        {
          value: "DevID",
          enable: true
        },
      ]
    },
  };
  config.content = {
    DTU: {
      tab:[{name:i18n("DEVICEDISTORY_TABLE"),value:"table",data: [{
        label: i18n("DEVICEDISTORY_TIMEUTCSEC"),
        width: 0.14,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.timeUTCSec !== 'undefined')) {
            return getTime(data.metadata.timeUTCSec)
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_DTUWORKMODE"),
        width: 0.13,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.DTUWorkMode !== 'undefined')) {
            return data.metadata.DTUWorkMode
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_DTUFUNPOS"),
        width: 0.12,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.DTUFunPos !== 'undefined')) {
            return data.metadata.DTUFunPos
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_RATE"),
        width: 0.10,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.rate !== 'undefined')) {
            return data.metadata.rate
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_INTERVALMIN"),
        width: 0.11,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.intervalMin !== 'undefined')) {
            return data.metadata.intervalMin
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_DEVICEINSTALLNUM"),
        width: 0.11,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.deviceNum !== 'undefined')) {
            return data.metadata.deviceNum
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_ENVITEMP"),
        width: 0.14,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.enviTemp !== 'undefined')) {
            return data.metadata.enviTemp
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_BATTERYPOWER"),
        width: 0.14,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.batteryPower !== 'undefined')) {
            return data.metadata.batteryPower
          }
          return "";
        }
      }]},
        {
          name:i18n("DEVICEDISTORY_BATTERYPOWER"),
          value:"battery",
          convertData: function(array){
            var deviceHistoryData = JSON.parse(JSON.stringify(array));
            deviceHistoryData = deviceHistoryData.filter(function(item){
              var data = item;
              return data && data.metadata && (typeof data.metadata.timeUTCSec !== 'undefined')
            });
            deviceHistoryData = deviceHistoryData.sort(function(a, b){
              return (parseInt(a.metadata.timeUTCSec) - parseInt(b.metadata.timeUTCSec));
            });
            return deviceHistoryData
          },
          getxAxisArray: function(data){
            var xAxisArray = [];
            data.forEach(function (item, index, array) {
              xAxisArray.push(getTime(item["metadata"]["timeUTCSec"]));
            });
            return xAxisArray;
          },
          unit:"",
          data:[{
            label: i18n("DEVICEDISTORY_BATTERYPOWER"),
            value: function(data){
              if (data && data.metadata && (typeof data.metadata.batteryPower !== 'undefined')) {
                return data.metadata.batteryPower
              }
              return "";
            }
          }]
        }
        ],
    },
    ReBeng: {
      tab:[{name:i18n("DEVICEDISTORY_TABLE"),value:"table",data: [{
        label: i18n("DEVICEDISTORY_TIMEUTCSEC"),
        width: 0.2,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.timeUTCSec !== 'undefined')) {
            return getTime(data.metadata.timeUTCSec)
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_SWITCHSTATE"),
        width: 0.1,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.switchState !== 'undefined')) {
            return data.metadata.switchState
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_OUTDOORTEMP"),
        width: 0.1,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.outdoorTemp !== 'undefined')) {
            return data.metadata.outdoorTemp
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_INDOORTEMP"),
        width: 0.10,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.indoorTemp !== 'undefined')) {
            return data.metadata.indoorTemp
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_SETTEMP"),
        width: 0.1,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.setTemp !== 'undefined')) {
            return data.metadata.setTemp
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_INTOWATERTEMP"),
        width: 0.1,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.intoWaterTemp !== 'undefined')) {
            return data.metadata.intoWaterTemp
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_OUTWATERTEMP"),
        width: 0.1,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.outWaterTemp !== 'undefined')) {
            return data.metadata.outWaterTemp
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_WATERFLOW"),
        width: 0.1,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.waterFlow !== 'undefined')) {
            return data.metadata.waterFlow
          }
          return "";
        }
      }, {
        label: i18n("DEVICEDISTORY_USEDPOWER"),
        width: 0.13,
        value: function(data){
          if (data && data.metadata && (typeof data.metadata.usedPower !== 'undefined')) {
            return data.metadata.usedPower
          }
          return "";
        }
      }]},
        {
          name:i18n("DEVICEDISTORY_TEMPERATURE"),
          value:"temperature",
          convertData: function(array){
            var deviceHistoryData = JSON.parse(JSON.stringify(array));
            deviceHistoryData = deviceHistoryData.filter(function(item){
              var data = item;
              return data && data.metadata && (typeof data.metadata.timeUTCSec !== 'undefined')
            });
            deviceHistoryData = deviceHistoryData.sort(function(a, b){
              return (parseInt(a.metadata.timeUTCSec) - parseInt(b.metadata.timeUTCSec));
            });
            return deviceHistoryData
          },
          getxAxisArray: function(data){
            var xAxisArray = [];
            data.forEach(function (item, index, array) {
              xAxisArray.push(getTime(item["metadata"]["timeUTCSec"]));
            });
            return xAxisArray;
          },
          unit: "°C",
          data:[{
            label: i18n("DEVICEDISTORY_OUTDOORTEMP"),
            value: function(data){
              if (data && data.metadata && (typeof data.metadata.outdoorTemp !== 'undefined')) {
                return data.metadata.outdoorTemp
              }
              return "";
            }
          },{
            label: i18n("DEVICEDISTORY_INDOORTEMP"),
            value: function(data){
              if (data && data.metadata && (typeof data.metadata.indoorTemp !== 'undefined')) {
                return data.metadata.indoorTemp
              }
              return "";
            }
          },{
            label: i18n("DEVICEDISTORY_SETTEMP"),
            value: function(data){
              if (data && data.metadata && (typeof data.metadata.setTemp !== 'undefined')) {
                return data.metadata.setTemp
              }
              return "";
            }
          },{
            label: i18n("DEVICEDISTORY_INTOWATERTEMP"),
            value: function(data){
              if (data && data.metadata && (typeof data.metadata.intoWaterTemp !== 'undefined')) {
                return data.metadata.intoWaterTemp
              }
              return "";
            }
          },{
            label: i18n("DEVICEDISTORY_OUTWATERTEMP"),
            value: function(data){
              if (data && data.metadata && (typeof data.metadata.outWaterTemp !== 'undefined')) {
                return data.metadata.outWaterTemp
              }
              return "";
            }
          }]
        }
        ],
    },
  };
  return config;
});