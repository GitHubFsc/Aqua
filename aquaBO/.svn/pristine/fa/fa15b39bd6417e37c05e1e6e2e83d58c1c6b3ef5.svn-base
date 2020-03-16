var AssetBundle = (function ($, Combo, DatePicker) {
  let closeCallback;
  let Pane = {
    self: null,
    widget: {
      date: {},
      combo: {}
    },
    init: {
      initFrame() {
          Pane.widget = {
            date: {},
            combo: {}
          };
          Pane.init.initDialog();
        },
        initDialog() {
          $.ajax({
            type: "get",
            url: "content/asset/manage/asset.html",
            async: true
          }).done((resp, status) => {
            if(status == "success") {
              Pane.self = $(patchHTML(resp))
              Pane.self.appendTo(Pane.ctn);
              Pane.init.initMetadata();
              Pane.init.initWidgets();
              Pane.bindEvents();
              Pane.load.loadData();
            }
          })
        },
        initMetadata() {
          API.metadata((resp) => {
            API.meta = Model.metadata(resp);
            for(var item in API.meta) {
              if(API.meta.hasOwnProperty(item)) {
                let ctn = $(".asset #metadata");
                Pane.init.initGroup(ctn, API.meta[item]);
              }
            }
          });
        },
        initGroup(src, group) {
          src.append("<label>" + group.name + "</label>")
          let ctn = $("<div class='group'></div>");
          src.append(ctn)
          for(var i = 0; i < group.children.length; i++) {
            let item = group.children[i];
            if(item) {
              let type = item.type;
              Pane.init["init" + type](ctn, item);
            }
          }
        },
        initstring(src, data) {
          let name = data.name,
            seq = data.representation.sequence;
          let el = "<div class='widget'><label>" + data.title + "</label><input id='" + name + "_" + seq + "'></div>"
          src.append(el);
          $(".asset #" + name + "_" + seq).bind("keyup", (e) => {
            API.data.metadata[data.name] = $(e.target).val();
          })
          let isDisable = (Pane.state == "view" ? true : false);
          $(".asset #" + name + "_" + seq).attr("disabled", isDisable ? "disabled" : false);
        },
        initnumber(src, data) {
          Pane.init.initstring(src, data);
        },
        initint(src, data) {
          Pane.init.initstring(src, data);
        },
        initboolean(src, data) {
          let name = data.name,
            seq = data.representation.sequence;
          let array = [{
            key: i18n("ASSET_META_TABLE_OPR_TRUE"),
            value: true
          }, {
            key: i18n("ASSET_META_TABLE_OPR_FALSE"),
            value: false
          }]
          let el = "<div class='widget'><label>" + data.title + "</label><div id='" + name + "_" + seq + "'></div></div>"
          src.append(el);
          Pane.widget.combo[name + "_" + seq] = new Combo("#" + name + "_" + seq, array, {
            backgroundIMGStyle: 2,
            width: "100%",
            height: "28px",
            background: "#ffffff",
            selectbackground: "#ffffff",
            disablebackground: "#f6f6f6",
            disableborder: "#c6c6c6"
          }, (value) => {
            API.data.metadata[name] = value;
          });
          let isDisable = (Pane.state == "view" ? true : false);
          Pane.widget.combo[name + "_" + seq][isDisable ? "setDisable" : "setAvailable"]();
          Pane.widget.combo[name + "_" + seq].header.html('');//combo �ؼ��޷�����booleanΪ�� ����ֻ��ֱ������Ԫ��ͷΪ��ֵ
        },
        initarray(src, data) {
          let name = data.name,
            seq = data.representation.sequence;
          let el = "<div class='widget'><label>" + data.title + "</label><input id='" + name + "_" + seq + "' placeholder='" + i18n('ASSET_ASSET_AUTOMATCH_INPUT_PLACEHOLDER') + "'></div>"
          src.append(el);
          $(".asset #" + name + "_" + seq).bind("keyup", (e) => {
            API.data.metadata[data.name] = $(e.target).val().split(',');
          })
          let isDisable = (Pane.state == "view" ? true : false);
          $(".asset #" + name + "_" + seq).attr("disabled", isDisable ? "disabled" : false);
        },
        initenum(src, data) {
          let name = data.name,
            seq = data.representation.sequence;
          let array = (data.value_definition && data.value_definition.enum_values || "").split(",");
          let combo_data = [];
          for(var i = 0; i < array.length; i++) {
            let item = array[i];
            if(item) {
              combo_data.push({
                key: item,
                value: item
              });
            }
          }
          let el = "<div class='widget'><label>" + data.title + "</label><div id='" + name + "_" + seq + "'></div></div>"
          src.append(el);
          Pane.widget.combo[name + "_" + seq] = new Combo("#" + name + "_" + seq, combo_data, {
            backgroundIMGStyle: 2,
            width: "100%",
            height: "28px",
            background: "#ffffff",
            selectbackground: "#ffffff",
            disablebackground: "#f6f6f6",
            disableborder: "#c6c6c6"
          }, (value) => {
            API.data.metadata[name] = value;
          });
          let isDisable = (Pane.state == "view" ? true : (data.readonly ? true : false));
          Pane.widget.combo[name + "_" + seq][isDisable ? "setDisable" : "setAvailable"]();
          Pane.widget.combo[name + "_" + seq].setValue('')
        },
        initdate(src, data) {
          let name = data.name,
            seq = data.representation.sequence;
          let el = "<div class='widget'><label>" + data.title + "</label><div class='date_picker' id='" + name + "_" + seq + "'></div></div>"
          src.append(el);
          let calendarStyles = {
            width: 200,
            navTitleHeight: 20,
            navTitleBgColor: '#0f84a1',
            datesViewHeight: 150,
            datesViewGridColor: '#e2e2e2',
            datesViewCellColor: '#ffffff',
            weekdaysHeight: 20,
            weekdaysColor: '#000000',
            currMonthColor: '#737373',
            nonCurrMonthColor: '#e2e2e2'
          };
          Pane.widget.date[name + "_" + seq] = new DatePicker({
            containerId: encodeURIComponent(name + "_" + seq),
            calendarStyles: calendarStyles,
            dateInputStyles: {
              borderColor: '#d3d3d3'
            },
            iconImage: 'images/smallCalendarIcon.png'
          });
          Pane.widget.date[name + "_" + seq].onChange = function () {
            API.data.metadata[data.name] = this.inputDateStr;
          }
          let isDisable = (Pane.state == "view" ? true : false);
          Pane.widget.date[name + "_" + seq][isDisable ? "disable" : "enable"]();
        },
        inittime(src, data) {
          let name = data.name,
            seq = data.representation.sequence;
          let el = "<div class='widget time'>";
            el+= "<label>" + data.title + "</label>";
            el+="<div class='_dialog_row' style='justify-content: space-between;'>";
            el+=" <div class='date_picker' id='" + name + "_" + seq + "_date'></div>";
            el+=" <div class='combo' id='" + name + "_" + seq + "_hour'></div>";
            el+=" <label class='unit'>" + i18n("ASSET_UNIT_HOUR") + "</label>";
            el+=" <div class='combo' id='" + name + "_" + seq + "_minute'></div>";
            el+=" <label class='unit'>" + i18n("ASSET_UNIT_MINUTE") + "</label>";
            el+=" <div class='combo' id='" + name + "_" + seq + "_second'></div>";
            el+=" <label class='unit' style='padding-right: 13px;'>" + i18n("ASSET_UNIT_SECOND") + "</label>";
            el+="</div>";
            el+="</div>"
          src.append(el);
          let calendarStyles = {
            width: 200,
            navTitleHeight: 20,
            navTitleBgColor: '#0f84a1',
            datesViewHeight: 150,
            datesViewGridColor: '#e2e2e2',
            datesViewCellColor: '#ffffff',
            weekdaysHeight: 20,
            weekdaysColor: '#000000',
            currMonthColor: '#737373',
            nonCurrMonthColor: '#e2e2e2'
          };
          Pane.widget.date[name + "_" + seq] = new DatePicker({
            containerId: (name + "_" + seq) + "_date",
            calendarStyles: calendarStyles,
            dateInputStyles: {
              borderColor: '#d3d3d3'
            },
            iconImage: 'images/smallCalendarIcon.png'
          });
          Pane.widget.date[name + "_" + seq].onChange = function () {
            let val = API.data.metadata[data.name];
            if(val) {
              val = val.replace(/^\d{4}T/, this.inputDateStr + "T");
            } else {
              val = this.inputDateStr + "T00:00:00" + API.timezone();
            }
            API.data.metadata[data.name] = val;
          }
          let unitStyle = {
            backgroundIMGStyle: 2,
            width: "100%",
            height: "28px",
            background: "#ffffff",
            selectbackground: "#ffffff",
            ScrollBarHeight: "93px",
            disablebackground: "#f6f6f6",
            disableborder: "#c6c6c6"
          };
          let hour = [];
          for(var i = 0; i < 24; i++) {
            let item = String(i).padStart(2, "0")
            hour.push({
              key: item,
              value: item
            });
          }
          let minute = [],
            second = [];
          for(var i = 0; i < 60; i++) {
            let item = String(i).padStart(2, "0")
            minute.push({
              key: item,
              value: item
            });
            second.push({
              key: item,
              value: item
            });
          }
          Pane.widget.combo[name + "_" + seq + "_hour"] = new Combo("#" + name + "_" + seq + "_hour", hour, unitStyle, (value) => {
            let val = API.data.metadata[data.name];
            if(val) {
              val = val.replace(/T\d{2}:/, "T" + value + ":");
            } else {
              val = "xxxxT" + value + ":00:00" + API.timezone();
            }
            API.data.metadata[data.name] = val;
          });
          Pane.widget.combo[name + "_" + seq + "_minute"] = new Combo("#" + name + "_" + seq + "_minute", minute, unitStyle, (value) => {
            let val = API.data.metadata[data.name];
            if(val) {
              val = val.replace(/:\d{2}:/, ":" + value + ":");
            } else {
              val = "xxxxT00:" + value + ":00" + API.timezone();
            }
            API.data.metadata[data.name] = val;
          });
          Pane.widget.combo[name + "_" + seq + "_second"] = new Combo("#" + name + "_" + seq + "_second", second, unitStyle, (value) => {
            let val = API.data.metadata[data.name];
            if(val) {
              val = val.replace(/:\d{2}(?=[+|-])/, ":" + value);
            } else {
              val = "xxxxT00:00" + value + API.timezone;
            }
            API.data.metadata[data.name] = val;
          });
          let isDisable = (Pane.state == "view" ? true : false);
          Pane.widget.date[name + "_" + seq][isDisable ? "disable" : "enable"]();
          Pane.widget.combo[name + "_" + seq + "_hour"][isDisable ? "setDisable" : "setAvailable"]();
          Pane.widget.combo[name + "_" + seq + "_minute"][isDisable ? "setDisable" : "setAvailable"]();
          Pane.widget.combo[name + "_" + seq + "_second"][isDisable ? "setDisable" : "setAvailable"]();
          Pane.widget.combo[name + "_" + seq + "_hour"].setValue('');
          Pane.widget.combo[name + "_" + seq + "_minute"].setValue('');
          Pane.widget.combo[name + "_" + seq + "_second"].setValue('');
        },
        initWidgets() {
          let calendarStyles = {
            width: 200,
            navTitleHeight: 20,
            navTitleBgColor: '#0f84a1',
            datesViewHeight: 150,
            datesViewGridColor: '#e2e2e2',
            datesViewCellColor: '#ffffff',
            weekdaysHeight: 20,
            weekdaysColor: '#000000',
            currMonthColor: '#737373',
            nonCurrMonthColor: '#e2e2e2'
          };
          Pane.widget.date.activatetime = new DatePicker({
            containerId: "activatetime",
            calendarStyles: calendarStyles,
            dateInputStyles: {
              borderColor: '#d3d3d3'
            },
            iconImage: 'images/smallCalendarIcon.png'
          });
          Pane.widget.date.deactivatetime = new DatePicker({
            containerId: "deactivatetime",
            calendarStyles: calendarStyles,
            dateInputStyles: {
              borderColor: '#d3d3d3'
            },
            iconImage: 'images/smallCalendarIcon.png'
          });
          Pane.widget.date.deletetime = new DatePicker({
            containerId: "deletetime",
            calendarStyles: calendarStyles,
            dateInputStyles: {
              borderColor: '#d3d3d3'
            },
            iconImage: 'images/smallCalendarIcon.png'
          });
        }
    },
    load: {
      loadData() {
          let data = API.data;
          let isDisable = (Pane.state == "view" ? true : false);
          $(".asset #id").val(data.id || "");
          $(".asset .check_box#is_package").addClass(data.is_package ? "focus" : "");
          $(".asset #provider_id").val(data.provider_id || "");
          $(".asset #provider_asset_id").val(data.provider_asset_id || "");
          $(".asset #name").val(data.name || "");
          $(".asset #usage").val(data.usage || "");
          $(".asset #creator").val(data.creator || "");
          Pane.widget.date.activatetime.jqDateInput.val((data.activatetime || "").split("T")[0]);
          Pane.widget.date.deactivatetime.jqDateInput.val((data.deactivatetime || "").split("T")[0]);
          Pane.widget.date.deletetime.jqDateInput.val((data.deletetime || "").split("T")[0]);
          Pane.load.loadMetadata(data.metadata);
          if(isDisable) {
            $(".asset #provider_id").attr("disabled", "disabled");
            $(".asset #provider_asset_id").attr("disabled", "disabled");
            $(".asset #name").attr("disabled", "disabled");
            $(".asset #usage").attr("disabled", "disabled");
            $(".asset #creator").attr("disabled", "disabled");
            Pane.widget.date.activatetime.disable();
            Pane.widget.date.deactivatetime.disable();
            Pane.widget.date.deletetime.disable();
          }
        },
        loadMetadata(data) {
          for(var item in data) {
            if(data.hasOwnProperty(item)) {
              let name = item;
              for(var group in API.meta) {
                if(API.meta.hasOwnProperty(group)) {
                  let list = API.meta[group].children;
                  for(var i = 0; i < list.length; i++) {
                    let list_item = list[i];
                    if(list_item) {
                      if(name == list_item.name) {
                        let type = list_item.type;
                        let id = list_item.name + "_" + list_item.representation.sequence;
                        Pane.load["load" + type](id, data[name]||'');
                      }
                    }
                  }
                }
              }
            }
          }
        },
        loadboolean(...arguments) {
          try {
            let id = arguments[0];
            let value = arguments[1];
            let widget = Pane.widget.combo[id];
            if(widget) {
              widget.setValue(value);
            }
          } catch(e) {
            console.error(e.message);
          } finally {

          }
        },
        loaddate(...arguments) {
          try {
            let id = arguments[0];
            let value = arguments[1];
            let array;
            if(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+|-]\d{4}/.test(value)) {
              array = /(\d{4}\-\d{2}\-\d{2})/.exec(convertTimeString(value));
              Pane.widget.date[id].jqDateInput.val(array[1] ? array[1] : "");
            } else {
              Pane.widget.date[id].jqDateInput.val(value);
            }
          } catch(e) {
            console.error(e.message);
          } finally {

          }
        },
        loadtime(...arguments) {
          try {
            let id = arguments[0];
            let value = arguments[1];
            let array = /(\d{4}\-\d{2}\-\d{2})\s(\d{2})\:(\d{2})\:(\d{2})/.exec(convertTimeString(value));
            let widget = Pane.widget.date[id];
            if(widget) {
              Pane.widget.date[id].jqDateInput.val(array[1] ? array[1] : "");
              Pane.widget.combo[id + "_hour"].setValue(array[2] ? array[2] : "");
              Pane.widget.combo[id + "_minute"].setValue(array[3] ? array[3] : "");
              Pane.widget.combo[id + "_second"].setValue(array[4] ? array[4] : "");
            }
          } catch(e) {
            console.error(e.message);
          } finally {

          }
        },
        loadenum(...arguments) {
          Pane.load.loadboolean(...arguments);
        },
        loadint(...arguments) {
          try {
            let id = arguments[0];
            let value = arguments[1];
            let widget = $(".asset #metadata #" + id)
            if(widget.length > 0) {
              widget.val(value);
            }
          } catch(e) {
            console.error(e.message);
          } finally {

          }
        },
        loadnumber(...arguments) {
          Pane.load.loadint(...arguments);
        },
        loadstring(...arguments) {
          Pane.load.loadint(...arguments);
        },
        loadarray(...arguments) {
          // Pane.load.loadboolean(...arguments);
          Pane.load.loadstring(...arguments)
        }
    },
    bindEvents() {
      $(".asset .foot .btn.cancel").bind("click", () => {
        Pane.close();
      });
      Pane.widget.date.activatetime.onChange = function () {
        API.data.activatetime = this.inputDateStr;
      }
      Pane.widget.date.deactivatetime.onChange = function () {
        API.data.deactivatetime = this.inputDateStr;
      }
      Pane.widget.date.deletetime.onChange = function () {
        API.data.deletetime = this.inputDateStr;
      }
      $(".asset #provider_id").bind("keyup", (e) => {
        API.data.provider_id = $(e.target).val();
        API.data.id = (API.data.provider_id || "") + "_" + (API.data.provider_asset_id || "")
      });
      $(".asset #provider_asset_id").bind("keyup", (e) => {
        API.data.provider_asset_id = $(e.target).val();
        API.data.id = (API.data.provider_id || "") + "_" + (API.data.provider_asset_id || "")
      });
      $(".asset #name").bind("keyup", (e) => {
        API.data.name = $(e.target).val();
      });
      $(".asset #usage").bind("keyup", (e) => {
        API.data.usage = $(e.target).val();
      });
      $(".asset .foot .btn.confirm").bind("click", () => {
        let valid = API.checkValid();
        if(valid) {
          switch(Pane.state) {
          case "view":
            Pane.close();
            break;
          case "edit":
            API.updateasset(() => {
              Pane.close();
              closeCallback && closeCallback();
            })
            break;
          case "create":
            API.createasset(() => {
              Pane.close();
              closeCallback && closeCallback();
            })
            break;
          default:

          }
        }
      });
    },
    close() {
      Pane.self.remove();
    }
  };
  let API = {
    meta: {},
    data: {
      metadata: {}
    },
    metadata(callback) {
      $.ajax({
        method: "get",
        url: aquapaas_host + "/aquapaas/rest/assetdef/metadata/asset",
        async: false,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).always((resp, status) => {
        if(status == "success") {
          callback && callback(resp)
        }
      });
    },
    createasset(callback) {
      let data = API.data;
      let req = new XMLHttpRequest();
      req.open("Post", aquapaas_host + "/aquapaas/rest/asset/" + data.id + "?source=ui", true);
      req.setRequestHeader("Accept", "application/json");
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify(data));
      req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == "200") {
          callback && callback();
        }
      }
    },
    updateasset(callback) {
      let data = API.data;
      let req = new XMLHttpRequest();
      req.open("Put", aquapaas_host + "/aquapaas/rest/asset/" + data.id + "?source=ui", true);
      req.setRequestHeader("Accept", "application/json");
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify(data));
      req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == "200") {
          callback && callback();
        }
      }
    },
    timezone() {
      let date = new Date();
      let mark = date.getTimezoneOffset() > 0 ? "-" : "+"
      return mark + String(Math.abs(date.getTimezoneOffset()) / 60).padStart(2, "0") + "00";
    },
    checkValid() {
      let ret = true;
      let data = API.data;
      if(!data.provider_id) {
        alert(i18n("ASSET_DIALOG_PID_ALERT"));
        return false;
      }
      if(!data.provider_asset_id) {
        alert(i18n("ASSET_DIALOG_PAID_ALERT"));
        return false;
      }
      if(!data.name) {
        alert(i18n("ASSET_DIALOG_NAME_ALERT"));
        return false;
      }
      return ret;
    }
  };
  let Model = {
    metadata(data) {
      data.sort((a, b) => {
        return(a.representation && a.representation.group_title || "").localeCompare(b.representation && b.representation.group_title || "");
      });
      let metadata = {};
      for(var i = 0; i < data.length; i++) {
        let item = data[i];
        let group_title = item.representation && item.representation.group_title || "";
        let seq = parseInt(item.representation.sequence || "0");
        if(typeof metadata[group_title] == "undefined") {
          metadata[group_title] = {
            name: group_title,
            children: []
          }
          metadata[group_title].children.push(item);
        } else {
          metadata[group_title].children.push(item);
        }
      }
      for(var group in metadata) {
        if(metadata.hasOwnProperty(group)) {
          metadata[group].children.sort((a, b) => {
            return parseInt(a.representation && a.representation.sequence || 0) - parseInt(b.representation && b.representation.sequence || 0)
          })
        }
      }
      //����ϵͳmetadata���� src:2018-11-05 li.fang�ʼ�
      delete metadata['ϵͳ']
      return metadata;
    }
  };
  return function (opts) {
    Pane.ctn = $(opts.containerId);
    Pane.state = opts.state;
    if(opts.type) {
      Pane.type = opts.type;
    } else {
      delete Pane.type;
    }
    if(opts.data) {
      API.data = opts.data;
    } else {
      API.data = {
        is_package: Pane.type == "asset" ? false : true,
        metadata: {}
      };
    }
    closeCallback = opts.closeFn;
    Pane.init.initFrame();
  }
})(jQuery, newSelect, DatePicker)
