( function($) {
    function StyledFlowList(obj) {
        $.extend(this, obj);
        this.init();
    }


    StyledFlowList.prototype = {
        init: function() {
            this.minRows = this.minRows || 0;
            this.title = this.title || {
                label: ''
            };
            this.data = this.data || [];
            this.container = $(this.container);
        },

        create: function() {
            this.setEventHandler();
            this.container.empty().append(this.getList());
            $('.styled-flow-list-content-container').mCustomScrollbar({
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
                        self.container.find('input[name="styled-flow-list-body-item"]').each(function(index) {
                            this.checked = true;
                        });
                    } else {
                        self.container.find('input[name="styled-flow-list-body-item"]').each(function(index) {
                            this.checked = false;
                        });
                    }
                } else if (pos === 'styled-flow-list-body-item') {
                    if (this.checked) {
                        var checks = [];
                        self.container.find('input[name="styled-flow-list-body-item"]').each(function(index) {
                            checks.push(this);
                        });
                        if (checks.every(function(item) {
                            if (item.checked) {
                                return true;
                            } else {
                                return false;
                            }
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
            headStr += '<th>' + this.title.label + '</th>';
            headStr += '</tr>';
            var bodyStr = '';
            var lmt = Math.max(this.data.length, this.minRows);
            for (var i = 0; i < lmt; i++) {
                var item = this.data[i];
                var rowStr = '<tr>';
                rowStr += '<td>' + (i + 1) + '</td>';
                if (item) {
                    rowStr += '<td><input type="checkbox" name="styled-flow-list-body-item" data-index="' + i + '"/></td>';
                    rowStr += '<td>' + item.label + '</td>';
                } else {
                    rowStr += '<td><input type="checkbox"/></td><td></td>';
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
            $('.styled-flow-list-content-container').mCustomScrollbar({
                theme:"my-theme"
            });
        }

    };

    window.StyledFlowList = StyledFlowList;
}(jQuery));
