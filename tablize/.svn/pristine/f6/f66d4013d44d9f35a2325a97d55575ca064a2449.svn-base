// @formatter:off
(function(JS){
    var analysis = JS.namespace('auAnalysis');
    // @formatter:on
    var RatingLineChart = analysis.RatingLineChart = function(option) {
        this.channels = option && option.channels || [];
        this.dayIndex = option && option.dayIndex;
        this.params = option && option.params;
        this.timeRecords = option && option.timeRecords;
        this.indiLabels = option && option.indiLabels;
        this.init();
    };

    RatingLineChart.prototype = {
        init: function() {
            this.lineThick = 1;
            this.widthSpare = 20;
            this.unitRate = this.params.unitRate;
            this.topSpare = this.params.topSpare || 0;
            this.blockHeight = this.params.blockHeight;
            this.height = this.blockHeight - this.topSpare;
            this.stepWidth = this.params.stepWidth;
            this.indiSpace = this.params.indiSpace;
            this.firstSpare = this.params.firstSpare;
            this.timeCount = this.timeRecords.length;
        },

        styles: {
            indiColor: 'rgb(240,240,240)',
        },
        
        getChart: function(){
            var cont = document.createElement('div');
            var svg = this.getChartSVG();
            var labels = this.getChartLabels();
            jQuery(cont).css({
                display: 'inline-block',
                height: this.height,
                position: 'relative',
                marginTop: this.topSpare
            }).append(svg).append(labels);
            return cont;  
        },

        getChartLabels: function(){
            var indiCount = this.indiLabels.length;
            var frag = document.createDocumentFragment();
            for (var n = 0; n < indiCount; n++) {
                var label = document.createElement('p');
                jQuery(label).css({
                    position: 'absolute',
                    left: n * this.indiSpace,
                    top: this.rect.height + 5,
                    width: this.indiSpace
                }).addClass('rating_line_chart_label').append(this.indiLabels[n].substr(0, 5));
                frag.appendChild(label);
            }
            
            var day = this.channels[0] && this.channels[0].days &&
                this.channels[0].days[this.dayIndex] &&
                this.channels[0].days[this.dayIndex].day;
            var year = day.substr(0, 4);
            var month = day.substr(4, 2);
            var date = day.substr(6, 2);
            var dayStr = year + '-' + month + '-' + date;
            
            var dayLabel = document.createElement('p');
            jQuery(dayLabel).css({
                position: 'absolute',
                top: this.rect.height + 20
            }).addClass('channel_history_day_label').text(dayStr).appendTo(frag);
            return frag;
        },

        getChartSVG: function() {
            var canvasWidth = Math.ceil((this.timeCount - 1) * this.stepWidth) + this.widthSpare + this.firstSpare;

            this.origin = {
                x: 0,
                y: this.height,
            };

            this.rect = {
                width: canvasWidth,
                height: this.height,
            };

            var matrix = this.getLineMatrix();

            var lines = '';
            for (var i = 0, len = matrix.length; i < len; i++) {
                var line = matrix[i];
                var channel = this.channels[i];
                var lineColor = channel && channel.lineColor || 'rgb(154,154,154)';
                if (line && line.length > 0) {
                    var points = '';
                    for (var j = 0, jLen = line.length; j < jLen; j++) {
                        var point = line[j];
                        var pointX = this.xTrans(point.x);
                        var pointY = this.yTrans(point.y);
                        points += (pointX + ',' + pointY);
                        if (j < jLen - 1) {
                            points += ' ';
                        }
                    }
                    // @formatter:off
                    var polyline = '<polyline points="' + points + '"' +
                            ' style="fill:none;stroke:' + lineColor + ';' + 'storke-width:1;"/>';
                    var hoverLine = '<polyline points="' + points + '"' +
                            ' style="fill:none;stroke:transparent;' + 'storke-width:7;"' +
                            ' channelid="' + channel.channelid + '"' +
                            ' dateindex="' + this.dayIndex + '"/>';  
                    // @formatter:on
                    lines += polyline;
                    lines += hoverLine;
                }
            }

            var indiLines = '';
            var indiCount = this.indiLabels.length;
            var indiHeight = this.rect.height;
            for (var k = 0; k < indiCount; k++) {
                var indiX = this.firstSpare + k * this.indiSpace;
                indiX = this.xTrans(indiX);
                var x1 = indiX;
                var x2 = indiX;
                var y1 = this.yTrans(0);
                var y2 = this.yTrans(indiHeight);
                var indiLine = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + ' style="fill:none;stroke-width:1;stroke:' + this.styles.indiColor + '"/>';
                indiLines += indiLine;
            }

            var svg = '<svg width="' + canvasWidth + '" ' + ' height="' + this.height + '">' + indiLines + lines + '</svg>';
      
            return svg;        
        },

        getChartCanvas: function() { 
            var canvasWidth = Math.ceil((this.timeCount - 1) * this.stepWidth) + this.widthSpare + this.firstSpare;

            this.origin = {
                x: 0,
                y: this.height,
            };

            this.rect = {
                width: canvasWidth,
                height: this.height,
            };

            var matrix = this.getLineMatrix();

            var canvas = document.createElement('canvas');
            jQuery(canvas).attr({
                width: this.rect.width,
                height: this.rect.height
            }).css('z-index', '5');

            var cx = canvas.getContext('2d');
            cx.lineWidth = this.lineThick;

            for (var i = 0, max = matrix.length; i < max; i++) {
                var line = matrix[i];
                var channel = this.channels[i];
                var lineColor = channel && channel.lineColor || 'rgb(154,154,154)';
                cx.beginPath();
                cx.strokeStyle = lineColor;
                if (line && line.length > 0) {
                    for (var j = 0, jMax = line.length; j < jMax; j++) {
                        var point = line[j];
                        if (point === null) {
                            continue;
                        }
                        if (j === 0) {
                            cx.moveTo(this.xTrans(point.x), this.yTrans(point.y));
                        } else {
                            cx.lineTo(this.xTrans(point.x), this.yTrans(point.y));
                        }
                    }
                    cx.stroke();
                }
            }

            var indiCount = this.indiLabels.length;
            var indiHeight = this.rect.height;
            cx.beginPath();
            cx.strokeStyle = this.styles.indiColor;
            for (var k = 0; k < indiCount; k++) {
                var pointX = this.firstSpare + k * this.indiSpace;
                cx.moveTo(this.xTrans(pointX), this.yTrans(0));
                cx.lineTo(this.xTrans(pointX), this.yTrans(indiHeight));
            }
            cx.stroke();

            return canvas;
        },

        getLineMatrix: function() {
            var matrix = [];
            for (var i = 0, len = this.channels.length; i < len; i++) {
                matrix.push(this.getLinePoints(this.channels[i]));
            }
            return matrix;
        },

        getLinePoints: function(channel) {
            var linePoints = [];
            var times = channel && channel.days && channel.days[this.dayIndex] && channel.days[this.dayIndex].details || [];
            for (var i = 0; i < this.timeCount; i++) {
                var time = times[i];
                var pointY = this.getPointY(time.rating);
                var pointX = i * this.stepWidth + this.firstSpare;
                if (i === 0) {
                    linePoints[0] = {
                        x: 0,
                        y: pointY,
                    };
                }
                linePoints.push({
                    x: pointX,
                    y: pointY
                });

            }

            return linePoints;
        },

        compareTime: function(aTime, bTime) {
            var aParts = aTime.split(':');
            var bParts = bTime.split(':');

            var aH = parseInt(aParts[0], 10);
            var bH = parseInt(bParts[0], 10);
            if (aH < bH) {
                return -1;
            } else if (aH > bH) {
                return 1;
            }

            if (!aParts[1] || !bParts[1]) {
                return 0;
            }

            var aM = parseInt(aParts[1], 10);
            var bM = parseInt(bParts[1], 10);
            if (aM < bM) {
                return -1;
            } else if (aM > bM) {
                return 1;
            }

            if (!aParts[2] || !bParts[2]) {
                return 0;
            }

            var aS = parseInt(aParts[2], 10);
            var bS = parseInt(bParts[2], 10);
            if (aS < bS) {
                return -1;
            } else if (aS > bS) {
                return 1;
            } else {
                return 0;
            }
        },

        sortTimes: function(times) {
            var self = this;
            times.sort(function(a, b) {
                var aTime = a.time;
                var bTime = b.time;
                return self.compareTime(aTime, bTime);
            });
        },

        getPointY: function(rating) {
            if ( typeof rating === 'undefined') {
                return 0;
            }
            if(isNaN(this.unitRate) || this.unitRate == 0){
                return 0;
            }
            var height = Math.floor(rating / this.unitRate);
            return height;
        },

        xTrans: function(axX) {
            return this.origin.x + axX;
        },

        yTrans: function(axY) {
            return this.origin.y - axY;
        },

    };

    // @formatter:off   
}(window.JS));
// @formatter:on
