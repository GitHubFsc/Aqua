// @formatter:off
(function(JS) {
    var analysis = JS.namespace('auAnalysis');
    // @formatter:on
    var RatingInfoList = analysis.RatingInfoList = function(option) {
        this.channels = option && option.channels || [];
        this.params = option && option.params;
        this.init();
    };

    RatingInfoList.prototype = {
        init: function() {
            this.container = this.params && this.params.container;
        },

        getList: function() {
            if(this.channels.length === 0){
                this.container.empty();
                return;   
            }
            
            var list = document.createElement('table');
            list.className = 'channel_history_info_list';
            var head = jQuery(document.createElement('tr')).appendTo(list);
            jQuery(document.createElement('td')).attr('colspan', 3).appendTo(head);
            jQuery(document.createElement('td')).append('最小').appendTo(head);
            jQuery(document.createElement('td')).append('平均').appendTo(head);
            jQuery(document.createElement('td')).append('最大').appendTo(head);
            
            for (var i = 0, len = this.channels.length; i < len; i++) {
                var channel = this.channels[i];
                var row = document.createElement('tr');
                var channelName = channel.label;
                var lineColor = channel.lineColor;
                var chMin = channel.min || '';
                var chMax = channel.max || '';
                var chAvg = channel.avg || '';
                chMin = Number(chMin).toFixed(1) + '%';
                chMax = Number(chMax).toFixed(1) + '%';
                chAvg = Number(chAvg).toFixed(1) + '%';
                var colorRect = document.createElement('div');
                colorRect.className = 'channel_history_info_list_colorRect';
                jQuery(colorRect).css({
                    width: 40,
                    height: 2,
                    backgroundColor: lineColor,
                });
                jQuery(document.createElement('td')).attr('colspan', 3).append(colorRect).append(channelName).appendTo(row);
                jQuery(document.createElement('td')).append(chMin).appendTo(row);
                jQuery(document.createElement('td')).append(chAvg).appendTo(row);
                jQuery(document.createElement('td')).append(chMax).appendTo(row);
                list.appendChild(row);
            }
            
            this.container.empty().append(list);
        },

    };
    // @formatter:off
}(window.JS));
// @formatter:on
