// @formatter:off
(function(JS){

    var analysis = JS.namespace('auAnalysis'), 
        ChannelPicker = JS.checkExist('auAnalysis.ChannelPicker'), 
        ChannelInfoBarChart = JS.checkExist('auAnalysis.ChannelInfoBarChart'), 
        ChannelInfoListChart = JS.checkExist('auAnalysis.ChannelInfoListChart'),
        analyzer = JS.checkExist('auAnalysis.realtimeAnalysis');

    // @formatter:on
    analysis.channelRealtime = {
        init: function() {
            this.auMax = 10;
            this.fetchRemoteQuery();
            
            this.channelPicker = new ChannelPicker({
                channels: analyzer.channels
            });
            this.getChartFilter();
            this.getChannelFilter();

            var self = this;
            this.channelPicker.onUpdate = function() {
                self.updateChart();
            };

            this.channelPicker.setUpdate();
            PanelMenu.onResize = function() {
                if (document.getElementById('channel_realtime_content_container') && (analysis.channelRealtime.chart instanceof ChannelInfoListChart)) {
                    analysis.channelRealtime.chart.list.resize();
                }
            };
        },

        getChannelFilter: function() {
            var self = this;
            var swEls = [{
                label: 'Top10',
                value: function() {
                    return self.getChannelsByRank(10);
                },
                weight: 'default',
            }, {
                label: 'Top20',
                value: function() {
                    return self.getChannelsByRank(20);
                },

            }, {
                label: 'Top30',
                value: function() {
                    return self.getChannelsByRank(30);
                }

            }, {
                label: '频道选择',
                dropdown: {
                    align: 'right',
                    content: function() {
                        return self.getPickerView();
                    },
                    getChangeListener: function(listener) {
                        self.bindPickerListener(listener);
                    }

                },
                value: function() {
                    return self.getPickerResult();
                }

            }];
            this.channelFilter = new StyledSwitcher({
                container: '#channel_realtime_channel_filter',
                elements: swEls,
                styles: {

                }
            });

            this.channelFilter.onChange = function(channels) {
                self.refreshChart(channels);
            };

            this.channelFilter.create();
        },

        getChartFilter: function() {
            var chSwEls = [{
                label: '<div id="channel_realtime_chart_vertical"></div>',
                value: 0,
            }, {
                label: '<div id="channel_realtime_chart_horizontal"></div>',
                value: 1,
                weight: 'default',
            }];
            this.chartFilter = new StyledSwitcher({
                container: '#channel_realtime_chart_filter',
                elements: chSwEls,
                styles: {

                }
            });
            this.chartFilter.create();

            var self = this;
            this.chartFilter.onChange = function(type) {
                self.changeChartType(type);
            };

            this.chartType = this.chartFilter.getValue();
        },

        getChannelsByRank: function(rank) {
            return this.channelPicker.getChannelByRank(rank);
        },

        getPickerView: function() {
            var pickerView = this.channelPicker.getPicker();
            if(this.queryOptionSaved && this.queryOptionSaved.channelIds){
                this.channelPicker.setChosen(this.queryOptionSaved.channelIds);
            }
            return pickerView;
        },

        getPickerResult: function() {
            var channels = this.channelPicker.getResult();
            var channelIds = channels.map(function(e, i){
                return e.channelid;
            }); 
            this.queryOptionSaved = jQuery.extend(this.queryOptionSaved || {}, {
                channelIds:  channelIds
            });
            this.saveQuery();
            return channels;
        },

        bindPickerListener: function(listener) {
            this.channelPicker.addChangeListener(listener);
        },

        refreshChart: function(channels) {
            var auMax = this.channelPicker.getAuMax();
            if (Math.abs(auMax - this.auMax) / this.auMax > 0.1) {
                this.auMax = auMax;
                if (this.auMax <= 0) {
                    this.auMax = 10;
                }
            }

            if (this.chartType === 0) {
                this.chart = new ChannelInfoBarChart({
                    data: channels,
                    container: '#channel_realtime_content_container',
                    max: this.auMax,
                });
                this.chart.getChart();
            } else if (this.chartType === 1) {
                this.chart = new ChannelInfoListChart({
                    data: channels,
                    container: '#channel_realtime_content_container',
                    max: this.auMax,
                });
                this.chart.getChart();
            }
        },

        changeChartType: function(type) {
            this.chartType = type;

            var channels = this.channelFilter.getValue();
            this.refreshChart(channels);
        },

        updateChart: function() {
            var auMax = this.channelPicker.getAuMax();
            if (Math.abs(auMax - this.auMax) / this.auMax > 0.1) {
                this.auMax = auMax;
                if (this.auMax <= 0) {
                    this.auMax = 10;
                }
                this.chart.setAuMax(this.auMax);
            }

            var channels = this.channelFilter.getValue();
            this.chart.update(channels);
        },
        
        fetchRemoteQuery: function(){
            var querySaved = localStorage['AquaPaas_queryOption_rt'];
            if(querySaved){
                this.queryOptionSaved = JSON.parse(querySaved);
            }    
        },
        
        saveQuery: function(){
            if(this.queryOptionSaved){
                localStorage['AquaPaas_queryOption_rt'] = JSON.stringify(this.queryOptionSaved);
            }
        }
    };
    // @formatter:off
}(window.JS));
// @formatter:on
