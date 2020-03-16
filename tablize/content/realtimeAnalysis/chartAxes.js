// @formatter:off
(function(JS){
// @formatter:on
    var analysis = JS.namespace('auAnalysis');

    var ChartAxes = analysis.ChartAxes = function(options) {
        this.container = options && options.container;
        this.axLmt = options && options.axLmt;
        this.axStep = options && options.axStep;
        this.unit = options && options.unit;
        this.unitHeight = options && options.unitHeight;
        this.axSpare = options && options.axSpare;
        this.xAxLeft = options && options.xAxLeft;
        this.division = options && options.division;
        this.precision = options && options.precision;
        this.maxLmt = options && options.maxLmt;
        this.minLmt = options && options.minLmt;
        this.minStep = options && options.minStep;
        this.pointWeight = options && options.pointWeight;
        
        this.axThick = 1;
        if(!this.container) {
            return null;
        }
    };

    ChartAxes.prototype = {
        init: function() {

        },

        styles: {
            axTextColor: 'rgb(121,121,121)',
            axColor: 'rgb(154,154,154)',
            axIndiColor: 'rgb(226,226,226)',
            unitFont: '14px Arial',
            axFont: '12px Arial',
        },

        getInstance: function() {
            var contHeight = this.container.height();
            var contWidth = this.container.width();

            var canvasHeight = this.axLmt + this.unitHeight + 2 * this.axSpare;
            this.axOrigin = {
                x: this.xAxLeft,
                y: this.axLmt + this.unitHeight + this.axSpare,
            };

            this.axesLmt = {
                x: contWidth - this.xAxLeft + this.axSpare,
                y: this.axLmt + 2 * this.axSpare,
            };

            this.axRect = {
                width: contWidth,
                height: canvasHeight,
            };
            var axCanvas = document.createElement('canvas');
         
            jQuery(axCanvas).attr({
                height: this.axRect.height,
                width: this.axRect.width,
            }).css({
                zIndex: 1,
            });

            var ctx = axCanvas.getContext('2d');

            ctx.fillStyle = this.styles.axTextColor;
            ctx.font = this.styles.unitFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.unit, this.xAxLeft, Math.ceil(this.unitHeight / 2));

            ctx.lineWidth = this.axThick;
            ctx.moveTo(this.xTrans(0), this.yTrans(0 - this.axSpare));
            ctx.lineTo(this.xTrans(0), this.yTrans(this.axLmt + this.axSpare));

            ctx.moveTo(this.xTrans(0 - this.axSpare), this.yTrans(0));
            ctx.lineTo(this.xTrans(this.axesLmt.x - this.axSpare), this.yTrans(0));

            ctx.stokeStyle = this.styles.axColor;
            ctx.stroke();

            var indiNum = Math.floor(this.axLmt / this.axStep);
            this.iLabels = [];
            this.iLabelsUnfixed = [];
            for (var i = 1; i <= indiNum; i++) {
                ctx.moveTo(this.xTrans(0), this.yTrans(i * this.axStep));
                ctx.lineTo(this.xTrans(this.axesLmt.x - this.axSpare), this.yTrans(i * this.axStep));
                ctx.font = this.styles.axFont;
                ctx.textAlign = 'right';
                var iLabel = i * this.axStep;
                if(typeof this.pointWeight !== 'undefined'){
                    iLabel *= this.pointWeight;
                }
                if(typeof this.division !== 'undefined'){
                    iLabel /= this.division;
                }
                if(typeof this.maxLmt !== 'undefined' && iLabel > this.maxLmt){
                    continue;
                }
                if(typeof this.minLmt !== 'undefined' && iLabel < this.minLmt){
                    continue;
                }
                
                var prevLabelValue = this.iLabelsUnfixed[this.iLabelsUnfixed.length - 1];
                if(typeof this.minStep !== 'undefined' && (iLabel - prevLabelValue) < this.minStep){
                    continue;
                }
            
                var iLabelUnfixed = iLabel;
                iLabel = iLabel.toFixed(this.precision);
                if(this.iLabels.indexOf(iLabel) > -1){
                    continue;
                }
                this.iLabels.push(iLabel);
                this.iLabelsUnfixed.push(iLabelUnfixed);
                ctx.fillText(iLabel, this.xTrans(-5), this.yTrans(i * this.axStep));
            }

            ctx.strokeStyle = this.styles.axIndiColor;
            ctx.stroke();
            
            return axCanvas;
        },

        getAxes: function(){
            if(this.object){
                this.object.remove();
            }
            var canvas = this.getInstance();
            this.container.prepend(canvas);
            this.object = jQuery(canvas); 
        },

        xTrans: function(axX) {
            return this.axOrigin.x + axX;
        },

        yTrans: function(axY) {
            return this.axOrigin.y - axY;
        },
        
        update: function(params){
            this.division = params && params.division;
            this.precision = params && params.precision;
            this.pointWeight = params && params.pointWeight;
            this.getAxes();
        },
    };

    // @formatter:off
}(window.JS));
// @formatter:on
