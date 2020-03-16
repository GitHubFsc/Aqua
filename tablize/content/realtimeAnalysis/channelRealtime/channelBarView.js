// @formatter:off
(function(JS){
// @formatter:on
    var analysis = JS.namespace('auAnalysis');
    var ChannelBarView = analysis.ChannelBarView = function (option) {
        this.channel = option && option.channel;

        this.params = option && option.params;
    };

    ChannelBarView.prototype = {
        init: function() {

        },

        styles: {
            barWidth: 16,
            auNumColor: 'rgb(55,200,242)',
            streamOutColor: 'rgb(32,205,130)',
            streamInColor: 'rgb(242,54,107)',
            barBorderRadius: '3px 3px 0 0',
            barTextColor: 'rgb(121,121,121)',
            barSpacing: 5,
        },

        getBarView: function() {
            var self = this;

            var name = this.channel.label;
            var auNum = this.channel.auNum;
            var auRate = this.channel.auRate;
            var streamIn = this.channel.streamIn;
            var streamOut = this.channel.streamOut;
            var rank = this.channel.rank;
            var program = this.channel.currProgram || '';

            var auBar = uiUtil.getBar(this.getBarHeight(auNum), this.styles.barWidth, this.styles.auNumColor, this.styles.barBorderRadius);
            var stInBar = uiUtil.getBar(this.getBarHeight(streamIn), this.styles.barWidth, this.styles.streamInColor, this.styles.barBorderRadius);
            var stOutBar = uiUtil.getBar(this.getBarHeight(streamOut), this.styles.barWidth, this.styles.streamOutColor, this.styles.barBorderRadius);

            this.auBar = jQuery(auBar).css({
                position: 'absolute',
                left: this.styles.barSpacing,
                bottom: 0
            });

            this.stInBar = jQuery(stInBar).css({
                position: 'absolute',
                left: parseInt(this.styles.barWidth, 10) + this.styles.barSpacing * 2,
                bottom: 0,
            });
            this.stOutBar = jQuery(stOutBar).css({
                position: 'absolute',
                left: parseInt(this.styles.barWidth, 10) * 2 + this.styles.barSpacing * 3,
                bottom: 0,
            });

            var auRateView = document.createElement('p');
            this.auRateView = jQuery(auRateView).css({
                position: 'absolute',
                height: '12px',
                fontSize: '12px',
                lineHeight: '12px',
                bottom: this.getBarHeight(auNum) + this.styles.barSpacing,
                width: parseInt(this.styles.barWidth, 10) + this.styles.barSpacing * 2,
                textAlign: 'center',
            }).append(uiUtil.toPercentage(auRate));

            var channelName = document.createElement('p');
            jQuery(channelName).css({
                position: 'absolute',
                top: 'calc(100% + 5px)',
                height: '15px',
                lineHeight: '15px',
                textAlign: 'center',
                width: parseInt(this.styles.barWidth, 10) * 3 + this.styles.barSpacing * 3,
            }).append(name);

            var detailAnchor = document.createElement('div');
            jQuery(detailAnchor).css({
                position: 'absolute',
                height: '12px',
                width: '12px',
                borderRadius: '6px',
                backgroundColor: 'rgb(231,231,231)',
                border: '1px solid rgb(204,204,204)',
                left: '-7px',
                top: '213px',
                'box-shadow': '2px 2px 0px rgb(10,134,198)',
            });

            var detailView = document.createElement('div');
            this.detailView = jQuery(detailView).css({
                position: 'absolute',
                width: 220,
                height: 220,
                left: this.styles.barSpacing + Math.floor(parseInt(this.styles.barWidth, 10) / 2),
                bottom: Math.floor(this.getBarHeight(auNum) / 2),
                backgroundColor: 'white',
                border: '1px solid rgb(203,203,203)',
                zIndex: 10,
                'box-shadow': '2px 2px 0px rgb(10,134,198)'
            }).append(uiUtil.getChartBarDetail({
                'channel': name,
                'rank': rank,
                audience: auNum,
                audienceRating: auRate,
                flowIn: streamIn,
                flowOut: streamOut,
                'program': program
            })).append(detailAnchor).hide();

            var barsCont = document.createElement('div');
            jQuery(barsCont).css({
                position: 'absolute',
                height: this.params.height,
                top: 0,
                width: parseInt(this.styles.barWidth, 10) * 3 + this.styles.barSpacing * 3,
                color: this.styles.barTextColor,
            }).append(auBar).append(stInBar).append(stOutBar).append(channelName).append(auRateView).append(detailView).hover(function() {
                self.showDetail(true);
            }, function() {
                self.showDetail(false);
            });

            return barsCont;
        },

        showDetail: function(show) {
            if (show) {
                this.detailView.show();
            } else {
                this.detailView.hide();
            }
        },

        getBarHeight: function(num) {
            var num = parseInt(num, 10);
            if (isNaN(num) || typeof this.params.unit == 'undefined' || this.params.unit == 0) {
                return 0;
            } else {
                return Math.ceil(num / this.params.unit);
            }
        },

        update: function() {
            var name = this.channel.label;
            var auNum = this.channel.auNum;
            var auRate = this.channel.auRate;
            var streamIn = this.channel.streamIn;
            var streamOut = this.channel.streamOut;
            var rank = this.channel.rank;
            var program = this.channel.currProgram || '';

            this.auBar.height(this.getBarHeight(auNum));
            this.auRateView.css({
                bottom: this.getBarHeight(auNum) + this.styles.barSpacing,
            }).empty().append(uiUtil.toPercentage(auRate));
            this.stInBar.height(this.getBarHeight(streamIn));
            this.stOutBar.height(this.getBarHeight(streamOut));
            this.detailView.empty().append(uiUtil.getChartBarDetail({
                'channel': name,
                'rank': rank,
                audience: auNum,
                audienceRating: auRate,
                flowIn: streamIn,
                flowOut: streamOut,
                'program': program
            }));
        },

    };
    // @formatter:off
}(window.JS));
// @formatter:on
