// @formatter:off
(function(JS){
    var analysis = JS.namespace('auAnalysis');
    // @formatter:on
    var RatingBlockView = analysis.RatingBlockView = function(option) {
        this.day = option && option.day;
        this.params = option && option.params;
        this.init();
    };

    RatingBlockView.prototype = {

        init: function() {
            this.unitRate = this.params && this.params.unitRate;
            this.topSpare = this.params && this.params.topSpare;
            this.blockHeight = this.params && this.params.blockHeight;
            this.stepWidth = this.params && this.params.stepWidth;
            this.height = this.blockHeight - this.topSpare;
            this.times = this.day && this.day.details || [];
            this.lineThick = 1;
            this.lineColor = '#ff0000';
            this.timeCount = this.times.length;
        },

        getBlockView: function() {
            var block = document.createElement('div');
            // var polyline = this.getPolyline();
            var polyline = this.getPolySVG();
            var dayLabel = this.getDayLabel();
            var avgLabel = this.getAvgLabel();

            this.$block = jQuery(block).css({
                display: 'inline-block',
                height: this.height,
                position: 'relative',
                marginTop: this.topSpare,
            }).append(polyline).append(dayLabel).append(avgLabel);

            return block;
        },

        getTimeLabels: function() {
            var self = this;
            this.timeStep = this.timeStep || 1;
            var timeShown = this.times.map(function(e, i) {
                if (i % self.timeStep === 0) {
                    return e.time.substr(0, 5);
                }
            });
            timeShown = timeShown.filter(function(e, i) {
                if (e) {
                    return e;
                }
            });

            var cont = document.createElement('div');
            jQuery(cont).addClass('program_history_time_labels_container');
            for (var i = 0, max = timeShown.length; i < max; i++) {
                var label = document.createElement('p');
                jQuery(label).css({
                    display: 'inline-block'
                }).addClass('program_history_time_label').append(timeShown[i]);
                cont.appendChild(label);
            }
            return cont;
        },

        getDayLabel: function() {
            var label = document.createElement('p');
            var day = this.day.day;
            var year = day.substr(0, 4);
            var month = day.substr(4, 2);
            var date = day.substr(6, 2);
            var dayStr = year + '-' + month + '-' + date;

            jQuery(label).addClass('programHistory_dayLabel').append(dayStr);

            return label;
        },

        getAvgLabel: function() {
            var label = document.createElement('p');
            var max = '' + Number(this.day.max).toFixed(1) + '%<br>';
            var avg = '' + Number(this.day.avg).toFixed(1) + '%<br>';
            var min = '' + Number(this.day.min).toFixed(1) + '%';

            jQuery(label).addClass('programHistory_dayAvgLabel').append(max).append(avg).append(min);

            return label;
        },

        getPolySVG: function() {
            var canvasWidth = Math.ceil((this.timeCount - 1) * this.stepWidth);

            this.origin = {
                x: 0,
                y: this.height,
            };

            this.rect = {
                width: canvasWidth,
                height: this.height,
            };

            var linePoints = this.getLinePoints();

            var points = '';
            for (var i = 0, max = linePoints.length; i < max; i++) {
                var point = linePoints[i];
                points += this.xTrans(point.x) + ',' + this.yTrans(point.y);
                if (i < max - 1) {
                    points += ' ';
                }
            }
            // @formatter:off
            var polyline = '<polyline points="' + points + '"' +
                    ' style="fill:none;stroke:' + this.lineColor + ';' + 'storke-width:' + this.lineThick + ';"/>';
            // @formatter:on

            var svg = '<svg width="' + this.rect.width + '" ' + ' height="' + this.rect.height + '">' + polyline + '</svg>';
            return svg;
        },

        getPolyline: function() {
            var canvasWidth = Math.ceil((this.timeCount - 1) * this.stepWidth);

            this.origin = {
                x: 0,
                y: this.height,
            };

            this.rect = {
                width: canvasWidth,
                height: this.height,
            };

            var linePoints = this.getLinePoints();

            var canvas = document.createElement('canvas');
            jQuery(canvas).attr({
                width: this.rect.width,
                height: this.rect.height
            }).css('z-index', '5');

            var cx = canvas.getContext('2d');
            cx.lineWidth = this.lineThick;
            cx.strokeStyle = this.lineColor;

            for (var i = 0, max = linePoints.length; i < max; i++) {
                var point = linePoints[i];
                if (i === 0) {
                    cx.moveTo(this.xTrans(point.x), this.yTrans(point.y));
                } else {
                    cx.lineTo(this.xTrans(point.x), this.yTrans(point.y));
                }
            }
            cx.stroke();

            return canvas;
        },

        getLinePoints: function() {
            var linePoints = [];
            for (var i = 0; i < this.timeCount; i++) {
                var time = this.times[i];
                var pointX = i * this.stepWidth;
                var pointY = this.getPointY(time.rating);
                linePoints.push({
                    x: pointX,
                    y: pointY,
                });
            }
            return linePoints;
        },

        getPointY: function(rating) {
            if ( typeof rating === 'undefined') {
                return 0;
            }
            if (isNaN(this.unitRate) || this.unitRate == 0) {
                return 0;
            }
            var height = Math.floor(rating / this.unitRate);
            return height;
        },

        xTrans: function(x) {
            return this.origin.x + x;
        },

        yTrans: function(y) {
            return this.origin.y - y;
        },

        zoomIn: function() {
            var svg = this.$block.children('svg');
            var polyline = svg.children('polyline').first();

            var width = svg.attr('width');
            this.originalWidth = width;

            var points = polyline.attr('points');
            this.originalPoints = points;

            if ( typeof this.targetWidth !== 'undefined' && typeof this.targetPoints !== 'undefined') {
                svg.attr('width', this.targetWidth);
                polyline.attr('points', this.targetPoints);
                this.$block.children('.programHistory_dayLabel').hide();
                this.$block.children('.program_history_time_labels_container').show();
                return;
            }

            var configLevel = parseInt(PROGRAM_HISTORY_DATE_ZOOM_LEVEL || 1, 10);
            var zoomLevel;
            if (isNaN(configLevel)) {
                zoomLevel = 1;
            } else {
                zoomLevel = Math.min(50, Math.max(configLevel, 1));
            }

            var targetWidth = parseInt(width, 10) * zoomLevel;
            this.targetWidth = targetWidth;

            var pointsArray = points.split(' ');
            var pointsXYArray = pointsArray.map(function(e, i) {
                var coords = e.split(',');
                var x = parseInt(coords[0], 10);
                var y = parseInt(coords[1], 10);
                return {
                    x: x,
                    y: y
                };
            });
            pointsXYArray.forEach(function(e, i) {
                e.x = e.x * zoomLevel;
            });
            var targetPoints = '';
            for (var i = 0, max = pointsXYArray.length; i < max; i++) {
                var point = pointsXYArray[i];
                targetPoints += point.x + ',' + point.y;
                if (i < max - 1) {
                    targetPoints += ' ';
                }
            }
            this.targetPoints = targetPoints;
            svg.attr('width', targetWidth);
            polyline.attr('points', targetPoints);

            var targetStep = this.stepWidth * zoomLevel;
            if (targetStep > 50) {
                this.timeStep = 1;
            } else {
                this.timeStep = Math.ceil(50/targetStep);
            }

            var timeLabels = this.getTimeLabels();

            var timeLabelWidth = this.timeStep * targetStep;
            jQuery(timeLabels).children('.program_history_time_label').each(function(i, e) {
                var $e = jQuery(e);
                if (i == 0) {
                    $e.css('visibility', 'hidden');
                }
                $e.css({
                    width: timeLabelWidth,
                    left: 0 - Math.floor(timeLabelWidth / 2)
                });
            });

            this.$block.children('.programHistory_dayLabel').hide();
            this.$block.append(timeLabels);
        },

        zoomOut: function() {
            if ( typeof this.originalWidth !== 'undefined' && typeof this.originalPoints !== 'undefined') {
                var svg = this.$block.children('svg');
                var polyline = svg.children('polyline').first();

                svg.attr('width', this.originalWidth);
                polyline.attr('points', this.originalPoints);

                this.$block.children('.program_history_time_labels_container').hide();
                this.$block.children('.programHistory_dayLabel').show();
            }
        },

    };

    // @formatter:off
}(window.JS));
// @formatter:on
