class Block {
  constructor({
    type = "default", icon = "default", name, data = {
      times: "-",
      time: "-",
      size: "-",
      id: '-'
    }
  } = {}) {
    let template = `<div class="${type} pane-block">
    <img class="block-image" src="./content/supervisor/img/${icon}.png">
    <div class="block-name">${name}</div>
    <div class="block-title times">${data.times}</div>
    <div class="block-title time">${data.time}</div>
    <div class="block-title size">${data.size}</div>
    <div class="block-btn block-live">实时动态</div>
    <div class="block-btn block-his">历史数据</div>
    </div>`;
    this.dom = jQuery(template);
    //bind some events
    this.dom.find(".block-live")[0].onclick = () => {
      this.gotoLive(data.id)
    };
    this.dom.find(".block-his")[0].onclick = () => {
      this.gotoHis(name, data.id)
    };
  }
  gotoLive(id) {
    supervisor.liveAnylise.init(id);
  }
  gotoHis(name, id) {
    var dialog = new historyRecordsModel();
    dialog.init(name, id);
  }
  refresh(data) {
    for(var variable in data) {
      if(data.hasOwnProperty(variable)) {
        this.dom.find(".block-title." + variable).html(data[variable]);
      }
    }
  }
}
