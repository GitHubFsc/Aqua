var ChannelMetaDialog = (function ($, Dialog, Combo) {
  let confirmCallback,
    defaultData = {
      readonly_context: {},
      value_definition: {},
      representation: {}
    };
  let Pane = {
    state: "new",
    dialog: null,
    widgets: {},
    init() {
      this.initDialog();
    },
    initDialog() {
      let cb = () => {
        //更新对话框头部提示文字
        $(".meta._dialog ._dialog_title_label").html(i18n("ASSET_META_DIALOG_TITLE_" + Pane.state.toUpperCase()));
        this.initWidgets();
        this.bindEvents();
        if(this.state !== "add") {
          this.loadData();
        }
        if (this.state == "view") {
          this.disableFrame();
        }
      }
      dialog = new Dialog({
        url: "content/channel/meta/meta.html",
        width: 700,
        height: 576,
        context: this,
        callback: cb
      });
      dialog.create();
      this.dialog = dialog;
    },
    initWidgets() {
      let comboStyle = {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }
      let typeData = [
        {
          key: "boolean",
          value: "boolean"
        },
        {
          key: "date",
          value: "date"
        },
        {
          key: "time",
          value: "time"
        },
        {
          key: "enum",
          value: "enum"
        },
        {
          key: "int",
          value: "int"
        },
        {
          key: "number",
          value: "number"
        },
        {
          key: "string",
          value: "string"
        },
        {
          key: "array",
          value: "array"
        }
      ];
      let mandatoryData = readonlyData = multiData = treeData = [{
        key: i18n("ASSET_META_TABLE_OPR_TRUE"),
        value: "true"
      }, {
        key: i18n("ASSET_META_TABLE_OPR_FALSE"),
        value: "false"
      }];
      //类型
      this.widgets.type = new Combo("#channel_meta_type", typeData, comboStyle, (value) => {
        API.data.type = value;
      });
      //必填
      this.widgets.mandatory = new Combo("#channel_meta_mandatory", mandatoryData, comboStyle, (value) => {
        if(value == "true") {
          API.data.mandatory = true;
        } else {
          API.data.mandatory = false;
        }
      });
      //只读
      this.widgets.readonly = new Combo("#channel_meta_readonly", readonlyData, comboStyle, (value) => {
        if(value == "true") {
          API.data.readonly = true;
        } else {
          API.data.readonly = false;
        }
      });
      //多值
      this.widgets.multi = new Combo("#channel_meta_multi", multiData, comboStyle, (value) => {
        if(value == "true") {
          API.data.multiple_value = true;
        } else {
          API.data.multiple_value = false;
        }
      });
      //树
      this.widgets.tree = new Combo("#channel_meta_tree", treeData, comboStyle, (value) => {
        if(value == "true") {
          API.data.representation.is_tree = true;
        } else {
          API.data.representation.is_tree = false;
        }
      });
      if(this.state == "add") {
        this.widgets.type.content.find("li:eq(0)").click();
        this.widgets.mandatory.content.find("li:eq(0)").click();
        this.widgets.readonly.content.find("li:eq(0)").click();
        this.widgets.multi.content.find("li:eq(0)").click();
        this.widgets.tree.content.find("li:eq(0)").click();
      }
    },
    bindEvents() {
      //bind dialog input
      $(".meta._dialog ._dialog_row #channel_meta_name").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.name = el.val();
      });
      $(".meta._dialog ._dialog_row #channel_meta_title").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.title = el.val();
      });
      $(".meta._dialog ._dialog_row #channel_meta_readonly_value").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.readonly_context.user_tags = el.val();
      });
      $(".meta._dialog ._dialog_row #channel_meta_enum_values").bind("keyup", (e) => {
        let el = $(e.target);
        var value = el.val().split(',');
        API.data.value_definition.enum_values = value;   //以string[]添加
      });
      $(".meta._dialog ._dialog_row #channel_meta_max_value").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.value_definition.max = Number(el.val());
      });
      $(".meta._dialog ._dialog_row #channel_meta_min_value").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.value_definition.min = Number(el.val());
      });
      $(".meta._dialog ._dialog_row #channel_meta_group_name").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.representation.group_title = el.val();
      });
      $(".meta._dialog ._dialog_row #channel_meta_group_seq").bind("keyup", (e) => {
        let el = $(e.target);
        API.data.representation.sequence = Number(el.val());
      });
      // bind btn events
      $(".meta._dialog ._dialog_foot .btn._confirm").bind("click", () => {
        if(Pane.state == "view") {
          Pane.dialog.close();
        } else {
          API.update(() => {
            Pane.dialog.close();
            confirmCallback && confirmCallback();
          });
        }
      });
      $(".meta._dialog ._dialog_foot .btn._cancel").bind("click", () => {
        Pane.dialog.close();
      });
    },
    loadData() {
      let data = API.data;
      $(".meta._dialog ._dialog_row #channel_meta_name").val(data.name)
      $(".meta._dialog ._dialog_row #channel_meta_title").val(data.title)
      $(".meta._dialog ._dialog_row #channel_meta_readonly_value").val(data.readonly_context.user_tags)
      $(".meta._dialog ._dialog_row #channel_meta_enum_values").val(data.value_definition.enum_values)
      $(".meta._dialog ._dialog_row #channel_meta_max_value").val(data.value_definition.max)
      $(".meta._dialog ._dialog_row #channel_meta_min_value").val(data.value_definition.min)
      $(".meta._dialog ._dialog_row #channel_meta_group_name").val(data.representation.group_title)
      $(".meta._dialog ._dialog_row #channel_meta_group_seq").val(data.representation.sequence)
      this.widgets.type.setValue(data.type);
      this.widgets.mandatory.setValue(String(data.mandatory));
      this.widgets.readonly.setValue(String(data.readonly));
      this.widgets.multi.setValue(String(data.multiple_value));
      this.widgets.tree.setValue(String(data.representation.is_tree||''));
    },
    disableFrame() {
      this.widgets.type.setDisable();
      this.widgets.mandatory.setDisable();
      this.widgets.readonly.setDisable();
      this.widgets.multi.setDisable();
      this.widgets.tree.setDisable();
      $(".meta._dialog ._dialog_row #channel_meta_name").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_title").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_readonly_value").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_enum_values").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_max_value").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_min_value").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_group_name").attr("disabled","true");
      $(".meta._dialog ._dialog_row #channel_meta_group_seq").attr("disabled","true");
    }
  };
  let API = {
    data: {
      readonly_context: {},
      value_definition: {},
      representation: {}
    },
    update(callback) {
      // let url = "http://172.16.20.201:8090/aquapaas/rest/assetdef/metadata/channel/" + this.data.name;
      let url = aquapaas_host + "/aquapaas/rest/assetdef/metadata/channel/" + this.data.name;
      let method = "put";
      $.ajax({
        url: url,
        type: method,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        data: JSON.stringify(API.data)
      }).always((resp, status, xhr) => {
        if(xhr.readyState == 4 && (xhr.status == "201" || xhr.status == "204")) {
          callback && callback();
        }
      });
    }
  };
  let Model = {};
  return function ({
    data = defaultData, state = "add", confirmFn = function () {}
  } = {}) {
    defaultData;//无意义，仅为了兼容火狐浏览器47.0.1关于ES6解构问题
    API.data = JSON.parse(JSON.stringify(data));
    Pane.state = state;
    confirmCallback = confirmFn
    Pane.init();
  }
})(jQuery, PopupDialog, newSelect);
