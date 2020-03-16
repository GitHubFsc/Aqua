/**
 * 依赖与jQuery
 */
class Set {
  constructor(title) {
    this.children = [];
    let _template = `<div class="pane-set">
                               <label>${title}</label>
                               <div class="pane-set-ctn"></div>
                             </div>`;
    this.dom = jQuery(_template);
  }
  _refresh() {
    let ctn = this.dom.find(".pane-set-ctn");
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
