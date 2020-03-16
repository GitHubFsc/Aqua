// @formatter:off
(function(JS){
    
    var analysis = JS.namespace('auAnalysis'), 
        ChannelBarView = JS.checkExist('auAnalysis.ChannelBarView'),
        ChartAxes = JS.checkExist('auAnalysis.ChartAxes');
    // @formatter:on

    var ChannelInfoBarChart = analysis.ChannelInfoBarChart = function(options) {
        var container = options && options.container;
        if ( typeof container == 'string') {
            if (container.substr(0, 1) === '#') {
                this.containerId = container.slice(1);
                this.container = jQuery(container).empty();
            } else {
                this.containerId = container;
                this.container = jQuery(document.getElementById(container)).empty();
            }
        } else {
        }
        this.auMax = options && options.max;
        this.data = options && options.data;

        if (!this.init()) {
            return null;
        }
    };

    ChannelInfoBarChart.prototype = {

        init: function() {
            if (!this.containerId && !this.container) {
                return false;
            }

            if ( typeof this.data !== 'array') {
                return false;
            }
            
            this.unit = 1;

            return true;
        },

        axParams: {
            axLmt: 450,
            axStep: 50,
            unit: '人数(万人)',
            unitHeight: 30,
            axSpare: 15,
            xAxLeft: 45,
            division: 10000,
            minLmt: 0.0001,
            minStep: 0.0001,
            pointWeight: 1,
            precision: 4
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

        getAxes: function() {
            this.axParams.precision = this.precision;
            this.axParams.pointWeight = this.pointWeight;
            this.axParams.container = this.container;
            this.axes = new ChartAxes(this.axParams);
            this.axes.getAxes();
        },

        getBars: function() {
            this.barsGroup = {};

            var innerBarCont = document.createElement('div');
            var jqInnerBarCont = jQuery(innerBarCont).css({
                height: '100%',
                position: 'absolute',
            });
            for (var i = 0, max = this.data.length; i < max; i++) {
                var chItem = this.data[i];
                var channelView = new ChannelBarView({
                    channel: chItem,
                    params: {
                        height: this.axes.axOrigin.y,
                        unit: this.unit
                    }
                });
                var viewContent = channelView.getBarView();
                jQuery(viewContent).css({
                    left: i * 100 + 10,
                });
                jqInnerBarCont.append(viewContent);
                this.barsGroup[chItem.label] = channelView;
            }
            jqInnerBarCont.width(this.data.length * 100 + 150);

            this.jqBarCont.empty().append(innerBarCont);
        },
        getChart: function() {
            this.container.empty();
            this.getChartParams();

            this.getAxes();
            // @formatter:off
            var colorIns = '<div id="channel_realtime_colors">' + 
                    '<div class="channel_realtime_color"></div><p>收视率</p>' +
                    '<div class="channel_realtime_color"></div><p>流入</p>' + 
                    '<div class="channel_realtime_color"></div><p>流出</p>' +
                    '</div>';
            // @formatter:oon
            this.container.append(colorIns);
            
            var barCont = document.createElement('div');
            this.jqBarCont = jQuery(barCont).css({
                position: 'absolute',
                top: 0,
                left: this.axParams.xAxLeft,
                right: 0,
                bottom: 0,
                'overflow-y': 'hidden',
                'overflow-x': 'auto',
            });

            this.container.append(barCont);

            this.getBars();
        },
        
        // units: [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000],
        // divisions: [100000, 50000, 20000 ,10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1],
        // precisions: [4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 0, 0, 0],

        getChartParams: function() {
            // for(var i = 0, len = this.units.length; i < len; i++){
                // this.unit = this.units[i];
                // this.division = this.divisions[i];
                // this.precision = this.precisions[i];
                // var height = this.auMax/this.unit;
                // if(height <= this.axParams.axLmt){
                    // break;
                // }
            // }
            var pointWeight = this.auMax / 400;
            var precision = 0;
            if(pointWeight > 9999){
                precision = 0;
            }else if(pointWeight > 999){
                precision = 1;
            }else if(pointWeight > 99){
                precision = 2;
            }else if(pointWeight > 9){
                precision = 3;
            }else {
                precision = 4;
            }
            this.unit = pointWeight;
            this.pointWeight = pointWeight;
            this.precision = precision;
        },

        update: function(channels) {
            this.data = channels;
            this.getBars();
        },

        setAuMax: function(max) {
            this.auMax = max;
            
            this.getChartParams();
            this.axParams.precision = this.precision;
            this.axParams.pointWeight = this.pointWeight;
            this.axes.update(this.axParams);
        },

    };
    // @formatter:off
}(window.JS));
// @formatter:on