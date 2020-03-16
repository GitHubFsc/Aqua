// @formatter:off
(function(JS){
// @formatter:on
    var analysis = JS.namespace('auAnalysis');

    var ChannelInfoListChart = analysis.ChannelInfoListChart = function(options) {
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

        this.data = options && options.data;
        this.auMax = options && options.max;

        if (!this.init()) {
            return null;
        }
    };

    ChannelInfoListChart.prototype = {
        titles: {
            rank: '排名',
            channel: '频道名称',
            auNum: '收视人数',
            auRate: '收视率',
            streamOut: '流出',
            streamIn: '流入',
            currProgram: '目前收看节目'
        },

        init: function() {
            if (!this.containerId && !this.container) {
                return false;
            }

            if ( typeof this.data !== 'array') {
                return false;
            }

            return true;
        },

        getChart: function() {
            this.container.empty();
            
            this.charBarWidth = Math.floor(jQuery('#channel_realtime_content_container').width() * 0.3);
            
            this.formatData();

            this.list = new StyledList({
                containerId: this.containerId,
                rows: 12,
                columns: 7,
                titles: [{
                    label: this.titles.rank
                }, {
                    label: this.titles.channel
                }, {
                    label: this.titles.auNum
                }, {
                    label: this.titles.auRate
                }, {
                    label: this.titles.streamOut
                }, {
                    label: this.titles.streamIn
                }, {
                    label: this.titles.currProgram
                }],
                listType: 0,
                data: this.listData,
                styles: {
                    borderColor: 'rgb(226,226,226)',
                    borderWidth: 1,
                    titleHeight: 30,
                    titleBg: 'rgb(58,183,249)',
                    titleColor: 'white',
                    cellBg: 'white',
                    cellColor: 'rgb(121,121,121)',
                    footBg: 'white',
                    footColor: 'rgb(121,121,121)',
                    iconColor: 'rgb(58,183,249)',
                    inputBorder: '1px rgb(203,203,203) solid',
                    inputBg: 'white',
                    columnsWidth: [0.05, 0.1, 0.30, 0.08, 0.13, 0.13]
                }
            });

            this.list.create();
        },

        formatData: function() {
            var listData = [];
            for (var i = 0, max = this.data.length; i < max; i++) {
                var dataItem = this.data[i];

                if (!dataItem)
                    continue;

                var listItem = [];
                listItem.push({
                    label: dataItem.rank !== undefined ? dataItem.rank : '',
                });
                listItem.push({
                    label: dataItem.label !== undefined ? dataItem.label : '',
                });
                listItem.push({
                    label: uiUtil.getChartBar({
                        max: Math.ceil(dataItem.auNum/dataItem.auRate),
                        num: dataItem.auNum,
                        barWidth: this.charBarWidth,
                    }),
                });
                listItem.push({
                    label: uiUtil.toPercentage(dataItem.auRate),
                });
                listItem.push({
                    label: uiUtil.getStreamText({
                        direction: 'out',
                        num: dataItem.streamOut
                    }),
                });
                listItem.push({
                    label: uiUtil.getStreamText({
                        direction: 'in',
                        num: dataItem.streamIn
                    }),
                });
                listItem.push({
                    label: dataItem.currProgram !== undefined ? dataItem.currProgram : '',
                });

                listData.push(listItem);
            }

            this.listData = listData;
        },

        update: function(channels) {
            this.data = channels;
            this.formatData();
            this.list.updateInPage(this.listData);
        },
        
        setAuMax: function(max){
            this.auMax = max;  
        },

    };
    // @formatter:off
}(window.JS));
// @formatter:on
