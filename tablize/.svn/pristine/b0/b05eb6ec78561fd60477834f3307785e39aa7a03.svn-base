/**
 * 依赖与jQuery
 */
class querySupervisor_Pane {
  constructor(name, englishname) {
    this.name = name;
    this.englishname = englishname;
    this.children = [];
    let _template = `<div class="pane">
                                <div class="pane-titlebar">
                                  <div>${this.name}</div>
                                  <div class="pane-englishname">${this.englishname}</div>
                                </div>
                                <div class="pane-ctn"></div>
                              </div>`;
    let _template_withouttitle = `<div class="pane">
                                <div class="pane-ctn"></div>
                              </div>`;

    this.dom = jQuery(name&&englishname?_template:_template_withouttitle);
  }
  _refresh() {
    let ctn = this.dom.find(".pane-ctn");
    ctn.empty();
    for(var i = 0; i < this.children.length; i++) {
      var item = this.children[i];
      ctn.append(item)
    }
  }
  add(dom) {
    this.children.push(dom)
    this._refresh();
  }
  appendTo(ctn) {
    ctn.append(this.dom);
  }
}
