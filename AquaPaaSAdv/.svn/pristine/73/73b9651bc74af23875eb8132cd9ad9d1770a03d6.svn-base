(function ($) {
  var list = function (obj) {
    var conf = obj;
    if(conf) {
      this.containerId = conf.containerId;
      this.rowsLmt = conf.rows || 1;
      this.columnsLmt = conf.columns || 1;
      this.data = conf.data;
      this.titles = conf.titles;
      this.styles = conf.styles;
      this.listType = conf.listType || 0;
      this.totalCount = conf.totalCount || 0;
      this.updateTitle = conf.updateTitle || false;
    }
    if(!this.containerId)
      return null;
    else {
      this.TitleTable = null;
      this.BodyTable = null;
      this.init();
    }
  };
  list.prototype.init = function () {
    this.totalCount = this.data && this.data.length || 0;
  }
  list.prototype.create = function () {
    var that = this;
    this.createList();
    this.fillContent();
    this.fillList();
    that.BodyTableDiv.mCustomScrollbar({
      theme:"light"
    });
    jQuery("#" + this.containerId + " " + ".mCSB_inside > .mCSB_container").css({
      "margin-right": "0px"
    })
  };
  list.prototype.update = function (param) {
    this.data = param;
    this.create();
  };
  list.prototype.notFreshUpdate = function (param) {
    this.data = param;
    this.fillContent();
    this.fillListBody();
  };
  list.prototype.createList = function () {
    var that = this;
    var container = document.getElementById(this.containerId);
    if(!container)
      return;
    container.innerHTML = "";
    var jqContainer = jQuery(container);
    jqContainer.empty();
    var TitleTable = document.createElement('table');
    jqContainer.append(TitleTable);

    var jqTitleTable = jQuery(TitleTable);
    that.TitleTable = jqTitleTable;
    that.TitleTable.css({
      width: "100%"
    });
    that.setTitleTable(jqTitleTable);
    var BodyTableDiv = document.createElement('div');
    jQuery(BodyTableDiv).css({
      width: "100%",
      position: "relative",
      top: -1
    });
    //jQuery(BodyTableDiv).mCustomScrollbar("destroy");
    that.BodyTableDiv = jQuery(BodyTableDiv);
    jqContainer.append(BodyTableDiv);
    var JqBodyTableDiv = jQuery(BodyTableDiv);
    var BodyTable = document.createElement('table');
    JqBodyTableDiv.append(BodyTable);

    var jqBodyTable = jQuery(BodyTable);
    that.setBodyTable(jqBodyTable);
    that.BodyTable = jqBodyTable;
    that.BodyTable.css({
      width: "100%"
    });
    this.setStyles();

    //this.setStyles(jqTable);
    //this.jqTable = jqTable;
  };
  list.prototype.setTitleTable = function (jqTable) {
    var tbody = document.createElement('thead');
    jqTable.append(tbody);
    var tr = document.createElement('tr');
    jQuery(tbody).append(tr);

    var jqTr = jQuery(tr);
    for(var i = 0; i < this.columnsLmt; i++) {
      var td = document.createElement('td');
      jqTr.append(td);
    }
  };
  list.prototype.setBodyTable = function (jqTable) {
    var tbody = document.createElement('tbody');
    jqTable.append(tbody);
    var jqTbody = jQuery(tbody);
    var length = (this.data.length > this.rowsLmt) ? this.data.length : this.rowsLmt;
    for (var i = 0; i < length; i++) {
      var row = document.createElement('tr');
      jqTbody.append(row);
      var jqRow = jQuery(row);
      for(var j = 0; j < this.columnsLmt; j++) {
        var td = document.createElement('td');
        jqRow.append(td);
      }
    }
  };
  list.prototype.fillContent = function () {
    this.content = [];
    var length = (this.data.length > this.rowsLmt) ? this.data.length : this.rowsLmt;
    for (var i = 0; i < length; i++) {
      var dataItem = this.data[0 + i];
      if(dataItem !== undefined && dataItem !== null)
        this.content.push(dataItem);
    }
  };
  list.prototype.fillList = function () {
    this.fillListTitle();
    this.fillListBody();
  };
  list.prototype.setStyles = function () {
    var that = this;
    var cellspacing = this.styles && this.styles.borderWidth || 1;
    var bgColor = this.styles && this.styles.borderColor || 'black';
    var BodyTableDiv_height = this.styles && this.styles.BodyTableDiv_height || "290px"
    that.TitleTable.attr('cellspacing', cellspacing);
    that.TitleTable.css({
      backgroundColor: bgColor,
      tableLayout: 'fixed'
    });
    that.BodyTable.attr('cellspacing', cellspacing);
    that.BodyTable.css({
      backgroundColor: bgColor,
      tableLayout: 'fixed',
    });
    that.BodyTableDiv.css({
      height: BodyTableDiv_height
    });

    var titleBg = this.styles && this.styles.titleBg || 'white';
    var titleColor = this.styles && this.styles.titleColor || 'black';
    var cellBg = this.styles && this.styles.cellBg || 'white';
    var cellColor = this.styles && this.styles.cellColor || 'black';

    var evenBg = this.styles && this.styles.evenBg;
    var oddBg = this.styles && this.styles.oddBg;

    var titleHeight = this.styles && this.styles.titleHeight || 40;
    var cellHeight = this.styles && this.styles.cellHeight;
    var columnsWidth = this.styles && this.styles.columnsWidth;
    that.TitleTable.find('thead td').css({
      color: titleColor,
      backgroundColor: titleBg,
      textAlign: 'center',
      overflow: '',
      fontWeight: this.styles.theadbold ? 'bold' : 'normal',
      'word-break': 'keep-all',
      'white-space': 'nowrap',
      'text-overflow': 'ellipsis'
    }).height(titleHeight);
    var self = this;
    if(columnsWidth && columnsWidth.length) {
      that.TitleTable.find('thead td').each(function (index, item) {
        if(index < self.columnsLmt && columnsWidth[index]) {
          var itemWidth = Math.round(that.TitleTable.width() * columnsWidth[index]);
          jQuery(item).css({
            width: columnsWidth[index] * 100 + "%"
          });
        }
      });
      that.BodyTable.find('tbody td').each(function (index, item) {
        if((index % self.columnsLmt) < self.columnsLmt && columnsWidth[index]) {
          var itemWidth = Math.round(that.TitleTable.width() * columnsWidth[index]);
          jQuery(item).css({
            width: columnsWidth[index] * 100 + "%"
          });
        }
      });
    }

    that.BodyTable.find('td').css({
      color: cellColor,
      textAlign: 'center',
      overflow: '',
      'word-break': 'keep-all',
      'white-space': 'nowrap',
      'text-overflow': 'ellipsis',
      'position': 'relative'
    }).height(cellHeight);
    that.BodyTable.find('tr:nth-child(2n-1) td').css({
      backgroundColor: (oddBg ? oddBg : cellBg)
    });
    that.BodyTable.find('tr:nth-child(2n) td').css({
      backgroundColor: (evenBg ? evenBg : cellBg)
    });
  };
  list.prototype.fillListTitle = function () {
    var self = this;
    var titleCellContent;
    this.TitleTable.find('thead td').each(function (index, item) {
      if (self.titles && self.titles[index] && (self.titles[index].type == "checkbox")) {
        item.innerHTML = '<input type="checkbox" name="' + self.titles[index].name + '">';
        if (self.titles[index].click) {
          jQuery("input[name='" + self.titles[index].name + "']").unbind("click").click(function () {
            self.titles[index].click.call(this);
          })
        }
      } else {
        titleCellContent = self.titles && self.titles[index] && self.titles[index].label;
        if (titleCellContent !== undefined && titleCellContent !== null)
          item.innerHTML = titleCellContent;
      }
    });
  };
  list.prototype.fillListBody = function () {
    var self = this;
    this.BodyTable.find('tr').each(function (index, item) {
      jQuery(item).children('td').each(function (tdIndex, tdItem) {
        var bodyCellContent = self.content && self.content[index]
          && self.content[index][tdIndex] && self.content[index][tdIndex].label;
        if (bodyCellContent !== undefined && bodyCellContent !== null)
          tdItem.innerHTML = bodyCellContent;
        else
          tdItem.innerHTML = '';
      });
    });
  };
  window.scrollBarList = list;
})(jQuery);