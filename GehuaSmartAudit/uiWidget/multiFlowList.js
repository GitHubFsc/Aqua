( function($) {
    function MultiFlowList(obj) {
        $.extend(this, obj);
        this.init();
    }


    MultiFlowList.prototype = {
        init: function() {
            this.minRows = this.minRows || 0;
            this.title = this.title || [];
            this.data = this.data || [];
            this.container = $(this.container);
        },

        create: function() {
            this.setEventHandler();
            this.container.empty().append(this.getList());
            this.container.find('.styled-flow-list-content-container').mCustomScrollbar({
                theme:"my-theme"
            });
        },

        setEventHandler: function() {
            var self = this;
            this.container.on('change', 'input', function(ev) {
                var $box = $(this);
                var pos = $box.attr('name');
                if (pos === 'styled-flow-list-head-item') {
                    if (this.checked) {
                        self.container.find('input[name="styled-flow-list-body-item"]').prop('checked', true);
                    } else {
                        self.container.find('input[name="styled-flow-list-body-item"]').prop('checked', false);
                    }
                } else if (pos === 'styled-flow-list-body-item') {
                    if (this.checked) {
                        if (Array.prototype.every.call(self.container.find('input[name="styled-flow-list-body-item"]'), function(item) {
                            return item.checked == true;
                        })) {
                            self.container.find('input[name="styled-flow-list-head-item"]').first().prop('checked', true);
                        }
                    } else {
                        self.container.find('input[name="styled-flow-list-head-item"]').first().prop('checked', false);
                    }
                }
            });
        },

        getList: function() {
            var headStr = '<tr>';
            headStr += '<th></th>';
            headStr += '<th><input type="checkbox" name="styled-flow-list-head-item"/></th>';
            var titleCount = this.title.length;
            for(var j = 0; j < titleCount; j += 1){
                var title = this.title[j];
                if(title != null){
                    headStr += '<th>' + (title.label != null ? title.label : '') + '</th>';
                } else {
                    headStr += '<th></th>';
                }
            }
            headStr += '</tr>';
            var bodyStr = '';
            var lmt = Math.max(this.data.length, this.minRows);
            for (var i = 0; i < lmt; i++) {
                var item = this.data[i];
                var rowStr = '<tr>';
                rowStr += '<td>' + (i + 1) + '</td>';
                if (item != null) {
                    rowStr += '<td><input type="checkbox" name="styled-flow-list-body-item" data-index="' + i + '"/></td>';
                    for(var m = 0; m < titleCount; m += 1){
                        rowStr += '<td>' + (item[m] != null ? (item[m].label != null ? item[m].label : '') : '') + '</td>';
                    }
                } else {
                    rowStr += '<td><input type="checkbox"/></td>';
                    for(var n = 0; n < titleCount; n += 1){
                        rowStr += '<td></td>';
                    }
                }
                rowStr += '</tr>';
                bodyStr += rowStr;
            }
            var tableheadStr = '<table>';
            tableheadStr += headStr;
            tableheadStr += '</table>';
            var tableStr = '<div class = "styled-flow-list-content-container"><table>';
            tableStr += bodyStr;
            tableStr += '</table></div>';
            var $frag = $(document.createDocumentFragment());
            $frag.append(tableheadStr);
            $frag.append(tableStr);
            return $frag;
        },

        getChecked: function() {
            var self = this;
            var checked = [];
            this.container.find('input[name="styled-flow-list-body-item"]').each(function() {
                if (this.checked) {
                    checked.push(self.data[$(this).attr('data-index')]);
                }
            });
            return checked;
        },

        getData: function() {
            return this.data;
        },

        update: function(data) {
            this.data = data || [];
            this.container.empty().append(this.getList());
            this.container.find('.styled-flow-list-content-container').mCustomScrollbar({
                theme:"my-theme"
            });
        }

    };

    window.MultiFlowList = MultiFlowList;
}(jQuery));
